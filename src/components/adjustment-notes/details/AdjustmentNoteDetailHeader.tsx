import { Button } from "@/components/ui/button";
import { Printer, Download, Share2 } from "lucide-react";

interface AdjustmentNoteDetailHeaderProps {
    note: any;
    handlePrint: () => void;
    handleDownloadPdf?: () => void;
    isPrinting?: boolean;
    isDownloadingPdf?: boolean;
}

export function AdjustmentNoteDetailHeader({
    note,
    handlePrint,
    handleDownloadPdf,
    isPrinting,
    isDownloadingPdf,
}: AdjustmentNoteDetailHeaderProps) {
    const defaultBtnClass = "h-9 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 cursor-pointer transition-colors shadow-sm font-medium";
    const isAnnulment = note?.type_adjustment_note?.code === "2";

    return (
        <div>
            <div className="flex items-center gap-2 flex-wrap mb-4">
                <h1 className="text-2xl font-semibold text-[#0F2843]">
                    Nota de ajuste {note?.prefix || ''}{note?.number || note?.id}
                </h1>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${isAnnulment ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {isAnnulment ? 'Anulación' : 'Corrección'}
                </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className={defaultBtnClass} onClick={handlePrint} disabled={isPrinting}>
                    <Printer className="w-4 h-4 mr-2" /> {isPrinting ? "Preparando..." : "Imprimir"}
                </Button>
                <Button variant="outline" size="sm" className={defaultBtnClass} onClick={handleDownloadPdf} disabled={isDownloadingPdf}>
                    <Download className="w-4 h-4 mr-2" /> {isDownloadingPdf ? "Generando..." : "Descargar PDF"}
                </Button>
                <Button variant="outline" size="sm" className={defaultBtnClass}>
                    <Share2 className="w-4 h-4 mr-2" /> Compartir
                </Button>
            </div>
        </div>
    );
}
