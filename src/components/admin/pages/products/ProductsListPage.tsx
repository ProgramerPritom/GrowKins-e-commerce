import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '../../common/DataTable';
import type { Column } from '../../common/DataTable';
import { StatusBadge } from '../../common/StatusBadge';
import { PageHeader } from '../../layout/PageHeader';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { useAdminRouter } from '../../../../context/AdminRouterContext';
import { useAdminToast } from '../../common/AdminToast';
import { productService } from '../../../../services';
import type { AdminProduct, PaginationMeta } from '../../../../types/admin';

export const ProductsListPage: React.FC = () => {
  const { navigate, searchParams } = useAdminRouter();
  const { showToast } = useAdminToast();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Filters & State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState<string>('all');
  const [stockStatus, setStockStatus] = useState<string>(searchParams.get('stockStatus') || 'all');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Delete dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async (page = meta.page) => {
    setIsLoading(true);
    try {
      const res = await productService.list({
        search,
        category,
        status: status as any,
        stockStatus: stockStatus as any,
        sortBy: sortBy as any,
        sortOrder,
        page,
        limit: 10
      });
      setProducts(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
      showToast('Failed to load products.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [search, category, status, stockStatus, sortBy, sortOrder]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await productService.delete(deleteTargetId);
      showToast('Product successfully deleted.');
      setDeleteTargetId(null);
      fetchProducts(1);
    } catch (err) {
      console.error(err);
      showToast('Could not delete product.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkStatus = async (newStatus: AdminProduct['status']) => {
    if (selectedIds.length === 0) return;
    try {
      await productService.bulkUpdateStatus(selectedIds, newStatus);
      showToast(`Updated ${selectedIds.length} products to ${newStatus}.`);
      setSelectedIds([]);
      fetchProducts();
    } catch (err) {
      console.error(err);
      showToast('Bulk update failed.', 'error');
    }
  };

  const columns: Column<AdminProduct>[] = [
    {
      key: 'image',
      header: 'Item',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.images[0]?.url || 'https://placehold.co/100x100?text=No+Img'}
            alt={p.name}
            className="w-12 h-12 rounded-xl object-cover border border-[#E8E0D2] shrink-0"
          />
          <div className="min-w-0">
            <p
              onClick={() => navigate(`/admin/products/${p.id}/edit`)}
              className="font-bold text-xs text-[#24221F] hover:text-[#1C4CB8] truncate cursor-pointer"
            >
              {p.name}
            </p>
            <p className="text-[11px] text-[#8C8478] truncate">{p.ageBadge} · {p.category}</p>
          </div>
        </div>
      )
    },
    {
      key: 'sku',
      header: 'SKU',
      sortable: true,
      render: (p) => (
        <span className="font-mono text-[11px] text-[#635E55]">
          {p.inventory.sku || '—'}
        </span>
      )
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (p) => (
        <div>
          <span className="font-bold text-xs text-[#24221F]">৳{p.price.toLocaleString()}</span>
          {p.originalPrice && (
            <span className="text-[10px] text-[#8C8478] line-through ml-1.5">
              ৳{p.originalPrice}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'quantity',
      header: 'Stock',
      sortable: true,
      render: (p) => {
        if (!p.inventory.trackInventory) {
          return <span className="text-xs text-[#8C8478]">Unlimited</span>;
        }
        const qty = p.inventory.quantity;
        const low = p.inventory.lowStockThreshold;

        return (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs text-[#24221F]">{qty} in stock</span>
            {qty === 0 ? (
              <StatusBadge status="out_of_stock" size="sm" />
            ) : qty <= low ? (
              <StatusBadge status="low_stock" size="sm" />
            ) : null}
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (p) => <StatusBadge status={p.status} />
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      sortable: true,
      render: (p) => (
        <span className="text-[11px] text-[#8C8478]">
          {new Date(p.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => navigate(`/admin/products/${p.id}/edit`)}
            className="p-1.5 rounded-lg text-[#635E55] hover:text-[#1C4CB8] hover:bg-[#E7EDFB] transition-colors cursor-pointer"
            title="Edit product"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTargetId(p.id)}
            className="p-1.5 rounded-lg text-[#635E55] hover:text-[#B83A28] hover:bg-[#FBE8E5] transition-colors cursor-pointer"
            title="Delete product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products Catalog"
        subtitle="Manage wooden Montessori toy listings, inventories, pricing, and age categories."
        breadcrumbs={[{ label: 'Products' }]}
        actions={
          <button
            onClick={() => navigate('/admin/products/new')}
            className="px-4 py-2 bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={products}
        keyField="id"
        meta={meta}
        isLoading={isLoading}
        onPageChange={(page) => fetchProducts(page)}
        onSearch={(q) => setSearch(q)}
        searchPlaceholder="Search products by title, SKU, or category..."
        searchValue={search}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        selectable
        selectedIds={selectedIds}
        onSelectIds={setSelectedIds}
        filters={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
              className="px-3 py-2 text-xs bg-white border border-[#E8E0D2] rounded-xl text-[#24221F] focus:outline-none focus:border-[#1C4CB8]"
            >
              <option value="all">All Categories</option>
              <option value="Open-ended play">Open-ended play</option>
              <option value="Stacking toys">Stacking toys</option>
              <option value="Building sets">Building sets</option>
              <option value="Art & Craft">Art & Craft</option>
              <option value="Sensory">Sensory</option>
              <option value="Pretend play">Pretend play</option>
              <option value="Books & Storytelling">Books & Storytelling</option>
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
              className="px-3 py-2 text-xs bg-white border border-[#E8E0D2] rounded-xl text-[#24221F] focus:outline-none focus:border-[#1C4CB8]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            {/* Stock Status Filter */}
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              aria-label="Filter by inventory stock"
              className="px-3 py-2 text-xs bg-white border border-[#E8E0D2] rounded-xl text-[#24221F] focus:outline-none focus:border-[#1C4CB8]"
            >
              <option value="all">All Stock Levels</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock (≤ 5)</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        }
        bulkActions={
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleBulkStatus('active')}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-[#E8E0D2] hover:bg-[#E6EFE9] text-[#2D6A4F] rounded-lg transition-colors cursor-pointer"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkStatus('archived')}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-[#E8E0D2] hover:bg-[#F1EDF6] text-[#5C4D7D] rounded-lg transition-colors cursor-pointer"
            >
              Archive
            </button>
          </div>
        }
        emptyTitle="No products found"
        emptyDescription="Create a new wooden Montessori product or clear your search filters."
        emptyAction={
          <button
            onClick={() => navigate('/admin/products/new')}
            className="px-4 py-2 bg-[#1C4CB8] text-white text-xs font-semibold rounded-xl hover:bg-[#15398B] cursor-pointer"
          >
            Create Product
          </button>
        }
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Product?"
        message="Are you sure you want to permanently delete this product? This action cannot be undone."
        confirmLabel="Delete Product"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
