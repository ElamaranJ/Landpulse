"""
Flask Inference Service for LandPulse Delay & Risk Prediction Model
Runs on port 5001 with CORS enabled.
"""

import os
import sys
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

MODELS_DIR = os.path.join(BASE_DIR, 'models')
METRICS_PATH = os.path.join(BASE_DIR, 'data', 'model_metrics.json')

classifier = None
regressor = None
encoder_schema = None
model_metrics = {}

anomaly_bundle = None
anomaly_metrics = {}
ANOMALY_MODEL_PATH = os.path.join(MODELS_DIR, 'compensation_anomaly.pkl')
ANOMALY_METRICS_PATH = os.path.join(BASE_DIR, 'data', 'anomaly_metrics.json')

alignment_optimizer = None
ALIGNMENT_MODEL_PATH = os.path.join(MODELS_DIR, 'alignment_optimizer.pkl')


def load_artifacts():
    global classifier, regressor, encoder_schema, model_metrics, anomaly_bundle, anomaly_metrics, alignment_optimizer
    cls_path = os.path.join(MODELS_DIR, 'delay_classifier.pkl')
    reg_path = os.path.join(MODELS_DIR, 'delay_regressor.pkl')
    enc_path = os.path.join(MODELS_DIR, 'encoder.pkl')

    if os.path.exists(cls_path) and os.path.exists(reg_path) and os.path.exists(enc_path):
        try:
            classifier = joblib.load(cls_path)
            regressor = joblib.load(reg_path)
            encoder_schema = joblib.load(enc_path)
            print(f"[LandPulse ML] Successfully loaded trained ML models from '{MODELS_DIR}'.")
        except Exception as e:
            print(f"[LandPulse ML] LOUD WARNING: Failed to deserialize models from '{MODELS_DIR}': {e}")
            classifier = None
            regressor = None
            encoder_schema = None
    else:
        print("=" * 78)
        print(f"[LandPulse ML] LOUD WARNING: Trained models NOT found at '{MODELS_DIR}'!")
        print("[LandPulse ML] LOUD WARNING: Serving fallback predictions only.")
        print("[LandPulse ML] LOUD WARNING: Please run 'python ml/train_model.py' to train and save models.")
        print("=" * 78)
        classifier = None
        regressor = None
        encoder_schema = None

    if os.path.exists(METRICS_PATH):
        try:
            with open(METRICS_PATH, 'r', encoding='utf-8') as f:
                model_metrics = json.load(f)
        except Exception:
            model_metrics = {}
    else:
        model_metrics = {}

    # Load compensation anomaly model bundle
    if os.path.exists(ANOMALY_MODEL_PATH):
        try:
            anomaly_bundle = joblib.load(ANOMALY_MODEL_PATH)
            print(f"[LandPulse ML] Successfully loaded compensation anomaly bundle from '{ANOMALY_MODEL_PATH}'.")
        except Exception as e:
            print(f"[LandPulse ML] Warning: Failed to load anomaly bundle: {e}")
            anomaly_bundle = None
    else:
        print(f"[LandPulse ML] Anomaly model not found at '{ANOMALY_MODEL_PATH}'.")
        anomaly_bundle = None

    if os.path.exists(ANOMALY_METRICS_PATH):
        try:
            with open(ANOMALY_METRICS_PATH, 'r', encoding='utf-8') as f:
                anomaly_metrics = json.load(f)
        except Exception:
            anomaly_metrics = {}
    else:
        anomaly_metrics = {}

    # Load alignment least-cost optimizer bundle
    try:
        from route_optimizer import RouteOptimizer
        alignment_optimizer = RouteOptimizer()
        print(f"[LandPulse ML] Successfully initialized least-cost alignment optimizer from '{GRID_PATH if 'GRID_PATH' in locals() else 'landuse_grid.npz'}'.")
    except Exception as e:
        print(f"[LandPulse ML] Warning: Failed to load alignment optimizer: {e}")
        alignment_optimizer = None

# Load artifacts on start
load_artifacts()

def get_risk_level(score: int) -> str:
    if score > 75:
        return 'CRITICAL'
    elif score > 50:
        return 'HIGH'
    elif score > 25:
        return 'MEDIUM'
    return 'LOW'

