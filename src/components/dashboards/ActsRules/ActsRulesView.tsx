import React from 'react';
import { Download, FileText, ExternalLink, Scale, CheckCircle2 } from 'lucide-react';

export const ActsRulesView: React.FC = () => {
  const actsList = [
    {
      title: 'The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (Act No. 30 of 2013)',
      date: 'Notified: 27 September 2013 (Effective 01 Jan 2014)',
      category: 'Central Statutory Act',
      fileSize: '4.8 MB',
      sections: 'Sections 1 to 114 (10 Chapters, 4 Schedules)',
    },
    {
      title: 'RFCTLARR (Compensation, Rehabilitation and Resettlement and Development Plan) Rules, 2015',
      date: 'Published in Gazette of India: 08 August 2015',
      category: 'Statutory Central Rules',
      fileSize: '1.9 MB',
      sections: 'Procedural guidelines for Social Impact Assessment (SIA) & Solatium computation',
    },
    {
      title: 'State RFCTLARR Compliance & Direct Land Purchase Notifications (Maharashtra, Gujarat, UP, Karnataka)',
      date: 'Updated: July 2026',
      category: 'State Harmonization Circulars',
      fileSize: '6.2 MB',
      sections: 'State-specific multiplier matrices and consent award formats under Section 46',
    },
    {
      title: 'Solatium 100% Determination & Interest Multiplier Guidelines (Section 30 & 80 RFCTLARR)',
      date: 'Circular Ref: DoLR/LARR-2026/04',
      category: 'Administrative Circular',
      fileSize: '850 KB',
      sections: 'Mandatory 100% solatium calculation on market value plus asset evaluation',
    },
    {
      title: 'PM GatiShakti National Master Plan Land Acquisition Fast-Track Inter-Ministerial Protocol',
      date: 'Cabinet Secretariat Memorandum: 14 Feb 2026',
      category: 'Inter-Ministerial Protocol',
      fileSize: '2.1 MB',
      sections: 'Integrated GIS RoW alignment clearance for Multi-Modal Connectivity Projects',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="nic-card p-4">
        <div className="border-b-2 border-[#F5821F] pb-2 mb-3">
          <h2 className="text-base font-bold text-[#0B3D66] uppercase tracking-wide flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#F5821F]" />
            Statutory Acts, Rules & Government Gazette Orders
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Official legal repository governing land acquisition, compensation determination, and rehabilitation & resettlement across India.
          </p>
        </div>

        <div className="space-y-3">
          {actsList.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-300 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-slate-100 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.2 rounded bg-[#0B3D66] text-white text-[10px] font-bold font-mono">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">{item.date}</span>
                </div>
                <h3 className="font-bold text-xs text-[#0B3D66] font-sans hover:underline cursor-pointer">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">{item.sections}</p>
              </div>

              <button
                onClick={() => alert(`Downloading ${item.title} (${item.fileSize})`)}
                className="btn-nic btn-nic-primary text-xs shrink-0 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF ({item.fileSize})</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
