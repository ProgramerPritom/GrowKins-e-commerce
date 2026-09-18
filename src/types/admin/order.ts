export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus =
  | 'cod_pending'
  | 'cod_collected'
  | 'not_collected'
  | 'refunded';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  sku?: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderCustomerInfo {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  isGuest?: boolean;
}

export interface OrderDeliveryAddress {
  fullName: string;
  phone: string;
  deliveryZone: 'inside-dhaka' | 'outside-dhaka';
  district: string;
  thanaArea: string;
  streetAddress: string;
}

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description?: string;
  timestamp: string;
  actor: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: OrderCustomerInfo;
  deliveryAddress: OrderDeliveryAddress;
  items: OrderItemSnapshot[];
  
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  total: number;
  currency: string;

  paymentMethod: 'Cash on Delivery';
  paymentStatus: PaymentStatus;
  status: OrderStatus;

  notes?: string;
  gift?: {
    enabled: boolean;
    recipientName?: string;
    message?: string;
  };

  timeline: OrderTimelineEvent[];

  createdAt: string;
  updatedAt: string;
}

export interface OrderFilterParams {
  search?: string;
  status?: OrderStatus | 'all';
  paymentStatus?: PaymentStatus | 'all';
  deliveryZone?: 'inside-dhaka' | 'outside-dhaka' | 'all';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  note?: string;
}
