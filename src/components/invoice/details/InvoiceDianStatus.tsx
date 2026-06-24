import { Copy, Eye, CheckCircle2, FileJson } from "lucide-react";
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
            a.download = `Factura_${bill.prefix || ''}${bill.number || bill.id}.xml`;
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
            const date = new Date(dateStr);
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

    const createdTime = formatDateTime(bill.created_at);

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
                                <button onClick={handleDownloadXml} className="hover:text-slate-600 transition-colors">
                                    <FileJson className="w-5 h-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-[#1e2330] text-white border-0 font-semibold px-4 py-2 text-sm rounded-lg">
                                <p>Descargar XML</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={handleCopyCufe} className="hover:text-slate-600 transition-colors">
                                    <Copy className="w-5 h-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-[#1e2330] text-white border-0 font-semibold px-4 py-2 text-sm rounded-lg">
                                <p>Copiar CUFE</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={handleViewDian} className="hover:text-slate-600 transition-colors">
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
                    <div className="absolute top-3 left-[25%] right-[25%] h-0.5 bg-[#20c997]"></div>
                    <div className="flex justify-around relative">
                        <div className="flex flex-col items-center">
                            <CheckCircle2 className="w-6 h-6 text-[#20c997] bg-white z-10" fill="currentColor" stroke="white" />
                            <span className="text-sm text-slate-800 mt-2 font-medium">Estado DIAN</span>
                            <span className="text-[10px] font-bold text-amber-500 border border-amber-500 rounded-full px-3 py-0.5 mt-1 uppercase">
                                {dianStatus || 'NO APROBADA'}
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <CheckCircle2 className={`w-6 h-6 bg-white z-10 ${isAccepted ? 'text-[#20c997]' : 'text-slate-300'}`} fill="currentColor" stroke="white" />
                            <span className="text-sm text-slate-800 mt-2 font-medium">Estado de factura</span>
                            <span className={`text-[10px] font-bold border rounded-full px-3 py-0.5 mt-1 uppercase ${isAccepted ? 'text-[#20c997] border-[#20c997]' : 'text-slate-400 border-slate-300'}`}>
                                {isAccepted ? 'FINALIZADA' : 'PENDIENTE'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Expandable Details */}
                {showDetails && (
                    <div className="border-t border-slate-100 pt-6 pb-4 mt-4 grid grid-cols-2 gap-8 text-sm">
                        {/* Eventos DIAN */}
                        <div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center shrink-0 mt-1">
                                    <span className="font-bold text-slate-800 text-xs">{createdTime.date}</span>
                                    <span className="text-[10px] text-slate-400">{createdTime.time}</span>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800 mb-2">La <span className="font-bold">factura de venta No. {bill.prefix || ''}{bill.number || bill.id}</span> fue {isAccepted ? 'aceptada' : 'procesada'} por la <span className="font-bold">DIAN</span></p>
                                    
                                    {(bill.dian_response?.dian_message || bill.dian_rejection_reason) && (
                                        <div className="pl-4 border-l-[1.5px] border-slate-300 mt-2 relative">
                                            <div className="absolute -left-[9px] top-1 bg-white">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                            </div>
                                            <p className="text-slate-600 text-[13px] ml-2">{bill.dian_response?.dian_message || bill.dian_rejection_reason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Eventos Factura */}
                        <div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center shrink-0 mt-1">
                                    <span className="font-bold text-slate-800 text-xs">{createdTime.date}</span>
                                    <span className="text-[10px] text-slate-400">{createdTime.time}</span>
                                </div>
                                <div>
                                    <p className="text-slate-800 text-[13px]">La factura fue emitida a {bill.payment_term?.name || 'contado'}.</p>
                                    <p className="text-slate-800 text-[13px]">Proceso finalizado.</p>
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
