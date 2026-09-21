import React, { useState, useEffect } from 'react';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { MediaPicker } from '../../common/MediaPicker';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { useAdminRouter } from '../../../../context/AdminRouterContext';
import { useAdminToast } from '../../common/AdminToast';
import { productService } from '../../../../services';
import type {
  AdminProduct,
  CreateProductPayload,
  ProductImageItem,
  DevelopmentMilestone,
  WhatsInsideItem
} from '../../../../types/admin';
import type {
  AgeRange,
  Category,
  Interest,
  DevelopmentalBenefit,
  Material
} from '../../../../types';

const CATEGORIES: Category[] = [
  'Open-ended play',
  'Stacking toys',
  'Building sets',
  'Art & Craft',
  'Sensory',
  'Pretend play',
  'Books & Storytelling'
];

const AGE_GROUPS: AgeRange[] = ['0–12M', '1–2Y', '3–5Y', '6–8Y', '9Y+'];

const ALL_INTERESTS: Interest[] = [
  'Creating',
  'Building',
  'Exploring',
  'Moving',
  'Pretending',
  'Reading'
];

const ALL_BENEFITS: DevelopmentalBenefit[] = [
  'Creativity',
  'Fine motor',
  'Focus',
  'Language',
  'Balance',
  'Spatial thinking',
  'Sensory discovery'
];

const ALL_MATERIALS: Material[] = [
  'FSC beechwood',
  'Organic cotton',
  'Natural beeswax',
  'Recycled wool',
  'Plant-based silicone'
];

