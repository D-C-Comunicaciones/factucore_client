"use client";
import { Plus } from "lucide-react";

export function NewInvoicePayment() {
    return (
        <div className="bg-white rounded-lg border border-border p-6">

            <div className="flex items-start justify-between mb-4">

                <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">
                        Pago recibido
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Si te hicieron un pago asociado a esta venta puedes hacer aquí su registro.
                    </p>
                </div>

                <button
                    className="
                        text-primary font-medium
                        flex items-center gap-1
                        px-2 py-1 rounded-md
                        hover:bg-primary/10 hover:text-primary/80
                        transition-colors
                    "
                >
                    <Plus className="w-4 h-4" />
                    Agregar pago
                </button>

            </div>

        </div>
    );
}