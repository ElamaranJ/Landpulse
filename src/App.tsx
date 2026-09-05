import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { GovShell } from './components/layout/GovShell';
import { GovPortalHome } from './components/dashboards/GovPortal/GovPortalHome';
import { CommandCenterDashboard } from './components/dashboards/CommandCenter';
import { CitizenDashboard } from './components/dashboards/Citizen';
import { FieldOfficerDashboard } from './components/dashboards/FieldOfficer';
import { DistrictOfficerDashboard } from './components/dashboards/DistrictOfficer';
import { IntelligenceLayerDashboard } from './components/dashboards/IntelligenceLayer';
import { ActsRulesView } from './components/dashboards/ActsRules/ActsRulesView';
import { RTIView } from './components/dashboards/RTI/RTIView';
import { WhosWhoView } from './components/dashboards/WhosWho/WhosWhoView';
import { GovLoginView } from './components/dashboards/Auth/GovLoginView';

const DashboardRouter: React.FC = () => {
  const { currentRole } = useRole();

  switch (currentRole) {
    case 'home':
      return <GovPortalHome />;
    case 'login':
      return <GovLoginView />;
    case 'command_center':
      return <CommandCenterDashboard />;
    case 'citizen':
      return <CitizenDashboard />;
    case 'field_officer':
      return <FieldOfficerDashboard />;
    case 'district_officer':
      return <DistrictOfficerDashboard />;
    case 'intelligence_layer':
      return <IntelligenceLayerDashboard />;
    case 'acts':
      return <ActsRulesView />;
    case 'rti':
      return <RTIView />;
    case 'whoswho':
      return <WhosWhoView />;
    default:
      return <GovPortalHome />;
  }
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <RoleProvider>
        <GovShell>
          <DashboardRouter />
        </GovShell>
      </RoleProvider>
    </ThemeProvider>
  );
};

export default App;
