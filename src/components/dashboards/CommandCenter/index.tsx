import React, { useState } from 'react';
import { HeroSection } from './HeroSection';
import { NationalKPIs } from './NationalKPIs';
import { GeographicIntelligence } from './GeographicIntelligence';
import { CriticalAlertsFeed } from './CriticalAlertsFeed';
import { DashboardSearchFilterBar, StatusOption } from '../../common/DashboardSearchFilterBar';
import { useDebounce } from '../../../hooks/useDebounce';
import { MOCK_PROJECTS, MOCK_CRITICAL_ALERTS } from '../../../data/mockData';

export const CommandCenterDashboard: React.FC = () => {
  // Local Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const debouncedSearch = useDebounce(searchTerm, 250);

  const statusOptions: StatusOption[] = [
    { label: 'All National Statuses', value: 'ALL' },
    { label: 'On Track', value: 'ON_TRACK' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Delayed', value: 'DELAYED' },
    { label: 'Critical Risk', value: 'CRITICAL' },
  ];

  return (
    <div className="space-y-6">
      <HeroSection />
      <NationalKPIs />

      {/* Global Dashboard Search & Filter Bar */}
      <DashboardSearchFilterBar
        title="National Project Corridor & Bottlenecks Filter"
        subtitle="Search and filter national infrastructure corridors, alerts, and state jurisdictions"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search Corridor Code, Mega Project, State, District, Ministry..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={statusOptions}
        totalCount={MOCK_PROJECTS.length + MOCK_CRITICAL_ALERTS.length}
      />

      <GeographicIntelligence
        searchTerm={debouncedSearch}
        statusFilter={statusFilter}
      />

      <CriticalAlertsFeed
        searchTerm={debouncedSearch}
        statusFilter={statusFilter}
      />
    </div>
  );
};
