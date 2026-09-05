import React from 'react';
import { GovHeroBanner } from '../../layout/GovHeroBanner';
import { GovColoredCardGrid } from './GovColoredCardGrid';

export const GovPortalHome: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* 1. Full-Width Photographic Inauguration Banner Carousel */}
      <GovHeroBanner />

      {/* 2. The 8-Card Colored Grid (4 columns x 2 rows, matching Tamil Nadu portal reference) */}
      <GovColoredCardGrid />
    </div>
  );
};
