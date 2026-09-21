import React, { useState, useEffect } from 'react';
import {
  Search,
  Save,
  ArrowRight
} from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminRouter } from '../../../../context/AdminRouterContext';
import { useAdminToast } from '../../common/AdminToast';
import { MockDatabase } from '../../../../lib/mockDb/MockDatabase';
import { clothingService } from '../../../../services';
import type { ApparelProduct, ApparelVariant } from '../../../../types/clothing';

interface FlatVariantRow extends ApparelVariant {
  productId: string;
  productName: string;
  productSlug: string;
  productType: string;
}

export const ClothingInventoryPage: React.FC = () => {
  const { navigate } = useAdminRouter();
  const { showToast } = useAdminToast();

  const [products, setProducts] = useState<ApparelProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterView, setFilterView] = useState<'all' | 'low' | 'out'>('all');
  const [editedStock, setEditedStock] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    const prods = MockDatabase.getClothingProducts();
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsub = MockDatabase.subscribe(loadData);
    return () => unsub();
  }, []);

  // Flatten all variants across products
  const flatVariants: FlatVariantRow[] = products.flatMap((p) =>
    p.variants.map((v) => ({
      ...v,
      productId: p.id,
      productName: p.name,
      productSlug: p.slug,
      productType: p.productType
    }))
  );

  // Filter items
  const filtered = flatVariants.filter((row) => {
    const currentQty = editedStock[row.id] !== undefined ? editedStock[row.id] : row.inventoryQuantity;
    if (filterView === 'low' && (currentQty > (row.lowStockThreshold || 4) || currentQty === 0)) {
      return false;
    }
    if (filterView === 'out' && currentQty !== 0) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = row.productName.toLowerCase().includes(q);
      const matchSku = row.sku.toLowerCase().includes(q);
      const matchColor = row.color.name.toLowerCase().includes(q);
      const matchSize = row.size.label.toLowerCase().includes(q);
      return matchName || matchSku || matchColor || matchSize;
    }
    return true;
  });

  const handleStockChange = (variantId: string, value: number) => {
    setEditedStock((prev) => ({
      ...prev,
      [variantId]: Math.max(0, value)
    }));
  };

  const handleSaveAll = async () => {
    const modifiedCount = Object.keys(editedStock).length;
    if (modifiedCount === 0) {
      showToast('No inventory changes to save', 'info');
      return;
    }

    setSaving(true);
    try {
      // Group modifications by productId
      const updatesByProduct: Record<string, { variantId: string; qty: number }[]> = {};
      Object.entries(editedStock).forEach(([vId, qty]) => {
        const item = flatVariants.find((f) => f.id === vId);
        if (item) {
          if (!updatesByProduct[item.productId]) {
            updatesByProduct[item.productId] = [];
          }
          updatesByProduct[item.productId].push({ variantId: vId, qty });
        }
      });

      for (const [prodId, updates] of Object.entries(updatesByProduct)) {
        const prod = products.find((p) => p.id === prodId);
        if (prod) {
          const updatedVariants = prod.variants.map((v) => {
            const up = updates.find((u) => u.variantId === v.id);
            return up ? { ...v, inventoryQuantity: up.qty } : v;
          });
          await clothingService.updateProduct(prodId, { variants: updatedVariants });
        }
      }

      setEditedStock({});
      showToast(`Updated stock levels for ${modifiedCount} variants`, 'success');
    } catch {
      showToast('Failed to save inventory adjustments', 'error');
    } finally {
      setSaving(false);
    }
  };

  const hasUnsavedChanges = Object.keys(editedStock).length > 0;

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Apparel Variant Inventory"
        subtitle="Manage live stock counts per garment, colorway, and size SKU."
        actions={
          <div className="flex items-center gap-2.5">
            {hasUnsavedChanges && (
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#C85A32] rounded-xl hover:bg-[#B24E2A] transition-colors shadow-2xs cursor-pointer animate-pulse"
              >
                <Save className="w-4 h-4" />
                <span>Save {Object.keys(editedStock).length} Changes</span>
              </button>
            )}
          </div>
        }
      />

      {/* Filter and View Controls */}
      <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#857E73] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU, piece, color, size..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterView('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterView === 'all'
                ? 'bg-[#171715] text-white'
                : 'bg-[#FCFAF7] border border-[#E8E2D5] text-[#524E47] hover:text-[#171715]'
            }`}
          >
            All SKUs ({flatVariants.length})
          </button>
          <button
            onClick={() => setFilterView('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterView === 'low'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setFilterView('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterView === 'out'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#857E73]">
            Loading apparel inventory...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#857E73]">
            No variants matched your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F1] border-b border-[#E8E2D5] text-[#857E73] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Colorway</th>
                  <th className="py-3 px-3">Size System</th>
                  <th className="py-3 px-3 text-center">Current Units</th>
                  <th className="py-3 px-3">Stock Health</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {filtered.map((row) => {
                  const currentQty =
                    editedStock[row.id] !== undefined
                      ? editedStock[row.id]
                      : row.inventoryQuantity;
                  const isDirty = editedStock[row.id] !== undefined;

                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-[#FCFAF7] transition-colors ${
                        isDirty ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Product Name */}
                      <td className="py-3 px-4 font-serif font-bold text-xs text-[#171715]">
                        {row.productName}
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3 font-mono text-[11px] text-[#524E47]">
                        {row.sku}
                      </td>

                      {/* Color */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-black/15 inline-block"
                            style={{ backgroundColor: row.color.hex || '#ccc' }}
                          />
                          <span>{row.color.name}</span>
                        </div>
                      </td>

                      {/* Size */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-[#F2ECE1] text-[#171715] font-bold text-[11px]">
                          {row.size.label}
                        </span>
                      </td>

                      {/* Editable Units Input */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStockChange(row.id, currentQty - 1)}
                            className="w-6 h-6 rounded-lg bg-[#FAF7F1] border border-[#E8E2D5] hover:bg-[#F2ECE1] font-bold text-xs flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={currentQty}
                            onChange={(e) =>
                              handleStockChange(row.id, parseInt(e.target.value) || 0)
                            }
                            className={`w-14 h-7 text-center font-bold rounded-lg border text-xs ${
                              isDirty
                                ? 'border-[#C85A32] ring-1 ring-[#C85A32] bg-white'
                                : 'border-[#E8E2D5] bg-white'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleStockChange(row.id, currentQty + 1)}
                            className="w-6 h-6 rounded-lg bg-[#FAF7F1] border border-[#E8E2D5] hover:bg-[#F2ECE1] font-bold text-xs flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Health Indicator */}
                      <td className="py-3 px-3">
                        {currentQty === 0 ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                            Out of Stock
                          </span>
                        ) : currentQty <= (row.lowStockThreshold || 4) ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Low ({currentQty} left)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Optimal ({currentQty})
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() =>
                            navigate(`/admin/clothing/products/${row.productId}/edit`)
                          }
                          className="text-[#857E73] hover:text-[#C85A32] text-xs font-semibold hover:underline flex items-center gap-1 justify-end cursor-pointer"
                        >
                          <span>Edit</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
