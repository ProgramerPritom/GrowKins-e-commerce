import type { IOrderService } from '../interfaces/IOrderService';
import type {
  AdminOrder,
  OrderFilterParams,
  UpdateOrderStatusPayload,
  PaginatedResponse,
  ApiResponse,
  OrderTimelineEvent
} from '../../types/admin';
import { MockDatabase } from '../../lib/mockDb/MockDatabase';
import { ApiError } from '../../lib/api/errors';

const delay = (ms = 180) => new Promise((res) => setTimeout(res, ms));

const STATUS_TITLES: Record<string, string> = {
  pending: 'Order Received',
  confirmed: 'Confirmed via Phone',
  processing: 'Packing Parcel',
  shipped: 'Dispatched with Courier',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered to Customer',
  cancelled: 'Order Cancelled',
  returned: 'Parcel Returned to Hub'
};

export class MockOrderService implements IOrderService {
  public async list(params: OrderFilterParams = {}): Promise<PaginatedResponse<AdminOrder>> {
    await delay();
    const {
      search = '',
      status = 'all',
      paymentStatus = 'all',
      deliveryZone = 'all',
      page = 1,
      limit = 10
    } = params;

    let orders = [...MockDatabase.getOrders()];

    if (search.trim()) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          o.deliveryAddress.streetAddress.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.status === status);
    }

    if (paymentStatus && paymentStatus !== 'all') {
      orders = orders.filter((o) => o.paymentStatus === paymentStatus);
    }

    if (deliveryZone && deliveryZone !== 'all') {
      orders = orders.filter((o) => o.deliveryAddress.deliveryZone === deliveryZone);
    }

    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = orders.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIdx = (page - 1) * limit;

    return {
      success: true,
      data: orders.slice(startIdx, startIdx + limit),
      meta: { page, limit, total, totalPages }
    };
  }

  public async getById(id: string): Promise<ApiResponse<AdminOrder>> {
    await delay();
    const orders = MockDatabase.getOrders();
    const found = orders.find((o) => o.id === id || o.orderNumber === id);
    if (!found) throw new ApiError(`Order "${id}" not found.`, 404);
    return { success: true, data: found };
  }

  public async updateStatus(id: string, payload: UpdateOrderStatusPayload): Promise<ApiResponse<AdminOrder>> {
    await delay(250);
    const orders = MockDatabase.getOrders();
    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index === -1) throw new ApiError(`Order "${id}" not found.`, 404);

    const current = orders[index];

    // Auto-update paymentStatus to cod_collected if delivered
    let paymentStatus = payload.paymentStatus || current.paymentStatus;
    if (payload.status === 'delivered' && current.paymentMethod === 'Cash on Delivery') {
      paymentStatus = 'cod_collected';
    }

    const newTimelineEvent: OrderTimelineEvent = {
      id: `t-${Date.now()}`,
      status: payload.status,
      title: STATUS_TITLES[payload.status] || payload.status,
      description: payload.note || `Status changed from ${current.status} to ${payload.status}.`,
      timestamp: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      actor: 'Admin'
    };

    const updated: AdminOrder = {
      ...current,
      status: payload.status,
      paymentStatus,
      timeline: [...current.timeline, newTimelineEvent],
      updatedAt: new Date().toISOString()
    };

    orders[index] = updated;
    MockDatabase.setOrders(orders);

    return { success: true, data: updated, message: `Order marked as ${payload.status}.` };
  }

  public async updatePaymentStatus(id: string, paymentStatus: AdminOrder['paymentStatus']): Promise<ApiResponse<AdminOrder>> {
    await delay(200);
    const orders = MockDatabase.getOrders();
    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index === -1) throw new ApiError(`Order "${id}" not found.`, 404);

    const updated: AdminOrder = {
      ...orders[index],
      paymentStatus,
      updatedAt: new Date().toISOString()
    };

    orders[index] = updated;
    MockDatabase.setOrders(orders);
    return { success: true, data: updated, message: `Payment status set to ${paymentStatus}.` };
  }
}

export const mockOrderService = new MockOrderService();
