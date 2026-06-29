"use client";
import { Info } from "lucide-react";

export function NewInvoiceInfo() {
    return (
        <div className="bg-primary/10 rounded-lg border border-primary/20 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-gray-700">
                Guarda primero para poder agregar comentarios.
            </p>
        </div>
    );
}
