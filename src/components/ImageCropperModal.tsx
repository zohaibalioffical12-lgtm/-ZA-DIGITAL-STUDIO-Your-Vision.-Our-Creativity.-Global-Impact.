import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move, Crop } from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string;
  initialAspectRatio?: number; // e.g. 1 (1:1), 16/9, 4/3
  onCropComplete: (croppedDataUrl: string, dimensions: { width: number; height: number }) => void;
  onClose: () => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  initialAspectRatio = 1,
  onCropComplete,
  onClose
}) => {
  const [aspectRatio, setAspectRatio] = useState<number>(initialAspectRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const [previewSize, setPreviewSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load natural dimensions
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setNaturalWidth(img.naturalWidth);
      setNaturalHeight(img.naturalHeight);
      imageRef.current = img;
      renderCanvas(img, zoom, rotation, panX, panY, aspectRatio);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Re-render when parameters change
  useEffect(() => {
    if (imageRef.current) {
      renderCanvas(imageRef.current, zoom, rotation, panX, panY, aspectRatio);
    }
  }, [zoom, rotation, panX, panY, aspectRatio]);

  const renderCanvas = (
    img: HTMLImageElement,
    currentZoom: number,
    currentRotation: number,
    currentPanX: number,
    currentPanY: number,
    currentAspect: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Target canvas dimensions based on chosen aspect ratio
    let targetWidth = 800;
    let targetHeight = targetWidth / (currentAspect || 1);

    if (currentAspect === 0) {
      // Freeform: keep original ratio
      targetWidth = Math.min(img.naturalWidth, 1000);
      targetHeight = (targetWidth * img.naturalHeight) / img.naturalWidth;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    setPreviewSize({ width: Math.round(targetWidth), height: Math.round(targetHeight) });

    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.save();

    // Center and transform
    ctx.translate(targetWidth / 2 + currentPanX, targetHeight / 2 + currentPanY);
    ctx.rotate((currentRotation * Math.PI) / 180);
    ctx.scale(currentZoom, currentZoom);

    // Compute cover draw
    const scale = Math.max(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight);
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(dataUrl, previewSize);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPanX(0);
    setPanY(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-2xl w-full p-6 text-white shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-yellow-400" />
            <h3 className="font-display text-lg font-bold">Crop &amp; Reposition Media</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cropper"
            className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-400 mr-1 font-mono uppercase">Aspect Ratio:</span>
          {[
            { label: '1:1 Square (Avatar/Founder/Team)', value: 1 },
            { label: '16:9 Landscape (Hero/Banner)', value: 16 / 9 },
            { label: '4:3 Standard (Services/Portfolio)', value: 4 / 3 },
            { label: 'Original', value: 0 }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setAspectRatio(item.value);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                aspectRatio === item.value
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Canvas Workspace Viewport */}
        <div className="relative w-full h-72 sm:h-80 bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-800 p-2">
          <canvas
            ref={canvasRef}
            className="max-h-full max-w-full object-contain rounded shadow-lg border border-zinc-700/50"
          />
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-zinc-400 border border-zinc-800">
            {previewSize.width} &times; {previewSize.height} px
          </div>
        </div>

        {/* Sliders & Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Zoom */}
          <div>
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span>Zoom Scale</span>
              <span className="font-mono text-yellow-400">{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer"
            />
          </div>

          {/* Pan X */}
          <div>
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span>Horizontal Offset</span>
              <span className="font-mono text-zinc-300">{panX}px</span>
            </div>
            <input
              type="range"
              min="-200"
              max="200"
              step="5"
              value={panX}
              onChange={(e) => setPanX(parseInt(e.target.value, 10))}
              className="w-full accent-yellow-400 cursor-pointer"
            />
          </div>

          {/* Pan Y */}
          <div>
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span>Vertical Offset</span>
              <span className="font-mono text-zinc-300">{panY}px</span>
            </div>
            <input
              type="range"
              min="-200"
              max="200"
              step="5"
              value={panY}
              onChange={(e) => setPanY(parseInt(e.target.value, 10))}
              className="w-full accent-yellow-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="px-3 py-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate 90&deg;</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Apply Cropped Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
