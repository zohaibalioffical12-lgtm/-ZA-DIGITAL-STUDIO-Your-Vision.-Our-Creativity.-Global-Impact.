import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Check, Crop, Trash2, Image as ImageIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { MediaItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { ImageCropperModal } from './ImageCropperModal';

interface MediaSelectModalProps {
  currentUrl?: string;
  categoryFilter?: 'hero' | 'founder' | 'logo' | 'service' | 'portfolio' | 'team' | 'general';
  targetLabel: string;
  onSelect: (url: string, altText?: string) => void;
  onClose: () => void;
}

export const MediaSelectModal: React.FC<MediaSelectModalProps> = ({
  currentUrl,
  categoryFilter,
  targetLabel,
  onSelect,
  onClose
}) => {
  const { getAuthHeaders } = useAuth();
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [rawUploadSrc, setRawUploadSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [altTextInput, setAltTextInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.media) {
        setMediaList(data.media);
      }
    } catch {
      setErrorMsg('Failed to fetch media assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg(`Invalid file type (${file.type}). Only JPG, PNG, and WebP are allowed.`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Limit is 10MB.`);
      return;
    }

    setSelectedFileName(file.name);
    setAltTextInput(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setRawUploadSrc(result);
      setShowCropper(true); // Open cropper right away
    };
    reader.readAsDataURL(file);
  };

  // Upload base64 image data to server
  const uploadToServer = async (base64Data: string, dimensions?: { width: number; height: number }) => {
    setUploading(true);
    setUploadProgress(40);
    setErrorMsg(null);

    try {
      setUploadProgress(70);
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          base64Data,
          filename: selectedFileName || 'media_asset.jpg',
          category: categoryFilter || 'general',
          altText: altTextInput || targetLabel,
          dimensions
        })
      });

      setUploadProgress(90);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed.');
      }

      setUploadProgress(100);
      // Automatically select the newly uploaded media item
      onSelect(data.item.url, data.item.altText);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      setShowCropper(false);
    }
  };

  const handleCropped = (croppedDataUrl: string, dimensions: { width: number; height: number }) => {
    setShowCropper(false);
    uploadToServer(croppedDataUrl, dimensions);
  };

  const initialAspect =
    categoryFilter === 'hero'
      ? 16 / 9
      : categoryFilter === 'founder' || categoryFilter === 'team' || categoryFilter === 'logo'
      ? 1
      : 4 / 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-4xl w-full p-6 text-white shadow-2xl relative space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-yellow-400">
              Media &amp; Image Manager
            </div>
            <h3 className="font-display text-xl font-bold">
              Select or Upload Image for &ldquo;{targetLabel}&rdquo;
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tabs & Controls */}
        <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3.5 py-1.5 rounded font-semibold transition-colors ${
                activeTab === 'library'
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              Media Library ({mediaList.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('upload');
                fileInputRef.current?.click();
              }}
              className={`px-3.5 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New File</span>
            </button>
          </div>

          {currentUrl && (
            <button
              onClick={() => {
                onSelect('');
                onClose();
              }}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Current Image</span>
            </button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'library' ? (
            loading ? (
              <div className="text-center py-16 text-zinc-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-yellow-400" />
                <span>Loading media assets...</span>
              </div>
            ) : mediaList.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 space-y-2">
                <ImageIcon className="w-10 h-10 mx-auto text-zinc-600" />
                <p>No media files uploaded yet.</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-bold text-black bg-yellow-400 rounded hover:bg-yellow-300"
                >
                  Upload First Image
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaList.map((item) => {
                  const isSelected = currentUrl === item.url;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelect(item.url, item.altText);
                        onClose();
                      }}
                      className={`group cursor-pointer rounded-lg border overflow-hidden transition-all relative ${
                        isSelected
                          ? 'border-yellow-400 ring-2 ring-yellow-400/50 bg-zinc-900'
                          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
                      }`}
                    >
                      <div className="aspect-[4/3] bg-zinc-950 overflow-hidden relative">
                        <img
                          src={item.url}
                          alt={item.altText}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 p-1 rounded-full bg-yellow-400 text-black">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-zinc-400">
                          {item.category}
                        </div>
                      </div>
                      <div className="p-2.5 text-left text-xs">
                        <span className="font-semibold text-zinc-200 block truncate text-[11px]">
                          {item.originalName}
                        </span>
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono mt-1">
                          <span>{(item.size / 1024).toFixed(0)} KB</span>
                          <span>{item.dimensions ? `${item.dimensions.width}x${item.dimensions.height}` : ''}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Upload Workspace Dropzone */
            <div className="p-10 border-2 border-dashed border-zinc-800 rounded-xl text-center space-y-4 hover:border-yellow-400/50 transition-colors">
              <Upload className="w-12 h-12 text-yellow-400 mx-auto" />
              <div>
                <h4 className="font-display text-base font-bold text-white">
                  Drop image here or click to select
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Supports JPG, PNG, and WebP (Up to 10MB). Image can be cropped and adjusted before saving.
                </p>
              </div>

              {uploading && (
                <div className="max-w-xs mx-auto space-y-2">
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-2 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">Processing upload...</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded transition-colors"
              >
                Choose Local File
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-zinc-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Embedded Cropper Modal if raw upload image selected */}
      {showCropper && rawUploadSrc && (
        <ImageCropperModal
          imageSrc={rawUploadSrc}
          initialAspectRatio={initialAspect}
          onCropComplete={handleCropped}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};
