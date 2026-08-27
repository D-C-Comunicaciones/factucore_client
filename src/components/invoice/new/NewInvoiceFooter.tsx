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
    onSaveAction,
    loadingGuardar,
    onPreview,
}: {
    onNavigate: () => void;
    onSaveAction: (action: "DRAFT" | "SEND" | "SEND_EMAIL" | "PRINT" | "CREATE_NEW") => void;
    loadingGuardar?: boolean;
    onPreview?: () => void;
}) {
    return (
        <div className="sticky bottom-0 z-30 pt-6">
        <div className="bg-white border border-border rounded-xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-6">
            {/* BOTONES */}
            <div className="flex items-center justify-end gap-3">
                {/* CANCELAR */}
                <Button
                    variant="outline"
                    onClick={onNavigate}
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
                    onClick={onPreview}
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
                    onClick={() => onSaveAction("CREATE_NEW")}
                    disabled={loadingGuardar}
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
                        onClick={() => onSaveAction("SEND")}
                        disabled={loadingGuardar}
                        className="
                            px-6 py-2.5 rounded-l-lg rounded-r-none font-medium
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
                                    px-2 py-2.5 rounded-r-lg rounded-l-none font-medium
                                    bg-primary text-primary-foreground
                                    hover:bg-primary/90 transition-colors
                                    border-l border-white/20
                                "
                            >
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white border border-border shadow-lg">
                            <DropdownMenuItem onClick={() => onSaveAction("DRAFT")} className="cursor-pointer py-2 hover:bg-muted focus:bg-muted">
                                Guardar como borrador
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSaveAction("PRINT")} className="cursor-pointer py-2 hover:bg-muted focus:bg-muted">
                                Guardar e imprimir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSaveAction("SEND_EMAIL")} className="cursor-pointer py-2 hover:bg-muted focus:bg-muted">
                                Guardar y enviar por correo
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
        </div>
    );
}