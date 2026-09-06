import React, { useState, useRef } from 'react';
import { Project, ProjectStatus } from '../../../types';
import { Parcel } from '../../../types/parcel';
import { MOCK_STATES } from '../../../data/mockData';
import ParcelMap from '../../gis/ParcelMap';
import {
  suggestOptimalAlignment,
  AlignmentOptimizationResult,
  AlignmentRequestPayload
} from '../../../services/api';
import {
  UploadCloud,
  FileCheck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  X,
  Compass,
  ArrowRight,
  Sparkles,
  Route,
  RefreshCw,
  ShieldCheck,
  Sliders,
  Layers
} from 'lucide-react';

interface CreateProjectFormProps {
  onSuccess: (project: Project, parcels: Parcel[]) => void;
  onCancel: () => void;
}

// Corridor Presets for Western Corridor Demo
const CORRIDOR_PRESETS = [
  {
    id: 'PLG-BOISAR',
    label: 'Palghar North Interchange → Boisar Industrial Node (15 km)',
    origin: [19.7400, 72.7800] as [number, number],
    dest: [19.6800, 72.8800] as [number, number],
    corridorName: 'Palghar-Boisar Greenfield Logistics Spur',
    width: 45
  },
  {
    id: 'VAD-SHIRGAON',
    label: 'Vadavali Khurd Agri Belt → Shirgaon Intermodal Terminal (12 km)',
    origin: [19.7600, 72.7600] as [number, number],
    dest: [19.7000, 72.8600] as [number, number],
    corridorName: 'Western DFC Intermodal Feeder Corridor',
    width: 45
  },
  {
    id: 'DHN-MANOR',
    label: 'Dahanu Rural Junction → Manor NH-48 Expressway Node (18 km)',
    origin: [19.7800, 72.8200] as [number, number],
    dest: [19.6600, 72.8900] as [number, number],
    corridorName: 'NH-48 Golden Quadrilateral Bypass Corridor',
    width: 60
  }
];


// Sample Realistic GeoJSON for 1-click test load (NHAI Alignment Sector)
const SAMPLE_ALIGNMENT_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { surveyNo: "201/1A", owner: "Hariram Shankarlal", category: "Agricultural" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8250, 19.7120],
            [72.8290, 19.7145],
            [72.8275, 19.7180],
            [72.8235, 19.7155],
            [72.8250, 19.7120],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { surveyNo: "201/1B", owner: "Pandurang Patil & Heirs", category: "Orchard" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8290, 19.7145],
            [72.8330, 19.7170],
            [72.8315, 19.7205],
            [72.8275, 19.7180],
            [72.8290, 19.7145],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { surveyNo: "202/3", owner: "Shantabai Devji", category: "Residential/Commercial" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8330, 19.7170],
            [72.8370, 19.7195],
            [72.8355, 19.7230],
            [72.8315, 19.7205],
            [72.8330, 19.7170],
          ],
        ],
      },
    },
  ],
};

