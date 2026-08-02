"use client";
import { Plus, Download, FileEdit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RemissionPageHeaderProps {
  onNavigate?: (view: string) => void;
}

export function RemissionPageHeader({ onNavigate }: RemissionPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">

        <div>
            <h1 className="text-lg md:text-xl font-bold text-[#0F2843]">
                Remisiones
            </h1>
            <p className="text-slate-500 text-sm mt-1">
                Cree y gestione sus remisiones para respaldar los envíos y agilizar su facturación. <Link href="#" className="text-primary hover:underline">Saber más</Link>
            </p>
        </div>

        <div className="flex items-center gap-2">

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('exportar')}
            className="text-xs border-border bg-white text-foreground hover:bg-primary/10 hover:text-foreground transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 mr-1" />
            Exportar
          </Button>

          <Button
            size="sm"
            onClick={() => {
                router.push("/remissions/new");
                onNavigate?.("crear-manualmente");
            }}
            className="hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground cursor-pointer"
          >
            <Plus className="w-3 h-3 mr-1" />
            Nueva remisión
          </Button>

        </div>
      </div>
    </div>
  );
}
