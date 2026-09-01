"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, HelpCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { showToast } from "@/components/sonner/CustomToaster";
import { ContactsService } from "@/lib/contacts";
import { costCentersApi } from "@/lib/costCenters";
import {
    useAccountsList,
    useCreateJournalEntry,
    useJournalEntryNextNumber,
    useVoucherTypes,
} from "@/hooks/accounting/useAccounting";

interface DraftLine {
    key: string;
    account_id: string;
    contact_id: string;
    document_number: string;
    description: string;
    cost_center_id: string;
    debit: string;
    credit: string;
}

let keySeq = 0;
function makeKey() {
    keySeq += 1;
    return `line-${keySeq}`;
}

function emptyLine(): DraftLine {
    return {
        key: makeKey(),
        account_id: "",
        contact_id: "",
        document_number: "",
        description: "",
        cost_center_id: "",
        debit: "",
        credit: "",
    };
}

export default function NewJournalEntryPage() {
    const router = useRouter();
    const { data: accounts } = useAccountsList({ postable_only: true });
    const { data: voucherTypes } = useVoucherTypes();
    const createEntry = useCreateJournalEntry();

    const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
    const [description, setDescription] = useState("");
    const [voucherType, setVoucherType] = useState("ajuste");
    const [lines, setLines] = useState<DraftLine[]>([emptyLine(), emptyLine()]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (voucherTypes?.length && !voucherTypes.some((t: any) => t.value === voucherType)) {
            setVoucherType(voucherTypes[0].value);
        }
    }, [voucherTypes, voucherType]);

    const { data: nextNumber } = useJournalEntryNextNumber(voucherType);

    const { data: contacts } = useQuery({
        queryKey: ["journal-entry-contacts"],
        queryFn: async () => {
            const res: any = await ContactsService.list({ per_page: 200 });
            return res?.data?.contacts ?? [];
        },
    });

    const { data: costCenters } = useQuery({
        queryKey: ["journal-entry-cost-centers"],
        queryFn: async () => {
            try {
                const res: any = await costCentersApi.getCostCenters({ per_page: 200, is_active: true });
                return res?.data?.["cost-centers"] ?? res?.data?.cost_centers ?? [];
            } catch {
                return [];
            }
        },
    });

    const accountOptions = (accounts || []).map((a: any) => ({ value: String(a.id), label: `${a.code} — ${a.name}` }));
    const voucherTypeOptions = (voucherTypes || []).map((t: any) => ({ value: t.value, label: t.label }));
    const contactOptions = (contacts || []).map((c: any) => ({
        value: String(c.id),
        label: c.registration_name || c.name || `${c.first_name || ""} ${c.last_name || ""}`.trim(),
    }));
    const costCenterOptions = (costCenters || []).map((c: any) => ({ value: String(c.id), label: c.name }));

    const numeracionLabel = useMemo(() => {
        const typeLabel = voucherTypeOptions.find((t: { value: string; label: string }) => t.value === voucherType)?.label || "";
        if (!nextNumber?.prefix) return typeLabel;
        return `${typeLabel} — ${nextNumber.prefix}${nextNumber.number}`;
    }, [voucherTypeOptions, voucherType, nextNumber]);

    const totals = useMemo(() => {
        const debit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
        const credit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
        return { debit, credit, difference: debit - credit, balanced: Math.abs(debit - credit) < 0.01 && debit > 0 };
    }, [lines]);

    const addLine = () => {
        setLines((prev) => [...prev, emptyLine()]);
    };

    const removeLine = (key: string) => {
        setLines((prev) => prev.filter((l) => l.key !== key));
    };

    const updateLine = (key: string, field: keyof DraftLine, value: string) => {
        setLines((prev) => prev.map((l) => (l.key === key ? { ...l, [field]: value } : l)));
    };

    const handleSubmit = async () => {
        const validLines = lines.filter((l) => l.account_id && (Number(l.debit) > 0 || Number(l.credit) > 0));
        if (validLines.length < 2) {
            showToast("Agrega al menos dos líneas con cuenta y valor", "error");
            return;
        }
        if (!totals.balanced) {
            showToast(`El comprobante no cuadra: débitos $${totals.debit.toLocaleString("es-CO")} vs créditos $${totals.credit.toLocaleString("es-CO")}`, "error");
            return;
        }

        setSubmitting(true);
        try {
            await createEntry.mutateAsync({
                entry_date: entryDate,
                description: description || undefined,
                voucher_type: voucherType,
                lines: validLines.map((l) => ({
                    account_id: Number(l.account_id),
                    contact_id: l.contact_id ? Number(l.contact_id) : undefined,
                    cost_center_id: l.cost_center_id ? Number(l.cost_center_id) : undefined,
                    document_number: l.document_number || undefined,
                    description: l.description || undefined,
                    debit: Number(l.debit) || 0,
                    credit: Number(l.credit) || 0,
                })),
            });
            showToast("Comprobante contable creado correctamente", "success");
            router.push("/accounting/journal-entries");
        } catch (error: any) {
            showToast(error?.message || "Error al crear el comprobante contable", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen py-6 px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto space-y-6">
            <div>
                <div className="flex items-center text-sm text-primary mb-2 font-medium">
                    <Link href="/accounting/journal-entries" className="hover:underline cursor-pointer">
                        Comprobantes contables
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
                    <span className="text-slate-500">Nuevo comprobante contable</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[#001D4A]">Nuevo comprobante contable</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Registra ajustes y traslados del saldo contable entre tus cuentas.
                        </p>
                    </div>
                    <Button variant="ghost" className="text-primary hover:bg-primary/5 hover:text-primary cursor-pointer h-9 px-3 gap-1.5">
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Ayuda</span>
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6 space-y-6 shadow-sm">
                <div>
                    <h2 className="text-base font-semibold text-foreground mb-4">Datos básicos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Fecha <span className="text-primary">*</span></label>
                            <DatePickerSimple
                                value={entryDate ? new Date(entryDate) : new Date()}
                                onChange={(d) => setEntryDate(d ? d.toISOString().split("T")[0] : "")}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Tipo de comprobante contable <span className="text-primary">*</span></label>
                            <SearchableSelect
                                value={voucherType}
                                onValueChange={setVoucherType}
                                options={voucherTypeOptions}
                                placeholder="Seleccionar tipo"
                                className="h-9 bg-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Observaciones</label>
                            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opcional" className="h-9" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Numeración <span className="text-primary">*</span></label>
                            <div className="h-9 flex items-center px-3 rounded-md border border-border bg-muted/30 text-xs text-muted-foreground truncate">
                                {numeracionLabel || "Selecciona un tipo de comprobante"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                    <h2 className="text-base font-semibold text-foreground pt-4">Movimientos</h2>

                    <div className="border border-border rounded-lg overflow-x-auto">
                        <table className="w-full text-xs text-left min-w-[1080px]">
                            <thead>
                                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                                    <th className="px-2 py-2.5 font-medium w-[4%]">#</th>
                                    <th className="px-2 py-2.5 font-medium w-[20%]">Cuenta contable</th>
                                    <th className="px-2 py-2.5 font-medium w-[15%]">Contacto</th>
                                    <th className="px-2 py-2.5 font-medium w-[12%]">N° de documento</th>
                                    <th className="px-2 py-2.5 font-medium w-[18%]">Descripción</th>
                                    <th className="px-2 py-2.5 font-medium w-[13%]">Centro de costos</th>
                                    <th className="px-2 py-2.5 font-medium w-[9%] text-right">Débito</th>
                                    <th className="px-2 py-2.5 font-medium w-[9%] text-right">Crédito</th>
                                    <th className="px-2 py-2.5 font-medium w-[4%]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {lines.map((line, idx) => (
                                    <tr key={line.key} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-2 py-2 align-middle text-slate-400 font-medium">{idx + 1}</td>
                                        <td className="px-2 py-2 align-middle">
                                            <SearchableSelect
                                                value={line.account_id}
                                                onValueChange={(v) => updateLine(line.key, "account_id", v)}
                                                options={accountOptions}
                                                placeholder="Cuenta"
                                                searchPlaceholder="Buscar cuenta..."
                                                className="h-8 text-xs bg-white"
                                            />
                                        </td>
                                        <td className="px-2 py-2 align-middle">
                                            <SearchableSelect
                                                value={line.contact_id}
                                                onValueChange={(v) => updateLine(line.key, "contact_id", v)}
                                                options={contactOptions}
                                                placeholder="Opcional"
                                                searchPlaceholder="Buscar contacto..."
                                                className="h-8 text-xs bg-white"
                                            />
                                        </td>
                                        <td className="px-2 py-2 align-middle">
                                            <Input
                                                value={line.document_number}
                                                onChange={(e) => updateLine(line.key, "document_number", e.target.value)}
                                                placeholder="Opcional"
                                                className="h-8 text-xs"
                                            />
                                        </td>
                                        <td className="px-2 py-2 align-middle">
                                            <Input
                                                value={line.description}
                                                onChange={(e) => updateLine(line.key, "description", e.target.value)}
                                                placeholder="Opcional"
                                                className="h-8 text-xs"
                                            />
                                        </td>
                                        <td className="px-2 py-2 align-middle">
                                            <SearchableSelect
                                                value={line.cost_center_id}
                                                onValueChange={(v) => updateLine(line.key, "cost_center_id", v)}
                                                options={costCenterOptions}
                                                placeholder="Opcional"
                                                searchPlaceholder="Buscar centro..."
                                                className="h-8 text-xs bg-white"
                                            />
                                        </td>
                                        <td className="px-2 py-2 align-middle">
                                            <Input
                                                type="number"
                                                value={line.debit}
                                                onChange={(e) => updateLine(line.key, "debit", e.target.value)}
                                                className="h-8 text-xs text-right"
                                            />
                                        </td>
                                        <td className="px-2 py-2 align-middle">
                                            <Input
                                                type="number"
                                                value={line.credit}
                                                onChange={(e) => updateLine(line.key, "credit", e.target.value)}
                                                className="h-8 text-xs text-right"
                                            />
                                        </td>
                                        <td className="px-2 py-2 text-center align-middle">
                                            {lines.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLine(line.key)}
                                                    className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button
                        type="button"
                        onClick={addLine}
                        className="text-primary hover:text-primary/80 text-xs font-semibold flex items-center gap-1 transition-colors h-8 px-2 rounded-md hover:bg-muted cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Agregar línea
                    </button>

                    <div className="flex justify-end pt-2 border-t border-slate-100">
                        <div className="w-full sm:w-72 space-y-1.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total débitos</span>
                                <span className="font-semibold text-foreground">$ {totals.debit.toLocaleString("es-CO")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total créditos</span>
                                <span className="font-semibold text-foreground">$ {totals.credit.toLocaleString("es-CO")}</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-slate-100">
                                <span className="text-muted-foreground">Diferencia</span>
                                <span className={`font-semibold ${totals.balanced ? "text-emerald-600" : "text-red-500"}`}>
                                    $ {Math.abs(totals.difference).toLocaleString("es-CO")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-xs text-muted-foreground">Los campos marcados con * son obligatorios</p>

            <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => router.push("/accounting/journal-entries")} className="cursor-pointer">
                    Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={submitting} className="bg-primary hover:bg-primary/90 text-white cursor-pointer">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Guardar
                </Button>
            </div>
        </div>
    );
}
