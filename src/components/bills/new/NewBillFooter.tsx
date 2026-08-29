"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface NewBillFooterProps {
    onSave: (action?: "save" | "save_and_pay" | "save_and_new") => void;
    saving?: boolean;
    isEdit?: boolean;
}

export function NewBillFooter({
    onSave,
    saving = false,
    isEdit = false,
}: NewBillFooterProps) {
    const router = useRouter();

    return (
        <div className="sticky bottom-0 z-30 pt-6 pb-2">
            <div className="bg-white border border-border rounded-xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-3 sm:p-5">
                {/* Mobile View */}
                <div className="flex sm:hidden items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push("/expenses/bills")}
                        aria-label="Cancelar"
                        className="shrink-0 border border-border bg-white text-foreground hover:bg-muted cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </Button>

                    <Button
                        onClick={() => onSave("save")}
                        disabled={saving}
                        className="flex-1 min-w-0 px-4 py-2.5 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors truncate text-sm"
                    >
                        {saving ? "Guardando..." : (isEdit ? "Actualizar" : "Guardar")}
                    </Button>
                </div>

                {/* Tablet and Desktop View */}
                <div className="hidden sm:flex sm:flex-wrap items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/expenses/bills")}
                        disabled={saving}
                        className="px-6 py-2.5 rounded-lg font-medium border border-border bg-white text-foreground hover:bg-muted cursor-pointer transition-colors text-sm"
                    >
                        Cancelar
                    </Button>

                    {!isEdit && (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onSave("save_and_pay")}
                                disabled={saving}
                                className="px-5 py-2.5 rounded-lg font-medium border border-border bg-white text-foreground hover:bg-muted cursor-pointer transition-colors text-sm"
                            >
                                Guardar y agregar pago
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onSave("save_and_new")}
                                disabled={saving}
                                className="px-5 py-2.5 rounded-lg font-medium border border-border bg-white text-foreground hover:bg-muted cursor-pointer transition-colors text-sm"
                            >
                                Guardar y crear nueva
                            </Button>
                        </>
                    )}

                    <Button
                        type="button"
                        onClick={() => onSave("save")}
                        disabled={saving}
                        className="px-6 py-2.5 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer text-sm shadow-xs"
                    >
                        {saving ? "Guardando..." : (isEdit ? "Actualizar" : "Guardar")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
