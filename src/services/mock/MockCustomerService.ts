import type { ICustomerService } from '../interfaces/ICustomerService';
import type {
  AdminCustomer,
  CustomerFilterParams,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';
import { MockDatabase } from '../../lib/mockDb/MockDatabase';
import { ApiError } from '../../lib/api/errors';

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

export class MockCustomerService implements ICustomerService {
  public async list(params: CustomerFilterParams = {}): Promise<PaginatedResponse<AdminCustomer>> {
    await delay();
    const { search = '', isGuest, page = 1, limit = 10 } = params;

    let customers = [...MockDatabase.getCustomers()];

    if (search.trim()) {
      const q = search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }

    if (isGuest !== undefined) {
      customers = customers.filter((c) => c.isGuest === isGuest);
    }

    customers.sort((a, b) => b.totalSpent - a.totalSpent);

    const total = customers.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIdx = (page - 1) * limit;

    return {
      success: true,
      data: customers.slice(startIdx, startIdx + limit),
      meta: { page, limit, total, totalPages }
    };
  }

  public async getById(id: string): Promise<ApiResponse<AdminCustomer>> {
    await delay();
    const customers = MockDatabase.getCustomers();
    const found = customers.find((c) => c.id === id);
    if (!found) throw new ApiError(`Customer "${id}" not found.`, 404);
    return { success: true, data: found };
  }
}

export const mockCustomerService = new MockCustomerService();
