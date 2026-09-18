import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string;
    positive: boolean;
  };
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  iconBg = 'bg-[#FAF7F1]',
  iconColor = 'text-[#1C4CB8]',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E8E0D2] rounded-2xl p-5 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-[#1C4CB8]/40 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7D766C]">{title}</p>
          <h3 className="text-2xl font-bold font-serif text-[#24221F] mt-1.5">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-3.5 pt-3 border-t border-[#F4EFE6] flex items-center justify-between text-xs">
          {change ? (
            <div
              className={`flex items-center gap-1 font-semibold ${
                change.positive ? 'text-[#2D6A4F]' : 'text-[#B83A28]'
              }`}
            >
              {change.positive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>{change.value}</span>
            </div>
          ) : (
            <span />
          )}

          {subtitle && <span className="text-[#8C8478]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
