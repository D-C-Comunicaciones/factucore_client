"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, ChevronDown, ChevronUp } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { showToast } from "@/components/sonner/CustomToaster";
import { useCreateBankTransfer } from "@/hooks/banks/useBanks";
import { useResolutions } from "@/hooks/useResolutions";
import type { BankAccount } from "@/lib/banks";

interface TransferModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bankAccounts: BankAccount[];
}

export function TransferModal({ open, onOpenChange, bankAccounts }: TransferModalProps) {
    const createMutation = useCreateBankTransfer();

    const [fromId, setFromId] = useState("");
    const [toId, setToId] = useState("");
    const [amount, setAmount] = useState("");
    const [transferDate, setTransferDate] = useState<Date>(new Date());
    const [description, setDescription] = useState("");
    const [showAdditional, setShowAdditional] = useState(false);
    const [incomeResolutionId, setIncomeResolutionId] = useState("");
    const [expenseResolutionId, setExpenseResolutionId] = useState("");

    const { resolutions: incomeResolutions } = useResolutions({ type_resolution: 5, is_active: true } as any);
    const { resolutions: expenseResolutions } = useResolutions({ type_resolution: 6, is_active: true } as any);

    useEffect(() => {
        if (!open) return;
        setFromId("");
        setToId("");
        setAmount("");
        setTransferDate(new Date());
        setDescription("");
        setShowAdditional(false);
        setIncomeResolutionId("");
        setExpenseResolutionId("");
    }, [open]);

    const accountOptions = bankAccounts.map((a) => ({ value: String(a.id), label: a.name }));

    const handleSwap = () => {
        const prevFrom = fromId;
        setFromId(toId);
        setToId(prevFrom);
    };

    const handleSubmit = async () => {
        if (!fromId || !toId) {
            showToast("Selecciona la cuenta de origen y destino", "warning");
            return;
        }
        if (fromId === toId) {
            showToast("La cuenta de destino debe ser diferente a la cuenta de origen", "warning");
            return;
        }
        const amountNum = Number(amount);
        if (!amountNum || amountNum <= 0) {
            showToast("Ingresa un monto válido", "warning");
            return;
        }

        try {
            await createMutation.mutateAsync({
                from_bank_account_id: Number(fromId),
                to_bank_account_id: Number(toId),
                amount: amountNum,
                transfer_date: transferDate.toISOString().split("T")[0],
                description: description.trim() || undefined,
                income_resolution_id: incomeResolutionId ? Number(incomeResolutionId) : undefined,
                expense_resolution_id: expenseResolutionId ? Number(expenseResolutionId) : undefined,
            });
            showToast("Transferencia registrada exitosamente", "success");
            onOpenChange(false);
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo registrar la transferencia", "error");
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[520px] bg-white overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Transferir</SheetTitle>
                </SheetHeader>

                <div className="px-4 space-y-4 pb-6">
                    <h3 className="text-sm font-bold text-foreground">Información de la transferencia</h3>

                    <div className="flex items-end gap-2">
                        <div className="flex-1 space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Cuenta de origen <span className="text-primary">*</span></label>
                            <SearchableSelect value={fromId} onValueChange={setFromId} options={accountOptions} placeholder="Selecciona una cuenta" className="w-full h-9" />
                        </div>
                        <button type="button" onClick={handleSwap} title="Intercambiar cuentas" className="h-9 w-9 shrink-0 flex items-center justify-center rounded-md border border-input hover:bg-muted transition-colors cursor-pointer mb-0.5">
                            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <div className="flex-1 space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Cuenta de destino <span className="text-primary">*</span></label>
                            <SearchableSelect value={toId} onValueChange={setToId} options={accountOptions} placeholder="Selecciona una cuenta" className="w-full h-9" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Monto <span className="text-primary">*</span></label>
                            <div className="flex items-center border border-input rounded-md overflow-hidden h-9">
                                <span className="px-2 text-muted-foreground text-sm">$</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Escribe el monto"
                                    className="flex-1 h-full px-1 text-sm outline-none"
                                />
                                <span className="px-2 text-xs text-muted-foreground border-l border-input h-full flex items-center">COP</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Fecha de transferencia <span className="text-primary">*</span></label>
                            <DatePickerSimple value={transferDate} onChange={(d) => d && setTransferDate(d)} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Descripción</label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Agrega una descripción para la transferencia" className="min-h-[80px]" />
                    </div>

                    <button type="button" onClick={() => setShowAdditional((v) => !v)} className="text-sm text-primary font-medium flex items-center gap-1 cursor-pointer">
                        {showAdditional ? "Ocultar campos adicionales" : "Campos adicionales"}
                        {showAdditional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showAdditional && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Numeración ingreso</label>
                                <SearchableSelect
                                    value={incomeResolutionId}
                                    onValueChange={setIncomeResolutionId}
                                    options={(incomeResolutions || []).map((r: any) => ({ value: String(r.id), label: r.name }))}
                                    placeholder="Selecciona una numeración"
                                    className="w-full h-9"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Numeración egreso</label>
                                <SearchableSelect
                                    value={expenseResolutionId}
                                    onValueChange={setExpenseResolutionId}
                                    options={(expenseResolutions || []).map((r: any) => ({ value: String(r.id), label: r.name }))}
                                    placeholder="Selecciona una numeración"
                                    className="w-full h-9"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <SheetFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={createMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                        {createMutation.isPending ? "Transfiriendo..." : "Transferir"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
