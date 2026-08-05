"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuote } from "@/hooks/quotes/useQuotes";
import { useEffect, useState } from "react";

import { QuotesService } from "@/lib/quotes";
import { AuthService } from "@/lib/auth";

import { QuoteDetailHeader } from "@/components/quotes/details/QuoteDetailHeader";
import { QuoteDetailSummary } from "@/components/quotes/details/QuoteDetailSummary";
import { QuoteDetailDocument } from "@/components/quotes/details/QuoteDetailDocument";
import { QuoteDetailExtraInfo } from "@/components/quotes/details/QuoteDetailExtraInfo";
import { QuoteDetailSkeleton } from "@/components/quotes/details/QuoteDetailSkeleton";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { showToast } from "@/components/sonner/CustomToaster";

export default function QuoteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const enabled = typeof id === 'string' || typeof id === 'number';
    const { data, isLoading, isError, isFetching, refetch } = useQuote(enabled ? id : "");

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
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

    const quoteData = data?.data?.quotation || data?.data?.quote || data?.data?.bill; // Acomodando si el backend retorna `quotation`, `quote` o `bill`

    // Cambiamos el title del documento
    useEffect(() => {
        if (quoteData) {
            const pdfName = `Cotización No ${quoteData.prefix || ''}${quoteData.number || quoteData.id}`;
            document.title = pdfName;
        }
    }, [quoteData]);

    if (!enabled) return <div className="py-10 text-center text-red-500">ID de cotización inválido</div>;
    if (isLoading || isRefreshing) return <QuoteDetailSkeleton />;
    if (isError || !data || !data.data) return <div className="py-10 text-center text-red-500">No se pudo cargar la cotización</div>;

    if (!quoteData) return <div className="py-10 text-center text-red-500">No se pudo cargar la cotización</div>;

    const quote = quoteData;

    // Leer company guardada en localStorage al iniciar sesión
    const storedCompany = AuthService.getCompany<any>();

    const templateData = quote.invoice_snapshot?.template_data || {};
    const snapshotQuote = templateData.quote || templateData.invoice || {};
    const customer = data.data?.customer || templateData.contact_snapshot || quote.contact || templateData.customer || {};
    const items = data.data?.items || snapshotQuote.lines || quote.lines || quote.quote_lines || [];
    const invoices = (data.data as any)?.invoices || quote.invoices || quote.bills || [];
    // Merge company data: prefer API response but fill missing fields from localStorage
    const apiCompany = data.data?.company || templateData.supplier_snapshot || quote?.company || templateData.supplier || {};
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
            const blob = await QuotesService.printPdfBlob(quote.id);
            const pdfName = `Cotización No. ${quote.prefix || ''}${quote.number || quote.id}`;
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
            const blob = await QuotesService.downloadPdfBlob(quote.id);
            const pdfName = `Cotización No. ${quote.prefix || ''}${quote.number || quote.id}.pdf`;
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
            <QuoteDetailHeader
                quote={quote}
                canEdit={canEdit}
                handlePrint={handlePrint}
                handleDownloadPdf={handleDownloadPdf}
                isPrinting={isPrinting}
                isDownloadingPdf={isDownloadingPdf}
            />

            <QuoteDetailSummary quote={quote} />

            <QuoteDetailDocument
                quote={quote}
                company={company}
                customer={customer}
                items={items}
            />

            <QuoteDetailExtraInfo quote={quote} invoices={invoices} />

            <CommentsAndReminders comments={comments} setComments={setComments} />
        </div>
    );
}
