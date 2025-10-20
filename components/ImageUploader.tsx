import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false
  });

  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div
        {...getRootProps()}
        className={`w-full max-w-2xl p-10 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors
        ${isDragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4H7z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v4m0 0l-2-2m2 2l2-2"></path></svg>
          {isDragActive ? (
            <p className="text-lg text-indigo-500 dark:text-indigo-400">Drop the image here ...</p>
          ) : (
            <p className="text-lg text-gray-500 dark:text-gray-400">Drag & drop an image here, or click to select</p>
          )}
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Supports JPG, PNG</p>
        </div>
      </div>
    </div>
  );
};