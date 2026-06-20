"use client";

import { Toaster as SonnerToaster, toast } from "sonner";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
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

export const showToast = (message: string, type: ToastType = "info", title?: string) => {
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

