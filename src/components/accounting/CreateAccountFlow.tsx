"use client";

import React from "react";
import { ChevronDown, ChevronRight, Plus, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { showToast } from "@/components/sonner/CustomToaster";
import { useAccountsList, useAccountTypes, useCreateAccount } from "@/hooks/accounting/useAccounting";
import type { ChartAccount } from "@/lib/accounting";

const TIPO_OPTIONS = [
    { value: "movimiento", label: "Cuenta de movimiento" },
    { value: "mayor", label: "Cuenta mayor" },
];

interface CreateAccountFlowProps {
    open: boolean;
    onClose: () => void;
    /** Account type name (e.g. "Ingreso", "Activo", "Costo") the parent-picker tree is scoped to. */
    typeName: string;
    onCreated: (account: { id: number; name: string; code: string }) => void;
}

export function CreateAccountFlow({ open, onClose, typeName, onCreated }: CreateAccountFlowProps) {
    const { data: allAccounts, refetch } = useAccountsList();
    const { data: accountTypes } = useAccountTypes();
    const createAccount = useCreateAccount();

    const [step, setStep] = React.useState<"pick-parent" | "create">("pick-parent");
    const [search, setSearch] = React.useState("");
    const [expanded, setExpanded] = React.useState<Set<number>>(new Set());
    const [parent, setParent] = React.useState<ChartAccount | null>(null);
    const [form, setForm] = React.useState({ code: "", name: "", description: "", tipo: "movimiento" as "movimiento" | "mayor" });

    React.useEffect(() => {
        if (open) {
            setStep("pick-parent");
            setSearch("");
            setParent(null);
            setForm({ code: "", name: "", description: "", tipo: "movimiento" });
        }
    }, [open]);

    const scoped = React.useMemo(
        () => (allAccounts || []).filter((a: any) => a.type === typeName),
        [allAccounts, typeName]
    );

    const childrenByParent = React.useMemo(() => {
        const map = new Map<number | null, ChartAccount[]>();
        scoped.forEach((a: any) => {
            const key = a.parent_id ?? null;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(a);
        });
        return map;
    }, [scoped]);

    const hasChildren = (id: number) => (childrenByParent.get(id)?.length || 0) > 0;

    const toggleExpand = (id: number) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const searchLower = search.trim().toLowerCase();
    const matches = (a: any) =>
        !searchLower || a.name.toLowerCase().includes(searchLower) || (a.code || "").toLowerCase().includes(searchLower);

    const rows = React.useMemo(() => {
        if (searchLower) {
            return scoped.filter(matches).map((a: any) => ({ account: a, depth: 0 }));
        }
        const out: { account: ChartAccount; depth: number }[] = [];
        const visit = (parentId: number | null, depth: number) => {
            const children = childrenByParent.get(parentId) || [];
            children.forEach((a: any) => {
                out.push({ account: a, depth });
                if (expanded.has(a.id)) visit(a.id, depth + 1);
            });
        };
        visit(null, 0);
        return out;
    }, [scoped, childrenByParent, expanded, searchLower]);

    const selectParent = (a: ChartAccount) => {
        setParent(a);
        setForm({ code: "", name: "", description: "", tipo: "movimiento" });
        setStep("create");
    };

    const handleCreate = async () => {
        if (!form.name.trim()) {
            showToast("Completa el nombre de la cuenta", "error");
            return;
        }
        if (!form.code.trim()) {
            showToast("Completa el código de la cuenta", "error");
            return;
        }
        const typeId = (accountTypes || []).find((t: any) => t.name === typeName)?.id;
        if (!typeId) {
            showToast("No fue posible determinar el tipo de cuenta", "error");
            return;
        }
        try {
            const created: any = await createAccount.mutateAsync({
                account_type_id: Number(typeId),
                parent_id: parent?.id,
                code: form.code.trim(),
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                nature: parent?.nature || "debito",
                is_postable: form.tipo !== "mayor",
            });
            await refetch();
            showToast("Cuenta contable creada correctamente", "success");
            if (created?.id) {
                onCreated({ id: created.id, name: created.name ?? form.name, code: created.code ?? form.code });
            }
            onClose();
        } catch (error: any) {
            showToast(error?.message || "Error al crear la cuenta contable", "error");
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            {step === "pick-parent" ? (
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white gap-0">
                    <DialogHeader className="px-6 py-4 border-b border-border/40">
                        <DialogTitle className="text-base font-bold text-[#123159]">Nueva cuenta contable</DialogTitle>
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        <p className="text-sm text-muted-foreground">Selecciona la cuenta bajo la cual vas a crear la nueva.</p>

                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar"
                                className="h-9 pl-9"
                            />
                        </div>

                        <div className="border border-gray-200 rounded-lg max-h-[360px] overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="sticky top-0 bg-gray-50/70">
                                    <tr className="border-b border-gray-200 text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">Nombre de la cuenta</th>
                                        <th className="px-3 py-2 font-medium">Descripción</th>
                                        <th className="w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rows.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-3 py-8 text-center text-slate-400">
                                                Sin cuentas para mostrar
                                            </td>
                                        </tr>
                                    )}
                                    {rows.map(({ account: a, depth }) => {
                                        const expandable = !searchLower && hasChildren(a.id);
                                        const isExpanded = expanded.has(a.id);
                                        return (
                                            <tr key={a.id} className="group hover:bg-gray-50/60">
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center gap-1.5" style={{ paddingLeft: `${depth * 18}px` }}>
                                                        {expandable ? (
                                                            <button onClick={() => toggleExpand(a.id)} className="text-slate-400 hover:text-slate-700 cursor-pointer shrink-0">
                                                                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                                            </button>
                                                        ) : (
                                                            <span className="w-3.5 h-3.5 shrink-0" />
                                                        )}
                                                        {a.code && (
                                                            <span className="text-[11px] font-medium text-primary bg-primary/10 rounded px-1.5 py-0.5">{a.code}</span>
                                                        )}
                                                        <span className="text-slate-800">{a.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-slate-500">{a.description || "-"}</td>
                                                <td className="px-3 py-2 text-right">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => selectParent(a)}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 inline-flex items-center justify-center rounded-md border border-gray-200 text-slate-500 hover:border-primary hover:text-primary cursor-pointer"
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="text-xs">Agregar subcuenta</TooltipContent>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 bg-white border border-border hover:bg-muted text-foreground text-sm font-bold rounded-xl transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </div>
                </DialogContent>
            ) : (
                <DialogContent className="max-w-sm p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
                    <DialogHeader className="px-6 py-4 border-b border-border/40 bg-[#f8fafc]">
                        <DialogTitle className="text-base font-bold text-[#123159]">Crear cuenta contable</DialogTitle>
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        {parent && (
                            <div className="inline-flex items-center gap-1 text-xs bg-gray-100 text-foreground rounded-full px-3 py-1.5">
                                Se creará bajo <span className="font-semibold">{parent.name}</span>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Nombre <span className="text-primary">*</span></label>
                            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-9" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Código</label>
                            <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="Ej. 413510" className="h-9" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Tipo de cuenta <span className="text-primary">*</span></label>
                            <SearchableSelect
                                value={form.tipo}
                                onValueChange={(v) => setForm((f) => ({ ...f, tipo: v as "movimiento" | "mayor" }))}
                                options={TIPO_OPTIONS}
                                className="h-9 w-full"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Naturaleza <span className="text-primary">*</span></label>
                            <div className="h-9 flex items-center px-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-muted-foreground">
                                {(parent?.nature ?? "debito") === "debito" ? "Deudora" : "Acreedora"}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Descripción</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                rows={3}
                                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex justify-end gap-3 rounded-b-2xl">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 bg-white border border-border hover:bg-muted text-foreground text-sm font-bold rounded-xl transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={createAccount.isPending}
                            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-primary/20 cursor-pointer disabled:opacity-60"
                        >
                            {createAccount.isPending ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </DialogContent>
            )}
        </Dialog>
    );
}
