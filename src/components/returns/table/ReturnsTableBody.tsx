"use client";

import * as React from "react";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReturnsTableBodyProps {
  loading?: boolean;
}

export function ReturnsTableBody({ loading = false }: ReturnsTableBodyProps) {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 bg-white">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="w-14 h-14 flex items-center justify-center mb-4">
          <FileText className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
        </div>
        <div className="max-w-[480px] text-center text-base font-semibold leading-tight text-slate-800 mb-1.5">
          Aun no has creado devoluciones
        </div>
        <div className="text-xs text-gray-500 mb-5 font-normal">
          Crea una devolución para empezar a registrar tus devoluciones en ventas
        </div>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
          onClick={() => router.push("/returns/new")}
        >
          Nueva devolución
        </button>
      </div>
    </div>
  );
}
