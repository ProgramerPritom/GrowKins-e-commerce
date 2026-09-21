import React, { useState, useEffect } from 'react';
import {
  Save,
  ArrowLeft,
  ExternalLink,
  Plus,
  Trash2,
  Layers,
  Check,
  RefreshCw
} from 'lucide-react';
import { useAdminRouter } from '../../../../context/AdminRouterContext';
import { useAdminToast } from '../../common/AdminToast';
import { clothingService } from '../../../../services';
import type {
  ApparelProduct,
  ApparelVariant,
  ApparelColor,
  ApparelSize,
  ApparelMedia
} from '../../../../types/clothing';

const PRESET_COLORS: ApparelColor[] = [
  { id: 'oat', name: 'Oatmeal Heather', hex: '#E5DDCB' },
  { id: 'cream', name: 'Raw Natural Cream', hex: '#FAF6EF' },
  { id: 'clay', name: 'Terracotta Clay', hex: '#C85A32' },
  { id: 'sage', name: 'Muted Sage Green', hex: '#8F9B88' },
  { id: 'indigo', name: 'Breton Indigo Blue', hex: '#3B5998' },
  { id: 'dusty-rose', name: 'Dusky Rose', hex: '#D4A5A5' },
  { id: 'butter', name: 'Soft Butter Gold', hex: '#F3E5AB' },
  { id: 'charcoal', name: 'Espresso Charcoal', hex: '#2C2B29' }
];

const PRESET_CLOTHING_SIZES: ApparelSize[] = [
  { id: 'nb', label: 'Newborn', ageHint: '0M', system: 'baby' },
  { id: '0-3m', label: '0–3 Months', ageHint: '62 cm', system: 'baby' },
  { id: '3-6m', label: '3–6 Months', ageHint: '68 cm', system: 'baby' },
  { id: '6-9m', label: '6–9 Months', ageHint: '74 cm', system: 'baby' },
  { id: '9-12m', label: '9–12 Months', ageHint: '80 cm', system: 'baby' },
  { id: '12-18m', label: '12–18 Months', ageHint: '86 cm', system: 'toddler' },
  { id: '18-24m', label: '18–24 Months', ageHint: '92 cm', system: 'toddler' }
];

const PRESET_SHOE_SIZES: ApparelSize[] = [
  { id: 'eu19', label: 'EU 19 (11.5 cm)', ageHint: '6-9M', system: 'shoe' },
  { id: 'eu20', label: 'EU 20 (12.2 cm)', ageHint: '9-12M', system: 'shoe' },
  { id: 'eu21', label: 'EU 21 (12.8 cm)', ageHint: '12-18M', system: 'shoe' },
  { id: 'eu22', label: 'EU 22 (13.5 cm)', ageHint: '18-24M', system: 'shoe' }
];

const CARE_PRESETS = [
  'Machine wash 30°C gentle cycle',
  'Do not bleach',
  'Tumble dry low or line dry in shade',
  'Warm iron inside out',
  'Wash with similar colors',
  'Do not dry clean',
  'Wipe clean with damp cloth'
];

