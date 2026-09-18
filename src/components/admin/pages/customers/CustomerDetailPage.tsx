import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';
import { useAdminRouter } from '../../../../context/AdminRouterContext';
import { useAdminToast } from '../../common/AdminToast';
import { customerService, orderService } from '../../../../services';
import type { AdminCustomer, AdminOrder } from '../../../../types/admin';

export const CustomerDetailPage: React.FC = () => {
  const { params, navigate } = useAdminRouter();
  const { showToast } = useAdminToast();

  const customerId = params.id;
  const [customer, setCustomer] = useState<AdminCustomer | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      loadData(customerId);
    }
  }, [customerId]);

  const loadData = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await customerService.getById(id);
      setCustomer(res.data);

      const allOrders = await orderService.list({ search: res.data.phone });
      setOrders(allOrders.data);
    } catch (err: any) {
      console.error(err);
      showToast('Customer not found.', 'error');
      navigate('/admin/customers');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !customer) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#8C8478]">Loading customer record...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title={customer.name}
        subtitle={customer.isGuest ? 'Guest Checkout Profile' : 'Registered Customer'}
        breadcrumbs={[
          { label: 'Customers', href: '/admin/customers' },
          { label: customer.name }
        ]}
        actions={
          <button
            onClick={() => navigate('/admin/customers')}
            className="px-3.5 py-2 rounded-xl border border-[#E8E0D2] bg-white text-[#635E55] hover:bg-[#FAF7F1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Customers</span>
          </button>
        }
      />

      {/* Profile Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#8C8478] uppercase">Total Spend</span>
          <h3 className="text-2xl font-bold font-serif text-[#2D6A4F] mt-1">
            ৳{customer.totalSpent.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#8C8478] mt-1">Cash on delivery collected</p>
        </div>

        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#8C8478] uppercase">Completed Orders</span>
          <h3 className="text-2xl font-bold font-serif text-[#1C4CB8] mt-1">{customer.totalOrders}</h3>
          <p className="text-[11px] text-[#8C8478] mt-1">Last order: {customer.lastOrderDate || '—'}</p>
        </div>

        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#8C8478] uppercase">Contact</span>
          <div className="mt-2 space-y-1 text-xs">
            <p className="font-bold text-[#24221F]">{customer.phone}</p>
            <p className="text-[#8C8478]">{customer.email || 'No email provided'}</p>
          </div>
        </div>
      </div>

      {/* Address & Staff Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#1C4CB8]">
            <MapPin className="w-4 h-4" />
            <h3 className="font-serif text-sm font-bold text-[#24221F]">Default Delivery Address</h3>
          </div>
          {customer.defaultAddress ? (
            <div className="text-xs text-[#635E55] leading-relaxed pt-1">
              <p className="font-semibold text-[#24221F]">{customer.defaultAddress.streetAddress}</p>
              <p>{customer.defaultAddress.thanaArea}, {customer.defaultAddress.district}</p>
            </div>
          ) : (
            <p className="text-xs text-[#8C8478]">No default address recorded.</p>
          )}
        </div>

        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs space-y-2">
          <h3 className="font-serif text-sm font-bold text-[#24221F]">Staff Internal Notes</h3>
          <p className="text-xs text-[#635E55] bg-[#FAF7F1] p-3 rounded-xl border border-[#E8E0D2]">
            {customer.notes || 'No notes added for this customer yet.'}
          </p>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-serif text-sm font-bold text-[#24221F] pb-3 border-b border-[#F4EFE6]">
          Order History ({orders.length})
        </h3>

        {orders.length === 0 ? (
          <p className="text-xs text-[#8C8478] py-4">No recent orders found for this customer.</p>
        ) : (
          <div className="divide-y divide-[#F4EFE6]">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/admin/orders/${order.id}`)}
                className="py-3 flex items-center justify-between hover:bg-[#FAF7F1] px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#1C4CB8]">
                    {order.orderNumber}
                  </span>
                  <p className="text-[11px] text-[#8C8478]">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}{' '}
                    · {order.items.length} items
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs text-[#24221F]">
                    ৳{order.total.toLocaleString()}
                  </span>
                  <StatusBadge status={order.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
