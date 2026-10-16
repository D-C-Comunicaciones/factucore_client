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
import { useAccountsList, useAccountUsages, useUpdateAccountUsage } from "@/hooks/accounting/useAccounting";

interface AutomaticBehaviorsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * "Comportamientos automáticos" fuera del wizard de importación — fija
 * AccountUsage.default_account_id directamente contra cuentas ya persistidas (a diferencia del
 * wizard, que solo puede mapear contra códigos del catálogo que se está importando).
 */
export function AutomaticBehaviorsModal({ open, onOpenChange }: AutomaticBehaviorsModalProps) {
    const { data: usages, isLoading: usagesLoading } = useAccountUsages();
    const { data: accountsData } = useAccountsList({ postable_only: true });
    const accountOptions = (accountsData ?? []).map((a: any) => ({ value: String(a.id), label: `${a.code} — ${a.name}` }));
    const updateMutation = useUpdateAccountUsage();

    const [selections, setSelections] = useState<Record<number, string>>({});

    useEffect(() => {
        if (open && usages) {
            const initial: Record<number, string> = {};
            usages.forEach((u: any) => {
                initial[u.id] = u.default_account_id ? String(u.default_account_id) : "";
            });
            setSelections(initial);
        }
    }, [open, usages]);

    const handleSave = async () => {
        const changed = (usages ?? []).filter(
            (u: any) => (selections[u.id] || "") !== (u.default_account_id ? String(u.default_account_id) : "")
        );

        if (changed.length === 0) {
            onOpenChange(false);
            return;
        }

        try {
            await Promise.all(
                changed.map((u: any) =>
                    updateMutation.mutateAsync({
                        id: u.id,
                        defaultAccountId: selections[u.id] ? Number(selections[u.id]) : null,
                    })
                )
            );
            showToast("Comportamientos automáticos actualizados", "success");
            onOpenChange(false);
        } catch (error: any) {
            showToast(error?.response?.data?.message || error?.message || "No se pudieron guardar los cambios", "error");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[640px] bg-white max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Parametrización contable</DialogTitle>
                    <DialogDescription>
                        Define qué cuenta usa cada registro automático (ventas, bancos, gastos, etc.) cuando
                        ningún ítem o línea indica una cuenta puntual. Déjalo vacío para usar la cuenta de menor
                        código que tenga ese uso contable.
                    </DialogDescription>
                </DialogHeader>

                <div className="divide-y divide-border py-2">
                    {usagesLoading && (
                        <p className="text-sm text-muted-foreground py-4 text-center">Cargando...</p>
                    )}
                    {!usagesLoading && (usages ?? []).map((usage: any) => (
                        <div key={usage.id} className="flex items-center gap-4 py-2.5">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{usage.name}</p>
                                {usage.description && (
                                    <p className="text-xs text-muted-foreground truncate">{usage.description}</p>
                                )}
                            </div>
                            <div className="w-64 shrink-0">
                                <SearchableSelect
                                    value={selections[usage.id] || ""}
                                    onValueChange={(val) => setSelections((prev) => ({ ...prev, [usage.id]: val }))}
                                    options={[{ value: "", label: "Automática (código más bajo)" }, ...accountOptions]}
                                    placeholder="Automática"
                                    searchPlaceholder="Buscar cuenta..."
                                    className="h-8 text-xs bg-white"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Cancelar</Button>
                    <Button
                        onClick={handleSave}
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
