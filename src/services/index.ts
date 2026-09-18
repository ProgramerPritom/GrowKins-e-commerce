// Active Service Locator / Switcher
// Set VITE_USE_MOCK_API=false in .env to connect to live backend API.
export const USE_MOCK_API = (import.meta as any).env?.VITE_USE_MOCK_API !== 'false';

import { mockProductService } from './mock/MockProductService';
import { apiProductService } from './api/ApiProductService';

import { mockCategoryService } from './mock/MockCategoryService';
import { apiCategoryService } from './api/ApiCategoryService';

import { mockCollectionService } from './mock/MockCollectionService';
import { apiCollectionService } from './api/ApiCollectionService';

import { mockOrderService } from './mock/MockOrderService';
import { apiOrderService } from './api/ApiOrderService';

import { mockCustomerService } from './mock/MockCustomerService';
import { apiCustomerService } from './api/ApiCustomerService';

import { mockReviewService } from './mock/MockReviewService';
import { apiReviewService } from './api/ApiReviewService';

import { mockMediaService } from './mock/MockMediaService';
import { apiMediaService } from './api/ApiMediaService';

import { mockContentService } from './mock/MockContentService';
import { apiContentService } from './api/ApiContentService';

import { mockSettingsService } from './mock/MockSettingsService';
import { apiSettingsService } from './api/ApiSettingsService';

import { mockAuthService } from './mock/MockAuthService';
import { apiAuthService } from './api/ApiAuthService';

export const productService = USE_MOCK_API ? mockProductService : apiProductService;
export const categoryService = USE_MOCK_API ? mockCategoryService : apiCategoryService;
export const collectionService = USE_MOCK_API ? mockCollectionService : apiCollectionService;
export const orderService = USE_MOCK_API ? mockOrderService : apiOrderService;
export const customerService = USE_MOCK_API ? mockCustomerService : apiCustomerService;
export const reviewService = USE_MOCK_API ? mockReviewService : apiReviewService;
export const mediaService = USE_MOCK_API ? mockMediaService : apiMediaService;
export const contentService = USE_MOCK_API ? mockContentService : apiContentService;
export const settingsService = USE_MOCK_API ? mockSettingsService : apiSettingsService;
export const authService = USE_MOCK_API ? mockAuthService : apiAuthService;

// Also export individual services and interfaces
export * from './interfaces/IProductService';
export * from './interfaces/ICategoryService';
export * from './interfaces/ICollectionService';
export * from './interfaces/IOrderService';
export * from './interfaces/ICustomerService';
export * from './interfaces/IReviewService';
export * from './interfaces/IMediaService';
export * from './interfaces/IContentService';
export * from './interfaces/ISettingsService';
export * from './interfaces/IAuthService';
