"use client";
import { useParams, useRouter } from "next/navigation";
import { useInvoice, useSendInvoice } from "@/hooks/invoices/useInvoices";
import { useDianSubmissionPolling } from "@/hooks/useDianSubmissionPolling";
import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import { InvoicesService } from "@/lib/invoices";
import { AuthService } from "@/lib/auth";

import { InvoiceDetailHeader } from "@/components/invoice/details/InvoiceDetailHeader";
import { InvoiceDetailSummary } from "@/components/invoice/details/InvoiceDetailSummary";
import { InvoiceDetailDocument } from "@/components/invoice/details/InvoiceDetailDocument";
import { InvoiceDetailExtraInfo } from "@/components/invoice/details/InvoiceDetailExtraInfo";
import { InvoiceDetailTabs } from "@/components/invoice/details/InvoiceDetailTabs";
import { InvoiceDetailSkeleton } from "@/components/invoice/details/InvoiceDetailSkeleton";
import { InvoiceDianStatus } from "@/components/invoice/details/InvoiceDianStatus";
import { DianSubmissionPendingCard } from "@/components/shared/DianSubmissionPendingCard";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { showToast } from "@/components/sonner/CustomToaster";


export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const enabled = typeof id === 'string' || typeof id === 'number';
    const [pollEnabled, setPollEnabled] = useState(true);
    const { data, isLoading, isError, isFetching, refetch } = useInvoice(enabled ? id : "", { poll: pollEnabled });
    const sendToDian = useSendInvoice();

    const [isSending, setIsSending] = useState(false);
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

    const invoiceData = data?.data?.invoice || data?.data?.bill;

    // El envío a la DIAN es asíncrono: mientras el documento esté QUEUED/PROCESSING,
    // seguimos haciendo polling (vía useInvoice) hasta que el backend resuelva el envío
    // o se cumpla el timeout de UI de ~90s.
    const dianSubmissionStatus = invoiceData?.dian_submission_status;
    const isSubmissionPending = dianSubmissionStatus === "QUEUED" || dianSubmissionStatus === "PROCESSING";
    const isSubmissionFailed = dianSubmissionStatus === "FAILED";
    const { timedOut: pollTimedOut, reset: resetPollTimeout } = useDianSubmissionPolling(dianSubmissionStatus);

    useEffect(() => {
        setPollEnabled(!pollTimedOut);
    }, [pollTimedOut]);

    // Cambiamos el title del documento
    useEffect(() => {
        if (invoiceData) {
            const pdfName = `Factura de venta No ${invoiceData.prefix || ''}${invoiceData.number || invoiceData.id}`;
            document.title = pdfName;
        }
    }, [invoiceData]);

    if (!enabled) return <div className="py-10 text-center text-red-500">ID de factura inválido</div>;
    if (isLoading || isRefreshing) return <InvoiceDetailSkeleton />;
    if (isError || !data || !data.data) return <div className="py-10 text-center text-red-500">No se pudo cargar la factura</div>;

    if (!invoiceData) return <div className="py-10 text-center text-red-500">No se pudo cargar la factura</div>;

    const bill = invoiceData;

    // Leer company guardada en localStorage al iniciar sesión (igual que en invoices/new)
    const storedCompany = AuthService.getCompany<any>();

    const templateData = bill.invoice_snapshot?.template_data || {};
    const snapshotInvoice = templateData.invoice || {};
    const customer = data.data?.customer || templateData.contact_snapshot || bill.contact || templateData.customer || {};
    const items = data.data?.items || snapshotInvoice.lines || bill.lines || [];
    // Merge company data: prefer API response but fill missing fields from localStorage
    const apiCompany = data.data?.company || templateData.supplier_snapshot || invoiceData?.company || templateData.supplier || {};
    const company = {
        ...storedCompany,
        ...apiCompany,
        // Ensure verification_digit is always available from localStorage if not in API response
        verification_digit: apiCompany?.verification_digit ?? apiCompany?.dv ?? storedCompany?.verification_digit ?? storedCompany?.dv,
    };
    const dianStatus = bill.dian_rejection_reason ? "NO APROBADA" : (bill.dian_response?.estado_documento || bill.dian_status?.name || data.dian?.estado_documento || '');

    const isAccepted = ["ACEPTADA", "PROCESADO CORRECTAMENTE", "APROBADA", "AUTORIZADA"].includes(dianStatus.toUpperCase());
    const canEdit = !isAccepted && !isSubmissionPending;
    const canEmit = !isAccepted && !isSubmissionPending;

    const handleSendToDian = async () => {
        setIsSending(true);
        try {
            // El envío ahora es asíncrono: el POST solo confirma que quedó encolado
            // (HTTP 202, sin resultado final de la DIAN). El resultado real llega vía
            // polling en useInvoice mientras dian_submission_status esté QUEUED/PROCESSING.
            const res: any = await sendToDian.mutateAsync(bill.id);
            showToast(res?.message || "Factura creada. Estamos validándola ante la DIAN.", "success", "Éxito");
            resetPollTimeout();
            setPollEnabled(true);
        } catch (error: any) {
            const errorData = error.response?.data || error.data || error;
            let errorMsg = errorData.message || "Error al emitir factura";

            const estado = errorData.dian?.estado_documento ? `[${errorData.dian.estado_documento}] ` : "";

            let finalMessage: any = errorMsg;

            if (errorData.dian && errorData.dian.errors?.length > 0) {
                finalMessage = (
                    <div className="flex flex-col">
                        <span className="mb-2">{estado}{errorMsg}:</span>
                        <div className="flex flex-col gap-1.5 pl-2 border-l-2 border-red-200">
                            {errorData.dian.errors.map((e: any, i: number) => (
                                <div key={i} className="text-[13px]">{e.message}</div>
                            ))}
                        </div>
                    </div>
                );
            } else if (errorData.dian?.mensaje_dian) {
                finalMessage = `${estado}${errorMsg}: ${errorData.dian.mensaje_dian}`;
            } else if (estado) {
                finalMessage = `${estado}${errorMsg}`;
            }

            showToast(finalMessage, "error", "Rechazado por DIAN");
        } finally {
            setIsSending(false);
            setIsRefreshing(true);
            refetch();
        }
    };

    const handlePrint = async () => {
        try {
            setIsPrinting(true);
            const blob = await InvoicesService.printPdfBlob(bill.id);
            const pdfName = `Factura de venta No. ${bill.prefix || ''}${bill.number || bill.id}`;
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
            const blob = await InvoicesService.downloadPdfBlob(bill.id);
            const pdfName = `Factura de venta No. ${bill.prefix || ''}${bill.number || bill.id}.pdf`;
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
            <InvoiceDetailHeader
                bill={bill}
                canEdit={canEdit}
                canEmit={canEmit}
                isSending={isSending}
                handleSendToDian={handleSendToDian}
                handlePrint={handlePrint}
                handleDownloadPdf={handleDownloadPdf}
                isPrinting={isPrinting}
                isDownloadingPdf={isDownloadingPdf}
            />

            <InvoiceDetailSummary bill={bill} />

            {isSubmissionPending || isSubmissionFailed ? (
                <DianSubmissionPendingCard
                    status={dianSubmissionStatus as "QUEUED" | "PROCESSING" | "FAILED"}
                    timedOut={pollTimedOut}
                    documentLabel={`la factura de venta No. ${bill.prefix || ''}${bill.number || bill.id}`}
                    onCheckNow={() => {
                        resetPollTimeout();
                        setPollEnabled(true);
                        refetch();
                    }}
                    onRetry={isSubmissionFailed ? handleSendToDian : undefined}
                    isRetrying={isSending}
                />
            ) : (
                <InvoiceDianStatus
                    bill={bill}
                    company={company}
                    dianStatus={dianStatus}
                />
            )}

            <InvoiceDetailDocument
                bill={bill}
                company={company}
                customer={customer}
                items={items}
                dianStatus={dianStatus}
            />

            <InvoiceDetailExtraInfo bill={bill} />

            <InvoiceDetailTabs
                payments={bill.payments || data.data?.payments || invoiceData?.payments || templateData?.payments || data.data?.payments_received || []}
                creditNotes={bill.credit_notes || data.data?.credit_notes || []}
                remissions={(
                    (bill.remissions && bill.remissions.length > 0)
                        ? bill.remissions
                        : (data.data?.remissions && (data.data.remissions as any[]).length > 0)
                            ? data.data.remissions
                            : bill.remission
                                ? [bill.remission]
                                : []
                )}
                quotes={bill.quotation ? [bill.quotation] : (bill.quotations || (data.data as any)?.quotations || [])}
                invoiceTotal={Number(bill.total || bill.payable_amount || 0)}
            />

            <CommentsAndReminders type="invoice" commentableId={enabled ? id : null} />
        </div>
    );
}
