import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';
import {
  Calculator,
  X,
  FileSpreadsheet,
  Download,
  Info,
  CheckCircle2,
  Building,
  TreeDeciduous,
  Coins,
  Scale,
  Sparkles,
} from 'lucide-react';

export const CompensationCalculatorModal: React.FC = () => {
  const { isModalOpen, closeModal } = useModals();

  // Inputs
  const [landArea, setLandArea] = useState<number>(2.5); // in Acres
  const [landUnit, setLandUnit] = useState<'Acre' | 'Hectare' | 'SqMeter'>('Acre');
  const [circleRate, setCircleRate] = useState<number>(1850000); // ₹ per acre
  const [locationType, setLocationType] = useState<'rural_far' | 'rural_near' | 'urban'>('rural_far');
  const [structuresValuation, setStructuresValuation] = useState<number>(650000);
  const [treesValuation, setTreesValuation] = useState<number>(280000);
  const [monthsElapsed, setMonthsElapsed] = useState<number>(14); // since Sec 4 notification

  if (!isModalOpen('calc')) return null;

  // Rural Multiplier (First Schedule RFCTLARR 2013)
  const multiplier = locationType === 'rural_far' ? 2.0 : locationType === 'rural_near' ? 1.5 : 1.0;

  // Unit converted area in acres for calculation
  const areaInAcres = landUnit === 'Acre' ? landArea : landUnit === 'Hectare' ? landArea * 2.471 : landArea / 4046.86;

  // Base Market Value
  const baseMarketValue = areaInAcres * circleRate;

  // Multiplied Market Value (Sec 26)
  const multipliedMarketValue = baseMarketValue * multiplier;

  // Total Assets (Sec 29)
  const totalAssets = structuresValuation + treesValuation;

  // Total Land + Assets Base
  const subTotalBeforeSolatium = multipliedMarketValue + totalAssets;

  // 100% Solatium (Sec 30)
  const solatiumAmount = subTotalBeforeSolatium;

  // 12% Additional Interest per annum on base market value from Sec 4 date to Award date (Sec 30(3))
  const annualInterestRate = 0.12;
  const additionalInterestAmount = baseMarketValue * annualInterestRate * (monthsElapsed / 12);

  // Grand Total Awardable Compensation
  const grandTotalCompensation = subTotalBeforeSolatium + solatiumAmount + additionalInterestAmount;

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Calculator className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">RFCTLARR Statutory Compensation Calculator</h2>
              <p className="text-xs text-blue-200">
                Formula compliant with Sections 26–30 &amp; First Schedule of RFCTLARR Act, 2013
              </p>
            </div>
          </div>
          <button
            onClick={() => closeModal('calc')}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Statutory Reference Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-start gap-3 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong>Statutory Entitlement Norm:</strong> Under RFCTLARR 2013, rural land gets a multiplier of <strong>1.25 to 2.00×</strong> on market value, followed by <strong>100% Solatium</strong> on all assets and <strong>12% per annum</strong> statutory interest.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Col: Parameter Inputs */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-xs font-bold text-[#0B3D66] uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4" /> 1. Land &amp; Location Parameters
              </h3>

              {/* Area */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Land Area</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={landArea}
                    onChange={(e) => setLandArea(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                  <select
                    value={landUnit}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLandUnit(e.target.value as 'Acre' | 'Hectare' | 'SqMeter')}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66]"
                  >
                    <option value="Acre">Acres</option>
                    <option value="Hectare">Hectares</option>
                    <option value="SqMeter">Sq. Meters</option>
                  </select>
                </div>
              </div>

              {/* Base Circle Rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Base Circle Rate / Ready Reckoner (₹ per {landUnit})
                </label>
                <input
                  type="number"
                  step="10000"
                  min="0"
                  value={circleRate}
                  onChange={(e) => setCircleRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] font-mono font-bold"
                />
              </div>

              {/* Multiplier / Location Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location &amp; Rural Multiplier Factor (First Schedule)
                </label>
                <select
                  value={locationType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLocationType(e.target.value as 'rural_far' | 'rural_near' | 'urban')}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] font-medium"
                >
                  <option value="rural_far">Rural Area (Distance &gt; 30 km from Urban) — 2.00× Multiplier</option>
                  <option value="rural_near">Semi-Rural / Peri-Urban Area (10–30 km) — 1.50× Multiplier</option>
                  <option value="urban">Urban Municipal Area — 1.00× Multiplier</option>
                </select>
              </div>

              <h3 className="text-xs font-bold text-[#0B3D66] uppercase tracking-wider pt-2 flex items-center gap-1.5">
                <Coins className="w-4 h-4" /> 2. Assets &amp; Interest Determination
              </h3>

              {/* Structures & Buildings */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" /> Structure/Building Valuation (PWD Norms) (₹)
                </label>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  value={structuresValuation}
                  onChange={(e) => setStructuresValuation(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] font-mono"
                />
              </div>

              {/* Trees & Standing Crops */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <TreeDeciduous className="w-3.5 h-3.5 text-slate-500" /> Trees, Timber &amp; Standing Crops (₹)
                </label>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  value={treesValuation}
                  onChange={(e) => setTreesValuation(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] font-mono"
                />
              </div>

              {/* Months elapsed for 12% interest */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Months between Sec 4 Notification and Award (12% p.a. Interest)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={monthsElapsed}
                  onChange={(e) => setMonthsElapsed(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] font-mono"
                />
              </div>
            </div>

            {/* Right Col: Statutory Breakdown Card */}
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-700 shadow-md">
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Total Awardable Compensation (Gross)
                </div>
                <div className="text-3xl font-extrabold text-white mt-1 font-mono tracking-tight">
                  {formatINR(grandTotalCompensation)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Direct PFMS Transfer Amount (Tax Exempt under Sec 96 RFCTLARR)
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-300 space-y-2.5 text-xs">
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 text-sm">
                  Statutory Valuation Breakdown
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">1. Base Market Value ({landArea} {landUnit}s @ {formatINR(circleRate)}):</span>
                  <span className="font-mono font-semibold text-slate-900">{formatINR(baseMarketValue)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">2. Rural Multiplier ({multiplier}× as per First Schedule):</span>
                  <span className="font-mono font-bold text-blue-700">{formatINR(multipliedMarketValue)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">3. Structures &amp; Trees (Sec 29):</span>
                  <span className="font-mono font-semibold text-slate-900">{formatINR(totalAssets)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100 bg-amber-50/70 px-2 rounded">
                  <span className="font-bold text-amber-900">4. 100% Solatium (Sec 30):</span>
                  <span className="font-mono font-bold text-amber-900">+{formatINR(solatiumAmount)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100 bg-emerald-50/70 px-2 rounded">
                  <span className="font-bold text-emerald-900">5. 12% p.a. Additional Interest ({monthsElapsed} mos):</span>
                  <span className="font-mono font-bold text-emerald-900">+{formatINR(additionalInterestAmount)}</span>
                </div>

                <div className="flex justify-between pt-2 text-sm font-bold text-[#0B3D66]">
                  <span>Total Payable via PFMS:</span>
                  <span className="font-mono text-base">{formatINR(grandTotalCompensation)}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Section 96: No Income Tax or Stamp Duty is deductible from this compensation award.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">Form RFCTLARR-CALC-2026</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-4 h-4" /> Print / Export Calculation Slip
            </button>
            <button
              onClick={() => closeModal('calc')}
              className="px-4 py-2 bg-[#0B3D66] hover:bg-[#072742] text-white text-xs font-bold rounded"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
