import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Check, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import type { MediaAsset } from '../../../types/admin';
import { mediaService } from '../../../services';

interface MediaPickerProps {
  isOpen: boolean;
  onSelect: (asset: MediaAsset | { url: string; alt?: string }) => void;
  onClose: () => void;
  title?: string;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  isOpen,
  onSelect,
  onClose,
  title = 'Select Media Asset'
}) => {
  const [tab, setTab] = useState<'library' | 'upload' | 'url'>('library');
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customAlt, setCustomAlt] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const res = await mediaService.list({ limit: 30 });
      setMediaList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await mediaService.upload(file);
      setMediaList((prev) => [res.data, ...prev]);
      setSelectedAsset(res.data);
      setTab('library');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    if (tab === 'library' && selectedAsset) {
      onSelect(selectedAsset);
      onClose();
    } else if (tab === 'url' && customUrl.trim()) {
      onSelect({ url: customUrl.trim(), alt: customAlt.trim() });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#24221F]/50 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative bg-white border border-[#E8E0D2] rounded-2xl shadow-2xl max-w-3xl w-full h-[80vh] max-h-[640px] flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#E8E0D2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E7EDFB] text-[#1C4CB8] flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#24221F]">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-[#8C8478] hover:text-[#24221F] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-5 pt-3 border-b border-[#E8E0D2] bg-[#FAF7F1]/60 flex gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTab('library')}
                className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                  tab === 'library'
                    ? 'border-[#1C4CB8] text-[#1C4CB8]'
                    : 'border-transparent text-[#7D766C] hover:text-[#24221F]'
                }`}
              >
                Media Library ({mediaList.length})
              </button>
              <button
                type="button"
                onClick={() => setTab('upload')}
                className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                  tab === 'upload'
                    ? 'border-[#1C4CB8] text-[#1C4CB8]'
                    : 'border-transparent text-[#7D766C] hover:text-[#24221F]'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setTab('url')}
                className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                  tab === 'url'
                    ? 'border-[#1C4CB8] text-[#1C4CB8]'
                    : 'border-transparent text-[#7D766C] hover:text-[#24221F]'
                }`}
              >
                External URL
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {tab === 'library' && (
                <div>
                  {isLoading ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-[#F4EFE6] rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : mediaList.length === 0 ? (
                    <div className="text-center py-16 text-[#7D766C]">
                      <p className="text-xs">No media files available.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      {mediaList.map((asset) => {
                        const isSelected = selectedAsset?.id === asset.id;
                        return (
                          <div
                            key={asset.id}
                            onClick={() => setSelectedAsset(asset)}
                            className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#1C4CB8] ring-3 ring-[#1C4CB8]/20 shadow-md'
                                : 'border-[#E8E0D2] hover:border-[#8C8478]'
                            }`}
                          >
                            <img
                              src={asset.url}
                              alt={asset.alt || asset.filename}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#1C4CB8] text-white flex items-center justify-center shadow-md">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent text-[10px] text-white truncate">
                              {asset.filename}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {tab === 'upload' && (
                <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-[#D0C8BA] rounded-2xl p-8 text-center bg-[#FAF7F1]/50">
                  <div className="w-12 h-12 rounded-2xl bg-[#E7EDFB] text-[#1C4CB8] flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#24221F]">Upload a product or lifestyle image</h4>
                  <p className="text-xs text-[#7D766C] mt-1 max-w-xs">
                    PNG, JPG, WEBP up to 5MB. Images will be optimized for Montessori storefront display.
                  </p>
                  <label className="mt-4 px-5 py-2.5 bg-[#1C4CB8] text-white text-xs font-semibold rounded-xl hover:bg-[#15398B] transition-colors cursor-pointer shadow-xs">
                    {isUploading ? 'Uploading...' : 'Choose File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {tab === 'url' && (
                <div className="max-w-md mx-auto py-8 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#24221F] mb-1">Image URL</label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8478]" />
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#24221F] mb-1">Alt Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Wooden Rainbow Arch on play table"
                      value={customAlt}
                      onChange={(e) => setCustomAlt(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                    />
                  </div>

                  {customUrl && (
                    <div className="mt-3 aspect-video w-full rounded-xl overflow-hidden border border-[#E8E0D2] bg-[#FAF7F1]">
                      <img src={customUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E8E0D2] bg-[#FAF7F1]/80 flex items-center justify-between">
              <span className="text-xs text-[#7D766C]">
                {tab === 'library' && selectedAsset ? `Selected: ${selectedAsset.filename}` : ''}
              </span>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#635E55] hover:bg-[#FAF7F1] rounded-xl border border-[#E8E0D2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={tab === 'library' ? !selectedAsset : !customUrl}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1C4CB8] hover:bg-[#15398B] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl cursor-pointer shadow-xs"
                >
                  Select Asset
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
