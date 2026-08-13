"use client";

import { Sparkles } from "lucide-react";

interface NewQuoteHeaderProps {
  onOpenDrawer: () => void;
  title?: string;
}

export function NewQuoteHeader({
  onOpenDrawer,
  title = "Nueva cotización",
}: NewQuoteHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-[#001D4A]">
        {title}
      </h1>

      <div className="flex items-center gap-2 relative">
        {/* Sparkles button */}
        <button
          className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center h-[38px] w-[38px]"
          title="Sugerir con IA"
        >
          <Sparkles className="w-4 h-4 text-primary" />
        </button>

        {/* Personalizar opciones button */}
        <button
          onClick={onOpenDrawer}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors h-[38px] bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
        >
          Más ajustes
        </button>
      </div>
    </div>
  );
}