"""
========================================================================================
LandPulse ML Pipeline — Synthetic Land-Use & Cadastral Cost Surface Generator
========================================================================================
STATUTORY DISCLAIMER & DATA NOTICE:
This script generates a SYNTHETIC spatial raster and cadastral cost surface representing
land categories, circle valuations, and litigation dispute clusters for demonstration
purposes within the LandPulse prototype. It does not contain authentic Survey of India
or Maharashtra Land Records Dept (BhuNaksha) revenue vector layers.
========================================================================================
"""

import os
import json
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
GRID_SAVE_PATH = os.path.join(DATA_DIR, 'landuse_grid.npz')
META_SAVE_PATH = os.path.join(DATA_DIR, 'grid_metadata.json')

# Spatial Bounding Box (Palghar & Western Economic Corridor Sector)
BOUNDS = {
    'min_lat': 19.6500,
    'max_lat': 19.8000,
    'min_lng': 72.7500,
    'max_lng': 72.9000
}

GRID_ROWS = 200
GRID_COLS = 200

# Cost mapping per land category (traversal resistance factor)
LAND_COSTS = {
    'existing_road': 0.6,       # Encourages running parallel to existing infrastructure
    'wasteland': 1.0,           # Minimal acquisition friction
    'government_land': 1.2,     # Inter-departmental transfer only
    'agricultural': 6.5,        # High RFCTLARR compensation + solatium (2x - 4x)
    'forest': 12.0,             # MoEFCC Stage-II clearance regulatory hurdle
    'built_up': 18.0,           # Dense structures requiring high demolition/rehab compensation
    'water_body': 25.0          # Environmental & bridge engineering cost
}

LAND_CATEGORIES = list(LAND_COSTS.keys())

def generate_landuse_cost_surface():
    os.makedirs(DATA_DIR, exist_ok=True)
    np.random.seed(42)

    print("Generating 200x200 synthetic land-use cost surface...")

    # 1. Base terrain: predominantly agricultural land with patches of wasteland and forest
    # Category indices: 0: existing_road, 1: wasteland, 2: government_land, 3: agricultural, 4: forest, 5: built_up, 6: water_body
    cat_grid = np.full((GRID_ROWS, GRID_COLS), 3, dtype=np.int32) # Default = agricultural

    # Wasteland & Government land corridors (North-West & South-East sectors)
    for r in range(GRID_ROWS):
        for c in range(GRID_COLS):
            # Wasteland patches
            if (r > 130 and c < 70) or (r < 60 and c > 130):
                if np.random.rand() < 0.70:
                    cat_grid[r, c] = 1 # wasteland
                elif np.random.rand() < 0.30:
                    cat_grid[r, c] = 2 # government_land

            # Forest zone (East foothills)
            if c > 165:
                if np.random.rand() < 0.85:
                    cat_grid[r, c] = 4 # forest

            # Water body / River corridor (meandering diagonal creek)
            creek_c = int(80 + 25 * np.sin(r / 20.0) + (r * 0.2))
            if abs(c - creek_c) <= 2:
                cat_grid[r, c] = 6 # water_body

            # Built-up settlements (Town centers: Boisar center & Palghar urban pocket)
            dist_to_boisar = np.hypot(r - 110, c - 90)
            if dist_to_boisar < 16 and np.random.rand() < 0.80:
                cat_grid[r, c] = 5 # built_up

            dist_to_palghar = np.hypot(r - 45, c - 70)
            if dist_to_palghar < 14 and np.random.rand() < 0.75:
                cat_grid[r, c] = 5 # built_up

    # Existing transportation road corridor (Diagonal highway ribbon from SW to NE)
    for r in range(GRID_ROWS):
        road_c = int(30 + (r * 0.75) + 6 * np.sin(r / 15.0))
        if 0 <= road_c < GRID_COLS:
            cat_grid[r, road_c] = 0 # existing_road
            if road_c + 1 < GRID_COLS and np.random.rand() < 0.5:
                cat_grid[r, road_c + 1] = 0

    # 2. Dispute Risk Mask (Litigation Stay Orders / Section 15 Hotspots)
    # Clusters in high-density disputed parcels (around Boisar fringe)
    dispute_mask = np.zeros((GRID_ROWS, GRID_COLS), dtype=np.uint8)
    for r in range(GRID_ROWS):
        for c in range(GRID_COLS):
            # Clustered dispute hotspot between rows 70-120, cols 40-110
            dist_hotspot = np.hypot(r - 95, c - 75)
            if dist_hotspot < 28 and cat_grid[r, c] in [3, 5]: # agricultural or built-up
                if np.random.rand() < 0.45:
                    dispute_mask[r, c] = 1
            elif np.random.rand() < 0.03:
                dispute_mask[r, c] = 1

    # 3. Base Traversal Cost Matrix
    cost_matrix = np.zeros((GRID_ROWS, GRID_COLS), dtype=np.float32)
    for idx, name in enumerate(LAND_CATEGORIES):
        mask = (cat_grid == idx)
        cost_matrix[mask] = LAND_COSTS[name]

    # Add dispute friction penalty (+8.0 traversal friction)
    cost_matrix += (dispute_mask * 8.0)

    # 4. Circle Rate Matrix (in Lakhs per acre)
    circle_rates = np.zeros((GRID_ROWS, GRID_COLS), dtype=np.float32)
    circle_rates[cat_grid == 0] = 45.0 # Roadside
    circle_rates[cat_grid == 1] = 15.0 # Wasteland
    circle_rates[cat_grid == 2] = 20.0 # Govt land
    circle_rates[cat_grid == 3] = 38.0 # Agricultural
    circle_rates[cat_grid == 4] = 25.0 # Forest
    circle_rates[cat_grid == 5] = 95.0 # Built-up / Commercial
    circle_rates[cat_grid == 6] = 10.0 # Water

    # Save array bundle
    np.savez_compressed(
        GRID_SAVE_PATH,
        cat_grid=cat_grid,
        dispute_mask=dispute_mask,
        cost_matrix=cost_matrix,
        circle_rates=circle_rates
    )
    print(f"Saved landuse cost grid to '{GRID_SAVE_PATH}'.")

    # Save JSON metadata
    metadata = {
        'grid_shape': [GRID_ROWS, GRID_COLS],
        'bounds': BOUNDS,
        'categories': LAND_CATEGORIES,
        'land_costs': LAND_COSTS,
        'cell_resolution_m': 110,
        'disclaimer': 'Synthetic cost surface for LandPulse route optimization demonstration.'
    }
    with open(META_SAVE_PATH, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved grid metadata to '{META_SAVE_PATH}'.")

if __name__ == '__main__':
    generate_landuse_cost_surface()