def compute_case_top_factors(input_dict: dict) -> list:
    """Determine top 3 explanatory factors for this specific prediction."""
    factors = []
    has_dispute = int(input_dict.get('has_dispute', 0))
    objection_count = int(input_dict.get('objection_count', 0))
    stage_duration = int(input_dict.get('stage_duration_days', 45))
    owner_count = int(input_dict.get('owner_count', 1))
    area_acres = float(input_dict.get('area_acres', 5.0))
    project_cat = str(input_dict.get('project_category', 'Highways'))
    district = str(input_dict.get('district', ''))

    if has_dispute:
        factors.append("Active ownership dispute / Section 15 title challenge")
    if objection_count >= 3:
        factors.append(f"High citizen objection density ({objection_count} formal objections)")
    if stage_duration > 120:
        factors.append(f"Excessive milestone duration ({stage_duration} days in current stage)")
    if owner_count >= 6:
        factors.append(f"Fragmented joint titleholding ({owner_count} co-owners)")
    if area_acres > 40:
        factors.append(f"Large-scale contiguous parcel footprint ({area_acres} acres)")
    if project_cat in ['Water', 'Railways']:
        factors.append(f"Linear alignment corridor complexity ({project_cat})")
    if district in ['Palghar', 'Hooghly', 'Panna']:
        factors.append(f"District revenue court litigation docket ({district})")

    # Ensure at least 3 factors
    default_pool = [
        "Statutory joint measurement survey reconciliation backlog",
        "Circle rate vs market parity discrepancy",
        "Gram Sabha consultation quorum delay"
    ]
    for d in default_pool:
        if len(factors) >= 3:
            break
        if d not in factors:
            factors.append(d)

    return factors[:3]

def predict_single(data: dict) -> dict:
    if classifier is None or regressor is None or encoder_schema is None:
        load_artifacts()

    if classifier is None or regressor is None:
        # Fallback if models not yet trained
        return {
            "riskScore": 68,
            "riskLevel": "HIGH",
            "predictedDelayMonths": 4.2,
            "topFactors": [
                "Active ownership dispute / Section 15 title challenge",
                "High citizen objection density",
                "Statutory joint measurement survey reconciliation backlog"
            ],
            "fallback": True
        }

    # Normalize default input fields
    clean_input = {
        'stage_duration_days': int(data.get('stage_duration_days', 60)),
        'district': str(data.get('district', 'Thane')),
        'project_category': str(data.get('project_category', 'Highways')),
        'objection_count': int(data.get('objection_count', 1)),
        'has_dispute': int(data.get('has_dispute', 0)),
        'land_category': str(data.get('land_category', 'agricultural')),
        'area_acres': float(data.get('area_acres', 8.5)),
        'owner_count': int(data.get('owner_count', 3)),
        'distance_from_hq_km': float(data.get('distance_from_hq_km', 24.0))
    }

    # Transform to DataFrame
    df_single = pd.DataFrame([clean_input])
    categorical_cols = encoder_schema['categorical_cols']
    df_encoded = pd.get_dummies(df_single, columns=categorical_cols, drop_first=False)

    # Align with model trained columns
    expected_cols = encoder_schema['columns']
    for col in expected_cols:
        if col not in df_encoded.columns:
            df_encoded[col] = 0
    df_aligned = df_encoded[expected_cols]

    # Model inference
    proba = classifier.predict_proba(df_aligned)[0][1]
    risk_score = int(round(float(proba) * 100))
    risk_score = max(5, min(95, risk_score)) # Clamp between 5-95

    days = regressor.predict(df_aligned)[0]
    delay_months = round(max(0.4, float(days) / 30.0), 1)

    top_factors = compute_case_top_factors(clean_input)

    return {
        "riskScore": risk_score,
        "riskLevel": get_risk_level(risk_score),
        "predictedDelayMonths": delay_months,
        "topFactors": top_factors
    }

@app.route('/health', methods=['GET'])
def health():
    models_loaded = classifier is not None and regressor is not None
    res = {
        "status": "online" if models_loaded else "degraded",
        "service": "LandPulse ML Inference Service",
        "port": 5001,
        "modelsLoaded": models_loaded
    }
    if not models_loaded:
        res["warning"] = "Trained models not found — serving fallback predictions only. Run train_model.py first."
    return jsonify(res)

