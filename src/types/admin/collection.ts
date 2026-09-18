import type { MediaAsset } from './media';

export interface AdminCollection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: MediaAsset;
  productIds: string[];
  status: 'active' | 'inactive';
  sortOrder: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionPayload {
  name: string;
  slug: string;
  description?: string;
  image?: MediaAsset;
  productIds: string[];
  status: 'active' | 'inactive';
  sortOrder?: number;
  featured?: boolean;
}

export type UpdateCollectionPayload = Partial<CreateCollectionPayload>;
