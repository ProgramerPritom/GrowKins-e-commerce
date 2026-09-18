export interface DeliveryZoneConfig {
  id: 'inside-dhaka' | 'outside-dhaka' | string;
  name: string;
  description: string;
  fee: number;
  estimatedDelivery: string;
  freeDeliveryThreshold: number;
  enabled: boolean;
}

export interface DeliverySettings {
  zones: DeliveryZoneConfig[];
  globalFreeShippingThreshold: number;
  defaultCodAvailable: boolean;
  courierPartners: string[];
}
