import React from 'react';
import { useLocation } from 'react-router-dom';
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
import { GovInformationModals } from '../common/GovInformationModals';

interface GovShellProps {
  children: React.ReactNode;
}

export const GovShell: React.FC<GovShellProps> = ({ children }) => {
  const { currentRole } = useRole();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Dedicated standalone layout for Login page (no navbar, no standard footer)
  if (isLoginPage) {
    return (
      <div className="min-h-screen w-full flex flex-col font-sans">
        <main className="flex-1 w-full">
          {children}
        </main>
        <SiteMapPolicyModals />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F4F6F9] text-[#1E293B] flex flex-col font-sans">
      {/* 1. Official Topmost Utility Strip, Header & Navigation */}
      <GovTopBar />

      {/* 2. Main Content Workspace with Standard Government Density */}
      <main id="main-content" className="flex-1 w-full">
        {currentRole === 'home' ? (
          children
        ) : (
          <div className="gov-register-page w-full max-w-[1920px] mx-auto px-4 sm:px-8 2xl:px-14 py-4 sm:py-6">
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
      <GovInformationModals />
    </div>
  );
};

