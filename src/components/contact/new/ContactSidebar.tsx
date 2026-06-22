"use client";

import React from "react";
import { HelpCircle, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useContactForm } from "./ContactFormProvider";
import { Button } from "@/components/ui/button";

interface ContactSidebarProps {
  onSave?: () => void;
  onSaveAndCreateAnother?: () => void;
  onCancel?: () => void;
  creating?: boolean;
  saveText?: string;
}

export function ContactSidebar({ onSave, onSaveAndCreateAnother, onCancel, creating, saveText = "Crear contacto" }: ContactSidebarProps) {
  if (!onSave) return null;

  return (
    <div className="w-full md:w-[300px] shrink-0 flex flex-col gap-4 sticky top-24 self-start">
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col gap-3">
        {onSaveAndCreateAnother && (
          <Button
            variant="outline"
            onClick={onSaveAndCreateAnother}
            disabled={creating}
            className="w-full bg-white text-slate-700 border-gray-300 hover:border-primary hover:bg-slate-50 font-semibold h-10 transition-colors"
          >
            Guardar y crear otro
          </Button>
        )}
        <div className="flex gap-3">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={creating}
              className="flex-1 bg-white text-slate-700 border-gray-300 hover:border-primary hover:bg-slate-50 font-semibold h-10 transition-colors"
            >
              Cancelar
            </Button>
          )}
          <Button
            onClick={onSave}
            disabled={creating}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold h-10"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {saveText}
          </Button>
        </div>
      </div>
    </div>
  );
}
