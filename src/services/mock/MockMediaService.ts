import type { IMediaService } from '../interfaces/IMediaService';
import type {
  MediaAsset,
  MediaFilterParams,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';
import { MockDatabase } from '../../lib/mockDb/MockDatabase';
import { ApiError } from '../../lib/api/errors';

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

export class MockMediaService implements IMediaService {
  public async list(params: MediaFilterParams = {}): Promise<PaginatedResponse<MediaAsset>> {
    await delay();
    const { search = '', mimeType, page = 1, limit = 12 } = params;

    let media = [...MockDatabase.getMedia()];

    if (search.trim()) {
      const q = search.toLowerCase();
      media = media.filter(
        (m) =>
          m.filename.toLowerCase().includes(q) ||
          (m.alt && m.alt.toLowerCase().includes(q))
      );
    }

    if (mimeType && mimeType !== 'all') {
      media = media.filter((m) => m.mimeType.startsWith(mimeType));
    }

    media.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = media.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIdx = (page - 1) * limit;

    return {
      success: true,
      data: media.slice(startIdx, startIdx + limit),
      meta: { page, limit, total, totalPages }
    };
  }

  public async upload(file: File, metadata: { alt?: string } = {}): Promise<ApiResponse<MediaAsset>> {
    await delay(350);

    // Create a client-side object URL or data URL for mock persistence
    const fakeUrl = URL.createObjectURL(file);
    const media = MockDatabase.getMedia();

    const newAsset: MediaAsset = {
      id: `med-${Date.now()}`,
      url: fakeUrl,
      filename: file.name,
      mimeType: file.type || 'image/jpeg',
      size: file.size,
      width: 800,
      height: 800,
      alt: metadata.alt || file.name.replace(/\.[^/.]+$/, ''),
      createdAt: new Date().toISOString()
    };

    MockDatabase.setMedia([newAsset, ...media]);
    return { success: true, data: newAsset, message: 'Media asset uploaded successfully.' };
  }

  public async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    await delay(180);
    const media = MockDatabase.getMedia();
    const filtered = media.filter((m) => m.id !== id);
    if (filtered.length === media.length) throw new ApiError(`Media "${id}" not found.`, 404);

    MockDatabase.setMedia(filtered);
    return { success: true, data: { id }, message: 'Media asset deleted successfully.' };
  }
}

export const mockMediaService = new MockMediaService();
