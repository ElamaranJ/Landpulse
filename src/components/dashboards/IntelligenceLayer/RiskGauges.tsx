import React, { useState, useEffect } from 'react';
import { predictRisk, fetchModelInfo, RiskPredictionFeatures } from '../../../services/api';

interface GaugeItem {
  category: string;
  label: string;
  score: number;
  badge: string;
  features: RiskPredictionFeatures;
}

const INITIAL_GAUGES: GaugeItem[] = [
  {
    category: 'Litigation Risk',
    label: 'High Court & Tribunal Stay Orders on Title',
    score: 84,
    badge: 'CRITICAL',
    features: {
      district: 'Palghar',
      stage_duration_days: 180,
      has_dispute: 1,
      objection_count: 6,
      project_category: 'Highways',
      owner_count: 8,
      area_acres: 42
    }
  },
  {
    category: 'Forest Clearance',
    label: 'MoEFCC Stage-II & Wildlife Sanctuary Clearance',
    score: 68,
    badge: 'HIGH',
    features: {
      district: 'Panna',
      stage_duration_days: 140,
      has_dispute: 0,
      objection_count: 4,
      project_category: 'Water',
      owner_count: 5,
      area_acres: 110
    }
  },
  {
    category: 'Budget Liquidity',
    label: 'Circle Rate Escalation & Solatium Budget',
    score: 42,
    badge: 'MODERATE',
    features: {
      district: 'Gautam Buddha Nagar',
      stage_duration_days: 75,
      has_dispute: 0,
      objection_count: 2,
      land_category: 'commercial',
      owner_count: 3,
      area_acres: 15
    }
  },
  {
    category: 'Rehabilitation Sync',
    label: 'Township & Resettlement Model Infrastructure',
    score: 28,
    badge: 'ON TRACK',
    features: {
      district: 'Surat',
      stage_duration_days: 35,
      has_dispute: 0,
      objection_count: 0,
      owner_count: 2,
      area_acres: 6
    }
  },
];

export const RiskGauges: React.FC = () => {
  const [gauges, setGauges] = useState<GaugeItem[]>(INITIAL_GAUGES);
  const [modelConfidence, setModelConfidence] = useState<number>(89.4);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPredictions() {
      setIsLoading(true);

      // 1. Fetch live model test accuracy
      try {
        const info = await fetchModelInfo();
        if (isMounted && info.accuracy) {
          setModelConfidence(info.accuracy);
        }
      } catch {
        // use default
      }

      // 2. Predict risk scores for each of the 4 gauge categories
      try {
        const updated = await Promise.all(
          INITIAL_GAUGES.map(async (g) => {
            try {
              const res = await predictRisk(g.features);
              let badge = res.riskLevel === 'MEDIUM' ? 'MODERATE' : res.riskLevel;
              if (res.riskScore < 35) badge = 'ON TRACK';

              return {
                ...g,
                score: res.riskScore,
                badge
              };
            } catch {
              return g;
            }
          })
        );

        if (isMounted) {
          setGauges(updated);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPredictions();

    return () => {
      isMounted = false;
    };
  }, []);

  const getRiskClass = (score: number) => {
    if (score >= 75) return 'gov-status-critical';
    if (score >= 50) return 'gov-status-high';
    if (score >= 35) return 'gov-status-current';
    return 'gov-status-on-track';
  };

  return (
    <div style={{ marginBottom: '12px' }}>
      <div className="gov-register-header">
        <div className="reg-meta">
          INTELLIGENCE LAYER &bull; NIC CORE AI &bull; MODEL CONFIDENCE: {modelConfidence.toFixed(1)}%
          {isLoading && <span style={{ marginLeft: '8px', color: '#94A3B8' }}>(updating telemetry...)</span>}
        </div>
        <div className="reg-title">AI Composite Risk Engine &amp; Predictive Telemetry</div>
        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
          RandomForest ensemble trained on multi-sector statutory milestones, High Court dockets, and revenue objections
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="gov-stage-register" style={{ tableLayout: 'fixed', width: '100%' }}>
          <colgroup>
            <col style={{ width: '170px' }} />
            <col style={{ width: '90px' }} />
            <col style={{ width: '110px' }} />
            <col style={{ width: 'auto' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ width: '170px' }}>Risk Category</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Score</th>
              <th style={{ width: '110px' }}>Risk Level</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3, 4].map((idx) => (
                <tr key={idx} style={{ opacity: 0.6 }}>
                  <td style={{ fontWeight: 700, color: '#0B3D66', verticalAlign: 'middle' }}>Loading...</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '13px', verticalAlign: 'middle' }}>-- / 100</td>
                  <td style={{ verticalAlign: 'middle' }}><span className="gov-status-current">CALCULATING</span></td>
                  <td style={{ fontSize: '12px', color: '#94A3B8', verticalAlign: 'middle' }}>Evaluating cross-ministry telemetry vector...</td>
                </tr>
              ))
            ) : (
              gauges.map((g) => (
                <tr key={g.category}>
                  <td style={{ fontWeight: 700, color: '#0B3D66', verticalAlign: 'middle' }}>{g.category}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '13px', verticalAlign: 'middle' }}>{g.score} / 100</td>
                  <td style={{ verticalAlign: 'middle' }}><span className={getRiskClass(g.score)}>{g.badge}</span></td>
                  <td style={{ fontSize: '12px', color: '#475569', verticalAlign: 'middle' }}>{g.label}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

