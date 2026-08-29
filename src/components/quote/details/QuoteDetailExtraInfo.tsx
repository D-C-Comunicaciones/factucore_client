import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface QuoteDetailExtraInfoProps {
    quote: any;
    invoices?: any[];
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="flex justify-between items-center px-6 py-3 border-b border-slate-100 last:border-b-0">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-800 font-medium">{value}</span>
        </div>
    );
}

export function QuoteDetailExtraInfo({ quote, invoices = [] }: QuoteDetailExtraInfoProps) {
    const router = useRouter();

    const sellerName = quote.seller?.name || quote.vendor?.name || "No asignado";
    const priceListName = quote.price_list?.name || quote.priceList?.name || "General";
    const warehouseName = quote.warehouse?.name || quote.selected_warehouse?.name || "Principal";
    const costCenterName = quote.cost_center?.name || quote.costCenter?.name || "No asignado";

    const hasInvoices = invoices && invoices.length > 0;

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
                    <div className="px-6 py-4 font-medium text-primary border-b-2 border-primary">
                        Facturas
                    </div>
                </div>

                {hasInvoices ? (
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
                )}
            </div>
        </div>
    );
}
