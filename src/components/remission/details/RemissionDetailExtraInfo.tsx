"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface RemissionDetailExtraInfoProps {
    remission: any;
    invoices?: any[];
    quotes?: any[];
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="flex justify-between items-center px-6 py-3 border-b border-slate-100 last:border-b-0">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-800 font-medium">{value}</span>
        </div>
    );
}

export function RemissionDetailExtraInfo({ remission, invoices = [], quotes = [] }: RemissionDetailExtraInfoProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"invoices" | "quotes">("invoices");

    const sellerName = remission.seller?.name || remission.vendor?.name || "No asignado";
    const priceListName = remission.price_list?.name || remission.priceList?.name || "General";
    const warehouseName = remission.warehouse?.name || remission.selected_warehouse?.name || "Principal";
    const costCenterName = remission.cost_center?.name || remission.costCenter?.name || "No asignado";

    const hasInvoices = invoices && invoices.length > 0;
    const hasQuotes = quotes && quotes.length > 0;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <InfoRow label="Vendedor" value={sellerName} />
                <InfoRow label="Lista de precios" value={priceListName} />
                <InfoRow label="Bodega" value={warehouseName} />
                <InfoRow label="Centro de costo" value={costCenterName} />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="flex border-b border-slate-100">
                    <button
                        type="button"
                        onClick={() => setActiveTab("invoices")}
                        className={`px-6 py-4 font-medium cursor-pointer transition-colors ${activeTab === "invoices" ? "text-primary border-b-2 border-primary" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Facturas
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("quotes")}
                        className={`px-6 py-4 font-medium cursor-pointer transition-colors ${activeTab === "quotes" ? "text-primary border-b-2 border-primary" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Cotizaciones
                    </button>
                </div>

                {activeTab === "invoices" ? (
                    hasInvoices ? (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                    <tr>
                                        <th className="py-3.5 px-6">Fecha</th>
                                        <th className="py-3.5 px-6 text-center">Factura #</th>
                                        <th className="py-3.5 px-6 text-center">Estado</th>
                                        <th className="py-3.5 px-6 text-right">Total</th>
                                        <th className="py-3.5 px-6">Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((inv: any, idx: number) => (
                                        <tr
                                            key={inv.id || idx}
                                            className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer"
                                            onClick={() => inv.id && router.push(`/sales/invoices/${inv.id}`)}
                                        >
                                            <td className="py-3.5 px-6 text-slate-700">{inv.created_at || inv.issue_date || '-'}</td>
                                            <td className="py-3.5 px-6 text-center text-slate-700 font-medium">{inv.prefix || ''}{inv.number || inv.id}</td>
                                            <td className="py-3.5 px-6 text-center text-slate-700">{inv.invoice_status?.name || inv.status?.name || inv.status || '-'}</td>
                                            <td className="py-3.5 px-6 text-right text-slate-700 font-medium">$ {Number(inv.total || 0).toLocaleString('es-CO')}</td>
                                            <td className="py-3.5 px-6 text-slate-500">{inv.notes || inv.observation || inv.observations || ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-slate-400 text-center py-10">
                            No tiene facturas asociadas
                        </div>
                    )
                ) : (
                    hasQuotes ? (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                    <tr>
                                        <th className="py-3.5 px-6">Fecha</th>
                                        <th className="py-3.5 px-6 text-center">Cotización #</th>
                                        <th className="py-3.5 px-6 text-center">Estado</th>
                                        <th className="py-3.5 px-6 text-right">Total</th>
                                        <th className="py-3.5 px-6">Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotes.map((q: any, idx: number) => (
                                        <tr
                                            key={q.id || idx}
                                            className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer"
                                            onClick={() => q.id && router.push(`/sales/quotes/${q.id}`)}
                                        >
                                            <td className="py-3.5 px-6 text-slate-700">{q.created_at || q.issue_date || '-'}</td>
                                            <td className="py-3.5 px-6 text-center text-slate-700 font-medium">{q.prefix || ''}{q.number || q.id}</td>
                                            <td className="py-3.5 px-6 text-center text-slate-700">{q.quotation_status?.name || q.status?.name || q.status || '-'}</td>
                                            <td className="py-3.5 px-6 text-right text-slate-700 font-medium">$ {Number(q.total || 0).toLocaleString('es-CO')}</td>
                                            <td className="py-3.5 px-6 text-slate-500">{q.notes || q.observation || q.observations || ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-slate-400 text-center py-10">
                            No tiene cotizaciones asociadas
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
