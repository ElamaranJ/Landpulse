import React from 'react';
import { HeroSection } from './HeroSection';
import { NationalKPIs } from './NationalKPIs';
import { GeographicIntelligence } from './GeographicIntelligence';
import { CriticalAlertsFeed } from './CriticalAlertsFeed';

export const CommandCenterDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <HeroSection />
      <NationalKPIs />
      <GeographicIntelligence />
      <CriticalAlertsFeed />
    </div>
  );
};
