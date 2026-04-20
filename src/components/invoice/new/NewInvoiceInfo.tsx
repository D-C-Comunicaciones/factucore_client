"use client";
import { Info } from "lucide-react";

export function NewInvoiceInfo() {
    return (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-gray-700">
                Guarda primero para poder agregar comentarios.
            </p>
        </div>
    );
}
