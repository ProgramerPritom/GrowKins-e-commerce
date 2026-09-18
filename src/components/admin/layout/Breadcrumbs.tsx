import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useAdminRouter } from '../../../context/AdminRouterContext';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { navigate } = useAdminRouter();

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-[#8C8478] mb-2" aria-label="Breadcrumb">
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="hover:text-[#1C4CB8] transition-colors p-0.5 rounded cursor-pointer"
        aria-label="Dashboard"
      >
        <Home className="w-3.5 h-3.5" />
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-[#BDB5A7]" />
            {item.href && !isLast ? (
              <button
                onClick={() => navigate(item.href!)}
                className="hover:text-[#1C4CB8] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className="font-semibold text-[#24221F] truncate max-w-[200px]">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
