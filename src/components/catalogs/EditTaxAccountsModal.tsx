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
import { useUpdateTax } from "@/hooks/catalogs/useTaxes";
import type { Tax } from "@/types/catalogs";

interface EditTaxAccountsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tax: Tax | null;
}

export function EditTaxAccountsModal({ open, onOpenChange, tax }: EditTaxAccountsModalProps) {
    const { data: accountsData } = useAccountsList({ postable_only: true });
    const accountOptions = (accountsData ?? []).map((a: any) => ({ value: String(a.id), label: `${a.code} — ${a.name}` }));

    const [payableAccountId, setPayableAccountId] = useState<string>("");
    const [discountableAccountId, setDiscountableAccountId] = useState<string>("");

    const updateMutation = useUpdateTax();

    useEffect(() => {
        if (open && tax) {
            setPayableAccountId(tax.payable_account_id ? String(tax.payable_account_id) : "");
            setDiscountableAccountId(tax.discountable_account_id ? String(tax.discountable_account_id) : "");
        }
    }, [open, tax]);

    const handleSubmit = async () => {
        if (!tax) return;
        try {
            await updateMutation.mutateAsync({
                id: tax.id,
                data: {
                    payable_account_id: payableAccountId ? Number(payableAccountId) : null,
                    discountable_account_id: discountableAccountId ? Number(discountableAccountId) : null,
                },
            });
            showToast("Cuentas del impuesto actualizadas", "success");
            onOpenChange(false);
        } catch (error: any) {
            showToast(error?.response?.data?.message || error?.message || "No se pudieron actualizar las cuentas", "error");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] bg-white">
                <DialogHeader>
                    <DialogTitle>Cuentas contables — {tax?.name}</DialogTitle>
                    <DialogDescription>
                        Define a qué cuenta del catálogo se contabiliza este impuesto. Si dejas un campo vacío, se
                        usa la cuenta por defecto del catálogo.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Cuenta por pagar (impuesto generado en ventas)</label>
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
                        <label className="text-sm font-medium text-foreground">Cuenta descontable (impuesto recuperable en compras)</label>
                        <SearchableSelect
                            value={discountableAccountId}
                            onValueChange={setDiscountableAccountId}
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
