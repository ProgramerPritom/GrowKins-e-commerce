import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { useAdminRouter } from '../../../../context/AdminRouterContext';
import { useAdminToast } from '../../common/AdminToast';
import { collectionService } from '../../../../services';
import type { AdminCollection } from '../../../../types/admin';

export const CollectionsListPage: React.FC = () => {
  const { navigate } = useAdminRouter();
  const { showToast } = useAdminToast();

  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const res = await collectionService.list();
      setCollections(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load collections.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await collectionService.delete(deleteTargetId);
      showToast('Collection deleted.');
      setDeleteTargetId(null);
      fetchCollections();
    } catch (err) {
      console.error(err);
      showToast('Could not delete collection.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curated Collections"
        subtitle="Manage promotional groupings, seasonal bundles, Eid gifts, and stage sets."
        breadcrumbs={[{ label: 'Catalog' }, { label: 'Collections' }]}
        actions={
          <button
            onClick={() => navigate('/admin/collections/new')}
            className="px-4 py-2 bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Collection</span>
          </button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-[#F4EFE6] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col) => (
          <div
            key={col.id}
            className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#1C4CB8]/40 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-[#E7EDFB] text-[#1C4CB8] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </span>
                <StatusBadge status={col.status} size="sm" />
              </div>

              <h3
                onClick={() => navigate(`/admin/collections/${col.id}`)}
                className="font-serif text-base font-bold text-[#24221F] hover:text-[#1C4CB8] cursor-pointer"
              >
                {col.name}
              </h3>
              <p className="font-mono text-[11px] text-[#8C8478] mt-0.5">/{col.slug}</p>
              <p className="text-xs text-[#635E55] mt-2.5 line-clamp-2 leading-relaxed">
                {col.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#F4EFE6] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1C4CB8] bg-[#FAF7F1] px-2.5 py-1 rounded-full border border-[#E8E0D2]">
                {col.productIds.length} Products Curated
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate(`/admin/collections/${col.id}`)}
                  className="p-1.5 rounded-lg text-[#635E55] hover:text-[#1C4CB8] hover:bg-[#E7EDFB] cursor-pointer"
                  title="Edit collection"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(col.id)}
                  className="p-1.5 rounded-lg text-[#635E55] hover:text-[#B83A28] hover:bg-[#FBE8E5] cursor-pointer"
                  title="Delete collection"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Collection?"
        message="Are you sure you want to delete this collection? Products inside will remain unaffected."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
