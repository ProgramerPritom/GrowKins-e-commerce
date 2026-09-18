import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Check, Search } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminRouter } from '../../../../context/AdminRouterContext';
import { useAdminToast } from '../../common/AdminToast';
import { collectionService, productService } from '../../../../services';
import type { AdminProduct, CreateCollectionPayload } from '../../../../types/admin';

export const CollectionDetailPage: React.FC = () => {
  const { params, navigate } = useAdminRouter();
  const { showToast } = useAdminToast();

  const isNew = params.id === 'new';
  const collectionId = params.id;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [featured, setFeatured] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const loadAllProducts = async () => {
    try {
      const res = await productService.list({ limit: 50 });
      setAllProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCollection = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await collectionService.getById(id);
      const c = res.data;
      setName(c.name);
      setSlug(c.slug);
      setDescription(c.description || '');
      setStatus(c.status);
      setFeatured(c.featured || false);
      setSelectedProductIds(c.productIds || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load collection details.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllProducts();
    if (!isNew && collectionId) {
      loadCollection(collectionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, collectionId]);

  const toggleProduct = (pId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Collection name is required.', 'error');
      return;
    }

    setIsSaving(true);
    const payload: CreateCollectionPayload = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      status,
      featured,
      productIds: selectedProductIds
    };

    try {
      if (isNew) {
        await collectionService.create(payload);
        showToast('Collection created successfully.');
      } else {
        await collectionService.update(collectionId, payload);
        showToast('Collection updated successfully.');
      }
      navigate('/admin/collections');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save collection.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#8C8478]">Loading collection...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title={isNew ? 'Create New Collection' : `Edit Collection: ${name}`}
        subtitle="Curate products for homepage sections, seasonal promotions, or gift categories."
        breadcrumbs={[
          { label: 'Collections', href: '/admin/collections' },
          { label: isNew ? 'New' : name }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/collections')}
              className="px-3.5 py-2 rounded-xl border border-[#E8E0D2] bg-white text-[#635E55] hover:bg-[#FAF7F1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Collection</span>
            </button>
          </div>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Info Card */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">
                Collection Name <span className="text-[#B83A28]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Best Sellers or Eid Gifts"
                className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="best-sellers"
                className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this collection is curated..."
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E8E0D2] rounded-xl"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="featCol"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
              <label htmlFor="featCol" className="text-xs font-bold text-[#24221F] cursor-pointer">
                Feature on Homepage Navigation Bar
              </label>
            </div>
          </div>
        </div>

        {/* Product Picker Card */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-serif text-sm font-bold text-[#24221F]">
                Included Products ({selectedProductIds.length})
              </h3>
              <p className="text-xs text-[#8C8478]">Select which wooden toys belong to this collection.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8478]" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search toys..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pt-2">
            {filteredProducts.map((p) => {
              const isSelected = selectedProductIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => toggleProduct(p.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#1C4CB8] bg-[#E7EDFB]/40'
                      : 'border-[#E8E0D2] bg-white hover:bg-[#FAF7F1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]?.url}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#E8E0D2]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#24221F]">{p.name}</p>
                      <p className="text-[11px] text-[#8C8478]">{p.category} · ৳{p.price}</p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-[#1C4CB8] border-[#1C4CB8] text-white'
                        : 'border-[#D0C8BA] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};
