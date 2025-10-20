import React from 'react';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (newZoom: number) => void;
}

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;

export const ZoomControls: React.FC<ZoomControlsProps> = ({ zoom, onZoomChange }) => {
  const handleZoomIn = () => {
    onZoomChange(Math.min(MAX_ZOOM, zoom + ZOOM_STEP));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(MIN_ZOOM, zoom - ZOOM_STEP));
  };

  const handleResetZoom = () => {
    onZoomChange(1);
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg flex items-center p-1 space-x-1">
      <button
        onClick={handleZoomOut}
        disabled={zoom <= MIN_ZOOM}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Zoom out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>
      <button 
        onClick={handleResetZoom}
        className="w-12 h-8 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        onClick={handleZoomIn}
        disabled={zoom >= MAX_ZOOM}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Zoom in"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};
