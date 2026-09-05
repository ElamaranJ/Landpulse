import React, { useState } from 'react';
import { AssignedParcelsList } from './AssignedParcelsList';
import { GPSCaptureSimulator } from './GPSCaptureSimulator';
import { PhotoEvidenceUploader } from './PhotoEvidenceUploader';
import { VerificationActions } from './VerificationActions';
import { MOCK_FIELD_PARCELS } from '../../../data/mockData';
import { FieldParcel, PhotoEvidence } from '../../../types';

export const FieldOfficerDashboard: React.FC = () => {
  const [parcels, setParcels] = useState<FieldParcel[]>(MOCK_FIELD_PARCELS);
  const [selectedParcel, setSelectedParcel] = useState<FieldParcel>(MOCK_FIELD_PARCELS[0]);

  const handleUpdateCoordinates = (coords: { lat: number; lng: number; accuracyMeters: number }) => {
    setSelectedParcel((prev) => ({
      ...prev,
      gpsCoords: coords,
      verificationStatus: 'GPS_CAPTURED',
    }));
  };

  const handleAddPhoto = (photo: PhotoEvidence) => {
    setSelectedParcel((prev) => ({
      ...prev,
      photos: [photo, ...prev.photos],
    }));
  };

  const handleCompleteVerification = () => {
    const updated = {
      ...selectedParcel,
      verificationStatus: 'VERIFIED' as const,
      dueHours: 0,
    };
    setSelectedParcel(updated);
    setParcels((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleFlagObjection = () => {
    const updated = {
      ...selectedParcel,
      verificationStatus: 'OBJECTION_FLAGGED' as const,
    };
    setSelectedParcel(updated);
    setParcels((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <div className="space-y-4">
      {/* 2-column layout: Mobile roster left, Active Survey workstation right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Assigned Parcels Roster (4 cols) */}
        <div className="lg:col-span-4">
          <AssignedParcelsList
            parcels={parcels}
            selectedParcelId={selectedParcel.id}
            onSelectParcel={setSelectedParcel}
          />
        </div>

        {/* Right Column: Active Parcel Inspection Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <GPSCaptureSimulator
            parcel={selectedParcel}
            onUpdateCoordinates={handleUpdateCoordinates}
          />
          <PhotoEvidenceUploader
            parcel={selectedParcel}
            onAddPhoto={handleAddPhoto}
          />
          <VerificationActions
            parcel={selectedParcel}
            onCompleteVerification={handleCompleteVerification}
            onFlagObjection={handleFlagObjection}
          />
        </div>
      </div>
    </div>
  );
};
