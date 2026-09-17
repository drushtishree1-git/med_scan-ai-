import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  onClick?: () => void;
  id?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50 border-blue-100',
  trend,
  onClick,
  id,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`depth-card p-6 rounded-2xl border border-slate-200 bg-white ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-slate-400 truncate">{subtitle}</p>}

          {trend && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs">
              <span
                className={`font-semibold ${
                  trend.isPositive === undefined
                    ? 'text-slate-600'
                    : trend.isPositive
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}
              >
                {trend.value}
              </span>
              {trend.label && <span className="text-slate-400">{trend.label}</span>}
            </div>
          )}
        </div>

        <div className={`p-2.5 rounded-xl border shrink-0 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};
