"use client";

import * as React from "react";
import { 
  FileText, 
  Download, 
  UploadCloud, 
  History, 
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ImportItemsPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen text-foreground pb-12">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pt-4">
        
        {/* BREADCRUMB / BACK */}
        <button 
          onClick={() => router.push("/items")}
          className="flex items-center text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Volver a ítems
        </button>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <div className="w-1 h-6 bg-[#1e293b] rounded-full" />
               <h1 className="text-2xl font-bold text-[#1e293b]">
                Importación de ítems
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-3">
              Sube la información de nuevos productos o servicios desde un archivo de Excel.{" "}
              <a href="#" className="text-teal-600 hover:underline inline-flex items-center gap-1">
                Saber más
              </a>
            </p>
          </div>
          <Button variant="outline" size="sm" className="bg-white border-gray-200 text-[#1e293b] rounded-xl h-9 px-4">
            <History className="w-4 h-4 mr-2" />
            Ver historial
          </Button>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_2fr] gap-0">
            
            {/* LEFT COLUMN: RECOMENDACIONES */}
            <div className="p-8 md:p-12 border-r border-gray-50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                  <FileText className="w-5 h-5 text-[#1e293b]" />
                </div>
                <h3 className="font-bold text-[#1e293b]">Recomendaciones</h3>
              </div>

              <ul className="space-y-6">
                <li className="flex items-start gap-3 text-sm text-[#475569] leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0" />
                  <span>
                    Puedes importar <strong className="text-[#1e293b]">3.000 productos</strong> por archivo y repetir el proceso las veces que necesites.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#475569] leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0" />
                  <span>
                    Ten en cuenta incluir las columnas <strong className="text-[#1e293b]">"Nombre"</strong> y <strong className="text-[#1e293b]">"Precio de venta"</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#475569] leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0" />
                  <span>
                    Para controlar stock puedes incluir las columnas <strong className="text-[#1e293b]">"Cantidad"</strong> y <strong className="text-[#1e293b]">"Costo inicial"</strong>.
                  </span>
                </li>
              </ul>
            </div>

            {/* RIGHT COLUMN: STEPS */}
            <div className="p-8 md:p-12 space-y-12">
              
              {/* STEP 1 */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#1e293b]">
                  1. Descarga la plantilla de importación
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Descárgala y agrega tu información. Por favor, no alteres el orden o elimines columnas.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full bg-white border-gray-200 py-6 text-[#1e293b] hover:bg-gray-50 rounded-xl transition-all shadow-sm"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Descargar plantilla
                </Button>
              </div>

              {/* STEP 2 */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#1e293b]">
                  2. Sube tus productos o servicios
                </h3>
                
                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-[#f8fafc]/50 hover:bg-[#f1f5f9] transition-all cursor-pointer group min-h-[240px]">
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                  <h4 className="text-[15px] font-bold text-[#1e293b] text-center mb-1">
                    Selecciona o arrastra el archivo de tus nuevos productos
                  </h4>
                  <p className="text-xs text-muted-foreground text-center mb-8">
                    El formato de tu archivo debe ser .xlsx
                  </p>

                  <Button variant="outline" className="bg-white border-gray-200 text-[#1e293b] rounded-xl px-8 hover:bg-gray-50 shadow-sm">
                    O selecciona tu archivo
                  </Button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
