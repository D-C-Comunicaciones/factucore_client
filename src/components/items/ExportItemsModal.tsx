"use client";

import * as React from "react";
import { RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ExportItemsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (config: ExportConfig) => void;
}

export interface ExportConfig {
  fileType: "excel" | "csv";
  decimalSeparator: "comma" | "dot";
}

export function ExportItemsModal({
  open,
  onOpenChange,
  onExport,
}: ExportItemsModalProps) {
  const [config, setConfig] = React.useState<ExportConfig>({
    fileType: "excel",
    decimalSeparator: "comma",
  });

  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportClick = async () => {
    setIsExporting(true);
    
    // Alerta personalizada estilo Sonner
    toast.custom((t) => (
      <div className="bg-[#e8fbf1] border border-[#bbf7d0] p-4 rounded-xl shadow-lg flex items-start gap-3 w-full max-w-[350px] animate-in slide-in-from-right-full duration-500">
        <div className="w-6 h-6 rounded-full border-2 border-[#15803d] flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-3.5 h-3.5 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-[14px] font-bold text-[#1e293b] mb-0.5">Exportación en proceso</h4>
          <p className="text-[13px] text-[#475569] leading-tight">
            Tu archivo se está generando, te notificaremos cuando esté listo
          </p>
        </div>
        <button onClick={() => toast.dismiss(t)} className="text-[#475569] hover:text-[#1e293b]">
          <X className="w-4 h-4" />
        </button>
      </div>
    ), { duration: 4000 });

    // Simular proceso de exportación
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onExport(config);
    setIsExporting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-3xl shadow-2xl bg-white">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 flex flex-row items-center justify-between">
          <DialogTitle className="text-[18px] font-bold text-[#1e293b]">
            Exportar
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6 bg-white">
          <p className="text-[14px] text-[#64748b]">
            Personaliza la forma que tendrá tu archivo de descarga
          </p>

          <div className="space-y-3">
            <h4 className="text-[12px] font-bold text-[#1e293b] uppercase tracking-wider">Tipo de archivo</h4>
            <RadioGroup
              value={config.fileType}
              onValueChange={(v: "excel" | "csv") => setConfig(prev => ({ ...prev, fileType: v }))}
              className="flex items-center gap-8"
            >
              <div className="flex items-center space-x-2 group cursor-pointer">
                <RadioGroupItem 
                  value="excel" 
                  id="excel" 
                  className="w-5 h-5 border-gray-300 text-white data-[state=checked]:bg-[#2563eb] data-[state=checked]:border-[#2563eb] focus:ring-[#2563eb] shadow-sm [&_svg]:fill-white [&_svg]:text-white" 
                />
                <Label htmlFor="excel" className="text-[14px] text-[#475569] font-medium cursor-pointer group-hover:text-[#1e293b] transition-colors">Excel</Label>
              </div>
              <div className="flex items-center space-x-2 group cursor-pointer">
                <RadioGroupItem 
                  value="csv" 
                  id="csv" 
                  className="w-5 h-5 border-gray-300 text-white data-[state=checked]:bg-[#2563eb] data-[state=checked]:border-[#2563eb] focus:ring-[#2563eb] shadow-sm [&_svg]:fill-white [&_svg]:text-white" 
                />
                <Label htmlFor="csv" className="text-[14px] text-[#475569] font-medium cursor-pointer group-hover:text-[#1e293b] transition-colors">Tabla CSV</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <h4 className="text-[12px] font-bold text-[#1e293b] uppercase tracking-wider">Separador decimal</h4>
            <RadioGroup
              value={config.decimalSeparator}
              onValueChange={(v: "comma" | "dot") => setConfig(prev => ({ ...prev, decimalSeparator: v }))}
              className="flex items-center gap-8"
            >
              <div className="flex items-center space-x-2 group cursor-pointer">
                <RadioGroupItem 
                  value="comma" 
                  id="comma" 
                  className="w-5 h-5 border-gray-300 text-white data-[state=checked]:bg-[#2563eb] data-[state=checked]:border-[#2563eb] focus:ring-[#2563eb] shadow-sm [&_svg]:fill-white [&_svg]:text-white" 
                />
                <Label htmlFor="comma" className="text-[14px] text-[#475569] font-medium cursor-pointer group-hover:text-[#1e293b] transition-colors">Coma (Configurado en Factucore)</Label>
              </div>
              <div className="flex items-center space-x-2 group cursor-pointer">
                <RadioGroupItem 
                  value="dot" 
                  id="dot" 
                  className="w-5 h-5 border-gray-300 text-white data-[state=checked]:bg-[#2563eb] data-[state=checked]:border-[#2563eb] focus:ring-[#2563eb] shadow-sm [&_svg]:fill-white [&_svg]:text-white" 
                />
                <Label htmlFor="dot" className="text-[14px] text-[#475569] font-medium cursor-pointer group-hover:text-[#1e293b] transition-colors">Punto</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end items-center gap-2">
          <button
            type="button"
            disabled={isExporting}
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-bold rounded-xl bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExportClick}
            className="px-5 py-2 text-sm font-bold rounded-xl bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-all shadow-md active:scale-95 flex items-center justify-center min-w-[100px] disabled:bg-[#93c5fd] disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
            ) : (
              "Exportar"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
