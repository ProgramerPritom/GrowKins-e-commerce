import React, { useState, useEffect } from 'react';
import {
  Shirt,
  Layers,
  AlertTriangle,
  Plus,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Ruler
} from 'lucide-react';
import { MetricCard } from '../../common/MetricCard';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminRouter } from '../../../../context/AdminRouterContext';
import { MockDatabase } from '../../../../lib/mockDb/MockDatabase';
import type { ApparelProduct } from '../../../../types/clothing';
import type { AdminOrder } from '../../../../types/admin';

export const ClothingDashboardPage: React.FC = () => {
  const { navigate } = useAdminRouter();
  const [products, setProducts] = useState<ApparelProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    const load = () => {
      setProducts(MockDatabase.getClothingProducts());
      setOrders(MockDatabase.getOrders());
    };
    load();
    const unsub = MockDatabase.subscribe(load);
    return () => unsub();
  }, []);

  // Compute metrics
  const activeProducts = products.filter((p) => p.status === 'active');
  const allVariants = products.flatMap((p) =>
    p.variants.map((v) => ({ ...v, productName: p.name, productSlug: p.slug, productId: p.id }))
  );
  const totalVariants = allVariants.length;
  const lowStockVariants = allVariants.filter(
    (v) => v.inventoryQuantity <= (v.lowStockThreshold || 4)
  );
  const outOfStockVariants = allVariants.filter((v) => v.inventoryQuantity === 0);

  // Clothing orders
  const clothingOrders = orders.filter((o) =>
    o.items.some((it) => it.variant || it.sku?.startsWith('SHIRT-') || it.sku?.startsWith('TEE-') || it.sku?.startsWith('PANTS-') || it.sku?.startsWith('ROMP-') || it.sku?.startsWith('SET-') || it.sku?.startsWith('SHOE-') || it.sku?.startsWith('CARD-') || it.sku?.startsWith('SAND-'))
  );

  const totalApparelRevenue = clothingOrders.reduce((sum, o) => sum + o.total, 0);

  // Size distribution breakdown
  const sizeCounts: Record<string, number> = {};
  allVariants.forEach((v) => {
    const lbl = v.size.label;
    sizeCounts[lbl] = (sizeCounts[lbl] || 0) + v.inventoryQuantity;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Page Header */}
      <PageHeader
        title="Little Wardrobe · Fashion Overview"
        subtitle="Apparel catalog health, variant inventory levels, and children's fashion sales."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.open('/clothing', '_blank')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#524E47] bg-white border border-[#E8E2D5] rounded-xl hover:bg-[#FAF7F1] transition-colors cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Fashion Boutique</span>
            </button>

            <button
              onClick={() => navigate('/admin/clothing/products/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#C85A32] rounded-xl hover:bg-[#B24E2A] transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Clothing Item</span>
            </button>
          </div>
        }
      />

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Active Apparel Pieces"
          value={activeProducts.length.toString()}
          subtitle={`Across ${products.length} catalog items`}
          icon={Shirt}
          iconColor="text-[#C85A32]"
        />
        <MetricCard
          title="Total SKUs / Variants"
          value={totalVariants.toString()}
          subtitle="Color × size matrix combinations"
          icon={Layers}
          iconColor="text-[#1C4CB8]"
        />
        <MetricCard
          title="Low Stock Variants"
          value={lowStockVariants.length.toString()}
          subtitle={`${outOfStockVariants.length} completely out of stock`}
          change={{
            value: `${lowStockVariants.length} items`,
            positive: lowStockVariants.length === 0
          }}
          icon={AlertTriangle}
          iconColor="text-[#E0533C]"
        />
        <MetricCard
          title="Fashion Orders (COD)"
          value={clothingOrders.length.toString()}
          subtitle={`৳${totalApparelRevenue.toLocaleString()} volume`}
          icon={Sparkles}
          iconColor="text-[#388E3C]"
        />
      </div>

      {/* Split Section: Low Stock Variant Alerts & Size Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Low-Stock Variant Alerts (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E8E2D5] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#FDF2F0] text-[#E0533C]">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#171715]">
                  Variant Stock Warnings
                </h3>
                <p className="text-[11px] text-[#857E73]">
                  Apparel SKUs at or below restock threshold
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/clothing/inventory')}
              className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Variant Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {lowStockVariants.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#857E73] flex flex-col items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
              All apparel sizes and colors are well-stocked!
            </div>
          ) : (
            <div className="divide-y divide-[#F2ECE1] overflow-x-auto">
              {lowStockVariants.slice(0, 6).map((variant) => (
                <div
                  key={variant.id}
                  className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-[#FCFAF7] px-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-[#171715] truncate">
                      {variant.productName}
                    </div>
                    <div className="text-[11px] text-[#857E73] flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: variant.color.hex || '#ccc' }}
                        />
                        {variant.color.name}
                      </span>
                      <span>·</span>
                      <span className="font-bold text-[#171715] bg-[#F5F2EA] px-1.5 py-0.5 rounded">
                        {variant.size.label}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[10px] text-[#857E73]">
                        {variant.sku}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        variant.inventoryQuantity === 0
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {variant.inventoryQuantity === 0
                        ? 'Out of Stock'
                        : `${variant.inventoryQuantity} left`}
                    </span>
                    <button
                      onClick={() =>
                        navigate(`/admin/clothing/products/${variant.productId}/edit`)
                      }
                      className="p-1.5 hover:bg-[#F2ECE1] rounded-lg text-[#524E47] cursor-pointer"
                      title="Edit Product"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Size Distribution & Quick Navigation (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Inventory by Size System */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#FAF3EE] text-[#C85A32]">
                <Ruler className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#171715]">
                  Size Inventory Balance
                </h3>
                <p className="text-[11px] text-[#857E73]">
                  Stock distributed across baby & toddler sizes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {Object.entries(sizeCounts)
                .slice(0, 9)
                .map(([sizeLabel, count]) => (
                  <div
                    key={sizeLabel}
                    className="p-2.5 rounded-xl border border-[#E8E2D5] bg-[#FCFAF7] text-center"
                  >
                    <div className="text-[11px] font-bold text-[#857E73]">{sizeLabel}</div>
                    <div className="text-base font-bold font-sans text-[#171715] mt-0.5">
                      {count} <span className="text-[10px] font-normal text-[#857E73]">units</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Hub Links */}
          <div className="bg-[#171715] text-white rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#EBD699]">
              Fashion Management Hub
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/admin/clothing/products')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-left font-semibold transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>Products List</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#EBD699]" />
              </button>
              <button
                onClick={() => navigate('/admin/clothing/lookbooks')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-left font-semibold transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>Shop The Look CMS</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#EBD699]" />
              </button>
              <button
                onClick={() => navigate('/admin/clothing/size-guides')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-left font-semibold transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>Size Chart Guides</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#EBD699]" />
              </button>
              <button
                onClick={() => navigate('/admin/clothing/content/homepage')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-left font-semibold transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>Homepage CMS</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#EBD699]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Clothing Products Preview */}
      <div className="bg-white border border-[#E8E2D5] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-[#171715]">
              Active Apparel Catalog
            </h3>
            <p className="text-xs text-[#857E73]">
              Recently updated clothing & shoe items
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/clothing/products')}
            className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => {
            const totalStock = p.variants.reduce((s, v) => s + v.inventoryQuantity, 0);
            return (
              <div
                key={p.id}
                onClick={() => navigate(`/admin/clothing/products/${p.id}/edit`)}
                className="group p-3.5 rounded-xl border border-[#E8E2D5] hover:border-[#C85A32] bg-[#FCFAF7] transition-all cursor-pointer shadow-2xs"
              >
                <div className="aspect-4/3 rounded-lg overflow-hidden bg-white mb-3">
                  <img
                    src={p.images[0]?.url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="font-serif font-bold text-xs text-[#171715] truncate">
                  {p.name}
                </div>
                <div className="text-[11px] text-[#857E73] flex justify-between mt-1">
                  <span>৳{p.price.toLocaleString()}</span>
                  <span className="font-semibold text-[#524E47]">{p.variants.length} variants</span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#E8E2D5] flex justify-between text-[10px]">
                  <span className="capitalize text-[#857E73]">{p.productType}</span>
                  <span
                    className={`font-bold ${
                      totalStock <= 10 ? 'text-amber-600' : 'text-emerald-700'
                    }`}
                  >
                    {totalStock} in stock
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
