"use client";

import * as React from "react";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ItemAttachments() {
    return (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 flex flex-col h-full">
            <p className="text-[17px] font-bold text-slate-800 mb-6">Archivos adjuntos</p>
            <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer group">
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                    <CloudUpload className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors stroke-[1.5]" />
                </div>
                <p className="text-[15px] font-bold text-slate-700 mb-1">
                    Adjuntar archivo
                </p>
                <p className="text-[13px] font-medium text-slate-500 mb-4">
                    Tamaño máximo 10MB
                </p>
                <Button
                    variant="outline"
                    className="h-9 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-primary/30 font-semibold text-[13px] shadow-sm px-5 transition-colors duration-200"
                >
                    Adjuntar archivo
                </Button>
            </div>
        </div>
    );
}