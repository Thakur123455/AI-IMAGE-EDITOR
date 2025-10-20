import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
        <p className="text-sm">
          Built with the power of Google's Gemini API. This is a creative tool for image inpainting and editing.
        </p>
        <div className="mt-4">
          <a 
            href="https://ai.google.dev/gemini-api/docs/models/gemini-flash#gemini-2.5-flash-image" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
          >
            Learn more about the Gemini Flash Image model
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-600 dark:text-gray-500">
          © {new Date().getFullYear()} AI Image Editor. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};