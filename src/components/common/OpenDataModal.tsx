import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';
import {
  X,
  Download,
} from 'lucide-react';

export const OpenDataModal: React.FC = () => {
  const { isModalOpen, closeModal } = useModals();
  const [selectedDataset] = useState('corridors');

  if (!isModalOpen('openData')) return null;

  const datasets = [
    {
      id: 'corridors',
      title: 'National Infrastructure Corridors Land Acquisition MIS',
      records: '1,248 Projects',
      formats: ['CSV', 'JSON', 'GeoJSON'],
      size: '14.2 MB',
      updated: '26 Aug 2026',
      description: 'Acquired acreage, rehabilitation metrics, budget allocations, and ministry-wise breakdown across all 28 states.',
    },
    {
      id: 'dbt_disbursements',
      title: 'PFMS Direct Benefit Transfer Compensation Disbursals (State-wise)',
      records: '489,200 Beneficiaries',
      formats: ['CSV', 'JSON'],
      size: '28.6 MB',
      updated: '24 Aug 2026',
      description: 'Anonymized solatium, tree/structure valuations, and rural multiplier payouts under RFCTLARR Act 2013.',
    },
    {
      id: 'dgps_boundaries',
      title: 'PM GatiShakti Cadastral Corridor Right-of-Way GIS Layers',
      records: '18,400 Boundary Polygons',
      formats: ['GeoJSON', 'Shapefile', 'KML'],
      size: '86.4 MB',
      updated: '20 Aug 2026',
      description: 'Sub-meter RTK NavIC GPS survey polygons aligned across Highways, High Speed Rail, and Dedicated Freight Corridors.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 relative my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3">
          <div>
            <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
              Open Data Portal &amp; REST APIs
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              National Data Sharing &amp; Accessibility Policy (NDSAP) • data.gov.in Synchronized
            </p>
          </div>
          <button
            onClick={() => closeModal('openData')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 mt-4">
          {/* Section 1: API Endpoint */}
          <div>
            <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <span className="font-bold text-sm text-[#1E293B]">Public REST API Endpoint (v2.4)</span>
            </div>

            <div className="bg-[#F0F6FB] border border-[#D3E4F2] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-[#1E4D79]">Official Production Endpoint</div>
                <div className="font-mono text-xs text-slate-900 font-bold mt-1 bg-white px-3 py-2 rounded-lg border border-slate-200 inline-block">
                  GET https://api.landpulse.gov.in/v2/datasets/national-mis.json
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('API Key token generated: GOV-DATA-2026-OPEN-9921')}
                className="px-6 py-2 bg-[#1E4D79] hover:bg-[#163B5F] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
              >
                Get Free API Key
              </button>
            </div>
          </div>

          {/* Section 2: Datasets */}
          <div>
            <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <span className="font-bold text-sm text-[#1E293B]">Available Open Datasets ({datasets.length})</span>
            </div>

            <div className="space-y-3">
              {datasets.map((d) => (
                <div
                  key={d.id}
                  className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-3 hover:border-[#1E4D79] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-[#1E293B]">{d.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{d.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {d.formats.map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => alert(`Downloading ${d.title} as ${fmt} (${d.size})`)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#1E4D79] text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
                    <span>Records: <strong className="text-slate-800">{d.records}</strong></span>
                    <span>•</span>
                    <span>File Size: <strong className="text-slate-800">{d.size}</strong></span>
                    <span>•</span>
                    <span>Last Updated: <strong className="text-slate-800">{d.updated}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 text-xs text-slate-500">
          <span>License: Government Open Data License - India (GODL)</span>
          <button
            type="button"
            onClick={() => closeModal('openData')}
            className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
