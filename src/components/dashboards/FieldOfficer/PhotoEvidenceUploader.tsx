import React, { useState } from 'react';
import type { FieldParcel, PhotoEvidence } from '../../../types';
import { Camera, Upload } from 'lucide-react';
import { SafeImage } from '../../common/SafeImage';

interface PhotoEvidenceUploaderProps {
  parcel: FieldParcel;
  onAddPhoto: (photo: PhotoEvidence) => void;
}

export const PhotoEvidenceUploader: React.FC<PhotoEvidenceUploaderProps> = ({
  parcel,
  onAddPhoto,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Boundary' | 'Crops' | 'Structure' | 'Neighboring'>('Boundary');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<PhotoEvidence[]>(parcel.photos || [
    {
      id: 'P1',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop&q=80',
      timestamp: '27 Aug 2026, 11:22 AM',
      coordinates: '19.6967° N, 72.7654° E',
      category: 'Boundary',
      notes: 'North-East boundary peg installed near irrigation canal',
    },
    {
      id: 'P2',
      url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&auto=format&fit=crop&q=80',
      timestamp: '27 Aug 2026, 11:25 AM',
      coordinates: '19.6971° N, 72.7658° E',
      category: 'Crops',
      notes: 'Paddy crop standing at flowering stage — harvest estimated in 45 days',
    },
  ]);

  const categories: ('Boundary' | 'Crops' | 'Structure' | 'Neighboring')[] = [
    'Boundary', 'Crops', 'Structure', 'Neighboring',
  ];

  const handleCapture = () => {
    const newPhoto: PhotoEvidence = {
      id: `P${photos.length + 1}`,
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80',
      timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      coordinates: `${(19.6968 + (Math.random() - 0.5) * 0.001).toFixed(4)}° N, ${(72.7663 + (Math.random() - 0.5) * 0.001).toFixed(4)}° E`,
      category: selectedCategory,
      notes: notes || `${selectedCategory} evidence geotagged at corner monument`,
    };

    setPhotos([newPhoto, ...photos]);
    onAddPhoto(newPhoto);
    setNotes('');
  };

  return (
    <div style={{ border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF', padding: '14px 16px', marginBottom: '12px' }}>
      {/* Header */}
      <div className="gov-register-header" style={{ margin: '0 0 10px 0' }}>
        <div className="reg-meta">GEOTAGGED PHOTO &amp; ASSET EVIDENCE &bull; NavIC TIMESTAMPED &bull; {photos.length} Photos Attached</div>
        <div className="reg-title">Field Evidence Uploader &amp; Valuation Dossier</div>
      </div>

      {/* Category Selector + Capture Form */}
      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '2px', padding: '12px', marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
          Select Asset Evidence Category:
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" style={{ marginBottom: '10px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`gov-flat-btn ${selectedCategory === cat ? 'gov-flat-btn-primary' : 'gov-flat-btn-secondary'}`}
              style={{ justifyContent: 'center', padding: '6px 12px', fontSize: '11px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter observation notes (e.g. Boundary peg placed near well, 14 teak trees standing)..."
            className="gov-input flex-1"
          />
          <button
            onClick={handleCapture}
            className="gov-flat-btn gov-flat-btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            <Camera style={{ width: '14px', height: '14px' }} />
            Capture &amp; Geotag Photo
          </button>
        </div>
      </div>

      {/* Photo Register Table */}
      <div className="gov-section-divider" style={{ marginTop: '0' }}>
        <span className="section-label">ATTACHED FIELD EVIDENCE DOSSIER</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="gov-stage-register" style={{ fontSize: '12px', tableLayout: 'fixed', width: '100%' }}>
          <colgroup>
            <col style={{ width: '50px' }} />
            <col style={{ width: '95px' }} />
            <col style={{ width: '140px' }} />
            <col style={{ width: '140px' }} />
            <col style={{ width: 'auto' }} />
            <col style={{ width: '75px' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>ID</th>
              <th style={{ width: '95px' }}>Category</th>
              <th style={{ width: '140px' }}>Coordinates</th>
              <th style={{ width: '140px' }}>Timestamp</th>
              <th>Notes</th>
              <th style={{ width: '75px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {photos.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 700, verticalAlign: 'middle' }}>{item.id}</td>
                <td style={{ fontWeight: 600, color: '#0B3D66', verticalAlign: 'middle' }}>{item.category}</td>
                <td style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600, verticalAlign: 'middle' }}>{item.coordinates}</td>
                <td style={{ fontSize: '11.5px', color: '#64748B', verticalAlign: 'middle' }}>{item.timestamp}</td>
                <td style={{ fontSize: '11.5px', color: '#475569', verticalAlign: 'middle' }}>{item.notes}</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gov-flat-btn gov-flat-btn-secondary"
                    style={{ fontSize: '10px', padding: '2px 8px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
