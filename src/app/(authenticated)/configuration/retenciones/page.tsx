"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditWithholdingAccountsModal } from "@/components/catalogs/EditWithholdingAccountsModal";
import { useWithholdingsList } from "@/hooks/catalogs/useWithholdings";
import type { Withholding } from "@/types/catalogs";

export default function RetencionesPage() {
    const { data: withholdings, isLoading } = useWithholdingsList();
    const [editingWithholding, setEditingWithholding] = useState<Withholding | null>(null);

    return (
        <div className="flex flex-col gap-6 max-w-[1100px] mx-auto py-4">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Retenciones</h1>
                <p className="text-sm text-muted-foreground">
                    Define a qué cuenta del catálogo contable se contabiliza cada retención practicada a un
                    proveedor (por pagar) y sufrida por un cliente (por cobrar).
                </p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-left text-muted-foreground">
                            <th className="font-medium py-3 px-4">Código</th>
                            <th className="font-medium py-3 px-4">Retención</th>
                            <th className="font-medium py-3 px-4">Cuenta por pagar</th>
                            <th className="font-medium py-3 px-4">Cuenta por cobrar</th>
                            <th className="font-medium py-3 px-4 w-20"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={5} className="py-8 px-4 text-center text-muted-foreground">
                                    Cargando retenciones...
                                </td>
                            </tr>
                        )}
                        {!isLoading && (!withholdings || withholdings.length === 0) && (
                            <tr>
                                <td colSpan={5} className="py-8 px-4 text-center text-muted-foreground">
                                    No hay retenciones configuradas.
                                </td>
                            </tr>
                        )}
                        {withholdings?.map((withholding) => (
                            <tr key={withholding.id} className="border-b border-gray-50 last:border-0 hover:bg-muted/20">
                                <td className="py-3 px-4 text-muted-foreground">{withholding.code}</td>
                                <td className="py-3 px-4 font-medium text-foreground">{withholding.name}</td>
                                <td className="py-3 px-4 text-muted-foreground">
                                    {withholding.payable_account
                                        ? `${withholding.payable_account.code} — ${withholding.payable_account.name}`
                                        : <span className="italic">Automática</span>}
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">
                                    {withholding.receivable_account
                                        ? `${withholding.receivable_account.code} — ${withholding.receivable_account.name}`
                                        : <span className="italic">Automática</span>}
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => setEditingWithholding(withholding)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <EditWithholdingAccountsModal
                open={!!editingWithholding}
                onOpenChange={(open) => !open && setEditingWithholding(null)}
                withholding={editingWithholding}
            />
        </div>
    );
}
