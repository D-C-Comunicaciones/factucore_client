"use client";
import { useParams, useRouter } from "next/navigation";
import { useCreditNote, useSendCreditNote } from "@/hooks/returns/useReturns";
import { useDianSubmissionPolling } from "@/hooks/useDianSubmissionPolling";
import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import { CreditNotesService } from "@/lib/creditNotes";
import { AuthService } from "@/lib/auth";

import { ReturnDetailHeader } from "@/components/returns/details/ReturnDetailHeader";
import { ReturnDetailSummary } from "@/components/returns/details/ReturnDetailSummary";
import { ReturnDetailDocument } from "@/components/returns/details/ReturnDetailDocument";
import { ReturnDetailTabs } from "@/components/returns/details/ReturnDetailTabs";
import { ReturnDetailSkeleton } from "@/components/returns/details/ReturnDetailSkeleton";
import { DianSubmissionPendingCard } from "@/components/shared/DianSubmissionPendingCard";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { showToast } from "@/components/sonner/CustomToaster";

export default function ReturnDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const enabled = typeof id === "string" || typeof id === "number";
    const [pollEnabled, setPollEnabled] = useState(true);
    const { data, isLoading, isError, isFetching, refetch } = useCreditNote(enabled ? id : "", { poll: pollEnabled });
    const sendToDian = useSendCreditNote();

    const [isSending, setIsSending] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [isDownloadingXml, setIsDownloadingXml] = useState(false);

    useEffect(() => {
        if (!isFetching && isRefreshing) {
            setIsRefreshing(false);
        }
    }, [isFetching, isRefreshing]);

    useEffect(() => {
        if (data?.message && data?.status !== "success") {
            showToast(data.message, "error", "Error");
        }
    }, [data?.message, data?.status]);

    const creditNoteData = data?.data?.credit_note || data?.credit_note || data?.creditNote;

    // El envío a la DIAN es asíncrono: mientras esté QUEUED/PROCESSING seguimos
    // haciendo polling (vía useCreditNote) hasta resolver o cumplir el timeout de UI.
    const dianSubmissionStatus = creditNoteData?.dian_submission_status;
    const isSubmissionPending = dianSubmissionStatus === "QUEUED" || dianSubmissionStatus === "PROCESSING";
    const isSubmissionFailed = dianSubmissionStatus === "FAILED";
    const { timedOut: pollTimedOut, reset: resetPollTimeout } = useDianSubmissionPolling(dianSubmissionStatus);

    useEffect(() => {
        setPollEnabled(!pollTimedOut);
    }, [pollTimedOut]);

    useEffect(() => {
        if (creditNoteData) {
            const docName = `Nota Crédito No ${creditNoteData.prefix || ""}${creditNoteData.number || creditNoteData.id}`;
            document.title = docName;
        }
    }, [creditNoteData]);

    if (!enabled) return <div className="py-10 text-center text-red-500">ID de devolución inválido</div>;
    if (isLoading || isRefreshing) return <ReturnDetailSkeleton />;
    if (isError || !data) return <div className="py-10 text-center text-red-500">No se pudo cargar la devolución</div>;
    if (!creditNoteData) return <div className="py-10 text-center text-red-500">No se pudo cargar la devolución</div>;

    const creditNote = creditNoteData;

    // Obtener data de la empresa
    const storedCompany = AuthService.getCompany<any>() || {};
    const invTplData = creditNote?.invoice?.invoice_snapshot?.template_data || {};
    const apiCompany = creditNote?.company || invTplData?.supplier_snapshot || invTplData?.supplier || {};
    const company = {
        ...storedCompany,
        ...apiCompany,
        verification_digit: apiCompany?.verification_digit ?? apiCompany?.dv ?? storedCompany?.verification_digit ?? storedCompany?.dv,
    };

    // Determinar estado DIAN
    // La API devuelve dian_status_name (string) directamente o dentro de dian_status.name
    const dianStatusName: string = (
        creditNote.dian_status_name ||
        creditNote.dian_status?.name ||
        ""
    ).toUpperCase();

    // Aprobada = ya está en la DIAN → documento inmutable
    const APPROVED_STATUSES = ["APROBADA", "ACEPTADA", "PROCESADO CORRECTAMENTE", "AUTORIZADA"];
    const isApproved = APPROVED_STATUSES.includes(dianStatusName);

    // Emitir solo si NO está aprobado y no hay un envío ya en curso
    const canEmit = !isApproved && !isSubmissionPending;

    // Editar solo si NO está aprobado (no ha llegado a la DIAN exitosamente)
    const canEdit = !isApproved && !isSubmissionPending;

    // ── Enviar a DIAN ──────────────────────────────────────────────────────────
    const handleSendToDian = async () => {
        setIsSending(true);
        try {
            // El envío ahora es asíncrono: el POST solo confirma que quedó encolado
            // (HTTP 202, sin resultado final de la DIAN). El resultado real llega vía
            // polling en useCreditNote mientras dian_submission_status esté QUEUED/PROCESSING.
            const res: any = await sendToDian.mutateAsync(creditNote.id);
            showToast(res?.message || "Nota crédito creada. Estamos validándola ante la DIAN.", "success", "Éxito");
            resetPollTimeout();
            setPollEnabled(true);
        } catch (error: any) {
            const errorData = error.response?.data || error.data || error;
            const errorMsg = errorData?.message || "Error al emitir nota crédito";

            let finalMessage: any = errorMsg;
            if (errorData?.dian_errors?.length > 0) {
                finalMessage = (
                    <div className="flex flex-col">
                        <span className="mb-2">{errorMsg}:</span>
                        <div className="flex flex-col gap-1.5 pl-2 border-l-2 border-red-200">
                            {errorData.dian_errors.map((e: string, i: number) => (
                                <div key={i} className="text-[13px]">{e}</div>
                            ))}
                        </div>
                    </div>
                );
            }

            showToast(finalMessage, "error", "Rechazado por DIAN");
        } finally {
            setIsSending(false);
            setIsRefreshing(true);
            refetch();
        }
    };

    // ── Imprimir ───────────────────────────────────────────────────────────────
    const handlePrint = async () => {
        try {
            setIsPrinting(true);
            const blob = await CreditNotesService.printPdfBlob(creditNote.id);
            const docName = `Nota Crédito No. ${creditNote.prefix || ""}${creditNote.number || creditNote.id}`;
            const file = new File([blob], docName + ".pdf", { type: "application/pdf" });
            const url = window.URL.createObjectURL(file);

            const iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "none";
            iframe.src = url;

            iframe.onload = () => {
                const originalTitle = document.title;
                document.title = docName;
                const win = iframe.contentWindow;
                if (win) {
                    setTimeout(() => {
                        win.print();
                        // Volver al estado normal tan pronto aparece el diálogo
                        setIsPrinting(false);

                        const cleanup = () => {
                            document.title = originalTitle;
                            if (document.body.contains(iframe)) document.body.removeChild(iframe);
                            window.URL.revokeObjectURL(url);
                        };

                        win.onafterprint = cleanup;
                        // Fallback si onafterprint no dispara
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

    // ── Descargar PDF ─────────────────────────────────────────────────────────
    const handleDownloadPdf = async () => {
        try {
            setIsDownloadingPdf(true);
            const blob = await CreditNotesService.downloadPdfBlob(creditNote.id);
            const docName = `Nota Crédito No. ${creditNote.prefix || ""}${creditNote.number || creditNote.id}.pdf`;
            const file = new File([blob], docName, { type: "application/pdf" });
            const url = window.URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url;
            a.download = docName;
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

    // ── Descargar XML ─────────────────────────────────────────────────────────
    const handleDownloadXml = async () => {
        try {
            setIsDownloadingXml(true);
            const blob = await CreditNotesService.downloadXmlBlob(creditNote.id);
            const docName = `Nota Crédito No. ${creditNote.prefix || ""}${creditNote.number || creditNote.id}.xml`;
            const file = new File([blob], docName, { type: "application/xml" });
            const url = window.URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url;
            a.download = docName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el XML:", error);
            showToast("No se pudo descargar el XML", "error");
        } finally {
            setIsDownloadingXml(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto py-8 px-4 space-y-6 text-sm text-slate-700 relative">
            <ReturnDetailHeader
                creditNote={creditNote}
                canEdit={canEdit}
                canEmit={canEmit}
                isSending={isSending}
                handleSendToDian={handleSendToDian}
                handlePrint={handlePrint}
                handleDownloadPdf={handleDownloadPdf}
                handleDownloadXml={handleDownloadXml}
                isPrinting={isPrinting}
                isDownloadingPdf={isDownloadingPdf}
                isDownloadingXml={isDownloadingXml}
            />

            <ReturnDetailSummary creditNote={creditNote} />

            {isSubmissionPending || isSubmissionFailed ? (
                <DianSubmissionPendingCard
                    status={dianSubmissionStatus as "QUEUED" | "PROCESSING" | "FAILED"}
                    timedOut={pollTimedOut}
                    documentLabel={`la nota crédito No. ${creditNote.prefix || ''}${creditNote.number || creditNote.id}`}
                    onCheckNow={() => {
                        resetPollTimeout();
                        setPollEnabled(true);
                        refetch();
                    }}
                    onRetry={isSubmissionFailed ? handleSendToDian : undefined}
                    isRetrying={isSending}
                />
            ) : null}

            <ReturnDetailDocument
                creditNote={creditNote}
                company={company}
                dianStatus={dianStatusName}
            />

            <ReturnDetailTabs creditNote={creditNote} />

            <CommentsAndReminders type="credit_note" commentableId={enabled ? id : null} />
        </div>
    );
}
