import type {
  DeliverySettings,
  StoreSettings,
  CheckoutSettings,
  ApiResponse
} from '../../types/admin';

export interface ISettingsService {
  getDeliverySettings(): Promise<ApiResponse<DeliverySettings>>;
  updateDeliverySettings(settings: Partial<DeliverySettings>): Promise<ApiResponse<DeliverySettings>>;

  getStoreSettings(): Promise<ApiResponse<StoreSettings>>;
  updateStoreSettings(settings: Partial<StoreSettings>): Promise<ApiResponse<StoreSettings>>;

  getCheckoutSettings(): Promise<ApiResponse<CheckoutSettings>>;
  updateCheckoutSettings(settings: Partial<CheckoutSettings>): Promise<ApiResponse<CheckoutSettings>>;
}
