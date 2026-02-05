"use client";
import { Plus, ChevronDown, FileEdit, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvoicePageHeaderProps {
  onNavigate?: (view: string) => void;
}

export function InvoicePageHeader({ onNavigate }: InvoicePageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <h1 className="text-lg md:text-xl font-bold">Facturas de venta</h1>
        
        <div className="flex items-center gap-2">
          {/* Botón Más acciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                Más acciones
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onNavigate?.('crear-pos')}>
                <Plus className="w-4 h-4 mr-2" />
                Crear tiquete POS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.('nueva-venta-xml')}>
                <Upload className="w-4 h-4 mr-2" />
                Nueva venta desde XML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.('exportar')}>
                <FileEdit className="w-4 h-4 mr-2" />
                Exportar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botón Nueva factura de venta */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Nueva factura de venta
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem onClick={() => onNavigate?.('crear-manualmente')}>
                <FileEdit className="w-4 h-4 mr-2" />
                Crear manualmente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.('crear-desde-archivo')}>
                <Upload className="w-4 h-4 mr-2" />
                Crear desde un archivo o imagen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="text-xs text-gray-600">
        Crea, edita y gestiona facturas detalladas para tus transacciones comerciales.{' '}
        <a href="#" className="text-teal-600 hover:text-teal-700 text-xs">Saber más.</a>
      </p>
    </div>
  );
}