@app.route('/model-info', methods=['GET'])
def model_info():
    if not model_metrics:
        load_artifacts()

    models_loaded = classifier is not None and regressor is not None
    accuracy = model_metrics.get('accuracy_pct', 89.4)
    res = {
        "status": "online" if models_loaded else "degraded",
        "model": "RandomForest (Classifier + Regressor)",
        "accuracy": accuracy,
        "f1Score": model_metrics.get('f1_score', 0.8468),
        "rmseDays": model_metrics.get('rmse_days', 18.8),
        "topFeatures": model_metrics.get('top_risk_factors', []),
        "disclaimer": "Trained on synthetic prototype data for demonstration"
    }
    if not models_loaded:
        res["warning"] = "Trained models not found — serving fallback metrics."
    return jsonify(res)

@app.route('/predict-risk', methods=['POST'])
def predict_risk():
    try:
        body = request.get_json(force=True)
    except Exception:
        body = {}

    if isinstance(body, list):
        results = [predict_single(item) for item in body]
        return jsonify(results)
    
    result = predict_single(body)
    return jsonify(result)

def get_area_band(acres: float) -> str:
    if acres <= 2.0:
        return '0.5–2 acre band'
    elif acres <= 5.0:
        return '2–5 acre band'
    elif acres <= 15.0:
        return '5–15 acre band'
    return '>15 acre band'

def detect_anomaly_single(data: dict) -> dict:
    if anomaly_bundle is None:
        load_artifacts()

    district = str(data.get('district', 'Palghar')).strip()
    raw_cat = str(data.get('land_category', data.get('landType', data.get('category', 'agricultural')))).lower().strip()
    if 'comm' in raw_cat:
        land_category = 'commercial'
    elif 'res' in raw_cat:
        land_category = 'residential'
    else:
        land_category = 'agricultural'

    try:
        area_acres = float(data.get('area_acres', data.get('landAreaAcre', 1.0)))
    except (ValueError, TypeError):
        area_acres = 1.0
    if area_acres <= 0:
        area_acres = 1.0

    try:
        owner_count = int(data.get('owner_count', 1))
    except (ValueError, TypeError):
        owner_count = 1

    try:
        awarded_compensation_cr = float(data.get('awarded_compensation_cr', data.get('awardedCompensationCr', 0.5)))
    except (ValueError, TypeError):
        awarded_compensation_cr = 0.5

    area_band = get_area_band(area_acres)
    rate_per_acre_cr = awarded_compensation_cr / area_acres

    # Fallback if anomaly model bundle not loaded
    if anomaly_bundle is None:
        fallback_rates = {
            'Palghar': 35.0, 'Thane': 95.0, 'Surat': 60.0, 'Hooghly': 42.0,
            'Panna': 20.0, 'Gautam Buddha Nagar': 85.0, 'Raigad': 45.0, 'Ahmedabad': 80.0
        }
        cr_lakh = fallback_rates.get(district, 40.0)
        multiplier = 2.4 if land_category == 'agricultural' else 1.8
        comp_median = round((cr_lakh / 100.0) * area_acres * multiplier, 3)
        pct_dev = round(((awarded_compensation_cr - comp_median) / max(0.001, comp_median)) * 100.0, 1)
        abs_dev = abs(pct_dev)
        is_anomaly = abs_dev >= 32.0
        anomaly_score = max(5, min(98, int(abs_dev * 1.3)))
        direction = "above" if pct_dev >= 0 else "below"
        flag_reason = (
            f"{abs(pct_dev):.1f}% {direction} median for similar {land_category} parcels in {district} ({area_band})"
            if is_anomaly
            else f"Consistent with historical awards for {land_category} in {district} ({area_band})"
        )
        return {
            "anomalyScore": anomaly_score,
            "isAnomaly": is_anomaly,
            "flagReason": flag_reason,
            "comparableMedianCr": comp_median,
            "percentDeviation": pct_dev,
            "fallback": True
        }

    grouped_stats = anomaly_bundle.get('grouped_stats', {})
    iso_forest = anomaly_bundle.get('iso_forest')
    default_circle_rates = anomaly_bundle.get('default_circle_rates', {})

    key = f"{district}|{land_category}|{area_band}"
    if key in grouped_stats:
        group = grouped_stats[key]
        comparable_median_cr = group['median_compensation_cr']
    else:
        # Check district + land_category across any band
        matches = [v['median_compensation_cr'] for k, v in grouped_stats.items() if k.startswith(f"{district}|{land_category}")]
        if matches:
            comparable_median_cr = round(float(np.median(matches)), 3)
        else:
            circle_rate_lakh = default_circle_rates.get(district, 40.0)
            mult = 2.4 if land_category == 'agricultural' else 1.8
            comparable_median_cr = round((circle_rate_lakh / 100.0) * area_acres * mult, 3)

    percent_deviation = round(((awarded_compensation_cr - comparable_median_cr) / max(0.001, comparable_median_cr)) * 100.0, 1)
    abs_dev = abs(percent_deviation)

    circle_rate_lakh = float(data.get('circle_rate_lakh_acre', default_circle_rates.get(district, 40.0)))
    feat_df = pd.DataFrame([{
        'rate_per_acre_cr': rate_per_acre_cr,
        'area_acres': area_acres,
        'owner_count': owner_count,
        'circle_rate_lakh_acre': circle_rate_lakh
    }])

    is_iso_outlier = False
    iso_score_raw = 50
    if iso_forest is not None:
        try:
            pred = iso_forest.predict(feat_df)[0]
            is_iso_outlier = (pred == -1)
            df_val = float(iso_forest.decision_function(feat_df)[0])
            iso_score_raw = round(max(5, min(95, (0.25 - df_val) * 120)))
        except Exception:
            pass

    # Anomaly condition: deviation >= 32% or IsolationForest detects anomaly with >= 20% deviation
    is_anomaly = bool((abs_dev >= 32.0) or (is_iso_outlier and abs_dev >= 20.0))

    if abs_dev >= 32.0:
        anomaly_score = int(max(65, min(99, int(50 + (abs_dev * 0.9)))))
    elif is_anomaly:
        anomaly_score = int(max(60, min(80, int(iso_score_raw))))
    else:
        anomaly_score = int(max(5, min(45, int(abs_dev * 0.8))))

    direction = "above" if percent_deviation >= 0 else "below"
    if is_anomaly:
        flag_reason = f"{abs(percent_deviation):.1f}% {direction} median for similar {land_category} parcels in {district} ({area_band})"
    else:
        flag_reason = f"Consistent with historical awards for {land_category} in {district} ({area_band})"

    return {
        "anomalyScore": int(anomaly_score),
        "isAnomaly": bool(is_anomaly),
        "flagReason": str(flag_reason),
        "comparableMedianCr": float(comparable_median_cr),
        "percentDeviation": float(percent_deviation)
    }

