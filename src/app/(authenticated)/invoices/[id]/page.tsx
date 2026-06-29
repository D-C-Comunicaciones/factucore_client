"use client";
import { useParams, useRouter } from "next/navigation";
import { useInvoice, useSendInvoice } from "@/hooks/invoices/useInvoices";
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
import { NewInvoiceComments } from "@/components/invoice/new/NewInvoiceComments";
import { showToast } from "@/components/sonner/CustomToaster";


export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const enabled = typeof id === 'string' || typeof id === 'number';
    const { data, isLoading, isError, isFetching } = useInvoice(enabled ? id : "");
    const sendToDian = useSendInvoice();

    const [isSending, setIsSending] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [comments, setComments] = useState<any[]>([]);

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
    const canEdit = !isAccepted;
    const canEmit = !isAccepted;

    const handleSendToDian = async () => {
        setIsSending(true);
        try {
            const res: any = await sendToDian.mutateAsync(bill.id);
            if (res?.dian?.estado_documento === "NO APROBADA") {
                const errorMessages = res.dian.errors?.map((e: any) => e.message).join(" | ");
                showToast(`Rechazado por DIAN: ${errorMessages || res.message || "Intente más tarde"}`, "error", "Rechazado por DIAN");
            } else {
                showToast("Factura validada correctamente por la DIAN", "success", "Éxito");
            }
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
        }
    };

    const handlePrint = async () => {
        try {
            showToast("Preparando documento para imprimir", "info");
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
                    win.onafterprint = () => {
                        document.title = originalTitle;
                        if (document.body.contains(iframe)) {
                            document.body.removeChild(iframe);
                        }
                        window.URL.revokeObjectURL(url);
                    };

                    setTimeout(() => {
                        win.print();

                        // Fallback cleanup just in case onafterprint doesn't fire
                        setTimeout(() => {
                            document.title = originalTitle;
                            if (document.body.contains(iframe)) {
                                document.body.removeChild(iframe);
                            }
                        }, 300000); // 5 minutos
                    }, 100);
                }
            };

            document.body.appendChild(iframe);
        } catch (error) {
            console.error("Error al preparar impresión:", error);
            showToast("No se pudo cargar el documento para imprimir", "error");
        }
    };

    const handleDownloadPdf = async () => {
        try {
            showToast("Descargando documento", "info");
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
            />

            <InvoiceDetailSummary bill={bill} />

            <InvoiceDianStatus
                bill={bill}
                company={company}
                dianStatus={dianStatus}
            />

            <InvoiceDetailDocument
                bill={bill}
                company={company}
                customer={customer}
                items={items}
                dianStatus={dianStatus}
            />

            <InvoiceDetailExtraInfo bill={bill} />

            <InvoiceDetailTabs payments={bill.payments || data.data?.payments || invoiceData?.payments || templateData?.payments || data.data?.payments_received || []} />

            <NewInvoiceComments comments={comments} setComments={setComments} />
        </div>
    );
}
