import { Clock, Download, ExternalLink, Link2, Mail, Paperclip } from "lucide-react";

interface QuoteDetailExtraInfoProps {
    quote: any;
}

export function QuoteDetailExtraInfo({ quote }: QuoteDetailExtraInfoProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                Historial y Enlaces
            </h3>
            <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                    <h4 className="font-semibold text-slate-700 mb-3">Auditoría</h4>
                    <div className="space-y-3">
                        <div className="flex flex-col">
                            <span className="text-slate-500">Creado por</span>
                            <span className="font-medium text-slate-800">{quote.user?.name || "Administrador"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-500">Fecha de creación</span>
                            <span className="font-medium text-slate-800">{quote.created_at || "—"}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-slate-700 mb-3">Archivos Adjuntos</h4>
                    {quote.attachments && quote.attachments.length > 0 ? (
                        <div className="space-y-2">
                            {quote.attachments.map((file: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={file.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 border border-slate-100 transition-colors group"
                                >
                                    <Paperclip className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                                    <span className="text-slate-700 group-hover:text-primary flex-1 truncate">{file.name || 'Archivo adjunto'}</span>
                                    <Download className="w-4 h-4 text-slate-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-slate-500 flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-100 border-dashed">
                            <Paperclip className="w-4 h-4" /> No hay archivos adjuntos
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
