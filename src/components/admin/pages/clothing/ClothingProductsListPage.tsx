import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Filter
} from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { useAdminRouter } from '../../../../context/AdminRouterContext';
import { useAdminToast } from '../../common/AdminToast';
import { MockDatabase } from '../../../../lib/mockDb/MockDatabase';
import { clothingService } from '../../../../services';
import type { ApparelProduct } from '../../../../types/clothing';

export const ClothingProductsListPage: React.FC = () => {
  const { navigate } = useAdminRouter();
  const { showToast } = useAdminToast();

  const [products, setProducts] = useState<ApparelProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState<ApparelProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    const res = await clothingService.getProducts({
      search: search || undefined,
      limit: 100
    });
    let items = res.items;
    if (typeFilter !== 'all') {
      items = items.filter((p) => p.productType === typeFilter);
    }
    if (statusFilter !== 'all') {
      items = items.filter((p) => p.status === statusFilter);
    }
    setProducts(items);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
    const unsub = MockDatabase.subscribe(() => {
      loadProducts();
    });
    return () => unsub();
  }, [search, typeFilter, statusFilter]);

  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await clothingService.deleteProduct(productToDelete.id);
      showToast('Apparel item removed from catalog', 'success');
      setProductToDelete(null);
    } catch {
      showToast('Failed to remove product', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Clothing & Apparel Products"
        subtitle="Manage baby apparel, shoes, colorways, sizes, and variant inventory."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/admin/clothing/inventory')}
              className="px-3.5 py-2 text-xs font-semibold text-[#524E47] bg-white border border-[#E8E2D5] rounded-xl hover:bg-[#FAF7F1] transition-colors cursor-pointer shadow-2xs"
            >
              Variant Matrix Inventory
            </button>
            <button
              onClick={() => navigate('/admin/clothing/products/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#C85A32] rounded-xl hover:bg-[#B24E2A] transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Apparel Product</span>
            </button>
          </div>
        }
      />

      {/* Filters Bar */}
      <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#857E73] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search apparel title, fabric, SKU..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E8E2D5] text-xs focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#857E73]">
            <Filter className="w-3.5 h-3.5" />
            <span>Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs text-[#171715] bg-white cursor-pointer focus:outline-none focus:border-[#C85A32]"
          >
            <option value="all">All Apparel Types</option>
            <option value="shirt">Shirts & Tops</option>
            <option value="tshirt">T-Shirts</option>
            <option value="pants">Pants & Trousers</option>
            <option value="romper">Rompers & Bodysuits</option>
            <option value="set">Matching Sets</option>
            <option value="shoe">Baby Shoes</option>
            <option value="outerwear">Cardigans & Knitwear</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs text-[#171715] bg-white cursor-pointer focus:outline-none focus:border-[#C85A32]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#857E73]">
            Loading clothing catalog...
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#857E73] space-y-2">
            <p>No apparel products matched your filter query.</p>
            <button
              onClick={() => {
                setSearch('');
                setTypeFilter('all');
                setStatusFilter('all');
              }}
              className="text-[#C85A32] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F1] border-b border-[#E8E2D5] text-[#857E73] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Garment</th>
                  <th className="py-3.5 px-3">Type / Age</th>
                  <th className="py-3.5 px-3">Base Price</th>
                  <th className="py-3.5 px-3">Colorways</th>
                  <th className="py-3.5 px-3">Variants</th>
                  <th className="py-3.5 px-3">Total Stock</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {products.map((item) => {
                  const totalStock = item.variants.reduce(
                    (sum, v) => sum + v.inventoryQuantity,
                    0
                  );
                  const colors = Array.from(
                    new Set(item.variants.map((v) => JSON.stringify(v.color)))
                  ).map((s) => JSON.parse(s));

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FCFAF7] transition-colors group cursor-pointer"
                      onClick={() => navigate(`/admin/clothing/products/${item.id}/edit`)}
                    >
                      {/* Product Image & Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.images[0]?.url}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover bg-[#F5F2EA] border border-[#E8E2D5] shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-serif font-bold text-xs text-[#171715] group-hover:text-[#C85A32] transition-colors truncate">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-[#857E73] truncate font-mono">
                              /{item.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type & Age Group */}
                      <td className="py-3.5 px-3">
                        <span className="capitalize font-semibold text-[#171715] block">
                          {item.productType}
                        </span>
                        <span className="text-[10px] text-[#857E73]">{item.ageLabel}</span>
                      </td>

                      {/* Base Price */}
                      <td className="py-3.5 px-3 font-bold font-sans text-[#171715]">
                        ৳{item.price.toLocaleString()}
                      </td>

                      {/* Color Swatches */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {colors.map((c, idx) => (
                            <span
                              key={idx}
                              className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: c.hex || '#ccc' }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Variants Count */}
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-[#F2ECE1] text-[#524E47] font-semibold text-[11px]">
                          {item.variants.length} SKUs
                        </span>
                      </td>

                      {/* Inventory Count */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-bold ${
                            totalStock === 0
                              ? 'text-rose-600'
                              : totalStock < 10
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-3">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => window.open(`/clothing/product/${item.slug}`, '_blank')}
                            className="p-1.5 text-[#857E73] hover:text-[#171715] hover:bg-[#F2ECE1] rounded-lg transition-colors cursor-pointer"
                            title="View on store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/clothing/products/${item.id}/edit`)}
                            className="p-1.5 text-[#857E73] hover:text-[#C85A32] hover:bg-[#F2ECE1] rounded-lg transition-colors cursor-pointer"
                            title="Edit piece"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(item)}
                            className="p-1.5 text-[#857E73] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete piece"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!productToDelete}
        title="Remove Apparel Item"
        message={`Are you sure you want to delete "${productToDelete?.name}"? All colorways and variant stock entries will be permanently removed.`}
        confirmLabel="Delete Garment"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleDelete}
        onClose={() => setProductToDelete(null)}
      />
    </div>
  );
};
