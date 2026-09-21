import type {
  AdminProduct,
  AdminCategory,
  AdminCollection,
  AdminOrder,
  AdminCustomer,
  AdminReview,
  MediaAsset,
  HomepageCMS,
  NavigationCMS,
  FooterCMS,
  DeliverySettings,
  StoreSettings,
  CheckoutSettings
} from '../../types/admin';
import type {
  ApparelProduct,
  ApparelCategory,
  ApparelCollection,
  FashionLook,
  SizeGuide,
  ClothingHomepageCMS
} from '../../types/clothing';

import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_REVIEWS,
  INITIAL_MEDIA,
  INITIAL_HOMEPAGE_CMS,
  INITIAL_NAVIGATION_CMS,
  INITIAL_FOOTER_CMS,
  INITIAL_DELIVERY_SETTINGS,
  INITIAL_STORE_SETTINGS,
  INITIAL_CHECKOUT_SETTINGS
} from './seedData';

import { CLOTHING_PRODUCTS } from '../../data/clothingProducts';
import {
  CLOTHING_CATEGORIES,
  CLOTHING_COLLECTIONS,
  FASHION_LOOKS,
  SIZE_GUIDES,
  INITIAL_CLOTHING_HOMEPAGE_CMS
} from '../../data/clothingContent';

type DbEntity =
  | 'products'
  | 'categories'
  | 'collections'
  | 'orders'
  | 'customers'
  | 'reviews'
  | 'media'
  | 'homepage'
  | 'navigation'
  | 'footer'
  | 'delivery'
  | 'storeSettings'
  | 'checkoutSettings'
  | 'clothingProducts'
  | 'clothingCategories'
  | 'clothingCollections'
  | 'clothingLooks'
  | 'clothingSizeGuides'
  | 'clothingHomepage';

type Listener = (entity: DbEntity) => void;

class MockDatabaseService {
  private readonly STORAGE_PREFIX = 'growkins_db_';
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  private getKey(entity: DbEntity): string {
    return `${this.STORAGE_PREFIX}${entity}`;
  }

