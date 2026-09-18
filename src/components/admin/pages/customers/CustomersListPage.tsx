import React, { useState, useEffect } from 'react';
import { DataTable } from '../../common/DataTable';
import type { Column } from '../../common/DataTable';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminRouter } from '../../../../context/AdminRouterContext';
import { useAdminToast } from '../../common/AdminToast';
import { customerService } from '../../../../services';
import type { AdminCustomer, PaginationMeta } from '../../../../types/admin';

export const CustomersListPage: React.FC = () => {
  const { navigate } = useAdminRouter();
  const { showToast } = useAdminToast();

  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async (page = meta.page) => {
    setIsLoading(true);
    try {
      const res = await customerService.list({ search, page, limit: 10 });
      setCustomers(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
      showToast('Failed to load customers.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1);
  }, [search]);

  const columns: Column<AdminCustomer>[] = [
    {
      key: 'name',
      header: 'Customer',
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FAF7F1] border border-[#E8E0D2] flex items-center justify-center font-bold text-xs text-[#24221F]">
            {c.name[0] || 'C'}
          </div>
          <div>
            <p
              onClick={() => navigate(`/admin/customers/${c.id}`)}
              className="font-bold text-xs text-[#24221F] hover:text-[#1C4CB8] cursor-pointer"
            >
              {c.name}
            </p>
            <span className="text-[10px] text-[#8C8478]">{c.isGuest ? 'Guest Checkout' : 'Registered Account'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (c) => (
        <span className="font-mono text-xs text-[#635E55]">{c.phone}</span>
      )
    },
    {
      key: 'email',
      header: 'Email',
      render: (c) => (
        <span className="text-xs text-[#7D766C]">{c.email || '—'}</span>
      )
    },
    {
      key: 'totalOrders',
      header: 'Orders',
      render: (c) => (
        <span className="font-semibold text-xs text-[#24221F]">{c.totalOrders}</span>
      )
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      render: (c) => (
        <span className="font-bold text-xs text-[#2D6A4F]">৳{c.totalSpent.toLocaleString()}</span>
      )
    },
    {
      key: 'lastOrder',
      header: 'Last Order',
      render: (c) => (
        <span className="text-[11px] text-[#8C8478]">{c.lastOrderDate || '—'}</span>
      )
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: (c) => (
        <button
          onClick={() => navigate(`/admin/customers/${c.id}`)}
          className="px-2.5 py-1 text-xs font-semibold text-[#1C4CB8] hover:bg-[#E7EDFB] rounded-lg transition-colors cursor-pointer"
        >
          View Profile
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle="Manage customer contact cards, order history, and guest checkout profiles."
        breadcrumbs={[{ label: 'Commerce' }, { label: 'Customers' }]}
      />

      <DataTable
        columns={columns}
        data={customers}
        keyField="id"
        meta={meta}
        isLoading={isLoading}
        onPageChange={(p) => fetchCustomers(p)}
        onSearch={(q) => setSearch(q)}
        searchPlaceholder="Search customers by name, phone or email..."
        searchValue={search}
      />
    </div>
  );
};
