"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeftRight,
    Receipt,
    ShoppingBag,
    ClipboardList,
    RotateCcw,
    FileMinus,
    Files,
    FileCheck,
    Truck,
    ShoppingCart,
    BookOpen,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ContactDocuments, ContactDocumentItem } from "@/types/contact";

// Máximo de filas visibles antes de que la tabla haga scroll interno en vez de
// expandir la vista (~48px por fila incluyendo el encabezado sticky).
const TABLE_MAX_HEIGHT = "min(calc(2.75rem + 10 * 2.75rem), 60vh)";

// Un único estilo de badge para el estado, reutilizado en todas las pestañas —
// a diferencia de otros módulos (ej. PurchaseOrderStatusBadge) que colorean por
// estado, acá el detalle de contacto usa un solo estilo consistente para todos
// los tipos de documento.
function StatusBadge({ status }: { status?: string | null }) {
    if (!status) return <span className="text-slate-400">-</span>;
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            {status}
        </span>
    );
}

function ScrollableTable({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full overflow-x-auto">
            <ScrollArea style={{ maxHeight: TABLE_MAX_HEIGHT }}>
                <table className="w-full text-sm text-left">{children}</table>
            </ScrollArea>
        </div>
    );
}

function formatDate(dateStr?: string | null) {
    if (!dateStr) return "-";
    const d = new Date(`${dateStr}T12:00:00`);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatMoney(value?: number) {
    return `$ ${Number(value || 0).toLocaleString("es-CO")}`;
}

function EmptyTabMessage({
    icon,
    message,
    description,
}: {
    icon: React.ReactNode;
    message: string;
    description?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="rounded-full bg-slate-50 p-4 border border-slate-100">{icon}</div>
            <p className="text-slate-600 font-medium text-base">{message}</p>
            {description && <p className="text-slate-400 text-sm max-w-sm">{description}</p>}
        </div>
    );
}

interface ContactDetailTabsProps {
    documents?: ContactDocuments;
}

const emptyDocuments: ContactDocuments = {
    invoices: [],
    credit_notes: [],
    remissions: [],
    quotations: [],
    purchase_orders: [],
    payments: [],
};

type TabType =
    | "transacciones"
    | "facturas"
    | "facturas_proveedor"
    | "documentos_soporte"
    | "devoluciones_ventas"
    | "notas_debito"
    | "notas_debito_clientes"
    | "cotizaciones"
    | "remisiones"
    | "ordenes_compra"
    | "comprobantes_contables"
    | "notas_ajuste";

export function ContactDetailTabs({ documents = emptyDocuments }: ContactDetailTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>("transacciones");
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

    const invoices = documents.invoices || [];
    const creditNotes = documents.credit_notes || [];
    const remissions = documents.remissions || [];
    const quotations = documents.quotations || [];
    const purchaseOrders = documents.purchase_orders || [];
    const payments = documents.payments || [];

    const tabs: { key: TabType; label: string; icon: React.ReactNode; count: number }[] = [
        { key: "transacciones", label: "Transacciones", icon: <ArrowLeftRight className="w-4 h-4" />, count: payments.length },
        { key: "facturas", label: "Facturas", icon: <Receipt className="w-4 h-4" />, count: invoices.length },
        { key: "facturas_proveedor", label: "Facturas de proveedor", icon: <ShoppingBag className="w-4 h-4" />, count: 0 },
        { key: "documentos_soporte", label: "Documentos de soporte", icon: <ClipboardList className="w-4 h-4" />, count: 0 },
        { key: "devoluciones_ventas", label: "Devoluciones en ventas", icon: <RotateCcw className="w-4 h-4" />, count: creditNotes.length },
        { key: "notas_debito", label: "Notas débito", icon: <FileMinus className="w-4 h-4" />, count: 0 },
        { key: "notas_debito_clientes", label: "Notas débito clientes", icon: <Files className="w-4 h-4" />, count: 0 },
        { key: "cotizaciones", label: "Cotizaciones", icon: <FileCheck className="w-4 h-4" />, count: quotations.length },
        { key: "remisiones", label: "Remisiones", icon: <Truck className="w-4 h-4" />, count: remissions.length },
        { key: "ordenes_compra", label: "Órdenes de compra", icon: <ShoppingCart className="w-4 h-4" />, count: purchaseOrders.length },
        { key: "comprobantes_contables", label: "Comprobantes contables", icon: <BookOpen className="w-4 h-4" />, count: 0 },
        { key: "notas_ajuste", label: "Notas de ajuste", icon: <SlidersHorizontal className="w-4 h-4" />, count: 0 },
    ];

    const scrollTabs = (dir: "left" | "right") => {
        scrollRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
    };

    const tableHeadClass = "sticky top-0 z-10 bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100";
    const rowClass = "border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer";

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-center border-b border-slate-100">
                <button
                    type="button"
                    onClick={() => scrollTabs("left")}
                    className="self-stretch w-9 flex-shrink-0 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    aria-label="Desplazar pestañas a la izquierda"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex-1 overflow-x-hidden overflow-y-hidden scroll-smooth"
                >
                    <div className="flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-5 py-4 cursor-pointer whitespace-nowrap transition-all text-sm font-medium ${
                                    activeTab === tab.key
                                        ? "text-primary border-b-2 border-primary -mb-px bg-primary/5"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-b-2 border-transparent"
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                                {tab.count > 0 && (
                                    <span
                                        className={`inline-flex items-center justify-center text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] ${
                                            activeTab === tab.key ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => scrollTabs("right")}
                    className="self-stretch w-9 flex-shrink-0 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    aria-label="Desplazar pestañas a la derecha"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="p-6">
                {activeTab === "transacciones" && (
                    payments.length === 0 ? (
                        <EmptyTabMessage
                            icon={<ArrowLeftRight className="w-10 h-10 text-slate-300" />}
                            message="No tiene transacciones asociadas"
                            description="Los pagos y anticipos registrados con este contacto aparecerán aquí."
                        />
                    ) : (
                        <ScrollableTable>
                            <thead className={tableHeadClass}>
                                <tr>
                                    <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                    <th className="py-3.5 px-4 text-center">Pago #</th>
                                    <th className="py-3.5 px-4 text-center">Tipo</th>
                                    <th className="py-3.5 px-4 text-center">Estado</th>
                                    <th className="py-3.5 px-4 text-center">Método de pago</th>
                                    <th className="py-3.5 px-4 text-right rounded-tr-md">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p: ContactDocumentItem, idx: number) => (
                                    <tr
                                        key={p.id || idx}
                                        className={rowClass}
                                        onClick={() => p.id && router.push(`/payments/${p.id}`)}
                                    >
                                        <td className="py-3.5 px-4 text-slate-800 font-medium">{formatDate(p.payment_date)}</td>
                                        <td className="py-3.5 px-4 text-center text-slate-700 font-medium">{p.number || p.id}</td>
                                        <td className="py-3.5 px-4 text-center text-slate-600">{p.is_advance ? "Anticipo" : "Abono a factura"}</td>
                                        <td className="py-3.5 px-4 text-center"><StatusBadge status={p.status} /></td>
                                        <td className="py-3.5 px-4 text-center text-slate-700">{p.payment_method || "-"}</td>
                                        <td className="py-3.5 px-4 text-right text-slate-700 font-medium">{formatMoney(p.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </ScrollableTable>
                    )
                )}

                {activeTab === "facturas" && (
                    invoices.length === 0 ? (
                        <EmptyTabMessage
                            icon={<Receipt className="w-10 h-10 text-slate-300" />}
                            message="No tiene facturas asociadas"
                            description="Las facturas de venta emitidas a este contacto aparecerán aquí."
                        />
                    ) : (
                        <ScrollableTable>
                            <thead className={tableHeadClass}>
                                <tr>
                                    <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                    <th className="py-3.5 px-4 text-center">Factura #</th>
                                    <th className="py-3.5 px-4 text-center">Estado</th>
                                    <th className="py-3.5 px-4 text-right">Total</th>
                                    <th className="py-3.5 px-4 text-right rounded-tr-md">Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv: ContactDocumentItem, idx: number) => (
                                    <tr
                                        key={inv.id || idx}
                                        className={rowClass}
                                        onClick={() => inv.id && router.push(`/invoices/${inv.id}`)}
                                    >
                                        <td className="py-3.5 px-4 text-slate-800 font-medium">{formatDate(inv.issue_date)}</td>
                                        <td className="py-3.5 px-4 text-center text-slate-800 font-semibold">{inv.number}</td>
                                        <td className="py-3.5 px-4 text-center"><StatusBadge status={inv.status} /></td>
                                        <td className="py-3.5 px-4 text-right text-slate-700 font-medium">{formatMoney(inv.total)}</td>
                                        <td className="py-3.5 px-4 text-right text-slate-700 font-medium">{formatMoney(inv.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </ScrollableTable>
                    )
                )}

                {activeTab === "facturas_proveedor" && (
                    <EmptyTabMessage
                        icon={<ShoppingBag className="w-10 h-10 text-slate-300" />}
                        message="No tiene facturas de proveedor asociadas"
                    />
                )}

                {activeTab === "documentos_soporte" && (
                    <EmptyTabMessage
                        icon={<ClipboardList className="w-10 h-10 text-slate-300" />}
                        message="No tiene documentos de soporte asociados"
                    />
                )}

                {activeTab === "devoluciones_ventas" && (
                    creditNotes.length === 0 ? (
                        <EmptyTabMessage
                            icon={<RotateCcw className="w-10 h-10 text-slate-300" />}
                            message="No tiene devoluciones en ventas asociadas"
                            description="Las notas de crédito emitidas a este contacto aparecerán aquí."
                        />
                    ) : (
                        <ScrollableTable>
                            <thead className={tableHeadClass}>
                                <tr>
                                    <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                    <th className="py-3.5 px-4 text-center">Nota crédito #</th>
                                    <th className="py-3.5 px-4 text-center">Estado</th>
                                    <th className="py-3.5 px-4 text-right rounded-tr-md">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {creditNotes.map((cn: ContactDocumentItem, idx: number) => (
                                    <tr
                                        key={cn.id || idx}
                                        className={rowClass}
                                        onClick={() => cn.id && router.push(`/returns/${cn.id}`)}
                                    >
                                        <td className="py-3.5 px-4 text-slate-800 font-medium">{formatDate(cn.issue_date)}</td>
                                        <td className="py-3.5 px-4 text-center text-slate-800 font-semibold">{cn.number}</td>
                                        <td className="py-3.5 px-4 text-center"><StatusBadge status={cn.status} /></td>
                                        <td className="py-3.5 px-4 text-right text-slate-700 font-medium">{formatMoney(cn.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </ScrollableTable>
                    )
                )}

                {activeTab === "notas_debito" && (
                    <EmptyTabMessage
                        icon={<FileMinus className="w-10 h-10 text-slate-300" />}
                        message="No tiene notas débito asociadas"
                    />
                )}

                {activeTab === "notas_debito_clientes" && (
                    <EmptyTabMessage
                        icon={<Files className="w-10 h-10 text-slate-300" />}
                        message="No tiene notas débito de clientes asociadas"
                    />
                )}

                {activeTab === "cotizaciones" && (
                    quotations.length === 0 ? (
                        <EmptyTabMessage
                            icon={<FileCheck className="w-10 h-10 text-slate-300" />}
                            message="No tiene cotizaciones asociadas"
                            description="Las cotizaciones registradas con este contacto aparecerán aquí."
                        />
                    ) : (
                        <ScrollableTable>
                            <thead className={tableHeadClass}>
                                <tr>
                                    <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                    <th className="py-3.5 px-4 text-center">Cotización #</th>
                                    <th className="py-3.5 px-4 text-center">Estado</th>
                                    <th className="py-3.5 px-4 text-right rounded-tr-md">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotations.map((q: ContactDocumentItem, idx: number) => (
                                    <tr
                                        key={q.id || idx}
                                        className={rowClass}
                                        onClick={() => q.id && router.push(`/quotes/${q.id}`)}
                                    >
                                        <td className="py-3.5 px-4 text-slate-800 font-medium">{formatDate(q.issue_date)}</td>
                                        <td className="py-3.5 px-4 text-center text-slate-800 font-semibold">{q.number}</td>
                                        <td className="py-3.5 px-4 text-center"><StatusBadge status={q.status} /></td>
                                        <td className="py-3.5 px-4 text-right text-slate-700 font-medium">{formatMoney(q.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </ScrollableTable>
                    )
                )}

                {activeTab === "remisiones" && (
                    remissions.length === 0 ? (
                        <EmptyTabMessage
                            icon={<Truck className="w-10 h-10 text-slate-300" />}
                            message="No tiene remisiones asociadas"
                            description="Las remisiones registradas con este contacto aparecerán aquí."
                        />
                    ) : (
                        <ScrollableTable>
                            <thead className={tableHeadClass}>
                                <tr>
                                    <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                    <th className="py-3.5 px-4 text-center">Remisión #</th>
                                    <th className="py-3.5 px-4 text-center">Estado</th>
                                    <th className="py-3.5 px-4 text-right rounded-tr-md">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {remissions.map((r: ContactDocumentItem, idx: number) => (
                                    <tr
                                        key={r.id || idx}
                                        className={rowClass}
                                        onClick={() => r.id && router.push(`/remissions/${r.id}`)}
                                    >
                                        <td className="py-3.5 px-4 text-slate-800 font-medium">{formatDate(r.issue_date)}</td>
                                        <td className="py-3.5 px-4 text-center text-slate-800 font-semibold">{r.number}</td>
                                        <td className="py-3.5 px-4 text-center"><StatusBadge status={r.status} /></td>
                                        <td className="py-3.5 px-4 text-right text-slate-700 font-medium">{formatMoney(r.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </ScrollableTable>
                    )
                )}

                {activeTab === "ordenes_compra" && (
                    purchaseOrders.length === 0 ? (
                        <EmptyTabMessage
                            icon={<ShoppingCart className="w-10 h-10 text-slate-300" />}
                            message="No tiene órdenes de compra asociadas"
                            description="Las órdenes de compra registradas con este contacto aparecerán aquí."
                        />
                    ) : (
                        <ScrollableTable>
                            <thead className={tableHeadClass}>
                                <tr>
                                    <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                    <th className="py-3.5 px-4 text-center">Orden #</th>
                                    <th className="py-3.5 px-4 text-center">Estado</th>
                                    <th className="py-3.5 px-4 text-right rounded-tr-md">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchaseOrders.map((po: ContactDocumentItem, idx: number) => (
                                    <tr
                                        key={po.id || idx}
                                        className={rowClass}
                                        onClick={() => po.id && router.push(`/purchase-orders/${po.id}`)}
                                    >
                                        <td className="py-3.5 px-4 text-slate-800 font-medium">{formatDate(po.issue_date)}</td>
                                        <td className="py-3.5 px-4 text-center text-slate-800 font-semibold">{po.number}</td>
                                        <td className="py-3.5 px-4 text-center"><StatusBadge status={po.status} /></td>
                                        <td className="py-3.5 px-4 text-right text-slate-700 font-medium">{formatMoney(po.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </ScrollableTable>
                    )
                )}

                {activeTab === "comprobantes_contables" && (
                    <EmptyTabMessage
                        icon={<BookOpen className="w-10 h-10 text-slate-300" />}
                        message="No tiene comprobantes contables asociados"
                    />
                )}

                {activeTab === "notas_ajuste" && (
                    <EmptyTabMessage
                        icon={<SlidersHorizontal className="w-10 h-10 text-slate-300" />}
                        message="No tiene notas de ajuste asociadas"
                    />
                )}
            </div>
        </div>
    );
}
