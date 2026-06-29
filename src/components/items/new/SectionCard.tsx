"use client";

import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SectionCard({ title, children, defaultOpen = true }: SectionCardProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-2 border-t border-border">{children}</div>
      </div>
    </div>
  );
}