@app.route('/detect-anomaly', methods=['GET', 'POST'])
def detect_anomaly():
    if request.method == 'GET':
        args = request.args.to_dict()
        result = detect_anomaly_single(args)
        return jsonify(result)

    try:
        body = request.get_json(force=True)
    except Exception:
        body = {}

    if isinstance(body, list):
        results = [detect_anomaly_single(item) for item in body]
        return jsonify(results)

    result = detect_anomaly_single(body)
    return jsonify(result)

def compute_alignment_fallback(origin_lat: float, origin_lng: float,
                               dest_lat: float, dest_lng: float,
                               corridor_width_m: float = 45.0) -> dict:
    """Deterministic fallback detour routing if alignment optimizer model is unmounted."""
    dlat = dest_lat - origin_lat
    dlng = dest_lng - origin_lng

    straight_path = [
        [round(float(origin_lat), 6), round(float(origin_lng), 6)],
        [round(float(origin_lat + dlat * 0.33), 6), round(float(origin_lng + dlng * 0.33), 6)],
        [round(float(origin_lat + dlat * 0.66), 6), round(float(origin_lng + dlng * 0.66), 6)],
        [round(float(dest_lat), 6), round(float(dest_lng), 6)]
    ]

    norm = max(0.0001, np.hypot(dlat, dlng))
    perp_lat = (-dlng / norm) * 0.014
    perp_lng = (dlat / norm) * 0.014

    mid_lat = (origin_lat + dest_lat) / 2.0
    mid_lng = (origin_lng + dest_lng) / 2.0

    optimized_path = [
        [round(float(origin_lat), 6), round(float(origin_lng), 6)],
        [round(float(origin_lat + dlat * 0.25 + perp_lat * 0.5), 6), round(float(origin_lng + dlng * 0.25 + perp_lng * 0.5), 6)],
        [round(float(mid_lat + perp_lat), 6), round(float(mid_lng + perp_lng), 6)],
        [round(float(origin_lat + dlat * 0.75 + perp_lat * 0.5), 6), round(float(origin_lng + dlng * 0.75 + perp_lng * 0.5), 6)],
        [round(float(dest_lat), 6), round(float(dest_lng), 6)]
    ]

    dist_km = round(float(np.hypot(dlat * 111.0, dlng * 104.0)), 2)
    opt_dist_km = round(dist_km * 1.09, 2)
    parcels_straight = max(8, int(round((dist_km * 1000.0) / 120.0)))
    parcels_opt = max(6, int(round((opt_dist_km * 1000.0) / 140.0)))
    agri_straight = round(dist_km * 4.2, 2)
    agri_opt = round(agri_straight * 0.55, 2)
    disputes_straight = max(3, int(round(dist_km * 1.2)))
    disputes_opt = max(0, int(round(disputes_straight * 0.2)))
    comp_straight = round(dist_km * 12.5, 2)
    comp_opt = round(comp_straight * 0.72, 2)
    comp_saved = round(comp_straight - comp_opt, 2)

    return {
        'straightPath': straight_path,
        'optimizedPath': optimized_path,
        'comparison': {
            'baseline': {
                'distanceKm': dist_km,
                'parcelsAffected': parcels_straight,
                'agriculturalAcresAffected': agri_straight,
                'disputedParcelsAffected': disputes_straight,
                'estimatedCompensationCr': comp_straight
            },
            'optimized': {
                'distanceKm': opt_dist_km,
                'parcelsAffected': parcels_opt,
                'agriculturalAcresAffected': agri_opt,
                'disputedParcelsAffected': disputes_opt,
                'estimatedCompensationCr': comp_opt
            },
            'parcelsSaved': parcels_straight - parcels_opt,
            'agriculturalAcresSaved': round(agri_straight - agri_opt, 2),
            'disputedParcelsAvoided': disputes_straight - disputes_opt,
            'compensationSavingsCr': comp_saved,
            'percentCompensationSaved': round((comp_saved / max(0.01, comp_straight)) * 100.0, 1),
            'lengthDeltaKm': round(opt_dist_km - dist_km, 2)
        },
        'fallback': True
    }

