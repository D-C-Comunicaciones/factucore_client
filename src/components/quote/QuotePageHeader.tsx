"use client";
import React, { useState } from "react";
import { Plus, ChevronDown, Download, FileEdit, Upload, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QuoteExportModal } from "./QuoteExportModal";

interface QuotePageHeaderProps {
  onNavigate?: (view: string) => void;
}

export function QuotePageHeader({ onNavigate }: QuotePageHeaderProps) {
  const router = useRouter();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">

        <div>
            <h1 className="text-lg md:text-xl font-bold text-[#0F2843]">
                Cotizaciones
            </h1>
            <p className="text-slate-500 text-sm mt-1">
                Crea y gestiona cotizaciones personalizadas para tus clientes potenciales. <Link href="#" className="text-primary hover:underline">Saber más</Link>
            </p>
        </div>

        <div className="flex items-center gap-2">

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            className="text-xs border-border bg-white text-foreground hover:bg-primary/10 hover:text-foreground transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 mr-1" />
            Exportar
          </Button>

          {/* Nueva cotización */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground cursor-pointer"
              >
                <Plus className="w-3 h-3 mr-1" />
                Nueva cotización
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 bg-popover text-popover-foreground border border-border"
            >
              <DropdownMenuItem
                onClick={() => {
                  router.push("/quotes/new");
                  onNavigate?.("crear-manualmente");
                }}
                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
              >
                <FileEdit className="w-4 h-4 mr-2 text-primary" />
                Crear manualmente
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onNavigate?.("crear-desde-archivo");
                }}
                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                Crear desde un archivo o imagen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <QuoteExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(options) => {
          console.log("Exporting quotes with options:", options);
          onNavigate?.('exportar');
        }}
      />
    </div>
  );
}
