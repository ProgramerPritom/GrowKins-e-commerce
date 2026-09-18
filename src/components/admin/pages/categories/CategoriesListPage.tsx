import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree, X } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { useAdminToast } from '../../common/AdminToast';
import { categoryService } from '../../../../services';
import type { AdminCategory, CreateCategoryPayload } from '../../../../types/admin';

export const CategoriesListPage: React.FC = () => {
  const { showToast } = useAdminToast();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Editor Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  // Delete Dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await categoryService.list();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load categories.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormStatus('active');
    setModalOpen(true);
  };

  const openEditModal = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || '');
    setFormStatus(cat.status);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }

    try {
      const payload: CreateCategoryPayload = {
        name: formName.trim(),
        slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formDescription.trim(),
        status: formStatus
      };

      if (editingCategory) {
        await categoryService.update(editingCategory.id, payload);
        showToast('Category updated.');
      } else {
        await categoryService.create(payload);
        showToast('Category created.');
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save category.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await categoryService.delete(deleteTargetId);
      showToast('Category deleted.');
      setDeleteTargetId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      showToast('Could not delete category.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Categories"
        subtitle="Manage Montessori toy collections, taxonomy hierarchy, and navigation filters."
        breadcrumbs={[{ label: 'Catalog' }, { label: 'Categories' }]}
        actions={
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        }
      />

      <div className="bg-white border border-[#E8E0D2] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F1] border-b border-[#E8E0D2] text-[#635E55] uppercase text-[11px] font-bold tracking-wider">
                <th className="px-5 py-3.5">Category Name</th>
                <th className="px-4 py-3.5">Slug</th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5">Items</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F4EFE6]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-4 bg-[#F4EFE6] rounded w-1/3" />
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-[#8C8478]">
                    No categories found. Create your first category.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#FAF7F1]/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-[#24221F] flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#FAF7F1] border border-[#E8E0D2] flex items-center justify-center text-[#1C4CB8]">
                        <FolderTree className="w-3.5 h-3.5" />
                      </div>
                      <span>{cat.name}</span>
                    </td>
                    <td className="px-4 py-4 font-mono text-[11px] text-[#635E55]">{cat.slug}</td>
                    <td className="px-4 py-4 text-[#7D766C] truncate max-w-xs">{cat.description || '—'}</td>
                    <td className="px-4 py-4 font-semibold text-[#24221F]">{cat.productCount ?? 0} toys</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={cat.status} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-[#635E55] hover:text-[#1C4CB8] hover:bg-[#E7EDFB] cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(cat.id)}
                          className="p-1.5 rounded-lg text-[#635E55] hover:text-[#B83A28] hover:bg-[#FBE8E5] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-[#24221F]/50 backdrop-blur-xs"
          />

          <div className="relative bg-white border border-[#E8E0D2] rounded-2xl shadow-xl max-w-md w-full p-6 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6] mb-4">
              <h3 className="font-serif text-base font-bold text-[#24221F]">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-[#8C8478] hover:text-[#24221F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">
                  Category Name <span className="text-[#B83A28]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Open-ended play"
                  className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">Slug</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="open-ended-play"
                  className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short description for the shop catalog filter header..."
                  className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E0D2] rounded-xl"
                >
                  <option value="active">Active (Visible in Storefront)</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E8E0D2] hover:bg-[#FAF7F1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1C4CB8] hover:bg-[#15398B] rounded-xl shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Category?"
        message="Are you sure you want to delete this category? Associated products will not be deleted."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