  private getItem<T>(entity: DbEntity, fallback: T): T {
    try {
      const data = localStorage.getItem(this.getKey(entity));
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch (e) {
      console.warn(`[MockDatabase] Failed to read ${entity}:`, e);
      return fallback;
    }
  }

  private setItem<T>(entity: DbEntity, value: T): void {
    try {
      localStorage.setItem(this.getKey(entity), JSON.stringify(value));
      this.notify(entity);
    } catch (e) {
      console.error(`[MockDatabase] Failed to save ${entity}:`, e);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(entity: DbEntity): void {
    this.listeners.forEach((l) => {
      try {
        l(entity);
      } catch (err) {
        console.error(err);
      }
    });
  }

  public ensureInitialized(): void {
    const currentProducts = this.getItem<AdminProduct[]>('products', []);
    if (currentProducts.length === 0) {
      this.setItem('products', INITIAL_PRODUCTS);
    } else {
      const missing = INITIAL_PRODUCTS.filter(
        (ip) => !currentProducts.some((cp) => cp.id === ip.id)
      );
      if (missing.length > 0) {
        this.setItem('products', [...missing, ...currentProducts]);
      }
    }
    if (!localStorage.getItem(this.getKey('categories'))) {
      this.setItem('categories', INITIAL_CATEGORIES);
    }
    if (!localStorage.getItem(this.getKey('collections'))) {
      this.setItem('collections', INITIAL_COLLECTIONS);
    }
    if (!localStorage.getItem(this.getKey('orders'))) {
      this.setItem('orders', INITIAL_ORDERS);
    }
    if (!localStorage.getItem(this.getKey('customers'))) {
      this.setItem('customers', INITIAL_CUSTOMERS);
    }
    if (!localStorage.getItem(this.getKey('reviews'))) {
      this.setItem('reviews', INITIAL_REVIEWS);
    }
    if (!localStorage.getItem(this.getKey('media'))) {
      this.setItem('media', INITIAL_MEDIA);
    }
    if (!localStorage.getItem(this.getKey('homepage'))) {
      this.setItem('homepage', INITIAL_HOMEPAGE_CMS);
    }
    if (!localStorage.getItem(this.getKey('navigation'))) {
      this.setItem('navigation', INITIAL_NAVIGATION_CMS);
    }
    if (!localStorage.getItem(this.getKey('footer'))) {
      this.setItem('footer', INITIAL_FOOTER_CMS);
    }
    if (!localStorage.getItem(this.getKey('delivery'))) {
      this.setItem('delivery', INITIAL_DELIVERY_SETTINGS);
    }
    if (!localStorage.getItem(this.getKey('storeSettings'))) {
      this.setItem('storeSettings', INITIAL_STORE_SETTINGS);
    }
    if (!localStorage.getItem(this.getKey('checkoutSettings'))) {
      this.setItem('checkoutSettings', INITIAL_CHECKOUT_SETTINGS);
    }

    // Clothing Entities
    const currentClothing = this.getItem<ApparelProduct[]>('clothingProducts', []);
    if (currentClothing.length === 0) {
      this.setItem('clothingProducts', CLOTHING_PRODUCTS);
    }
    if (!localStorage.getItem(this.getKey('clothingCategories'))) {
      this.setItem('clothingCategories', CLOTHING_CATEGORIES);
    }
    if (!localStorage.getItem(this.getKey('clothingCollections'))) {
      this.setItem('clothingCollections', CLOTHING_COLLECTIONS);
    }
    if (!localStorage.getItem(this.getKey('clothingLooks'))) {
      this.setItem('clothingLooks', FASHION_LOOKS);
    }
    if (!localStorage.getItem(this.getKey('clothingSizeGuides'))) {
      this.setItem('clothingSizeGuides', SIZE_GUIDES);
    }
    if (!localStorage.getItem(this.getKey('clothingHomepage'))) {
      this.setItem('clothingHomepage', INITIAL_CLOTHING_HOMEPAGE_CMS);
    }
  }

  public resetToSeeds(): void {
    this.setItem('products', INITIAL_PRODUCTS);
    this.setItem('categories', INITIAL_CATEGORIES);
    this.setItem('collections', INITIAL_COLLECTIONS);
    this.setItem('orders', INITIAL_ORDERS);
    this.setItem('customers', INITIAL_CUSTOMERS);
    this.setItem('reviews', INITIAL_REVIEWS);
    this.setItem('media', INITIAL_MEDIA);
    this.setItem('homepage', INITIAL_HOMEPAGE_CMS);
    this.setItem('navigation', INITIAL_NAVIGATION_CMS);
    this.setItem('footer', INITIAL_FOOTER_CMS);
    this.setItem('delivery', INITIAL_DELIVERY_SETTINGS);
    this.setItem('storeSettings', INITIAL_STORE_SETTINGS);
    this.setItem('checkoutSettings', INITIAL_CHECKOUT_SETTINGS);

    this.setItem('clothingProducts', CLOTHING_PRODUCTS);
    this.setItem('clothingCategories', CLOTHING_CATEGORIES);
    this.setItem('clothingCollections', CLOTHING_COLLECTIONS);
    this.setItem('clothingLooks', FASHION_LOOKS);
    this.setItem('clothingSizeGuides', SIZE_GUIDES);
    this.setItem('clothingHomepage', INITIAL_CLOTHING_HOMEPAGE_CMS);
  }

  // Products
  public getProducts(): AdminProduct[] {
    return this.getItem<AdminProduct[]>('products', INITIAL_PRODUCTS);
  }
  public setProducts(products: AdminProduct[]): void {
    this.setItem('products', products);
  }

  // Categories
  public getCategories(): AdminCategory[] {
    return this.getItem<AdminCategory[]>('categories', INITIAL_CATEGORIES);
  }
  public setCategories(categories: AdminCategory[]): void {
    this.setItem('categories', categories);
  }

  // Collections
  public getCollections(): AdminCollection[] {
    return this.getItem<AdminCollection[]>('collections', INITIAL_COLLECTIONS);
  }
  public setCollections(collections: AdminCollection[]): void {
    this.setItem('collections', collections);
  }

  // Orders
  public getOrders(): AdminOrder[] {
    return this.getItem<AdminOrder[]>('orders', INITIAL_ORDERS);
  }
  public setOrders(orders: AdminOrder[]): void {
    this.setItem('orders', orders);
  }

  // Customers
  public getCustomers(): AdminCustomer[] {
    return this.getItem<AdminCustomer[]>('customers', INITIAL_CUSTOMERS);
  }
  public setCustomers(customers: AdminCustomer[]): void {
    this.setItem('customers', customers);
  }

  // Reviews
  public getReviews(): AdminReview[] {
    return this.getItem<AdminReview[]>('reviews', INITIAL_REVIEWS);
  }
  public setReviews(reviews: AdminReview[]): void {
    this.setItem('reviews', reviews);
  }

  // Media
  public getMedia(): MediaAsset[] {
    return this.getItem<MediaAsset[]>('media', INITIAL_MEDIA);
  }
  public setMedia(media: MediaAsset[]): void {
    this.setItem('media', media);
  }

  // Homepage CMS
  public getHomepageCMS(): HomepageCMS {
    return this.getItem<HomepageCMS>('homepage', INITIAL_HOMEPAGE_CMS);
  }
  public setHomepageCMS(cms: HomepageCMS): void {
    this.setItem('homepage', cms);
  }

  // Navigation CMS
  public getNavigationCMS(): NavigationCMS {
    return this.getItem<NavigationCMS>('navigation', INITIAL_NAVIGATION_CMS);
  }
  public setNavigationCMS(cms: NavigationCMS): void {
    this.setItem('navigation', cms);
  }

  // Footer CMS
  public getFooterCMS(): FooterCMS {
    return this.getItem<FooterCMS>('footer', INITIAL_FOOTER_CMS);
  }
  public setFooterCMS(cms: FooterCMS): void {
    this.setItem('footer', cms);
  }

  // Delivery
  public getDeliverySettings(): DeliverySettings {
    return this.getItem<DeliverySettings>('delivery', INITIAL_DELIVERY_SETTINGS);
  }
  public setDeliverySettings(settings: DeliverySettings): void {
    this.setItem('delivery', settings);
  }

  // Store Settings
  public getStoreSettings(): StoreSettings {
    return this.getItem<StoreSettings>('storeSettings', INITIAL_STORE_SETTINGS);
  }
  public setStoreSettings(settings: StoreSettings): void {
    this.setItem('storeSettings', settings);
  }

  // Checkout Settings
  public getCheckoutSettings(): CheckoutSettings {
    return this.getItem<CheckoutSettings>('checkoutSettings', INITIAL_CHECKOUT_SETTINGS);
  }
  public setCheckoutSettings(settings: CheckoutSettings): void {
    this.setItem('checkoutSettings', settings);
  }

  // Clothing Products
  public getClothingProducts(): ApparelProduct[] {
    return this.getItem<ApparelProduct[]>('clothingProducts', CLOTHING_PRODUCTS);
  }
  public setClothingProducts(products: ApparelProduct[]): void {
    this.setItem('clothingProducts', products);
  }

  // Clothing Categories
  public getClothingCategories(): ApparelCategory[] {
    return this.getItem<ApparelCategory[]>('clothingCategories', CLOTHING_CATEGORIES);
  }
  public setClothingCategories(categories: ApparelCategory[]): void {
    this.setItem('clothingCategories', categories);
  }

  // Clothing Collections
  public getClothingCollections(): ApparelCollection[] {
    return this.getItem<ApparelCollection[]>('clothingCollections', CLOTHING_COLLECTIONS);
  }
  public setClothingCollections(collections: ApparelCollection[]): void {
    this.setItem('clothingCollections', collections);
  }

  // Clothing Looks
  public getClothingLooks(): FashionLook[] {
    return this.getItem<FashionLook[]>('clothingLooks', FASHION_LOOKS);
  }
  public setClothingLooks(looks: FashionLook[]): void {
    this.setItem('clothingLooks', looks);
  }

  // Clothing Size Guides
  public getClothingSizeGuides(): SizeGuide[] {
    return this.getItem<SizeGuide[]>('clothingSizeGuides', SIZE_GUIDES);
  }
  public setClothingSizeGuides(guides: SizeGuide[]): void {
    this.setItem('clothingSizeGuides', guides);
  }

  // Clothing Homepage CMS
  public getClothingHomepageCMS(): ClothingHomepageCMS {
    return this.getItem<ClothingHomepageCMS>('clothingHomepage', INITIAL_CLOTHING_HOMEPAGE_CMS);
  }
  public setClothingHomepageCMS(cms: ClothingHomepageCMS): void {
    this.setItem('clothingHomepage', cms);
  }
}

export const MockDatabase = new MockDatabaseService();
