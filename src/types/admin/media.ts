export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size?: number; // in bytes
  width?: number;
  height?: number;
  alt?: string;
  folder?: string;
  createdAt: string;
}

export interface MediaUploadResponse {
  asset: MediaAsset;
  url: string;
}

export interface MediaFilterParams {
  search?: string;
  mimeType?: string;
  page?: number;
  limit?: number;
}
