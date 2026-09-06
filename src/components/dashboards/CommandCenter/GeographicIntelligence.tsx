import React, { useState } from 'react';
import { IndiaMap } from '../../common/IndiaMap';
import { MOCK_PROJECTS, MOCK_STATES } from '../../../data/mockData';
import { useRole } from '../../../context/RoleContext';
import type { Project } from '../../../types';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GeographicIntelligenceProps {
  searchTerm?: string;
  statusFilter?: string;
}

export const GeographicIntelligence: React.FC<GeographicIntelligenceProps> = ({
  searchTerm = '',
  statusFilter = 'ALL',
}) => {
  const { selectedState, setSelectedProject, setCurrentRole, projects } = useRole();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const navigate = useNavigate();

  const categories = ['ALL', 'Highways', 'Railways', 'Energy', 'Water', 'Industrial', 'Aviation'];
  const projectList = projects || MOCK_PROJECTS;

  const filteredProjects = projectList.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.code.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.corridor.toLowerCase().includes(q) ||
      p.ministry.toLowerCase().includes(q) ||
      p.districts.some((d) => d.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'ALL' ||
      p.status === statusFilter ||
      (statusFilter === 'CRITICAL' && p.status === 'critical') ||
      (statusFilter === 'ON_TRACK' && p.status === 'on_track') ||
      (statusFilter === 'IN_PROGRESS' && p.status === 'in_progress') ||
      (statusFilter === 'DELAYED' && p.status === 'delayed');

    return matchesCat && matchesSearch && matchesStatus;
  });

  const activeStateObj = MOCK_STATES.find((s) => s.id === selectedState) || MOCK_STATES[0];

  const handleDrilldownProject = (proj: Project) => {
    setSelectedProject(proj);
    setCurrentRole('district_officer');
    navigate('/district-officer');
  };

  const handleNavigateDistrict = () => {
    setCurrentRole('district_officer');
    navigate('/district-officer');
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'critical': return 'gov-status-critical';
      case 'on_track': return 'gov-status-on-track';
      case 'delayed': return 'gov-status-delayed';
      default: return 'gov-status-current';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ marginBottom: '12px' }}>
      {/* Left: India GIS Map */}
      <div className="lg:col-span-7">
        <IndiaMap />
      </div>

      {/* Right: State Summary + Projects Register */}
      <div className="lg:col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* State Facts Table */}
        <div>
          <div className="gov-section-divider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="section-label">
              STATE CADASTRE FOCUS — {activeStateObj.name} ({activeStateObj.shortCode})
            </span>
            <span className={`${activeStateObj.riskLevel === 'CRITICAL' ? 'gov-status-critical' : activeStateObj.riskLevel === 'LOW' ? 'gov-status-on-track' : 'gov-status-current'}`} style={{ fontSize: '11px' }}>
              {activeStateObj.riskLevel} RISK
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="gov-facts-table gov-facts-table-striped" style={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: '22%' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '28%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>FIELD</th>
                  <th style={{ width: '28%' }}>VALUE</th>
                  <th style={{ width: '22%' }}>FIELD</th>
                  <th style={{ width: '28%' }}>VALUE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fact-label">Acquired</td>
                  <td className="fact-value">{activeStateObj.acquiredPercent}%</td>
                  <td className="fact-label">Disbursed</td>
                  <td className="fact-value">₹{(activeStateObj.disbursedCr / 1000).toFixed(1)}k Cr</td>
                </tr>
                <tr>
                  <td className="fact-label">Families</td>
                  <td className="fact-value">{(activeStateObj.familiesCount / 1000).toFixed(0)}k</td>
                  <td className="fact-label">Flagship Corridor</td>
                  <td className="fact-value">{activeStateObj.topProject}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '6px', textAlign: 'right' }}>
            <button onClick={handleNavigateDistrict} className="gov-flat-btn gov-flat-btn-primary" style={{ fontSize: '11px' }}>
              District Ledger <ChevronRight style={{ width: '13px', height: '13px' }} />
            </button>
          </div>
        </div>

        {/* Priority Corridors Register Table */}
        <div>
          <div className="gov-section-divider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
            <span className="section-label">
              NATIONAL PRIORITY CORRIDORS ({filteredProjects.length})
            </span>
            <div style={{ display: 'flex', gap: '2px', border: '1px solid #CBD5E1', borderRadius: '2px', overflow: 'hidden' }}>
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '2px 8px', fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                    border: 'none', borderRadius: 0,
                    backgroundColor: selectedCategory === cat ? '#EA580C' : '#FFFFFF',
                    color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ maxHeight: '320px', overflowY: 'auto', overflowX: 'auto' }}>
            <table className="gov-stage-register" style={{ fontSize: '13.5px', tableLayout: 'fixed', minWidth: '580px', width: '100%' }}>
              <colgroup>
                <col style={{ width: '75px' }} />
                <col style={{ width: '160px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '75px' }} />
                <col style={{ width: '70px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ width: '75px' }}>Code</th>
                  <th style={{ width: '160px' }}>Name</th>
                  <th style={{ width: '100px' }}>Acres</th>
                  <th style={{ width: '100px' }}>Status</th>
                  <th style={{ width: '75px', textAlign: 'right' }}>₹ Cr</th>
                  <th style={{ width: '70px', textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((proj) => (
                    <tr
                      key={proj.id}
                      onClick={() => handleDrilldownProject(proj)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ fontWeight: 700, color: '#0B3D66', fontSize: '13px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{proj.code}</td>
                      <td style={{ verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={proj.name}>
                        <strong style={{ color: '#0B3D66', fontSize: '14px' }}>{proj.name}</strong>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>{proj.state}</div>
                      </td>
                      <td style={{ fontSize: '13px', verticalAlign: 'middle' }}>{proj.acquiredAcres.toLocaleString()} / {proj.totalAcres.toLocaleString()}</td>
                      <td style={{ verticalAlign: 'middle' }}><span className={getStatusClass(proj.status)}>{proj.status.replace('_', ' ')}</span></td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '13.5px', verticalAlign: 'middle' }}>₹{(proj.disbursedCr / 1000).toFixed(1)}k</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDrilldownProject(proj);
                          }}
                          className="gov-flat-btn gov-flat-btn-secondary"
                          style={{ fontSize: '12px', padding: '3px 8px', height: '24px' }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#94A3B8' }}>
                      <AlertCircle style={{ width: '16px', height: '16px', margin: '0 auto 4px', display: 'block' }} />
                      No corridors match search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
