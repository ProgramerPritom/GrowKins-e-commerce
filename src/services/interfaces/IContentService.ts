import type {
  HomepageCMS,
  NavigationCMS,
  FooterCMS,
  ApiResponse
} from '../../types/admin';

export interface IContentService {
  getHomepage(): Promise<ApiResponse<HomepageCMS>>;
  updateHomepage(cms: Partial<HomepageCMS>): Promise<ApiResponse<HomepageCMS>>;
  
  getNavigation(): Promise<ApiResponse<NavigationCMS>>;
  updateNavigation(cms: Partial<NavigationCMS>): Promise<ApiResponse<NavigationCMS>>;

  getFooter(): Promise<ApiResponse<FooterCMS>>;
  updateFooter(cms: Partial<FooterCMS>): Promise<ApiResponse<FooterCMS>>;
}
