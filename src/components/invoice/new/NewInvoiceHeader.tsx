"use client";

export function NewInvoiceHeader() {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">
                Nueva factura de venta electrónica
            </h1>

            <div className="flex items-center gap-2">
                <button
                    className=" px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-border bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                    </svg>

                    Personalizar opciones
                </button>
            </div>
        </div>
    );
}