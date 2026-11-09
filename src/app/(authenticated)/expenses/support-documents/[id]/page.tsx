"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SupportDocumentDetailHeader } from "@/components/support-documents/details/SupportDocumentDetailHeader";
import { SupportDocumentDetailSummary } from "@/components/support-documents/details/SupportDocumentDetailSummary";
import { SupportDocumentDianStatusCard } from "@/components/support-documents/details/SupportDocumentDianStatusCard";
import { SupportDocumentDetailDocument } from "@/components/support-documents/details/SupportDocumentDetailDocument";
import { SupportDocumentDetailTabs } from "@/components/support-documents/details/SupportDocumentDetailTabs";
import { SupportDocumentDetailSkeleton } from "@/components/support-documents/details/SupportDocumentDetailSkeleton";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { useSupportDocument, useSendExistingTestSupportDocument } from "@/hooks/supportDocuments/useSupportDocuments";
import { SupportDocumentsService } from "@/lib/supportDocuments";
import { AuthService } from "@/lib/auth";
import { showToast } from "@/components/sonner/CustomToaster";

export default function SupportDocumentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = params?.id as string;
    const initialTab = searchParams?.get("tab") || undefined;

    const { data, isLoading, isError, refetch } = useSupportDocument(id);
    const sendMutation = useSendExistingTestSupportDocument();

    const [isSending, setIsSending] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

    const doc: any = data?.support_document || null;

    useEffect(() => {
        if (doc) {
            document.title = `Documento soporte No ${doc.prefix || ''}${doc.number || doc.id}`;
        }
    }, [doc]);

    if (isLoading) {
        return <SupportDocumentDetailSkeleton />;
    }

    if (isError || !doc) {
        return <div className="py-10 text-center text-red-500">No se pudo cargar el documento soporte</div>;
    }

    const company = AuthService.getCompany<any>();

    const statusCode = String(doc.support_document_status?.code || "").toUpperCase();
    const isApproved = doc.dian_status?.id === 2;
    const canEdit = (statusCode === "BORRADOR" || statusCode === "GUARDADO") && !isApproved;
    const canSend = statusCode !== "ANULADO" && !isApproved;
    const canCancel = (statusCode === "BORRADOR" || statusCode === "GUARDADO") && !isApproved;

    const handleSendToDian = async () => {
        setIsSending(true);
        try {
            const result = await sendMutation.mutateAsync(id);
            showToast(result.message || "Documento enviado en habilitación a la DIAN", "success", "Éxito");
        } catch (error: any) {
            showToast(error?.message || "Error al enviar a la DIAN", "error", "Error");
        } finally {
            setIsSending(false);
            refetch();
        }
    };

    const handlePrint = async () => {
        try {
            setIsPrinting(true);
            const blob = await SupportDocumentsService.printPdfBlob(id);
            const pdfName = `Documento soporte No. ${doc.prefix || ''}${doc.number || doc.id}`;
            const file = new File([blob], pdfName + ".pdf", { type: 'application/pdf' });
            const url = window.URL.createObjectURL(file);

            const iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "none";
            iframe.src = url;

            iframe.onload = () => {
                const originalTitle = document.title;
                document.title = pdfName;

                const win = iframe.contentWindow;
                if (win) {
                    setTimeout(() => {
                        win.print();
                        setIsPrinting(false);

                        const cleanup = () => {
                            document.title = originalTitle;
                            if (document.body.contains(iframe)) {
                                document.body.removeChild(iframe);
                            }
                            window.URL.revokeObjectURL(url);
                        };

                        win.onafterprint = cleanup;
                        setTimeout(cleanup, 120000);
                    }, 100);
                }
            };

            document.body.appendChild(iframe);
        } catch (error) {
            console.error("Error al preparar impresión:", error);
            showToast("No se pudo cargar el documento para imprimir", "error");
            setIsPrinting(false);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            setIsDownloadingPdf(true);
            const blob = await SupportDocumentsService.downloadPdfBlob(id);
            const pdfName = `Documento soporte No. ${doc.prefix || ''}${doc.number || doc.id}.pdf`;
            const file = new File([blob], pdfName, { type: 'application/pdf' });
            const url = window.URL.createObjectURL(file);

            const a = document.createElement("a");
            a.href = url;
            a.download = pdfName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el PDF:", error);
            showToast("No se pudo descargar el PDF", "error");
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto py-8 px-4 space-y-6 text-sm text-slate-700 relative">
            <SupportDocumentDetailHeader
                doc={doc}
                canEdit={canEdit}
                canSend={canSend}
                canCancel={canCancel}
                isSending={isSending}
                handleSendToDian={handleSendToDian}
                handlePrint={handlePrint}
                handleDownloadPdf={handleDownloadPdf}
                isPrinting={isPrinting}
                isDownloadingPdf={isDownloadingPdf}
            />

            <SupportDocumentDetailSummary doc={doc} />

            <SupportDocumentDianStatusCard doc={doc} />

            <SupportDocumentDetailDocument doc={doc} company={company} />

            <SupportDocumentDetailTabs doc={doc} initialTab={initialTab} />

            <CommentsAndReminders type="support_document" commentableId={Number(id)} />
        </div>
    );
}
