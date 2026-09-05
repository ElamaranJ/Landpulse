import React from 'react';
import { RiskGauges } from './RiskGauges';
import { BottleneckAnalytics } from './BottleneckAnalytics';
import { RecommendedActions } from './RecommendedActions';

export const IntelligenceLayerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <RiskGauges />
      <BottleneckAnalytics />
      <RecommendedActions />
    </div>
  );
};
