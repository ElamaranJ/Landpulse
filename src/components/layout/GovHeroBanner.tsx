import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SafeImage } from '../common/SafeImage';

export const GovHeroBanner: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    [
      {
        url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&auto=format&fit=crop&q=80",
        fallback: "https://picsum.photos/seed/expressway-corridor/1200/800",
        caption: "PM inaugurates new Greenfield Expressway Corridor & Compensation Award Ceremony",
      },
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&auto=format&fit=crop&q=80",
        fallback: "https://picsum.photos/seed/freight-terminal/1200/800",
        caption: "Multi-Modal Freight Logistic Terminal Fleet Flagoff — PM GatiShakti NMP",
      },
      {
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
        fallback: "https://picsum.photos/seed/dgps-survey/1200/800",
        caption: "High-Precision NavIC DGPS Cadastral Land Survey Launch for Western DFC",
      },
    ],
    [
      {
        url: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1200&auto=format&fit=crop&q=80",
        fallback: "https://picsum.photos/seed/compensation-ceremony/1200/800",
        caption: "Direct Benefit Transfer (DBT) PFMS Compensation Disbursement to 4,800 Landowners",
      },
      {
        url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80",
        fallback: "https://picsum.photos/seed/housing-township/1200/800",
        caption: "Model R&R Township Infrastructure & Housing Allotment Ceremony",
      },
      {
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80",
        fallback: "https://picsum.photos/seed/infrastructure-council/1200/800",
        caption: "State High-Level Infrastructure Land Coordination Council Meeting",
      },
    ],
  ];

  const current = slides[activeSlide];

  return (
    <div className="w-full bg-[#E5E7EB] relative overflow-hidden select-none border-b-2 border-slate-300">
      {/* 3 Side-by-side photos spanning full width with generous desktop height */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 h-80 sm:h-96 md:h-[380px] lg:h-[420px] 2xl:h-[480px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-white">
        {current.map((img, idx) => (
          <div key={idx} className="relative overflow-hidden bg-slate-100 h-full group">
            <SafeImage
              src={img.url}
              fallbackSrc={img.fallback}
              alt={img.caption}
              fallbackText="DoLR Project Archives"
              containerClassName="w-full h-full"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            {/* Caption strip */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-5 sm:p-6 z-10">
              <p className="text-base sm:text-lg font-sans font-semibold text-white line-clamp-2 drop-shadow-md">
                {img.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next overlay arrows */}
      <button
        onClick={() => setActiveSlide((p) => (p === 0 ? slides.length - 1 : p - 1))}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center shadow-xl z-20 transition-all hover:scale-105"
        title="Previous Photos"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>
      <button
        onClick={() => setActiveSlide((p) => (p === slides.length - 1 ? 0 : p + 1))}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center shadow-xl z-20 transition-all hover:scale-105"
        title="Next Photos"
      >
        <ChevronRight className="w-7 h-7" />
      </button>
    </div>
  );
};
