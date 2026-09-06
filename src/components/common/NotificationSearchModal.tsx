import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';
import { useRole } from '../../context/RoleContext';
import {
  FileText,
  X,
  Search,
  Download,
  AlertTriangle,
  CheckCheck,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const NotificationSearchModal: React.FC = () => {
  const { isModalOpen, closeModal } = useModals();
  const { alerts, unreadAlertsCount, markAsRead, markAllAsRead, setCurrentRole } = useRole();

  const [activeTab, setActiveTab] = useState<'alerts' | 'gazettes'>('alerts');
  const [stateFilter, setStateFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isModalOpen('notificationSearch')) return null;

  const gazetteNotifications = [
    {
      id: 'GAZ-2026-MH-412',
      gazetteNo: 'Extra-Ordinary Gazette S.O. 412/MH/2026',
      section: 'Section 4(1)',
      type: 'Preliminary Notification for Public Purpose Acquisition',
      corridor: 'Delhi–Mumbai Expressway (Phase IV)',
      district: 'Palghar, Maharashtra',
      villages: 'Vevoor, Manor, Dahanu (42 Parcels)',
      date: '24 Aug 2026',
      signatory: 'Special Land Acquisition Officer (CALA Palghar)',
      fileSize: '1.8 MB',
    },
    {
      id: 'GAZ-2026-GJ-1928',
      gazetteNo: 'Govt Gazette S.O. 1928(E) / Gujarat',
      section: 'Section 19(1)',
      type: 'Declaration of Acquisition and Resettlement Scheme',
      corridor: 'Mumbai–Ahmedabad High Speed Rail (Bullet Train)',
      district: 'Surat & Navsari, Gujarat',
      villages: 'Kamrej, Chikhli, Gandevi (18 Parcels)',
      date: '18 Aug 2026',
      signatory: 'Revenue Department, Govt of Gujarat',
      fileSize: '2.4 MB',
    },
    {
      id: 'GAZ-2026-TN-302',
      gazetteNo: 'Tamil Nadu Govt Gazette Extraordinary No. 302',
      section: 'Section 11(1)',
      type: 'Social Impact Assessment (SIA) Exemption & Direct Acquisition',
      corridor: 'Chennai–Bengaluru Industrial Corridor (CBIC)',
      district: 'Ranipet, Tamil Nadu',
      villages: 'Walajah, Nemili (65 Parcels)',
      date: '12 Aug 2026',
      signatory: 'District Collector & Magistrate, Ranipet',
      fileSize: '3.1 MB',
    },
    {
      id: 'GAZ-2026-UP-881',
      gazetteNo: 'UP Gazette Notification S.O. 881/2026',
      section: 'Section 23',
      type: 'Statutory Award & Determination of Solatium and Interest',
      corridor: 'Eastern Dedicated Freight Corridor (EDFC Spur)',
      district: 'Prayagraj, Uttar Pradesh',
      villages: 'Koraon, Bara (29 Parcels)',
      date: '04 Aug 2026',
      signatory: 'Competent Authority Land Acquisition (EDFC)',
      fileSize: '1.4 MB',
    },
  ];

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch =
      a.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || a.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const filteredGazettes = gazetteNotifications.filter(g => {
    const matchesSearch =
      g.corridor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.villages.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.gazetteNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = sectionFilter === 'All' || g.section.includes(sectionFilter);
    return matchesSearch && matchesSection;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 relative my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
                Notifications &amp; Alert Dispatch
              </h2>
              {unreadAlertsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-xs font-bold font-mono">
                  {unreadAlertsCount} New
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Official Statutory Gazettes &amp; Real-time Critical Project Bottleneck Alerts
            </p>
          </div>
          <button
            onClick={() => closeModal('notificationSearch')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch bar */}
        <div className="flex bg-[#EEF3F8] p-1 rounded-xl gap-1 mt-4 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-white text-[#1E3A5F] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Critical Project Alerts</span>
            {unreadAlertsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold">
                {unreadAlertsCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gazettes')}
            className={`flex-1 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'gazettes'
                ? 'bg-white text-[#1E3A5F] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-[#1E4D79]" />
            <span>Statutory Gazette Archive</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'alerts' ? "Search alerts, project, code..." : "Search corridor, district, village..."}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {activeTab === 'alerts' ? (
            <div>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79]"
              >
                <option value="All">All Severity Levels</option>
                <option value="CRITICAL">Critical (High Court / Stays)</option>
                <option value="HIGH">High (Compensation Demands)</option>
                <option value="WARNING">Warning (Tribal Consultations)</option>
              </select>
            </div>
          ) : (
            <div>
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79]"
              >
                <option value="All">All Statutory Sections</option>
                <option value="Section 4">Section 4(1) Preliminary Notice</option>
                <option value="Section 11">Section 11 Social Impact Assessment</option>
                <option value="Section 19">Section 19(1) Declaration Notice</option>
                <option value="Section 23">Section 23 Award Order</option>
              </select>
            </div>
          )}

          <div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79]"
            >
              <option value="All">All Priority States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>
        </div>

        {/* Content list */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {activeTab === 'alerts' ? (
            <>
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No alerts match your filter criteria.
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => markAsRead(alert.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      alert.isRead
                        ? 'bg-slate-50 border-slate-200 opacity-80'
                        : 'bg-white border-slate-300 shadow-2xs hover:border-[#1E4D79]'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            alert.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : alert.severity === 'HIGH'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-800">
                          ALERT #{alert.code}
                        </span>
                        <span className="text-xs text-slate-500">• {alert.project}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{alert.timestamp}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#1E293B] mt-2">{alert.message}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Location: {alert.district}, {alert.state} • Impact: ₹{alert.impactValuationCr} Cr • Delay: {alert.delayDays} days
                    </p>

                    <div className="flex flex-wrap items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Recommended: {alert.suggestedAction}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeModal('notificationSearch');
                          setCurrentRole('command_center');
                        }}
                        className="text-[#1E4D79] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open in Command Center</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <>
              {filteredGazettes.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-2 hover:border-[#1E4D79] transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#EEF3F8] text-[#1E436C] text-xs font-bold px-2 py-0.5 rounded font-mono">
                          {item.section}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-800">
                          {item.gazetteNo}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1E293B] mt-1">{item.type}</h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Downloading ${item.gazetteNo} (${item.fileSize})`)}
                      className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#1E4D79]" /> Download PDF ({item.fileSize})
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Infrastructure Corridor:</span>
                      <strong className="text-slate-800">{item.corridor}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">District &amp; Villages:</span>
                      <strong className="text-slate-800">{item.district} ({item.villages})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Gazette Notified Date:</span>
                      <strong className="text-slate-800">{item.date} by {item.signatory}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 text-xs text-slate-500">
          <span>Official Gazette &amp; PM GatiShakti Early Warning Dispatch System</span>
          <div className="flex items-center gap-3">
            {activeTab === 'alerts' && unreadAlertsCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCheck className="w-4 h-4 text-[#1E4D79]" /> Mark all as read
              </button>
            )}
            <button
              type="button"
              onClick={() => closeModal('notificationSearch')}
              className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
