import type { ISettingsService } from '../interfaces/ISettingsService';
import type {
  DeliverySettings,
  StoreSettings,
  CheckoutSettings,
  ApiResponse
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';

export class ApiSettingsService implements ISettingsService {
  public getDeliverySettings(): Promise<ApiResponse<DeliverySettings>> {
    return apiClient.get<ApiResponse<DeliverySettings>>(API_ENDPOINTS.delivery.get);
  }

  public updateDeliverySettings(settings: Partial<DeliverySettings>): Promise<ApiResponse<DeliverySettings>> {
    return apiClient.patch<ApiResponse<DeliverySettings>>(API_ENDPOINTS.delivery.update, settings);
  }

  public getStoreSettings(): Promise<ApiResponse<StoreSettings>> {
    return apiClient.get<ApiResponse<StoreSettings>>(API_ENDPOINTS.settings.store);
  }

  public updateStoreSettings(settings: Partial<StoreSettings>): Promise<ApiResponse<StoreSettings>> {
    return apiClient.patch<ApiResponse<StoreSettings>>(API_ENDPOINTS.settings.store, settings);
  }

  public getCheckoutSettings(): Promise<ApiResponse<CheckoutSettings>> {
    return apiClient.get<ApiResponse<CheckoutSettings>>(API_ENDPOINTS.settings.checkout);
  }

  public updateCheckoutSettings(settings: Partial<CheckoutSettings>): Promise<ApiResponse<CheckoutSettings>> {
    return apiClient.patch<ApiResponse<CheckoutSettings>>(API_ENDPOINTS.settings.checkout, settings);
  }
}

export const apiSettingsService = new ApiSettingsService();
