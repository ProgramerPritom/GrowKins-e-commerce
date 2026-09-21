import React from 'react';
import { AdminAuthProvider, useAdminAuth } from '../../context/AdminAuthContext';
import { AdminRouterProvider, useAdminRouter } from '../../context/AdminRouterContext';
import { AdminToastProvider } from './common/AdminToast';
import { AdminShell } from './layout/AdminShell';

// Pages
import { AdminLoginPage } from './pages/AdminLoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsListPage } from './pages/products/ProductsListPage';
import { ProductEditorPage } from './pages/products/ProductEditorPage';
import { CategoriesListPage } from './pages/categories/CategoriesListPage';
import { CollectionsListPage } from './pages/collections/CollectionsListPage';
import { CollectionDetailPage } from './pages/collections/CollectionDetailPage';
import { OrdersListPage } from './pages/orders/OrdersListPage';
import { OrderDetailPage } from './pages/orders/OrderDetailPage';
import { CustomersListPage } from './pages/customers/CustomersListPage';
import { CustomerDetailPage } from './pages/customers/CustomerDetailPage';
import { ReviewsListPage } from './pages/reviews/ReviewsListPage';
import { MediaLibraryPage } from './pages/media/MediaLibraryPage';
import { HomepageCmsPage } from './pages/content/HomepageCmsPage';
import { NavigationCmsPage } from './pages/content/NavigationCmsPage';
import { FooterCmsPage } from './pages/content/FooterCmsPage';
import { TrustCmsPage } from './pages/content/TrustCmsPage';
import { TestimonialsCmsPage } from './pages/content/TestimonialsCmsPage';
import { DeliverySettingsPage } from './pages/delivery/DeliverySettingsPage';
import { StoreSettingsPage } from './pages/settings/StoreSettingsPage';
import { CheckoutSettingsPage } from './pages/settings/CheckoutSettingsPage';

// Fashion & Clothing Pages
import { ClothingDashboardPage } from './pages/clothing/ClothingDashboardPage';
import { ClothingProductsListPage } from './pages/clothing/ClothingProductsListPage';
import { ClothingProductEditorPage } from './pages/clothing/ClothingProductEditorPage';
import { ClothingInventoryPage } from './pages/clothing/ClothingInventoryPage';
import { ClothingCategoriesPage } from './pages/clothing/ClothingCategoriesPage';
import { ClothingCollectionsPage } from './pages/clothing/ClothingCollectionsPage';
import { ClothingLookbooksPage } from './pages/clothing/ClothingLookbooksPage';
import { ClothingSizeGuidesPage } from './pages/clothing/ClothingSizeGuidesPage';
import { ClothingHomepageCmsPage } from './pages/clothing/ClothingHomepageCmsPage';

const AdminRouteDispatcher: React.FC = () => {
  const { path, navigate, params } = useAdminRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-[#8C8478]">Authenticating staff session...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  // Authenticated, but on login page -> redirect to dashboard
  if (path === '/admin/login') {
    navigate('/admin/dashboard', true);
    return null;
  }

  // Route matching
  const renderContent = () => {
    // Exact dashboard or root admin
    if (path === '/admin' || path === '/admin/' || path === '/admin/dashboard') {
      return <DashboardPage />;
    }

    // Fashion / Clothing Hub & Management
    if (path === '/admin/clothing' || path === '/admin/clothing/') {
      return <ClothingDashboardPage />;
    }
    if (path === '/admin/clothing/products') {
      return <ClothingProductsListPage />;
    }
    if (
      path === '/admin/clothing/products/new' ||
      params.action === 'edit' ||
      (path.startsWith('/admin/clothing/products/') && params.id)
    ) {
      return <ClothingProductEditorPage />;
    }
    if (path === '/admin/clothing/inventory') {
      return <ClothingInventoryPage />;
    }
    if (path.startsWith('/admin/clothing/categories')) {
      return <ClothingCategoriesPage />;
    }
    if (path.startsWith('/admin/clothing/collections')) {
      return <ClothingCollectionsPage />;
    }
    if (path.startsWith('/admin/clothing/lookbooks')) {
      return <ClothingLookbooksPage />;
    }
    if (path.startsWith('/admin/clothing/size-guides')) {
      return <ClothingSizeGuidesPage />;
    }
    if (
      path === '/admin/clothing/content' ||
      path.startsWith('/admin/clothing/content/homepage')
    ) {
      return <ClothingHomepageCmsPage />;
    }

    // Products
    if (path === '/admin/products') {
      return <ProductsListPage />;
    }
    if (path === '/admin/products/new' || params.action === 'edit' || (path.startsWith('/admin/products/') && params.id)) {
      return <ProductEditorPage />;
    }

    // Categories
    if (path.startsWith('/admin/categories')) {
      return <CategoriesListPage />;
    }

    // Collections
    if (path === '/admin/collections') {
      return <CollectionsListPage />;
    }
    if (path.startsWith('/admin/collections/')) {
      return <CollectionDetailPage />;
    }

    // Orders
    if (path === '/admin/orders') {
      return <OrdersListPage />;
    }
    if (path.startsWith('/admin/orders/')) {
      return <OrderDetailPage />;
    }

    // Customers
    if (path === '/admin/customers') {
      return <CustomersListPage />;
    }
    if (path.startsWith('/admin/customers/')) {
      return <CustomerDetailPage />;
    }

    // Reviews
    if (path === '/admin/reviews') {
      return <ReviewsListPage />;
    }

    // Media
    if (path === '/admin/media') {
      return <MediaLibraryPage />;
    }

    // Content CMS
    if (path === '/admin/content' || path === '/admin/content/homepage') {
      return <HomepageCmsPage />;
    }
    if (path === '/admin/content/navigation') {
      return <NavigationCmsPage />;
    }
    if (path === '/admin/content/footer') {
      return <FooterCmsPage />;
    }
    if (path === '/admin/content/trust') {
      return <TrustCmsPage />;
    }
    if (path === '/admin/content/testimonials') {
      return <TestimonialsCmsPage />;
    }

    // Operations / Delivery
    if (path === '/admin/delivery') {
      return <DeliverySettingsPage />;
    }

    // Settings
    if (path === '/admin/settings' || path === '/admin/settings/store') {
      return <StoreSettingsPage />;
    }
    if (path === '/admin/settings/checkout' || path === '/admin/settings/orders') {
      return <CheckoutSettingsPage />;
    }

    // Fallback
    return <DashboardPage />;
  };

  return <AdminShell>{renderContent()}</AdminShell>;
};

export const AdminApp: React.FC = () => {
  return (
    <AdminToastProvider>
      <AdminAuthProvider>
        <AdminRouterProvider>
          <AdminRouteDispatcher />
        </AdminRouterProvider>
      </AdminAuthProvider>
    </AdminToastProvider>
  );
};
