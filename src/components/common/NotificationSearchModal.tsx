import React, { useState } from 'react';
import { useRole } from '../../context/RoleContext';
import {
  FileText,
  X,
  Search,
  Download,
  Calendar,
  Building,
  Filter,
  ExternalLink,
  MapPin,
  CheckCircle,
} from 'lucide-react';

export const NotificationSearchModal: React.FC = () => {
  const { notificationSearchOpen, setNotificationSearchOpen } = useRole();

  const [stateFilter, setStateFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  if (!notificationSearchOpen) return null;

  const notifications = [
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
      id: 'GAZ-2026-TN-882',
      gazetteNo: 'Tamil Nadu Gazette No. 882/LA/2026',
      section: 'Section 23',
      type: 'Notice of Award & Solatium Determination',
      corridor: 'Bengaluru–Chennai Expressway (BCE)',
      district: 'Kanchipuram & Ranipet, Tamil Nadu',
      villages: 'Sriperumbudur, Walajapet (29 Parcels)',
      date: '12 Aug 2026',
      signatory: 'District Collector & CALA Kanchipuram',
      fileSize: '3.1 MB',
    },
    {
      id: 'GAZ-2026-UP-1029',
      gazetteNo: 'UP Gazette Extraordinary S.O. 1029/EDFC',
      section: 'Section 11',
      type: 'Social Impact Assessment (SIA) Exemption & Report Summary',
      corridor: 'Eastern Dedicated Freight Corridor (EDFC)',
      district: 'Prayagraj & Chandauli, Uttar Pradesh',
      villages: 'Soraon, Mughal Sarai (64 Parcels)',
      date: '04 Aug 2026',
      signatory: 'Competent Authority, Ministry of Railways',
      fileSize: '2.1 MB',
    },
  ];

  const filtered = notifications.filter((item) => {
    if (sectionFilter !== 'All' && !item.section.includes(sectionFilter)) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.gazetteNo.toLowerCase().includes(q) ||
        item.corridor.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.villages.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileText className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Statutory Gazette Notifications Search</h2>
              <p className="text-xs text-blue-200">
                Official Gazettes under Section 4(1), 11, 19 &amp; 23 of RFCTLARR Act 2013
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotificationSearchOpen(false)}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Corridor, District, Village..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66]"
            >
              <option value="All">All Statutory Sections</option>
              <option value="Section 4">Section 4(1) Preliminary Notice</option>
              <option value="Section 11">Section 11 Social Impact Assessment</option>
              <option value="Section 19">Section 19(1) Declaration Notice</option>
              <option value="Section 23">Section 23 Award Order</option>
            </select>
          </div>

          <div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66]"
            >
              <option value="All">All Priority States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="text-xs text-slate-500 font-semibold">
            Showing {filtered.length} Statutory Gazette Extra-Ordinary Notifications
          </div>

          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-blue-400 transition-colors space-y-2"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2 py-0.5 rounded font-mono">
                      {item.section}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {item.gazetteNo}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0B3D66] mt-1">{item.type}</h4>
                </div>

                <button
                  onClick={() => alert(`Downloading ${item.gazetteNo} (${item.fileSize})`)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#0B3D66]" /> Download Gazette PDF ({item.fileSize})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
                <div>
                  <span className="text-slate-400 block">Infrastructure Corridor:</span>
                  <strong>{item.corridor}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">District &amp; Villages:</span>
                  <strong>{item.district} ({item.villages})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Gazette Notified Date:</span>
                  <strong>{item.date} by {item.signatory}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Official Gazette e-Publishing System (egazette.nic.in synchronized)</span>
          <button
            onClick={() => setNotificationSearchOpen(false)}
            className="px-4 py-1.5 bg-[#0B3D66] hover:bg-[#072742] text-white text-xs font-bold rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
