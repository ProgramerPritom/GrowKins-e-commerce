import type { MediaAsset } from './media';

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: MediaAsset;
  parentId?: string | null;
  status: 'active' | 'inactive';
  sortOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  image?: MediaAsset;
  parentId?: string | null;
  status: 'active' | 'inactive';
  sortOrder?: number;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
