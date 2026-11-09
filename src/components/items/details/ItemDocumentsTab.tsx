"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    ChevronRight, ChevronLeft,
    FileText, Truck, FileCheck, Receipt, FileMinus, FileEdit,
    ShoppingCart, ArrowLeftRight, FileX,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItemResponse } from "@/types/items";

/* ─── Tabs config ──────────────────────────────────────────── */
interface TabConfig {
    key: string;
    label: string;
    dataKey: keyof ItemResponse["transactions"];
    fallbackDataKey?: keyof ItemResponse["transactions"];
    route?: (id: number | string) => string;
    icon: LucideIcon;
    emptyMessage: string;
    emptyDescription: string;
}

const TABS: TabConfig[] = [
    {
        key: "ventas", label: "Facturas de venta", dataKey: "invoices",
        route: (id) => `/sales/invoices/${id}`, icon: FileText,
        emptyMessage: "No tiene facturas de venta asociadas",
        emptyDescription: "Las facturas de venta generadas para este ítem aparecerán aquí.",
    },
    {
        key: "compras", label: "Facturas de compras", dataKey: "purchaseInvoices",
        icon: Receipt,
        emptyMessage: "No tiene facturas de compra asociadas",
        emptyDescription: "Las facturas de compra registradas para este ítem aparecerán aquí.",
    },
    {
        key: "soporte", label: "Documentos soporte", dataKey: "supportDocuments",
        icon: FileCheck,
        emptyMessage: "No tiene documentos soporte asociados",
        emptyDescription: "Los documentos soporte relacionados con este ítem aparecerán aquí.",
    },
    {
        key: "credito", label: "Notas de crédito", dataKey: "creditNotes",
        route: (id) => `/sales/returns/${id}`, icon: FileMinus,
        emptyMessage: "No tiene notas de crédito asociadas",
        emptyDescription: "Las notas de crédito emitidas para este ítem aparecerán aquí.",
    },
    {
        key: "debito", label: "Notas débito", dataKey: "debitNotes",
        icon: FileEdit,
        emptyMessage: "No tiene notas débito asociadas",
        emptyDescription: "Las notas débito registradas para este ítem aparecerán aquí.",
    },
    {
        key: "debito_clientes", label: "Notas débito clientes", dataKey: "customerDebitNotes",
        icon: FileEdit,
        emptyMessage: "No tiene notas débito de clientes asociadas",
        emptyDescription: "Las notas débito de clientes relacionadas con este ítem aparecerán aquí.",
    },
    {
        key: "cotizaciones", label: "Cotizaciones", dataKey: "quotations",
        route: (id) => `/sales/quotes/${id}`, icon: FileCheck,
        emptyMessage: "No tiene cotizaciones asociadas",
        emptyDescription: "Las cotizaciones que incluyen este ítem aparecerán aquí.",
    },
    {
        key: "remisiones", label: "Remisiones", dataKey: "remissions", fallbackDataKey: "deliveryNotes",
        route: (id) => `/sales/remissions/${id}`, icon: Truck,
        emptyMessage: "No tiene remisiones asociadas",
        emptyDescription: "Las remisiones que incluyen este ítem aparecerán aquí.",
    },
    {
        key: "ordenes", label: "Órdenes de compra", dataKey: "purchaseOrders",
        icon: ShoppingCart,
        emptyMessage: "No tiene órdenes de compra asociadas",
        emptyDescription: "Las órdenes de compra relacionadas con este ítem aparecerán aquí.",
    },
    {
        key: "transferencias", label: "Transferencias", dataKey: "inventoryTransfers",
        icon: ArrowLeftRight,
        emptyMessage: "No tiene transferencias asociadas",
        emptyDescription: "Las transferencias de inventario de este ítem aparecerán aquí.",
    },
    {
        key: "ajuste", label: "Notas de ajuste", dataKey: "adjustmentNotes",
        icon: FileX,
        emptyMessage: "No tiene notas de ajuste asociadas",
        emptyDescription: "Las notas de ajuste de inventario para este ítem aparecerán aquí.",
    },
];

