"use client";

import { useState } from "react";
import { FileText, CreditCard, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

// ─────────────────── helpers ───────────────────
function EmptyTabMessage({ icon, message, description }: { icon: React.ReactNode; message: string; description: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="opacity-40">{icon}</div>
            <p className="text-sm font-semibold text-slate-600">{message}</p>
            <p className="text-xs text-slate-400 max-w-xs">{description}</p>
        </div>
    );
}

// ─────────────────── props ───────────────────
interface SupportDocumentDetailTabsProps {
    doc: any;
}

// ─────────────────── component ───────────────────
export function SupportDocumentDetailTabs({ doc }: SupportDocumentDetailTabsProps) {
    const router = useRouter();

    // Extract related data
    const adjustmentNotes: any[] = doc?.adjustment_notes || doc?.credit_notes || doc?.adjustments || [];
    const payments: any[] = doc?.payments || [];
    const purchaseOrders: any[] = doc?.purchase_orders || doc?.purchaseOrders || [];

    const tabs = [
        {
            key: "notas_ajuste",
            label: "Notas de Ajuste",
            icon: <FileText className="w-4 h-4" />,
            count: adjustmentNotes.length,
        },
        {
            key: "pagos",
            label: "Pagos",
            icon: <CreditCard className="w-4 h-4" />,
            count: payments.length,
        },
        {
            key: "ordenes_compra",
            label: "Órdenes de Compra",
            icon: <ShoppingCart className="w-4 h-4" />,
            count: purchaseOrders.length,
        },
    ];

    const [activeTab, setActiveTab] = useState("notas_ajuste");

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            {/* Tab headers */}
            <div className="flex flex-wrap border-b border-slate-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`
                            flex items-center gap-2 px-5 py-4 cursor-pointer whitespace-nowrap transition-all text-sm font-medium
                            ${activeTab === tab.key
                                ? 'text-primary border-b-2 border-primary -mb-px bg-primary/5'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-b-2 border-transparent'
                            }
                        `}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                            <span className={`
                                inline-flex items-center justify-center text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[20px]
                                ${activeTab === tab.key
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }
                            `}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="p-6">

                {/* ── NOTAS DE AJUSTE ── */}
                {activeTab === "notas_ajuste" && (
                    adjustmentNotes.length === 0 ? (
                        <EmptyTabMessage
                            icon={<FileText className="w-10 h-10 text-slate-300" />}
                            message="Sin registros aún"
                            description="Las notas de ajuste vinculadas a este documento soporte aparecerán aquí."
                        />
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                    <tr>
                                        <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                        <th className="py-3.5 px-4 text-center">Número</th>
                                        <th className="py-3.5 px-4 text-center">Estado DIAN</th>
                                        <th className="py-3.5 px-4 text-right rounded-tr-md">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adjustmentNotes.map((note: any, idx: number) => (
                                        <tr
                                            key={note.id || idx}
                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                                            onClick={() => note.id && router.push(`/expenses/adjustment-notes/${note.id}`)}
                                        >
                                            <td className="py-3.5 px-4 text-slate-800 font-medium">
                                                {note.operation_date || note.issue_date || note.created_at || "-"}
                                            </td>
                                            <td className="py-3.5 px-4 text-center text-primary font-semibold">
                                                {(note.prefix || "") + (note.number || note.id || "-")}
                                            </td>
                                            <td className="py-3.5 px-4 text-center text-slate-600">
                                                {note.status_dian || note.dian_status || "-"}
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                                                $ {Number(note.total || note.payable_amount || 0).toLocaleString("es-CO")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

                {/* ── PAGOS ── */}
                {activeTab === "pagos" && (
                    payments.length === 0 ? (
                        <EmptyTabMessage
                            icon={<CreditCard className="w-10 h-10 text-slate-300" />}
                            message="Sin registros aún"
                            description="Los pagos registrados para este documento soporte aparecerán aquí."
                        />
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                    <tr>
                                        <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                        <th className="py-3.5 px-4 text-center">Pago #</th>
                                        <th className="py-3.5 px-4 text-center">Método</th>
                                        <th className="py-3.5 px-4 text-right rounded-tr-md">Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((p: any, idx: number) => (
                                        <tr
                                            key={p.id || idx}
                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3.5 px-4 text-slate-800 font-medium">
                                                {p.payment_date || p.date || p.created_at || "-"}
                                            </td>
                                            <td className="py-3.5 px-4 text-center text-slate-700 font-medium">
                                                {p.prefix != null ? `${p.prefix}${p.number}` : (p.number || p.id || "-")}
                                            </td>
                                            <td className="py-3.5 px-4 text-center text-slate-700">
                                                {p.payment_method?.name || p.payment_method || "Efectivo"}
                                            </td>
                                            <td className="py-3.5 px-4 text-right text-slate-700 font-medium">
                                                $ {Number(p.amount || p.total || p.value || 0).toLocaleString("es-CO")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

                {/* ── ÓRDENES DE COMPRA ── */}
                {activeTab === "ordenes_compra" && (
                    purchaseOrders.length === 0 ? (
                        <EmptyTabMessage
                            icon={<ShoppingCart className="w-10 h-10 text-slate-300" />}
                            message="Sin registros aún"
                            description="Las órdenes de compra vinculadas a este documento soporte aparecerán aquí."
                        />
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                    <tr>
                                        <th className="py-3.5 px-4 rounded-tl-md">Referencia</th>
                                        <th className="py-3.5 px-4 text-center">Estado</th>
                                        <th className="py-3.5 px-4 text-right rounded-tr-md">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseOrders.map((po: any, idx: number) => (
                                        <tr
                                            key={po.id || idx}
                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                                            onClick={() => po.id && router.push(`/expenses/purchase-orders/${po.id}`)}
                                        >
                                            <td className="py-3.5 px-4 text-primary font-semibold">
                                                {po.reference || `${po.prefix || ""}${po.number || po.id}`}
                                            </td>
                                            <td className="py-3.5 px-4 text-center text-slate-600">
                                                {po.status?.name || po.status || "-"}
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                                                $ {Number(po.total || 0).toLocaleString("es-CO")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

            </div>
        </div>
    );
}
