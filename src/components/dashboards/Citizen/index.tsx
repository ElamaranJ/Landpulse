import React, { useState } from 'react';
import { CaseOverviewCard } from './CaseOverviewCard';
import { TimelineStepper } from './TimelineStepper';
import { DocumentVault } from './DocumentVault';
import { ObjectionModal } from './ObjectionModal';
import { MOCK_CITIZEN_CASE } from '../../../data/mockData';

export const CitizenDashboard: React.FC = () => {
  const [isObjectionModalOpen, setIsObjectionModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <CaseOverviewCard onOpenObjectionModal={() => setIsObjectionModalOpen(true)} />
      <TimelineStepper stages={MOCK_CITIZEN_CASE.stages} currentStageIndex={MOCK_CITIZEN_CASE.currentStageIndex} />
      <DocumentVault documents={MOCK_CITIZEN_CASE.documents} />
      <ObjectionModal isOpen={isObjectionModalOpen} onClose={() => setIsObjectionModalOpen(false)} />
    </div>
  );
};
