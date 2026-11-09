"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditTaxAccountsModal } from "@/components/catalogs/EditTaxAccountsModal";
import { useTaxesList } from "@/hooks/catalogs/useTaxes";
import type { Tax } from "@/types/catalogs";

export default function ImpuestosPage() {
    const { data: taxes, isLoading } = useTaxesList();
    const [editingTax, setEditingTax] = useState<Tax | null>(null);

    return (
        <div className="flex flex-col gap-6 max-w-[1100px] mx-auto py-4">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Impuestos</h1>
                <p className="text-sm text-muted-foreground">
                    Define a qué cuenta del catálogo contable se contabiliza cada impuesto generado en ventas
                    (por pagar) y recuperado en compras (descontable).
                </p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-left text-muted-foreground">
                            <th className="font-medium py-3 px-4">Código</th>
                            <th className="font-medium py-3 px-4">Impuesto</th>
                            <th className="font-medium py-3 px-4">Cuenta por pagar</th>
                            <th className="font-medium py-3 px-4">Cuenta descontable</th>
                            <th className="font-medium py-3 px-4 w-20"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={5} className="py-8 px-4 text-center text-muted-foreground">
                                    Cargando impuestos...
                                </td>
                            </tr>
                        )}
                        {!isLoading && (!taxes || taxes.length === 0) && (
                            <tr>
                                <td colSpan={5} className="py-8 px-4 text-center text-muted-foreground">
                                    No hay impuestos configurados.
                                </td>
                            </tr>
                        )}
                        {taxes?.map((tax) => (
                            <tr key={tax.id} className="border-b border-gray-50 last:border-0 hover:bg-muted/20">
                                <td className="py-3 px-4 text-muted-foreground">{tax.code}</td>
                                <td className="py-3 px-4 font-medium text-foreground">{tax.name}</td>
                                <td className="py-3 px-4 text-muted-foreground">
                                    {tax.payable_account
                                        ? `${tax.payable_account.code} — ${tax.payable_account.name}`
                                        : <span className="italic">Automática</span>}
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">
                                    {tax.discountable_account
                                        ? `${tax.discountable_account.code} — ${tax.discountable_account.name}`
                                        : <span className="italic">Automática</span>}
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => setEditingTax(tax)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <EditTaxAccountsModal
                open={!!editingTax}
                onOpenChange={(open) => !open && setEditingTax(null)}
                tax={editingTax}
            />
        </div>
    );
}