// District suggestions by state
const STATE_DISTRICTS: Record<string, string[]> = {
  Maharashtra: ['Palghar', 'Thane', 'Raigad', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad'],
  Gujarat: ['Surat', 'Navsari', 'Valsad', 'Ahmedabad', 'Vadodara', 'Kutch', 'Bhavnagar'],
  'Uttar Pradesh': ['Gautam Buddha Nagar', 'Bulandshahr', 'Aligarh', 'Agra', 'Lucknow', 'Varanasi'],
  'West Bengal': ['Hooghly', 'Purba Bardhaman', 'Bankura', 'Howrah', 'North 24 Parganas'],
  'Tamil Nadu': ['Kanchipuram', 'Vellore', 'Ranipet', 'Tiruvallur', 'Salem', 'Coimbatore'],
  Rajasthan: ['Jaipur', 'Alwar', 'Dausa', 'Kota', 'Ajmer'],
  Haryana: ['Gurugram', 'Faridabad', 'Rewari', 'Panipat', 'Sonipat'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Chhatarpur'],
};

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onSuccess, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suggested code generator
  const [code, setCode] = useState(() => `PRJ-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Project['category']>('Highways');
  const [ministry, setMinistry] = useState('Ministry of Road Transport & Highways (MoRTH)');
  const [corridor, setCorridor] = useState('Western Greenfield Economic Expressway Corridor');
  const [state, setState] = useState('Maharashtra');
  const [districts, setDistricts] = useState<string[]>(['Palghar', 'Thane']);
  const [customDistrict, setCustomDistrict] = useState('');
  const [totalAcres, setTotalAcres] = useState<number | ''>(1250);
  const [targetYear, setTargetYear] = useState('2028');
  const [budgetCr, setBudgetCr] = useState<number | ''>(4850);

  // Corridor Alignment Optimization State
  const [alignmentTab, setAlignmentTab] = useState<'optimizer' | 'upload'>('optimizer');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('PLG-BOISAR');
  const [originLat, setOriginLat] = useState<number>(19.7400);
  const [originLng, setOriginLng] = useState<number>(72.7800);
  const [destLat, setDestLat] = useState<number>(19.6800);
  const [destLng, setDestLng] = useState<number>(72.8800);
  const [corridorWidthM, setCorridorWidthM] = useState<number>(45);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [alignmentResult, setAlignmentResult] = useState<AlignmentOptimizationResult | null>(null);
  const [alignmentAdopted, setAlignmentAdopted] = useState<boolean>(false);

  // GIS File & Alignment preview state
  const [gisFileName, setGisFileName] = useState<string | null>(null);
  const [gisFileStatus, setGisFileStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [gisErrorMessage, setGisErrorMessage] = useState<string | null>(null);
  const [parsedParcels, setParsedParcels] = useState<Parcel[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = CORRIDOR_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setOriginLat(preset.origin[0]);
      setOriginLng(preset.origin[1]);
      setDestLat(preset.dest[0]);
      setDestLng(preset.dest[1]);
      setCorridorWidthM(preset.width);
      if (!name) setName(preset.corridorName);
      setCorridor(preset.corridorName);
      setAlignmentAdopted(false);
      setAlignmentResult(null);
    }
  };

  const handleRunAlignmentOptimization = async () => {
    setIsOptimizing(true);
    setAlignmentAdopted(false);
    try {
      const res = await suggestOptimalAlignment({
        originLat,
        originLng,
        destLat,
        destLng,
        corridorWidthM
      });
      setAlignmentResult(res);
    } catch (err) {
      console.error('Alignment optimization failed:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAdoptAlignment = () => {
    if (!alignmentResult) return;
    const opt = alignmentResult.comparison.optimized;
    if (opt.agriculturalAcresAffected > 0) {
      setTotalAcres(Math.round(opt.agriculturalAcresAffected * 1.5));
    }
    if (opt.estimatedCompensationCr > 0) {
      setBudgetCr(Math.round(opt.estimatedCompensationCr * 1.2));
    }
    setAlignmentAdopted(true);
  };


  // Add a district tag
  const handleAddDistrict = (dist: string) => {
    const trimmed = dist.trim();
    if (trimmed && !districts.includes(trimmed)) {
      setDistricts([...districts, trimmed]);
    }
    setCustomDistrict('');
  };

  const handleRemoveDistrict = (dist: string) => {
    setDistricts(districts.filter((d) => d !== dist));
  };

  // Convert raw geojson coordinates [lng, lat] to Leaflet coordinates [lat, lng]
  const normalizeCoords = (rawCoords: number[][]): [number, number][] => {
    return rawCoords.map((c) => {
      // In GeoJSON standard: c[0] is Longitude (approx 68-98 in India), c[1] is Latitude (approx 8-38 in India)
      if (c[0] > 40 && c[1] < 40) {
        return [c[1], c[0]];
      }
      return [c[0], c[1]];
    });
  };

  // Calculate centroid from polygon coordinates
  const calculateCentroid = (coords: [number, number][]): [number, number] => {
    if (coords.length === 0) return [19.6968, 72.7663];
    let sumLat = 0;
    let sumLng = 0;
    coords.forEach(([lat, lng]) => {
      sumLat += lat;
      sumLng += lng;
    });
    return [sumLat / coords.length, sumLng / coords.length];
  };

  // Parse GeoJSON object into Parcel array
  const parseGeoJsonObject = (geoJson: any, fileName: string) => {
    try {
      const features = geoJson.features || (geoJson.type === 'Feature' ? [geoJson] : []);
      if (!features || features.length === 0) {
        throw new Error('No polygon geometries or features detected in GeoJSON file.');
      }

      const generated: Parcel[] = [];

      features.forEach((feat: any, idx: number) => {
        const geom = feat.geometry || feat;
        if (!geom) return;

        let polygonRings: number[][] = [];
        if (geom.type === 'Polygon' && Array.isArray(geom.coordinates)) {
          polygonRings = geom.coordinates[0];
        } else if (geom.type === 'MultiPolygon' && Array.isArray(geom.coordinates)) {
          polygonRings = geom.coordinates[0][0];
        } else if (geom.type === 'LineString' && Array.isArray(geom.coordinates)) {
          // Convert line string buffer into closed loop for preview
          const line = geom.coordinates;
          polygonRings = [...line, ...line.slice().reverse().map(([x, y]: number[]) => [x + 0.0005, y + 0.0005]), line[0]];
        }

        if (polygonRings.length >= 3) {
          const latLngs = normalizeCoords(polygonRings);
          const centroid = calculateCentroid(latLngs);
          const props = feat.properties || {};
          const survey = props.surveyNo || props.name || `S-${201 + idx}/${idx + 1}`;
          const owner = props.owner || `Landowner Beneficiary #${idx + 1}`;
          const approxAcres = totalAcres && typeof totalAcres === 'number'
            ? (totalAcres / Math.max(features.length, 1)).toFixed(2)
            : '2.50';

          generated.push({
            id: `P-${code}-${idx + 1}`,
            surveyNo: survey,
            owner: owner,
            area: `${approxAcres} acres`,
            project: name || 'National Alignment Project',
            district: districts[0] || state,
            status: 'not_started',
            coordinates: latLngs,
            centroid: centroid,
            inspection: {
              required: true,
              reason: 'Initial Cadastral Alignment Ground Verification',
              priority: idx === 0 ? 'high' : 'medium',
              lastInspectedOn: null,
              assignedOfficer: null,
              dueDate: '2026-10-31',
            },
          });
        }
      });

      if (generated.length === 0) {
        throw new Error('No valid coordinate polygons could be extracted.');
      }

      setParsedParcels(generated);
      setGisFileName(fileName);
      setGisFileStatus('success');
      setGisErrorMessage(null);
    } catch (err: any) {
      setGisFileStatus('error');
      setGisErrorMessage(err.message || 'Failed to parse GIS file. Check file format.');
      setParsedParcels([]);
    }
  };

  // Simple KML coordinate parser fallback
  const parseKmlText = (kmlText: string, fileName: string) => {
    try {
      const coordMatches = kmlText.match(/<coordinates>([\s\S]*?)<\/coordinates>/gi);
      if (!coordMatches || coordMatches.length === 0) {
        throw new Error('No <coordinates> elements found in KML file.');
      }

      const generated: Parcel[] = [];

      coordMatches.forEach((match, idx) => {
        const raw = match.replace(/<\/?coordinates>/gi, '').trim();
        const tuples = raw.split(/\s+/).filter(Boolean);
        const points: [number, number][] = [];

        tuples.forEach((t) => {
          const parts = t.split(',').map(Number);
          if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            // KML is typically [lng, lat, alt]
            const lng = parts[0];
            const lat = parts[1];
            points.push([lat, lng]);
          }
        });

        if (points.length >= 3) {
          const centroid = calculateCentroid(points);
          generated.push({
            id: `P-KML-${code}-${idx + 1}`,
            surveyNo: `KML-${idx + 1}`,
            owner: `Survey Zone Node ${idx + 1}`,
            area: '3.10 acres',
            project: name || 'National Alignment Project',
            district: districts[0] || state,
            status: 'not_started',
            coordinates: points,
            centroid: centroid,
            inspection: {
              required: true,
              reason: 'KML Ground Demarcation',
              priority: 'medium',
              lastInspectedOn: null,
              assignedOfficer: null,
              dueDate: '2026-10-31',
            },
          });
        }
      });

      if (generated.length === 0) {
        throw new Error('Could not parse valid polygon vertices from KML.');
      }

      setParsedParcels(generated);
      setGisFileName(fileName);
      setGisFileStatus('success');
      setGisErrorMessage(null);
    } catch (err: any) {
      setGisFileStatus('error');
      setGisErrorMessage(err.message || 'Error reading KML coordinates.');
      setParsedParcels([]);
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGisFileStatus('parsing');
    setGisErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        setGisFileStatus('error');
        setGisErrorMessage('Uploaded file is empty.');
        return;
      }

      if (file.name.toLowerCase().endsWith('.kml')) {
        parseKmlText(content, file.name);
      } else {
        try {
          const parsedJson = JSON.parse(content);
          parseGeoJsonObject(parsedJson, file.name);
        } catch {
          setGisFileStatus('error');
          setGisErrorMessage('Invalid JSON syntax in .geojson file.');
        }
      }
    };

    reader.onerror = () => {
      setGisFileStatus('error');
      setGisErrorMessage('Failed to read file from storage.');
    };

    reader.readAsText(file);
  };

  // 1-Click Sample Preloader
  const handleLoadSampleGeoJson = () => {
    setGisFileStatus('parsing');
    setTimeout(() => {
      parseGeoJsonObject(SAMPLE_ALIGNMENT_GEOJSON, 'nhai_dme_sector_04_alignment.geojson');
    }, 150);
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError('Project Name is mandatory.');
      return;
    }

    if (!code.trim()) {
      setValidationError('Project Code is mandatory.');
      return;
    }

    if (!totalAcres || Number(totalAcres) <= 0) {
      setValidationError('Please enter a valid total acquisition acreage.');
      return;
    }

    if (!budgetCr || Number(budgetCr) <= 0) {
      setValidationError('Please specify the approved budget in ₹ Crores.');
      return;
    }

    if (districts.length === 0) {
      setValidationError('At least one beneficiary district must be selected.');
      return;
    }

    setIsSubmitting(true);

    const newProject: Project = {
      id: `PRJ-${Date.now().toString(36).toUpperCase()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      corridor: corridor.trim(),
      ministry: ministry.trim(),
      category: category,
      state: state,
      districts: districts,
      totalAcres: Number(totalAcres),
      acquiredAcres: 0,
      targetYear: targetYear.trim() || '2028',
      budgetCr: Number(budgetCr),
      disbursedCr: 0,
      affectedFamilies: Math.round(Number(totalAcres) * 0.82),
      rehabilitatedFamilies: 0,
      status: 'on_track' as ProjectStatus,
      riskScore: 10,
      riskFactors: ['Initial cadastral survey underway', 'Gazette Notification drafting'],
      bottlenecks: ['Awaiting preliminary joint survey with SLAO'],
    };

    // Update parcel project references
    const finalizedParcels = parsedParcels.map((p) => ({
      ...p,
      project: newProject.name,
      district: districts[0] || state,
    }));

    setTimeout(() => {
      onSuccess(newProject, finalizedParcels);
      setIsSubmitting(false);
    }, 250);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '2px', margin: '0 0 24px' }}>
      {/* Form Register Header */}
      <div className="gov-register-header" style={{ margin: '0', padding: '12px 16px 10px', borderBottom: '2px solid #0B3D66' }}>
        <div className="reg-meta">MINISTRY OF ROAD TRANSPORT &amp; HIGHWAYS / NHAI &bull; PROJECT INITIATION MODULE</div>
        <div className="reg-title">Register New National Infrastructure Project &amp; GIS Alignment</div>
        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
          Official registration form for implementing agencies pursuant to RFCTLARR Act 2013 &amp; PM GatiShakti National Master Plan.
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '16px 20px 24px' }}>
        {validationError && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #F87171',
              borderRadius: '2px',
              color: '#B91C1C',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <AlertTriangle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Section 1: Core Project Identification */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0B3D66', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '4px' }}>
            Section I: Project Identification &amp; Sponsoring Ministry
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {/* Project Name */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '4px' }}>
                Project Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Delhi–Amritsar–Katra Expressway (Phase II Greenfield Alignment)"
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>

            {/* Project Code */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '4px' }}>
                Project Code <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PRJ-2026-XXX"
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  border: '1px solid #CBD5E1',
                  borderRadius: '2px',
                  backgroundColor: '#F8FAFC',
                  color: '#0B3D66',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '4px' }}>
                Category <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Project['category'])}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none',
                }}
              >
                <option value="Highways">Highways</option>
                <option value="Railways">Railways</option>
                <option value="Energy">Energy</option>
                <option value="Water">Water</option>
                <option value="Industrial">Industrial</option>
                <option value="Aviation">Aviation</option>
              </select>
            </div>

            {/* Sponsoring Ministry */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '4px' }}>
                Sponsoring Ministry / Department <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                placeholder="Ministry of Road Transport & Highways"
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>

            {/* Economic Corridor */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '4px' }}>
                Corridor / Network Route <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={corridor}
                onChange={(e) => setCorridor(e.target.value)}
                placeholder="e.g. Northern Economic Corridor NH-44B"
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Jurisdictional Location & Targets */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0B3D66', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '4px' }}>
            Section II: Geography, Land Scope &amp; Financial Allocation
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {/* Primary State */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '4px' }}>
                Primary State <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                value={state}
                onChange={(e) => {
                  const newState = e.target.value;
                  setState(newState);
                  const suggested = STATE_DISTRICTS[newState];
                  if (suggested && suggested.length > 0) {
                    setDistricts(suggested.slice(0, 2));
                  }
                }}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none',
                }}
              >
                {MOCK_STATES.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.shortCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Total Acres */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '4px' }}>
                Total Target Land (Acres) <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={totalAcres}
                onChange={(e) => setTotalAcres(e.target.value ? Number(e.target.value) : '')}
                placeholder="1250"
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>

            {/* Target Completion Year */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '4px' }}>
                Target Year / Quarter <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                placeholder="2028"
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>

            {/* Budget (₹ Cr) */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '4px' }}>
                Approved Budget (₹ Cr) <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="number"
                step="1"
                min="1"
                required
                value={budgetCr}
                onChange={(e) => setBudgetCr(e.target.value ? Number(e.target.value) : '')}
                placeholder="4850"
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  fontSize: '13px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Districts Multi-Select */}
          <div style={{ marginTop: '12px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '4px' }}>
              Beneficiary Districts <span style={{ color: '#DC2626' }}>*</span>
            </label>

            {/* Selected Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
              {districts.map((dist) => (
                <span
                  key={dist}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '2px',
                    fontSize: '11.5px',
                    color: '#0B3D66',
                    fontWeight: 600,
                  }}
                >
                  <MapPin style={{ width: '11px', height: '11px' }} />
                  {dist}
                  <button
                    type="button"
                    onClick={() => handleRemoveDistrict(dist)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', color: '#64748B' }}
                    title={`Remove ${dist}`}
                  >
                    &times;
                  </button>
                </span>
              ))}

              {/* Add custom district input */}
              <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={customDistrict}
                  onChange={(e) => setCustomDistrict(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDistrict(customDistrict);
                    }
                  }}
                  placeholder="Type district..."
                  style={{
                    padding: '3px 8px',
                    fontSize: '11.5px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '2px',
                    width: '130px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddDistrict(customDistrict)}
                  className="gov-flat-btn gov-flat-btn-secondary"
                  style={{ fontSize: '11px', padding: '2px 8px', height: '24px' }}
                >
                  <Plus style={{ width: '12px', height: '12px' }} /> Add
                </button>
              </div>
            </div>

            {/* Suggested quick pills for selected state */}
            {STATE_DISTRICTS[state] && (
              <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Available in {state}:</span>
                {STATE_DISTRICTS[state].map((d) => {
                  const isSelected = districts.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => (isSelected ? handleRemoveDistrict(d) : handleAddDistrict(d))}
                      style={{
                        padding: '1px 6px',
                        fontSize: '10.5px',
                        borderRadius: '2px',
                        border: isSelected ? '1px solid #0B3D66' : '1px dashed #CBD5E1',
                        backgroundColor: isSelected ? '#1E4E79' : '#F8FAFC',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      {isSelected ? `✓ ${d}` : `+ ${d}`}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: GIS Alignment & AI Least-Cost Corridor Optimizer */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0B3D66', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Section III: Alignment Planning &amp; Cadastral Optimization</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setAlignmentTab('optimizer')}
                className="gov-flat-btn"
                style={{
                  fontSize: '10px',
                  padding: '2px 8px',
                  height: '22px',
                  backgroundColor: alignmentTab === 'optimizer' ? '#0B3D66' : '#F1F5F9',
                  color: alignmentTab === 'optimizer' ? '#FFFFFF' : '#475569',
                  border: '1px solid #CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Route style={{ width: '11px', height: '11px' }} />
                AI Least-Cost Optimizer (A*)
              </button>
              <button
                type="button"
                onClick={() => setAlignmentTab('upload')}
                className="gov-flat-btn"
                style={{
                  fontSize: '10px',
                  padding: '2px 8px',
                  height: '22px',
                  backgroundColor: alignmentTab === 'upload' ? '#0B3D66' : '#F1F5F9',
                  color: alignmentTab === 'upload' ? '#FFFFFF' : '#475569',
                  border: '1px solid #CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <UploadCloud style={{ width: '11px', height: '11px' }} />
                Upload .geojson / .kml
              </button>
            </div>
          </div>

          {/* Tab 1: AI Least-Cost Corridor Optimizer */}
          {alignmentTab === 'optimizer' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {/* Controls Column */}
                <div style={{ border: '1px solid #CBD5E1', borderRadius: '2px', padding: '14px', backgroundColor: '#F8FAFC' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0B3D66', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sliders style={{ width: '14px', height: '14px' }} />
                    Corridor Parameter Specification
                  </div>

                  {/* Preset Corridor Selector */}
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '3px' }}>
                      Corridor Alignment Preset
                    </label>
                    <select
                      value={selectedPresetId}
                      onChange={(e) => handleSelectPreset(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        fontSize: '11.5px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '2px',
                        backgroundColor: '#FFFFFF',
                        color: '#0F172A',
                      }}
                    >
                      {CORRIDOR_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Origin Coordinates */}
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '3px' }}>
                      Origin Node (A) [Lat / Lng]
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <input
                        type="number"
                        step="0.0001"
                        value={originLat}
                        onChange={(e) => setOriginLat(Number(e.target.value))}
                        style={{ padding: '5px 8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF' }}
                        placeholder="Origin Lat"
                      />
                      <input
                        type="number"
                        step="0.0001"
                        value={originLng}
                        onChange={(e) => setOriginLng(Number(e.target.value))}
                        style={{ padding: '5px 8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF' }}
                        placeholder="Origin Lng"
                      />
                    </div>
                  </div>

                  {/* Destination Coordinates */}
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '3px' }}>
                      Destination Node (B) [Lat / Lng]
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <input
                        type="number"
                        step="0.0001"
                        value={destLat}
                        onChange={(e) => setDestLat(Number(e.target.value))}
                        style={{ padding: '5px 8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF' }}
                        placeholder="Dest Lat"
                      />
                      <input
                        type="number"
                        step="0.0001"
                        value={destLng}
                        onChange={(e) => setDestLng(Number(e.target.value))}
                        style={{ padding: '5px 8px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF' }}
                        placeholder="Dest Lng"
                      />
                    </div>
                  </div>

                  {/* Right-of-Way Corridor Width */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '3px' }}>
                      Right-of-Way Corridor Width (Meters)
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[30, 45, 60, 75].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setCorridorWidthM(w)}
                          style={{
                            flex: 1,
                            padding: '4px',
                            fontSize: '11px',
                            fontWeight: corridorWidthM === w ? 700 : 500,
                            border: corridorWidthM === w ? '1px solid #0B3D66' : '1px solid #CBD5E1',
                            backgroundColor: corridorWidthM === w ? '#0B3D66' : '#FFFFFF',
                            color: corridorWidthM === w ? '#FFFFFF' : '#334155',
                            borderRadius: '2px',
                            cursor: 'pointer',
                          }}
                        >
                          {w}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Run Optimization Button */}
                  <button
                    type="button"
                    onClick={handleRunAlignmentOptimization}
                    disabled={isOptimizing}
                    className="gov-flat-btn gov-flat-btn-primary"
                    style={{ width: '100%', padding: '7px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw style={{ width: '13px', height: '13px', animation: 'spin 1s linear infinite' }} />
                        <span>Computing Least-Cost Path (A* Engine)...</span>
                      </>
                    ) : (
                      <>
                        <Route style={{ width: '14px', height: '14px' }} />
                        <span>Run Least-Cost Alignment Optimization</span>
                      </>
                    )}
                  </button>

                  <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '8px', lineHeight: '1.4' }}>
                    &bull; Tip: Click anywhere on the map to interactively update the destination coordinate.
                  </div>
                </div>

                {/* Map Preview Column */}
                <div style={{ border: '1px solid #CBD5E1', borderRadius: '2px', overflow: 'hidden', minHeight: '300px', position: 'relative', backgroundColor: '#E2E8F0' }}>
                  <div style={{ padding: '6px 10px', backgroundColor: '#0B3D66', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Compass style={{ width: '12px', height: '12px' }} />
                      Corridor Alignment Vector Visualizer
                    </span>
                    <span style={{ fontSize: '10px', color: '#93C5FD' }}>
                      {alignmentResult ? 'Optimization Vector Solved' : 'Awaiting Path Run'}
                    </span>
                  </div>

                  <div style={{ height: '280px' }}>
                    <ParcelMap
                      parcels={parsedParcels}
                      height="280px"
                      showLegend={true}
                      showControls={true}
                      defaultLayer="satellite"
                      straightPath={alignmentResult?.straightPath}
                      optimizedPath={alignmentResult?.optimizedPath}
                      alignmentOrigin={[originLat, originLng]}
                      alignmentDestination={[destLat, destLng]}
                      onMapClickForCoords={(lat, lng) => {
                        setDestLat(Number(lat.toFixed(4)));
                        setDestLng(Number(lng.toFixed(4)));
                        setAlignmentResult(null);
                        setAlignmentAdopted(false);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Statutory Corridor Comparison Register Table */}
              {alignmentResult && (
                <div style={{ marginTop: '14px', border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0B3D66', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck style={{ width: '14px', height: '14px', color: '#0B3D66' }} />
                      RFCTLARR 2013 STATUTORY CORRIDOR COMPARISON REGISTER
                    </div>
                    <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>
                      ESTIMATED COMPENSATION REDUCTION: ₹{alignmentResult.comparison.compensationSavingsCr.toFixed(2)} Cr ({alignmentResult.comparison.percentCompensationSaved}%)
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table className="gov-stage-register" style={{ width: '100%', fontSize: '12px', tableLayout: 'fixed' }}>
                      <colgroup>
                        <col style={{ width: '28%' }} />
                        <col style={{ width: '24%' }} />
                        <col style={{ width: '24%' }} />
                        <col style={{ width: '24%' }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>ASSESSMENT PARAMETER</th>
                          <th>UNCONSTRAINED BASELINE</th>
                          <th>LEAST-COST ALIGNMENT (A*)</th>
                          <th>STATUTORY SAVINGS / DELTA</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: 600 }}>Total Corridor Length</td>
                          <td>{alignmentResult.comparison.baseline.distanceKm.toFixed(2)} km</td>
                          <td style={{ fontWeight: 700, color: '#0B3D66' }}>{alignmentResult.comparison.optimized.distanceKm.toFixed(2)} km</td>
                          <td style={{ color: '#475569' }}>+{alignmentResult.comparison.lengthDeltaKm} km detour parallel to infrastructure</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 600 }}>Cadastral Parcels Impacted</td>
                          <td>{alignmentResult.comparison.baseline.parcelsAffected} parcels</td>
                          <td style={{ fontWeight: 700, color: '#0B3D66' }}>{alignmentResult.comparison.optimized.parcelsAffected} parcels</td>
                          <td style={{ color: '#16A34A', fontWeight: 700 }}>
                            {alignmentResult.comparison.parcelsSaved > 0 ? `-${alignmentResult.comparison.parcelsSaved} parcels` : 'Parity'}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 600 }}>Prime Agricultural Land Acquired</td>
                          <td>{alignmentResult.comparison.baseline.agriculturalAcresAffected.toFixed(2)} Acres</td>
                          <td style={{ fontWeight: 700, color: '#0B3D66' }}>{alignmentResult.comparison.optimized.agriculturalAcresAffected.toFixed(2)} Acres</td>
                          <td style={{ color: '#16A34A', fontWeight: 700 }}>
                            {alignmentResult.comparison.agriculturalAcresSaved > 0 ? `-${alignmentResult.comparison.agriculturalAcresSaved} Acres Protected` : '0 Acres'}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 600 }}>High-Litigation Disputed Parcels</td>
                          <td>{alignmentResult.comparison.baseline.disputedParcelsAffected} parcels</td>
                          <td style={{ fontWeight: 700, color: '#0B3D66' }}>{alignmentResult.comparison.optimized.disputedParcelsAffected} parcels</td>
                          <td style={{ color: '#16A34A', fontWeight: 700 }}>
                            {alignmentResult.comparison.disputedParcelsAvoided > 0 ? `-${alignmentResult.comparison.disputedParcelsAvoided} Stay Orders Avoided` : '0'}
                          </td>
                        </tr>
                        <tr style={{ backgroundColor: '#F0FDF4' }}>
                          <td style={{ fontWeight: 700, color: '#065F46' }}>Estimated Statutory Compensation</td>
                          <td style={{ fontWeight: 600 }}>₹ {alignmentResult.comparison.baseline.estimatedCompensationCr.toFixed(2)} Cr</td>
                          <td style={{ fontWeight: 700, color: '#0B3D66' }}>₹ {alignmentResult.comparison.optimized.estimatedCompensationCr.toFixed(2)} Cr</td>
                          <td style={{ color: '#15803D', fontWeight: 700 }}>
                            -₹ {alignmentResult.comparison.compensationSavingsCr.toFixed(2)} Cr (-{alignmentResult.comparison.percentCompensationSaved}%)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                    {alignmentAdopted ? (
                      <span className="gov-status-completed" style={{ fontSize: '11.5px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                        Optimized Scope &amp; Budget Adopted into Project Form
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAdoptAlignment}
                        className="gov-flat-btn gov-flat-btn-success"
                        style={{ fontSize: '11.5px', padding: '5px 14px' }}
                      >
                        <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                        Adopt Optimized Alignment into Project Scope
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Upload Vector Alignment File */}
          {alignmentTab === 'upload' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {/* Upload Box */}
              <div style={{ border: '1px dashed #94A3B8', borderRadius: '2px', padding: '16px', backgroundColor: '#F8FAFC', textAlign: 'center' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".geojson,.kml,application/json,application/vnd.google-earth.kml+xml"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />

                <UploadCloud style={{ width: '32px', height: '32px', color: '#0B3D66', margin: '0 auto 8px' }} />
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>
                  Upload Project Alignment File
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px', marginBottom: '12px' }}>
                  Drag &amp; drop standard <code>.geojson</code> or <code>.kml</code> cadastral alignment polygon data.
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="gov-flat-btn gov-flat-btn-primary"
                    style={{ fontSize: '11.5px', padding: '6px 14px' }}
                  >
                    <FileText style={{ width: '13px', height: '13px' }} /> Choose Local File
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadSampleGeoJson}
                    className="gov-flat-btn gov-flat-btn-secondary"
                    style={{ fontSize: '11.5px', padding: '6px 12px' }}
                  >
                    Preload Sample
                  </button>
                </div>

                {/* Status readout */}
                {gisFileStatus === 'success' && gisFileName && (
                  <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '2px', fontSize: '11.5px', color: '#065F46', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                      <CheckCircle2 style={{ width: '14px', height: '14px', color: '#059669' }} />
                      <span>Parsed Alignment: {gisFileName}</span>
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '11px', color: '#047857' }}>
                      &bull; {parsedParcels.length} Cadastral Polygons Detected &bull; Centroid: [{parsedParcels[0]?.centroid[0].toFixed(4)}, {parsedParcels[0]?.centroid[1].toFixed(4)}]
                    </div>
                  </div>
                )}

                {gisFileStatus === 'error' && (
                  <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '2px', fontSize: '11.5px', color: '#991B1B', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                      <AlertTriangle style={{ width: '14px', height: '14px' }} />
                      <span>GIS Parsing Warning</span>
                    </div>
                    <div style={{ marginTop: '4px' }}>{gisErrorMessage}</div>
                  </div>
                )}
              </div>

              {/* Live Map Preview */}
              <div style={{ border: '1px solid #CBD5E1', borderRadius: '2px', overflow: 'hidden', minHeight: '260px', position: 'relative', backgroundColor: '#E2E8F0' }}>
                <div style={{ padding: '6px 10px', backgroundColor: '#0B3D66', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Compass style={{ width: '12px', height: '12px' }} />
                    Live GIS Alignment Preview
                  </span>
                  <span style={{ fontSize: '10px', color: '#93C5FD' }}>
                    {parsedParcels.length} Boundary Features Rendered
                  </span>
                </div>

                {parsedParcels.length > 0 ? (
                  <div style={{ height: '240px' }}>
                    <ParcelMap
                      parcels={parsedParcels}
                      height="240px"
                      showLegend={true}
                      showControls={true}
                      defaultLayer="satellite"
                    />
                  </div>
                ) : (
                  <div style={{ height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748B', padding: '20px', textAlign: 'center' }}>
                    <Compass style={{ width: '32px', height: '32px', color: '#94A3B8', marginBottom: '8px' }} />
                    <div style={{ fontWeight: 700, fontSize: '12px' }}>No GIS Alignment Loaded Yet</div>
                    <div style={{ fontSize: '11px', marginTop: '4px', maxWidth: '280px' }}>
                      Upload a <code>.geojson</code> file or click &quot;Load Sample NHAI GeoJSON&quot; to inspect boundary polygons on the satellite map.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>


        {/* Section 4: Review Facts Table (Government Register Preview) */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0B3D66', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '4px' }}>
            Section IV: Project Registration Summary Review
          </div>

          <table className="gov-facts-table" style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
            <colgroup>
              <col style={{ width: '18%' }} />
              <col style={{ width: '32%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '32%' }} />
            </colgroup>
            <thead>
              <tr>
                <th className="th-field">FIELD</th>
                <th className="th-value">SPECIFIED VALUE</th>
                <th className="th-field">FIELD</th>
                <th className="th-value">SPECIFIED VALUE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td-label">Project Code</td>
                <td className="td-value" style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0B3D66' }}>
                  {code || '—'}
                </td>
                <td className="td-label">Category / Sector</td>
                <td className="td-value">
                  <span className="gov-status-current">{category}</span>
                </td>
              </tr>
              <tr>
                <td className="td-label">Project Name</td>
                <td className="td-value" colSpan={3} style={{ fontWeight: 600 }}>
                  {name || '<Project Name Pending Input>'}
                </td>
              </tr>
              <tr>
                <td className="td-label">Ministry / Authority</td>
                <td className="td-value">{ministry || '—'}</td>
                <td className="td-label">Corridor Name</td>
                <td className="td-value">{corridor || '—'}</td>
              </tr>
              <tr>
                <td className="td-label">State &amp; Districts</td>
                <td className="td-value">
                  {state} ({districts.join(', ') || 'None'})
                </td>
                <td className="td-label">Acquisition Scope</td>
                <td className="td-value" style={{ fontWeight: 700 }}>
                  {totalAcres ? `${Number(totalAcres).toLocaleString()} Acres` : '—'}
                </td>
              </tr>
              <tr>
                <td className="td-label">Target Completion</td>
                <td className="td-value">{targetYear || '—'}</td>
                <td className="td-label">Approved Budget</td>
                <td className="td-value" style={{ fontWeight: 700, color: '#0B3D66' }}>
                  {budgetCr ? `₹${Number(budgetCr).toLocaleString()} Cr` : '—'}
                </td>
              </tr>
              <tr>
                <td className="td-label">GIS Cadastre Seed</td>
                <td className="td-value" colSpan={3}>
                  {parsedParcels.length > 0 ? (
                    <span className="gov-status-completed">
                      ✓ {parsedParcels.length} Cadastral Parcels extracted from {gisFileName || 'GeoJSON'}
                    </span>
                  ) : (
                    <span className="gov-status-pending">
                      Pending Alignment File Upload (will default to boundary centroid)
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Bar (Flat Government Buttons) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', paddingTop: '16px', borderTop: '1px solid #CBD5E1' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="gov-flat-btn gov-flat-btn-secondary"
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            Cancel / Back to Register
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="gov-flat-btn gov-flat-btn-primary"
            style={{ padding: '8px 22px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isSubmitting ? (
              <span>Registering Project...</span>
            ) : (
              <>
                <span>Create Project &amp; Register Alignment</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
