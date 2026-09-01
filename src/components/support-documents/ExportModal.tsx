"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { exportByDateRange } from "@/lib/dateRangeExport";
import { showToast } from "@/components/sonner/CustomToaster";

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
    const today = new Date();
    const [startDate, setStartDate] = useState<Date | undefined>(today);
    const [endDate, setEndDate] = useState<Date | undefined>(today);
    const [loading, setLoading] = useState(false);

    const handleExport = async (exportAll = false) => {
        setLoading(true);
        try {
            const from = exportAll
                ? "2000-01-01"
                : (startDate ? startDate.toISOString().split("T")[0] : "2000-01-01");
            const to = exportAll
                ? "2099-12-31"
                : (endDate ? endDate.toISOString().split("T")[0] : "2099-12-31");

            const result = await exportByDateRange(
                "/support-documents/export",
                from,
                to,
                `DocumentosSoporte_${from}_${to}.xlsx`
            );

            if (result.downloaded) {
                showToast("Documentos soporte exportados exitosamente", "success");
                onClose();
            } else {
                showToast(result.message || "No se encontraron registros para exportar", "info");
            }
        } catch {
            showToast("Error al exportar los documentos soporte", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent
                hideClose={true}
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="sm:max-w-md p-6 bg-white rounded-2xl border border-border shadow-xl focus:outline-none"
            >
                {/* Header with single X button */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                    <DialogTitle className="text-base font-bold text-slate-900">
                        Exportar documentos soporte
                    </DialogTitle>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-full border border-gray-200 text-slate-500 hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
                        title="Cerrar modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">
                            Periodo a exportar
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <DatePickerSimple
                                    value={startDate}
                                    onChange={(d) => setStartDate(d)}
                                    side="top"
                                />
                            </div>
                            <span className="text-muted-foreground text-xs font-medium">-</span>
                            <div className="flex-1">
                                <DatePickerSimple
                                    value={endDate}
                                    onChange={(d) => setEndDate(d)}
                                    side="top"
                                    align="end"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleExport(true)}
                        disabled={loading}
                        className="text-xs px-4 h-9 rounded-lg bg-white border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                        Exportar todo
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleExport(false)}
                        disabled={loading}
                        className="text-xs px-5 h-9 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium shadow-sm transition-colors cursor-pointer"
                    >
                        {loading ? "Exportando..." : "Exportar"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
