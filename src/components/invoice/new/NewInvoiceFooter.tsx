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
    loadingGuardar,
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
        <div className="bg-white rounded-lg border border-border p-6">

            {/* TEXTO */}
            <div className="text-xs text-muted-foreground mb-4">
                Los campos marcados con{" "}
                <span className="text-destructive">*</span> son obligatorios
            </div>

            {/* BOTONES */}
            <div className="flex items-center justify-center gap-3">

                {/* CANCELAR */}
                <Button
                    variant="outline"
                    onClick={() => onNavigate("facturas-venta")}
                    className="
            px-6 py-2.5 rounded-lg font-medium
            border-border bg-background
            hover:bg-primary/10 hover:text-primary hover:border-primary/40
            transition-colors
          "
                >
                    Cancelar
                </Button>

                {/* VISTA PREVIA */}
                <Button
                    variant="outline"
                    className="
            px-6 py-2.5 rounded-lg font-medium
            border-border bg-background
            hover:bg-primary/10 hover:text-primary hover:border-primary/40
            transition-colors
          "
                >
                    Vista previa
                </Button>

                {/* GUARDAR */}
                <Button
                    variant="outline"
                    onClick={guardarHandler}
                    disabled={loadingGuardar}
                    className="
            px-6 py-2.5 rounded-lg font-medium
            border-border bg-background
            hover:bg-primary/10 hover:text-primary hover:border-primary/40
            transition-colors
          "
                >
                    {loadingGuardar ? "Guardando..." : "Guardar"}
                </Button>

                {/* EMITIR */}
                <div className="relative">
                    <Button
                        onClick={emitirHandler}
                        disabled={loadingEmitir}
                        className="
              px-6 py-2.5 rounded-lg font-medium
              bg-primary text-primary-foreground
              hover:bg-primary/90
              transition-colors
              flex items-center gap-2
            "
                    >
                        {loadingEmitir ? "Emitiendo..." : "Emitir"}
                    </Button>
                </div>

            </div>
        </div>
    );
}