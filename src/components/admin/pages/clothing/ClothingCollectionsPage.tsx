import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  ExternalLink,
  X
} from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';
import { useAdminToast } from '../../common/AdminToast';
import { MockDatabase } from '../../../../lib/mockDb/MockDatabase';
import { clothingService } from '../../../../services';
import type { ClothingCollection } from '../../../../types/clothing';

export const ClothingCollectionsPage: React.FC = () => {
  const { showToast } = useAdminToast();
  const [collections, setCollections] = useState<ClothingCollection[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState<Partial<ClothingCollection> | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await clothingService.getCollections();
    setCollections(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsub = MockDatabase.subscribe(loadData);
    return () => unsub();
  }, []);

  const handleOpenEdit = (col?: ClothingCollection) => {
    if (col) {
      setActiveCollection({ ...col });
    } else {
      setActiveCollection({
        id: `col-${Date.now()}`,
        title: '',
        slug: '',
        subtitle: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
        status: 'active',
        productIds: [],
        sortOrder: collections.length + 1
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!activeCollection || !activeCollection.title || !activeCollection.slug) {
      showToast('Title and slug are required', 'error');
      return;
    }

    try {
      const isExisting = collections.some((c) => c.id === activeCollection.id);
      if (isExisting && activeCollection.id) {
        await clothingService.updateCollection(activeCollection.id, activeCollection);
        showToast('Fashion collection updated', 'success');
      } else {
        await clothingService.createCollection(activeCollection as any);
        showToast('New fashion collection created', 'success');
      }
      setModalOpen(false);
      setActiveCollection(null);
    } catch {
      showToast('Error saving collection', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Fashion Collections"
        subtitle="Curate editorial seasonal drops, lookbook campaigns, and capsule wardrobes."
        actions={
          <button
            onClick={() => handleOpenEdit()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#C85A32] rounded-xl hover:bg-[#B24E2A] transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Collection</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-xs text-[#857E73]">
            Loading collections...
          </div>
        ) : (
          collections.map((col) => (
            <div
              key={col.id}
              className="bg-white border border-[#E8E2D5] rounded-2xl overflow-hidden shadow-2xs flex flex-col group"
            >
              <div className="relative aspect-16/9 bg-[#F5F2EA] overflow-hidden">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={col.status} />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#171715]">
                    {col.title}
                  </h3>
                  {col.subtitle && (
                    <p className="text-xs text-[#857E73] mt-0.5 line-clamp-1">
                      {col.subtitle}
                    </p>
                  )}
                  <span className="inline-block mt-2 font-mono text-[10px] text-[#524E47] bg-[#FAF7F1] px-2 py-0.5 rounded">
                    /clothing/collections/{col.slug}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D5] text-xs">
                  <span className="text-[#857E73]">
                    {col.productIds.length} pieces assigned
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        window.open(`/clothing/collections/${col.slug}`, '_blank')
                      }
                      className="p-1.5 text-[#857E73] hover:text-[#171715] hover:bg-[#F2ECE1] rounded-lg cursor-pointer"
                      title="Preview collection"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(col)}
                      className="p-1.5 text-[#857E73] hover:text-[#C85A32] hover:bg-[#F2ECE1] rounded-lg cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && activeCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs text-left">
          <div className="w-full max-w-md bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#171715]">
                {activeCollection.title ? 'Edit Collection' : 'New Fashion Collection'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#857E73] hover:text-[#171715] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Collection Title
                </label>
                <input
                  type="text"
                  value={activeCollection.title || ''}
                  onChange={(e) =>
                    setActiveCollection({
                      ...activeCollection,
                      title: e.target.value,
                      slug:
                        activeCollection.slug ||
                        e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={activeCollection.slug || ''}
                  onChange={(e) =>
                    setActiveCollection({ ...activeCollection, slug: e.target.value })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={activeCollection.subtitle || ''}
                  onChange={(e) =>
                    setActiveCollection({ ...activeCollection, subtitle: e.target.value })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Campaign Photography URL
                </label>
                <input
                  type="text"
                  value={activeCollection.image || ''}
                  onChange={(e) =>
                    setActiveCollection({ ...activeCollection, image: e.target.value })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#171715] mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={activeCollection.sortOrder || 1}
                    onChange={(e) =>
                      setActiveCollection({
                        ...activeCollection,
                        sortOrder: parseInt(e.target.value) || 1
                      })
                    }
                    className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#171715] mb-1">
                    Status
                  </label>
                  <select
                    value={activeCollection.status || 'active'}
                    onChange={(e) =>
                      setActiveCollection({
                        ...activeCollection,
                        status: e.target.value as any
                      })
                    }
                    className="w-full h-9 px-2.5 rounded-xl border border-[#E8E2D5] bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#524E47] hover:bg-[#F2ECE1] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#C85A32] hover:bg-[#B24E2A] cursor-pointer"
              >
                Save Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
