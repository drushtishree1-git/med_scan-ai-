import React from 'react';
import { AnalysisModality, AnalysisStatus, AnalysisUrgency, UserRole } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]',
    warning: 'bg-[#fef9c3] text-[#854d0e] border-[#fef08a]',
    danger: 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]',
    info: 'bg-[#dbeafe] text-[#1e40af] border-[#bfdbfe]',
    primary: 'bg-[#dbeafe] text-[#1e40af] border-[#bfdbfe]',
  };

  const dotStyles = {
    default: 'bg-slate-400',
    neutral: 'bg-slate-400',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-rose-600',
    info: 'bg-blue-600',
    primary: 'bg-blue-600',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: AnalysisStatus }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="success" dot>
          Completed
        </Badge>
      );
    case 'reviewed':
      return (
        <Badge variant="info" dot>
          Doctor Reviewed
        </Badge>
      );
    case 'processing':
      return (
        <Badge variant="warning" dot>
          Analyzing...
        </Badge>
      );
    case 'flagged':
      return (
        <Badge variant="danger" dot>
          Clinical Review Flagged
        </Badge>
      );
    case 'queued':
    default:
      return (
        <Badge variant="neutral" dot>
          In Queue
        </Badge>
      );
  }
};

export const UrgencyBadge: React.FC<{ urgency: AnalysisUrgency }> = ({ urgency }) => {
  switch (urgency) {
    case 'critical':
      return <Badge variant="danger">CRITICAL PRIORITY</Badge>;
    case 'urgent':
      return <Badge variant="warning">URGENT</Badge>;
    case 'moderate':
      return <Badge variant="info">MODERATE</Badge>;
    case 'routine':
    default:
      return <Badge variant="neutral">ROUTINE</Badge>;
  }
};

export const ModalityBadge: React.FC<{ modality: AnalysisModality }> = ({ modality }) => {
  const labels: Record<AnalysisModality, { label: string; variant: 'primary' | 'info' | 'neutral' | 'success' | 'warning' }> = {
    xray: { label: 'Chest X-Ray', variant: 'primary' },
    mri: { label: 'MRI Scan', variant: 'info' },
    ct: { label: 'CT Tomography', variant: 'info' },
    ultrasound: { label: 'Ultrasound', variant: 'primary' },
    derm: { label: 'Dermatology', variant: 'warning' },
    retinal: { label: 'Retinal Fundus', variant: 'neutral' },
    lab_report: { label: 'Lab Document', variant: 'success' },
    pathology: { label: 'Histopathology', variant: 'primary' },
  };

  const item = labels[modality] || { label: modality, variant: 'neutral' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const configs: Record<UserRole, { label: string; variant: 'primary' | 'info' | 'warning' }> = {
    doctor: { label: 'Attending Physician', variant: 'primary' },
    patient: { label: 'Registered Patient', variant: 'info' },
    admin: { label: 'System Admin', variant: 'warning' },
  };

  const config = configs[role] || { label: role, variant: 'info' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
