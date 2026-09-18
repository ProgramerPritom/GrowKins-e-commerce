export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isGuest: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  defaultAddress?: {
    district: string;
    thanaArea: string;
    streetAddress: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilterParams {
  search?: string;
  isGuest?: boolean;
  minOrders?: number;
  page?: number;
  limit?: number;
}
