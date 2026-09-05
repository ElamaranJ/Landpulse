import React from 'react';
import { User, Phone, Mail, MapPin } from 'lucide-react';

export const WhosWhoView: React.FC = () => {
  const officers = [
    {
      name: 'Shri Shivraj Singh Chouhan',
      designation: "Hon'ble Union Minister of Rural Development and Land Resources",
      office: 'Krishi Bhawan, New Delhi',
      email: 'minister.rd@gov.in',
      phone: '011-23383370',
      category: 'Union Minister',
    },
    {
      name: 'Dr. Chandra Sekhar Pemmasani',
      designation: "Hon'ble Minister of State for Rural Development",
      office: 'Krishi Bhawan, New Delhi',
      email: 'mos-rd@gov.in',
      phone: '011-23382348',
      category: 'Minister of State',
    },
    {
      name: 'Dr. S. K. Verma, IAS',
      designation: 'Secretary, Department of Land Resources (DoLR)',
      office: 'NBO Building, Nirman Bhawan, New Delhi',
      email: 'sec-dolr@nic.in',
      phone: '011-23061248',
      category: 'Secretariat Leadership',
    },
    {
      name: 'Shri Amitabh Kant, IAS (Retd.)',
      designation: 'Special Nodal Advisor — PM GatiShakti Land Integration',
      office: 'Cabinet Secretariat / NITI Aayog',
      email: 'advisor-gatishakti@gov.in',
      phone: '011-23096500',
      category: 'National Advisory',
    },
    {
      name: 'Smt. Ananya Deshmukh, IAS',
      designation: 'Joint Secretary (Land Acquisition & RFCTLARR Implementation)',
      office: 'DoLR, Nirman Bhawan, New Delhi',
      email: 'js-larr@nic.in',
      phone: '011-23063412',
      category: 'Secretariat Leadership',
    },
    {
      name: 'Shri Pravin R. Patil, IAS',
      designation: 'Special Land Acquisition Officer (SLAO) & Dy. Collector, Palghar Circle',
      office: 'District Collectorate, Palghar, Maharashtra',
      email: 'slao.palghar@maharashtra.gov.in',
      phone: '02525-252102',
      category: 'State Competent Authority',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="nic-card p-4">
        <div className="border-b-2 border-[#F5821F] pb-2 mb-3">
          <h2 className="text-base font-bold text-[#0B3D66] uppercase tracking-wide flex items-center gap-2">
            <User className="w-5 h-5 text-[#F5821F]" />
            Who's Who — Ministry Leadership & Competent Authorities
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Directory of key statutory authorities, central leadership, and nodal land acquisition officers across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {officers.map((off, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-300 rounded flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase font-mono block mb-1">
                  {off.category}
                </span>
                <h3 className="font-bold text-sm text-[#0B3D66]">{off.name}</h3>
                <p className="text-xs text-slate-700 font-medium mt-0.5 leading-tight">{off.designation}</p>
                <p className="text-[11px] text-slate-500 mt-1">{off.office}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1 font-mono">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[#0B3D66]" />
                  <span className="text-[#0B3D66] font-semibold">{off.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-[#0B3D66]" />
                  <span>{off.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
