import { Copy, Eye, CheckCircle2, FileJson, XCircle } from "lucide-react";
import { useState } from "react";
import { showToast } from "@/components/sonner/CustomToaster";
import { SupportDocumentsService } from "@/lib/supportDocuments";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SupportDocumentDianStatusCardProps {
    doc: any;
}

export function SupportDocumentDianStatusCard({ doc }: SupportDocumentDianStatusCardProps) {
    const [showDetails, setShowDetails] = useState(false);

    const cuds = doc.cuds || "";
    const dianStatusName = (doc.dian_status?.name || "").toUpperCase();
    const isApproved = doc.dian_status?.id === 2 || dianStatusName === "APROBADA";

    const handleCopyCuds = () => {
        if (!cuds) {
            showToast("No hay CUDS disponible para copiar", "error");
            return;
        }
        navigator.clipboard.writeText(cuds);
        showToast("CUDS copiado al portapapeles", "success");
    };

    const handleViewDian = () => {
        if (!cuds) {
            showToast("No hay CUDS disponible", "error");
            return;
        }
        const url = `https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=${cuds}`;
        window.open(url, "_blank");
    };

    const handleDownloadXml = async () => {
        try {
            showToast("Descargando XML", "info");
            const blob = await SupportDocumentsService.downloadXmlBlob(doc.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `DS_${doc.prefix || ''}${doc.number || doc.id}.xml`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch {
            showToast("No se pudo descargar el XML", "error");
        }
    };

    const balance = Number(doc.balance ?? 0);
    const isPaid = balance <= 0.01;
    const isCancelled = String(doc.support_document_status?.code || "").toUpperCase() === "ANULADO";

    return (
        <TooltipProvider>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 filter drop-shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-slate-700">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        <span className="font-medium text-base">Estado de emisión ante la DIAN</span>
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
                                <button onClick={handleCopyCuds} className="hover:text-slate-600 transition-colors cursor-pointer">
                                    <Copy className="w-5 h-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-[#1e2330] text-white border-0 font-semibold px-4 py-2 text-sm rounded-lg">
                                <p>Copiar CUDS</p>
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
                <div className="relative mb-4">
                    <div className="overflow-x-auto">
                        <div className="relative px-1 sm:px-0">
                            <div className="absolute top-3 left-[15%] right-[15%] h-0.5 bg-slate-200">
                                <div className="absolute top-0 left-0 h-0.5 bg-[#20c997] transition-all duration-500" style={{ width: isApproved ? '100%' : '0%' }}></div>
                            </div>
                            <div className="flex justify-between relative">
                                {/* 1. Estado DIAN */}
                                <div className="flex flex-col items-center flex-1 min-w-[110px]">
                                    {isApproved ? (
                                        <CheckCircle2 className="w-6 h-6 text-[#20c997] bg-white z-10" fill="currentColor" stroke="white" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-500 bg-white z-10" fill="currentColor" stroke="white" />
                                    )}
                                    <span className="text-sm text-slate-800 mt-2 font-medium">Estado DIAN</span>
                                    <div className="h-4 mt-0.5"></div>
                                    <span
                                        className={`text-[10px] font-bold border rounded-full px-3 py-0.5 mt-1 uppercase text-center truncate max-w-[110px] ${isApproved ? 'text-[#20c997] border-[#20c997]' : 'text-red-500 border-red-500'}`}
                                        title={doc.dian_status?.name || 'NO APROBADA'}
                                    >
                                        {doc.dian_status?.name || 'NO APROBADA'}
                                    </span>
                                </div>

                                {/* 2. Pago */}
                                <div className="flex flex-col items-center flex-1 min-w-[110px]">
                                    {isPaid ? (
                                        <CheckCircle2 className="w-6 h-6 bg-white z-10 text-[#20c997]" fill="currentColor" stroke="white" />
                                    ) : (
                                        <CheckCircle2 className="w-6 h-6 bg-white z-10 text-blue-500" fill="currentColor" stroke="white" />
                                    )}
                                    <span className="text-sm text-slate-800 mt-2 font-medium">Pago</span>
                                    <div className="h-4 mt-0.5"></div>
                                    <span className={`text-[10px] font-bold border rounded-full px-3 py-0.5 mt-1 uppercase ${isPaid ? 'text-[#20c997] border-[#20c997]' : 'text-blue-500 border-blue-500'}`}>
                                        {isPaid ? 'PAGADO' : 'POR PAGAR'}
                                    </span>
                                </div>

                                {/* 3. Proceso finalizado */}
                                <div className="flex flex-col items-center flex-1 min-w-[110px]">
                                    {isCancelled ? (
                                        <XCircle className="w-6 h-6 bg-white z-10 text-red-500" fill="currentColor" stroke="white" />
                                    ) : (
                                        <CheckCircle2 className={`w-6 h-6 bg-white z-10 ${isApproved ? 'text-[#20c997]' : 'text-slate-300'}`} fill="currentColor" stroke="white" />
                                    )}
                                    <span className="text-sm text-slate-800 mt-2 font-medium">Proceso finalizado</span>
                                    <div className="h-4 mt-0.5"></div>
                                    <span className={`text-[10px] font-bold border rounded-full px-3 py-0.5 mt-1 uppercase ${isCancelled ? 'text-red-500 border-red-500' : (isApproved ? 'text-[#20c997] border-[#20c997]' : 'text-slate-400 border-slate-300')}`}>
                                        {isCancelled ? 'ANULADO' : (isApproved ? 'FINALIZADO' : 'PENDIENTE')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showDetails && (
                    <div className="border-t border-slate-100 pt-6 pb-4 mt-4 text-sm px-2">
                        <p className="text-slate-700 text-[12px] leading-tight">
                            El <span className="font-bold">documento soporte No. {doc.prefix || ''}{doc.number || doc.id}</span> fue {isApproved ? 'aprobado' : 'procesado'} por la <span className="font-bold">DIAN</span>.
                        </p>
                        {doc.dian_rejection_reason && (
                            <div className="pl-3 border-l-[1.5px] border-slate-300 mt-3">
                                <p className="text-slate-600 text-[11px] leading-tight">{doc.dian_rejection_reason}</p>
                            </div>
                        )}
                        {cuds && (
                            <p className="text-slate-400 text-[11px] mt-3 break-all">CUDS: {cuds}</p>
                        )}
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
