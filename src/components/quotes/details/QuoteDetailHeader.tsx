import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    Pencil, 
    Printer, 
    Download, 
    Share2, 
    ChevronDown, 
    Loader2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuotesService } from "@/lib/quotes";
import { StatusBadge } from "@/components/quote/table/columns";
import { showToast } from "@/components/sonner/CustomToaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await QuotesService.delete(quote.id);
            showToast("Cotización eliminada correctamente", "success", "Éxito");
            router.push("/quotes");
        } catch (error: any) {
            console.error("Error al eliminar la cotización:", error);
            const errorData = error.response?.data || error.data || error;
            const errorMsg = errorData?.message || "No se pudo eliminar la cotización";
            showToast(errorMsg, "error", "Error");
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    return (
        <>
        <div>
            <h1 className="text-2xl font-semibold mb-4 text-[#0F2843] flex items-center gap-3">
                Cotización {quote.prefix || ''}{quote.number || quote.id}
                <StatusBadge status={quote.quotation_status || quote.status} />
            </h1>
            <div className="flex flex-wrap items-center gap-2">
                {canEdit && (
                    <Button variant="outline" size="sm" asChild className={defaultBtnClass}>
                        <Link href={`/quotes/${quote.id}/edit`}>
                            <Pencil className="w-4 h-4 mr-2" /> Editar
                        </Link>
                    </Button>
                )}
                
                <Button variant="outline" size="sm" className={`relative ${defaultBtnClass} disabled:opacity-100 disabled:bg-white`} onClick={handlePrint} disabled={isPrinting}>
                    {isPrinting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2b5deb]" />
                            <span className="invisible flex items-center"><Printer className="w-4 h-4 mr-2" /> Imprimir</span>
                        </>
                    ) : (
                        <><Printer className="w-4 h-4 mr-2" /> Imprimir</>
                    )}
                </Button>
                <Button variant="outline" size="sm" className={`relative ${defaultBtnClass} disabled:opacity-100 disabled:bg-white`} onClick={handleDownloadPdf} disabled={isDownloadingPdf}>
                    {isDownloadingPdf ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2b5deb]" />
                            <span className="invisible flex items-center"><Download className="w-4 h-4 mr-2" /> Descargar PDF</span>
                        </>
                    ) : (
                        <><Download className="w-4 h-4 mr-2" /> Descargar PDF</>
                    )}
                </Button>
                <Button variant="outline" size="sm" className={defaultBtnClass}>
                    <Share2 className="w-4 h-4 mr-2" /> Compartir
                </Button>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={defaultBtnClass}>
                            Más acciones <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 text-slate-700 bg-white">
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50" onClick={() => router.push(`/invoices/new?quoteId=${quote.id}`)}>
                            Convertir a factura
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50">Enviar por correo</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer hover:bg-slate-50 text-red-600">Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro de que deseas eliminar esta cotización?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={handleDelete}
                    >
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