export const ClothingProductEditorPage: React.FC = () => {
  const { params, navigate } = useAdminRouter();
  const { showToast } = useAdminToast();

  const isEditing = Boolean(params.id && params.id !== 'new');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [productType, setProductType] = useState<ApparelProduct['productType']>('shirt');
  const [ageGroup, setAgeGroup] = useState<ApparelProduct['ageGroup']>('baby');
  const [ageLabel, setAgeLabel] = useState('0–24 Months');
  const [status, setStatus] = useState<ApparelProduct['status']>('active');
  const [price, setPrice] = useState(1250);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [fitType, setFitType] = useState<'slim' | 'regular' | 'relaxed' | 'oversized'>('regular');
  const [fitNotes, setFitNotes] = useState('');
  const [materials, setMaterials] = useState([
    { name: 'Organic Combed Cotton', percentage: 100 }
  ]);
  const [careInstructions, setCareInstructions] = useState<string[]>([
    'Machine wash 30°C gentle cycle',
    'Do not bleach',
    'Tumble dry low or line dry in shade'
  ]);
  const [badges, setBadges] = useState<string[]>(['New In']);
  const [categoryIds, setCategoryIds] = useState<string[]>(['tops']);
  const [collectionIds, setCollectionIds] = useState<string[]>(['new-in']);

  // Media state
  const [images, setImages] = useState<ApparelMedia[]>([]);

  // Variants state
  const [variants, setVariants] = useState<ApparelVariant[]>([]);

  // Variant Matrix Generator Selection State
  const isShoe = productType === 'shoe';
  const sizePalette = isShoe ? PRESET_SHOE_SIZES : PRESET_CLOTHING_SIZES;
  const [selectedColorIds, setSelectedColorIds] = useState<string[]>(['oat', 'indigo']);
  const [selectedSizeIds, setSelectedSizeIds] = useState<string[]>(['3-6m', '6-9m', '9-12m']);

  // Load existing product if editing
  useEffect(() => {
    if (!isEditing || !params.id) return;

    async function fetchProduct() {
      setLoading(true);
      const prod = await clothingService.getProductById(params.id);
      if (prod) {
        setName(prod.name);
        setSlug(prod.slug);
        setProductType(prod.productType);
        setAgeGroup(prod.ageGroup);
        setAgeLabel(prod.ageLabel);
        setStatus(prod.status);
        setPrice(prod.price);
        setCompareAtPrice(prod.compareAtPrice);
        setDescription(prod.description);
        if (prod.fit) {
          if (prod.fit.type) setFitType(prod.fit.type);
          if (prod.fit.notes) setFitNotes(prod.fit.notes);
        }
        setMaterials(
          (prod.materials || [{ name: 'Cotton', percentage: 100 }]).map((m) => ({
            name: m.name,
            percentage: m.percentage ?? 100
          }))
        );
        setCareInstructions(prod.careInstructions || []);
        setBadges(prod.badges || []);
        setCategoryIds(prod.categoryIds || []);
        setCollectionIds(prod.collectionIds || []);
        setImages(prod.images || []);
        setVariants(prod.variants || []);

        // Pre-select colors & sizes for matrix generator
        const existingColorIds = Array.from(new Set(prod.variants.map((v) => v.color.id)));
        const existingSizeIds = Array.from(new Set(prod.variants.map((v) => v.size.id)));
        if (existingColorIds.length > 0) setSelectedColorIds(existingColorIds);
        if (existingSizeIds.length > 0) setSelectedSizeIds(existingSizeIds);
      } else {
        showToast('Apparel product not found', 'error');
        navigate('/admin/clothing/products');
      }
      setLoading(false);
    }

    fetchProduct();
  }, [params.id, isEditing]);

  // Auto-slug generator
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  // Generate / Regenerate Variant Matrix
  const handleGenerateMatrix = () => {
    const chosenColors = PRESET_COLORS.filter((c) => selectedColorIds.includes(c.id));
    const chosenSizes = sizePalette.filter((s) => selectedSizeIds.includes(s.id));

    if (chosenColors.length === 0 || chosenSizes.length === 0) {
      showToast('Select at least 1 color and 1 size to generate matrix', 'error');
      return;
    }

    const newVariants: ApparelVariant[] = [];
    const baseSkuPrefix = (slug || 'ITEM').toUpperCase().slice(0, 5);

    chosenColors.forEach((c) => {
      chosenSizes.forEach((s) => {
        // Check if already exists to preserve current inventory
        const existing = variants.find((v) => v.color.id === c.id && v.size.id === s.id);
        if (existing) {
          newVariants.push(existing);
        } else {
          const skuColorPart = c.name.slice(0, 3).toUpperCase();
          const skuSizePart = s.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
          newVariants.push({
            id: `v-${c.id}-${s.id}-${Date.now()}`,
            sku: `${baseSkuPrefix}-${skuColorPart}-${skuSizePart}`,
            color: c,
            size: s,
            price: price,
            inventoryQuantity: 6,
            lowStockThreshold: 3,
            status: 'active'
          });
        }
      });
    });

    setVariants(newVariants);
    showToast(`Generated ${newVariants.length} color × size combinations`, 'success');
  };

  // Update specific variant inventory
  const handleUpdateStock = (colorId: string, sizeId: string, qty: number) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.color.id === colorId && v.size.id === sizeId) {
          return { ...v, inventoryQuantity: Math.max(0, qty) };
        }
        return v;
      })
    );
  };

  // Add default image if none exist
  const handleAddMedia = () => {
    const newMedia: ApparelMedia = {
      id: `img-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      type: 'front',
      alt: `${name} front view`
    };
    setImages((prev) => [...prev, newMedia]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showToast('Product title is required', 'error');
      return;
    }
    if (!slug.trim()) {
      showToast('Product slug is required', 'error');
      return;
    }
    if (variants.length === 0) {
      showToast('Generate at least one variant before saving', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<ApparelProduct> = {
        name,
        slug,
        commerceType: 'apparel',
        productType,
        ageGroup,
        ageLabel,
        description,
        price,
        compareAtPrice,
        currency: 'BDT',
        status,
        materials,
        careInstructions,
        fit: {
          type: fitType,
          notes: fitNotes
        },
        variants,
        images:
          images.length > 0
            ? images
            : [
                {
                  id: 'img-1',
                  url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
                  type: 'front',
                  alt: name
                }
              ],
        categoryIds,
        collectionIds,
        badges
      };

      if (isEditing && params.id) {
        await clothingService.updateProduct(params.id, payload);
        showToast('Apparel piece updated successfully', 'success');
      } else {
        await clothingService.createProduct(payload as any);
        showToast('New apparel piece added to catalog', 'success');
      }

      navigate('/admin/clothing/products');
    } catch {
      showToast('Error saving apparel product', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-[#857E73]">
        Loading garment configuration...
      </div>
    );
  }

  // Active matrix dimensions
  const activeColorList = Array.from(
    new Map(variants.map((v) => [v.color.id, v.color])).values()
  );
  const activeSizeList = Array.from(
    new Map(variants.map((v) => [v.size.id, v.size])).values()
  );

  return (
    <div className="space-y-8 pb-20 text-left w-full">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/clothing/products')}
            className="p-2 rounded-xl border border-[#E8E2D5] hover:bg-[#FAF7F1] text-[#524E47] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#171715]">
              {isEditing ? `Edit · ${name}` : 'New Clothing Garment'}
            </h1>
            <p className="text-xs text-[#857E73]">
              Configure apparel specifications, colorways, and color × size inventory matrix.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isEditing && (
            <button
              onClick={() => window.open(`/clothing/product/${slug}`, '_blank')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#524E47] bg-white border border-[#E8E2D5] rounded-xl hover:bg-[#FAF7F1] transition-colors cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview in Boutique</span>
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#C85A32] rounded-xl hover:bg-[#B24E2A] transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Garment'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#171715] flex items-center gap-2">
              <span>Basic Information</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Garment Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Cloud Soft Pocket Shirt"
                  className="w-full h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#171715] mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs font-mono focus:outline-none focus:border-[#C85A32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#171715] mb-1">
                    Apparel Category Type *
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs bg-white focus:outline-none focus:border-[#C85A32]"
                  >
                    <option value="shirt">Shirts & Tops</option>
                    <option value="tshirt">T-Shirts & Breton</option>
                    <option value="pants">Pants & Trousers</option>
                    <option value="shorts">Shorts & Bloomers</option>
                    <option value="romper">Rompers & Bodysuits</option>
                    <option value="set">Matching Sets</option>
                    <option value="outerwear">Cardigans & Knitwear</option>
                    <option value="shoe">Baby Shoes & Sandals</option>
                    <option value="sock">Socks & Booties</option>
                    <option value="accessory">Accessories & Hats</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#171715] mb-1">
                    Age Group Range
                  </label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs bg-white focus:outline-none focus:border-[#C85A32]"
                  >
                    <option value="newborn">Newborn (0-3M)</option>
                    <option value="baby">Baby (0-24M)</option>
                    <option value="toddler">Toddler (1-3Y)</option>
                    <option value="kids">Kids (2-6Y)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#171715] mb-1">
                    Display Age Tag
                  </label>
                  <input
                    type="text"
                    value={ageLabel}
                    onChange={(e) => setAgeLabel(e.target.value)}
                    placeholder="e.g. 0–24 Months"
                    className="w-full h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Editorial Garment Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the fabric drape, hand-feel, snap placements, and aesthetic details..."
                  className="w-full p-3 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
                />
              </div>
            </div>
          </div>

          {/* Card 2: VARIANT MATRIX GENERATOR & INVENTORY */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D5] pb-4">
              <div>
                <h2 className="font-serif font-bold text-base text-[#171715] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C85A32]" />
                  <span>Variant Matrix Generator</span>
                </h2>
                <p className="text-[11px] text-[#857E73]">
                  Generate colorways × sizes and manage stock levels directly per combination.
                </p>
              </div>

              <button
                onClick={handleGenerateMatrix}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F1] border border-[#C85A32] text-[#C85A32] rounded-xl text-xs font-bold hover:bg-[#FAF3EE] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate Matrix</span>
              </button>
            </div>

            {/* Matrix Configurator Checkboxes */}
            <div className="space-y-4 bg-[#FCFAF7] border border-[#E8E2D5] rounded-xl p-4">
              {/* Color Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#524E47] mb-2">
                  1. Select Available Colorways:
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => {
                    const isSelected = selectedColorIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedColorIds((prev) =>
                            isSelected ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#171715] bg-white font-bold shadow-2xs text-[#171715]'
                            : 'border-[#E8E2D5] bg-white/60 text-[#857E73] hover:text-[#171715]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#171715]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#524E47] mb-2">
                  2. Select Available Sizes ({isShoe ? 'Shoe Sizes' : 'Clothing Sizes'}):
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizePalette.map((s) => {
                    const isSelected = selectedSizeIds.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedSizeIds((prev) =>
                            isSelected ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#C85A32] bg-[#FAF3EE] text-[#C85A32] font-bold shadow-2xs'
                            : 'border-[#E8E2D5] bg-white/60 text-[#857E73] hover:text-[#171715]'
                        }`}
                      >
                        <span>{s.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#C85A32]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* LIVE VARIANT MATRIX TABLE */}
            {variants.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#857E73]">
                  <span className="font-semibold text-[#171715]">
                    Inventory Matrix ({variants.length} total SKUs)
                  </span>
                  <span className="text-[11px]">Edit stock directly in cells</span>
                </div>

                <div className="overflow-x-auto border border-[#E8E2D5] rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-[#FAF7F1] border-b border-[#E8E2D5] text-[#857E73] text-[10px] uppercase font-bold">
                        <th className="py-2.5 px-3 min-w-36">Color</th>
                        {activeSizeList.map((s) => (
                          <th key={s.id} className="py-2.5 px-3 text-center min-w-20">
                            {s.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECE1]">
                      {activeColorList.map((c) => (
                        <tr key={c.id} className="hover:bg-[#FCFAF7]">
                          <td className="py-2 px-3 font-semibold text-[#171715]">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/15 inline-block"
                                style={{ backgroundColor: c.hex }}
                              />
                              <span className="truncate">{c.name}</span>
                            </div>
                          </td>

                          {activeSizeList.map((s) => {
                            const variant = variants.find(
                              (v) => v.color.id === c.id && v.size.id === s.id
                            );
                            if (!variant) {
                              return (
                                <td key={s.id} className="py-2 px-3 text-center text-[#B0AAA0]">
                                  —
                                </td>
                              );
                            }
                            return (
                              <td key={s.id} className="py-2 px-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  value={variant.inventoryQuantity}
                                  onChange={(e) =>
                                    handleUpdateStock(
                                      c.id,
                                      s.id,
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className={`w-16 h-8 text-center text-xs font-bold rounded-lg border focus:outline-none focus:border-[#C85A32] ${
                                    variant.inventoryQuantity === 0
                                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                                      : variant.inventoryQuantity < 4
                                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                                      : 'bg-white border-[#E8E2D5] text-[#171715]'
                                  }`}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#857E73] bg-[#FAF7F1] rounded-xl border border-dashed border-[#E8E2D5]">
                No variants configured yet. Pick colorways and sizes above, then click "Generate Matrix".
              </div>
            )}
          </div>

          {/* Card 3: Material & Care */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#171715]">
              Fabric Composition & Care Instructions
            </h2>

            <div className="space-y-4 text-xs">
              {/* Materials */}
              <div className="space-y-2">
                <label className="block font-semibold text-[#171715]">
                  Fabric Composition
                </label>
                {materials.map((mat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={mat.name}
                      onChange={(e) => {
                        const next = [...materials];
                        next[idx].name = e.target.value;
                        setMaterials(next);
                      }}
                      placeholder="e.g. Organic Double Gauze Cotton"
                      className="flex-1 h-9 px-3 rounded-xl border border-[#E8E2D5] text-xs"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={mat.percentage}
                        onChange={(e) => {
                          const next = [...materials];
                          next[idx].percentage = parseInt(e.target.value) || 0;
                          setMaterials(next);
                        }}
                        className="w-16 h-9 px-2 text-center rounded-xl border border-[#E8E2D5] text-xs font-bold"
                      />
                      <span>%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Care Instructions */}
              <div className="space-y-2">
                <label className="block font-semibold text-[#171715]">
                  Care Guidelines
                </label>
                <div className="flex flex-wrap gap-2">
                  {CARE_PRESETS.map((item) => {
                    const isChecked = careInstructions.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setCareInstructions((prev) =>
                            isChecked ? prev.filter((x) => x !== item) : [...prev, item]
                          );
                        }}
                        className={`px-3 py-1 rounded-xl text-xs border transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-[#171715] text-white border-[#171715]'
                            : 'bg-white text-[#524E47] border-[#E8E2D5] hover:border-[#171715]'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Fit Information */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#171715]">
              Fit & Silhouette Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Fit Profile
                </label>
                <select
                  value={fitType}
                  onChange={(e) => setFitType(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs bg-white"
                >
                  <option value="slim">Slim Fit</option>
                  <option value="regular">Regular Classic Fit</option>
                  <option value="relaxed">Relaxed Comfort Fit</option>
                  <option value="oversized">Editorial Oversized</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Fit Notes for Parents
                </label>
                <input
                  type="text"
                  value={fitNotes}
                  onChange={(e) => setFitNotes(e.target.value)}
                  placeholder="e.g. Cut with extra diaper ease through hips"
                  className="w-full h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Pricing */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#171715]">
              Status & Pricing
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Catalog Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs bg-white"
                >
                  <option value="active">Active (Visible in boutique)</option>
                  <option value="draft">Draft (Admin review only)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Retail Price (৳ BDT) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Compare At Price (৳ BDT)
                </label>
                <input
                  type="number"
                  min="0"
                  value={compareAtPrice || ''}
                  onChange={(e) =>
                    setCompareAtPrice(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  placeholder="Optional crossed-out price"
                  className="w-full h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs"
                />
              </div>
            </div>
          </div>

          {/* Media Images */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-base text-[#171715]">
                Photography & Angles
              </h2>
              <button
                type="button"
                onClick={handleAddMedia}
                className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image</span>
              </button>
            </div>

            {images.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#857E73] bg-[#FAF7F1] rounded-xl border border-dashed border-[#E8E2D5]">
                No photos assigned. Default lifestyle image will be applied.
              </div>
            ) : (
              <div className="space-y-3">
                {images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="p-2.5 rounded-xl border border-[#E8E2D5] bg-[#FCFAF7] flex items-center gap-3"
                  >
                    <img
                      src={img.url}
                      alt={img.alt || img.altText || 'Garment photo'}
                      className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <select
                        value={img.type || 'front'}
                        onChange={(e) => {
                          const next = [...images];
                          next[idx].type = e.target.value as any;
                          setImages(next);
                        }}
                        className="w-full h-7 px-1.5 rounded-lg border border-[#E8E2D5] text-[11px] bg-white"
                      >
                        <option value="front">Front View</option>
                        <option value="back">Back View</option>
                        <option value="detail">Macro Detail</option>
                        <option value="model">Lifestyle / Model</option>
                      </select>
                      <input
                        type="text"
                        value={img.url}
                        onChange={(e) => {
                          const next = [...images];
                          next[idx].url = e.target.value;
                          setImages(next);
                        }}
                        placeholder="Image URL"
                        className="w-full mt-1 text-[10px] text-[#857E73] truncate border-b border-[#E8E2D5] pb-0.5 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-1 text-[#857E73] hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badges & Tags */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-6 shadow-2xs space-y-3">
            <h2 className="font-serif font-bold text-base text-[#171715]">
              Editorial Badges
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {['New In', 'Best Seller', 'Organic', 'Hand-Crafted', 'First Steps', 'Archive'].map(
                (badge) => {
                  const hasBadge = badges.includes(badge);
                  return (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => {
                        setBadges((prev) =>
                          hasBadge ? prev.filter((b) => b !== badge) : [...prev, badge]
                        );
                      }}
                      className={`px-3 py-1 rounded-xl border transition-colors cursor-pointer ${
                        hasBadge
                          ? 'bg-[#C85A32] text-white border-[#C85A32] font-semibold'
                          : 'bg-white text-[#524E47] border-[#E8E2D5]'
                      }`}
                    >
                      {badge}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
