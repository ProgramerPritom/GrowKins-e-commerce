export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  currency: string;
  currencySymbol: string;
  supportPhone: string;
  supportEmail: string;
  officeAddress: string;
  socials: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export interface CheckoutSettings {
  codEnabled: boolean;
  codTitle: string;
  codDescription: string;
  phoneRequired: boolean;
  emailRequired: boolean;
  allowGiftWrapping: boolean;
  giftWrappingFee: number;
  minOrderValue: number;
  orderConfirmationMessage: string;
}
