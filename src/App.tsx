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
import { ProjectAdminDashboard } from './components/dashboards/ProjectAdmin';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <RoleProvider>
          <ModalProvider>
            <LocaleProvider>
              <GovShell>
                <Routes>
                  {/* Public Informational Routes */}
                  <Route path="/" element={<GovPortalHome />} />
                  <Route path="/login" element={<GovLoginView />} />
                  <Route path="/acts" element={<ActsRulesView />} />
                  <Route path="/rti" element={<RTIView />} />
                  <Route path="/whoswho" element={<WhosWhoView />} />

                  {/* Protected Operational Stakeholder Routes */}
                  <Route
                    path="/command-center"
                    element={
                      <ProtectedRoute allowedRoles={['command_center']}>
                        <CommandCenterDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/citizen"
                    element={
                      <ProtectedRoute allowedRoles={['citizen']}>
                        <CitizenDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/field-officer"
                    element={
                      <ProtectedRoute allowedRoles={['field_officer']}>
                        <FieldOfficerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/officer/inspections"
                    element={
                      <ProtectedRoute allowedRoles={['officer_inspections', 'field_officer']}>
                        <OfficerInspectionDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/field-officer/inspections"
                    element={
                      <ProtectedRoute allowedRoles={['officer_inspections', 'field_officer']}>
                        <OfficerInspectionDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/district-officer"
                    element={
                      <ProtectedRoute allowedRoles={['district_officer']}>
                        <DistrictOfficerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/project-admin"
                    element={
                      <ProtectedRoute allowedRoles={['project_admin']}>
                        <ProjectAdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/intelligence"
                    element={
                      <ProtectedRoute allowedRoles={['intelligence_layer', 'command_center', 'district_officer']}>
                        <IntelligenceLayerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all Fallback */}
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
