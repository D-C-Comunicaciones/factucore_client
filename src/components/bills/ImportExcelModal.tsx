"use client";

import React, { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileSpreadsheet, Download, X } from "lucide-react";
import { BillsService } from "@/lib/bills";
import { showToast } from "@/components/sonner/CustomToaster";

interface ImportExcelModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function ImportExcelModal({
    open,
    onOpenChange,
    onSuccess,
}: ImportExcelModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            if (
                selected.name.endsWith(".xlsx") ||
                selected.name.endsWith(".xls") ||
                selected.name.endsWith(".csv")
            ) {
                setFile(selected);
            } else {
                showToast("Por favor selecciona un archivo Excel (.xlsx, .xls) o .csv", "warning");
            }
        }
    };

    const handleImport = async () => {
        if (!file) {
            showToast("Por favor adjunta un archivo", "warning");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            await BillsService.importFromExcel(formData);
            showToast("Facturas de compra importadas exitosamente", "success");
            onSuccess?.();
            onOpenChange(false);
            setFile(null);
        } catch (error: any) {
            showToast(error?.response?.data?.message || error?.message || "Error al importar el archivo", "error");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[460px] p-6 bg-white rounded-2xl shadow-2xl border border-border">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-base font-bold text-foreground">
                        Importar facturas de compra desde Excel
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Carga tu archivo con el listado de facturas de compra para importarlas al sistema.
                    </p>

                    {/* Template download link */}
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border text-xs">
                        <div className="flex items-center gap-2 text-foreground font-medium">
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                            <span>Plantilla de importación</span>
                        </div>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                showToast("Descargando plantilla...", "info");
                            }}
                            className="text-primary hover:underline font-semibold flex items-center gap-1"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Descargar plantilla
                        </a>
                    </div>

                    {/* Dropzone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-muted/5 flex flex-col items-center justify-center gap-2"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <UploadCloud className="w-8 h-8 text-primary/70" />
                        <span className="text-xs font-semibold text-foreground">
                            {file ? file.name : "Selecciona o arrastra tu archivo Excel"}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            Formatos soportados: .xlsx, .xls, .csv (máx. 10 MB)
                        </span>
                    </div>

                    {file && (
                        <div className="flex items-center justify-between p-2.5 bg-primary/5 rounded-lg border border-primary/20 text-xs">
                            <span className="font-medium text-foreground truncate max-w-[320px]">
                                {file.name}
                            </span>
                            <button
                                type="button"
                                onClick={() => setFile(null)}
                                className="text-muted-foreground hover:text-destructive p-1"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setFile(null);
                            onOpenChange(false);
                        }}
                        className="h-9 px-4 text-xs font-medium rounded-lg"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleImport}
                        disabled={!file || isUploading}
                        className="h-9 px-4 text-xs font-medium rounded-lg bg-primary hover:bg-primary/90 text-white"
                    >
                        {isUploading ? "Importando..." : "Importar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
