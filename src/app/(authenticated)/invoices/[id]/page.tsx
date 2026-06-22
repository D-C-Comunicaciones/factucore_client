"use client";
import { useParams, useRouter } from "next/navigation";
import { useInvoice, useSendInvoice } from "@/hooks/invoices/useInvoices";
import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import { InvoicesService } from "@/lib/invoices";

import { InvoiceDetailHeader } from "@/components/invoice/details/InvoiceDetailHeader";
import { InvoiceDetailSummary } from "@/components/invoice/details/InvoiceDetailSummary";
import { InvoiceDetailDocument } from "@/components/invoice/details/InvoiceDetailDocument";
import { InvoiceDetailExtraInfo } from "@/components/invoice/details/InvoiceDetailExtraInfo";
import { InvoiceDetailTabs } from "@/components/invoice/details/InvoiceDetailTabs";
import { InvoiceDetailSkeleton } from "@/components/invoice/details/InvoiceDetailSkeleton";
import { NewInvoiceComments } from "@/components/invoice/new/NewInvoiceComments";
import { showToast } from "@/components/sonner/CustomToaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const enabled = typeof id === 'string' || typeof id === 'number';
    const { data, isLoading, isError } = useInvoice(enabled ? id : "");
    const sendToDian = useSendInvoice();

    const [isSending, setIsSending] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [printPdfUrl, setPrintPdfUrl] = useState<string | null>(null);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    useEffect(() => {
        if (data?.message) {
            if (data.status !== "success") {
                showToast(data.message, "error", "Error");
            }
        }
    }, [data?.message, data?.status]);

    const invoiceData = data?.data?.invoice || data?.data?.bill;
    useEffect(() => {
        if (invoiceData) {
            document.title = `Factura de venta No ${invoiceData.prefix || ''}${invoiceData.number || invoiceData.id}`;
        }
    }, [invoiceData]);

    if (!enabled) return <div className="py-10 text-center text-red-500">ID de factura inválido</div>;
    if (isLoading) return <InvoiceDetailSkeleton />;
    if (isError || !data || !data.data) return <div className="py-10 text-center text-red-500">No se pudo cargar la factura</div>;


    if (!invoiceData) return <div className="py-10 text-center text-red-500">No se pudo cargar la factura</div>;

    const bill = invoiceData;

    const templateData = bill.invoice_snapshot?.template_data || {};
    const snapshotInvoice = templateData.invoice || {};
    const customer = data.data.customer || templateData.customer || bill.contact || {};
    const items = data.data.items || snapshotInvoice.lines || bill.lines || [];
    const company = data.data.company || invoiceData?.company || templateData.supplier || {};
    const dianStatus = bill.dian_rejection_reason ? "NO APROBADA" : (data.dian?.estado_documento || '');

    const isAccepted = dianStatus.toUpperCase() === "ACEPTADA";
    const canEdit = !isAccepted;
    const canEmit = !isAccepted;

    const handleSendToDian = async () => {
        setIsSending(true);
        try {
            const res: any = await sendToDian.mutateAsync(bill.id);
            if (res?.dian?.estado_documento === "NO APROBADA" || res?.dian?.errors?.length > 0) {
                const errorMessages = res.dian.errors?.map((e: any) => e.message).join(" | ");
                showToast(`Rechazado por DIAN: ${errorMessages || res.message || "Intente más tarde"}`, "error", "Rechazado por DIAN");
            } else {
                showToast("Factura emitida correctamente a la DIAN", "success", "Éxito");
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
        }
    };

    const handlePrint = async () => {
        try {
            showToast("Preparando documento para imprimir", "info");
            const blob = await InvoicesService.printPdfBlob(bill.id);
            const url = window.URL.createObjectURL(blob) + "#toolbar=1&navpanes=1&scrollbar=1&view=FitH";
            setPrintPdfUrl(url);
            setIsPrintModalOpen(true);
        } catch (error) {
            console.error("Error al preparar impresión:", error);
            showToast("No se pudo cargar el documento para imprimir", "error");
        }
    };

    const handleDownloadPdf = async () => {
        try {
            showToast("Descargando documento", "info");
            const blob = await InvoicesService.downloadPdfBlob(bill.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Factura_${bill.prefix || ''}${bill.number || bill.id}.pdf`;
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
        <div className="max-w-[1200px] mx-auto py-8 px-4 space-y-6 text-sm text-slate-700">
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

            <InvoiceDetailDocument
                bill={bill}
                company={company}
                customer={customer}
                items={items}
                dianStatus={dianStatus}
            />

            <InvoiceDetailExtraInfo bill={bill} />

            <InvoiceDetailTabs />

            <NewInvoiceComments comments={comments} setComments={setComments} />

            <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
                <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 flex flex-col bg-white">
                    <div className="p-4 border-b flex items-center justify-between bg-white z-10">
                        <DialogTitle>Imprimir Factura</DialogTitle>
                        <button 
                            onClick={() => {
                                const iframe = document.getElementById("pdf-iframe") as HTMLIFrameElement;
                                iframe?.contentWindow?.print();
                            }}
                            className="h-9 px-4 bg-[#2b5deb] hover:bg-[#204bc2] text-white rounded-md text-sm font-medium transition-colors shadow-sm"
                        >
                            Imprimir documento
                        </button>
                    </div>
                    <div className="flex-1 w-full h-full bg-slate-100">
                        {printPdfUrl && (
                            <iframe
                                id="pdf-iframe"
                                src={printPdfUrl}
                                className="w-full h-full border-0"
                                title="Imprimir PDF"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
