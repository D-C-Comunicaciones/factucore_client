"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AdjustmentNoteDetailHeader } from "@/components/adjustment-notes/details/AdjustmentNoteDetailHeader";
import { AdjustmentNoteDetailSummary } from "@/components/adjustment-notes/details/AdjustmentNoteDetailSummary";
import { AdjustmentNoteDetailDocument } from "@/components/adjustment-notes/details/AdjustmentNoteDetailDocument";
import { AdjustmentNoteDetailSkeleton } from "@/components/adjustment-notes/details/AdjustmentNoteDetailSkeleton";
import { Button } from "@/components/ui/button";
import { useAdjustmentNote } from "@/hooks/adjustmentNotes/useAdjustmentNotes";
import { AdjustmentNotesService } from "@/lib/adjustmentNotes";
import { AuthService } from "@/lib/auth";
import { showToast } from "@/components/sonner/CustomToaster";

export default function AdjustmentNoteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const { data, isLoading, isError } = useAdjustmentNote(id);
    const note: any = data?.adjustment_note || null;

    const [isPrinting, setIsPrinting] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

    if (isLoading) {
        return <AdjustmentNoteDetailSkeleton />;
    }

    if (isError || !note) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center py-20 text-center px-4">
                <h3 className="text-base font-semibold text-foreground mb-2">No se encontró la nota de ajuste</h3>
                <Button variant="outline" size="sm" onClick={() => router.push("/expenses/adjustment-notes")}>
                    Volver a la lista
                </Button>
            </div>
        );
    }

    const company = AuthService.getCompany<any>();
    const numberStr = `${note.prefix || ""}${note.number || note.id}`;

    const handlePrint = async () => {
        try {
            setIsPrinting(true);
            const blob = await AdjustmentNotesService.printPdfBlob(id);
            const file = new File([blob], `${numberStr}.pdf`, { type: 'application/pdf' });
            const url = window.URL.createObjectURL(file);

            const iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "none";
            iframe.src = url;
            iframe.onload = () => {
                const win = iframe.contentWindow;
                if (win) {
                    setTimeout(() => {
                        win.print();
                        setIsPrinting(false);
                        const cleanup = () => {
                            if (document.body.contains(iframe)) document.body.removeChild(iframe);
                            window.URL.revokeObjectURL(url);
                        };
                        win.onafterprint = cleanup;
                        setTimeout(cleanup, 120000);
                    }, 100);
                }
            };
            document.body.appendChild(iframe);
        } catch (error) {
            console.error(error);
            showToast("No se pudo cargar el documento para imprimir", "error");
            setIsPrinting(false);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            setIsDownloadingPdf(true);
            const blob = await AdjustmentNotesService.downloadPdfBlob(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${numberStr}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            showToast("No se pudo descargar el PDF", "error");
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto py-8 px-4 space-y-6 text-sm text-slate-700 relative">
            <AdjustmentNoteDetailHeader
                note={note}
                handlePrint={handlePrint}
                handleDownloadPdf={handleDownloadPdf}
                isPrinting={isPrinting}
                isDownloadingPdf={isDownloadingPdf}
            />

            <AdjustmentNoteDetailSummary note={note} />

            {note.dian_rejection_reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                    <strong>Motivo del rechazo DIAN:</strong> {note.dian_rejection_reason}
                </div>
            )}

            <AdjustmentNoteDetailDocument note={note} company={company} />
        </div>
    );
}
