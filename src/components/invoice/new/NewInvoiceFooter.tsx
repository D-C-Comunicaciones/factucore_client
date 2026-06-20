import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NewInvoiceFooter({
    onNavigate,
    guardarHandler,
    loadingGuardar,
}: {
    onNavigate: (view: string) => void;
    guardarHandler?: () => void;
    loadingGuardar?: boolean;
}) {
    return (
        <div className="p-6">
            {/* BOTONES */}
            <div className="flex items-center justify-end gap-3">
                {/* CANCELAR */}
                <Button
                    variant="outline"
                    onClick={() => onNavigate("facturas-venta")}
                    className="
                        px-6 py-2.5 rounded-lg font-medium
                        border border-border bg-white text-foreground
                        hover:bg-muted hover:border-border cursor-pointer transition-colors
                    "
                >
                    Cancelar
                </Button>

                {/* VISTA PREVIA */}
                <Button
                    variant="outline"
                    className="
                        px-6 py-2.5 rounded-lg font-medium
                        border border-border bg-white text-foreground
                        hover:bg-muted hover:border-border cursor-pointer transition-colors
                    "
                >
                    Vista previa
                </Button>

                {/* GUARDAR Y CREAR NUEVA */}
                <Button
                    variant="outline"
                    className="
                        px-6 py-2.5 rounded-lg font-medium
                        border border-border bg-white text-foreground
                        hover:bg-muted hover:border-border cursor-pointer transition-colors
                    "
                >
                    Guardar y crear nueva
                </Button>

                {/* GUARDAR SPLIT BUTTON */}
                <div className="flex">
                    <Button
                        onClick={guardarHandler}
                        disabled={loadingGuardar}
                        className="
                            px-6 py-2.5 rounded-r-none font-medium
                            bg-primary text-primary-foreground
                            hover:bg-primary/90 transition-colors
                        "
                    >
                        {loadingGuardar ? "Guardando..." : "Guardar y Emitir"}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                disabled={loadingGuardar}
                                className="
                                    px-2 py-2.5 rounded-l-none font-medium
                                    bg-primary text-primary-foreground
                                    hover:bg-primary/90 transition-colors
                                    border-l border-white/20
                                "
                            >
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white border border-border shadow-lg">
                            <DropdownMenuItem className="cursor-pointer py-2 hover:bg-muted focus:bg-muted">
                                Guardar como borrador
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer py-2 hover:bg-muted focus:bg-muted">
                                Guardar e imprimir
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer py-2 hover:bg-muted focus:bg-muted">
                                Guardar y enviar por correo
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}