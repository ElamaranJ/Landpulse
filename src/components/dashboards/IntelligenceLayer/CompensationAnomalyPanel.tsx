import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2, Lock, ArrowUpDown, Filter } from 'lucide-react';
import { detectCompensationAnomaly, CompensationAnomalyResult } from '../../../services/api';

interface AnomalyCaseItem {
  id: string;
  surveyNo: string;
  district: string;
  village: string;
  projectName: string;
  land_category: string;
  area_acres: number;
  owner_count: number;
  awarded_compensation_cr: number;
  // Filled by model detection:
  detection?: CompensationAnomalyResult;
  status: 'PENDING_REVIEW' | 'DBT_FROZEN' | 'AUDIT_APPROVED';
}

const INITIAL_ANOMALY_CANDIDATES: AnomalyCaseItem[] = [
  {
    id: 'CAS-PLG-084',
    surveyNo: '142/3B',
    district: 'Palghar',
    village: 'Vadavali Khurd',
    projectName: 'Delhi-Mumbai Expressway (PKG-14)',
    land_category: 'agricultural',
    area_acres: 1.8,
    owner_count: 2,
    awarded_compensation_cr: 2.85, // High outlier (+390%)
    status: 'PENDING_REVIEW'
  },
  {
    id: 'CAS-GBN-112',
    surveyNo: '88/1',
    district: 'Gautam Buddha Nagar',
    village: 'Jewar Bangar',
    projectName: 'Noida International Airport Ph-II',
    land_category: 'commercial',
    area_acres: 4.2,
    owner_count: 3,
    awarded_compensation_cr: 16.40, // High outlier
    status: 'PENDING_REVIEW'
  },
  {
    id: 'CAS-HGL-049',
    surveyNo: '304/2',
    district: 'Hooghly',
    village: 'Dankuni South',
    projectName: 'Eastern Dedicated Freight Corridor',
    land_category: 'agricultural',
    area_acres: 3.5,
    owner_count: 4,
    awarded_compensation_cr: 0.65, // Under-valued outlier (-78%)
    status: 'PENDING_REVIEW'
  },
  {
    id: 'CAS-THN-201',
    surveyNo: '56/4A',
    district: 'Thane',
    village: 'Bhiwandi Logistics Node',
    projectName: 'Mumbai Trans-Harbour Logistics Spur',
    land_category: 'residential',
    area_acres: 2.1,
    owner_count: 6,
    awarded_compensation_cr: 7.90, // High outlier (+95%)
    status: 'PENDING_REVIEW'
  },
  {
    id: 'CAS-PNA-037',
    surveyNo: '19/7',
    district: 'Panna',
    village: 'Madla Sub-Basin',
    projectName: 'Ken-Betwa River Linkage Ph-I',
    land_category: 'agricultural',
    area_acres: 12.0,
    owner_count: 2,
    awarded_compensation_cr: 1.20, // Under-valued outlier
    status: 'PENDING_REVIEW'
  },
  {
    id: 'CAS-SRT-155',
    surveyNo: '94/2',
    district: 'Surat',
    village: 'Olpad Corridor',
    projectName: 'Surat-Chennai Economic Corridor',
    land_category: 'agricultural',
    area_acres: 2.5,
    owner_count: 2,
    awarded_compensation_cr: 3.75, // Normal inlier
    status: 'AUDIT_APPROVED'
  },
  {
    id: 'CAS-PLG-091',
    surveyNo: '211/1',
    district: 'Palghar',
    village: 'Dahanu Rural',
    projectName: 'Western DFC Alignment',
    land_category: 'agricultural',
    area_acres: 0.8,
    owner_count: 1,
    awarded_compensation_cr: 0.72, // Normal inlier
    status: 'AUDIT_APPROVED'
  }
];