/* ─── Helpers ──────────────────────────────────────────────── */
function toSnakeCase(key: string): string {
    return key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

function singularKey(key: string): string {
    const snake = toSnakeCase(key);
    return snake.endsWith("s") ? snake.slice(0, -1) : snake;
}

function resolveDoc(tx: any, dataKey: string): any {
    if (!tx) return tx;
    // El backend anida el documento bajo la clave singular en snake_case
    // (ej. creditNotes -> credit_note, invoices -> invoice, quotations -> quotation).
    const nested = tx[singularKey(dataKey)] ?? tx[dataKey.replace(/s$/, "")];
    return nested ?? tx;
}

function getClientName(doc: any): string {
    if (!doc) return "-";
    const contact = doc.contact;
    if (contact?.registration_name) return contact.registration_name;
    const fullName = [contact?.first_name, contact?.last_name].filter(Boolean).join(" ");
    if (fullName) return fullName;
    const snapshotName = doc.invoice_snapshot?.template_data?.customer?.name;
    if (snapshotName) return snapshotName;
    return "-";
}

function getDocNumber(doc: any): string {
    if (!doc) return "-";
    if (doc.prefix) return `${doc.prefix}${doc.number ?? doc.id ?? ""}`;
    return String(doc.number ?? doc.id ?? "-");
}

function getDocDate(doc: any): string {
    return doc?.issue_date || doc?.created_at || "-";
}

function getDocTotal(doc: any, tx: any): number {
    return Number(doc?.total ?? doc?.payable_amount ?? tx?.total_line ?? 0);
}

function getDocStatus(doc: any): string | null {
    const named =
        doc?.quotation_status?.name ||
        doc?.remission_status?.name ||
        doc?.invoice_status?.name ||
        doc?.credit_note_status?.name ||
        doc?.status;
    if (named) return named;

    // Sin nombre de estado resuelto por el backend: se infiere del estado DIAN,
    // usando el mismo vocabulario que ya usa el módulo de facturas (InvoiceDianStatus).
    if (doc?.dian_rejection_reason) return "Rechazada";
    if (doc?.dian_status_id === 1) return "No electrónica";
    if (doc?.dian_status_id != null) return "Emitida";
    return null;
}

function formatMoney(value: number): string {
    return `$${value.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}

const SCROLL_STEP = 180;

/* ─── Component ────────────────────────────────────────────── */
export function ItemDocumentsTab({ item }: { item: ItemResponse }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = React.useState(TABS[0].key);
    const [canLeft, setCanLeft] = React.useState(false);
    const [canRight, setCanRight] = React.useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const sync = React.useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 2);
        setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    }, []);

    React.useEffect(() => {
        const id = setTimeout(sync, 50);
        const el = scrollRef.current;
        if (!el) return () => clearTimeout(id);
        el.addEventListener("scroll", sync, { passive: true });
        window.addEventListener("resize", sync);
        return () => {
            clearTimeout(id);
            el.removeEventListener("scroll", sync);
            window.removeEventListener("resize", sync);
        };
    }, [sync]);

    const scrollLeft = () => scrollRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" });
    const scrollRight = () => scrollRef.current?.scrollBy({ left: SCROLL_STEP, behavior: "smooth" });

    const config = TABS.find((t) => t.key === activeTab) ?? TABS[0];
    const EmptyIcon = config.icon;

    const rows = React.useMemo(() => {
        const transactions = item?.transactions as any;
        let list = transactions?.[config.dataKey] ?? [];
        if ((!list || list.length === 0) && config.fallbackDataKey) {
            list = transactions?.[config.fallbackDataKey] ?? [];
        }
        return Array.isArray(list) ? list : [];
    }, [item, config]);

    return (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm mb-4"
             style={{ maxWidth: "100%", overflow: "hidden" }}>

            {/* ── TAB BAR ── */}
            <div className="border-b border-slate-200 flex items-stretch h-12 px-3" style={{ minWidth: 0 }}>
                <button
                    type="button"
                    onClick={scrollLeft}
                    aria-label="Anterior"
                    className={cn(
                        "flex-shrink-0 w-8 h-8 self-center flex items-center justify-center rounded-lg bg-transparent text-slate-600 hover:bg-[#EBEEF2] hover:text-primary transition-all mr-2 cursor-pointer",
                        canLeft ? "opacity-100 scale-100" : "opacity-0 scale-90 w-0 mr-0 border-none overflow-hidden"
                    )}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex flex-nowrap overflow-x-auto hide-scrollbar"
                    style={{
                        flex: "1 1 0%",
                        minWidth: 0,
                        scrollbarWidth: "none",
                        // @ts-ignore
                        msOverflowStyle: "none",
                    }}
                >
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "px-4 h-full flex items-center gap-1.5 justify-center whitespace-nowrap border-b-2 flex-shrink-0 text-[13px] font-medium transition-all duration-200 cursor-pointer",
                                activeTab === tab.key
                                    ? "text-primary border-primary"
                                    : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"
                            )}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={scrollRight}
                    aria-label="Siguiente"
                    className={cn(
                        "flex-shrink-0 w-8 h-8 self-center flex items-center justify-center rounded-lg bg-transparent text-slate-600 hover:bg-[#EBEEF2] hover:text-primary transition-all ml-2 cursor-pointer",
                        canRight ? "opacity-100 scale-100" : "opacity-0 scale-90 w-0 ml-0 border-none overflow-hidden"
                    )}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* ── CONTENT ── */}
            <div className="p-4">
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    {rows.length > 0 ? (
                        <div className="w-full overflow-x-auto hide-scrollbar">
                            <table className="w-full text-left border-collapse text-[13px]">
                                <thead className="bg-slate-50/80 border-b border-slate-200">
                                    <tr>
                                        <th className="py-3 px-4 font-semibold text-slate-500 whitespace-nowrap">Número</th>
                                        <th className="py-3 px-4 font-semibold text-slate-500 whitespace-nowrap">Cliente</th>
                                        <th className="py-3 px-4 font-semibold text-slate-500 whitespace-nowrap">Fecha</th>
                                        <th className="py-3 px-4 font-semibold text-slate-500 whitespace-nowrap">Estado</th>
                                        <th className="py-3 px-4 font-semibold text-slate-500 whitespace-nowrap text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((tx: any, idx: number) => {
                                        const doc = resolveDoc(tx, config.dataKey);
                                        const docId = doc?.id;
                                        const clickable = !!(config.route && docId);
                                        const status = getDocStatus(doc);
                                        return (
                                            <tr
                                                key={docId ?? idx}
                                                onClick={() => clickable && router.push(config.route!(docId))}
                                                className={cn(
                                                    "border-b border-slate-100 transition-colors",
                                                    clickable && "hover:bg-[#EBEEF2] cursor-pointer"
                                                )}
                                            >
                                                <td className="py-3.5 px-4 font-semibold text-primary">
                                                    {getDocNumber(doc)}
                                                </td>
                                                <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                                                    {getClientName(doc)}
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                                                    {getDocDate(doc)}
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                                                    {status || "-"}
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-medium text-slate-800 whitespace-nowrap">
                                                    {formatMoney(getDocTotal(doc, tx))}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-14 text-center gap-3 bg-white">
                            <div className="rounded-full bg-slate-50 p-4 border border-slate-100">
                                <EmptyIcon className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-600 font-medium text-[13px]">{config.emptyMessage}</p>
                            <p className="text-slate-400 text-xs max-w-sm">{config.emptyDescription}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
