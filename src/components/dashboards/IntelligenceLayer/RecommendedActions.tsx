import React, { useState, useEffect } from 'react';
import { MOCK_RISK_ITEMS } from '../../../data/mockData';
import { RiskEngineItem } from '../../../types';
import { predictRisk, RiskPredictionFeatures } from '../../../services/api';
import { CheckCircle2 } from 'lucide-react';

const PROJECT_FEATURES: Record<string, RiskPredictionFeatures> = {
  'PRJ-2024-EDFC-DANK': {
    district: 'Hooghly',
    project_category: 'Railways',
    has_dispute: 1,
    objection_count: 7,
    stage_duration_days: 195,
    owner_count: 9,
    area_acres: 65,
    land_category: 'agricultural'
  },
  'PRJ-2024-KEN-BETWA': {
    district: 'Panna',
    project_category: 'Water',
    has_dispute: 0,
    objection_count: 5,
    stage_duration_days: 145,
    owner_count: 5,
    area_acres: 120,
    land_category: 'agricultural'
  },
  'PRJ-2024-JEWAR-AIR': {
    district: 'Gautam Buddha Nagar',
    project_category: 'Aviation',
    has_dispute: 1,
    objection_count: 3,
    stage_duration_days: 85,
    owner_count: 4,
    area_acres: 28,
    land_category: 'commercial'
  },
  'PRJ-2024-DEL-MUM': {
    district: 'Palghar',
    project_category: 'Highways',
    has_dispute: 0,
    objection_count: 1,
    stage_duration_days: 45,
    owner_count: 2,
    area_acres: 16,
    land_category: 'agricultural'
  },
};

export const RecommendedActions: React.FC = () => {
  const [riskItems, setRiskItems] = useState<RiskEngineItem[]>(MOCK_RISK_ITEMS);
  const [intervenedIds, setIntervenedIds] = useState<string[]>(['RSK-003']);
  const [isPredicting, setIsPredicting] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadModelPredictions() {
      setIsPredicting(true);

      try {
        const updatedItems = await Promise.all(
          MOCK_RISK_ITEMS.map(async (item) => {
            const features = PROJECT_FEATURES[item.projectId] || {
              stage_duration_days: 90,
              district: item.state,
              objection_count: 2,
              has_dispute: item.compositeRisk > 60 ? 1 : 0
            };

            try {
              const res = await predictRisk(features);
              const topFactor = res.topFactors?.[0] || 'Milestone delay beyond statutory limit';

              return {
                ...item,
                compositeRisk: res.riskScore,
                predictedDelayMonths: res.predictedDelayMonths,
                recommendedIntervention: `Issue fast-track administrative order — top risk factor: ${topFactor}`
              };
            } catch {
              return item;
            }
          })
        );

        if (isMounted) {
          setRiskItems(updatedItems);
        }
      } finally {
        if (isMounted) {
          setIsPredicting(false);
        }
      }
    }

    loadModelPredictions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleIntervene = (id: string) => {
    setIntervenedIds((prev) => [...prev, id]);
  };

  const totalCapitalAtRisk = riskItems.reduce((acc, item) => acc + item.financialImpactCr, 0);

  return (
    <div style={{ marginBottom: '12px' }}>
      <div className="gov-section-divider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
        <span className="section-label">
          PRESCRIPTIVE ADMINISTRATIVE INTERVENTIONS &amp; FAST-TRACK DIRECTIVES
          {isPredicting && <span style={{ marginLeft: '8px', color: '#94A3B8', fontSize: '10px' }}>(scoring via ML...)</span>}
        </span>
        <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 700 }}>
          Estimated Capital at Risk: ₹{totalCapitalAtRisk.toLocaleString('en-IN')} Cr
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="gov-stage-register" style={{ tableLayout: 'fixed', width: '100%', minWidth: '1060px' }}>
          <colgroup>
            <col style={{ width: '80px' }} />
            <col style={{ width: 'auto' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '95px' }} />
            <col style={{ width: '80px' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '260px' }} />
            <col style={{ width: '125px' }} />
            <col style={{ width: '90px' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Project</th>
              <th style={{ width: '100px' }}>State</th>
              <th style={{ width: '95px', textAlign: 'center' }}>Risk Score</th>
              <th style={{ width: '80px' }}>Delay</th>
              <th style={{ width: '100px', textAlign: 'right' }}>Impact ₹</th>
              <th style={{ width: '260px' }}>Model Prescribed Intervention</th>
              <th style={{ width: '125px', textAlign: 'center' }}>Dispatch Status</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {riskItems.map((item) => {
              const isDone = intervenedIds.includes(item.id);
              const riskClass = item.compositeRisk > 75 ? 'gov-status-critical' : item.compositeRisk > 50 ? 'gov-status-high' : 'gov-status-current';

              return (
                <tr key={item.id} style={isDone ? { backgroundColor: '#F0FDF4' } : undefined}>
                  <td style={{ fontWeight: 700, fontSize: '13px', verticalAlign: 'middle' }}>{item.id}</td>
                  <td style={{ verticalAlign: 'middle' }}>
                    <strong style={{ color: '#0B3D66', fontSize: '14.5px' }}>{item.projectName}</strong>
                  </td>
                  <td style={{ fontSize: '14px', verticalAlign: 'middle' }}>{item.state}</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <span className={riskClass}>{item.compositeRisk}/100</span>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '14px', verticalAlign: 'middle' }}>+{item.predictedDelayMonths}m</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '14px', verticalAlign: 'middle' }}>₹{item.financialImpactCr} Cr</td>
                  <td style={{ fontSize: '13px', color: '#475569', verticalAlign: 'middle' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '250px' }} title={item.recommendedIntervention}>
                      {item.recommendedIntervention}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    {isDone ? (
                      <span className="gov-status-completed" style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle2 style={{ width: '14px', height: '14px' }} /> Dispatched
                      </span>
                    ) : (
                      <span className="gov-status-critical" style={{ fontSize: '12px' }}>
                        Pending Order
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    {isDone ? (
                      <span style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>Issued</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleIntervene(item.id)}
                        className="gov-flat-btn gov-flat-btn-primary"
                        style={{ fontSize: '12px', padding: '4px 10px', height: '26px' }}
                      >
                        Intervene
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
