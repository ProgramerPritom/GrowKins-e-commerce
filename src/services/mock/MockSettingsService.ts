import type { ISettingsService } from '../interfaces/ISettingsService';
import type {
  DeliverySettings,
  StoreSettings,
  CheckoutSettings,
  ApiResponse
} from '../../types/admin';
import { MockDatabase } from '../../lib/mockDb/MockDatabase';

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

export class MockSettingsService implements ISettingsService {
  // Delivery
  public async getDeliverySettings(): Promise<ApiResponse<DeliverySettings>> {
    await delay();
    return { success: true, data: MockDatabase.getDeliverySettings() };
  }

  public async updateDeliverySettings(settings: Partial<DeliverySettings>): Promise<ApiResponse<DeliverySettings>> {
    await delay(200);
    const current = MockDatabase.getDeliverySettings();
    const updated: DeliverySettings = { ...current, ...settings };
    MockDatabase.setDeliverySettings(updated);
    return { success: true, data: updated, message: 'Delivery settings saved.' };
  }

  // Store
  public async getStoreSettings(): Promise<ApiResponse<StoreSettings>> {
    await delay();
    return { success: true, data: MockDatabase.getStoreSettings() };
  }

  public async updateStoreSettings(settings: Partial<StoreSettings>): Promise<ApiResponse<StoreSettings>> {
    await delay(200);
    const current = MockDatabase.getStoreSettings();
    const updated: StoreSettings = { ...current, ...settings };
    MockDatabase.setStoreSettings(updated);
    return { success: true, data: updated, message: 'Store settings saved.' };
  }

  // Checkout
  public async getCheckoutSettings(): Promise<ApiResponse<CheckoutSettings>> {
    await delay();
    return { success: true, data: MockDatabase.getCheckoutSettings() };
  }

  public async updateCheckoutSettings(settings: Partial<CheckoutSettings>): Promise<ApiResponse<CheckoutSettings>> {
    await delay(200);
    const current = MockDatabase.getCheckoutSettings();
    const updated: CheckoutSettings = { ...current, ...settings };
    MockDatabase.setCheckoutSettings(updated);
    return { success: true, data: updated, message: 'Checkout settings saved.' };
  }
}

export const mockSettingsService = new MockSettingsService();
