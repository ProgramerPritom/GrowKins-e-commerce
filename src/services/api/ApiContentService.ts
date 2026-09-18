import type { IContentService } from '../interfaces/IContentService';
import type {
  HomepageCMS,
  NavigationCMS,
  FooterCMS,
  ApiResponse
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';

export class ApiContentService implements IContentService {
  public getHomepage(): Promise<ApiResponse<HomepageCMS>> {
    return apiClient.get<ApiResponse<HomepageCMS>>(API_ENDPOINTS.content.homepage);
  }

  public updateHomepage(cms: Partial<HomepageCMS>): Promise<ApiResponse<HomepageCMS>> {
    return apiClient.patch<ApiResponse<HomepageCMS>>(API_ENDPOINTS.content.homepage, cms);
  }

  public getNavigation(): Promise<ApiResponse<NavigationCMS>> {
    return apiClient.get<ApiResponse<NavigationCMS>>(API_ENDPOINTS.content.navigation);
  }

  public updateNavigation(cms: Partial<NavigationCMS>): Promise<ApiResponse<NavigationCMS>> {
    return apiClient.patch<ApiResponse<NavigationCMS>>(API_ENDPOINTS.content.navigation, cms);
  }

  public getFooter(): Promise<ApiResponse<FooterCMS>> {
    return apiClient.get<ApiResponse<FooterCMS>>(API_ENDPOINTS.content.footer);
  }

  public updateFooter(cms: Partial<FooterCMS>): Promise<ApiResponse<FooterCMS>> {
    return apiClient.patch<ApiResponse<FooterCMS>>(API_ENDPOINTS.content.footer, cms);
  }
}

export const apiContentService = new ApiContentService();
