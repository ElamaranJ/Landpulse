import React, { useState } from 'react';
import type { FieldParcel, PhotoEvidence } from '../../../types';
import { Camera, MapPin, Tag, Plus, CheckCircle2, Trash2 } from 'lucide-react';
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
    'Boundary',
    'Crops',
    'Structure',
    'Neighboring',
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
    <div className="gov-card p-6 sm:p-7 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg sm:text-xl font-bold text-[#0B3D66] font-sans tracking-tight">
              Geotagged Photo &amp; Asset Evidence Uploader
            </h3>
            <span className="gov-badge gov-badge-info">GEOTAGGED</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">NavIC timestamped spatial evidence for crop, structure, and tree compensation valuation</p>
        </div>
        <span className="gov-badge gov-badge-neutral font-mono self-start sm:self-auto">
          {photos.length} Photos Attached
        </span>
      </div>

      <div className="space-y-6">
        {/* Category Selector + Capture Form */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-5">
          <label className="block text-xs font-bold text-slate-600 uppercase font-mono mb-2.5">
            Select Asset Evidence Category:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-11 px-4 rounded-lg font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 border ${
                  selectedCategory === cat
                    ? 'bg-[#0B3D66] text-white border-[#072742] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter observation notes (e.g. Boundary peg placed near well, 14 teak trees standing)..."
              className="gov-input flex-1"
            />

            <button
              onClick={handleCapture}
              className="h-11 px-6 bg-[#0B3D66] hover:bg-[#072742] text-white font-bold text-xs uppercase rounded-lg flex items-center justify-center gap-2 shrink-0 shadow-xs transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>Capture &amp; Geotag Photo</span>
            </button>
          </div>
        </div>

        {/* Attached Photos Grid with 24px Gap */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider mb-3">
            Attached Field Evidence Dossier:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((item) => (
              <div key={item.id} className="gov-card overflow-hidden flex flex-col justify-between">
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <SafeImage
                    src={item.url}
                    alt={item.category}
                    fallbackText="Survey Evidence Photo"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#0B3D66] text-white text-[10px] font-bold font-mono px-2.5 py-1 rounded-md shadow-sm">
                    {item.category.toUpperCase()}
                  </span>
                </div>

                <div className="p-4 text-xs space-y-1.5">
                  <p className="font-bold text-slate-900 line-clamp-2 leading-snug">{item.notes}</p>
                  <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-100">
                    <span className="block font-bold text-[#0B3D66]">{item.coordinates}</span>
                    <span className="block text-slate-400 mt-0.5">{item.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
