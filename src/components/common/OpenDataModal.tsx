import React, { useState } from 'react';
import { useRole } from '../../context/RoleContext';
import {
  Database,
  X,
  Download,
  Code,
  ExternalLink,
  CheckCircle,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from 'lucide-react';

export const OpenDataModal: React.FC = () => {
  const { openDataOpen, setOpenDataOpen } = useRole();

  const [selectedDataset, setSelectedDataset] = useState('corridors');

  if (!openDataOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Database className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">LandPulse Open Data Portal &amp; REST APIs</h2>
              <p className="text-xs text-blue-200">
                National Data Sharing and Accessibility Policy (NDSAP) • data.gov.in Synchronized
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpenDataOpen(false)}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-[#0B3D66] uppercase tracking-wider">
                Public REST API Endpoint (v2.4)
              </h3>
              <div className="font-mono text-xs text-slate-800 font-bold mt-1 bg-white px-3 py-1.5 rounded border border-slate-300">
                GET https://api.landpulse.gov.in/v2/datasets/national-mis.json
              </div>
            </div>
            <button
              onClick={() => alert('API Key token generated: GOV-DATA-2026-OPEN-9921')}
              className="px-3.5 py-1.5 bg-[#0B3D66] text-white text-xs font-bold rounded shadow-xs"
            >
              Get Free API Key
            </button>
          </div>

          {/* Dataset Catalogue */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Available Open Datasets
            </h3>

            <div className="space-y-3">
              {datasets.map((d) => (
                <div
                  key={d.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2 hover:border-blue-400 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-[#0B3D66]">{d.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{d.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {d.formats.map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => alert(`Downloading ${d.title} as ${fmt} (${d.size})`)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded border border-slate-300 flex items-center gap-1"
                        >
                          <Download className="w-3 h-3 text-[#0B3D66]" /> {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 font-mono">
                    <span>Records: <strong>{d.records}</strong></span>
                    <span>•</span>
                    <span>File Size: <strong>{d.size}</strong></span>
                    <span>•</span>
                    <span>Last Updated: <strong>{d.updated}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>License: Government Open Data License - India (GODL)</span>
          <button
            onClick={() => setOpenDataOpen(false)}
            className="px-4 py-1.5 bg-[#0B3D66] text-white font-bold rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
