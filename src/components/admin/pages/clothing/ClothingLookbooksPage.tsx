import React, { useState, useEffect, useRef } from 'react';
import {
  Trash2,
  ExternalLink,
  Save,
  MapPin
} from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminToast } from '../../common/AdminToast';
import { MockDatabase } from '../../../../lib/mockDb/MockDatabase';
import { clothingService } from '../../../../services';
import type { FashionLook, ApparelProduct } from '../../../../types/clothing';

export const ClothingLookbooksPage: React.FC = () => {
  const { showToast } = useAdminToast();
  const [looks, setLooks] = useState<FashionLook[]>([]);
  const [products, setProducts] = useState<ApparelProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected look for hotspot visual editor
  const [editingLook, setEditingLook] = useState<FashionLook | null>(null);
  const [activeHotspotIndex, setActiveHotspotIndex] = useState<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    setLoading(true);
    const [looksData, prodsData] = await Promise.all([
      clothingService.getLooks(),
      clothingService.getProducts({ limit: 100 })
    ]);
    setLooks(looksData);
    setProducts(prodsData.items);
    if (looksData.length > 0 && !editingLook) {
      setEditingLook(looksData[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsub = MockDatabase.subscribe(loadData);
    return () => unsub();
  }, []);

  // Click canvas to place or move hotspot
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editingLook || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newHotspot = {
      id: `spot-${Date.now()}`,
      x,
      y,
      productId: products[0]?.id || ''
    };

    const nextSpots = [...editingLook.hotspots, newHotspot];
    const nextProductIds = Array.from(new Set([...editingLook.productIds, newHotspot.productId]));

    setEditingLook({
      ...editingLook,
      hotspots: nextSpots,
      productIds: nextProductIds
    });
    setActiveHotspotIndex(nextSpots.length - 1);
    showToast(`Placed hotspot at (${x}%, ${y}%)`, 'info');
  };

  const handleUpdateHotspotProduct = (idx: number, prodId: string) => {
    if (!editingLook) return;
    const nextSpots = [...editingLook.hotspots];
    nextSpots[idx].productId = prodId;

    const nextProductIds = Array.from(new Set(nextSpots.map((s) => s.productId)));
    setEditingLook({
      ...editingLook,
      hotspots: nextSpots,
      productIds: nextProductIds
    });
  };

  const handleDeleteHotspot = (idx: number) => {
    if (!editingLook) return;
    const nextSpots = editingLook.hotspots.filter((_, i) => i !== idx);
    const nextProductIds = Array.from(new Set(nextSpots.map((s) => s.productId)));
    setEditingLook({
      ...editingLook,
      hotspots: nextSpots,
      productIds: nextProductIds
    });
    setActiveHotspotIndex(null);
  };

  const handleSaveLook = async () => {
    if (!editingLook) return;
    try {
      await clothingService.updateLook(editingLook.id, editingLook);
      showToast('Fashion Look & Hotspots saved', 'success');
    } catch {
      showToast('Failed to save look', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      <PageHeader
        title="Fashion Looks & Hotspots Editor"
        subtitle="Place interactive product pins on styled editorial lifestyle photography."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.open('/clothing/lookbook', '_blank')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#524E47] bg-white border border-[#E8E2D5] rounded-xl hover:bg-[#FAF7F1] cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Lookbook</span>
            </button>
            <button
              onClick={handleSaveLook}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#C85A32] rounded-xl hover:bg-[#B24E2A] cursor-pointer shadow-2xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Look</span>
            </button>
          </div>
        }
      />

      {/* Look Selector Tabs */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#857E73]">Loading editorial looks...</div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {looks.map((l) => (
          <button
            key={l.id}
            onClick={() => {
              setEditingLook(l);
              setActiveHotspotIndex(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              editingLook?.id === l.id
                ? 'bg-[#171715] text-white shadow-xs'
                : 'bg-white border border-[#E8E2D5] text-[#524E47] hover:bg-[#FAF7F1]'
            }`}
          >
            {l.title} ({l.hotspots.length} pins)
          </button>
        ))}
      </div>
      )}

      {editingLook && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Interactive Canvas (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#171715]">
                  Editorial Canvas
                </h3>
                <p className="text-[11px] text-[#857E73]">
                  Click anywhere on the photo to place a new interactive hotspot pin.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#C85A32] bg-[#FAF3EE] px-2 py-0.5 rounded font-bold">
                {editingLook.hotspots.length} Hotspots Placed
              </span>
            </div>

            {/* Clickable Image Canvas */}
            <div
              ref={imageContainerRef}
              onClick={handleCanvasClick}
              className="relative aspect-4/3 sm:aspect-16/11 rounded-xl overflow-hidden bg-[#F5F2EA] border border-[#E8E2D5] cursor-crosshair select-none"
            >
              <img
                src={editingLook.image}
                alt={editingLook.title}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Placed Hotspot Markers */}
              {editingLook.hotspots.map((spot, idx) => {
                const isSelected = activeHotspotIndex === idx;
                const taggedProd = products.find((p) => p.id === spot.productId);

                return (
                  <div
                    key={spot.id || idx}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspotIndex(idx);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform cursor-pointer z-20 ${
                      isSelected
                        ? 'bg-[#C85A32] text-white ring-4 ring-[#C85A32]/30 scale-125'
                        : 'bg-white text-[#171715] hover:scale-110 border border-black/10'
                    }`}
                    title={taggedProd?.name || 'Pin'}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-[#857E73] flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>Pins represent coordinate percentages (X/Y) relative to image boundaries.</span>
            </div>
          </div>

          {/* Hotspot Configuration Sidebar (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#171715]">
              Hotspot Pins Configuration
            </h3>

            {editingLook.hotspots.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#857E73] bg-[#FCFAF7] rounded-xl border border-dashed border-[#E8E2D5]">
                No pins placed yet. Click on the photo canvas on the left to add your first garment tag.
              </div>
            ) : (
              <div className="space-y-3 max-h-130 overflow-y-auto pr-1">
                {editingLook.hotspots.map((spot, idx) => {
                  const isSelected = activeHotspotIndex === idx;
                  const taggedProd = products.find((p) => p.id === spot.productId);

                  return (
                    <div
                      key={spot.id || idx}
                      onClick={() => setActiveHotspotIndex(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'border-[#C85A32] bg-[#FAF3EE] shadow-2xs'
                          : 'border-[#E8E2D5] bg-[#FCFAF7] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#171715] text-white text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-[#171715]">
                            Hotspot #{idx + 1}
                          </span>
                          <span className="text-[10px] text-[#857E73] font-mono">
                            ({spot.x}%, {spot.y}%)
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteHotspot(idx);
                          }}
                          className="p-1 text-[#857E73] hover:text-rose-600 rounded cursor-pointer"
                          title="Delete pin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Product Selector for this pin */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#857E73] mb-1">
                          Tagged Garment:
                        </label>
                        <select
                          value={spot.productId}
                          onChange={(e) => handleUpdateHotspotProduct(idx, e.target.value)}
                          className="w-full h-8 px-2 rounded-lg border border-[#E8E2D5] text-xs bg-white text-[#171715] focus:outline-none focus:border-[#C85A32]"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (৳{p.price})
                            </option>
                          ))}
                        </select>
                      </div>

                      {taggedProd && (
                        <div className="flex items-center gap-2 pt-1">
                          <img
                            src={taggedProd.images[0]?.url}
                            alt={taggedProd.name}
                            className="w-8 h-8 rounded-lg object-cover bg-white border border-[#E8E2D5]"
                          />
                          <div className="min-w-0 text-[11px]">
                            <div className="font-semibold text-[#171715] truncate">
                              {taggedProd.name}
                            </div>
                            <div className="text-[10px] text-[#857E73]">
                              ৳{taggedProd.price} · {taggedProd.ageLabel}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
