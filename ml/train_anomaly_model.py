"""
Training Script for LandPulse Compensation Amount Anomaly Detection Model
Trains an IsolationForest model and builds robust grouped median/IQR baselines
grouped by district, land category, and acreage band.
"""

import os
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.metrics import precision_score, recall_score, f1_score
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'compensation_data.csv')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
MODEL_SAVE_PATH = os.path.join(MODELS_DIR, 'compensation_anomaly.pkl')
METRICS_PATH = os.path.join(BASE_DIR, 'data', 'anomaly_metrics.json')

def get_area_band(acres: float) -> str:
    if acres <= 2.0:
        return '0.5–2 acre band'
    elif acres <= 5.0:
        return '2–5 acre band'
    elif acres <= 15.0:
        return '5–15 acre band'
    return '>15 acre band'

def train_anomaly_model():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Compensation data not found at {DATA_PATH}. Run generate_compensation_data.py first.")

    os.makedirs(MODELS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(METRICS_PATH), exist_ok=True)

    print("Loading synthetic compensation dataset...")
    df = pd.read_csv(DATA_PATH)

    df['area_band'] = df['area_acres'].apply(get_area_band)
    df['rate_per_acre_cr'] = df['awarded_compensation_cr'] / df['area_acres']

    # 1. Build Grouped Median & IQR Lookup Table (Explainable Baseline)
    grouped_stats = {}
    for (district, land_cat, band), group in df.groupby(['district', 'land_category', 'area_band']):
        key = f"{district}|{land_cat}|{band}"
        med_comp = float(group['awarded_compensation_cr'].median())
        med_rate = float(group['rate_per_acre_cr'].median())
        q25 = float(group['awarded_compensation_cr'].quantile(0.25))
        q75 = float(group['awarded_compensation_cr'].quantile(0.75))
        iqr = max(0.01, q75 - q25)
        
        grouped_stats[key] = {
            'median_compensation_cr': round(med_comp, 3),
            'median_rate_per_acre_cr': round(med_rate, 4),
            'q25_cr': round(q25, 3),
            'q75_cr': round(q75, 3),
            'iqr_cr': round(iqr, 3),
            'sample_count': len(group)
        }

    # 2. Train Isolation Forest on numeric feature vector
    X = df[['rate_per_acre_cr', 'area_acres', 'owner_count', 'circle_rate_lakh_acre']].copy()
    
    # Train Isolation Forest with 4% expected contamination
    iso_forest = IsolationForest(
        n_estimators=150,
        contamination=0.04,
        max_samples='auto',
        random_state=42
    )
    iso_forest.fit(X)

    # Predictions (-1 = anomaly, 1 = normal)
    raw_preds = iso_forest.predict(X)
    pred_anomaly = np.where(raw_preds == -1, 1, 0)

    # Evaluate against injected labels
    y_true = df['is_anomaly'].values
    precision = float(precision_score(y_true, pred_anomaly, zero_division=0))
    recall = float(recall_score(y_true, pred_anomaly, zero_division=0))
    f1 = float(f1_score(y_true, pred_anomaly, zero_division=0))

    print(f"Isolation Forest Evaluation vs Injected Outliers:")
    print(f"  Precision: {precision * 100:.1f}% | Recall: {recall * 100:.1f}% | F1: {f1:.4f}")
    print(f"  Total Flagged: {int(np.sum(pred_anomaly))} of {len(df)} records")

    # Metrics bundle
    metrics = {
        'model_name': 'Isolation Forest + Robust Grouped Median/IQR Baseline',
        'records_trained': len(df),
        'precision_pct': round(precision * 100, 1),
        'recall_pct': round(recall * 100, 1),
        'f1_score': round(f1, 4),
        'contamination': 0.04,
        'grouped_categories_count': len(grouped_stats),
        'disclaimer': 'Trained on synthetic compensation award data'
    }

    with open(METRICS_PATH, 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=2)

    # Save Pipeline Bundle
    pipeline_bundle = {
        'iso_forest': iso_forest,
        'grouped_stats': grouped_stats,
        'feature_cols': ['rate_per_acre_cr', 'area_acres', 'owner_count', 'circle_rate_lakh_acre'],
        'default_circle_rates': {
            'Palghar': 35.0, 'Thane': 95.0, 'Surat': 60.0, 'Hooghly': 42.0,
            'Panna': 20.0, 'Gautam Buddha Nagar': 85.0, 'Raigad': 45.0, 'Ahmedabad': 80.0
        }
    }

    joblib.dump(pipeline_bundle, MODEL_SAVE_PATH)
    print(f"Saved compensation anomaly model bundle to '{MODEL_SAVE_PATH}'.")
    print(f"Saved metrics to '{METRICS_PATH}'.")

if __name__ == '__main__':
    train_anomaly_model()
