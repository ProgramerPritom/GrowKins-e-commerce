import React, { useState, useEffect } from 'react';
import { Upload, Copy, Trash2, Search, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { MediaGridSkeleton, InlineLoadingSpinner } from '../../../common/LoadingSkeleton';
import { useAdminToast } from '../../common/AdminToast';
import { mediaService } from '../../../../services';
import type { MediaAsset } from '../../../../types/admin';

export const MediaLibraryPage: React.FC = () => {
  const { toast } = useAdminToast();

  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await mediaService.list({ search, limit: 30 });
      setMediaList(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load media assets from Google Sheets.');
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
      toast.success(
        `"${file.name}" uploaded to Google Drive and saved to Media tab.`,
        'Drive Upload Complete'
      );
      fetchMedia();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'File upload to Google Drive failed.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    toast.info('Direct Google CDN thumbnail link copied.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await mediaService.delete(deleteTargetId);
      toast.delete('Image deleted from Google Drive and Media Sheet.');
      setDeleteTargetId(null);
      fetchMedia();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Could not delete asset from Google Drive.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Google Drive Media Library"
        subtitle="Upload and manage high-resolution toy photography, catalog assets, and Drive media records."
        breadcrumbs={[{ label: 'Assets' }, { label: 'Drive Media' }]}
        actions={
          <label className="px-4 py-2.5 bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-all">
            {isUploading ? (
              <InlineLoadingSpinner text="Syncing to Google Drive..." />
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload to Drive</span>
              </>
            )}
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

      {/* Live Upload Progress Indicator */}
      {isUploading && (
        <div className="bg-[#FAF7F1] border border-[#1C4CB8]/30 p-4 rounded-2xl flex items-center gap-3 shadow-xs animate-pulse">
          <div className="w-8 h-8 rounded-xl bg-[#E7EDFB] text-[#1C4CB8] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1C4CB8]">
              Uploading image to Google Drive & Google Sheets...
            </h4>
            <p className="text-[11px] text-[#7D766C]">
              Converting file, transferring through Google Apps Script bridge, and populating Media row.
            </p>
          </div>
        </div>
      )}

      {/* Search & Stats Filter */}
      <div className="bg-white border border-[#E8E0D2] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8478]" />
          <input
            type="text"
            placeholder="Search by filename or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
          />
        </div>

        <span className="text-xs text-[#7D766C]">
          Showing <strong className="text-[#24221F]">{mediaList.length}</strong> Google Drive assets
        </span>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <MediaGridSkeleton count={10} />
      ) : mediaList.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E8E0D2] rounded-2xl p-8 space-y-3">
          <ImageIcon className="w-10 h-10 text-[#8C8478] mx-auto" />
          <h4 className="text-sm font-bold text-[#24221F]">No Google Drive media assets found</h4>
          <p className="text-xs text-[#8C8478] max-w-sm mx-auto">
            Upload your first high-res wooden toy photo or banner to sync it with Google Drive.
          </p>
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
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Quick Copy URL overlay button */}
                <button
                  onClick={() => handleCopyUrl(asset)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-[#24221F] shadow-sm hover:bg-[#1C4CB8] hover:text-white transition-colors cursor-pointer"
                  title="Copy Google CDN URL"
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
                  <p className="text-xs font-bold text-[#24221F] truncate" title={asset.filename}>
                    {asset.filename}
                  </p>
                  <p className="text-[10px] text-[#8C8478]">
                    {asset.size ? `${Math.round(asset.size / 1024)} KB` : 'Image'} · {asset.mimeType?.split('/')[1]?.toUpperCase() || 'JPEG'}
                  </p>
                </div>

                <button
                  onClick={() => setDeleteTargetId(asset.id)}
                  className="text-[#8C8478] hover:text-[#B83A28] p-1.5 rounded-lg hover:bg-[#FBE8E5] cursor-pointer shrink-0 transition-colors"
                  title="Delete from Google Drive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Google Drive Media Asset?"
        message="Are you sure you want to permanently delete this file? It will be removed from your Google Drive folder and from the Google Sheets Media tab."
        confirmLabel="Delete from Drive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
