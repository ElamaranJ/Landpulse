import React from 'react';
import { GovTopBar } from './GovTopBar';
import { GovFooter } from './GovFooter';
import { useRole } from '../../context/RoleContext';
import { CommandPalette } from './CommandPalette';
import { ExportReportModal } from '../common/ExportReportModal';
import { CompensationCalculatorModal } from '../common/CompensationCalculatorModal';
import { CaseTrackerModal } from '../common/CaseTrackerModal';
import { GrievanceModal } from '../common/GrievanceModal';
import { NotificationSearchModal } from '../common/NotificationSearchModal';
import { DGPSCadastralViewerModal } from '../common/DGPSCadastralViewerModal';
import { DigitalAwardSheetModal } from '../common/DigitalAwardSheetModal';
import { BulkLandIngestionModal } from '../common/BulkLandIngestionModal';
import { OpenDataModal } from '../common/OpenDataModal';
import { SiteMapPolicyModals } from '../common/SiteMapPolicyModals';

interface GovShellProps {
  children: React.ReactNode;
}

export const GovShell: React.FC<GovShellProps> = ({ children }) => {
  const { currentRole } = useRole();

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* 1. Official Topmost Utility Strip, Header & Navigation */}
      <GovTopBar />

      {/* 2. Main Content Workspace with Generous Breathing Room */}
      <main id="main-content" className="flex-1 w-full">
        {currentRole === 'home' ? (
          children
        ) : (
          <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 2xl:px-20 py-8 sm:py-10">
            {children}
          </div>
        )}
      </main>

      {/* 3. Official Government Footer */}
      <GovFooter />

      {/* Global Modals */}
      <CommandPalette />
      <ExportReportModal />
      <CompensationCalculatorModal />
      <CaseTrackerModal />
      <GrievanceModal />
      <NotificationSearchModal />
      <DGPSCadastralViewerModal />
      <DigitalAwardSheetModal />
      <BulkLandIngestionModal />
      <OpenDataModal />
      <SiteMapPolicyModals />
    </div>
  );
};
