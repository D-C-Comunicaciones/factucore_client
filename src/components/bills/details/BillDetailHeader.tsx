import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil, Plus, ChevronDown } from "lucide-react";
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
import { useCancelBill } from "@/hooks/bills/useBills";

interface BillDetailHeaderProps {
    bill: any;
    canEdit: boolean;
    canCancel: boolean;
}

export function BillDetailHeader({ bill, canEdit, canCancel }: BillDetailHeaderProps) {
    const defaultBtnClass = "h-9 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 cursor-pointer transition-colors shadow-sm font-medium";

    const router = useRouter();
    const [showAnularDialog, setShowAnularDialog] = useState(false);
    const cancelMutation = useCancelBill();

    const numberStr = bill.bill_number || `#${bill.id}`;

    const handleAnular = async () => {
        try {
            await cancelMutation.mutateAsync(bill.id);
            showToast("Factura de compra anulada correctamente", "success", "Éxito");
            router.push("/expenses/bills");
        } catch (error: any) {
            showToast(error?.message || "No se pudo anular la factura de compra", "error", "Error");
        } finally {
            setShowAnularDialog(false);
        }
    };

    return (
        <>
            <div>
                <h1 className="text-2xl font-semibold mb-4 text-[#0F2843]">
                    Factura de compra {numberStr}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                    {canEdit && (
                        <Button variant="outline" size="sm" asChild className={defaultBtnClass}>
                            <Link href={`/expenses/bills/${bill.id}/edit`}>
                                <Pencil className="w-4 h-4 mr-2" /> Editar
                            </Link>
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className={defaultBtnClass}
                        onClick={() => router.push(`/expenses/bills/${bill.id}?tab=payments`)}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Agregar pago
                    </Button>

                    {canCancel && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className={defaultBtnClass}>
                                    Más acciones <ChevronDown className="w-4 h-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 text-slate-700 bg-white">
                                <DropdownMenuItem
                                    className="cursor-pointer hover:bg-slate-50"
                                    onClick={() => router.push(`/expenses/bills/${bill.id}?tab=debit_notes`)}
                                >
                                    Registrar nota débito
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowAnularDialog(true)} className="cursor-pointer hover:bg-slate-50">
                                    Anular
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            <AlertDialog open={showAnularDialog} onOpenChange={setShowAnularDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de que deseas anular esta factura de compra?</AlertDialogTitle>
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
                            {cancelMutation.isPending ? "Anulando..." : "Anular factura"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
