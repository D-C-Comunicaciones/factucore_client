import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
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
        <div className="bg-white border border-border rounded-xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-3 sm:p-6">

            {/* MÓVIL — una sola fila: Cancelar + acción principal + resto en el menú,
                para no ocupar media pantalla con la barra apilada. */}
            <div className="flex sm:hidden items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onNavigate}
                    aria-label="Cancelar"
                    className="shrink-0 border border-border bg-white text-foreground hover:bg-muted cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </Button>

                <div className="flex flex-1 min-w-0">
                    <Button
                        onClick={() => onSaveAction("SEND")}
                        disabled={loadingGuardar}
                        className="flex-1 min-w-0 px-4 py-2.5 rounded-l-lg rounded-r-none font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors truncate"
                    >
                        {loadingGuardar ? "Guardando..." : "Guardar y Emitir"}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                disabled={loadingGuardar}
                                className="shrink-0 px-2 py-2.5 rounded-r-lg rounded-l-none font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors border-l border-white/20"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white border border-border shadow-lg">
                            <DropdownMenuItem onClick={onPreview} className="cursor-pointer py-2 hover:bg-muted focus:bg-muted">
                                Vista previa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSaveAction("CREATE_NEW")} className="cursor-pointer py-2 hover:bg-muted focus:bg-muted">
                                Guardar y crear nueva
                            </DropdownMenuItem>
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

            {/* sm y superior — fila completa con las 4 acciones visibles */}
            <div className="hidden sm:flex sm:flex-wrap items-center justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={onNavigate}
                    className="px-6 py-2.5 rounded-lg font-medium border border-border bg-white text-foreground hover:bg-muted hover:border-border cursor-pointer transition-colors"
                >
                    Cancelar
                </Button>

                <Button
                    variant="outline"
                    onClick={onPreview}
                    className="px-6 py-2.5 rounded-lg font-medium border border-border bg-white text-foreground hover:bg-muted hover:border-border cursor-pointer transition-colors"
                >
                    Vista previa
                </Button>

                <Button
                    variant="outline"
                    onClick={() => onSaveAction("CREATE_NEW")}
                    disabled={loadingGuardar}
                    className="px-6 py-2.5 rounded-lg font-medium border border-border bg-white text-foreground hover:bg-muted hover:border-border cursor-pointer transition-colors"
                >
                    Guardar y crear nueva
                </Button>

                <div className="flex">
                    <Button
                        onClick={() => onSaveAction("SEND")}
                        disabled={loadingGuardar}
                        className="px-6 py-2.5 rounded-l-lg rounded-r-none font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        {loadingGuardar ? "Guardando..." : "Guardar y Emitir"}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                disabled={loadingGuardar}
                                className="px-2 py-2.5 rounded-r-lg rounded-l-none font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors border-l border-white/20"
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
