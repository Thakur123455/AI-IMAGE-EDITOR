import React from 'react';
import { Spinner } from './Spinner';

interface ResultDisplayProps {
  editedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ editedImage, isLoading, error }) => {
  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center p-4 min-h-[300px] lg:min-h-full">
      {isLoading && (
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Editing your image, please wait...</p>
        </div>
      )}
      {error && !isLoading && (
        <div className="text-center text-red-500 dark:text-red-400">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      {!isLoading && !error && editedImage && (
        <div className="w-full h-full flex flex-col items-center justify-between">
           <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Result</p>
          <img src={editedImage} alt="Edited result" className="max-w-full max-h-[70vh] object-contain rounded-md" />
          <button
            onClick={handleDownload}
            className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-green-500"
          >
            Download Image
          </button>
        </div>
      )}
      {!isLoading && !error && !editedImage && (
        <div className="text-center text-gray-400 dark:text-gray-500">
          <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="mt-4">Your edited image will appear here.</p>
        </div>
      )}
    </div>
  );
};