import React, { useState } from 'react';

interface PromptControlsProps {
  isLoading: boolean;
  onGenerate: (prompt: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onClearMask: () => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const PromptControls: React.FC<PromptControlsProps> = ({ 
  isLoading, 
  onGenerate, 
  brushSize, 
  onBrushSizeChange, 
  onClearMask,
  selectedFilter,
  onFilterChange 
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700 space-y-4">
      <div className="space-y-2">
        <label htmlFor="filter-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Apply a Filter</label>
        <select
          id="filter-select"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
          disabled={isLoading}
        >
          <option value="none">None</option>
          <option value="grayscale">Grayscale</option>
          <option value="sepia">Sepia</option>
          <option value="invert">Invert</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="brush-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brush Size: {brushSize}px</label>
        <div className="flex items-center space-x-4">
            <input
                id="brush-size"
                type="range"
                min="5"
                max="100"
                value={brushSize}
                onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                disabled={isLoading}
            />
            <button
              onClick={onClearMask}
              className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors whitespace-nowrap"
              disabled={isLoading}
            >
              Clear Mask
            </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Describe your edit:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='e.g., "make the shirt red" or "add a cat wearing a hat"'
            rows={3}
            className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-indigo-500"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>
    </div>
  );
};