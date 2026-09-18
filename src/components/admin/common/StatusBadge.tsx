import React from 'react';

export type StatusVariant =
  | 'draft'
  | 'active'
  | 'archived'
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock'
  | 'cod_pending'
  | 'cod_collected'
  | 'not_collected'
  | 'approved'
  | 'rejected';

interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

const BADGE_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  // Product / Category
  active: { bg: 'bg-[#E6EFE9]', text: 'text-[#2D6A4F]', dot: 'bg-[#2D6A4F]', label: 'Active' },
  draft: { bg: 'bg-[#F4EFE6]', text: 'text-[#7D6B53]', dot: 'bg-[#A89880]', label: 'Draft' },
  archived: { bg: 'bg-[#F1EDF6]', text: 'text-[#5C4D7D]', dot: 'bg-[#5C4D7D]', label: 'Archived' },
  inactive: { bg: 'bg-[#FBE8E5]', text: 'text-[#B83A28]', dot: 'bg-[#B83A28]', label: 'Inactive' },

  // Stock
  in_stock: { bg: 'bg-[#E6EFE9]', text: 'text-[#2D6A4F]', dot: 'bg-[#2D6A4F]', label: 'In Stock' },
  low_stock: { bg: 'bg-[#FCF4DB]', text: 'text-[#9A7316]', dot: 'bg-[#DDA428]', label: 'Low Stock' },
  out_of_stock: { bg: 'bg-[#FBE8E5]', text: 'text-[#B83A28]', dot: 'bg-[#B83A28]', label: 'Out of Stock' },

  // Orders
  pending: { bg: 'bg-[#FCF4DB]', text: 'text-[#9A7316]', dot: 'bg-[#DDA428]', label: 'Pending' },
  confirmed: { bg: 'bg-[#E7EDFB]', text: 'text-[#1C4CB8]', dot: 'bg-[#1C4CB8]', label: 'Confirmed' },
  processing: { bg: 'bg-[#F1EDF6]', text: 'text-[#6A4C93]', dot: 'bg-[#6A4C93]', label: 'Processing' },
  shipped: { bg: 'bg-[#E7EDFB]', text: 'text-[#1C4CB8]', dot: 'bg-[#1C4CB8]', label: 'Shipped' },
  out_for_delivery: { bg: 'bg-[#FDF0ED]', text: 'text-[#D96F58]', dot: 'bg-[#F28F79]', label: 'Out for Delivery' },
  delivered: { bg: 'bg-[#E6EFE9]', text: 'text-[#2D6A4F]', dot: 'bg-[#2D6A4F]', label: 'Delivered' },
  cancelled: { bg: 'bg-[#FBE8E5]', text: 'text-[#B83A28]', dot: 'bg-[#B83A28]', label: 'Cancelled' },
  returned: { bg: 'bg-[#FBE8E5]', text: 'text-[#8C2D19]', dot: 'bg-[#8C2D19]', label: 'Returned' },

  // Payments
  cod_pending: { bg: 'bg-[#FCF4DB]', text: 'text-[#9A7316]', dot: 'bg-[#DDA428]', label: 'COD Pending' },
  cod_collected: { bg: 'bg-[#E6EFE9]', text: 'text-[#2D6A4F]', dot: 'bg-[#2D6A4F]', label: 'COD Collected' },
  not_collected: { bg: 'bg-[#FBE8E5]', text: 'text-[#B83A28]', dot: 'bg-[#B83A28]', label: 'Not Collected' },

  // Reviews
  approved: { bg: 'bg-[#E6EFE9]', text: 'text-[#2D6A4F]', dot: 'bg-[#2D6A4F]', label: 'Approved' },
  rejected: { bg: 'bg-[#FBE8E5]', text: 'text-[#B83A28]', dot: 'bg-[#B83A28]', label: 'Rejected' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const normalized = status.toLowerCase().replace(/[\s-]/g, '_');
  const config = BADGE_STYLES[normalized] || {
    bg: 'bg-[#F4EFE6]',
    text: 'text-[#4A463F]',
    dot: 'bg-[#8C8478]',
    label: status
  };

  const displayText = label || config.label;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${config.bg} ${config.text} ${padding} transition-colors select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{displayText}</span>
    </span>
  );
};
