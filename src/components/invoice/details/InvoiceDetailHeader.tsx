import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    Pencil, 
    Printer, 
    Download, 
    Share2, 
    Plus, 
    ChevronDown, 
    Send,
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
import { InvoicesService } from "@/lib/invoices";
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

interface InvoiceDetailHeaderProps {
    bill: any;
    canEdit: boolean;
    canEmit: boolean;
    isSending: boolean;
    handleSendToDian: () => void;
    handlePrint: () => void;
    handleDownloadPdf?: () => void;
}

export function InvoiceDetailHeader({
    bill,
    canEdit,
    canEmit,
    isSending,
    handleSendToDian,
    handlePrint,
    handleDownloadPdf
}: InvoiceDetailHeaderProps) {
    const defaultBtnClass = "h-9 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 cursor-pointer transition-colors shadow-sm font-medium";
    
    const router = useRouter();
    const [showAnularDialog, setShowAnularDialog] = useState(false);
    const [isAnulando, setIsAnulando] = useState(false);

    const handleAnular = async () => {
        setIsAnulando(true);
        try {
            await InvoicesService.cancel(bill.id);
            showToast("Factura anulada correctamente", "success", "Éxito");
            // Redirect to invoices list
            router.push("/invoices");
        } catch (error: any) {
            console.error("Error al anular la factura:", error);
            const errorData = error.response?.data || error.data || error;
            const errorMsg = errorData?.message || "No se pudo anular la factura";
            showToast(errorMsg, "error", "Error");
        } finally {
            setIsAnulando(false);
            setShowAnularDialog(false);
        }
    };

    return (
        <>
        <div>
            <h1 className="text-2xl font-semibold mb-4 text-[#0F2843]">Factura de venta {bill.prefix || ''}{bill.number || bill.id}</h1>
            <div className="flex flex-wrap items-center gap-2">
                {canEdit && (
                    <Button variant="outline" size="sm" asChild className={defaultBtnClass}>
                        <Link href={`/invoices/${bill.id}/edit`}>
                            <Pencil className="w-4 h-4 mr-2" /> Editar
                        </Link>
                    </Button>
                )}
                {canEmit && (
                    <Button variant="default" size="sm" className="h-9 bg-[#2b5deb] hover:bg-[#204bc2] text-white border-transparent cursor-pointer shadow-sm" onClick={handleSendToDian} disabled={isSending}>
                        {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />} 
                        Emitir
                    </Button>
                )}
                <Button variant="outline" size="sm" className={defaultBtnClass} onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" /> Imprimir
                </Button>
                <Button variant="outline" size="sm" className={defaultBtnClass} onClick={handleDownloadPdf}>
                    <Download className="w-4 h-4 mr-2" /> Descargar PDF
                </Button>
                <Button variant="outline" size="sm" className={defaultBtnClass}>
                    <Share2 className="w-4 h-4 mr-2" /> Compartir
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className={defaultBtnClass}
                    onClick={() => router.push(`/payments/new?customer_id=${bill?.customer_id || bill?.contact_id || ''}`)}
                >
                    <Plus className="w-4 h-4 mr-2" /> Agregar pago
                </Button>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={defaultBtnClass}>
                            Más acciones <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 text-slate-700 bg-white">
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50">Editar retenciones</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowAnularDialog(true)} className="cursor-pointer hover:bg-slate-50">Anular</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50">Cerrar sin pago</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50">Aplicar anticipo</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50">Aplicar nota de crédito</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50">Aplicar nota de débito</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50">Adjuntar archivos</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50">Convertir a borrador</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <AlertDialog open={showAnularDialog} onOpenChange={setShowAnularDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro de que deseas anular esta factura?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isAnulando}>Cancelar</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={isAnulando}
                        onClick={handleAnular}
                    >
                        {isAnulando ? "Anulando..." : "Anular factura"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
