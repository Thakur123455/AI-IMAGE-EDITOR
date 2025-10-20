import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import { ZoomControls } from './ZoomControls';

export interface ImageEditorRef {
  getMaskDataUrl: () => string | null;
  clearMask: () => void;
}

interface ImageEditorProps {
  imageUrl: string;
  brushSize: number;
}

export const ImageEditor = forwardRef<ImageEditorRef, ImageEditorProps>(({ imageUrl, brushSize }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);

  const syncCanvasSize = useCallback(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;

    const { width, height } = image.getBoundingClientRect();
    if (canvas.width !== width || canvas.height !== height) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(tempCanvas, 0, 0, width, height);
      }
    }
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const handleImageLoad = () => {
      // Defer to allow layout to settle
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { width, height } = image.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }, 0);
    };

    image.addEventListener('load', handleImageLoad);
    if (image.complete) {
        handleImageLoad();
    }
    
    const resizeObserver = new ResizeObserver(syncCanvasSize);
    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      image.removeEventListener('load', handleImageLoad);
      resizeObserver.disconnect();
    };
  }, [imageUrl, syncCanvasSize]);


  useImperativeHandle(ref, () => ({
    getMaskDataUrl: () => {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      if (!canvas || !image || !image.naturalWidth) return null;

      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = image.naturalWidth;
      maskCanvas.height = image.naturalHeight;
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return null;

      // Draw the user's translucent mask, scaled to the original image size
      maskCtx.drawImage(canvas, 0, 0, maskCanvas.width, maskCanvas.height);

      // Process the image data to create a pure black and white mask
      const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // If the pixel has any transparency (alpha > 0), it was drawn on
        if (data[i + 3] > 0) {
          // Set to white
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          // Set to black
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
        }
        // Make all pixels fully opaque for the mask
        data[i + 3] = 255;
      }
      maskCtx.putImageData(imageData, 0, 0);

      return maskCanvas.toDataURL('image/png');
    },
    clearMask: () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    },
  }));

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const pos = getPointerPos(e);
    if (!ctx || !pos || !lastPos) return;

    ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)'; // Indigo-400 with opacity
    ctx.lineWidth = brushSize / zoom;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setLastPos(pos);
  };
  
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPointerPos(e);
    if (!pos) return;
    setIsDrawing(true);
    setLastPos(pos);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if(ctx) {
      ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, (brushSize / zoom) / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
  };
  
  return (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center p-2 relative">
       <div className="w-full h-full overflow-auto" ref={containerRef}>
         <div 
          className="relative w-max h-max mx-auto my-auto"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Editable"
            className="block max-w-full max-h-[70vh] object-contain select-none"
            style={{ imageRendering: 'pixelated' }}
            draggable="false"
            crossOrigin="anonymous"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair"
          />
        </div>
      </div>
       <ZoomControls zoom={zoom} onZoomChange={setZoom} />
    </div>
  );
});

ImageEditor.displayName = 'ImageEditor';
