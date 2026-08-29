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
import { Sparkles, UploadCloud, X } from "lucide-react";
import { BillsService } from "@/lib/bills";
import { showToast } from "@/components/sonner/CustomToaster";

interface UploadBillFileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (parsedData?: any) => void;
}

export function UploadBillFileModal({
    open,
    onOpenChange,
    onSuccess,
}: UploadBillFileModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            const ext = selected.name.split(".").pop()?.toLowerCase();
            if (["png", "jpg", "jpeg", "pdf"].includes(ext || "")) {
                setFile(selected);
            } else {
                showToast("Por favor sube un archivo en formato .png, .jpg o .pdf", "warning");
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            showToast("Por favor selecciona un archivo o imagen", "warning");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await BillsService.uploadBillFile(formData);
            showToast("Archivo procesado correctamente", "success");
            onSuccess?.(res?.data);
            onOpenChange(false);
            setFile(null);
        } catch (error: any) {
            showToast(error?.response?.data?.message || error?.message || "Error al procesar el archivo", "error");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[460px] p-6 bg-white rounded-2xl shadow-2xl border border-border">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Crear factura desde archivo o imagen</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Sube una foto o PDF de la factura emitida por tu proveedor para autocompletar la información.
                    </p>

                    {/* Dropzone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-muted/5 flex flex-col items-center justify-center gap-2.5"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".png, .jpg, .jpeg, .pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                            {file ? file.name : "Registra tu compra con un archivo"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Arrastralo aquí en formato .png, .jpg o .pdf (máx. 6 MB)
                        </span>
                        <span className="text-xs text-primary font-medium hover:underline mt-1">
                            O haz clic para seleccionarlo
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
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className="h-9 px-4 text-xs font-medium rounded-lg bg-primary hover:bg-primary/90 text-white"
                    >
                        {isUploading ? "Procesando..." : "Cargar y procesar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
