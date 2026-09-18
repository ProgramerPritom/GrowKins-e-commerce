import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Phone,
  Copy,
  Check,
  Truck,
  Package,
  MapPin,
  Clock,
  User,
  Gift,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';
import { OrderTimeline } from '../../common/OrderTimeline';
import { useAdminRouter } from '../../../../context/AdminRouterContext';
import { useAdminToast } from '../../common/AdminToast';
import { orderService } from '../../../../services';
import type { AdminOrder, OrderStatus, PaymentStatus } from '../../../../types/admin';

export const OrderDetailPage: React.FC = () => {
  const { params, navigate } = useAdminRouter();
  const { showToast } = useAdminToast();

  const orderId = params.id;
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    }
  }, [orderId]);

  const loadOrder = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await orderService.getById(id);
      setOrder(res.data);
    } catch (err: any) {
      console.error(err);
      showToast('Order not found.', 'error');
      navigate('/admin/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPhone = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.customer.phone);
    setCopiedPhone(true);
    showToast('Customer phone copied to clipboard.');
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const res = await orderService.updateStatus(order.id, {
        status: newStatus,
        note: actionNote.trim() || undefined
      });
      setOrder(res.data);
      setActionNote('');
      showToast(`Order status updated to ${newStatus}.`);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update order status.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (newPayment: PaymentStatus) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const res = await orderService.updatePaymentStatus(order.id, newPayment);
      setOrder(res.data);
      showToast(`Payment status updated to ${newPayment}.`);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update payment status.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !order) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#8C8478]">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <PageHeader
        title={`Order: ${order.orderNumber}`}
        subtitle={`Placed on ${new Date(order.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`}
        breadcrumbs={[
          { label: 'Orders', href: '/admin/orders' },
          { label: order.orderNumber }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/orders')}
              className="px-3.5 py-2 rounded-xl border border-[#E8E0D2] bg-white text-[#635E55] hover:bg-[#FAF7F1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>
        }
      />

      {/* Top Status & Quick Workflow Bar */}
      <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[11px] font-semibold text-[#8C8478] uppercase">Current Status</span>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={order.status} />
              <StatusBadge status={order.paymentStatus} />
            </div>
          </div>
        </div>

        {/* Status Transition Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {order.status === 'pending' && (
            <button
              disabled={isUpdating}
              onClick={() => handleStatusChange('confirmed')}
              className="px-3.5 py-2 rounded-xl bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Confirm via Phone</span>
            </button>
          )}

          {order.status === 'confirmed' && (
            <button
              disabled={isUpdating}
              onClick={() => handleStatusChange('processing')}
              className="px-3.5 py-2 rounded-xl bg-[#6A4C93] hover:bg-[#583E7B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Mark Packing</span>
            </button>
          )}

          {order.status === 'processing' && (
            <button
              disabled={isUpdating}
              onClick={() => handleStatusChange('shipped')}
              className="px-3.5 py-2 rounded-xl bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Hand to Courier</span>
            </button>
          )}

          {order.status === 'shipped' && (
            <button
              disabled={isUpdating}
              onClick={() => handleStatusChange('out_for_delivery')}
              className="px-3.5 py-2 rounded-xl bg-[#D96F58] hover:bg-[#BF5E49] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Out for Delivery</span>
            </button>
          )}

          {(order.status === 'shipped' || order.status === 'out_for_delivery') && (
            <button
              disabled={isUpdating}
              onClick={() => handleStatusChange('delivered')}
              className="px-3.5 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#24543E] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Delivered & COD Collected</span>
            </button>
          )}

          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button
              disabled={isUpdating}
              onClick={() => handleStatusChange('cancelled')}
              className="px-3.5 py-2 rounded-xl border border-[#F28F79]/40 text-[#B83A28] hover:bg-[#FBE8E5] text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Order Items & Delivery */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products List */}
          <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs">
            <h3 className="font-serif text-sm font-bold text-[#24221F] pb-3 border-b border-[#F4EFE6]">
              Ordered Items ({order.items.length})
            </h3>

            <div className="divide-y divide-[#F4EFE6] mt-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E8E0D2]"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[#24221F]">{item.name}</h4>
                      <p className="text-[11px] text-[#8C8478]">
                        SKU: {item.sku || '—'} · ৳{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-xs text-[#24221F]">
                    ৳{item.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="mt-4 pt-4 border-t border-[#F4EFE6] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#635E55]">
                <span>Subtotal</span>
                <span>৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#635E55]">
                <span>
                  Delivery Fee ({order.deliveryAddress.deliveryZone === 'inside-dhaka' ? 'Dhaka' : 'Outside Dhaka'})
                </span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `৳${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#24221F] pt-2 border-t border-[#F4EFE6]">
                <span>Total Amount Due (Cash on Delivery)</span>
                <span className="text-[#1C4CB8]">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#1C4CB8]">
                <User className="w-4 h-4" />
                <h3 className="font-serif text-sm font-bold text-[#24221F]">Customer</h3>
              </div>

              <div>
                <p className="font-bold text-xs text-[#24221F]">{order.customer.name}</p>
                {order.customer.email && (
                  <p className="text-[11px] text-[#8C8478]">{order.customer.email}</p>
                )}
              </div>

              {/* Phone with copy */}
              <div className="pt-2 flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F1] border border-[#E8E0D2]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#1C4CB8]" />
                  <span className="font-mono text-xs font-bold text-[#24221F]">
                    {order.customer.phone}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="px-2 py-1 rounded-lg bg-white border border-[#E8E0D2] text-[11px] font-semibold text-[#635E55] hover:text-[#1C4CB8] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedPhone ? <Check className="w-3 h-3 text-[#2D6A4F]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Delivery Address Box */}
            <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#1C4CB8]">
                  <MapPin className="w-4 h-4" />
                  <h3 className="font-serif text-sm font-bold text-[#24221F]">Shipping Address</h3>
                </div>
                <StatusBadge
                  status={order.deliveryAddress.deliveryZone}
                  label={order.deliveryAddress.deliveryZone === 'inside-dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}
                  size="sm"
                />
              </div>

              <div className="text-xs text-[#635E55] leading-relaxed">
                <p className="font-bold text-[#24221F]">{order.deliveryAddress.fullName}</p>
                <p className="mt-1">{order.deliveryAddress.streetAddress}</p>
                <p>
                  {order.deliveryAddress.thanaArea}, {order.deliveryAddress.district}
                </p>
              </div>
            </div>
          </div>

          {/* Notes & Gift Message if any */}
          {(order.notes || order.gift?.enabled) && (
            <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs space-y-3">
              {order.notes && (
                <div>
                  <h4 className="text-xs font-bold text-[#24221F] flex items-center gap-1.5 mb-1">
                    <FileText className="w-3.5 h-3.5 text-[#8C8478]" />
                    <span>Customer Instructions</span>
                  </h4>
                  <p className="text-xs text-[#635E55] bg-[#FAF7F1] p-3 rounded-xl border border-[#E8E0D2]">
                    {order.notes}
                  </p>
                </div>
              )}

              {order.gift?.enabled && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-[#24221F] flex items-center gap-1.5 mb-1">
                    <Gift className="w-3.5 h-3.5 text-[#F28F79]" />
                    <span>Gift Note for {order.gift.recipientName || 'Recipient'}</span>
                  </h4>
                  <p className="text-xs italic text-[#635E55] bg-[#FDF0ED] p-3 rounded-xl border border-[#F28F79]/30">
                    “{order.gift.message || 'Happy Birthday!'}”
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Col: Status History Timeline & Payment Control */}
        <div className="space-y-6">
          {/* Payment Status Card */}
          <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#24221F]">COD Payment Collection</h3>
            <p className="text-xs text-[#8C8478]">
              Method: <strong className="text-[#24221F]">Cash on Delivery</strong>
            </p>

            <div className="pt-1">
              <label className="block text-[11px] font-bold text-[#24221F] mb-1">Update Payment</label>
              <select
                value={order.paymentStatus}
                onChange={(e) => handlePaymentStatusChange(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
              >
                <option value="cod_pending">COD Pending (Payment Awaiting)</option>
                <option value="cod_collected">COD Collected (Cash Received)</option>
                <option value="not_collected">Not Collected / Disputed</option>
              </select>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1C4CB8]" />
              <h3 className="font-serif text-sm font-bold text-[#24221F]">Order History</h3>
            </div>

            <OrderTimeline events={order.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
};
