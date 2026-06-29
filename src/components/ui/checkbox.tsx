"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "./utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base
        "peer size-4 shrink-0 rounded-[4px] border shadow-xs outline-none transition-shadow",
        // Borde por defecto
        "border-gray-300 bg-white",
        // Estado checked
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-white",
        // Estado indeterminate
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-white",
        // Focus
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Invalid
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        {props.checked === "indeterminate" ? (
          <MinusIcon className="size-3.5" strokeWidth={3} />
        ) : (
          <CheckIcon className="size-3.5" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
