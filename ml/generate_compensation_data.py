"""
=============================================================================
SYNTHETIC DATA — FOR PROTOTYPE DEMONSTRATION ONLY, NOT REAL GOVERNMENT RECORDS
=============================================================================
This script generates synthetic land-acquisition compensation award records for
training and benchmarking the LandPulse Compensation Amount Anomaly Detection model.
The generated data simulates statutory circle rates, Solatium multipliers under
RFCTLARR 2013, with ~4% deliberately injected over/under-valuation anomalies.
=============================================================================
"""

import os
import random
import csv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_OUTPUT_PATH = os.path.join(BASE_DIR, 'data', 'compensation_data.csv')

DISTRICT_CIRCLE_RATES = {
    'Thane': (65.0, 140.0),             # Lakhs per acre (min, max)
    'Palghar': (25.0, 50.0),
    'Raigad': (30.0, 65.0),
    'Surat': (45.0, 85.0),
    'Navsari': (28.0, 52.0),
    'Valsad': (22.0, 48.0),
    'Ahmedabad': (55.0, 120.0),
    'Hooghly': (32.0, 60.0),
    'Panna': (14.0, 30.0),
    'Gautam Buddha Nagar': (60.0, 130.0),
    'Dankuni': (35.0, 68.0),
    'Sonnagar': (18.0, 36.0)
}

PROJECT_CATEGORIES = ['Highways', 'Railways', 'Energy', 'Water', 'Industrial', 'Aviation']
LAND_CATEGORIES = ['agricultural', 'commercial', 'residential']

def generate_compensation_dataset(num_samples: int = 2600, output_path: str = None):
    if output_path is None:
        output_path = DEFAULT_OUTPUT_PATH
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    random.seed(101)

    headers = [
        'case_id',
        'district',
        'project_category',
        'land_category',
        'area_acres',
        'owner_count',
        'circle_rate_lakh_acre',
        'awarded_compensation_cr',
        'is_anomaly',
        'anomaly_type'
    ]

    records = []
    anomaly_count = 0

    for i in range(1, num_samples + 1):
        case_id = f"CMP-{1000 + i}"
        district = random.choice(list(DISTRICT_CIRCLE_RATES.keys()))
        project_cat = random.choice(PROJECT_CATEGORIES)
        land_cat = random.choice(LAND_CATEGORIES)

        min_rate, max_rate = DISTRICT_CIRCLE_RATES[district]
        circle_rate_lakh = round(random.uniform(min_rate, max_rate), 2)

        area_acres = round(random.uniform(0.4, 45.0), 2)
        owner_count = random.randint(1, 8)

        # Statutory Multiplier under RFCTLARR (Rural/Agri: 1.25x-1.5x factor + 100% solatium)
        if land_cat == 'agricultural':
            multiplier = random.uniform(1.8, 2.2) # including solatium & rural factor
        elif land_cat == 'residential':
            multiplier = random.uniform(2.2, 2.8)
        else: # commercial
            multiplier = random.uniform(3.0, 4.0)

        # Baseline expected compensation in Crore: (area * rate_in_lakhs * multiplier) / 100
        base_compensation_cr = (area_acres * circle_rate_lakh * multiplier) / 100.0
        base_compensation_cr += random.gauss(0, base_compensation_cr * 0.06)
        base_compensation_cr = max(0.12, round(base_compensation_cr, 3))

        # Inject ~4% deliberate anomalies
        is_anomaly = 0
        anomaly_type = 'NORMAL'

        # Outlier selection: ~4% total
        roll = random.random()
        if roll < 0.022:
            # Over-valuation anomaly (collusion / inflated award)
            inflation_factor = random.uniform(1.45, 2.2)
            awarded_compensation_cr = round(base_compensation_cr * inflation_factor, 3)
            is_anomaly = 1
            anomaly_type = 'OVER_VALUED'
            anomaly_count += 1
        elif roll < 0.042:
            # Under-valuation anomaly (severe under-award / citizen grievance)
            deflation_factor = random.uniform(0.35, 0.60)
            awarded_compensation_cr = max(0.08, round(base_compensation_cr * deflation_factor, 3))
            is_anomaly = 1
            anomaly_type = 'UNDER_VALUED'
            anomaly_count += 1
        else:
            awarded_compensation_cr = base_compensation_cr

        records.append([
            case_id,
            district,
            project_cat,
            land_cat,
            area_acres,
            owner_count,
            circle_rate_lakh,
            awarded_compensation_cr,
            is_anomaly,
            anomaly_type
        ])

    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(records)

    print(f"Generated {len(records)} synthetic compensation records at '{output_path}'.")
    print(f"Deliberate anomalies injected: {anomaly_count} ({anomaly_count / len(records) * 100:.1f}%)")

if __name__ == '__main__':
    generate_compensation_dataset()
