import React, { useState, useEffect, useMemo } from 'react';
import { Parcel, ParcelStatus, InspectionPriority } from '../../../types/parcel';
import { fetchParcels, completeInspection } from '../../../services/api';
import { ParcelMap } from '../../gis/ParcelMap';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Filter,
  Layers,
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
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Check,
  Map as MapIcon,
  ListFilter,
  Maximize2
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
      // Auto-select first pending high priority parcel if none selected
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
        // Fall back to realistic field officer position in corridor
        setOfficerLocation([12.9260, 79.1400]);
        setGeoStatus('ready');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Calculate Haversine distance in km between two [lat, lng] coordinates
  const calculateDistanceKm = (point1: [number, number], point2: [number, number]): number => {
    const R = 6371; // Earth's radius in km
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

  // Priority weight sorting helper
  const priorityWeight = (p: InspectionPriority) => (p === 'high' ? 3 : p === 'medium' ? 2 : 1);

  // Filtered & sorted queue list
  const filteredParcels = useMemo(() => {
    return parcels
      .filter(p => {
        // Tab filter
        if (activeTab === 'pending' && !p.inspection?.required) return false;
        if (activeTab === 'completed' && p.inspection?.required) return false;

        // Search
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

        // District
        if (selectedDistrict !== 'all' && p.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
          return false;
        }

        // Project
        if (selectedProject !== 'all' && !p.project.toLowerCase().includes(selectedProject.toLowerCase())) {
          return false;
        }

        // Priority
        if (selectedPriority !== 'all' && p.inspection?.priority !== selectedPriority) {
          return false;
        }

        // Distance filter
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

  // Statistics calculation
  const stats = useMemo(() => {
    const totalPending = parcels.filter(p => p.inspection?.required).length;
    const highPriority = parcels.filter(p => p.inspection?.required && p.inspection.priority === 'high').length;
    const completedToday = parcels.filter(p => p.inspection?.lastInspectedOn === new Date().toISOString().split('T')[0]).length;
    const within10Km = officerLocation
      ? parcels.filter(p => p.inspection?.required && calculateDistanceKm(officerLocation, p.centroid) <= 10).length
      : 0;

    return { totalPending, highPriority, completedToday, within10Km };
  }, [parcels, officerLocation]);

  // Handle Card Click to zoom map
  const handleParcelCardClick = (parcel: Parcel) => {
    setSelectedParcelId(parcel.id);
    setHighlightParcelId(parcel.id);
  };

  // Open inspection modal
  const handleOpenInspectModal = (parcel: Parcel, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTargetParcelForInspect(parcel);
    setInspectDate(new Date().toISOString().split('T')[0]);
    setInspectNotes(parcel.inspection?.notes || '');
    setInspectNewStatus(parcel.status === 'dispute' ? 'in_progress' : parcel.status);
    setInspectPhotoPreview(parcel.inspection?.photoUrl || null);
    setInspectModalOpen(true);
  };

  // Handle Photo file selection with preview
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

  // Submit Inspection completion
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

      // Update local parcels state live
      setParcels(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      setInspectModalOpen(false);
      setSuccessToast(`Inspection recorded successfully for Survey No: ${updated.surveyNo}`);
      setTimeout(() => setSuccessToast(null), 4500);
    } catch (err) {
      console.error('Inspection completion failed', err);
      alert('Failed to save inspection. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedParcel = parcels.find(p => p.id === (highlightParcelId || selectedParcelId)) || null;

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* ── Top Dashboard Header ── */}
      <header className="flex-shrink-0 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Field Officer Inspection Module
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
                  Live GIS Satellite Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Chennai–Bengaluru Expressway Corridor • Highway Land Acquisition Cell
              </p>
            </div>
          </div>

          {/* KPI Mini-Cards */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Pending Queue</div>
                <div className="text-sm font-bold text-white font-mono">{stats.totalPending} Parcels</div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-rose-900/60 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm">
              <span className="text-sm">🔴</span>
              <div>
                <div className="text-[10px] text-rose-300 font-medium">High Priority</div>
                <div className="text-sm font-bold text-rose-400 font-mono">{stats.highPriority} Urgent</div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm">
              <Navigation className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Within 10 km</div>
                <div className="text-sm font-bold text-sky-400 font-mono">{stats.within10Km} Nearby</div>
              </div>
            </div>

            {/* Officer Live GPS Button */}
            <button
              type="button"
              onClick={requestLiveGPS}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                geoStatus === 'acquiring'
                  ? 'bg-amber-600/30 border-amber-500 text-amber-300 animate-pulse'
                  : 'bg-blue-600/20 border-blue-500/50 hover:bg-blue-600/30 text-blue-300'
              }`}
              title="Sync Officer Current GPS Coordinates"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{geoStatus === 'acquiring' ? 'Acquiring GPS...' : 'Officer Live GPS'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Success Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-bold">{successToast}</span>
        </div>
      )}

      {/* Mobile View Switcher (Visible on small screens) */}
      <div className="flex md:hidden bg-slate-900 border-b border-slate-800 p-1">
        <button
          type="button"
          onClick={() => setMobileView('list')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 ${
            mobileView === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Queue ({filteredParcels.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView('map')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 ${
            mobileView === 'map' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Satellite Map</span>
        </button>
      </div>

      {/* ── Main Dual-Panel Layout ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left Panel: Inspection Queue & Filters ── */}
        <div
          className={`w-full md:w-[480px] lg:w-[520px] flex-shrink-0 flex flex-col border-r border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden ${
            mobileView === 'map' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Tabs & Search Controls */}
          <div className="p-4 border-b border-slate-800 space-y-3 flex-shrink-0 bg-slate-900/90">
            {/* View Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'pending'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Inspection Queue ({stats.totalPending})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'completed'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Inspected
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({parcels.length})
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search survey no (e.g. 142/3A), owner, district..."
                className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns Row */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {/* District Filter */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">District</label>
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Districts</option>
                  <option value="Vellore">Vellore</option>
                  <option value="Ranipet">Ranipet</option>
                  <option value="Kanchipuram">Kanchipuram</option>
                  <option value="Sriperumbudur">Sriperumbudur</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={e => setSelectedPriority(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🔵 Low</option>
                </select>
              </div>

              {/* Max Distance Radius Filter */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Radius</label>
                  <span className="text-[10px] font-mono text-sky-400 font-bold">
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
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Parcel Cards List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                <span className="text-xs">Loading GIS Parcel Queue...</span>
              </div>
            ) : filteredParcels.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <p className="text-sm font-semibold text-slate-400">No matching parcels in queue</p>
                <p className="text-xs text-slate-500 mt-1">Try relaxing your search or filter options</p>
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
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-xs relative ${
                      isSelected
                        ? 'bg-slate-800/95 border-blue-500 ring-2 ring-blue-500/30 shadow-xl'
                        : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    {/* Top Row: Priority Badge, Survey No, Distance */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {parcel.inspection?.required ? (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                              isHigh
                                ? 'bg-rose-900/60 text-rose-300 border border-rose-500/50'
                                : isMedium
                                ? 'bg-amber-900/60 text-amber-300 border border-amber-500/50'
                                : 'bg-blue-900/60 text-blue-300 border border-blue-500/50'
                            }`}
                          >
                            <span>{isHigh ? '🔴' : isMedium ? '🟡' : '🔵'}</span>
                            <span>{parcel.inspection.priority.toUpperCase()}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>INSPECTED</span>
                          </span>
                        )}
                        <span className="font-mono text-sm font-black text-white">
                          Survey No: {parcel.surveyNo}
                        </span>
                      </div>

                      {distanceKm !== null && (
                        <span className="text-[11px] font-mono text-sky-400 font-bold bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-800/50 flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          {distanceKm} km
                        </span>
                      )}
                    </div>

                    {/* Landowner & Project */}
                    <div className="text-slate-300 mb-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>
                          Owner: <strong className="text-white">{parcel.owner}</strong>
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">{parcel.area}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {parcel.project} • <span className="text-slate-300">{parcel.district}</span>
                      </div>
                    </div>

                    {/* Inspection Reason Box */}
                    {parcel.inspection?.required && (
                      <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-900/40 text-[11px] text-rose-200 mb-3">
                        <div className="font-semibold text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                          <span>Reason: {parcel.inspection.reason}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10.5px] text-rose-300 font-mono">
                          <span>Due: {parcel.inspection.dueDate}</span>
                          {parcel.inspection.assignedOfficer && (
                            <span className="text-slate-400 truncate max-w-[150px]">
                              {parcel.inspection.assignedOfficer}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Inspected Details if completed */}
                    {!parcel.inspection?.required && parcel.inspection?.lastInspectedOn && (
                      <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-[11px] text-emerald-200 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-emerald-300">
                            Inspected on {parcel.inspection.lastInspectedOn}
                          </span>
                          <span className="capitalize font-bold text-white px-1.5 py-0.5 rounded bg-emerald-900/60 text-[10px]">
                            {parcel.status}
                          </span>
                        </div>
                        {parcel.inspection.notes && (
                          <p className="mt-1 text-[10.5px] text-slate-300 italic line-clamp-1">
                            &quot;{parcel.inspection.notes}&quot;
                          </p>
                        )}
                      </div>
                    )}

                    {/* Action Buttons Row */}
                    <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleParcelCardClick(parcel);
                          if (window.innerWidth < 768) setMobileView('map');
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span>View on Map</span>
                      </button>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${parcel.centroid[0]},${parcel.centroid[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-sky-400" />
                        <span>Get Directions</span>
                      </a>

                      {parcel.inspection?.required ? (
                        <button
                          type="button"
                          onClick={e => handleOpenInspectModal(parcel, e)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Mark Inspected</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={e => handleOpenInspectModal(parcel, e)}
                          className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-medium cursor-pointer"
                          title="Edit Inspection Record"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Panel: Full GIS Satellite Map ── */}
        <div
          className={`flex-1 flex flex-col bg-slate-950 relative overflow-hidden ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Selected Parcel Top Info Ribbon */}
          {selectedParcel && (
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs backdrop-blur-md z-10 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="font-mono font-bold text-white text-sm">
                    {selectedParcel.surveyNo}
                  </span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-slate-200 font-medium">{selectedParcel.owner}</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-400 font-mono">{selectedParcel.area}</span>
                <span className="text-slate-400 hidden sm:inline">•</span>
                <span className="text-slate-300 hidden sm:inline">{selectedParcel.project}</span>
              </div>

              <div className="flex items-center gap-2">
                {selectedParcel.inspection?.required && (
                  <button
                    type="button"
                    onClick={() => handleOpenInspectModal(selectedParcel)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Inspection</span>
                  </button>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedParcel.centroid[0]},${selectedParcel.centroid[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow cursor-pointer transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Navigate</span>
                </a>
              </div>
            </div>
          )}

          {/* Embedded Reusable ParcelMap */}
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

      {/* ── "Mark as Inspected" Inspection Form Modal ── */}
      {inspectModalOpen && targetParcelForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Submit Field Inspection Report
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Survey No: {targetParcelForInspect.surveyNo} • {targetParcelForInspect.owner}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCompleteInspectionSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Parcel Context Banner */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Project:</span>
                  <span className="font-semibold text-white">{targetParcelForInspect.project}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-medium text-slate-200">{targetParcelForInspect.district} District</span>
                </div>
                {targetParcelForInspect.inspection?.reason && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-rose-300">
                    <span className="font-semibold text-rose-400">Trigger Reason:</span> {targetParcelForInspect.inspection.reason}
                  </div>
                )}
              </div>

              {/* Inspection Date */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Inspection Date</span>
                </label>
                <input
                  type="date"
                  required
                  value={inspectDate}
                  onChange={e => setInspectDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Updated Status Dropdown */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Updated Parcel Status Post-Inspection</span>
                </label>
                <select
                  value={inspectNewStatus}
                  onChange={e => setInspectNewStatus(e.target.value as ParcelStatus)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="in_progress">🟡 In Progress / Valuation Ongoing</option>
                  <option value="completed">🟢 Completed / Ready for Award</option>
                  <option value="dispute">🔴 Dispute / Litigation Pending</option>
                  <option value="not_started">⚪ Not Started</option>
                </select>
              </div>

              {/* Officer Inspection Notes */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Officer Verification Notes & Field Observations</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter detailed observations regarding boundaries, structures, crop status, or dispute resolution..."
                  value={inspectNotes}
                  onChange={e => setInspectNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500 resize-none placeholder:text-slate-500 leading-relaxed"
                />
              </div>

              {/* Field Photo Upload Simulator */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-purple-400" />
                  <span>Field Photo Evidence (Optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-[11px] text-slate-300 font-medium">Click to capture / attach photo</span>
                    <span className="text-[10px] text-slate-500">JPG, PNG up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {inspectPhotoPreview && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-600 flex-shrink-0">
                      <img src={inspectPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setInspectPhotoPreview(null)}
                        className="absolute top-1 right-1 bg-black/70 p-0.5 rounded-full text-white hover:bg-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setInspectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Save Inspection</span>
                    </>
                  )}
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