@app.route('/suggest-alignment', methods=['GET', 'POST'])
def suggest_alignment():
    if alignment_optimizer is None:
        load_artifacts()

    if request.method == 'GET':
        params = request.args.to_dict()
    else:
        try:
            params = request.get_json(force=True) or {}
        except Exception:
            params = {}

    try:
        origin_lat = float(params.get('originLat', params.get('origin_lat', 19.7400)))
        origin_lng = float(params.get('originLng', params.get('origin_lng', 72.7800)))
        dest_lat = float(params.get('destLat', params.get('dest_lat', 19.6800)))
        dest_lng = float(params.get('destLng', params.get('dest_lng', 72.8800)))
        corridor_width_m = float(params.get('corridorWidthM', params.get('corridor_width_m', 45.0)))
    except (ValueError, TypeError):
        origin_lat, origin_lng = 19.7400, 72.7800
        dest_lat, dest_lng = 19.6800, 72.8800
        corridor_width_m = 45.0

    # Check if coordinates are within the spatial bounding box of the raster cost surface
    bounds = alignment_optimizer.bounds if alignment_optimizer is not None else None
    in_bounds = (
        bounds is not None and
        bounds['min_lat'] <= origin_lat <= bounds['max_lat'] and
        bounds['min_lng'] <= origin_lng <= bounds['max_lng'] and
        bounds['min_lat'] <= dest_lat <= bounds['max_lat'] and
        bounds['min_lng'] <= dest_lng <= bounds['max_lng']
    )

    if alignment_optimizer is not None and in_bounds:
        try:
            result = alignment_optimizer.optimize_corridor(
                origin_lat, origin_lng, dest_lat, dest_lng, corridor_width_m
            )
            return jsonify(result)
        except Exception as e:
            print(f"[LandPulse ML] Optimization execution failed: {e}. Using fallback.")

    fallback_res = compute_alignment_fallback(origin_lat, origin_lng, dest_lat, dest_lng, corridor_width_m)
    return jsonify(fallback_res)

if __name__ == '__main__':
    print("[LandPulse ML] Starting Flask ML Service on http://127.0.0.1:5001...")
    app.run(host='0.0.0.0', port=5001, debug=False)


