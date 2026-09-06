import React from 'react';
import { RiskGauges } from './RiskGauges';
import { BottleneckAnalytics } from './BottleneckAnalytics';
import { RecommendedActions } from './RecommendedActions';
import { CompensationAnomalyPanel } from './CompensationAnomalyPanel';

export const IntelligenceLayerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <RiskGauges />
      <CompensationAnomalyPanel />
      <BottleneckAnalytics />
      <RecommendedActions />
    </div>
  );
};

