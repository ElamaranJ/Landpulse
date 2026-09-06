"""
LandPulse ML Pipeline — A* Least-Cost Route Alignment Optimizer
Computes optimal corridor path over synthetic land-use cost surface,
minimizing agricultural acquisition, disputed parcels, and statutory compensation.
"""

import os
import json
import heapq
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
GRID_PATH = os.path.join(DATA_DIR, 'landuse_grid.npz')
META_PATH = os.path.join(DATA_DIR, 'grid_metadata.json')
MODEL_SAVE_PATH = os.path.join(MODELS_DIR, 'alignment_optimizer.pkl')

def haversine_km(lat1, lon1, lat2, lon2):
    """Compute distance in kilometers between two lat/lng coordinates."""
    R = 6371.0
    dlat = np.radians(lat2 - lat1)
    dlon = np.radians(lon2 - lon1)
    a = np.sin(dlat / 2.0)**2 + np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon / 2.0)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return R * c

class RouteOptimizer:
    def __init__(self, grid_path=GRID_PATH, meta_path=META_PATH):
        if not os.path.exists(grid_path):
            raise FileNotFoundError(f"Landuse grid not found at '{grid_path}'. Run generate_landuse_grid.py first.")

        data = np.load(grid_path)
        self.cat_grid = data['cat_grid']
        self.dispute_mask = data['dispute_mask']
        self.cost_matrix = data['cost_matrix']
        self.circle_rates = data['circle_rates']
        self.rows, self.cols = self.cost_matrix.shape

        with open(meta_path, 'r', encoding='utf-8') as f:
            self.metadata = json.load(f)

        self.bounds = self.metadata['bounds']
        self.min_lat = self.bounds['min_lat']
        self.max_lat = self.bounds['max_lat']
        self.min_lng = self.bounds['min_lng']
        self.max_lng = self.bounds['max_lng']
        self.cell_res_m = float(self.metadata.get('cell_resolution_m', 110.0))
        self.min_cost = float(np.min(self.cost_matrix))

    def coord_to_cell(self, lat: float, lng: float):
        """Map (lat, lng) to grid (row, col). Clamped within bounds."""
        lat_clamped = max(self.min_lat, min(self.max_lat, lat))
        lng_clamped = max(self.min_lng, min(self.max_lng, lng))
        r = int(round(((lat_clamped - self.min_lat) / (self.max_lat - self.min_lat)) * (self.rows - 1)))
        c = int(round(((lng_clamped - self.min_lng) / (self.max_lng - self.min_lng)) * (self.cols - 1)))
        return r, c

    def cell_to_coord(self, r: int, c: int):
        """Map grid (row, col) to (lat, lng)."""
        lat = self.min_lat + (r / (self.rows - 1)) * (self.max_lat - self.min_lat)
        lng = self.min_lng + (c / (self.cols - 1)) * (self.max_lng - self.min_lng)
        return round(float(lat), 6), round(float(lng), 6)

    def find_least_cost_path(self, start_r, start_c, end_r, end_c):
        """A* algorithm on 200x200 grid with 8-directional movements."""
        if (start_r, start_c) == (end_r, end_c):
            return [(start_r, start_c)]

        # 8 directions: (dr, dc, distance_multiplier)
        directions = [
            (-1, 0, 1.0), (1, 0, 1.0), (0, -1, 1.0), (0, 1, 1.0),
            (-1, -1, 1.4142), (-1, 1, 1.4142), (1, -1, 1.4142), (1, 1, 1.4142)
        ]

        open_set = []
        counter = 0
        h_start = np.hypot(start_r - end_r, start_c - end_c) * self.min_cost
        heapq.heappush(open_set, (h_start, counter, start_r, start_c))

        came_from = {}
        g_score = { (start_r, start_c): 0.0 }
        visited = set()

        while open_set:
            _, _, r, c = heapq.heappop(open_set)
            if (r, c) == (end_r, end_c):
                # Reconstruct path
                path = [(r, c)]
                while (r, c) in came_from:
                    r, c = came_from[(r, c)]
                    path.append((r, c))
                path.reverse()
                return path

            if (r, c) in visited:
                continue
            visited.add((r, c))

            current_g = g_score[(r, c)]

            for dr, dc, dist_mult in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < self.rows and 0 <= nc < self.cols:
                    step_cost = dist_mult * ((self.cost_matrix[r, c] + self.cost_matrix[nr, nc]) / 2.0)
                    tentative_g = current_g + step_cost

                    if tentative_g < g_score.get((nr, nc), float('inf')):
                        came_from[(nr, nc)] = (r, c)
                        g_score[(nr, nc)] = tentative_g
                        h = np.hypot(nr - end_r, nc - end_c) * self.min_cost
                        counter += 1
                        heapq.heappush(open_set, (tentative_g + h, counter, nr, nc))

        # Fallback to straight line if no path found
        return self.get_straight_line_cells(start_r, start_c, end_r, end_c)

    def get_straight_line_cells(self, start_r, start_c, end_r, end_c):
        """Bresenham / parametric straight line between two grid cells."""
        dist = int(np.hypot(start_r - end_r, start_c - end_c)) + 1
        cells = []
        for i in range(dist + 1):
            t = i / max(1, dist)
            r = int(round(start_r + t * (end_r - start_r)))
            c = int(round(start_c + t * (end_c - start_c)))
            r = max(0, min(self.rows - 1, r))
            c = max(0, min(self.cols - 1, c))
            if not cells or cells[-1] != (r, c):
                cells.append((r, c))
        return cells

    def compute_path_statistics(self, cell_path, corridor_width_m=45.0):
        """Compute comprehensive land acquisition and compensation metrics."""
        if not cell_path:
            return {}

        coords = [self.cell_to_coord(r, c) for r, c in cell_path]

        # Total distance
        total_km = 0.0
        for i in range(len(coords) - 1):
            total_km += haversine_km(coords[i][0], coords[i][1], coords[i+1][0], coords[i+1][1])

        # Corridor footprint per cell in acres
        cell_acre = (self.cell_res_m * corridor_width_m) / 4046.86

        agri_cells = 0
        dispute_cells = 0
        total_comp_lakh = 0.0
        unique_cells = list(dict.fromkeys(cell_path))

        for r, c in unique_cells:
            cat = self.cat_grid[r, c]
            is_dispute = self.dispute_mask[r, c]
            crate = self.circle_rates[r, c]

            if cat == 3: # Agricultural
                agri_cells += 1
                solatium_mult = 3.5 # 2x circle rate + solatium
            elif cat == 5: # Built-up
                solatium_mult = 4.0
            elif cat in [1, 2]: # Wasteland / govt
                solatium_mult = 1.0
            else:
                solatium_mult = 1.5

            if is_dispute:
                dispute_cells += 1
                solatium_mult += 0.8 # Litigation contingency buffer

            # Compensation for this cell segment
            cell_comp = (crate * cell_acre) * solatium_mult
            total_comp_lakh += cell_comp

        parcels_affected = int(max(1, int(round((total_km * 1000.0) / 120.0))))
        agri_acres = float(round(float(agri_cells * cell_acre), 2))
        disputed_parcels = int(max(0, int(round(dispute_cells * 0.7))))
        total_comp_cr = float(round(float(total_comp_lakh / 100.0), 2))

        return {
            'distanceKm': float(round(float(total_km), 2)),
            'parcelsAffected': int(parcels_affected),
            'agriculturalAcresAffected': float(agri_acres),
            'disputedParcelsAffected': int(disputed_parcels),
            'estimatedCompensationCr': float(total_comp_cr)
        }

    def optimize_corridor(self, origin_lat: float, origin_lng: float,
                          dest_lat: float, dest_lng: float, corridor_width_m: float = 45.0):
        """Run full least-cost optimization vs straight line baseline."""
        sr, sc = self.coord_to_cell(origin_lat, origin_lng)
        er, ec = self.coord_to_cell(dest_lat, dest_lng)

        # 1. Straight line path
        straight_cells = self.get_straight_line_cells(sr, sc, er, ec)
        straight_stats = self.compute_path_statistics(straight_cells, corridor_width_m)
        straight_path = [self.cell_to_coord(r, c) for r, c in straight_cells]

        # 2. Optimized A* least-cost path
        opt_cells = self.find_least_cost_path(sr, sc, er, ec)
        opt_stats = self.compute_path_statistics(opt_cells, corridor_width_m)
        opt_path = [self.cell_to_coord(r, c) for r, c in opt_cells]

        # Ensure endpoints exactly match user inputs
        straight_path[0] = [round(float(origin_lat), 6), round(float(origin_lng), 6)]
        straight_path[-1] = [round(float(dest_lat), 6), round(float(dest_lng), 6)]
        opt_path[0] = [round(float(origin_lat), 6), round(float(origin_lng), 6)]
        opt_path[-1] = [round(float(dest_lat), 6), round(float(dest_lng), 6)]

        # Downsample optimized path slightly if too dense (clean Leaflet rendering)
        if len(opt_path) > 70:
            step = max(1, len(opt_path) // 60)
            sampled_opt = [opt_path[0]] + opt_path[1:-1:step] + [opt_path[-1]]
            opt_path = sampled_opt

        if len(straight_path) > 50:
            step = max(1, len(straight_path) // 30)
            straight_path = [straight_path[0]] + straight_path[1:-1:step] + [straight_path[-1]]

        # Comparative savings metrics
        parcels_saved = int(max(0, straight_stats['parcelsAffected'] - opt_stats['parcelsAffected']))
        agri_saved = float(max(0.0, round(float(straight_stats['agriculturalAcresAffected'] - opt_stats['agriculturalAcresAffected']), 2)))
        disputes_avoided = int(max(0, straight_stats['disputedParcelsAffected'] - opt_stats['disputedParcelsAffected']))
        comp_savings_cr = float(max(0.0, round(float(straight_stats['estimatedCompensationCr'] - opt_stats['estimatedCompensationCr']), 2)))
        pct_savings = float(round((comp_savings_cr / max(0.01, float(straight_stats['estimatedCompensationCr']))) * 100.0, 1))

        comparison = {
            'baseline': straight_stats,
            'optimized': opt_stats,
            'parcelsSaved': parcels_saved,
            'agriculturalAcresSaved': agri_saved,
            'disputedParcelsAvoided': disputes_avoided,
            'compensationSavingsCr': comp_savings_cr,
            'percentCompensationSaved': pct_savings,
            'lengthDeltaKm': float(round(float(opt_stats['distanceKm'] - straight_stats['distanceKm']), 2))
        }

        return {
            'straightPath': straight_path,
            'optimizedPath': opt_path,
            'comparison': comparison
        }

def train_and_save_optimizer():
    os.makedirs(MODELS_DIR, exist_ok=True)
    print("Initializing RouteOptimizer and generating model bundle...")
    optimizer = RouteOptimizer()

    # Test sample route: Palghar North (19.74, 72.78) to Boisar Industrial (19.68, 72.88)
    res = optimizer.optimize_corridor(19.74, 72.78, 19.68, 72.88, 45.0)
    print(f"Sample Route Optimization Test:")
    print(f"  Straight length: {res['comparison']['baseline']['distanceKm']} km | Optimized length: {res['comparison']['optimized']['distanceKm']} km")
    print(f"  Agri acres saved: {res['comparison']['agriculturalAcresSaved']} acres")
    print(f"  Disputed parcels avoided: {res['comparison']['disputedParcelsAvoided']}")
    print(f"  Compensation savings: Rs {res['comparison']['compensationSavingsCr']} Cr ({res['comparison']['percentCompensationSaved']}%)")

    joblib.dump(optimizer, MODEL_SAVE_PATH)
    print(f"Saved RouteOptimizer model bundle to '{MODEL_SAVE_PATH}'.")

if __name__ == '__main__':
    train_and_save_optimizer()
