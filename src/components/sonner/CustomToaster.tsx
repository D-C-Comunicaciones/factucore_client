"use client";

import { Toaster as SonnerToaster } from "sonner";
import type { ToasterProps } from "sonner";

export function CustomToaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="bottom-right"
      expand={false}
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-white text-gray-950 border-gray-200 shadow-lg",
          description: "text-gray-600",
          actionButton:
            "bg-teal-500 text-white hover:bg-teal-600",
          cancelButton:
            "bg-gray-100 text-gray-600 hover:bg-gray-200",
          success:
            "bg-green-50 text-green-800 border-green-300",
          error:
            "bg-red-50 text-red-800 border-red-300",
          warning:
            "bg-amber-50 text-amber-800 border-amber-300",
          info:
            "bg-blue-50 text-blue-800 border-blue-300",
        },
      }}
      {...props}
    />
  );
}
