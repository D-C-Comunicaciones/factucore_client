"use client";
import { ChevronDown, FileEdit, Upload, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface DebitNotePageHeaderProps {
  onNavigate?: (view: string) => void;
}

export function DebitNotePageHeader({ onNavigate }: DebitNotePageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">

        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-800">
            Notas de débito
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registra incrementos o corrección de las facturas a tus clientes.{" "}
            <a href="#" className="text-primary hover:underline font-medium">Saber más</a>
          </p>
        </div>

        <div className="flex items-center gap-2">

          {/* Más acciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer text-sm border-slate-200 bg-white text-slate-700 hover:bg-gray-100 hover:text-slate-900 transition-colors"
              >
                Más acciones
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 bg-white text-slate-700 border border-slate-200"
            >
              <DropdownMenuItem
                onClick={() => onNavigate?.('nueva-nota-debito-xml')}
                className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2 text-slate-500" />
                Nueva nota de débito desde XML
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onNavigate?.('exportar')}
                className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 transition-colors"
              >
                <FileEdit className="w-4 h-4 mr-2 text-slate-500" />
                Exportar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Nueva nota de débito */}
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium cursor-pointer"
            onClick={() => router.push("/debit-notes/new")}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Nueva nota de débito
          </Button>

        </div>
      </div>
    </div>
  );
}
