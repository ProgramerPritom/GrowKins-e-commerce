import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderTree,
  ShoppingBag,
  Users,
  Star,
  Image as ImageIcon,
  Truck,
  Settings,
  Sliders,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Navigation,
  FileText,
  ShieldCheck,
  Quote,
  Shirt,
  Ruler
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminRouter } from '../../../context/AdminRouterContext';
import { useAdminAuth } from '../../../context/AdminAuthContext';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile
}) => {
  const { path, navigate } = useAdminRouter();
  const { user, logout } = useAdminAuth();

  // Collapsible groups state persisted to localStorage
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('growkins_admin_sidebar_collapsed_groups');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {};
  });

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => {
      const updated = { ...prev, [groupName]: !prev[groupName] };
      try {
        localStorage.setItem('growkins_admin_sidebar_collapsed_groups', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleNav = (to: string) => {
    navigate(to);
    if (onCloseMobile) onCloseMobile();
  };

  const navSections = [
    {
      group: null,
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'Catalog',
      items: [
        { label: 'Products', path: '/admin/products', icon: Package },
        { label: 'Categories', path: '/admin/categories', icon: FolderTree },
        { label: 'Collections', path: '/admin/collections', icon: Layers },
      ]
    },
    {
      group: 'Fashion',
      items: [
        { label: 'Clothing Overview', path: '/admin/clothing', icon: LayoutDashboard },
        { label: 'Clothing Products', path: '/admin/clothing/products', icon: Shirt },
        { label: 'Variant Inventory', path: '/admin/clothing/inventory', icon: Sliders },
        { label: 'Clothing Categories', path: '/admin/clothing/categories', icon: FolderTree },
        { label: 'Collections', path: '/admin/clothing/collections', icon: Layers },
        { label: 'Looks & Hotspots', path: '/admin/clothing/lookbooks', icon: ImageIcon },
        { label: 'Size Guides', path: '/admin/clothing/size-guides', icon: Ruler },
        { label: 'Clothing Homepage', path: '/admin/clothing/content/homepage', icon: Sparkles },
      ]
    },
    {
      group: 'Commerce',
      items: [
        { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { label: 'Customers', path: '/admin/customers', icon: Users },
        { label: 'Reviews', path: '/admin/reviews', icon: Star },
      ]
    },
    {
      group: 'Content CMS',
      items: [
        { label: 'Homepage', path: '/admin/content/homepage', icon: Sparkles },
        { label: 'Navigation', path: '/admin/content/navigation', icon: Navigation },
        { label: 'Footer', path: '/admin/content/footer', icon: FileText },
        { label: 'Trust & Philosophy', path: '/admin/content/trust', icon: ShieldCheck },
        { label: 'Testimonials', path: '/admin/content/testimonials', icon: Quote },
      ]
    },
    {
      group: 'Assets & Logistics',
      items: [
        { label: 'Media Library', path: '/admin/media', icon: ImageIcon },
        { label: 'Delivery & COD', path: '/admin/delivery', icon: Truck },
      ]
    },
    {
      group: 'System',
      items: [
        { label: 'Store Settings', path: '/admin/settings/store', icon: Settings },
        { label: 'Checkout Settings', path: '/admin/settings/checkout', icon: Sliders },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 bg-[#24221F]/40 backdrop-blur-xs z-40"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#FAF7F1] border-r border-[#E8E0D2] flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#E8E0D2]">
          {!collapsed ? (
            <div
              onClick={() => handleNav('/admin/dashboard')}
              className="flex items-baseline gap-1.5 cursor-pointer select-none"
            >
              <span className="font-serif text-2xl font-bold tracking-tight text-[#24221F]">
                GrowKins
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F28F79]" />
              <span className="ml-1 text-[10px] uppercase tracking-wider font-bold text-[#1C4CB8] bg-[#E7EDFB] px-1.5 py-0.5 rounded">
                Admin
              </span>
            </div>
          ) : (
            <div
              onClick={() => handleNav('/admin/dashboard')}
              className="mx-auto font-serif text-2xl font-bold text-[#24221F] cursor-pointer"
            >
              G<span className="text-[#F28F79]">.</span>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-[#8C8478] hover:text-[#24221F] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {navSections.map((section, sIdx) => {
            const groupName = section.group;
            const isGroupCollapsed = groupName ? !!collapsedGroups[groupName] : false;
            const hasActiveItem = section.items.some(
              (item) => path === item.path || (item.path !== '/admin/dashboard' && path.startsWith(item.path))
            );

            return (
              <div key={sIdx} className="space-y-1">
                {groupName && !collapsed && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(groupName)}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#9E9689] hover:text-[#24221F] rounded-lg transition-colors cursor-pointer group select-none"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{groupName}</span>
                      {hasActiveItem && isGroupCollapsed && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1C4CB8]" />
                      )}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 text-[#9E9689] group-hover:text-[#24221F] ${
                        isGroupCollapsed ? '-rotate-90' : 'rotate-0'
                      }`}
                    />
                  </button>
                )}

                <AnimatePresence initial={false}>
                  {(!isGroupCollapsed || collapsed) && (
                    <motion.nav
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: 'easeInOut' }}
                      className="overflow-hidden space-y-1"
                    >
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                          path === item.path ||
                          (item.path !== '/admin/dashboard' && path.startsWith(item.path));

                        return (
                          <button
                            key={item.path}
                            onClick={() => handleNav(item.path)}
                            title={collapsed ? item.label : undefined}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              collapsed ? 'justify-center' : ''
                            } ${
                              isActive
                                ? 'bg-[#1C4CB8] text-white shadow-xs'
                                : 'text-[#635E55] hover:text-[#24221F] hover:bg-[#F4EFE6]'
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? 'text-white' : 'text-[#7D766C]'
                              }`}
                            />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                          </button>
                        );
                      })}
                    </motion.nav>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer Actions & Profile */}
        <div className="p-3 border-t border-[#E8E0D2] bg-[#FAF7F1] space-y-2">
          {/* View Store Button */}
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1C4CB8] bg-[#E7EDFB] hover:bg-[#D9E4FA] transition-colors cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
            title="View Live Storefront"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!collapsed && <span>View Store</span>}
          </button>

          {/* User & Logout */}
          <div
            className={`flex items-center justify-between pt-2 border-t border-[#E8E0D2]/60 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#E8E0D2] flex items-center justify-center text-[#24221F] text-xs font-bold shrink-0">
                {user?.name?.[0] || 'A'}
              </div>
              {!collapsed && (
                <div className="truncate text-left">
                  <p className="text-xs font-bold text-[#24221F] truncate leading-tight">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-[10px] text-[#8C8478] truncate">GrowKins Staff</p>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-[#8C8478] hover:text-[#B83A28] hover:bg-[#FBE8E5] transition-colors cursor-pointer"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
