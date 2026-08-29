"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { BillsService } from "@/lib/bills";
import { showToast } from "@/components/sonner/CustomToaster";

interface ExportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
    const [exportType, setExportType] = useState<string>("general");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const params: Record<string, any> = {
                type: exportType,
                start_date: startDate ? startDate.toISOString().split("T")[0] : undefined,
                end_date: endDate ? endDate.toISOString().split("T")[0] : undefined,
            };
            const blob = await BillsService.exportExcel(params);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Facturas_Compra_${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            showToast("Reporte exportado exitosamente", "success");
            onOpenChange(false);
        } catch (error: any) {
            showToast(error?.message || "Error al exportar las facturas de compra", "error");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-6 bg-white rounded-2xl shadow-2xl border border-border">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-base font-bold text-foreground">
                        Exportar facturas de compra
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                            Tipo de reporte
                        </label>
                        <Select value={exportType} onValueChange={setExportType}>
                            <SelectTrigger className="w-full text-xs h-9 bg-white border border-foreground/20 rounded-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general" className="text-xs cursor-pointer">
                                    Reporte General
                                </SelectItem>
                                <SelectItem value="detailed" className="text-xs cursor-pointer">
                                    Reporte Detallado por Ítem
                                </SelectItem>
                                <SelectItem value="withholdings" className="text-xs cursor-pointer">
                                    Reporte de Retenciones
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">
                                Fecha inicial
                            </label>
                            <DatePickerSimple
                                value={startDate}
                                onChange={setStartDate}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">
                                Fecha final
                            </label>
                            <DatePickerSimple
                                value={endDate}
                                onChange={setEndDate}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 px-4 text-xs font-medium rounded-lg"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleExport}
                        disabled={isExporting}
                        className="h-9 px-4 text-xs font-medium rounded-lg bg-primary hover:bg-primary/90 text-white"
                    >
                        {isExporting ? "Exportando..." : "Exportar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
