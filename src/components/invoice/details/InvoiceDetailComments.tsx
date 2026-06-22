import { MessageCircle, Bell, Search, ChevronDown, Send } from "lucide-react";

export function InvoiceDetailComments() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {/* Header Tabs */}
            <div className="flex border-b border-slate-200 px-4 pt-2 gap-2">
                <button className="px-4 py-3 border-b-2 border-primary text-slate-800 font-medium">
                    Comentarios
                </button>
                <button className="px-4 py-3 text-slate-500 hover:text-slate-700 flex items-center transition-colors">
                    Recordatorios 
                    <span className="ml-1 text-[10px] text-primary border border-primary rounded-full w-4 h-4 flex items-center justify-center">?</span>
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex justify-between items-center p-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-primary ml-2" />
                    <div className="border border-slate-200 rounded-full px-3 py-1 flex items-center gap-1 text-sm text-primary cursor-pointer hover:bg-slate-50 transition-colors">
                        Recientes <ChevronDown className="w-3 h-3" />
                    </div>
                </div>
                <div className="text-slate-400 mr-2 cursor-pointer hover:text-slate-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </div>
            </div>

            {/* Empty State */}
            <div className="py-16 flex flex-col items-center justify-center text-slate-500">
                <MessageCircle className="w-12 h-12 text-primary mb-3 stroke-[1.5]" />
                <div>Aún no hay comentarios</div>
            </div>

            {/* Input Box */}
            <div className="p-4 bg-[#f8fafc] border-t border-slate-100">
                <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                    <div className="text-slate-400 text-sm mb-1">Escribe un comentario</div>
                    <div className="text-xs text-slate-400 mb-2">Menciona con @, asigna tareas o agenda recordatorios para tu equipo</div>
                    
                    <div className="flex justify-between items-end mt-6">
                        <div className="flex gap-4 text-slate-600 font-serif font-medium text-lg">
                            <button className="hover:text-primary transition-colors">A</button>
                            <button className="hover:text-primary transition-colors">@</button>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 font-medium">0/1000</span>
                            <button className="p-2 bg-slate-200 rounded flex items-center justify-center text-white hover:bg-primary transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
