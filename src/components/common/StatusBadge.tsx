import React from 'react';
import {
  ConcentratorCondition,
  RequestUrgency,
  WorkOrderStatus,
  VerificationStatus,
} from '../../types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Wrench,
  CheckCircle,
  Hourglass,
  HelpCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  type: 'condition' | 'urgency' | 'work_order' | 'verification';
  value: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  if (type === 'condition') {
    const condition = value as ConcentratorCondition;
    switch (condition) {
      case 'operational':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-100 text-emerald-800 ${sizeClass}`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Operational
          </span>
        );
      case 'degraded':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-100 text-amber-800 ${sizeClass}`}>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Degraded / Needs PM
          </span>
        );
      case 'out_of_service':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-100 text-rose-800 ${sizeClass}`}>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Out of Service
          </span>
        );
      case 'needs_assessment':
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-700 ${sizeClass}`}>
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            Needs Assessment
          </span>
        );
    }
  }

  if (type === 'urgency') {
    const urgency = value as RequestUrgency;
    switch (urgency) {
      case 'safety_critical':
        return (
          <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-rose-100 text-rose-900 border border-rose-300 ${sizeClass}`}>
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            Safety-Critical
          </span>
        );
      case 'urgent':
        return (
          <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-amber-100 text-amber-900 border border-amber-300 ${sizeClass}`}>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Urgent
          </span>
        );
      case 'routine':
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-100 text-blue-800 ${sizeClass}`}>
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Routine PM
          </span>
        );
    }
  }

  if (type === 'work_order') {
    const status = value as WorkOrderStatus;
    switch (status) {
      case 'completed':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-100 text-emerald-800 ${sizeClass}`}>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Completed & Verified
          </span>
        );
      case 'awaiting_review':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-purple-100 text-purple-800 ${sizeClass}`}>
            <Hourglass className="w-3.5 h-3.5 text-purple-600" />
            Awaiting QA Review
          </span>
        );
      case 'in_progress':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-teal-100 text-teal-800 ${sizeClass}`}>
            <Wrench className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            In Progress
          </span>
        );
      case 'parts_required':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-orange-100 text-orange-800 ${sizeClass}`}>
            <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
            Parts Required
          </span>
        );
      case 'assigned':
      case 'en_route':
      case 'arrived':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-sky-100 text-sky-800 ${sizeClass}`}>
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            {status === 'assigned' ? 'Engineer Assigned' : status === 'en_route' ? 'En Route' : 'Arrived On Site'}
          </span>
        );
      case 'submitted':
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-100 text-amber-800 ${sizeClass}`}>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Dispatch
          </span>
        );
    }
  }

  if (type === 'verification') {
    const vStatus = value as VerificationStatus;
    switch (vStatus) {
      case 'verified':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-teal-100 text-teal-800 ${sizeClass}`}>
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-100 text-amber-800 ${sizeClass}`}>
            <Hourglass className="w-3.5 h-3.5 text-amber-600" />
            Pending Review
          </span>
        );
      case 'changes_requested':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-orange-100 text-orange-800 ${sizeClass}`}>
            <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
            Changes Requested
          </span>
        );
      case 'rejected':
      case 'suspended':
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-100 text-rose-800 ${sizeClass}`}>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            {vStatus === 'suspended' ? 'Suspended' : 'Rejected'}
          </span>
        );
    }
  }

  return <span className={`inline-flex rounded-full bg-slate-100 text-slate-800 ${sizeClass}`}>{value}</span>;
};
