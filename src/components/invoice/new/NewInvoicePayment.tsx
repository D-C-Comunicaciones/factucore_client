"use client";
import { Plus } from "lucide-react";

export function NewInvoicePayment() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-lg mb-1">Pago recibido</h3>
                    <p className="text-sm text-gray-600">
                        Si te hicieron un pago asociado a esta venta puedes hacer aquí su registro.
                    </p>
                </div>
                <button className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Agregar pago
                </button>
            </div>
        </div>
    );
}
