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
import { StatusBadge, isRemissionInvoiced } from "@/components/remission/table/columns";

interface RemissionDetailHeaderProps {
    remission: any;
    canEdit: boolean;
    handlePrint: () => void;
    handleDownloadPdf?: () => void;
    isPrinting?: boolean;
    isDownloadingPdf?: boolean;
}

export function RemissionDetailHeader({
    remission,
    canEdit,
    handlePrint,
    handleDownloadPdf,
    isPrinting,
    isDownloadingPdf
}: RemissionDetailHeaderProps) {
    const defaultBtnClass = "h-9 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 cursor-pointer transition-colors shadow-sm font-medium";

    const router = useRouter();

    const invoiced = isRemissionInvoiced(remission.remission_status || remission.status);
    const documentTypeLabel = Number(remission.type_remission_id) === 2 ? "Orden de servicio" : "Remisión";

    const handleClone = () => {
        router.push(`/sales/remissions/new?cloneId=${remission.id}`);
    };

    return (
        <div>
            <Link href="/sales/remissions" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-2">
                <ArrowLeft className="w-4 h-4" /> Volver a mis remisiones
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold text-[#0F2843] flex items-center gap-3">
                    {documentTypeLabel} {remission.prefix || ''}{remission.number || remission.id}
                    <StatusBadge status={remission.remission_status || remission.status} />
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

                    {!invoiced && canEdit && (
                        <Button variant="outline" size="sm" asChild className={defaultBtnClass}>
                            <Link href={`/sales/remissions/${remission.id}/edit`}>
                                <Pencil className="w-4 h-4 mr-2" /> Editar
                            </Link>
                        </Button>
                    )}

                    {!invoiced && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" className="h-9 shadow-sm font-medium cursor-pointer">
                                    Convertir <ChevronDown className="w-4 h-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 text-slate-700 bg-white">
                                <DropdownMenuItem className="cursor-pointer hover:bg-slate-50" onClick={() => router.push(`/sales/invoices/new?remissionId=${remission.id}`)}>
                                    Convertir a factura
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </div>
    );
}
