import React, { useState, useEffect } from 'react';
import { Upload, Copy, Trash2, Search, Check, Image as ImageIcon } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { useAdminToast } from '../../common/AdminToast';
import { mediaService } from '../../../../services';
import type { MediaAsset } from '../../../../types/admin';

export const MediaLibraryPage: React.FC = () => {
  const { showToast } = useAdminToast();

  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await mediaService.list({ search, limit: 30 });
      setMediaList(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load media assets.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [search]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await mediaService.upload(file);
      showToast('Asset uploaded successfully.');
      fetchMedia();
    } catch (err) {
      console.error(err);
      showToast('File upload failed.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    showToast('Asset URL copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await mediaService.delete(deleteTargetId);
      showToast('Asset deleted.');
      setDeleteTargetId(null);
      fetchMedia();
    } catch (err) {
      console.error(err);
      showToast('Could not delete asset.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        subtitle="Manage product photography, playroom lifestyle images, and brand banners."
        breadcrumbs={[{ label: 'Assets' }, { label: 'Media' }]}
        actions={
          <label className="px-4 py-2 bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        }
      />

      {/* Search & Stats Filter */}
      <div className="bg-white border border-[#E8E0D2] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8478]" />
          <input
            type="text"
            placeholder="Search by filename or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
          />
        </div>

        <span className="text-xs text-[#7D766C]">
          Showing <strong className="text-[#24221F]">{mediaList.length}</strong> assets
        </span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[#F4EFE6] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : mediaList.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E8E0D2] rounded-2xl p-8">
          <ImageIcon className="w-8 h-8 text-[#8C8478] mx-auto mb-2" />
          <h4 className="text-sm font-bold text-[#24221F]">No media assets found</h4>
          <p className="text-xs text-[#8C8478] mt-1">Upload your first high-res toy photo or banner.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((asset) => (
            <div
              key={asset.id}
              className="bg-white border border-[#E8E0D2] rounded-2xl overflow-hidden shadow-xs hover:border-[#1C4CB8] transition-all group flex flex-col justify-between"
            >
              <div className="aspect-square bg-[#FAF7F1] relative overflow-hidden">
                <img
                  src={asset.url}
                  alt={asset.alt || asset.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Quick Copy URL overlay button */}
                <button
                  onClick={() => handleCopyUrl(asset)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-[#24221F] shadow-sm hover:bg-[#1C4CB8] hover:text-white transition-colors cursor-pointer"
                  title="Copy URL"
                >
                  {copiedId === asset.id ? (
                    <Check className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="p-3 border-t border-[#F4EFE6] flex items-center justify-between gap-2">
                <div className="truncate">
                  <p className="text-xs font-bold text-[#24221F] truncate">{asset.filename}</p>
                  <p className="text-[10px] text-[#8C8478]">
                    {asset.size ? `${Math.round(asset.size / 1024)} KB` : 'Image'} · {asset.mimeType.split('/')[1]?.toUpperCase()}
                  </p>
                </div>

                <button
                  onClick={() => setDeleteTargetId(asset.id)}
                  className="text-[#8C8478] hover:text-[#B83A28] p-1 cursor-pointer shrink-0"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Media Asset?"
        message="Are you sure you want to delete this media asset? Any product referencing it will lose this photo."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
