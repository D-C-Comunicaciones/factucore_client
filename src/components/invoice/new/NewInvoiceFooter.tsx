"use client";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewInvoiceFooter({
    showEmitirMenu,
    setShowEmitirMenu,
    onNavigate,
    emitirHandler,
    guardarHandler,
    loadingEmitir,
    loadingGuardar
}: {
    showEmitirMenu: boolean;
    setShowEmitirMenu: (v: boolean) => void;
    onNavigate: (view: string) => void;
    emitirHandler?: () => void;
    guardarHandler?: () => void;
    loadingEmitir?: boolean;
    loadingGuardar?: boolean;
}) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-xs text-gray-500 mb-4">
                Los campos marcados con <span className="text-red-500">*</span> son obligatorios
            </div>
            <div className="flex items-center justify-center gap-3">
                <Button
                    variant="outline"
                    onClick={() => onNavigate("facturas-venta")}
                    className="px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                    Cancelar
                </Button>
                <Button
                    variant="outline"
                    className="px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                    Vista previa
                </Button>
                <Button
                    variant="outline"
                    className="px-6 py-2.5 rounded-lg font-medium transition-colors"
                    onClick={guardarHandler}
                    disabled={loadingGuardar}
                >
                    {loadingGuardar ? "Guardando..." : "Guardar"}
                </Button>
                <div className="relative">
                    <Button
                        onClick={emitirHandler}
                        className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        disabled={loadingEmitir}
                    >
                        {loadingEmitir ? "Emitiendo..." : "Emitir"}
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
