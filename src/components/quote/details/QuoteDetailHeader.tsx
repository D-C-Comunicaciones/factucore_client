import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Pencil,
    Printer,
    Download,
    Copy,
    ArrowLeft,
    MoreVertical,
    ChevronDown,
    Loader2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/quote/table/columns";

interface QuoteDetailHeaderProps {
    quote: any;
    canEdit: boolean;
    handlePrint: () => void;
    handleDownloadPdf?: () => void;
    isPrinting?: boolean;
    isDownloadingPdf?: boolean;
}

export function QuoteDetailHeader({
    quote,
    canEdit,
    handlePrint,
    handleDownloadPdf,
    isPrinting,
    isDownloadingPdf
}: QuoteDetailHeaderProps) {
    const defaultBtnClass = "h-9 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 cursor-pointer transition-colors shadow-sm font-medium";

    const router = useRouter();

    const handleClone = () => {
        router.push(`/sales/quotes/new?cloneId=${quote.id}`);
    };

    const handleConvertToRemission = () => {
        router.push(`/sales/remissions/new?quoteId=${quote.id}`);
    };

    return (
        <div>
            <Link href="/sales/quotes" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-2">
                <ArrowLeft className="w-4 h-4" /> Volver a mis cotizaciones
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold text-[#0F2843] flex items-center gap-3">
                    Cotización {quote.prefix || ''}{quote.number || quote.id}
                    <StatusBadge status={quote.quotation_status || quote.status} />
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className={defaultBtnClass}>
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 text-slate-700 bg-white">
                            <DropdownMenuItem className="cursor-pointer hover:bg-slate-50" onClick={handleDownloadPdf} disabled={isDownloadingPdf}>
                                <Download className="w-4 h-4 mr-2 text-slate-500" /> Descargar PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-slate-50" onClick={handleClone}>
                                <Copy className="w-4 h-4 mr-2 text-slate-500" /> Clonar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" size="icon" className={`relative ${defaultBtnClass} disabled:opacity-100 disabled:bg-white`} onClick={handlePrint} disabled={isPrinting}>
                        {isPrinting ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#2b5deb]" />
                        ) : (
                            <Printer className="w-4 h-4" />
                        )}
                    </Button>

                    {canEdit && (
                        <Button variant="outline" size="sm" asChild className={defaultBtnClass}>
                            <Link href={`/sales/quotes/${quote.id}/edit`}>
                                <Pencil className="w-4 h-4 mr-2" /> Editar
                            </Link>
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" className="h-9 shadow-sm font-medium cursor-pointer">
                                Convertir <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 text-slate-700 bg-white">
                            <DropdownMenuItem className="cursor-pointer hover:bg-slate-50" onClick={() => router.push(`/sales/invoices/new?quoteId=${quote.id}`)}>
                                Convertir a factura
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-slate-50" onClick={handleConvertToRemission}>
                                Convertir a remisión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
