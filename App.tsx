import React, { useState, useRef, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageEditor, type ImageEditorRef } from './components/ImageEditor';
import { PromptControls } from './components/PromptControls';
import { ResultDisplay } from './components/ResultDisplay';
import { editImageWithMask } from './services/geminiService';
import { Logo } from './components/Logo';
import { Footer } from './components/Footer';
import { ThemeToggler } from './components/ThemeToggler';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [displayImage, setDisplayImage] = useState<string | null>(null); // For filtered image
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(40);
  const [filter, setFilter] = useState('none');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  const imageEditorRef = useRef<ImageEditorRef>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (!originalImage) return;

    if (filter === 'none') {
      setDisplayImage(originalImage);
      return;
    }

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      
      const filterValue = 
        filter === 'grayscale' ? 'grayscale(100%)' :
        filter === 'sepia'     ? 'sepia(100%)' :
        filter === 'invert'    ? 'invert(100%)' :
        'none';
      
      ctx.filter = filterValue;
      ctx.drawImage(image, 0, 0);
      setDisplayImage(canvas.toDataURL());
    };
    image.src = originalImage;
  }, [originalImage, filter]);


  const handleImageUpload = (imageDataUrl: string) => {
    setOriginalImage(imageDataUrl);
    setDisplayImage(imageDataUrl);
    setEditedImage(null);
    setError(null);
    setFilter('none');
  };

  const handleGenerate = async (prompt: string) => {
    if (!displayImage || !imageEditorRef.current) {
      setError("Please upload an image and select an area to edit.");
      return;
    }

    const maskDataUrl = imageEditorRef.current.getMaskDataUrl();
    if (!maskDataUrl) {
      setError("Please select an area on the image to edit before generating.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const result = await editImageWithMask(displayImage, maskDataUrl, prompt);
      setEditedImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setDisplayImage(null);
    setEditedImage(null);
    setError(null);
    setIsLoading(false);
    setFilter('none');
    if(imageEditorRef.current) {
      imageEditorRef.current.clearMask();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <Logo />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">AI Image Editor</h1>
          </div>
          <div className="flex items-center space-x-4">
            {originalImage && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-indigo-500"
              >
                Start Over
              </button>
            )}
            <ThemeToggler theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto flex-grow p-4 sm:p-6 lg:p-8">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-4">
               {displayImage && <ImageEditor ref={imageEditorRef} imageUrl={displayImage} brushSize={brushSize} />}
               <PromptControls 
                isLoading={isLoading} 
                onGenerate={handleGenerate}
                brushSize={brushSize}
                onBrushSizeChange={setBrushSize}
                onClearMask={() => imageEditorRef.current?.clearMask()}
                selectedFilter={filter}
                onFilterChange={setFilter}
              />
            </div>
            <div className="flex flex-col">
              <ResultDisplay 
                editedImage={editedImage} 
                isLoading={isLoading} 
                error={error} 
              />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default App;