"use client";

import { Toaster as SonnerToaster, toast } from "sonner";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X, CalendarClock, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface CustomToastProps {
  t: string | number;
  type: ToastType;
  title?: string;
  message: string;
}

const ToastIcon = ({ type }: { type: ToastType }) => {
  const icons = {
    success: { icon: CheckCircle, color: "bg-[#10b981]", light: "bg-[#10b981]/10" },
    error: { icon: AlertCircle, color: "bg-[#ef4444]", light: "bg-[#ef4444]/10" },
    warning: { icon: AlertTriangle, color: "bg-[#f59e0b]", light: "bg-[#f59e0b]/10" },
    info: { icon: Info, color: "bg-[#3b82f6]", light: "bg-[#3b82f6]/10" },
  };

  const { icon: Icon, color, light } = icons[type];

  return (
    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", light)}>
      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center", color)}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
  );
};

export const showToast = (message: string | React.ReactNode, type: ToastType = "info", title?: string) => {
  const defaultTitles = {
    success: "Éxito",
    error: "Error",
    warning: "Advertencia",
    info: "Información",
  };

  const typeStyles = {
    success: "bg-[#ecfdf5] border-[#d1fae5]",
    error: "bg-[#fff5f5] border-[#fee2e2]",
    warning: "bg-[#fffbeb] border-[#fef3c7]",
    info: "bg-[#eff6ff] border-[#dbeafe]",
  };

  toast.custom((t) => (
    <div className={cn(
      "w-[420px] border rounded-[24px] py-6 px-7 flex items-start gap-4 shadow-2xl",
      "animate-in slide-in-from-right-[120%] duration-500 ease-in-out",
      "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-[120%] data-[state=closed]:duration-300",
      typeStyles[type]
    )}>
      <ToastIcon type={type} />
      <div className="flex-1 min-w-0">
        <h4 className="text-[17px] font-bold text-[#123159] mb-0.5 truncate">
          {title || defaultTitles[type]}
        </h4>
        <p className="text-[14px] font-medium text-[#475569] leading-snug">
          {message}
        </p>
      </div>
      <button 
        onClick={() => toast.dismiss(t)}
        className="text-[#94a3b8] hover:text-[#64748b] transition-colors pt-1 shrink-0"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  ), {
    duration: 5000,
    position: "top-right",
  });
};

export const showToastWithAction = (
  title: string,
  message: string,
  type: ToastType = "info",
  action?: { label: string; onClick: () => void }
) => {
  const typeStyles = {
    success: "bg-[#ecfdf5] border-[#d1fae5]",
    error: "bg-[#fff5f5] border-[#fee2e2]",
    warning: "bg-[#fffbeb] border-[#fef3c7]",
    info: "bg-[#eff6ff] border-[#dbeafe]",
  };

  const actionColors = {
    success: "text-[#10b981] hover:text-[#059669]",
    error: "text-[#ef4444] hover:text-[#dc2626]",
    warning: "text-[#f59e0b] hover:text-[#d97706]",
    info: "text-[#3b82f6] hover:text-[#2563eb]",
  };

  toast.custom((t) => (
    <div className={cn(
      "w-[420px] border rounded-[24px] py-6 px-7 flex items-start gap-4 shadow-2xl",
      "animate-in slide-in-from-right-[120%] duration-500 ease-in-out",
      "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-[120%] data-[state=closed]:duration-300",
      typeStyles[type]
    )}>
      <ToastIcon type={type} />
      <div className="flex-1 min-w-0">
        <h4 className="text-[17px] font-bold text-[#123159] mb-0.5 truncate">
          {title}
        </h4>
        <p className="text-[14px] font-medium text-[#475569] leading-snug">
          {message}
        </p>
        {action && (
          <button
            onClick={() => { toast.dismiss(t); action.onClick(); }}
            className={cn("mt-2 text-[14px] font-semibold transition-colors", actionColors[type])}
          >
            {action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => toast.dismiss(t)}
        className="text-[#94a3b8] hover:text-[#64748b] transition-colors pt-1 shrink-0"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  ), {
    duration: 8000,
    position: "top-right",
  });
};

// Toast oscuro dedicado a recordatorios (distinto del genérico showToast) —
// aparece abajo a la derecha, con la fecha/hora en una píldora y un link de
// "Ver detalles" opcional.
export const showReminderToast = (params: {
  title: string;
  dateTimeLabel: string;
  onViewDetails?: () => void;
}) => {
  const { title, dateTimeLabel, onViewDetails } = params;

  toast.custom((t) => (
    <div className={cn(
      "w-[340px] bg-[#0f172a] rounded-2xl p-5 shadow-2xl",
      "animate-in slide-in-from-bottom-4 fade-in duration-300 ease-out",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-bottom-4 data-[state=closed]:duration-200"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <CalendarClock className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-[15px] font-bold text-white truncate">Recordatorio</h4>
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-slate-400 hover:text-slate-200 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="pl-[42px] mt-2 space-y-2.5">
        <p className="text-sm text-slate-300 leading-snug break-words">{title}</p>
        <span className="inline-flex items-center gap-1.5 bg-emerald-400/10 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full">
          <Bell className="w-3 h-3" /> {dateTimeLabel}
        </span>
        <button
          onClick={() => { toast.dismiss(t); onViewDetails?.(); }}
          className="block text-[#2dd4bf] hover:text-[#5eead4] text-sm font-semibold transition-colors"
        >
          Ver detalles
        </button>
      </div>
    </div>
  ), {
    duration: 6000,
    position: "bottom-right",
  });
};

export function CustomToaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "transparent",
          border: "none",
          boxShadow: "none",
          padding: 0,
        }
      }}
    />
  );
}

