import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';
import { X, ChevronDown } from 'lucide-react';

export const CompensationCalculatorModal: React.FC = () => {
  const { isModalOpen, closeModal } = useModals();

  // Inputs
  const [landArea, setLandArea] = useState<number>(2.5);
  const [landUnit, setLandUnit] = useState<'Acre' | 'Hectare' | 'SqMeter'>('Acre');
  const [circleRate, setCircleRate] = useState<number>(1850000);
  const [locationType, setLocationType] = useState<'rural_far' | 'rural_near' | 'urban'>('rural_far');
  const [structuresValuation, setStructuresValuation] = useState<number>(650000);
  const [treesValuation, setTreesValuation] = useState<number>(280000);
  const [monthsElapsed, setMonthsElapsed] = useState<number>(14);

  if (!isModalOpen('calc')) return null;

  // Rural Multiplier (First Schedule RFCTLARR 2013)
  const multiplier = locationType === 'rural_far' ? 2.0 : locationType === 'rural_near' ? 1.5 : 1.0;

  // Unit converted area in acres for calculation
  const areaInAcres = landUnit === 'Acre' ? landArea : landUnit === 'Hectare' ? landArea * 2.471 : landArea / 4046.86;

  // 1. Base Market Value
  const baseMarketValue = areaInAcres * circleRate;

  // 2. Multiplied Market Value (Sec 26)
  const multipliedMarketValue = baseMarketValue * multiplier;

  // 3. Total Assets (Sec 29)
  const totalAssets = structuresValuation + treesValuation;

  // 4. 100% Solatium (Sec 30)
  const solatiumAmount = multipliedMarketValue + totalAssets;

  // 5. 12% Additional Interest per annum on base market value from Sec 4 date to Award date (Sec 30(3))
  const annualInterestRate = 0.12;
  const additionalInterestAmount = baseMarketValue * annualInterestRate * (monthsElapsed / 12);

  // Grand Total Awardable Compensation
  const grandTotalCompensation = solatiumAmount + solatiumAmount + additionalInterestAmount;

  const formatINR = (amount: number) => {
    return '₹ ' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(amount));
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(amount));
  };

  const handleReset = () => {
    setLandArea(2.5);
    setLandUnit('Acre');
    setCircleRate(1850000);
    setLocationType('rural_far');
    setStructuresValuation(650000);
    setTreesValuation(280000);
    setMonthsElapsed(14);
  };

  const handleCalculate = () => {
    // Re-trigger calculation state or pulse feedback
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 relative my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3">
          <div>
            <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
              Compensation Calculator
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              As per RFCTLARR Act, 2013
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 italic hidden sm:inline">
              Fields marked with <span className="text-rose-500 not-italic font-bold">*</span> are mandatory
            </span>
            <button
              onClick={() => closeModal('calc')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div className="space-y-5">
              
              {/* Section 1: Land & Location Details */}
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Land &amp; Location Details</span>
                </div>

                <div className="space-y-4">
                  {/* Row: Land Area & Unit */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Land Area <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:border-[#1E4D79] focus-within:ring-1 focus-within:ring-[#1E4D79]">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={landArea}
                          onChange={(e) => setLandArea(parseFloat(e.target.value) || 0)}
                          className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white focus:outline-none"
                        />
                        <span className="px-3.5 py-2 bg-slate-50 border-l border-slate-200 text-xs text-slate-600 font-medium flex items-center select-none">
                          {landUnit === 'Acre' ? 'Acres' : landUnit === 'Hectare' ? 'Hectares' : 'Sq. M'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Unit <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={landUnit}
                          onChange={(e) => setLandUnit(e.target.value as 'Acre' | 'Hectare' | 'SqMeter')}
                          className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79] appearance-none pr-9 cursor-pointer"
                        >
                          <option value="Acre">Acres</option>
                          <option value="Hectare">Hectares</option>
                          <option value="SqMeter">Sq. Meters</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Base Circle Rate */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Base Circle Rate / Ready Reckoner (₹ per {landUnit === 'Acre' ? 'Acre' : landUnit === 'Hectare' ? 'Hectare' : 'Sq. Meter'}) <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      type="number"
                      step="10000"
                      min="0"
                      value={circleRate}
                      onChange={(e) => setCircleRate(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79]"
                    />
                  </div>

                  {/* Location & Multiplier */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Location &amp; Rural Multiplier Factor (First Schedule) <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={locationType}
                        onChange={(e) => setLocationType(e.target.value as 'rural_far' | 'rural_near' | 'urban')}
                        className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79] appearance-none pr-9 cursor-pointer"
                      >
                        <option value="rural_far">Rural Area (Distance &gt; 30 km from Urban) — 2.00×</option>
                        <option value="rural_near">Rural Area (Distance 10–30 km from Urban) — 1.50×</option>
                        <option value="urban">Urban Municipal Area — 1.00×</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Assets & Interest */}
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Assets &amp; Interest</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Structure/Building Valuation (PWD Norms) (₹)
                      </label>
                      <input
                        type="number"
                        step="5000"
                        min="0"
                        value={structuresValuation}
                        onChange={(e) => setStructuresValuation(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Trees, Timber &amp; Standing Crops (₹)
                      </label>
                      <input
                        type="number"
                        step="5000"
                        min="0"
                        value={treesValuation}
                        onChange={(e) => setTreesValuation(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79]"
                      />
                    </div>
                  </div>

                  <div className="sm:w-3/5">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Months between Sec 4 Notification and Award
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={monthsElapsed}
                      onChange={(e) => setMonthsElapsed(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79]"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-between pt-4 mt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleCalculate}
                className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Calculate Compensation
              </button>
            </div>
          </div>

          {/* Right Column: Breakdown & Summary */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            
            {/* 1. Estimated Compensation Gross Card */}
            <div className="bg-[#F0F9F2] border border-[#CDEEDB] rounded-xl p-5 sm:p-6">
              <div className="text-base font-bold text-[#1E293B]">
                Estimated Compensation (Gross)
              </div>
              <div className="text-3xl sm:text-[36px] font-extrabold text-[#0D6832] my-1.5 tracking-tight">
                {formatINR(grandTotalCompensation)}
              </div>
              <div className="text-sm font-bold text-[#1E293B]">
                Direct PFMS Transfer Amount
              </div>
              <div className="text-xs text-[#526477] mt-0.5">
                (Tax Exempt under Sec 96 RFCTLARR)
              </div>
            </div>

            {/* 2. Breakdown Table Card */}
            <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-[#F8FAFC] border-b border-slate-200 font-bold text-sm text-[#1E293B]">
                Breakdown of Statutory Valuation
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-700">
                      <th className="py-2.5 px-3 w-14 text-center font-bold">Sl. No.</th>
                      <th className="py-2.5 px-3 font-bold">Component</th>
                      <th className="py-2.5 px-3 text-right font-bold">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    <tr>
                      <td className="py-2.5 px-3 text-center text-slate-500 font-medium">1</td>
                      <td className="py-2.5 px-3 font-medium">
                        Base Market Value ({landArea} {landUnit}s @ {formatINR(circleRate).replace('₹ ', '₹')})
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">
                        {formatNumber(baseMarketValue)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-center text-slate-500 font-medium">2</td>
                      <td className="py-2.5 px-3 font-medium">
                        Rural Multiplier ({multiplier}× as per First Schedule)
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">
                        {formatNumber(multipliedMarketValue)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-center text-slate-500 font-medium">3</td>
                      <td className="py-2.5 px-3 font-medium">
                        Structures &amp; Trees (Sec 29)
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">
                        {formatNumber(totalAssets)}
                      </td>
                    </tr>
                    <tr className="bg-[#FFF9EE]">
                      <td className="py-2.5 px-3 text-center text-[#8D5B00] font-bold">4</td>
                      <td className="py-2.5 px-3 font-bold text-[#8D5B00]">
                        100% Solatium (Sec 30)
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#8D5B00]">
                        {formatNumber(solatiumAmount)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-center text-slate-500 font-medium">5</td>
                      <td className="py-2.5 px-3 font-medium">
                        12% p.a. Additional Interest ({monthsElapsed} mos)
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">
                        {formatNumber(additionalInterestAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-[#EAF2F8] px-4 py-3.5 flex items-center justify-between font-bold text-sm text-[#0F172A] border-t border-slate-200">
                <span>Total Payable via PFMS</span>
                <span className="font-bold text-base text-[#0F172A]">
                  {formatINR(grandTotalCompensation)}
                </span>
              </div>
            </div>

            {/* 3. Statutory Entitlement Norm Note */}
            <div className="bg-[#F0F6FB] border border-[#D3E4F2] rounded-xl p-4 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#1E4D79] text-white flex items-center justify-center text-xs font-serif font-bold shrink-0 mt-0.5">
                i
              </div>
              <div className="text-xs leading-relaxed text-slate-700">
                <span className="font-bold text-[#1E3A5F]">Statutory Entitlement Norm:</span>{' '}
                Under RFCTLARR 2013, rural land gets a multiplier of 1.25 to 2.00× on market value, followed by 100% solatium on all assets and 12% per annum statutory interest.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
