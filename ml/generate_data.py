"""
=============================================================================
SYNTHETIC DATA — FOR PROTOTYPE DEMONSTRATION ONLY, NOT REAL GOVERNMENT RECORDS
=============================================================================
This script generates synthetic land-acquisition records for training and
benchmarking the LandPulse delay and risk prediction machine learning model.
The generated data simulates realistic correlations observed in infrastructure
projects (e.g. higher litigation risk correlating with high joint-titleholder
counts and Section 15 objections) with added stochastic noise.
=============================================================================
"""

import os
import random
import csv

# Realistic districts matching LandPulse project corridors
DISTRICTS = [
    'Thane', 'Palghar', 'Raigad', 'Surat', 'Navsari', 
    'Valsad', 'Ahmedabad', 'Hooghly', 'Panna', 
    'Gautam Buddha Nagar', 'Dankuni', 'Sonnagar'
]

# Project categories matching LandPulse Project['category'] union
PROJECT_CATEGORIES = [
    'Highways', 'Railways', 'Energy', 'Water', 'Industrial', 'Aviation'
]

LAND_CATEGORIES = ['agricultural', 'commercial', 'residential']

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_OUTPUT_PATH = os.path.join(BASE_DIR, 'data', 'training_data.csv')

def generate_synthetic_dataset(num_samples: int = 3200, output_path: str = None):
    if output_path is None:
        output_path = DEFAULT_OUTPUT_PATH
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    random.seed(42)

    headers = [
        'stage_duration_days',
        'district',
        'project_category',
        'objection_count',
        'has_dispute',
        'land_category',
        'area_acres',
        'owner_count',
        'distance_from_hq_km',
        'is_delayed',
        'days_to_next_stage'
    ]

    records = []
    for _ in range(num_samples):
        district = random.choice(DISTRICTS)
        project_cat = random.choice(PROJECT_CATEGORIES)
        land_cat = random.choice(LAND_CATEGORIES)

        # Baseline features
        stage_duration = random.randint(15, 300)
        has_dispute = 1 if random.random() < 0.28 else 0
        
        # Objections correlate with disputes and commercial/tribal areas
        if has_dispute:
            objection_count = random.randint(2, 10)
        else:
            objection_count = random.choices([0, 1, 2, 3, 4], weights=[0.45, 0.25, 0.15, 0.1, 0.05])[0]

        # Area and owners
        area_acres = round(random.uniform(0.5, 80.0), 2)
        if land_cat == 'agricultural':
            owner_count = random.randint(1, 14)
        elif land_cat == 'commercial':
            owner_count = random.randint(1, 6)
        else:
            owner_count = random.randint(1, 4)

        distance_km = round(random.uniform(2.0, 95.0), 1)

        # Compute realistic delay signal (with stochastic noise)
        risk_score = 0.0
        
        # Dispute is a heavy driver
        if has_dispute:
            risk_score += 0.38
        
        # Objection count impact
        if objection_count >= 5:
            risk_score += 0.30
        elif objection_count >= 3:
            risk_score += 0.18
        elif objection_count >= 1:
            risk_score += 0.08
            
        # Stage duration already lagging
        if stage_duration > 180:
            risk_score += 0.22
        elif stage_duration > 120:
            risk_score += 0.12
            
        # Joint ownership complexity
        if owner_count >= 8:
            risk_score += 0.15
        elif owner_count >= 4:
            risk_score += 0.06

        # Category specific nuances
        if project_cat in ['Water', 'Railways']:
            risk_score += 0.08
        if land_cat == 'commercial':
            risk_score += 0.07

        # Add Gaussian noise
        noise = random.gauss(0, 0.12)
        total_risk = risk_score + noise

        is_delayed = 1 if total_risk > 0.45 else 0

        # Regression target: days_to_next_stage
        base_days = 30 + (stage_duration * 0.25)
        if has_dispute:
            base_days += 110 + (objection_count * 12)
        else:
            base_days += (objection_count * 15)
            
        base_days += (owner_count * 3.5) + (area_acres * 0.4)
        base_days += random.gauss(0, 18)
        days_to_next_stage = max(10.0, round(base_days, 1))

        records.append([
            stage_duration,
            district,
            project_cat,
            objection_count,
            has_dispute,
            land_cat,
            area_acres,
            owner_count,
            distance_km,
            is_delayed,
            days_to_next_stage
        ])

    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(records)

    print(f"Generated {len(records)} synthetic records at '{output_path}'.")

if __name__ == '__main__':
    generate_synthetic_dataset()