export const ProductEditorPage: React.FC = () => {
  const { params, navigate } = useAdminRouter();
  const { showToast } = useAdminToast();

  const isEditing = !!params.id && params.id !== 'new';
  const productId = params.id;

  const [activeTab, setActiveTab] = useState<
    'basic' | 'media' | 'pricing' | 'developmental' | 'seo'
  >('basic');

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreateProductPayload>({
    name: '',
    slug: '',
    subtitle: '',
    tag: '',
    status: 'draft',
    price: 1500,
    originalPrice: 1800,
    currency: 'BDT',
    ageBadge: 'AGE 2–5',
    ageGroup: '1–2Y',
    category: 'Stacking toys',
    interests: ['Building', 'Exploring'],
    benefits: ['Spatial thinking', 'Fine motor'],
    materials: ['FSC beechwood'],
    occasions: ['Everyday play', 'Eid gift'],
    valueStatement: '',
    description: '',
    sensoryQuote: '',
    whyKidsLoveIt: '',
    developmentMilestones: [
      {
        title: 'Spatial Thinking',
        description: 'Learns to balance and stack contoured elements without tipping.'
      }
    ],
    whatsInside: [{ name: 'Solid Beechwood Blocks', count: '10 pcs', detail: 'Organic water-based stain' }],
    images: [
      {
        id: 'img-def-1',
        url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
        alt: 'Handmade wooden Montessori toy',
        type: 'primary',
        sortOrder: 1
      }
    ],
    dimensions: '24 × 18 × 6 cm · Weight: 650g',
    careInstructions: 'Wipe with a slightly damp cloth. Condition with wood-safe oil.',
    safetyNotes: 'Tested and certified compliant with EN71 & ASTM F963 safety standards.',
    inventory: {
      trackInventory: true,
      quantity: 15,
      lowStockThreshold: 5,
      allowBackorder: false,
      sku: 'GK-NEW-101'
    },
    featured: false,
    seo: {
      metaTitle: '',
      metaDescription: ''
    }
  });

  // Load existing product if editing
  useEffect(() => {
    if (isEditing && productId) {
      loadProduct(productId);
    }
  }, [isEditing, productId]);

  const loadProduct = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await productService.getById(id);
      const p = res.data;
      setFormData({
        name: p.name,
        slug: p.slug,
        subtitle: p.subtitle || '',
        tag: p.tag || '',
        status: p.status,
        price: p.price,
        originalPrice: p.originalPrice,
        currency: p.currency || 'BDT',
        ageBadge: p.ageBadge,
        ageGroup: p.ageGroup,
        category: p.category,
        categoryId: p.categoryId,
        collectionIds: p.collectionIds || [],
        interests: p.interests || [],
        benefits: p.benefits || [],
        materials: p.materials || [],
        occasions: p.occasions || [],
        valueStatement: p.valueStatement,
        description: p.description,
        sensoryQuote: p.sensoryQuote || '',
        whyKidsLoveIt: p.whyKidsLoveIt || '',
        developmentMilestones: p.developmentMilestones || [],
        whatsInside: p.whatsInside || [],
        images: p.images || [],
        dimensions: p.dimensions || '',
        careInstructions: p.careInstructions || '',
        safetyNotes: p.safetyNotes || '',
        inventory: p.inventory || {
          trackInventory: true,
          quantity: 10,
          lowStockThreshold: 5,
          allowBackorder: false,
          sku: `GK-${p.id}`
        },
        featured: p.featured || false,
        seo: p.seo || { metaTitle: '', metaDescription: '' }
      });
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Product not found.', 'error');
      navigate('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = <K extends keyof CreateProductPayload>(
    key: K,
    value: CreateProductPayload[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleInventoryChange = (key: keyof CreateProductPayload['inventory'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      inventory: { ...prev.inventory, [key]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const toggleArrayItem = <T extends string>(listKey: keyof CreateProductPayload, item: T) => {
    setFormData((prev) => {
      const current = (prev[listKey] as T[]) || [];
      const updated = current.includes(item)
        ? current.filter((x) => x !== item)
        : [...current, item];
      return { ...prev, [listKey]: updated };
    });
    setHasUnsavedChanges(true);
  };

  // Image actions
  const handleAddMedia = (asset: { url: string; alt?: string }) => {
    const newImage: ProductImageItem = {
      id: `img-${Date.now()}`,
      url: asset.url,
      alt: asset.alt || formData.name || 'Product photo',
      type: formData.images.length === 0 ? 'primary' : 'gallery',
      sortOrder: formData.images.length + 1
    };
    handleFieldChange('images', [...formData.images, newImage]);
  };

  const handleRemoveImage = (imgId: string) => {
    handleFieldChange('images', formData.images.filter((img) => img.id !== imgId));
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const images = [...formData.images];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const temp = images[index];
    images[index] = images[targetIdx];
    images[targetIdx] = temp;

    // re-index sortOrder
    images.forEach((img, i) => (img.sortOrder = i + 1));
    handleFieldChange('images', images);
  };

  // Milestones & What's Inside items
  const handleAddMilestone = () => {
    handleFieldChange('developmentMilestones', [
      ...formData.developmentMilestones,
      { title: '', description: '' }
    ]);
  };

  const handleMilestoneChange = (index: number, field: keyof DevelopmentMilestone, val: string) => {
    const list = [...formData.developmentMilestones];
    list[index] = { ...list[index], [field]: val };
    handleFieldChange('developmentMilestones', list);
  };

  const handleRemoveMilestone = (index: number) => {
    handleFieldChange(
      'developmentMilestones',
      formData.developmentMilestones.filter((_, i) => i !== index)
    );
  };

  const handleAddWhatsInside = () => {
    handleFieldChange('whatsInside', [
      ...formData.whatsInside,
      { name: '', count: '1 pc', detail: '' }
    ]);
  };

  const handleWhatsInsideChange = (index: number, field: keyof WhatsInsideItem, val: string) => {
    const list = [...formData.whatsInside];
    list[index] = { ...list[index], [field]: val };
    handleFieldChange('whatsInside', list);
  };

  const handleRemoveWhatsInside = (index: number) => {
    handleFieldChange('whatsInside', formData.whatsInside.filter((_, i) => i !== index));
  };

  // Submit
  const handleSave = async (statusOverride?: AdminProduct['status']) => {
    if (!formData.name.trim()) {
      showToast('Product name is required.', 'error');
      setActiveTab('basic');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      showToast('Price must be greater than 0 BDT.', 'error');
      setActiveTab('pricing');
      return;
    }

    setIsSaving(true);
    const payload: CreateProductPayload = {
      ...formData,
      status: statusOverride || formData.status,
      slug:
        formData.slug?.trim() ||
        formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    };

    try {
      if (isEditing && productId) {
        await productService.update(productId, payload);
        showToast('Product updated successfully.');
      } else {
        await productService.create(payload);
        showToast('Product created successfully.');
      }
      setHasUnsavedChanges(false);
      navigate('/admin/products');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save product.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productId) return;
    try {
      await productService.delete(productId);
      showToast('Product deleted.');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      showToast('Could not delete product.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#8C8478]">Loading product configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <PageHeader
        title={isEditing ? `Edit: ${formData.name || 'Product'}` : 'New Montessori Product'}
        subtitle={
          <span className="flex items-center gap-2">
            <span>
              {isEditing
                ? `SKU: ${formData.inventory.sku} · ${formData.category}`
                : 'Configure listing details, materials, child developmental milestones, and stock.'}
            </span>
            {hasUnsavedChanges && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FCF4DB] text-[#9A7316] rounded-full border border-[#DDA428]/40">
                Unsaved changes
              </span>
            )}
          </span>
        }
        breadcrumbs={[
          { label: 'Products', href: '/admin/products' },
          { label: isEditing ? 'Edit Product' : 'New Product' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/products')}
              className="px-3.5 py-2 rounded-xl border border-[#E8E0D2] bg-white text-[#635E55] hover:bg-[#FAF7F1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {isEditing && (
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-[#F28F79]/40 text-[#B83A28] hover:bg-[#FBE8E5] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}

            <button
              onClick={() => handleSave('draft')}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-[#E8E0D2] bg-white text-[#24221F] hover:bg-[#FAF7F1] text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              Save Draft
            </button>

            <button
              onClick={() => handleSave('active')}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{formData.status === 'active' ? 'Update Product' : 'Publish Product'}</span>
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E8E0D2] overflow-x-auto text-xs font-semibold pb-px">
        {[
          { id: 'basic', label: 'Basic Info' },
          { id: 'media', label: `Media (${formData.images.length})` },
          { id: 'pricing', label: 'Pricing & Inventory' },
          { id: 'developmental', label: 'Child Development & Box' },
          { id: 'seo', label: 'Badges & SEO' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === t.id
                ? 'border-[#1C4CB8] text-[#1C4CB8]'
                : 'border-transparent text-[#7D766C] hover:text-[#24221F]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Basic Info */}
      {activeTab === 'basic' && (
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">
                Product Title <span className="text-[#B83A28]">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="e.g. Woodland Balance Friends"
                className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleFieldChange('slug', e.target.value)}
                placeholder="woodland-balance-friends"
                className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">
              Subtitle / Hook
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              placeholder="e.g. Stackable Forest Wildlife Set"
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">
              Short Value Statement
            </label>
            <input
              type="text"
              value={formData.valueStatement}
              onChange={(e) => handleFieldChange('valueStatement', e.target.value)}
              placeholder="e.g. Builds balance, fine motor control and screen-free creativity"
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">
              Main Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Detailed description of the materials, tactile experience, and peaceful play opportunities..."
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">
                Sensory Quote
              </label>
              <input
                type="text"
                value={formData.sensoryQuote}
                onChange={(e) => handleFieldChange('sensoryQuote', e.target.value)}
                placeholder="“Stack, balance and invent a new little world every time.”"
                className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">
                Why Kids Love It (Storefront Highlight)
              </label>
              <input
                type="text"
                value={formData.whyKidsLoveIt}
                onChange={(e) => handleFieldChange('whyKidsLoveIt', e.target.value)}
                placeholder="Children in Dhaka love the smooth animal textures and counterweights..."
                className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Media Gallery */}
      {activeTab === 'media' && (
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-sm font-bold text-[#24221F]">Product Images & Angles</h3>
              <p className="text-xs text-[#8C8478]">
                Primary photo, lifestyle playroom shots, details, and scale references.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMediaPickerOpen(true)}
              className="px-3.5 py-2 bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Image</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.images.map((img, idx) => (
              <div
                key={img.id}
                className="border border-[#E8E0D2] rounded-2xl p-3 bg-[#FAF7F1]/50 space-y-3 relative group"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#E8E0D2] relative">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#1C4CB8] text-white text-[10px] font-bold shadow-xs">
                      Primary
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <select
                      value={img.type}
                      onChange={(e) => {
                        const updated = [...formData.images];
                        updated[idx].type = e.target.value as any;
                        handleFieldChange('images', updated);
                      }}
                      className="text-xs font-semibold bg-white border border-[#E8E0D2] rounded-lg px-2 py-1 text-[#24221F]"
                    >
                      <option value="primary">Primary</option>
                      <option value="gallery">Gallery</option>
                      <option value="lifestyle">Lifestyle In-Play</option>
                      <option value="detail">Material Detail</option>
                      <option value="scale">Scale Reference</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-[#8C8478] hover:text-[#24221F] disabled:opacity-30 cursor-pointer"
                        title="Move left"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'down')}
                        disabled={idx === formData.images.length - 1}
                        className="p-1 rounded text-[#8C8478] hover:text-[#24221F] disabled:opacity-30 cursor-pointer"
                        title="Move right"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="p-1 rounded text-[#8C8478] hover:text-[#B83A28] cursor-pointer"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={img.alt}
                    onChange={(e) => {
                      const updated = [...formData.images];
                      updated[idx].alt = e.target.value;
                      handleFieldChange('images', updated);
                    }}
                    placeholder="Alt description for screen readers"
                    className="w-full px-2 py-1 text-[11px] bg-white border border-[#E8E0D2] rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {formData.images.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-[#D0C8BA] rounded-2xl bg-[#FAF7F1]/50">
              <ImageIcon className="w-8 h-8 text-[#8C8478] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#24221F]">No images uploaded yet</p>
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="mt-3 px-4 py-2 bg-[#1C4CB8] text-white text-xs font-semibold rounded-xl"
              >
                Add First Image
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Pricing & Inventory */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#24221F]">Pricing (Bangladesh BDT ৳)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">
                  Retail Price (৳) <span className="text-[#B83A28]">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs font-bold border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">
                  Original / Compare Price (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.originalPrice || ''}
                  onChange={(e) =>
                    handleFieldChange('originalPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="e.g. 2150"
                  className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">Currency</label>
                <input
                  type="text"
                  disabled
                  value="BDT (৳)"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F1] border border-[#E8E0D2] rounded-xl text-[#7D766C]"
                />
              </div>
            </div>
          </div>

          {/* Inventory Card */}
          <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-sm font-bold text-[#24221F]">Inventory & Stock Control</h3>
                <p className="text-xs text-[#8C8478]">Track quantities and set low-stock thresholds.</p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={formData.inventory.trackInventory}
                  onChange={(e) => handleInventoryChange('trackInventory', e.target.checked)}
                  className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
                />
                <span>Track Stock</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">SKU Code</label>
                <input
                  type="text"
                  value={formData.inventory.sku}
                  onChange={(e) => handleInventoryChange('sku', e.target.value)}
                  placeholder="e.g. GK-WBF-101"
                  className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">
                  Quantity Available
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={!formData.inventory.trackInventory}
                  value={formData.inventory.quantity}
                  onChange={(e) => handleInventoryChange('quantity', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs font-bold border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8] disabled:bg-[#FAF7F1] disabled:text-[#8C8478]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={!formData.inventory.trackInventory}
                  value={formData.inventory.lowStockThreshold}
                  onChange={(e) => handleInventoryChange('lowStockThreshold', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8] disabled:bg-[#FAF7F1] disabled:text-[#8C8478]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="allowBackorder"
                checked={formData.inventory.allowBackorder}
                onChange={(e) => handleInventoryChange('allowBackorder', e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
              <label htmlFor="allowBackorder" className="text-xs text-[#635E55] cursor-pointer">
                Allow customers to place Cash on Delivery orders even when inventory reaches 0.
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Developmental & What's Inside */}
      {activeTab === 'developmental' && (
        <div className="space-y-6">
          {/* Categorization & Tags */}
          <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#24221F]">Age Group & Classification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">Primary Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value as Category)}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">Age Group</label>
                <select
                  value={formData.ageGroup}
                  onChange={(e) => handleFieldChange('ageGroup', e.target.value as AgeRange)}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                >
                  {AGE_GROUPS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">Age Badge Label</label>
                <input
                  type="text"
                  value={formData.ageBadge}
                  onChange={(e) => handleFieldChange('ageBadge', e.target.value)}
                  placeholder="e.g. AGE 3–6"
                  className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                />
              </div>
            </div>

            {/* Multi-select Pills: Interests */}
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-2">Play Interests</label>
              <div className="flex flex-wrap gap-2">
                {ALL_INTERESTS.map((interest) => {
                  const selected = formData.interests?.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleArrayItem('interests', interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#1C4CB8] text-white'
                          : 'bg-[#FAF7F1] border border-[#E8E0D2] text-[#635E55] hover:bg-[#F4EFE6]'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multi-select Pills: Benefits */}
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-2">Developmental Benefits</label>
              <div className="flex flex-wrap gap-2">
                {ALL_BENEFITS.map((benefit) => {
                  const selected = formData.benefits?.includes(benefit);
                  return (
                    <button
                      key={benefit}
                      type="button"
                      onClick={() => toggleArrayItem('benefits', benefit)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#2D6A4F] text-white'
                          : 'bg-[#FAF7F1] border border-[#E8E0D2] text-[#635E55] hover:bg-[#F4EFE6]'
                      }`}
                    >
                      {benefit}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multi-select Pills: Materials */}
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-2">Materials</label>
              <div className="flex flex-wrap gap-2">
                {ALL_MATERIALS.map((material) => {
                  const selected = formData.materials?.includes(material);
                  return (
                    <button
                      key={material}
                      type="button"
                      onClick={() => toggleArrayItem('materials', material)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#8C6C38] text-white'
                          : 'bg-[#FAF7F1] border border-[#E8E0D2] text-[#635E55] hover:bg-[#F4EFE6]'
                      }`}
                    >
                      {material}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Development Milestones */}
          <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-sm font-bold text-[#24221F]">
                  Developmental Milestones (PDP Cards)
                </h3>
                <p className="text-xs text-[#8C8478]">
                  Explain what skills the child gains from this play set.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 rounded-xl border border-[#E8E0D2] text-xs font-semibold hover:bg-[#FAF7F1] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.developmentMilestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 border border-[#E8E0D2] rounded-xl bg-[#FAF7F1]/40 space-y-2 relative group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                      placeholder="Milestone title (e.g. Fine Motor Dexterity)"
                      className="flex-1 px-3 py-1.5 text-xs font-bold border border-[#E8E0D2] rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="text-[#8C8478] hover:text-[#B83A28] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={m.description}
                    onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)}
                    placeholder="Describe how the toy exercises this milestone..."
                    className="w-full px-3 py-1.5 text-xs border border-[#E8E0D2] rounded-lg bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* What's Inside Box */}
          <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-sm font-bold text-[#24221F]">What's Inside The Box</h3>
                <p className="text-xs text-[#8C8478]">Clear contents list shown to parents upon unboxing.</p>
              </div>
              <button
                type="button"
                onClick={handleAddWhatsInside}
                className="px-3 py-1.5 rounded-xl border border-[#E8E0D2] text-xs font-semibold hover:bg-[#FAF7F1] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.whatsInside.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleWhatsInsideChange(idx, 'name', e.target.value)}
                    placeholder="Piece name (e.g. Balancing Bear)"
                    className="flex-2 px-3 py-2 text-xs border border-[#E8E0D2] rounded-xl"
                  />
                  <input
                    type="text"
                    value={item.count}
                    onChange={(e) => handleWhatsInsideChange(idx, 'count', e.target.value)}
                    placeholder="Qty (e.g. 1 pc)"
                    className="w-24 px-3 py-2 text-xs border border-[#E8E0D2] rounded-xl"
                  />
                  <input
                    type="text"
                    value={item.detail}
                    onChange={(e) => handleWhatsInsideChange(idx, 'detail', e.target.value)}
                    placeholder="Material detail"
                    className="flex-2 px-3 py-2 text-xs border border-[#E8E0D2] rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveWhatsInside(idx)}
                    className="text-[#8C8478] hover:text-[#B83A28] p-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: SEO & Badges */}
      {activeTab === 'seo' && (
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">
              Storefront Tag / Ribbon
            </label>
            <select
              value={formData.tag || ''}
              onChange={(e) => handleFieldChange('tag', e.target.value as AdminProduct['tag'])}
              className="w-full max-w-xs px-3.5 py-2.5 text-xs bg-white border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            >
              <option value="">No Badge</option>
              <option value="BESTSELLER">BESTSELLER</option>
              <option value="NEW">NEW</option>
              <option value="STAFF PICK">STAFF PICK</option>
              <option value="RESTOCKED">RESTOCKED</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featuredProd"
              checked={formData.featured}
              onChange={(e) => handleFieldChange('featured', e.target.checked)}
              className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
            />
            <label htmlFor="featuredProd" className="text-xs font-semibold text-[#24221F] cursor-pointer">
              Show in Homepage "Featured Wooden Discoveries" play shelf
            </label>
          </div>

          <div className="pt-4 border-t border-[#F4EFE6] space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#24221F]">Search Engine Optimization (SEO)</h3>
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Meta Title</label>
              <input
                type="text"
                value={formData.seo?.metaTitle || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, metaTitle: e.target.value }
                  }))
                }
                placeholder="Woodland Balance Friends | Montessori Wooden Toys Bangladesh"
                className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={formData.seo?.metaDescription || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, metaDescription: e.target.value }
                  }))
                }
                placeholder="Handmade natural beechwood animal balancing game. Non-toxic organic stains with Cash on Delivery in Bangladesh."
                className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onSelect={handleAddMedia}
        onClose={() => setMediaPickerOpen(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Product?"
        message="Are you sure you want to delete this product? All inventory and storefront associations will be removed."
        confirmLabel="Confirm Delete"
        onConfirm={handleDeleteProduct}
        onClose={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
};
