import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import { ModalProvider } from './context/ModalContext';
import { LocaleProvider } from './context/LocaleContext';
import { GovShell } from './components/layout/GovShell';
import { GovPortalHome } from './components/dashboards/GovPortal/GovPortalHome';
import { CommandCenterDashboard } from './components/dashboards/CommandCenter';
import { CitizenDashboard } from './components/dashboards/Citizen';
import { FieldOfficerDashboard } from './components/dashboards/FieldOfficer';
import { OfficerInspectionDashboard } from './components/dashboards/FieldOfficer/OfficerInspectionDashboard';
import { DistrictOfficerDashboard } from './components/dashboards/DistrictOfficer';
import { IntelligenceLayerDashboard } from './components/dashboards/IntelligenceLayer';
import { ActsRulesView } from './components/dashboards/ActsRules/ActsRulesView';
import { RTIView } from './components/dashboards/RTI/RTIView';
import { WhosWhoView } from './components/dashboards/WhosWho/WhosWhoView';
import { GovLoginView } from './components/dashboards/Auth/GovLoginView';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <RoleProvider>
          <ModalProvider>
            <LocaleProvider>
              <GovShell>
                <Routes>
                  <Route path="/" element={<GovPortalHome />} />
                  <Route path="/login" element={<GovLoginView />} />
                  <Route path="/command-center" element={<CommandCenterDashboard />} />
                  <Route path="/citizen" element={<CitizenDashboard />} />
                  <Route path="/field-officer" element={<FieldOfficerDashboard />} />
                  <Route path="/officer/inspections" element={<OfficerInspectionDashboard />} />
                  <Route path="/field-officer/inspections" element={<OfficerInspectionDashboard />} />
                  <Route path="/district-officer" element={<DistrictOfficerDashboard />} />
                  <Route path="/intelligence" element={<IntelligenceLayerDashboard />} />
                  <Route path="/acts" element={<ActsRulesView />} />
                  <Route path="/rti" element={<RTIView />} />
                  <Route path="/whoswho" element={<WhosWhoView />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </GovShell>
            </LocaleProvider>
          </ModalProvider>
        </RoleProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};


export default App;
