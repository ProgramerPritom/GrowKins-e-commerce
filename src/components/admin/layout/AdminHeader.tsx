import React from 'react';
import { Menu, ExternalLink, Sparkles } from 'lucide-react';
import { useAdminRouter } from '../../../context/AdminRouterContext';
import { useAdminAuth } from '../../../context/AdminAuthContext';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenMobileMenu }) => {
  const { navigate } = useAdminRouter();
  const { user } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-[#E8E0D2] px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Quick Action */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#24221F] hover:bg-[#FAF7F1] border border-[#E8E0D2] transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live Mock Mode Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCF4DB] border border-[#E8DAB2] text-[11px] font-semibold text-[#8C6C38]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DDA428] animate-pulse" />
          <span>Local Mock Database (Persistent)</span>
        </div>
      </div>

      {/* Right: Search / Store Link / User */}
      <div className="flex items-center gap-3">
        {/* Quick Navigate to Products */}
        <button
          onClick={() => navigate('/admin/products/new')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#24221F] hover:bg-[#3D3A35] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F28F79]" />
          <span>Add Product</span>
        </button>

        {/* View Storefront */}
        <button
          onClick={() => {
            window.location.href = '/';
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E0D2] hover:bg-[#FAF7F1] text-xs font-semibold text-[#635E55] transition-colors cursor-pointer"
          title="Open storefront"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#1C4CB8]" />
          <span className="hidden sm:inline">Storefront</span>
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E8E0D2]">
          <div className="w-8 h-8 rounded-full bg-[#FAF7F1] border border-[#E8E0D2] flex items-center justify-center text-xs font-bold text-[#24221F]">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-[#24221F] leading-none">{user?.name?.split(' ')[0]}</p>
            <span className="text-[10px] text-[#8C8478] capitalize">{user?.role?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
