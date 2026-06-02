"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/components/sonner/CustomToaster";
import { cn } from "@/lib/utils";

type TaxType = {
    id: number | string;
    name: string;
};

interface NewTaxRateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taxTypes: TaxType[];
    onSave: (payload: {
        name: string;
        tax_id: number;
        rate: number;
        description?: string;
        type: "percentage";
    }) => Promise<void>;
}

export function NewTaxRateModal({ open, onOpenChange, taxTypes, onSave }: NewTaxRateModalProps) {
    const [name, setName] = React.useState("");
    const [taxTypeId, setTaxTypeId] = React.useState("");
    const [rate, setRate] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [errors, setErrors] = React.useState<{ name: boolean; taxTypeId: boolean; rate: boolean }>({
        name: false,
        taxTypeId: false,
        rate: false,
    });

    const baseInput =
        "bg-white h-[38px] px-3 text-sm border border-foreground/20 rounded-xl shadow-none text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none w-full";
    const selectItemClass =
        "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary";

    const reset = () => {
        setName("");
        setTaxTypeId("");
        setRate("");
        setDescription("");
        setIsSaving(false);
        setErrors({ name: false, taxTypeId: false, rate: false });
    };

    React.useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open]);

    const handleSave = async () => {
        const normalizedRate = Number(String(rate).replace(",", "."));

        const nextErrors = {
            name: !name.trim(),
            taxTypeId: !taxTypeId,
            rate: !rate.trim() || Number.isNaN(normalizedRate),
        };

        setErrors(nextErrors);

        if (nextErrors.name || nextErrors.taxTypeId || nextErrors.rate) {
            showToast("Completa los campos obligatorios para crear el impuesto.", "error");
            return;
        }

        if (normalizedRate < 0) {
            showToast("La tarifa no puede ser negativa.", "error");
            return;
        }

        setIsSaving(true);
        try {
            await onSave({
                name: name.trim(),
                tax_id: Number(taxTypeId),
                rate: normalizedRate,
                description: description.trim() || undefined,
                type: "percentage",
            });
            onOpenChange(false);
        } catch {
            showToast("No se pudo crear el impuesto. Inténtalo nuevamente.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[700px] p-0 gap-0 overflow-hidden rounded-2xl bg-white border-none shadow-2xl">
                <DialogHeader className="px-6 py-4 border-b border-border/40 bg-white">
                    <DialogTitle className="text-[32px] leading-none font-bold text-foreground">Nuevo impuesto</DialogTitle>
                </DialogHeader>

                <div className="px-6 py-5 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Nombre <span className="text-primary">*</span></label>
                        <input
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
                            }}
                            placeholder="Nombre del impuesto"
                            className={cn(baseInput, errors.name && "border-destructive focus:border-destructive focus:ring-destructive/20")}
                        />
                        {errors.name && (
                            <p className="mt-1 text-[11px] text-destructive">El nombre es obligatorio</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Tipo <span className="text-primary">*</span></label>
                            <Select value={taxTypeId} onValueChange={(v) => {
                                setTaxTypeId(v);
                                if (errors.taxTypeId) setErrors((prev) => ({ ...prev, taxTypeId: false }));
                            }}>
                                <SelectTrigger className={cn(baseInput, "justify-between pr-2", errors.taxTypeId && "border-destructive focus:border-destructive focus:ring-destructive/20")}>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-border rounded-xl shadow-lg">
                                    {taxTypes.map((t) => (
                                        <SelectItem key={String(t.id)} value={String(t.id)} className={selectItemClass}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.taxTypeId && (
                                <p className="mt-1 text-[11px] text-destructive">El tipo es obligatorio</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Tarifa <span className="text-primary">*</span></label>
                            <div className="relative">
                                <input
                                    value={rate}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9.,]/g, "");
                                        setRate(val);
                                        if (errors.rate) setErrors((prev) => ({ ...prev, rate: false }));
                                    }}
                                    placeholder="0"
                                    className={cn(baseInput, "pr-8", errors.rate && "border-destructive focus:border-destructive focus:ring-destructive/20")}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                            </div>
                            {errors.rate && (
                                <p className="mt-1 text-[11px] text-destructive">El porcentaje es obligatorio</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-foreground/20 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors shadow-none resize-none bg-white"
                            rows={4}
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-border/40 flex justify-end gap-3 bg-white">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="px-5 py-2 bg-white border border-border hover:bg-muted text-foreground text-sm font-bold rounded-xl transition-all cursor-pointer"
                        disabled={isSaving}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-5 py-2 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50"
                        disabled={isSaving}
                    >
                        {isSaving ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
