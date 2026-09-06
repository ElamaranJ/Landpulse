import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../../context/RoleContext';
import { Project, ProjectStatus } from '../../../types';
import { Parcel } from '../../../types/parcel';
import { CreateProjectForm } from './CreateProjectForm';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building2,
  ExternalLink,
  MapPin,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export const ProjectAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    addProject,
    selectedProject,
    setSelectedProject,
    currentUser,
    setCurrentRole,
  } = useRole();

  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [recentlyCreatedCode, setRecentlyCreatedCode] = useState<string | null>(null);

  // Status visual mapping (plain-text government style)
  const getStatusDisplay = (status: ProjectStatus) => {
    switch (status) {
      case 'on_track':
        return { label: 'ON TRACK', className: 'gov-status-completed' };
      case 'in_progress':
        return { label: 'IN PROGRESS', className: 'gov-status-current' };
      case 'delayed':
        return { label: 'DELAYED', className: 'gov-status-pending' };
      case 'critical':
        return { label: 'CRITICAL', className: 'gov-status-critical' };
      case 'completed':
        return { label: 'COMPLETED', className: 'gov-status-completed' };
      default:
        return { label: String(status).toUpperCase(), className: 'gov-status-pending' };
    }
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesSearch =
        !q ||
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.corridor.toLowerCase().includes(q) ||
        p.districts.some((d) => d.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesStat = selectedStatus === 'ALL' || p.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStat;
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus]);

  // Summary Metrics
  const totalAcres = useMemo(() => {
    return projects.reduce((acc, p) => acc + (p.totalAcres || 0), 0);
  }, [projects]);

  const totalBudget = useMemo(() => {
    return projects.reduce((acc, p) => acc + (p.budgetCr || 0), 0);
  }, [projects]);

  // Handle Project Creation Success
  const handleProjectCreated = (newProject: Project, parcels: Parcel[]) => {
    addProject(newProject, parcels);
    setRecentlyCreatedCode(newProject.code);
    setIsCreating(false);
  };

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-8 py-6">
      {/* 1. Header Block (Government Register Format) */}
      <div className="gov-register-header" style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #0B3D66' }}>
        <div className="reg-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            MINISTRY OF ROAD TRANSPORT &amp; HIGHWAYS / NHAI &bull; CENTRAL IMPLEMENTING AGENCY UNIT &bull; AUTH-DSC-CLASS3
          </span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0B3D66' }}>
            OFFICER: {currentUser?.name || 'Suresh Iyer, IES'} ({currentUser?.employeeId || 'NHAI-2019-0472'})
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
          <div>
            <div className="reg-title" style={{ fontSize: '18px', fontWeight: 800, color: '#0B3D66' }}>
              National Infrastructure Project Register &amp; Cadastral Intake Master
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
              Central repository for registering national infrastructure alignments, GIS parcels, and implementing agency land acquisition schedules.
            </div>
          </div>

          {!isCreating && (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="gov-flat-btn gov-flat-btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: 700 }}
            >
              <Plus style={{ width: '15px', height: '15px' }} />
              <span>Create New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner if a project was just created */}
      {recentlyCreatedCode && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '2px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12.5px',
            color: '#065F46',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#059669' }} />
            <span>
              Project <strong>{recentlyCreatedCode}</strong> successfully registered in National Master Database and synchronized with GIS cadastral cache.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRecentlyCreatedCode(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669', fontSize: '12px', fontWeight: 700 }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* If currently in Project Creation Mode, display the form */}
      {isCreating ? (
        <CreateProjectForm
          onSuccess={handleProjectCreated}
          onCancel={() => setIsCreating(false)}
        />
      ) : (
        <>
          {/* 2. Key Facts Table (Register Style) */}
          <div style={{ marginBottom: '20px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '2px' }}>
            <table className="gov-facts-table" style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
              <colgroup>
                <col style={{ width: '18%' }} />
                <col style={{ width: '32%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '32%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="th-field">METRIC</th>
                  <th className="th-value">NATIONAL STATUS</th>
                  <th className="th-field">METRIC</th>
                  <th className="th-value">NATIONAL STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="td-label">Monitored Projects</td>
                  <td className="td-value" style={{ fontWeight: 700, color: '#0B3D66' }}>
                    {projects.length} National Projects Registered
                  </td>
                  <td className="td-label">Implementing Agency</td>
                  <td className="td-value">
                    National Highways Authority of India (NHAI) / PM GatiShakti
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Total Target Acreage</td>
                  <td className="td-value" style={{ fontWeight: 700 }}>
                    {totalAcres.toLocaleString()} Acres (National Master Grid)
                  </td>
                  <td className="td-label">Cumulative Budget Allocation</td>
                  <td className="td-value" style={{ fontWeight: 700, color: '#0B3D66' }}>
                    ₹{totalBudget.toLocaleString()} Crores
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Cadastral Intake Mode</td>
                  <td className="td-value">
                    <span className="gov-status-completed">Client-side GIS Alignment Parser (.geojson &amp; .kml)</span>
                  </td>
                  <td className="td-label">Session Persistence</td>
                  <td className="td-value">
                    <span className="gov-status-current">Active &bull; In-Memory &amp; LocalStorage Cache</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3. Search & Filter Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '10px 14px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderBottom: 'none',
              borderRadius: '2px 2px 0 0',
            }}
          >
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 260px', maxWidth: '420px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search project code, name, state, district..."
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 30px',
                    fontSize: '12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '2px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                <Search
                  style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '14px',
                    height: '14px',
                    color: '#94A3B8',
                  }}
                />
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Category Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Sector:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    padding: '5px 8px',
                    fontSize: '11.5px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '2px',
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B',
                  }}
                >
                  <option value="ALL">All Sectors</option>
                  <option value="Highways">Highways</option>
                  <option value="Railways">Railways</option>
                  <option value="Energy">Energy</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Water">Water</option>
                  <option value="Aviation">Aviation</option>
                </select>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{
                    padding: '5px 8px',
                    fontSize: '11.5px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '2px',
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B',
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="on_track">On Track</option>
                  <option value="in_progress">In Progress</option>
                  <option value="delayed">Delayed</option>
                  <option value="critical">Critical</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginLeft: '6px' }}>
                Showing {filteredProjects.length} of {projects.length}
              </div>
            </div>
          </div>

          {/* 4. Projects Register Table */}
          <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '0 0 2px 2px' }}>
            <table className="gov-stage-register" style={{ fontSize: '12px', tableLayout: 'fixed', minWidth: '960px', width: '100%' }}>
              <colgroup>
                <col style={{ width: '105px' }} />
                <col style={{ width: '250px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '140px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '85px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ width: '105px' }}>Code</th>
                  <th style={{ width: '250px' }}>Project Name &amp; Corridor</th>
                  <th style={{ width: '100px' }}>State</th>
                  <th style={{ width: '140px' }}>Districts</th>
                  <th style={{ width: '90px' }}>Category</th>
                  <th style={{ width: '90px', textAlign: 'right' }}>Total Acres</th>
                  <th style={{ width: '90px', textAlign: 'right' }}>Budget (₹ Cr)</th>
                  <th style={{ width: '100px' }}>Status</th>
                  <th style={{ width: '85px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((p) => {
                    const isSelected = selectedProject?.id === p.id;
                    const statusInfo = getStatusDisplay(p.status);

                    return (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedProject(p)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#EFF6FF' : undefined,
                          borderLeft: isSelected ? '3px solid #0B3D66' : undefined,
                        }}
                      >
                        <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0B3D66', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          {p.code}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <strong style={{ color: '#0F172A', fontSize: '12.5px', display: 'block' }}>{p.name}</strong>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>{p.corridor}</span>
                        </td>
                        <td style={{ verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{p.state}</td>
                        <td style={{ verticalAlign: 'middle', fontSize: '11px', color: '#475569' }}>
                          {p.districts.join(', ')}
                        </td>
                        <td style={{ verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#1E3A8A' }}>{p.category}</span>
                        </td>
                        <td style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {p.totalAcres.toLocaleString()}
                        </td>
                        <td style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 700, color: '#0B3D66', whiteSpace: 'nowrap' }}>
                          ₹{p.budgetCr.toLocaleString()}
                        </td>
                        <td style={{ verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <span className={statusInfo.className}>{statusInfo.label}</span>
                        </td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(p);
                              setCurrentRole('command_center');
                              navigate('/command-center');
                            }}
                            className="gov-flat-btn gov-flat-btn-secondary"
                            style={{ fontSize: '10.5px', padding: '2px 8px', height: '22px' }}
                            title="Inspect in Command Center"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} style={{ padding: '36px 20px', textAlign: 'center', color: '#94A3B8' }}>
                      <AlertCircle style={{ width: '24px', height: '24px', margin: '0 auto 6px', display: 'block', color: '#CBD5E1' }} />
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#475569' }}>No registered projects match criteria</div>
                      <div style={{ fontSize: '11.5px', marginTop: '3px' }}>Try a different search query or sector filter.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
