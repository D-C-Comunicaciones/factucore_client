"use client";
import { useParams, useRouter } from "next/navigation";
import { useRemission } from "@/hooks/remissions/useRemissions";
import { useEffect, useState } from "react";

import { RemissionsService } from "@/lib/remissions";
import { AuthService } from "@/lib/auth";

import { RemissionDetailHeader } from "@/components/remission/details/RemissionDetailHeader";
import { RemissionDetailSummary } from "@/components/remission/details/RemissionDetailSummary";
import { RemissionDetailDocument } from "@/components/remission/details/RemissionDetailDocument";
import { RemissionDetailExtraInfo } from "@/components/remission/details/RemissionDetailExtraInfo";
import { RemissionDetailSkeleton } from "@/components/remission/details/RemissionDetailSkeleton";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { showToast } from "@/components/sonner/CustomToaster";

export default function RemissionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const enabled = typeof id === 'string' || typeof id === 'number';
    const { data, isLoading, isError, isFetching, refetch } = useRemission(enabled ? id : "");

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

    useEffect(() => {
        if (!isFetching && isRefreshing) {
            setIsRefreshing(false);
        }
    }, [isFetching, isRefreshing]);

    useEffect(() => {
        if (data?.message) {
            if (data.status !== "success") {
                showToast(data.message, "error", "Error");
            }
        }
    }, [data?.message, data?.status]);

    const remissionData = data?.data?.remission; // Shape que retorna GET /remissions/{id}

    // Cambiamos el title del documento
    useEffect(() => {
        if (remissionData) {
            const pdfName = `Remisión No ${remissionData.prefix || ''}${remissionData.number || remissionData.id}`;
            document.title = pdfName;
        }
    }, [remissionData]);

    if (!enabled) return <div className="py-10 text-center text-red-500">ID de remisión inválido</div>;
    if (isLoading || isRefreshing) return <RemissionDetailSkeleton />;
    if (isError || !data || !data.data) return <div className="py-10 text-center text-red-500">No se pudo cargar la remisión</div>;

    if (!remissionData) return <div className="py-10 text-center text-red-500">No se pudo cargar la remisión</div>;

    const remission = remissionData;

    // Leer company guardada en localStorage al iniciar sesión
    const storedCompany = AuthService.getCompany<any>();

    const customer = data.data?.customer || remission.contact || {};
    const items = data.data?.items || remission.lines || remission.remission_lines || [];
    const invoices = (data.data as any)?.invoices || remission.invoices || remission.bills || [];
    // El backend devuelve la cotización de origen como un objeto único (`quotation`), no un arreglo
    const quotationSource =
        remission.quotation || remission.quotations || remission.quotes ||
        (data.data as any)?.quotation || (data.data as any)?.quotations || (data.data as any)?.quotes;
    const quotes = Array.isArray(quotationSource) ? quotationSource : (quotationSource ? [quotationSource] : []);
    // Merge company data: prefer API response but fill missing fields from localStorage
    const apiCompany = data.data?.company || remission?.company || {};
    const company = {
        ...storedCompany,
        ...apiCompany,
        // Ensure verification_digit is always available from localStorage if not in API response
        verification_digit: apiCompany?.verification_digit ?? apiCompany?.dv ?? storedCompany?.verification_digit ?? storedCompany?.dv,
    };

    const canEdit = true; // Por defecto asumimos que se puede editar si no hay bloqueo

    const handlePrint = async () => {
        try {
            setIsPrinting(true);
            const blob = await RemissionsService.printPdfBlob(remission.id);
            const pdfName = `Remisión No. ${remission.prefix || ''}${remission.number || remission.id}`;
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
                        // Volver al estado normal tan pronto aparece el diálogo de impresión
                        setIsPrinting(false);

                        // Cleanup tras cerrar el diálogo
                        const cleanup = () => {
                            document.title = originalTitle;
                            if (document.body.contains(iframe)) {
                                document.body.removeChild(iframe);
                            }
                            window.URL.revokeObjectURL(url);
                        };

                        win.onafterprint = cleanup;
                        // Fallback si onafterprint no dispara (algunos navegadores)
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
            const blob = await RemissionsService.downloadPdfBlob(remission.id);
            const pdfName = `Remisión No. ${remission.prefix || ''}${remission.number || remission.id}.pdf`;
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
            <RemissionDetailHeader
                remission={remission}
                canEdit={canEdit}
                handlePrint={handlePrint}
                handleDownloadPdf={handleDownloadPdf}
                isPrinting={isPrinting}
                isDownloadingPdf={isDownloadingPdf}
            />

            <RemissionDetailSummary remission={remission} />

            <RemissionDetailDocument
                remission={remission}
                company={company}
                customer={customer}
                items={items}
            />

            <RemissionDetailExtraInfo remission={remission} invoices={invoices} quotes={quotes} />

            <CommentsAndReminders type="remission" commentableId={enabled ? id : null} />
        </div>
    );
}
