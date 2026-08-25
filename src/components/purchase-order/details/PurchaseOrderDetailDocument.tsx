"use client";

import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { PurchaseOrder, PurchaseOrderContact, PurchaseOrderLine } from "@/types/purchaseOrder";

function contactName(contact?: PurchaseOrderContact | string | null): string {
    if (!contact) return "NO ESPECIFICADO";
    if (typeof contact === "string") return contact;
    return (
        contact.registration_name ||
        `${contact.first_name || ""} ${contact.last_name || ""}`.trim() ||
        contact.name ||
        "NO ESPECIFICADO"
    );
}

export function PurchaseOrderDetailDocument({ purchaseOrder }: { purchaseOrder: PurchaseOrder }) {
    const contact = typeof purchaseOrder.contact === "object" ? purchaseOrder.contact : undefined;
    const lines: PurchaseOrderLine[] = purchaseOrder.lines || purchaseOrder.items || [];
    const hasBackendTotals = purchaseOrder.total !== undefined;

    const grossSubtotal = Number(purchaseOrder.line_extension_amount || 0);
    const discountTotal = Number(purchaseOrder.discount_total || 0);
    const chargeTotal = Number(purchaseOrder.charge_total || 0);
    const taxTotal = Number(purchaseOrder.tax_total || 0);
    const total = Number(
        purchaseOrder.total ?? lines.reduce((sum, l) => sum + (l.line_total ?? Number(l.quantity || 0) * Number(l.unit_price || 0)), 0)
    );

    return (
        <div className="filter drop-shadow-sm">
            <div
                className="bg-white rounded-lg border border-slate-200 relative overflow-hidden"
                style={{ clipPath: "polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)" }}
            >
                {/* Folded Corner Effect */}
                <div
                    className="absolute top-0 right-0 w-10 h-10 pointer-events-none"
                    style={{ filter: "drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.08))" }}
                >
                    <div
                        className="w-full h-full bg-gradient-to-bl from-slate-200 via-slate-100 to-white border-l border-b border-slate-200/80"
                        style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
                    />
                </div>

                <div className="p-10">
                    {/* Info */}
                    <div className="mb-10 text-slate-600">
                        <h3 className="font-bold text-slate-800 mb-4">Información de la orden de compra</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <div className="font-bold text-slate-700 mb-1">Cliente</div>
                                {contact?.id ? (
                                    <Link
                                        href={`/contacts/${contact.id}`}
                                        className="font-medium text-slate-800 underline cursor-pointer hover:bg-slate-100 px-2 py-1 rounded -ml-2 transition-colors inline-block w-fit"
                                    >
                                        {contactName(purchaseOrder.contact)}
                                    </Link>
                                ) : (
                                    <span className="font-medium text-slate-800">{contactName(purchaseOrder.contact)}</span>
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-slate-700 mb-1">Identificación</div>
                                <span>{contact?.identification_number || "—"}</span>
                            </div>
                            <div>
                                <div className="font-bold text-slate-700 mb-1">Fecha de emisión</div>
                                <span>{purchaseOrder.issue_date || "—"}</span>
                            </div>
                            <div>
                                <div className="font-bold text-slate-700 mb-1">N° orden del cliente</div>
                                <span>{purchaseOrder.reference || "—"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <h3 className="font-bold text-slate-800 mb-4">Ítems</h3>
                    <div className="mb-10 relative overflow-x-auto border-b border-gray-200">
                        <Table className="[&_td]:border-b-0">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="text-slate-900 uppercase font-bold border-l border-gray-200">ÍTEM</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-center">CANTIDAD</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right">PRECIO UNITARIO</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right">DESCUENTO</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right">IMPUESTO</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right border-r border-gray-200">TOTAL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lines.map((item, idx) => {
                                    const discount = (item.discounts || item.allowance_charges || [])[0] as any;
                                    const tax = (item.taxes || [])[0] as any;
                                    const lineTotal = item.line_total ?? Number(item.quantity || 0) * Number(item.unit_price || 0);
                                    const taxName = tax?.name || "";
                                    const taxLabel = tax ? (taxName.includes("%") ? taxName : `${taxName} ${Number(tax.rate ?? 0)}%`) : "—";

                                    return (
                                        <TableRow key={item.id ?? idx} className="hover:bg-transparent border-0 border-b-0">
                                            <TableCell className="border-l border-gray-200">
                                                <div className="flex flex-col pl-2">
                                                    <span className="text-slate-800 font-medium">
                                                        {item.name || item.reference || `Ítem ${idx + 1}`}
                                                    </span>
                                                    {item.description && <span className="text-slate-500 text-xs">{item.description}</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">{Number(item.quantity)}</TableCell>
                                            <TableCell className="text-right">$ {Number(item.unit_price || 0).toLocaleString("es-CO")}</TableCell>
                                            <TableCell className="text-right">
                                                {discount ? (
                                                    discount.value_type === "percentage" ? (
                                                        `${discount.value}%`
                                                    ) : (
                                                        `- $ ${Number(discount.value).toLocaleString("es-CO")}`
                                                    )
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {tax ? taxLabel : <span className="text-slate-400">—</span>}
                                            </TableCell>
                                            <TableCell className="text-right border-r border-gray-200 font-medium">
                                                $ {Number(lineTotal).toLocaleString("es-CO")}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {lines.length === 0 && (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={6} className="h-24 text-center text-slate-400 border-l border-r border-gray-200">
                                            No hay ítems en esta orden de compra
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end text-slate-600 border-t border-slate-100 pt-8">
                        <div className="w-1/3 space-y-3 text-right">
                            {hasBackendTotals && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span>$ {grossSubtotal.toLocaleString("es-CO")}</span>
                                    </div>
                                    {discountTotal > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Descuentos</span>
                                            <span className="text-red-500">- $ {discountTotal.toLocaleString("es-CO")}</span>
                                        </div>
                                    )}
                                    {chargeTotal > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Cargos</span>
                                            <span>$ {chargeTotal.toLocaleString("es-CO")}</span>
                                        </div>
                                    )}
                                    {taxTotal > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Impuestos</span>
                                            <span>$ {taxTotal.toLocaleString("es-CO")}</span>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="flex justify-between items-center font-bold text-slate-800 pt-3 border-t border-slate-200">
                                <span className="text-xl font-normal text-slate-600">Total</span>
                                <span className="text-2xl">$ {total.toLocaleString("es-CO")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="flex justify-end mt-10 text-sm text-slate-600">
                        <div className="w-1/2">
                            <h3 className="text-black font-bold mb-2 text-xs uppercase">Notas:</h3>
                            <div className="bg-gray-50 rounded-md p-3 text-xs text-black leading-relaxed min-h-[60px] border border-gray-200 whitespace-pre-wrap">
                                {purchaseOrder.notes || "—"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
