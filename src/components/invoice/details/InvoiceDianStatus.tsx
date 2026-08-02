import { Copy, Eye, CheckCircle2, FileJson, XCircle } from "lucide-react";
import { useState } from "react";
import { showToast } from "@/components/sonner/CustomToaster";
import { InvoicesService } from "@/lib/invoices";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InvoiceDianStatusProps {
    bill: any;
    company: any;
    dianStatus: string;
}

export function InvoiceDianStatus({ bill, company, dianStatus }: InvoiceDianStatusProps) {
    const [showDetails, setShowDetails] = useState(false);

    const cufe = bill.cufe || bill.invoice_snapshot?.template_data?.invoice?.cufe || bill.dian_response?.cufe || "";
    const isAccepted = ["ACEPTADA", "PROCESADO CORRECTAMENTE", "APROBADA", "AUTORIZADA", "APROBADO CON OBSERVACIONES"].includes((dianStatus || '').toUpperCase());
    const isDianSuccess = isAccepted || bill?.dian_response?.response_data?.status_code === '00' || bill?.dian_response?.status_code === '00';

    const handleCopyCufe = () => {
        if (!cufe) {
            showToast("No hay CUFE disponible para copiar", "error");
            return;
        }
        navigator.clipboard.writeText(cufe);
        showToast("CUFE copiado al portapapeles", "success");
    };

    const handleViewDian = () => {
        if (!cufe) {
            showToast("No hay CUFE disponible", "error");
            return;
        }
        const envId = company?.environment_id || 2;
        const url = envId === 2
            ? `https://catalogo-vpfe-hab.dian.gov.co/User/SearchDocument?DocumentKey=${cufe}`
            : `https://catalogo-vpfe.dian.gov.co/User/SearchDocument?DocumentKey=${cufe}`;
        window.open(url, "_blank");
    };

    const handleDownloadXml = async () => {
        try {
            showToast("Descargando XML", "info");
            const blob = await InvoicesService.downloadXmlBlob(bill.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `FEV_${bill.prefix || ''}${bill.number || bill.id}.xml`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el XML:", error);
            showToast("No se pudo descargar el XML", "error");
        }
    };

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) return { date: 'N/A', time: '' };
        try {
            let date: Date;
            if (dateStr.includes('/')) {
                // Handle DD/MM/YYYY HH:mm or DD/MM/YYYY format
                const [datePart, timePart] = dateStr.split(' ');
                const [day, month, year] = datePart.split('/');
                date = new Date(`${year}-${month}-${day}T${timePart || '00:00:00'}`);
            } else {
                // Handle YYYY-MM-DD HH:mm:ss format
                const parsedStr = dateStr.replace(' ', 'T');
                date = new Date(parsedStr);
            }

            if (isNaN(date.getTime())) {
                return { date: 'N/A', time: '' };
            }

            const day = date.getDate().toString().padStart(2, '0');
            const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
            const month = months[date.getMonth()];
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return {
                date: `${day}/${month}`,
                time: `${hours}:${minutes}`
            };
        } catch {
            return { date: 'N/A', time: '' };
        }
    };

    const targetDate = bill.validated_at || bill.dian_last_checked_at || bill.submitted_to_dian_at || bill.created_at;
    const createdTime = formatDateTime(targetDate);

    return (
        <TooltipProvider>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 filter drop-shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-slate-700">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        <span className="font-medium text-base">Estado de emisión y envío a cliente</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={handleDownloadXml} className="hover:text-slate-600 transition-colors cursor-pointer">
                                    <FileJson className="w-5 h-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-[#1e2330] text-white border-0 font-semibold px-4 py-2 text-sm rounded-lg">
                                <p>Descargar XML</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={handleCopyCufe} className="hover:text-slate-600 transition-colors cursor-pointer">
                                    <Copy className="w-5 h-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-[#1e2330] text-white border-0 font-semibold px-4 py-2 text-sm rounded-lg">
                                <p>Copiar CUFE</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={handleViewDian} className="hover:text-slate-600 transition-colors cursor-pointer">
                                    <Eye className="w-5 h-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-[#1e2330] text-white border-0 font-semibold px-4 py-2 text-sm rounded-lg">
                                <p>Ver comprobante en la DIAN</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Timeline */}
                <div className="relative mb-8">
                    <div className="absolute top-3 left-[10%] right-[10%] h-0.5 bg-slate-200">
                        {/* Barra verde progresiva según estado. */}
                        <div className="absolute top-0 left-0 h-0.5 bg-[#20c997] transition-all duration-500" style={{ width: isAccepted ? '100%' : '0%' }}></div>
                    </div>
                    <div className="flex justify-between relative">
                        {/* 1. Estado DIAN */}
                        <div className="flex flex-col items-center flex-1">
                            {isDianSuccess ? (
                                <CheckCircle2 className="w-6 h-6 text-[#20c997] bg-white z-10" fill="currentColor" stroke="white" />
                            ) : (
                                <XCircle className="w-6 h-6 text-red-500 bg-white z-10" fill="currentColor" stroke="white" />
                            )}
                            <span className="text-sm text-slate-800 mt-2 font-medium">Estado DIAN</span>
                            <div className="h-4 mt-0.5"></div>
                            <span className={`text-[10px] font-bold border rounded-full px-3 py-0.5 mt-1 uppercase text-center whitespace-nowrap ${isDianSuccess ? 'text-[#20c997] border-[#20c997]' : 'text-red-500 border-red-500'}`}>
                                {bill?.dian_response?.response_data?.status_description || bill?.dian_response?.status_description || dianStatus || 'NO APROBADA'}
                            </span>
                        </div>

                        {/* 2. Envío al cliente */}
                        <div className="flex flex-col items-center flex-1">
                            {bill?.is_email_sent ? (
                                <CheckCircle2 className="w-6 h-6 bg-white z-10 text-[#20c997]" fill="currentColor" stroke="white" />
                            ) : (
                                <XCircle className="w-6 h-6 bg-white z-10 text-red-500" fill="currentColor" stroke="white" />
                            )}
                            <span className="text-sm text-slate-800 mt-2 font-medium">Envío al cliente.</span>
                            <div className="h-4 mt-0.5 w-full flex justify-center">
                                <span className="text-[10px] text-slate-400 truncate max-w-[120px]" title={bill?.contact?.email || ''}>{bill?.contact?.email || 'Sin correo'}</span>
                            </div>
                            <span className={`text-[10px] font-bold border rounded-full px-3 py-0.5 mt-1 uppercase ${bill?.is_email_sent ? 'text-[#20c997] border-[#20c997]' : 'text-red-500 border-red-500'}`}>
                                {bill?.is_email_sent ? 'ENVIADA' : 'NO ENVIADA'}
                            </span>
                        </div>

                        {/* 3. RADIAN (Condicional) */}
                        {bill?.radian?.has_events && (
                            <div className="flex flex-col items-center flex-1 text-center">
                                <CheckCircle2 className="w-6 h-6 text-[#20c997] bg-white z-10" fill="currentColor" stroke="white" />
                                <span className="text-sm text-slate-800 mt-2 font-medium">RADIAN</span>
                                <div className="h-4 mt-0.5 w-full flex justify-center">
                                </div>
                                <span className="text-[10px] font-bold border rounded-full px-3 py-0.5 mt-1 uppercase text-[#20c997] border-[#20c997]">
                                    {bill?.radian?.latest_event?.name || 'EVENTO REGISTRADO'}
                                </span>
                            </div>
                        )}

                        {/* 4. Pago */}
                        {(bill?.payments && bill.payments.length > 0) && (
                            <div className="flex flex-col items-center flex-1">
                                {(() => {
                                    const pendingAmount = Number(bill?.pending_amount || 0);
                                    const isPaid = pendingAmount <= 0 || ['Pagada', 'Cobrada'].includes(bill?.payment_status || '') || ['Pagada', 'Cobrada'].includes(bill?.status?.name || '');
                                    const hasPayments = true;
                                    const isOverdue = bill?.payment_due_date && new Date(bill.payment_due_date) < new Date() && !isPaid;

                                    let paymentStatusText = "POR PAGAR";
                                    let Icon = isOverdue ? XCircle : CheckCircle2;
                                    let colorClass = isOverdue ? "text-red-500 border-red-500" : "text-amber-500 border-amber-500";
                                    let iconColorClass = isOverdue ? "text-red-500" : "text-slate-300";

                                    if (isPaid) {
                                        paymentStatusText = "COBRADA";
                                        Icon = CheckCircle2;
                                        colorClass = "text-[#20c997] border-[#20c997]";
                                        iconColorClass = "text-[#20c997]";
                                    } else {
                                        paymentStatusText = "PAGO PARCIAL";
                                        Icon = CheckCircle2;
                                        colorClass = "text-blue-500 border-blue-500";
                                        iconColorClass = "text-blue-500";
                                    }

                                    return (
                                        <>
                                            <Icon className={`w-6 h-6 bg-white z-10 ${iconColorClass}`} fill="currentColor" stroke="white" />
                                            <span className="text-sm text-slate-800 mt-2 font-medium">Pago</span>
                                            <div className="h-4 mt-0.5 w-full flex justify-center">
                                                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                                                    {bill.payments[0].prefix || ''}{bill.payments[0].number || ''}
                                                </span>
                                            </div>
                                            <span className={`text-[10px] font-bold border rounded-full px-3 py-0.5 mt-1 uppercase ${colorClass}`}>
                                                {paymentStatusText}
                                            </span>
                                        </>
                                    );
                                })()}
                            </div>
                        )}

                        {/* 5. Proceso Finalizado */}
                        <div className="flex flex-col items-center flex-1">
                            {(() => {
                                const isCanceled = bill?.status?.name === 'Anulada' || bill?.status?.name === 'Cancelada' || bill?.invoice_status_id === 3;
                                const isFinished = bill.number && (!bill.payment_term || bill.payment_term?.name?.toLowerCase() === 'contado' || bill.payment_form?.name?.toLowerCase() === 'contado' || bill.payment_form_id === 1);
                                const invoiceStatusText = isCanceled ? 'ANULADA' : (isFinished ? 'FINALIZADO' : 'EMITIDA');
                                const statusColorClass = isCanceled ? 'text-red-500 border-red-500' : (isFinished ? 'text-[#20c997] border-[#20c997]' : 'text-slate-400 border-slate-300');
                                const statusIconClass = isCanceled ? 'text-red-500' : (isFinished ? 'text-[#20c997]' : 'text-slate-300');
                                const Icon = isCanceled ? XCircle : CheckCircle2;

                                return (
                                    <>
                                        <Icon className={`w-6 h-6 bg-white z-10 ${statusIconClass}`} fill="currentColor" stroke="white" />
                                        <span className="text-sm text-slate-800 mt-2 font-medium">Proceso finalizado.</span>
                                        <div className="h-4 mt-0.5"></div>
                                        <span className={`text-[10px] font-bold border rounded-full px-3 py-0.5 mt-1 uppercase ${statusColorClass}`}>
                                            {invoiceStatusText}
                                        </span>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {showDetails && (
                    <div className="border-t border-slate-100 pt-6 pb-4 mt-4 flex justify-between gap-4 text-sm px-2">
                        {/* Eventos DIAN */}
                        <div className="flex flex-col items-center flex-1">
                            <div className="flex gap-3 items-start justify-center w-full">
                                <div className="flex flex-col items-center shrink-0 mt-0">
                                    <span className="font-bold text-slate-800 text-xs leading-none">{createdTime.date !== 'N/A' ? createdTime.date : '-'}</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">{createdTime.time !== '' ? createdTime.time : '-'}</span>
                                </div>
                                <div className="flex-1 max-w-[200px]">
                                    {bill?.dian_response || isDianSuccess ? (
                                        <>
                                            {(bill?.dian_response?.response_data?.status_code === '00' || bill?.dian_response?.status_code === '00') && (
                                                <p className="font-medium text-slate-800 mb-1 leading-tight text-[12px]">Procesado Correctamente.</p>
                                            )}
                                            <p className="font-medium text-slate-800 mb-2 leading-tight text-[12px]">La <span className="font-bold">factura de venta No. {bill.prefix || ''}{bill.number || bill.id}</span> fue {isDianSuccess ? 'aceptada' : 'procesada'} por la <span className="font-bold">DIAN</span></p>

                                            {(bill.dian_response?.dian_message || bill.dian_rejection_reason) && (
                                                <div className="pl-3 border-l-[1.5px] border-slate-300 mt-2 relative">
                                                    <div className="absolute -left-[9px] top-0 bg-white">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-slate-600 text-[11px] ml-1 leading-tight">{bill.dian_response?.dian_message || bill.dian_rejection_reason}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="font-medium text-slate-500 mb-2 leading-tight text-[12px]">La factura aún no ha sido procesada por la DIAN.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Eventos Envío */}
                        <div className="flex flex-col items-center flex-1">
                            <div className="flex gap-3 items-start justify-center w-full">
                                <div className="flex flex-col items-center shrink-0 mt-0">
                                    <span className="font-bold text-slate-800 text-xs leading-none">{createdTime.date !== 'N/A' ? createdTime.date : '-'}</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">{createdTime.time !== '' ? createdTime.time : '-'}</span>
                                </div>
                                <div className="flex-1 max-w-[200px]">
                                    <p className="text-slate-800 text-[12px] leading-tight">
                                        {bill?.is_email_sent ? 'Factura enviada al correo del cliente.' : 'El correo no ha sido enviado aún.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Eventos RADIAN */}
                        {bill?.radian?.has_events && (
                            <div className="flex flex-col items-center flex-1">
                                <div className="flex gap-3 items-start justify-center w-full">
                                    <div className="flex flex-col items-center shrink-0 mt-0">
                                        <span className="font-bold text-slate-800 text-xs leading-none">{formatDateTime(new Date().toISOString()).date}</span>
                                        <span className="text-[10px] text-slate-400 mt-0.5">{formatDateTime(new Date().toISOString()).time}</span>
                                    </div>
                                    <div className="flex-1 max-w-[200px]">
                                        <p className="text-slate-800 text-[12px] leading-tight">Aceptación de factura.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Eventos Pago */}
                        {(bill?.payments && bill.payments.length > 0) && (
                            <div className="flex flex-col items-center flex-1">
                                <div className="flex gap-3 items-start justify-center w-full">
                                    <div className="flex flex-col items-center shrink-0 mt-0">
                                        <span className="font-bold text-slate-800 text-xs leading-none">{formatDateTime(bill.payments[0].created_at || new Date().toISOString()).date}</span>
                                        <span className="text-[10px] text-slate-400 mt-0.5">{formatDateTime(bill.payments[0].created_at || new Date().toISOString()).time}</span>
                                    </div>
                                    <div className="flex-1 max-w-[200px]">
                                        <p className="text-slate-800 text-[12px] leading-tight">
                                            Pagos registrados: {bill.payments.map((p: any) => `${p.prefix || ''}${p.number || ''}`).filter(Boolean).join(', ')}.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Eventos Proceso Finalizado */}
                        <div className="flex flex-col items-center flex-1">
                            <div className="flex gap-3 items-start justify-center w-full">
                                <div className="flex flex-col items-center shrink-0 mt-0">
                                    <span className="font-bold text-slate-800 text-xs leading-none">{createdTime.date !== 'N/A' ? createdTime.date : '-'}</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">{createdTime.time !== '' ? createdTime.time : '-'}</span>
                                </div>
                                <div className="flex-1 max-w-[200px]">
                                    <p className="text-slate-800 text-[12px] leading-tight">La factura {bill.number ? `fue emitida a ${bill.payment_term?.name || bill.payment_form?.name || 'contado'}.` : 'aún no ha sido emitida.'}</p>
                                    {bill.number && (!bill.payment_term || bill.payment_term?.name?.toLowerCase() === 'contado' || bill.payment_form?.name?.toLowerCase() === 'contado' || bill.payment_form_id === 1) && (
                                        <p className="text-slate-800 text-[12px] leading-tight mt-1">Proceso finalizado.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-t border-slate-100 mt-4 pt-4 text-center">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-[#20c997] hover:text-[#18a57a] text-[13px] font-medium transition-colors border-b border-transparent hover:border-[#18a57a]"
                    >
                        {showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
                    </button>
                </div>
            </div>
        </TooltipProvider>
    );
}
