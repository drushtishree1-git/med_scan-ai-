import React from 'react';

export const LoadingSkeletonCard: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="depth-card p-5 rounded-xl border border-slate-200 bg-white animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-6 w-6 bg-slate-200 rounded-full"></div>
      </div>
      <div className="h-8 bg-slate-200 rounded w-1/2"></div>
      <div className="space-y-2 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-100 rounded w-full"></div>
        ))}
      </div>
    </div>
  );
};

export const LoadingSkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200 px-6 flex items-center gap-4">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-4 bg-slate-200 rounded w-32"></div>
        <div className="h-4 bg-slate-200 rounded w-20"></div>
        <div className="h-4 bg-slate-200 rounded w-28 ml-auto"></div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
              <div className="space-y-1 flex-1">
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                <div className="h-2.5 bg-slate-100 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-4 bg-slate-100 rounded w-24"></div>
            <div className="h-6 bg-slate-100 rounded-md w-20"></div>
            <div className="h-3 bg-slate-100 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
