import React, { useState } from 'react';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackText?: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackText,
  className = '',
  containerClassName = '',
  fallbackSrc,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`relative overflow-hidden bg-slate-100 flex items-center justify-center ${containerClassName}`}>
      {/* Loading Skeleton Shimmer */}
      {loading && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse flex items-center justify-center z-10">
          <ImageIcon className="w-8 h-8 text-slate-300 animate-bounce" />
        </div>
      )}

      {/* Error / Fallback View */}
      {error ? (
        <div className="w-full h-full min-h-[140px] bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-3 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-1.5">
            <ImageIcon className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-700 font-sans line-clamp-1">{alt || 'National Infrastructure Photo'}</span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{fallbackText || 'Official Government Archive'}</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          {...props}
        />
      )}
    </div>
  );
};
