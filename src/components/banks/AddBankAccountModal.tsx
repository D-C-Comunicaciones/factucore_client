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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { showToast } from "@/components/sonner/CustomToaster";
import { useBankAccountTypesList, useCreateBankAccount, useUpdateBankAccount } from "@/hooks/banks/useBanks";
import { cn } from "@/lib/utils";
import type { BankAccount, BankAccountType } from "@/lib/banks";

interface AddBankAccountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bankAccount?: BankAccount | null;
}

export function AddBankAccountModal({ open, onOpenChange, bankAccount }: AddBankAccountModalProps) {
    const isEdit = !!bankAccount;
    const createMutation = useCreateBankAccount();
    const updateMutation = useUpdateBankAccount();
    const { data: typeOptionsData, isLoading: typesLoading } = useBankAccountTypesList();
    const typeOptions = (typeOptionsData ?? []).map((t) => ({ value: t.code, label: t.name, description: t.description ?? undefined }));

    const [name, setName] = useState("");
    const [type, setType] = useState<BankAccountType>("banco");
    const [accountNumber, setAccountNumber] = useState("");
    const [initialBalance, setInitialBalance] = useState("");
    const [balanceDate, setBalanceDate] = useState<Date>(new Date());
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const clearError = (field: string) => {
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    useEffect(() => {
        if (open && bankAccount) {
            setName(bankAccount.name || "");
            setType(bankAccount.type);
            setAccountNumber(bankAccount.account_number || "");
            setInitialBalance(String(bankAccount.initial_balance ?? "0"));
            setBalanceDate(bankAccount.initial_balance_date ? new Date(bankAccount.initial_balance_date) : new Date());
            setDescription(bankAccount.description || "");
            setErrors({});
        } else if (open) {
            setName("");
            setType("banco");
            setAccountNumber("");
            setInitialBalance("");
            setBalanceDate(new Date());
            setDescription("");
            setErrors({});
        }
    }, [open, bankAccount]);

    const saving = createMutation.isPending || updateMutation.isPending;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) newErrors.name = "El nombre de la cuenta es obligatorio.";
        if (!type) newErrors.type = "El tipo de cuenta es obligatorio.";
        if (initialBalance === "" || Number.isNaN(Number(initialBalance)) || Number(initialBalance) < 0) {
            newErrors.initialBalance = "El saldo inicial es obligatorio.";
        }
        if (!balanceDate) newErrors.balanceDate = "La fecha de saldo inicial es obligatoria.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showToast("Debes completar los campos obligatorios", "error");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const payload = {
            name: name.trim(),
            type,
            account_number: accountNumber.trim() || undefined,
            initial_balance: Number(initialBalance),
            initial_balance_date: balanceDate.toISOString().split("T")[0],
            description: description.trim() || undefined,
        };

        try {
            if (isEdit && bankAccount) {
                await updateMutation.mutateAsync({ id: bankAccount.id, data: payload });
                showToast("Cuenta bancaria actualizada", "success");
            } else {
                await createMutation.mutateAsync(payload);
                showToast("Cuenta bancaria creada", "success");
            }
            onOpenChange(false);
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo guardar la cuenta bancaria", "error");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] bg-white">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar cuenta" : "Agregar banco"}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Cambia la información que se encuentra asociada a esta cuenta bancaria."
                            : "Crea tus cuentas de banco, efectivo o tarjetas de crédito."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Nombre de la cuenta <span className="text-primary">*</span></label>
                        <Input
                            value={name}
                            onChange={(e) => { setName(e.target.value); clearError("name"); }}
                            placeholder="Nombre de la cuenta"
                            className={cn("h-9", errors.name && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40")}
                        />
                        {errors.name && <span className="text-destructive text-xs mt-1 block">{errors.name}</span>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Tipo de cuenta <span className="text-primary">*</span></label>
                        {isEdit ? (
                            <Input value={typeOptions.find((t) => t.value === type)?.label || type} disabled className="h-9 bg-muted/30" />
                        ) : (
                            <SearchableSelect
                                value={type}
                                onValueChange={(v) => { setType(v as BankAccountType); clearError("type"); }}
                                options={typeOptions}
                                loading={typesLoading}
                                className={cn("w-full h-9", errors.type && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40")}
                            />
                        )}
                        {errors.type && <span className="text-destructive text-xs mt-1 block">{errors.type}</span>}
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Número de cuenta</label>
                        <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Número de cuenta" className="h-9" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Saldo inicial <span className="text-primary">*</span></label>
                        <div className={cn("flex items-center border border-gray-300 rounded-md overflow-hidden h-9", errors.initialBalance && "border-destructive")}>
                            <span className="px-2 text-muted-foreground text-sm">$</span>
                            <input
                                type="number"
                                min={0}
                                value={initialBalance}
                                onChange={(e) => { setInitialBalance(e.target.value); clearError("initialBalance"); }}
                                placeholder="Saldo inicial"
                                className="flex-1 h-full px-1 text-sm outline-none"
                            />
                            <span className="px-2 text-xs text-muted-foreground bg-gray-100 border-l border-gray-300 h-full flex items-center">COP</span>
                        </div>
                        {errors.initialBalance && <span className="text-destructive text-xs mt-1 block">{errors.initialBalance}</span>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Fecha de saldo inicial <span className="text-primary">*</span></label>
                        <DatePickerSimple value={balanceDate} onChange={(d) => d && setBalanceDate(d)} />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Descripción</label>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" className="h-9" />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                        {saving ? "Guardando..." : isEdit ? "Editar" : "Crear banco"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
