import React, { useState, useMemo } from 'react';
import { DistrictKPIs } from './DistrictKPIs';
import { DistrictComparisonChart } from './DistrictComparisonChart';
import { BrutalistCaseTable } from './BrutalistCaseTable';
import { CompensationDisbursementModal } from './CompensationDisbursementModal';
import { DashboardSearchFilterBar, StatusOption } from '../../common/DashboardSearchFilterBar';
import { MOCK_DISTRICT_CASES } from '../../../data/mockData';
import { useRole } from '../../../context/RoleContext';
import { useDebounce } from '../../../hooks/useDebounce';
import { CitizenCase } from '../../../types';

export const DistrictOfficerDashboard: React.FC = () => {
  const { setCurrentRole } = useRole();
  const [selectedCase, setSelectedCase] = useState<CitizenCase | null>(null);
  const [isDisbursementModalOpen, setIsDisbursementModalOpen] = useState(false);

  // Local Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const debouncedSearch = useDebounce(searchTerm, 250);

  const statusOptions: StatusOption[] = [
    { label: 'All Statutory Statuses', value: 'ALL' },
    { label: 'Award Published', value: 'AWARDED' },
    { label: 'Possession Taken', value: 'COMPLETED' },
    { label: 'Sec 15 Objection', value: 'OBJECTION_PENDING' },
    { label: 'Pending Survey', value: 'PENDING_SURVEY' },
    { label: 'In Progress (SIA)', value: 'IN_PROGRESS' },
    { label: 'Court Stay / Delayed', value: 'DELAYED' },
  ];

  const filteredCases = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return MOCK_DISTRICT_CASES.filter((c) => {
      const matchesSearch =
        !q ||
        c.surveyNo.toLowerCase().includes(q) ||
        c.owner.toLowerCase().includes(q) ||
        c.village.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [debouncedSearch, statusFilter]);

  const handleOpenDisbursement = (caseItem: CitizenCase) => {
    setSelectedCase(caseItem);
    setIsDisbursementModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <DistrictKPIs />
      <DistrictComparisonChart />

      {/* Global Dashboard Search & Filter Bar */}
      <DashboardSearchFilterBar
        title="Palghar Division Cadastral Ledger Filter"
        subtitle="Search and filter active cases by Survey Number, Landowner, Village, or Statutory Status"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search Survey #, Landowner Name, Village, Case UID..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={statusOptions}
        totalCount={MOCK_DISTRICT_CASES.length}
        filteredCount={filteredCases.length}
      />

      <BrutalistCaseTable
        cases={filteredCases}
        onOpenDisbursementModal={handleOpenDisbursement}
        onViewCitizenView={() => setCurrentRole('citizen')}
      />

      <CompensationDisbursementModal
        isOpen={isDisbursementModalOpen}
        onClose={() => setIsDisbursementModalOpen(false)}
        caseItem={selectedCase}
      />
    </div>
  );
};
