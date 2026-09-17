import React from 'react';
import { LucideIcon, FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  id?: string;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FileQuestion,
  title,
  description,
  actionText,
  onAction,
  id,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div
      id={id}
      className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-300 bg-white/60 my-4"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-3 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 tracking-tight">{title}</h4>
      <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">{description}</p>
      
      {(actionText || secondaryActionText) && (
        <div className="mt-4 flex items-center gap-3">
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
            >
              {actionText}
            </button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
