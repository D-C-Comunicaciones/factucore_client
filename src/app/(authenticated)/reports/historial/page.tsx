"use client"

import Link from 'next/link';
import { RefreshCw, Info, ChevronRight } from 'lucide-react';

export default function HistorialReportesPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto py-4 h-full min-h-[80vh]">

      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/reports" className="text-primary hover:underline">
          Reportes
        </Link>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">Historial de exportables</span>
      </div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Historial de exportables</h1>
          <p className="text-muted-foreground text-sm">
            Consulta el estado de los archivos exportados de los últimos 15 días.
          </p>
        </div>

        <div className="shrink-0">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-4 rounded-md flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Recargar
          </button>
        </div>
      </div>

      {/* EMPTY STATE CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center mt-12 mb-12">
        <div className="bg-muted text-muted-foreground rounded-full p-4 mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-medium text-foreground mb-2">Sin archivos recientes</h2>
        <p className="text-muted-foreground text-sm">
          Aquí podrás consultar el estado de tus exportables de los últimos 7 días.
        </p>
      </div>

    </div>
  );
}
