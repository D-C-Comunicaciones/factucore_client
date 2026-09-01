"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NewSupportDocumentFooterProps {
    onNavigate: () => void;
    onSaveAction: (action: "SAVE" | "SEND" | "DRAFT" | "CREATE_NEW" | "SAVE_PAYMENT") => void;
    loadingGuardar?: boolean;
    isEdit?: boolean;
}

export function NewSupportDocumentFooter({
    onNavigate,
    onSaveAction,
    loadingGuardar = false,
    isEdit = false,
}: NewSupportDocumentFooterProps) {
    return (
        <div className="sticky bottom-0 z-30 pt-6">
            <div className="bg-white border border-border rounded-xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-3 sm:p-5 flex flex-wrap items-center justify-end gap-3">
                {/* Cancelar */}
                <Button
                    variant="outline"
                    onClick={onNavigate}
                    className="text-xs sm:text-sm px-4 py-2 rounded-lg font-medium border border-border bg-white text-foreground hover:bg-muted cursor-pointer transition-colors"
                >
                    Cancelar
                </Button>

                {!isEdit && (
                    <>
                        {/* Guardar y agregar pago */}
                        <Button
                            variant="outline"
                            onClick={() => onSaveAction("SAVE_PAYMENT")}
                            disabled={loadingGuardar}
                            className="text-xs sm:text-sm px-4 py-2 rounded-lg font-medium border border-border bg-white text-foreground hover:bg-muted cursor-pointer transition-colors"
                        >
                            Guardar y agregar pago
                        </Button>

                        {/* Guardar y crear nuevo */}
                        <Button
                            variant="outline"
                            onClick={() => onSaveAction("CREATE_NEW")}
                            disabled={loadingGuardar}
                            className="text-xs sm:text-sm px-4 py-2 rounded-lg font-medium border border-border bg-white text-foreground hover:bg-muted cursor-pointer transition-colors"
                        >
                            Guardar y crear nuevo
                        </Button>
                    </>
                )}

                {/* Guardar (Botón principal con dropdown) */}
                <div className="flex items-center">
                    <Button
                        onClick={() => onSaveAction("SAVE")}
                        disabled={loadingGuardar}
                        className="text-xs sm:text-sm px-5 py-2 rounded-l-lg rounded-r-none font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                        {loadingGuardar ? "Guardando..." : (isEdit ? "Actualizar" : "Guardar")}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                disabled={loadingGuardar}
                                className="px-2 py-2 rounded-r-lg rounded-l-none font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors border-l border-white/20 cursor-pointer"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white border border-border shadow-lg">
                            <DropdownMenuItem
                                onClick={() => onSaveAction("SEND")}
                                className="cursor-pointer py-2 hover:bg-muted text-xs font-medium"
                            >
                                Guardar y Emitir a la DIAN
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onSaveAction("DRAFT")}
                                className="cursor-pointer py-2 hover:bg-muted text-xs"
                            >
                                Guardar como borrador
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
