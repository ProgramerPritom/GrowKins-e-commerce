import React, { useState, useEffect } from 'react';
import { PhoneCall } from 'lucide-react';
import { DataTable } from '../../common/DataTable';
import type { Column } from '../../common/DataTable';
import { StatusBadge } from '../../common/StatusBadge';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminRouter } from '../../../../context/AdminRouterContext';
import { useAdminToast } from '../../common/AdminToast';
import { orderService } from '../../../../services';
import type { AdminOrder, PaginationMeta, OrderStatus, PaymentStatus } from '../../../../types/admin';

export const OrdersListPage: React.FC = () => {
  const { navigate } = useAdminRouter();
  const { showToast } = useAdminToast();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | 'all'>('all');
  const [deliveryZone, setDeliveryZone] = useState<'inside-dhaka' | 'outside-dhaka' | 'all'>('all');

  const fetchOrders = async (page = meta.page) => {
    setIsLoading(true);
    try {
      const res = await orderService.list({
        search,
        status,
        paymentStatus,
        deliveryZone,
        page,
        limit: 10
      });
      setOrders(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
      showToast('Failed to load orders.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [search, status, paymentStatus, deliveryZone]);

  const columns: Column<AdminOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order #',
      render: (o) => (
        <span
          onClick={() => navigate(`/admin/orders/${o.id}`)}
          className="font-bold font-mono text-xs text-[#1C4CB8] hover:underline cursor-pointer"
        >
          {o.orderNumber}
        </span>
      )
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (o) => (
        <div>
          <p className="font-bold text-xs text-[#24221F]">{o.customer.name}</p>
          <div className="flex items-center gap-1 text-[11px] text-[#7D766C]">
            <PhoneCall className="w-3 h-3 text-[#8C8478]" />
            <span>{o.customer.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Delivery Area',
      render: (o) => (
        <div>
          <p className="font-semibold text-xs text-[#24221F]">
            {o.deliveryAddress.thanaArea}, {o.deliveryAddress.district}
          </p>
          <span className="text-[10px] text-[#8C8478] uppercase">
            {o.deliveryAddress.deliveryZone.replace('-', ' ')}
          </span>
        </div>
      )
    },
    {
      key: 'total',
      header: 'Total (৳)',
      render: (o) => (
        <div>
          <span className="font-bold text-xs text-[#24221F]">৳{o.total.toLocaleString()}</span>
          <p className="text-[10px] text-[#8C8478]">{o.items.length} items</p>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Order Status',
      render: (o) => <StatusBadge status={o.status} />
    },
    {
      key: 'paymentStatus',
      header: 'COD Payment',
      render: (o) => <StatusBadge status={o.paymentStatus} />
    },
    {
      key: 'date',
      header: 'Date',
      render: (o) => (
        <span className="text-[11px] text-[#8C8478]">
          {new Date(o.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: (o) => (
        <button
          onClick={() => navigate(`/admin/orders/${o.id}`)}
          className="px-2.5 py-1 text-xs font-semibold text-[#1C4CB8] hover:bg-[#E7EDFB] rounded-lg transition-colors cursor-pointer"
        >
          View Details
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cash on Delivery Orders"
        subtitle="Review, verify, pack and dispatch orders across all 64 districts of Bangladesh."
        breadcrumbs={[{ label: 'Orders' }]}
      />

      <DataTable
        columns={columns}
        data={orders}
        keyField="id"
        meta={meta}
        isLoading={isLoading}
        onPageChange={(p) => fetchOrders(p)}
        onSearch={(q) => setSearch(q)}
        searchPlaceholder="Search by order #, customer name, phone, or address..."
        searchValue={search}
        filters={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3 py-2 text-xs bg-white border border-[#E8E0D2] rounded-xl text-[#24221F] focus:outline-none focus:border-[#1C4CB8]"
            >
              <option value="all">All Order Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>

            {/* Payment */}
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as any)}
              className="px-3 py-2 text-xs bg-white border border-[#E8E0D2] rounded-xl text-[#24221F] focus:outline-none focus:border-[#1C4CB8]"
            >
              <option value="all">All COD States</option>
              <option value="cod_pending">COD Pending</option>
              <option value="cod_collected">COD Collected</option>
              <option value="not_collected">Not Collected</option>
            </select>

            {/* Delivery Zone */}
            <select
              value={deliveryZone}
              onChange={(e) => setDeliveryZone(e.target.value as any)}
              className="px-3 py-2 text-xs bg-white border border-[#E8E0D2] rounded-xl text-[#24221F] focus:outline-none focus:border-[#1C4CB8]"
            >
              <option value="all">All Zones</option>
              <option value="inside-dhaka">Inside Dhaka</option>
              <option value="outside-dhaka">Outside Dhaka</option>
            </select>
          </div>
        }
        emptyTitle="No orders match criteria"
        emptyDescription="Orders placed via customer storefront Cash on Delivery will appear here in real-time."
      />
    </div>
  );
};
