"""
Model Training Script for LandPulse Delay & Risk Prediction
Trains a RandomForestClassifier (for delay probability) and
a RandomForestRegressor (for days to next stage).
"""

import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, f1_score, root_mean_squared_error
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'training_data.csv')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
METRICS_PATH = os.path.join(BASE_DIR, 'data', 'model_metrics.json')
IMPORTANCE_PATH = os.path.join(BASE_DIR, 'data', 'feature_importance.json')

FEATURE_LABELS_MAP = {
    'has_dispute': 'Active ownership dispute or title contestation',
    'objection_count': 'High Section 15 citizen objection density',
    'stage_duration_days': 'Prolonged milestone delay beyond statutory limits',
    'owner_count': 'High joint-titleholder fragmentation',
    'area_acres': 'Large contiguous acreage acquisition footprint',
    'distance_from_hq_km': 'Remote site distance from sub-divisional headquarters',
    'project_category': 'Sector-specific regulatory compliance backlog',
    'district': 'District-specific revenue court litigation docket',
    'land_category': 'High-density or commercial land valuation dispute'
}

def train():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Training data not found at {DATA_PATH}. Run generate_data.py first.")

    os.makedirs(MODELS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(METRICS_PATH), exist_ok=True)

    print("Loading synthetic training dataset...")
    df = pd.read_csv(DATA_PATH)

    feature_cols = [
        'stage_duration_days', 'district', 'project_category',
        'objection_count', 'has_dispute', 'land_category',
        'area_acres', 'owner_count', 'distance_from_hq_km'
    ]

    X_raw = df[feature_cols]
    y_class = df['is_delayed']
    y_reg = df['days_to_next_stage']

    # One-hot encode categorical features
    categorical_cols = ['district', 'project_category', 'land_category']
    X = pd.get_dummies(X_raw, columns=categorical_cols, drop_first=False)
    encoded_columns = list(X.columns)

    # Train/Test Split
    X_train, X_test, y_train_cls, y_test_cls, y_train_reg, y_test_reg = train_test_split(
        X, y_class, y_reg, test_size=0.2, random_state=42, stratify=y_class
    )

    print(f"Training set: {len(X_train)} rows | Test set: {len(X_test)} rows")

    # 1. Train Classifier
    print("Training RandomForestClassifier for delay risk...")
    clf = RandomForestClassifier(n_estimators=120, max_depth=10, min_samples_leaf=2, random_state=42)
    clf.fit(X_train, y_train_cls)

    y_pred_cls = clf.predict(X_test)
    accuracy = float(accuracy_score(y_test_cls, y_pred_cls))
    f1 = float(f1_score(y_test_cls, y_pred_cls))

    print(f"Classifier Accuracy: {accuracy * 100:.2f}% | F1-Score: {f1:.4f}")

    # 2. Train Regressor
    print("Training RandomForestRegressor for days to next stage...")
    reg = RandomForestRegressor(n_estimators=100, max_depth=10, min_samples_leaf=2, random_state=42)
    reg.fit(X_train, y_train_reg)

    y_pred_reg = reg.predict(X_test)
    rmse = float(root_mean_squared_error(y_test_reg, y_pred_reg))
    print(f"Regressor RMSE: {rmse:.2f} days")

    # Feature importances
    importances = clf.feature_importances_
    feat_imp = sorted(zip(encoded_columns, importances), key=lambda x: x[1], reverse=True)

    # Group importances back to base features
    base_importances = {}
    for col, imp in feat_imp:
        base_name = col.split('_')[0] if any(col.startswith(p) for p in ['district_', 'project_category_', 'land_category_']) else col
        if col.startswith('project_category_'):
            base_name = 'project_category'
        elif col.startswith('district_'):
            base_name = 'district'
        elif col.startswith('land_category_'):
            base_name = 'land_category'
        base_importances[base_name] = base_importances.get(base_name, 0.0) + float(imp)

    sorted_base = sorted(base_importances.items(), key=lambda x: x[1], reverse=True)
    top_factors = [FEATURE_LABELS_MAP.get(k, k) for k, _ in sorted_base[:5]]

    metrics = {
        'model_name': 'RandomForest (Ensemble)',
        'accuracy_pct': round(accuracy * 100, 1),
        'f1_score': round(f1, 4),
        'rmse_days': round(rmse, 1),
        'test_samples': len(X_test),
        'top_risk_factors': top_factors,
        'base_feature_importances': {k: round(v, 4) for k, v in sorted_base}
    }

    with open(METRICS_PATH, 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=2)

    with open(IMPORTANCE_PATH, 'w', encoding='utf-8') as f:
        json.dump({'columns': encoded_columns, 'factors': top_factors}, f, indent=2)

    # Save models and schema
    joblib.dump(clf, os.path.join(MODELS_DIR, 'delay_classifier.pkl'))
    joblib.dump(reg, os.path.join(MODELS_DIR, 'delay_regressor.pkl'))
    joblib.dump({
        'columns': encoded_columns,
        'categorical_cols': categorical_cols,
        'feature_cols': feature_cols,
        'feature_labels_map': FEATURE_LABELS_MAP
    }, os.path.join(MODELS_DIR, 'encoder.pkl'))

    print("Saved trained models and encoder to 'ml/models/'.")
    print(f"Saved metrics to '{METRICS_PATH}'.")

if __name__ == '__main__':
    train()
