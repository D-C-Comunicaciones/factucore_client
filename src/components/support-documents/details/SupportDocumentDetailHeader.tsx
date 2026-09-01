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
import { showToast } from "@/components/sonner/CustomToaster";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCancelSupportDocument } from "@/hooks/supportDocuments/useSupportDocuments";

interface SupportDocumentDetailHeaderProps {
    doc: any;
    canEdit: boolean;
    canSend: boolean;
    canCancel: boolean;
    isSending: boolean;
    handleSendToDian: () => void;
    handlePrint: () => void;
    handleDownloadPdf?: () => void;
    isPrinting?: boolean;
    isDownloadingPdf?: boolean;
}

export function SupportDocumentDetailHeader({
    doc,
    canEdit,
    canSend,
    canCancel,
    isSending,
    handleSendToDian,
    handlePrint,
    handleDownloadPdf,
    isPrinting,
    isDownloadingPdf,
}: SupportDocumentDetailHeaderProps) {
    const defaultBtnClass = "h-9 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 cursor-pointer transition-colors shadow-sm font-medium";

    const router = useRouter();
    const [showAnularDialog, setShowAnularDialog] = useState(false);
    const cancelMutation = useCancelSupportDocument();

    const handleAnular = async () => {
        try {
            await cancelMutation.mutateAsync(doc.id);
            showToast("Documento soporte anulado correctamente", "success", "Éxito");
            router.push("/expenses/support-documents");
        } catch (error: any) {
            showToast(error?.message || "No se pudo anular el documento soporte", "error", "Error");
        } finally {
            setShowAnularDialog(false);
        }
    };

    return (
        <>
            <div>
                <h1 className="text-2xl font-semibold mb-4 text-[#0F2843]">
                    Documento soporte {doc.prefix || ''}{doc.number || doc.id}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                    {canEdit && (
                        <Button variant="outline" size="sm" asChild className={defaultBtnClass}>
                            <Link href={`/expenses/support-documents/${doc.id}/edit`}>
                                <Pencil className="w-4 h-4 mr-2" /> Editar
                            </Link>
                        </Button>
                    )}
                    {canSend && (
                        <Button variant="default" size="sm" className="relative h-9 bg-[#2b5deb] hover:bg-[#204bc2] text-white border-transparent cursor-pointer shadow-sm disabled:opacity-100 disabled:bg-[#2b5deb]" onClick={handleSendToDian} disabled={isSending}>
                            {isSending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                                    <span className="invisible flex items-center"><Send className="w-4 h-4 mr-2" /> Enviar</span>
                                </>
                            ) : (
                                <><Send className="w-4 h-4 mr-2" /> Enviar a la DIAN</>
                            )}
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
                    <Button
                        variant="outline"
                        size="sm"
                        className={defaultBtnClass}
                        onClick={() => router.push(`/expenses/support-documents/${doc.id}?tab=payments`)}
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
                            <DropdownMenuItem
                                className="cursor-pointer hover:bg-slate-50"
                                onClick={() => router.push(`/expenses/adjustment-notes/new?support_document_id=${doc.id}&type=correction`)}
                            >
                                Nota de ajuste (corrección)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer hover:bg-slate-50"
                                onClick={() => router.push(`/expenses/adjustment-notes/new?support_document_id=${doc.id}&type=annulment`)}
                            >
                                Nota de ajuste (anulación)
                            </DropdownMenuItem>
                            {canCancel && (
                                <DropdownMenuItem onClick={() => setShowAnularDialog(true)} className="cursor-pointer hover:bg-slate-50">
                                    Anular
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <AlertDialog open={showAnularDialog} onOpenChange={setShowAnularDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de que deseas anular este documento soporte?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={cancelMutation.isPending}>Cancelar</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            disabled={cancelMutation.isPending}
                            onClick={handleAnular}
                        >
                            {cancelMutation.isPending ? "Anulando..." : "Anular documento"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
