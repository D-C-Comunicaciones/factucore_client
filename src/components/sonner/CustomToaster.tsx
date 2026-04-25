"use client";

import { Toaster as SonnerToaster } from "sonner";
import type { ToasterProps } from "sonner";

export function CustomToaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast border-gray-200 shadow-lg !right-0 !left-auto animate-in slide-in-from-right duration-300 font-sans",
          description: "text-gray-600",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton:
            "bg-gray-100 text-gray-600 hover:bg-gray-200",
          success:
            "bg-green-50 text-green-800 border-green-300",
          error:
            "bg-red-50 text-red-800 border-red-300",
          warning:
            "bg-amber-50 text-amber-800 border-amber-300",
          info:
            "bg-primary/10 text-primary border-primary/30",
        },
      }}
      {...props}
    />
  );
}
