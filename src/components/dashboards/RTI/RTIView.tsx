import React from 'react';
import { FileText, ShieldCheck, Mail, Phone, ExternalLink, HelpCircle } from 'lucide-react';

export const RTIView: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Citizen's Charter Box */}
      <div className="nic-card p-4">
        <div className="border-b-2 border-[#F5821F] pb-2 mb-3">
          <h2 className="text-base font-bold text-[#0B3D66] uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#F5821F]" />
            Citizen's Charter & Service Level Agreements (SLAs)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Department of Land Resources commitment to time-bound public delivery and grievance redressal under RFCTLARR Act 2013.
          </p>
        </div>

        <table className="nic-table mb-4">
          <thead>
            <tr>
              <th>Citizen Service / Process</th>
              <th>Statutory Section</th>
              <th>Responsible Officer</th>
              <th>Mandated SLA Timeframe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-bold text-[#0B3D66]">Publication of Preliminary Notification</td>
              <td>Section 4(1)</td>
              <td>District Collector / CALA</td>
              <td className="font-bold text-emerald-800">Within 30 Days of Corridor Lock</td>
            </tr>
            <tr>
              <td className="font-bold text-[#0B3D66]">Filing & Hearing of Objections</td>
              <td>Section 15(1) & (2)</td>
              <td>Competent Authority (LA)</td>
              <td className="font-bold text-emerald-800">60 Days Window + 21 Days Hearing</td>
            </tr>
            <tr>
              <td className="font-bold text-[#0B3D66]">Final Acquisition Declaration</td>
              <td>Section 19(1)</td>
              <td>Appropriate Government (State/Centre)</td>
              <td className="font-bold text-emerald-800">Within 12 Months of Section 4(1)</td>
            </tr>
            <tr>
              <td className="font-bold text-[#0B3D66]">Compensation Award Determination</td>
              <td>Section 23 & 30</td>
              <td>Special Land Acquisition Officer (SLAO)</td>
              <td className="font-bold text-emerald-800">Within 12 Months of Section 19</td>
            </tr>
            <tr>
              <td className="font-bold text-[#0B3D66]">PFMS Direct Bank Transfer (DBT) Disbursal</td>
              <td>Section 77 PFMS Protocol</td>
              <td>Treasury / State Bank of India Gateway</td>
              <td className="font-bold text-emerald-800">Within 14 Days of Award Publish</td>
            </tr>
          </tbody>
        </table>

        {/* RTI Statutory Officers */}
        <div className="border-t border-slate-200 pt-3">
          <h3 className="text-xs font-bold text-[#0B3D66] uppercase mb-2">
            Right to Information (RTI) Statutory Designated Officers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-300 rounded">
              <span className="text-[10px] font-bold text-orange-600 uppercase block">Central Public Information Officer (CPIO)</span>
              <p className="font-bold text-[#0B3D66] mt-0.5">Shri R. K. Mahapatra, Deputy Secretary</p>
              <p className="text-slate-600 text-[11px]">Room No. 312, NBO Building, Nirman Bhawan, New Delhi - 110011</p>
              <p className="text-slate-600 text-[11px]">Email: cpio-landacq@gov.in • Phone: 011-23068940</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-300 rounded">
              <span className="text-[10px] font-bold text-orange-600 uppercase block">First Appellate Authority (FAA)</span>
              <p className="font-bold text-[#0B3D66] mt-0.5">Dr. S. K. Verma, IAS, Joint Secretary (Land Resources)</p>
              <p className="text-slate-600 text-[11px]">Department of Land Resources, Ministry of Rural Development, New Delhi</p>
              <p className="text-slate-600 text-[11px]">Email: js-landpulse@nic.in • Phone: 011-23061248</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
