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
  const { sendAccountStatement, setSendAccountStatement } = useContactForm();

  // Custom switch class
  const switchLabelStyle = "relative inline-flex items-center cursor-pointer";
  const switchInputStyle = "sr-only peer";
  const switchBoxStyle = "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00b4a2]";

  return (
    <div className="w-full md:w-[300px] shrink-0 flex flex-col gap-4 sticky top-24 self-start">
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <TooltipProvider>
            <div>
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                Enviar estado de cuenta
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 text-white border-slate-800">
                    Enviaremos un correo mensual a este contacto con el resumen de sus saldos y movimientos.
                  </TooltipContent>
                </Tooltip>
              </span>
            </div>
          </TooltipProvider>
          <label className={switchLabelStyle}>
            <input
              type="checkbox"
              checked={sendAccountStatement}
              onChange={(e) => setSendAccountStatement(e.target.checked)}
              className={switchInputStyle}
            />
            <div className={switchBoxStyle}></div>
          </label>
        </div>

        {onSave && (
          <div className="flex flex-col gap-3 pt-1">
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
        )}
      </div>
    </div>
  );
}
