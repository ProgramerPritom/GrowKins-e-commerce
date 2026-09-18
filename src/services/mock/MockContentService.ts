import type { IContentService } from '../interfaces/IContentService';
import type {
  HomepageCMS,
  NavigationCMS,
  FooterCMS,
  ApiResponse
} from '../../types/admin';
import { MockDatabase } from '../../lib/mockDb/MockDatabase';

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

export class MockContentService implements IContentService {
  public async getHomepage(): Promise<ApiResponse<HomepageCMS>> {
    await delay();
    return { success: true, data: MockDatabase.getHomepageCMS() };
  }

  public async updateHomepage(cms: Partial<HomepageCMS>): Promise<ApiResponse<HomepageCMS>> {
    await delay(200);
    const current = MockDatabase.getHomepageCMS();
    const updated: HomepageCMS = { ...current, ...cms };
    MockDatabase.setHomepageCMS(updated);
    return { success: true, data: updated, message: 'Homepage content updated successfully.' };
  }

  public async getNavigation(): Promise<ApiResponse<NavigationCMS>> {
    await delay();
    return { success: true, data: MockDatabase.getNavigationCMS() };
  }

  public async updateNavigation(cms: Partial<NavigationCMS>): Promise<ApiResponse<NavigationCMS>> {
    await delay(200);
    const current = MockDatabase.getNavigationCMS();
    const updated: NavigationCMS = { ...current, ...cms };
    MockDatabase.setNavigationCMS(updated);
    return { success: true, data: updated, message: 'Navigation updated successfully.' };
  }

  public async getFooter(): Promise<ApiResponse<FooterCMS>> {
    await delay();
    return { success: true, data: MockDatabase.getFooterCMS() };
  }

  public async updateFooter(cms: Partial<FooterCMS>): Promise<ApiResponse<FooterCMS>> {
    await delay(200);
    const current = MockDatabase.getFooterCMS();
    const updated: FooterCMS = { ...current, ...cms };
    MockDatabase.setFooterCMS(updated);
    return { success: true, data: updated, message: 'Footer content updated successfully.' };
  }
}

export const mockContentService = new MockContentService();
