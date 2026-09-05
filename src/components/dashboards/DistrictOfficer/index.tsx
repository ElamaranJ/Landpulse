import React, { useState } from 'react';
import { DistrictKPIs } from './DistrictKPIs';
import { DistrictComparisonChart } from './DistrictComparisonChart';
import { BrutalistCaseTable } from './BrutalistCaseTable';
import { CompensationDisbursementModal } from './CompensationDisbursementModal';
import { MOCK_DISTRICT_CASES } from '../../../data/mockData';
import { useRole } from '../../../context/RoleContext';

export const DistrictOfficerDashboard: React.FC = () => {
  const { setCurrentRole } = useRole();
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isDisbursementModalOpen, setIsDisbursementModalOpen] = useState(false);

  const handleOpenDisbursement = (caseItem: any) => {
    setSelectedCase(caseItem);
    setIsDisbursementModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <DistrictKPIs />
      <DistrictComparisonChart />
      <BrutalistCaseTable
        onOpenDisbursementModal={handleOpenDisbursement}
        onViewCitizenView={() => setCurrentRole('citizen')}
      />
      <CompensationDisbursementModal
        isOpen={isDisbursementModalOpen}
        onClose={() => setIsDisbursementModalOpen(false)}
        caseItem={selectedCase}
      />
    </div>
  );
};
