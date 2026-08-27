"use client";

import { Loader2, X } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    loading?: boolean;
    confirmLabel?: string;
}

// Confirmación de eliminación reutilizada por lista, selección masiva y
// detalle de contacto — a propósito solo se cierra con la X o los botones
// (Cancelar/Confirmar), nunca con Escape o clic afuera, para evitar borrados
// accidentales.
export function DeleteConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    loading = false,
    confirmLabel = "Eliminar",
}: DeleteConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={(next) => !loading && onOpenChange(next)}>
            <AlertDialogContent
                className="bg-white"
                onEscapeKeyDown={(e: Event) => e.preventDefault()}
            >
                <button
                    type="button"
                    onClick={() => !loading && onOpenChange(false)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading}
                    aria-label="Cerrar"
                >
                    <X className="w-4 h-4" />
                </button>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading} className="cursor-pointer">
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => { e.preventDefault(); onConfirm(); }}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
