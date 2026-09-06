import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssignedParcelsList } from './AssignedParcelsList';
import { GPSCaptureSimulator } from './GPSCaptureSimulator';
import { PhotoEvidenceUploader } from './PhotoEvidenceUploader';
import { VerificationActions } from './VerificationActions';
import { DashboardSearchFilterBar, StatusOption } from '../../common/DashboardSearchFilterBar';
import { MOCK_FIELD_PARCELS } from '../../../data/mockData';
import { FieldParcel, PhotoEvidence } from '../../../types';
import { useDebounce } from '../../../hooks/useDebounce';
import { Compass, Eye, Navigation, ArrowRight, ShieldAlert } from 'lucide-react';

export const FieldOfficerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [parcels, setParcels] = useState<FieldParcel[]>(MOCK_FIELD_PARCELS);
  const [selectedParcel, setSelectedParcel] = useState<FieldParcel>(MOCK_FIELD_PARCELS[0]);


  // Local Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const debouncedSearch = useDebounce(searchTerm, 250);

  const statusOptions: StatusOption[] = [
    { label: 'All Verification Statuses', value: 'ALL' },
    { label: 'Pending Survey', value: 'PENDING_SURVEY' },
    { label: 'GPS Captured', value: 'GPS_CAPTURED' },
    { label: 'Verified', value: 'VERIFIED' },
    { label: 'Objection Flagged', value: 'OBJECTION_FLAGGED' },
  ];

  const filteredParcels = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return parcels.filter((p) => {
      const matchesSearch =
        !q ||
        p.surveyNumber.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'ALL' || p.verificationStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [parcels, debouncedSearch, statusFilter]);

  // Ensure active selected parcel stays valid if filtered list changes
  const activeParcel = filteredParcels.find((p) => p.id === selectedParcel?.id) || filteredParcels[0] || selectedParcel;

  const handleUpdateCoordinates = (coords: { lat: number; lng: number; accuracyMeters: number }) => {
    setSelectedParcel((prev) => {
      const updated = {
        ...prev,
        gpsCoords: coords,
        verificationStatus: 'GPS_CAPTURED' as const,
      };
      setParcels((list) => list.map((p) => (p.id === updated.id ? updated : p)));
      return updated;
    });
  };

  const handleAddPhoto = (photo: PhotoEvidence) => {
    setSelectedParcel((prev) => {
      const updated = {
        ...prev,
        photos: [photo, ...prev.photos],
      };
      setParcels((list) => list.map((p) => (p.id === updated.id ? updated : p)));
      return updated;
    });
  };

  const handleCompleteVerification = () => {
    if (!activeParcel) return;
    const updated = {
      ...activeParcel,
      verificationStatus: 'VERIFIED' as const,
      dueHours: 0,
    };
    setSelectedParcel(updated);
    setParcels((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleFlagObjection = () => {
    if (!activeParcel) return;
    const updated = {
      ...activeParcel,
      verificationStatus: 'OBJECTION_FLAGGED' as const,
    };
    setSelectedParcel(updated);
    setParcels((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <div className="space-y-5">
      {/* GIS Satellite Inspection Module Quick Action Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-600/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-inner flex-shrink-0">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Field Officer GIS Satellite Map & Inspection Queue
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                High Priority Alerts
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              Inspect real-time cadastral boundary polygons on high-resolution Esri satellite imagery with live GPS officer routing and instant completion workflows.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/officer/inspections')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40 flex items-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98"
        >
          <span>Open GIS Satellite Queue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Global Dashboard Search & Filter Bar */}
      <DashboardSearchFilterBar
        title="Field Inspection Cadastral Filter"
        subtitle="Search and filter parcels by Survey Number, Landowner Name, Village, or Verification Status"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search Survey #, Landowner Name, Village, Parcel ID..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={statusOptions}
        totalCount={parcels.length}
        filteredCount={filteredParcels.length}
      />


      {/* 2-column layout: Mobile roster left, Active Survey workstation right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Assigned Parcels Roster (4 cols) */}
        <div className="lg:col-span-4">
          <AssignedParcelsList
            parcels={filteredParcels}
            selectedParcelId={activeParcel?.id}
            onSelectParcel={setSelectedParcel}
          />
        </div>

        {/* Right Column: Active Parcel Inspection Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeParcel ? (
            <>
              <GPSCaptureSimulator
                parcel={activeParcel}
                onUpdateCoordinates={handleUpdateCoordinates}
              />
              <PhotoEvidenceUploader
                parcel={activeParcel}
                onAddPhoto={handleAddPhoto}
              />
              <VerificationActions
                parcel={activeParcel}
                onCompleteVerification={handleCompleteVerification}
                onFlagObjection={handleFlagObjection}
              />
            </>
          ) : (
            <div className="gov-card p-12 text-center text-slate-500">
              <p className="font-bold text-base text-slate-700">No parcel selected</p>
              <p className="text-xs text-slate-400 mt-1">
                Select a parcel from the roster to inspect or verify evidence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
