import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { PageHeader } from '../layout/PageHeader';
import { useAdminRouter } from '../../../context/AdminRouterContext';
import { MockDatabase } from '../../../lib/mockDb/MockDatabase';
import type { AdminProduct, AdminOrder } from '../../../types/admin';

export const DashboardPage: React.FC = () => {
  const { navigate } = useAdminRouter();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    const load = () => {
      setProducts(MockDatabase.getProducts());
      setOrders(MockDatabase.getOrders());
    };

    load();
    const unsub = MockDatabase.subscribe(load);
    return () => unsub();
  }, []);

  // Compute live dashboard metrics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === 'active').length;
  const lowStockProducts = products.filter(
    (p) => p.inventory.trackInventory && p.inventory.quantity <= p.inventory.lowStockThreshold
  );

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Store Overview"
        subtitle="Live metrics, stock alerts, and Cash on Delivery order pipeline."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/admin/products/new')}
              className="px-4 py-2 bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="px-4 py-2 bg-white border border-[#E8E0D2] hover:bg-[#FAF7F1] text-[#24221F] text-xs font-semibold rounded-xl cursor-pointer transition-all"
            >
              View All Orders
            </button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Products"
          value={totalProducts}
          subtitle={`${activeProducts} active on store`}
          icon={Package}
          iconBg="bg-[#E7EDFB]"
          iconColor="text-[#1C4CB8]"
          onClick={() => navigate('/admin/products')}
        />

        <MetricCard
          title="Orders Pipeline"
          value={totalOrders}
          subtitle={`${pendingOrders} awaiting dispatch`}
          change={{ value: '+12% this week', positive: true }}
          icon={ShoppingBag}
          iconBg="bg-[#FCF4DB]"
          iconColor="text-[#9A7316]"
          onClick={() => navigate('/admin/orders')}
        />

        <MetricCard
          title="COD Revenue"
          value={`৳${totalRevenue.toLocaleString()}`}
          subtitle={`${deliveredOrders} orders collected`}
          icon={DollarSign}
          iconBg="bg-[#E6EFE9]"
          iconColor="text-[#2D6A4F]"
        />

        <MetricCard
          title="Low Stock Alerts"
          value={lowStockProducts.length}
          subtitle={lowStockProducts.length > 0 ? 'Action needed' : 'All stocks healthy'}
          icon={AlertTriangle}
          iconBg={lowStockProducts.length > 0 ? 'bg-[#FBE8E5]' : 'bg-[#E6EFE9]'}
          iconColor={lowStockProducts.length > 0 ? 'text-[#B83A28]' : 'text-[#2D6A4F]'}
          onClick={() => navigate('/admin/products?stockStatus=low_stock')}
        />
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button
          onClick={() => navigate('/admin/products/new')}
          className="p-4 rounded-2xl bg-white border border-[#E8E0D2] text-left hover:border-[#1C4CB8] hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FAF7F1] text-[#1C4CB8] flex items-center justify-center mb-2.5 group-hover:bg-[#1C4CB8] group-hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#24221F]">Add New Toy</h4>
          <p className="text-[11px] text-[#8C8478] mt-0.5">Upload images & set age milestones</p>
        </button>

        <button
          onClick={() => navigate('/admin/orders')}
          className="p-4 rounded-2xl bg-white border border-[#E8E0D2] text-left hover:border-[#1C4CB8] hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FAF7F1] text-[#9A7316] flex items-center justify-center mb-2.5 group-hover:bg-[#DDA428] group-hover:text-white transition-colors">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#24221F]">Manage COD Orders</h4>
          <p className="text-[11px] text-[#8C8478] mt-0.5">Confirm phone & assign couriers</p>
        </button>

        <button
          onClick={() => navigate('/admin/content/homepage')}
          className="p-4 rounded-2xl bg-white border border-[#E8E0D2] text-left hover:border-[#1C4CB8] hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FAF7F1] text-[#D96F58] flex items-center justify-center mb-2.5 group-hover:bg-[#F28F79] group-hover:text-white transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#24221F]">Edit Homepage CMS</h4>
          <p className="text-[11px] text-[#8C8478] mt-0.5">Update hero slides, stages & quiz</p>
        </button>

        <button
          onClick={() => navigate('/admin/delivery')}
          className="p-4 rounded-2xl bg-white border border-[#E8E0D2] text-left hover:border-[#1C4CB8] hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FAF7F1] text-[#4F7A5E] flex items-center justify-center mb-2.5 group-hover:bg-[#4F7A5E] group-hover:text-white transition-colors">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#24221F]">Delivery Rates</h4>
          <p className="text-[11px] text-[#8C8478] mt-0.5">Dhaka ৳70 / Outside ৳130 rules</p>
        </button>
      </div>

      {/* Main Two-Column Section: Recent Orders & Stock / Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#F4EFE6]">
              <div>
                <h3 className="font-serif text-base font-bold text-[#24221F]">Recent Orders</h3>
                <p className="text-xs text-[#8C8478]">Latest customer orders with Cash on Delivery</p>
              </div>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-xs font-semibold text-[#1C4CB8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[#8C8478] font-bold text-[11px] uppercase border-b border-[#F4EFE6]">
                    <th className="py-2.5 px-2">Order</th>
                    <th className="py-2.5 px-2">Customer</th>
                    <th className="py-2.5 px-2">Total</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2">Payment</th>
                    <th className="py-2.5 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EFE6]">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="hover:bg-[#FAF7F1] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-2 font-bold text-[#1C4CB8]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-2">
                        <p className="font-semibold text-[#24221F]">{order.customer.name}</p>
                        <p className="text-[11px] text-[#8C8478]">{order.customer.phone}</p>
                      </td>
                      <td className="py-3 px-2 font-bold text-[#24221F]">
                        ৳{order.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={order.paymentStatus} size="sm" />
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="text-[#1C4CB8] font-semibold hover:underline">
                          Details →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Low Stock Warnings & Top Products */}
        <div className="space-y-6">
          {/* Low Stock Card */}
          <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#DDA428]" />
                <h3 className="font-serif text-sm font-bold text-[#24221F]">Inventory Attention</h3>
              </div>
              <span className="text-[11px] font-semibold text-[#8C8478]">
                {lowStockProducts.length} items
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#2D6A4F] flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All product inventories healthy</span>
                </div>
              ) : (
                lowStockProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => navigate(`/admin/products/${prod.id}/edit`)}
                    className="p-2.5 rounded-xl border border-[#E8E0D2] hover:bg-[#FAF7F1] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={prod.images[0]?.url}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#E8E0D2]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#24221F] truncate max-w-[140px]">
                          {prod.name}
                        </p>
                        <p className="text-[10px] text-[#8C8478]">{prod.inventory.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge
                        status={prod.inventory.quantity === 0 ? 'out_of_stock' : 'low_stock'}
                        label={`${prod.inventory.quantity} left`}
                        size="sm"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Products Showcase */}
          <div className="bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs">
            <h3 className="font-serif text-sm font-bold text-[#24221F] pb-3 border-b border-[#F4EFE6]">
              Featured Catalog Items
            </h3>
            <div className="mt-3 space-y-2.5">
              {products.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF7F1] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={p.images[0]?.url}
                      alt={p.name}
                      className="w-8 h-8 rounded-md object-cover border border-[#E8E0D2]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#24221F] truncate max-w-[150px]">{p.name}</p>
                      <span className="text-[10px] text-[#8C8478]">{p.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#24221F]">৳{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
