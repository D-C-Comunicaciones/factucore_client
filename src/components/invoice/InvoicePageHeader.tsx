"use client";
import { Plus, ChevronDown, FileEdit, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface InvoicePageHeaderProps {
  onNavigate?: (view: string) => void;
}

export function InvoicePageHeader({ onNavigate }: InvoicePageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">

        <h1 className="text-lg md:text-xl font-bold text-foreground">
          Facturas de venta
        </h1>

        <div className="flex items-center gap-2">

          {/* Más acciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-border bg-white text-foreground hover:bg-primary/10 hover:text-foreground transition-colors"
              >
                Más acciones
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-popover text-popover-foreground border border-border"
            >
              <DropdownMenuItem
                onClick={() => onNavigate?.('crear-pos')}
                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
              >
                <Plus className="w-4 h-4 mr-2 text-primary" />
                Crear tiquete POS
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onNavigate?.('nueva-venta-xml')}
                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
              >
                <Upload className="w-4 h-4 mr-2 text-primary" />
                Nueva venta desde XML
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onNavigate?.('exportar')}
                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
              >
                <FileEdit className="w-4 h-4 mr-2 text-primary" />
                Exportar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Nueva factura */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground cursor-pointer"
              >
                <Plus className="w-3 h-3 mr-1" />
                Nueva factura de venta
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 bg-popover text-popover-foreground border border-border"
            >
              <DropdownMenuItem
                onClick={() => {
                  router.push("/invoices/new");
                  onNavigate?.("crear-manualmente");
                }}
                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
              >
                <FileEdit className="w-4 h-4 mr-2 text-primary " />
                Crear manualmente
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onNavigate?.('crear-desde-archivo')}
                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
              >
                <Upload className="w-4 h-4 mr-2 text-primary" />
                Crear desde un archivo o imagen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Crea, edita y gestiona facturas detalladas para tus transacciones comerciales.{" "}
        <a
          href="#"
          className="text-primary hover:text-primary/80 font-medium"
        >
          Saber más.
        </a>
      </p>
    </div>
  );
}