export const CompensationAnomalyPanel: React.FC = () => {
  const [cases, setCases] = useState<AnomalyCaseItem[]>(INITIAL_ANOMALY_CANDIDATES);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterAnomaliesOnly, setFilterAnomaliesOnly] = useState<boolean>(true);
  const [selectedCase, setSelectedCase] = useState<AnomalyCaseItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function evaluateCases() {
      setLoading(true);
      try {
        const scoredCases = await Promise.all(
          INITIAL_ANOMALY_CANDIDATES.map(async (c) => {
            try {
              const res = await detectCompensationAnomaly({
                district: c.district,
                land_category: c.land_category,
                area_acres: c.area_acres,
                owner_count: c.owner_count,
                awarded_compensation_cr: c.awarded_compensation_cr
              });
              return { ...c, detection: res };
            } catch {
              return c;
            }
          })
        );

        if (isMounted) {
          // Sort by anomalyScore descending
          scoredCases.sort((a, b) => {
            const scoreA = a.detection?.anomalyScore ?? 0;
            const scoreB = b.detection?.anomalyScore ?? 0;
            return scoreB - scoreA;
          });
          setCases(scoredCases);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    evaluateCases();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAction = (id: string, action: 'DBT_FROZEN' | 'AUDIT_APPROVED') => {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: action } : c))
    );
  };

  const displayedCases = filterAnomaliesOnly
    ? cases.filter((c) => c.detection?.isAnomaly)
    : cases;

  const totalAnomalies = cases.filter((c) => c.detection?.isAnomaly).length;
  const totalExcessCr = cases
    .filter((c) => c.detection?.isAnomaly)
    .reduce((acc, c) => {
      const devCr = Math.abs(c.awarded_compensation_cr - (c.detection?.comparableMedianCr ?? c.awarded_compensation_cr));
      return acc + devCr;
    }, 0);

  return (
    <div style={{ marginBottom: '12px' }}>
      {/* Header Section */}
      <div className="gov-section-divider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="section-label">
            RFCTLARR 2013 STATUTORY AUDIT: COMPENSATION VALUATION ANOMALY REGISTER
          </span>
          {loading && (
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
              (Evaluating baseline parity...)
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px' }}>
          <span style={{ color: '#DC2626', fontWeight: 700 }}>
            FLAGGED ANOMALIES: {totalAnomalies} PARCELS
          </span>
          <span style={{ color: '#0B3D66', fontWeight: 700 }}>
            DISCREPANCY EXPOSURE: ₹{totalExcessCr.toFixed(2)} Cr
          </span>
          <button
            onClick={() => setFilterAnomaliesOnly(!filterAnomaliesOnly)}
            className="gov-flat-btn gov-flat-btn-secondary"
            style={{ fontSize: '11px', padding: '2px 8px', height: '22px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Filter style={{ width: '11px', height: '11px' }} />
            {filterAnomaliesOnly ? 'Showing Outliers Only' : 'Showing All Screened'}
          </button>
        </div>
      </div>

      {/* Main Register Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="gov-stage-register" style={{ tableLayout: 'fixed', width: '100%' }}>
          <colgroup>
            <col style={{ width: '100px' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '90px' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '85px' }} />
            <col style={{ width: '90px' }} />
            <col style={{ width: '280px' }} />
            <col style={{ width: '130px' }} />
          </colgroup>
          <thead>
            <tr>
              <th>CASE / SURVEY</th>
              <th>LOCATION</th>
              <th>CATEGORY / AREA</th>
              <th style={{ textAlign: 'right' }}>AWARDED ₹</th>
              <th style={{ textAlign: 'right' }}>BENCHMARK ₹</th>
              <th style={{ textAlign: 'center' }}>VARIANCE</th>
              <th style={{ textAlign: 'center' }}>AUDIT RISK</th>
              <th>MODEL STATUTORY JUSTIFICATION</th>
              <th style={{ textAlign: 'center' }}>DIRECT ACTION</th>
            </tr>
          </thead>
          <tbody>
            {displayedCases.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#64748B', fontStyle: 'italic' }}>
                  No compensation valuation anomalies flagged across monitored revenue circles.
                </td>
              </tr>
            ) : (
              displayedCases.map((item) => {
                const score = item.detection?.anomalyScore ?? 0;
                const isAnomaly = item.detection?.isAnomaly ?? false;
                const devPct = item.detection?.percentDeviation ?? 0;
                const benchmarkCr = item.detection?.comparableMedianCr ?? 0;
                const isFrozen = item.status === 'DBT_FROZEN';
                const isCleared = item.status === 'AUDIT_APPROVED';

                const badgeClass = score >= 75
                  ? 'gov-status-critical'
                  : score >= 50
                  ? 'gov-status-high'
                  : 'gov-status-completed';

                return (
                  <tr
                    key={item.id}
                    style={
                      isFrozen
                        ? { backgroundColor: '#FEF2F2' }
                        : isCleared
                        ? { backgroundColor: '#F8FAFC' }
                        : undefined
                    }
                  >
                    {/* Case / Survey */}
                    <td style={{ verticalAlign: 'middle' }}>
                      <strong style={{ color: '#0B3D66', fontSize: '12px' }}>{item.id}</strong>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>#{item.surveyNo}</div>
                    </td>

                    {/* Location */}
                    <td style={{ verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, fontSize: '12px', color: '#1E293B' }}>{item.district}</div>
                      <div style={{ fontSize: '11px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.village}
                      </div>
                    </td>

                    {/* Category / Area */}
                    <td style={{ verticalAlign: 'middle', fontSize: '11.5px' }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{item.land_category}</span>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{item.area_acres} Acres ({item.owner_count} co-owners)</div>
                    </td>

                    {/* Awarded */}
                    <td style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 700, fontSize: '12.5px', color: '#0B3D66' }}>
                      ₹{item.awarded_compensation_cr.toFixed(2)} Cr
                    </td>

                    {/* Benchmark */}
                    <td style={{ textAlign: 'right', verticalAlign: 'middle', fontSize: '12px', color: '#475569' }}>
                      ₹{benchmarkCr.toFixed(3)} Cr
                    </td>

                    {/* Variance */}
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', fontWeight: 700, fontSize: '12px' }}>
                      <span style={{ color: devPct > 0 ? '#DC2626' : devPct < -20 ? '#B45309' : '#16A34A' }}>
                        {devPct > 0 ? `+${devPct.toFixed(1)}%` : `${devPct.toFixed(1)}%`}
                      </span>
                    </td>

                    {/* Audit Risk */}
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <span className={badgeClass} style={{ fontSize: '11px' }}>
                        {score}/100
                      </span>
                    </td>

                    {/* Flag Reason */}
                    <td style={{ verticalAlign: 'middle', fontSize: '11.5px', color: '#334155' }}>
                      <div
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '270px' }}
                        title={item.detection?.flagReason || 'Processing valuation benchmark...'}
                      >
                        {isAnomaly && (
                          <AlertTriangle style={{ width: '12px', height: '12px', color: '#DC2626', display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        )}
                        {item.detection?.flagReason || 'Auditing against comparable awards...'}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
                        Project: {item.projectName}
                      </div>
                    </td>

                    {/* Direct Action */}
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      {isFrozen ? (
                        <span className="gov-status-critical" style={{ fontSize: '10.5px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Lock style={{ width: '11px', height: '11px' }} /> DBT Frozen
                        </span>
                      ) : isCleared ? (
                        <span className="gov-status-completed" style={{ fontSize: '10.5px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle2 style={{ width: '11px', height: '11px' }} /> Reconciled
                        </span>
                      ) : isAnomaly ? (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => handleAction(item.id, 'DBT_FROZEN')}
                            className="gov-flat-btn gov-flat-btn-danger"
                            style={{ fontSize: '10px', padding: '2px 6px', height: '22px' }}
                            title="Freeze statutory direct benefit transfer pending revenue collector review"
                          >
                            Freeze DBT
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(item.id, 'AUDIT_APPROVED')}
                            className="gov-flat-btn gov-flat-btn-secondary"
                            style={{ fontSize: '10px', padding: '2px 6px', height: '22px' }}
                            title="Clear audit exception with recorded administrative remarks"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className="gov-status-completed" style={{ fontSize: '10.5px' }}>
                          Normal Parity
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Model Attribution Strip */}
      <div style={{
        marginTop: '6px',
        padding: '6px 12px',
        backgroundColor: '#F8FAFC',
        border: '1px solid #CBD5E1',
        borderTop: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '10.5px',
        color: '#64748B'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck style={{ width: '13px', height: '13px', color: '#0B3D66' }} />
          <span><strong>Inference Engine:</strong> Isolation Forest + Grouped Median/IQR Baseline (ml/models/compensation_anomaly.pkl)</span>
        </div>
        <div>
          <span>Evaluates: Solatium parity, Circle Rate multiples, Parcel Acreage bands &amp; Owner Fragmentation</span>
        </div>
      </div>
    </div>
  );
};
