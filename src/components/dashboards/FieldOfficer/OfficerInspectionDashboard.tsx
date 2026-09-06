import React, { useState, useEffect, useMemo } from 'react';
import { Parcel, ParcelStatus, InspectionPriority } from '../../../types/parcel';
import { fetchParcels, completeInspection } from '../../../services/api';
import { ParcelMap } from '../../gis/ParcelMap';
import {
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Navigation,
  Search,
  Upload,
  Calendar,
  FileText,
  Camera,
  X,
  RefreshCw,
  Eye,
  ShieldCheck,
  Check,
  Map as MapIcon,
  ListFilter,
  Layers,
  FileCheck2
} from 'lucide-react';

export const OfficerInspectionDashboard: React.FC = () => {
  // Data state
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [highlightParcelId, setHighlightParcelId] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'all'>('pending');
  const [mobileView, setMobileView] = useState<'split' | 'list' | 'map'>('split');

  // Geolocation state (Default to officer position along Vellore/Ranipet corridor)
  const [officerLocation, setOfficerLocation] = useState<[number, number] | null>([12.9260, 79.1400]);
  const [geoStatus, setGeoStatus] = useState<'ready' | 'acquiring' | 'error'>('ready');
  const [maxDistanceFilter, setMaxDistanceFilter] = useState<number>(50); // km

  // Inspection modal state
  const [inspectModalOpen, setInspectModalOpen] = useState<boolean>(false);
  const [targetParcelForInspect, setTargetParcelForInspect] = useState<Parcel | null>(null);
  const [inspectDate, setInspectDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [inspectNotes, setInspectNotes] = useState<string>('');
  const [inspectNewStatus, setInspectNewStatus] = useState<ParcelStatus>('in_progress');
  const [inspectPhotoPreview, setInspectPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Load parcels on mount
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchParcels();
      setParcels(data);
      const firstPending = data.find(p => p.inspection?.required && p.inspection.priority === 'high') || data.find(p => p.inspection?.required);
      if (firstPending && !selectedParcelId) {
        setSelectedParcelId(firstPending.id);
        setHighlightParcelId(firstPending.id);
      }
    } catch (err) {
      console.error('Failed to load parcels', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Officer Geolocation Live Handler
  const requestLiveGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGeoStatus('acquiring');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setOfficerLocation([pos.coords.latitude, pos.coords.longitude]);
        setGeoStatus('ready');
      },
      err => {
        console.warn('Geolocation error:', err);
        setOfficerLocation([12.9260, 79.1400]);
        setGeoStatus('ready');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Calculate Haversine distance in km
  const calculateDistanceKm = (point1: [number, number], point2: [number, number]): number => {
    const R = 6371;
    const dLat = ((point2[0] - point1[0]) * Math.PI) / 180;
    const dLng = ((point2[1] - point1[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1[0] * Math.PI) / 180) *
        Math.cos((point2[0] * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  const priorityWeight = (p: InspectionPriority) => (p === 'high' ? 3 : p === 'medium' ? 2 : 1);

  // Filtered & sorted queue list
  const filteredParcels = useMemo(() => {
    return parcels
      .filter(p => {
        if (activeTab === 'pending' && !p.inspection?.required) return false;
        if (activeTab === 'completed' && p.inspection?.required) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            p.surveyNo.toLowerCase().includes(q) ||
            p.owner.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q) ||
            p.district.toLowerCase().includes(q) ||
            p.project.toLowerCase().includes(q);
          if (!matches) return false;
        }

        if (selectedDistrict !== 'all' && p.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
          return false;
        }

        if (selectedProject !== 'all' && !p.project.toLowerCase().includes(selectedProject.toLowerCase())) {
          return false;
        }

        if (selectedPriority !== 'all' && p.inspection?.priority !== selectedPriority) {
          return false;
        }

        if (officerLocation && maxDistanceFilter < 50) {
          const dist = calculateDistanceKm(officerLocation, p.centroid);
          if (dist > maxDistanceFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (activeTab === 'pending') {
          const pA = priorityWeight(a.inspection?.priority || 'low');
          const pB = priorityWeight(b.inspection?.priority || 'low');
          if (pB !== pA) return pB - pA;
          return new Date(a.inspection?.dueDate || '').getTime() - new Date(b.inspection?.dueDate || '').getTime();
        }
        return a.surveyNo.localeCompare(b.surveyNo);
      });
  }, [parcels, activeTab, searchQuery, selectedDistrict, selectedProject, selectedPriority, maxDistanceFilter, officerLocation]);

  const stats = useMemo(() => {
    const totalPending = parcels.filter(p => p.inspection?.required).length;
    const highPriority = parcels.filter(p => p.inspection?.required && p.inspection.priority === 'high').length;
    const completedToday = parcels.filter(p => p.inspection?.lastInspectedOn === new Date().toISOString().split('T')[0]).length;
    const within10Km = officerLocation
      ? parcels.filter(p => p.inspection?.required && calculateDistanceKm(officerLocation, p.centroid) <= 10).length
      : 0;

    return { totalPending, highPriority, completedToday, within10Km };
  }, [parcels, officerLocation]);

  const handleParcelCardClick = (parcel: Parcel) => {
    setSelectedParcelId(parcel.id);
    setHighlightParcelId(parcel.id);
  };

  const handleOpenInspectModal = (parcel: Parcel, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTargetParcelForInspect(parcel);
    setInspectDate(new Date().toISOString().split('T')[0]);
    setInspectNotes(parcel.inspection?.notes || '');
    setInspectNewStatus(parcel.status === 'dispute' ? 'in_progress' : parcel.status);
    setInspectPhotoPreview(parcel.inspection?.photoUrl || null);
    setInspectModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInspectPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteInspectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetParcelForInspect) return;

    setSubmitting(true);
    try {
      const updated = await completeInspection(targetParcelForInspect.id, {
        notes: inspectNotes,
        date: inspectDate,
        newStatus: inspectNewStatus,
        photoUrl: inspectPhotoPreview || undefined
      });

      setParcels(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      setInspectModalOpen(false);
      setSuccessToast(`Inspection recorded for Survey No: ${updated.surveyNo}`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.error('Inspection completion failed', err);
      alert('Failed to save inspection. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedParcel = parcels.find(p => p.id === (highlightParcelId || selectedParcelId)) || null;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#F4F6F9] text-[#1E293B] overflow-hidden font-sans" style={{ border: '1px solid #CBD5E1', borderRadius: '2px' }}>
      {/* ── Official Government Header Strip ── */}
      <header className="flex-shrink-0 bg-white border-b border-slate-300 px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#0B3D66] uppercase tracking-wide">
                Field Officer Cadastral Inspection &amp; Satellite Module
              </h1>
              <span className="gov-badge gov-badge-green text-[10px]">
                GIS Synchronized
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Chennai–Bengaluru Expressway Corridor • Competent Authority for Land Acquisition (CALA)
            </p>
          </div>

          {/* Official Compact KPI Badges */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 text-xs">
            <div className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 flex items-center gap-2">
              <span className="text-slate-600 font-medium">Pending Inspections:</span>
              <span className="font-bold text-[#0B3D66] font-mono">{stats.totalPending}</span>
            </div>

            <div className="bg-red-50 border border-red-200 rounded px-2.5 py-1 flex items-center gap-2">
              <span className="text-red-700 font-medium">Urgent High Priority:</span>
              <span className="font-bold text-red-700 font-mono">{stats.highPriority}</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded px-2.5 py-1 flex items-center gap-2">
              <span className="text-blue-700 font-medium">Within 10 km:</span>
              <span className="font-bold text-blue-700 font-mono">{stats.within10Km}</span>
            </div>

            <button
              type="button"
              onClick={requestLiveGPS}
              className="gov-btn-secondary text-xs cursor-pointer py-1"
              title="Sync Officer GPS Position"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0B3D66]" />
              <span>{geoStatus === 'acquiring' ? 'Locating...' : 'Officer Live GPS'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Success Notification */}
      {successToast && (
        <div className="bg-emerald-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-white hover:text-slate-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden bg-white border-b border-slate-300 p-1">
        <button
          type="button"
          onClick={() => setMobileView('list')}
          className={`flex-1 py-1.5 text-xs font-bold rounded ${
            mobileView === 'list' ? 'bg-[#0B3D66] text-white' : 'text-slate-700'
          }`}
        >
          Inspection Queue ({filteredParcels.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileView('map')}
          className={`flex-1 py-1.5 text-xs font-bold rounded ${
            mobileView === 'map' ? 'bg-[#0B3D66] text-white' : 'text-slate-700'
          }`}
        >
          GIS Satellite Map
        </button>
      </div>

      {/* ── Main Work Area ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left Column: Inspection Queue ── */}
        <div
          className={`w-full md:w-[440px] lg:w-[480px] flex-shrink-0 flex flex-col border-r border-slate-300 bg-white overflow-hidden ${
            mobileView === 'map' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Controls & Filters */}
          <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-2.5">
            {/* View Tab Buttons */}
            <div className="flex items-center gap-1 border border-slate-300 bg-white p-0.5 rounded text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-1 font-bold rounded transition-colors cursor-pointer ${
                  activeTab === 'pending'
                    ? 'bg-[#0B3D66] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Pending Queue ({stats.totalPending})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-1 font-bold rounded transition-colors cursor-pointer ${
                  activeTab === 'completed'
                    ? 'bg-[#0B3D66] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Inspected
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 font-bold rounded transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#0B3D66] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                All ({parcels.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search survey #, owner name, district..."
                className="gov-input pl-8 py-1.5 text-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">District</label>
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  className="gov-select py-1 text-xs"
                >
                  <option value="all">All Districts</option>
                  <option value="Vellore">Vellore</option>
                  <option value="Ranipet">Ranipet</option>
                  <option value="Kanchipuram">Kanchipuram</option>
                  <option value="Sriperumbudur">Sriperumbudur</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={e => setSelectedPriority(e.target.value)}
                  className="gov-select py-1 text-xs"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-0.5">
                  <label className="text-[10px] font-bold text-slate-600">Radius</label>
                  <span className="text-[10px] font-mono font-bold text-[#0B3D66]">
                    {maxDistanceFilter >= 50 ? 'All' : `${maxDistanceFilter}km`}
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="2"
                  value={maxDistanceFilter}
                  onChange={e => setMaxDistanceFilter(parseInt(e.target.value))}
                  className="w-full accent-[#0B3D66] h-1.5 bg-slate-200 rounded appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* List of Parcel Cards */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#F4F6F9]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-600 space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin text-[#0B3D66]" />
                <span className="text-xs">Loading Cadastral Queue...</span>
              </div>
            ) : filteredParcels.length === 0 ? (
              <div className="p-6 text-center text-slate-600 bg-white border border-slate-300 rounded">
                <p className="font-bold text-xs">No matching parcels in queue</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Adjust filter criteria to view more records</p>
              </div>
            ) : (
              filteredParcels.map(parcel => {
                const isSelected = parcel.id === (highlightParcelId || selectedParcelId);
                const distanceKm = officerLocation ? calculateDistanceKm(officerLocation, parcel.centroid) : null;
                const isHigh = parcel.inspection?.priority === 'high';
                const isMedium = parcel.inspection?.priority === 'medium';

                return (
                  <div
                    key={parcel.id}
                    onClick={() => handleParcelCardClick(parcel)}
                    className={`p-3 bg-white border transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'border-[#0B3D66] border-l-4 bg-blue-50/40'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {parcel.inspection?.required ? (
                          <span
                            className={`gov-badge ${
                              isHigh
                                ? 'gov-badge-red'
                                : isMedium
                                ? 'gov-badge-amber'
                                : 'gov-badge-blue'
                            }`}
                          >
                            {parcel.inspection.priority.toUpperCase()}
                          </span>
                        ) : (
                          <span className="gov-badge gov-badge-green">
                            INSPECTED
                          </span>
                        )}
                        <span className="font-bold text-slate-900 font-mono">
                          Survey No: {parcel.surveyNo}
                        </span>
                      </div>

                      {distanceKm !== null && (
                        <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {distanceKm} km away
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-0.5 text-slate-700 text-xs">
                      <div className="flex justify-between">
                        <span>Owner: <strong className="text-slate-900">{parcel.owner}</strong></span>
                        <span className="font-mono text-slate-600">{parcel.area}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {parcel.project} • <span>{parcel.district} District</span>
                      </div>
                    </div>

                    {/* Inspection Note Box */}
                    {parcel.inspection?.required && (
                      <div className="mt-2 p-2 bg-red-50/60 border border-red-200 rounded text-[11px] text-red-900">
                        <div className="font-bold flex items-center gap-1 text-red-800">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                          <span>Trigger: {parcel.inspection.reason}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10.5px] text-red-700">
                          <span>Due Date: {parcel.inspection.dueDate}</span>
                          <span className="truncate max-w-[150px]">{parcel.inspection.assignedOfficer}</span>
                        </div>
                      </div>
                    )}

                    {/* Completed Note */}
                    {!parcel.inspection?.required && parcel.inspection?.lastInspectedOn && (
                      <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-900">
                        <span className="font-bold">Verified on {parcel.inspection.lastInspectedOn}</span>
                        {parcel.inspection.notes && (
                          <p className="mt-0.5 text-[10.5px] text-slate-700 italic">
                            &quot;{parcel.inspection.notes}&quot;
                          </p>
                        )}
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleParcelCardClick(parcel);
                          if (window.innerWidth < 768) setMobileView('map');
                        }}
                        className="gov-btn-secondary text-[11px] py-1 flex-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Map</span>
                      </button>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${parcel.centroid[0]},${parcel.centroid[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="gov-btn-secondary text-[11px] py-1 flex-1 cursor-pointer"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Directions</span>
                      </a>

                      {parcel.inspection?.required ? (
                        <button
                          type="button"
                          onClick={e => handleOpenInspectModal(parcel, e)}
                          className="gov-btn-primary text-[11px] py-1 flex-1 cursor-pointer"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={e => handleOpenInspectModal(parcel, e)}
                          className="gov-btn-secondary text-[11px] py-1 px-2 cursor-pointer"
                          title="Edit Record"
                        >
                          <FileText className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Column: Map ── */}
        <div
          className={`flex-1 flex flex-col bg-white relative overflow-hidden ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Selected Ribbon */}
          {selectedParcel && (
            <div className="bg-white border-b border-slate-300 px-4 py-2 flex items-center justify-between text-xs z-10">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#0B3D66] font-mono">
                  Survey No: {selectedParcel.surveyNo}
                </span>
                <span className="text-slate-400">|</span>
                <span>{selectedParcel.owner}</span>
                <span className="text-slate-400">|</span>
                <span className="font-bold text-slate-700">{selectedParcel.area}</span>
                <span className="text-slate-400 hidden sm:inline">|</span>
                <span className="text-slate-600 hidden sm:inline">{selectedParcel.project}</span>
              </div>

              <div className="flex items-center gap-2">
                {selectedParcel.inspection?.required && (
                  <button
                    type="button"
                    onClick={() => handleOpenInspectModal(selectedParcel)}
                    className="gov-btn-primary text-xs py-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Complete Inspection</span>
                  </button>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedParcel.centroid[0]},${selectedParcel.centroid[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gov-btn-secondary text-xs py-1 cursor-pointer"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Navigate</span>
                </a>
              </div>
            </div>
          )}

          {/* GIS Map */}
          <div className="flex-1 w-full h-full relative">
            <ParcelMap
              parcels={parcels}
              selectedParcelId={selectedParcelId}
              highlightParcelId={highlightParcelId}
              onParcelSelect={parcel => {
                setSelectedParcelId(parcel.id);
                setHighlightParcelId(parcel.id);
              }}
              defaultLayer="satellite"
              officerLocation={officerLocation}
              showRouteToSelected={true}
              showLegend={true}
              height="100%"
            />
          </div>
        </div>
      </div>

      {/* ── Official Inspection Form Modal ── */}
      {inspectModalOpen && targetParcelForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '2px', width: '100%', maxWidth: '32rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div className="px-5 py-3.5 bg-[#0B3D66] text-white flex items-center justify-between border-b-2 border-amber-400">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide">
                  Submit Field Officer Verification Report
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  Survey No: {targetParcelForInspect.surveyNo} • {targetParcelForInspect.owner}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="text-blue-200 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCompleteInspectionSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Project Corridor:</span>
                  <span className="font-bold text-slate-900">{targetParcelForInspect.project}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Revenue District:</span>
                  <span>{targetParcelForInspect.district}</span>
                </div>
                {targetParcelForInspect.inspection?.reason && (
                  <div className="pt-1.5 border-t border-slate-200 text-red-700">
                    <span className="font-bold">Flagged Reason:</span> {targetParcelForInspect.inspection.reason}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Inspection Date
                </label>
                <input
                  type="date"
                  required
                  value={inspectDate}
                  onChange={e => setInspectDate(e.target.value)}
                  className="gov-input text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Updated Parcel Acquisition Status
                </label>
                <select
                  value={inspectNewStatus}
                  onChange={e => setInspectNewStatus(e.target.value as ParcelStatus)}
                  className="gov-select text-xs font-semibold"
                >
                  <option value="in_progress">In Progress / Joint Measurement Ongoing</option>
                  <option value="completed">Completed / Title Verified for Award</option>
                  <option value="dispute">Dispute / Sub-judice in Court</option>
                  <option value="not_started">Not Started</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Field Verification Remarks &amp; Ground Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter boundary confirmation, tree/structure count, or landowner consent notes..."
                  value={inspectNotes}
                  onChange={e => setInspectNotes(e.target.value)}
                  className="gov-input text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Field Photo Evidence (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex flex-col items-center justify-center p-3 border border-dashed border-slate-300 hover:border-[#0B3D66] rounded cursor-pointer bg-slate-50">
                    <Upload className="w-4 h-4 text-slate-500 mb-1" />
                    <span className="text-[11px] text-slate-700 font-medium">Attach geo-tagged field photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {inspectPhotoPreview && (
                    <div className="relative w-14 h-14 rounded border border-slate-300 overflow-hidden flex-shrink-0">
                      <img src={inspectPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setInspectPhotoPreview(null)}
                        className="absolute top-0.5 right-0.5 bg-black/70 p-0.5 rounded text-white"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInspectModalOpen(false)}
                  className="gov-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="gov-btn-primary text-xs"
                >
                  {submitting ? 'Saving...' : 'Confirm & Save Inspection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerInspectionDashboard;
