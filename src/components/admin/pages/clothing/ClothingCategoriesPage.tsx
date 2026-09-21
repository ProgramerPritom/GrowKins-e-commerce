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
import type { ClothingCategory } from '../../../../types/clothing';

export const ClothingCategoriesPage: React.FC = () => {
  const { showToast } = useAdminToast();
  const [categories, setCategories] = useState<ClothingCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Partial<ClothingCategory> | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await clothingService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsub = MockDatabase.subscribe(loadData);
    return () => unsub();
  }, []);

  const handleOpenEdit = (cat?: ClothingCategory) => {
    if (cat) {
      setActiveCategory({ ...cat });
    } else {
      setActiveCategory({
        id: `cat-${Date.now()}`,
        name: '',
        slug: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        sortOrder: categories.length + 1
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!activeCategory || !activeCategory.name || !activeCategory.slug) {
      showToast('Name and slug are required', 'error');
      return;
    }

    try {
      const isExisting = categories.some((c) => c.id === activeCategory.id);
      if (isExisting && activeCategory.id) {
        await clothingService.updateCategory(activeCategory.id, activeCategory);
        showToast('Fashion category updated', 'success');
      } else {
        await clothingService.createCategory(activeCategory as any);
        showToast('New fashion category created', 'success');
      }
      setModalOpen(false);
      setActiveCategory(null);
    } catch {
      showToast('Error saving category', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Clothing Categories"
        subtitle="Manage fashion departments, editorial category photography, and routing."
        actions={
          <button
            onClick={() => handleOpenEdit()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#C85A32] rounded-xl hover:bg-[#B24E2A] transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        }
      />

      <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#857E73]">
            Loading clothing categories...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F1] border-b border-[#E8E2D5] text-[#857E73] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-3">Slug / Route</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-center">Sort Order</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#FCFAF7] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-10 h-10 rounded-xl object-cover bg-[#F5F2EA] border border-[#E8E2D5] shrink-0"
                        />
                        <span className="font-serif font-bold text-xs text-[#171715]">
                          {cat.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-[#524E47]">
                      /clothing/{cat.slug}
                    </td>

                    <td className="py-3 px-3 text-[#857E73] max-w-xs truncate">
                      {cat.description || '—'}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-[#171715]">
                      {cat.sortOrder}
                    </td>

                    <td className="py-3 px-3">
                      <StatusBadge status={cat.status || 'active'} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => window.open(`/clothing/${cat.slug}`, '_blank')}
                          className="p-1.5 text-[#857E73] hover:text-[#171715] hover:bg-[#F2ECE1] rounded-lg transition-colors cursor-pointer"
                          title="View on store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 text-[#857E73] hover:text-[#C85A32] hover:bg-[#F2ECE1] rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Editor Modal */}
      {modalOpen && activeCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs text-left">
          <div className="w-full max-w-md bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#171715]">
                {activeCategory.name ? `Edit Category` : 'New Fashion Category'}
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
                  Category Name
                </label>
                <input
                  type="text"
                  value={activeCategory.name || ''}
                  onChange={(e) =>
                    setActiveCategory({
                      ...activeCategory,
                      name: e.target.value,
                      slug:
                        activeCategory.slug ||
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
                  value={activeCategory.slug || ''}
                  onChange={(e) =>
                    setActiveCategory({ ...activeCategory, slug: e.target.value })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={activeCategory.description || ''}
                  onChange={(e) =>
                    setActiveCategory({ ...activeCategory, description: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Editorial Photography URL
                </label>
                <input
                  type="text"
                  value={activeCategory.image || ''}
                  onChange={(e) =>
                    setActiveCategory({ ...activeCategory, image: e.target.value })
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
                    value={activeCategory.sortOrder || 1}
                    onChange={(e) =>
                      setActiveCategory({
                        ...activeCategory,
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
                    value={activeCategory.status || 'active'}
                    onChange={(e) =>
                      setActiveCategory({
                        ...activeCategory,
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
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
