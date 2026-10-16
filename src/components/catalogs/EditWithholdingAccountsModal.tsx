"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { showToast } from "@/components/sonner/CustomToaster";
import { useAccountsList } from "@/hooks/accounting/useAccounting";
import { useUpdateWithholding } from "@/hooks/catalogs/useWithholdings";
import type { Withholding } from "@/types/catalogs";

interface EditWithholdingAccountsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    withholding: Withholding | null;
}

export function EditWithholdingAccountsModal({ open, onOpenChange, withholding }: EditWithholdingAccountsModalProps) {
    const { data: accountsData } = useAccountsList({ postable_only: true });
    const accountOptions = (accountsData ?? []).map((a: any) => ({ value: String(a.id), label: `${a.code} — ${a.name}` }));

    const [payableAccountId, setPayableAccountId] = useState<string>("");
    const [receivableAccountId, setReceivableAccountId] = useState<string>("");

    const updateMutation = useUpdateWithholding();

    useEffect(() => {
        if (open && withholding) {
            setPayableAccountId(withholding.payable_account_id ? String(withholding.payable_account_id) : "");
            setReceivableAccountId(withholding.receivable_account_id ? String(withholding.receivable_account_id) : "");
        }
    }, [open, withholding]);

    const handleSubmit = async () => {
        if (!withholding) return;
        try {
            await updateMutation.mutateAsync({
                id: withholding.id,
                data: {
                    payable_account_id: payableAccountId ? Number(payableAccountId) : null,
                    receivable_account_id: receivableAccountId ? Number(receivableAccountId) : null,
                },
            });
            showToast("Cuentas de la retención actualizadas", "success");
            onOpenChange(false);
        } catch (error: any) {
            showToast(error?.response?.data?.message || error?.message || "No se pudieron actualizar las cuentas", "error");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] bg-white">
                <DialogHeader>
                    <DialogTitle>Cuentas contables — {withholding?.name}</DialogTitle>
                    <DialogDescription>
                        Define a qué cuenta del catálogo se contabiliza esta retención. Si dejas un campo vacío, se
                        usa la cuenta por defecto del catálogo.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Cuenta por pagar (retención practicada a un proveedor)</label>
                        <SearchableSelect
                            value={payableAccountId}
                            onValueChange={setPayableAccountId}
                            options={[{ value: "", label: "Automática" }, ...accountOptions]}
                            placeholder="Automática"
                            searchPlaceholder="Buscar cuenta..."
                            className="w-full h-9"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Cuenta por cobrar (retención sufrida por un cliente)</label>
                        <SearchableSelect
                            value={receivableAccountId}
                            onValueChange={setReceivableAccountId}
                            options={[{ value: "", label: "Automática" }, ...accountOptions]}
                            placeholder="Automática"
                            searchPlaceholder="Buscar cuenta..."
                            className="w-full h-9"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={updateMutation.isPending}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    >
                        {updateMutation.isPending ? "Guardando..." : "Guardar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
