"use client";

import * as React from "react";
import {
    Filter, ChevronRight, ChevronLeft,
    Hash, User, CalendarDays, CalendarClock,
    Tag, DollarSign, CheckCircle2, Clock,
    Truck, ArrowLeftRight, FileText, MoreVertical,
    Eye, Printer, Lock, FilePlus, Edit, Minus, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ItemDocumentsFilterChips } from "./ItemDocumentsFilterChips";

/* ─── Tabs ─────────────────────────────────────────────────── */
const TABS = [
    { key: "ventas",          label: "Facturas de venta" },
    { key: "compras",         label: "Facturas de compras" },
    { key: "soporte",         label: "Documentos soporte" },
    { key: "credito",         label: "Notas de crédito" },
    { key: "debito",          label: "Notas débito" },
    { key: "debito_clientes", label: "Notas débito clientes" },
    { key: "cotizaciones",    label: "Cotizaciones" },
    { key: "remisiones",      label: "Remisiones" },
    { key: "ordenes",         label: "Órdenes de compra" },
    { key: "transferencias",  label: "Transferencias" },
    { key: "ajuste",          label: "Notas de ajuste" },
];

/* ─── Filter fields per tab ─────────────────────────────────── */
type FilterField = { label: string; id: string; icon: React.ReactNode };
const FILTER_FIELDS: Record<string, FilterField[]> = {
    ventas: [
        { label: "Número",      id: "numero",      icon: <Hash         className="w-3.5 h-3.5" /> },
        { label: "Cliente",     id: "cliente",     icon: <User         className="w-3.5 h-3.5" /> },
        { label: "Creación",    id: "creacion",    icon: <CalendarDays className="w-3.5 h-3.5" /> },
        { label: "Vencimiento", id: "vencimiento", icon: <CalendarClock className="w-3.5 h-3.5" /> },
        { label: "Estado",      id: "estado",      icon: <Tag          className="w-3.5 h-3.5" /> },
    ],
    compras: [
        { label: "Número",      id: "numero",      icon: <Hash         className="w-3.5 h-3.5" /> },
        { label: "Proveedor",   id: "proveedor",   icon: <Truck        className="w-3.5 h-3.5" /> },
        { label: "Creación",    id: "creacion",    icon: <CalendarDays className="w-3.5 h-3.5" /> },
        { label: "Vencimiento", id: "vencimiento", icon: <CalendarClock className="w-3.5 h-3.5" /> },
    ],
    soporte: [
        { label: "Número",      id: "numero",      icon: <Hash         className="w-3.5 h-3.5" /> },
        { label: "Proveedor",   id: "proveedor",   icon: <Truck        className="w-3.5 h-3.5" /> },
        { label: "Creación",    id: "creacion",    icon: <CalendarDays className="w-3.5 h-3.5" /> },
        { label: "Vencimiento", id: "vencimiento", icon: <CalendarClock className="w-3.5 h-3.5" /> },
        { label: "Estado",      id: "estado",      icon: <Tag          className="w-3.5 h-3.5" /> },
    ],
    credito: [
        { label: "Número",   id: "numero",   icon: <Hash         className="w-3.5 h-3.5" /> },
        { label: "Cliente",  id: "cliente",  icon: <User         className="w-3.5 h-3.5" /> },
        { label: "Creación", id: "creacion", icon: <CalendarDays className="w-3.5 h-3.5" /> },
        { label: "Estado",   id: "estado",   icon: <Tag          className="w-3.5 h-3.5" /> },
    ],
    debito: [
        { label: "Número",    id: "numero",    icon: <Hash         className="w-3.5 h-3.5" /> },
        { label: "Proveedor", id: "proveedor", icon: <Truck        className="w-3.5 h-3.5" /> },
        { label: "Fecha",     id: "fecha",     icon: <CalendarDays className="w-3.5 h-3.5" /> },
        { label: "Estado",    id: "estado",    icon: <Tag          className="w-3.5 h-3.5" /> },
    ],
    debito_clientes: [
        { label: "Número",   id: "numero",   icon: <Hash         className="w-3.5 h-3.5" /> },
        { label: "Cliente",  id: "cliente",  icon: <User         className="w-3.5 h-3.5" /> },
        { label: "Fecha",    id: "fecha",    icon: <CalendarDays className="w-3.5 h-3.5" /> },
        { label: "Estado",   id: "estado",   icon: <Tag          className="w-3.5 h-3.5" /> },
    ],
    cotizaciones: [
        { label: "Número",      id: "numero",      icon: <Hash          className="w-3.5 h-3.5" /> },
        { label: "Cliente",     id: "cliente",     icon: <User          className="w-3.5 h-3.5" /> },
        { label: "Creación",    id: "creacion",    icon: <CalendarDays  className="w-3.5 h-3.5" /> },
        { label: "Estado",      id: "estado",      icon: <Tag           className="w-3.5 h-3.5" /> },
    ],
    remisiones: [
        { label: "Número",      id: "numero",      icon: <Hash          className="w-3.5 h-3.5" /> },
        { label: "Cliente",     id: "cliente",     icon: <User          className="w-3.5 h-3.5" /> },
        { label: "Creación",    id: "creacion",    icon: <CalendarDays  className="w-3.5 h-3.5" /> },
        { label: "Vencimiento", id: "vencimiento", icon: <CalendarClock className="w-3.5 h-3.5" /> },
        { label: "Estado",      id: "estado",      icon: <Tag           className="w-3.5 h-3.5" /> },
    ],
    ordenes: [
        { label: "Código",        id: "codigo",        icon: <Hash         className="w-3.5 h-3.5" /> },
        { label: "Contacto",      id: "contacto",      icon: <User         className="w-3.5 h-3.5" /> },
        { label: "Fecha",         id: "fecha",         icon: <CalendarDays className="w-3.5 h-3.5" /> },
        { label: "Fecha Entrega", id: "fecha_entrega", icon: <CalendarClock className="w-3.5 h-3.5" /> },
        { label: "Estado",        id: "estado",        icon: <Tag          className="w-3.5 h-3.5" /> },
    ],
    transferencias: [
        { label: "Código",   id: "codigo",   icon: <Hash              className="w-3.5 h-3.5" /> },
        { label: "Fecha",    id: "fecha",    icon: <CalendarDays      className="w-3.5 h-3.5" /> },
    ],
    ajuste: [
        { label: "Número",   id: "numero",   icon: <Hash         className="w-3.5 h-3.5" /> },
        { label: "Cliente",  id: "cliente",  icon: <User         className="w-3.5 h-3.5" /> },
        { label: "Creación", id: "creacion", icon: <CalendarDays className="w-3.5 h-3.5" /> },
        { label: "Estado",   id: "estado",   icon: <Tag          className="w-3.5 h-3.5" /> },
    ],
};

/* ─── Status options per tab ──────────────────────────────── */
const STATUS_OPTIONS: Record<string, string[]> = {
    ventas:           ["Por cobrar", "Pagada", "Anulada", "Borrador"],
    compras:          ["Por pagar", "Pagada", "Anulada"],
    soporte:          ["Activo", "Inactivo", "Anulado"],
    credito:          ["Activo", "Inactivo", "Anulada"],
    debito:           ["Activo", "Inactivo", "Anulada"],
    debito_clientes:  ["Pendiente", "Facturado", "Anulada"],
    cotizaciones:     ["Pendiente", "Facturado", "Activo", "Anulada"],
    remisiones:       ["Pendiente", "Facturado", "Anulada"],
    ordenes:          ["Pendiente", "Recibido", "Anulada"],
    transferencias:   [],
    ajuste:           ["Activo", "Inactivo", "Anulado"],
};

/* ─── Mock Data ─────────────────────────────────────────────── */
const MOCK_DATA: Record<string, any[]> = {
    ventas: [
        { number: "1", entity: "Leones Palacio Andres", date_created: "2026-03-20", date_due: "2026-03-20", total: 119000, paid: 0, balance: 119000, status: "Por cobrar" },
        { number: "2", entity: "Juan Perez", date_created: "2026-04-15", date_due: "2026-05-15", total: 250000, paid: 250000, balance: 0, status: "Pagada" },
        { number: "3", entity: "Maria Gomez", date_created: "2026-05-10", date_due: "2026-06-10", total: 80000, paid: 20000, balance: 60000, status: "Por cobrar" },
    ],
    compras: [
        { number: "FC-101", entity: "Distribuidora ACME", date_created: "2026-03-10", date_due: "2026-04-10", total: 450000, status: "Por pagar" },
        { number: "FC-102", entity: "Tech Services SAS", date_created: "2026-04-01", date_due: "2026-05-01", total: 120000, status: "Pagada" },
    ],
    soporte: [
        { number: "DS-001", entity: "Proveedor Local S.A.", date_created: "2026-02-15", total: 85000 },
        { number: "DS-002", entity: "Carlos Gómez", date_created: "2026-03-01", total: 95000 },
    ],
    credito: [
        { number: "NC-001", entity: "Leones Palacio Andres", date_created: "2026-03-22", total: 15000 },
        { number: "NC-002", entity: "Juan Perez", date_created: "2026-04-18", total: 50000 },
    ],
    debito: [
        { number: "ND-001", entity: "Distribuidora ACME", date_created: "2026-03-15", total: 20000 },
        { number: "ND-002", entity: "Tech Services SAS", date_created: "2026-04-05", total: 30000 },
    ],
    debito_clientes: [
        { number: "NDC-001", entity: "Leones Palacio Andres", date_created: "2026-03-25", total: 40000, status: "Pendiente" },
    ],
    cotizaciones: [
        { number: "COT-001", entity: "Leones Palacio Andres", date_created: "2026-03-05", total: 150000 },
        { number: "COT-002", entity: "Juan Perez", date_created: "2026-03-12", total: 320000 },
    ],
    remisiones: [
        { number: "REM-001", entity: "Leones Palacio Andres", date_created: "2026-03-08", date_due: "2026-04-08", total: 119000, status: "Facturado" },
        { number: "REM-002", entity: "Juan Perez", date_created: "2026-03-18", date_due: "2026-04-18", total: 220000, status: "Pendiente" },
    ],
    ordenes: [
        { number: "OC-001", entity: "Distribuidora ACME", date_created: "2026-03-01", date_due: "2026-03-15", total: 600000, status: "Recibido" },
        { number: "OC-002", entity: "Tech Services SAS", date_created: "2026-03-10", date_due: "2026-03-25", total: 150000, status: "Pendiente" },
    ],
    transferencias: [
        { number: "TR-001", date_created: "2026-03-02", total: 50000 },
        { number: "TR-002", date_created: "2026-03-14", total: 75000 },
    ],
    ajuste: [
        { number: "NA-001", entity: "Leones Palacio Andres", date_created: "2026-03-15", total: 10000 },
    ],
};

/* ─── Column definitions per tab ───────────────────────────── */
interface ColumnConfig {
    key: string;
    label: string;
}
const TAB_COLUMNS: Record<string, ColumnConfig[]> = {
    ventas: [
        { key: "number", label: "Número" },
        { key: "entity", label: "Cliente" },
        { key: "date_created", label: "Creación" },
        { key: "date_due", label: "Vencimiento" },
        { key: "total", label: "Total" },
        { key: "paid", label: "Pagado" },
        { key: "balance", label: "Por Cobrar" },
        { key: "status", label: "Estado" },
    ],
    compras: [
        { key: "number", label: "Número" },
        { key: "entity", label: "Proveedor" },
        { key: "date_created", label: "Creación" },
        { key: "date_due", label: "Vencimiento" },
        { key: "total", label: "Total" },
        { key: "status", label: "Estado" },
    ],
    soporte: [
        { key: "number", label: "Número" },
        { key: "entity", label: "Proveedor" },
        { key: "date_created", label: "Creación" },
        { key: "total", label: "Total" },
    ],
    credito: [
        { key: "number", label: "Número" },
        { key: "entity", label: "Cliente" },
        { key: "date_created", label: "Creación" },
        { key: "total", label: "Total" },
    ],
    debito: [
        { key: "number", label: "Número" },
        { key: "entity", label: "Proveedor" },
        { key: "date_created", label: "Fecha" },
        { key: "total", label: "Total" },
    ],
    debito_clientes: [
        { key: "number", label: "Número" },
        { key: "entity", label: "Cliente" },
        { key: "date_created", label: "Fecha" },
        { key: "status", label: "Estado" },
        { key: "total", label: "Total" },
    ],
    cotizaciones: [
        { key: "number", label: "Número" },
        { key: "entity", label: "Cliente" },
        { key: "date_created", label: "Creación" },
        { key: "total", label: "Total" },
    ],
    remisiones: [
        { key: "number", label: "Número" },
        { key: "entity", label: "Cliente" },
        { key: "date_created", label: "Creación" },
        { key: "date_due", label: "Vencimiento" },
        { key: "status", label: "Estado" },
        { key: "total", label: "Total" },
    ],
    ordenes: [
        { key: "number", label: "Código" },
        { key: "entity", label: "Contacto" },
        { key: "date_created", label: "Fecha" },
        { key: "date_due", label: "Fecha Entrega" },
        { key: "status", label: "Estado" },
        { key: "total", label: "Total" },
    ],
    transferencias: [
        { key: "number", label: "Código" },
        { key: "date_created", label: "Fecha" },
        { key: "total", label: "Total" },
    ],
    ajuste: [
        { key: "number", label: "Número" },
        { key: "entity", label: "Cliente" },
        { key: "date_created", label: "Creación" },
        { key: "total", label: "Total" },
    ],
};

function getFilterKey(filterId: string): string {
    switch (filterId) {
        case "numero":
        case "codigo":
            return "number";
        case "cliente":
        case "proveedor":
        case "contacto":
            return "entity";
        case "creacion":
        case "fecha":
            return "date_created";
        case "vencimiento":
        case "fecha_entrega":
            return "date_due";
        case "estado":
            return "status";
        default:
            return filterId;
    }
}

const SCROLL_STEP = 180;

export function ItemDocumentsTab() {
    const [activeTab, setActiveTab]  = React.useState("ventas");
    const [canLeft,  setCanLeft]     = React.useState(false);
    const [canRight, setCanRight]    = React.useState(false);
    const [filters, setFilters]      = React.useState<{ id: string; value: any }[]>([]);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    /* ── sync scroll arrow visibility ── */
    const sync = React.useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 2);
        setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    }, []);

    React.useEffect(() => {
        // Small delay so the DOM is laid out before measuring
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

    /* ── reset filters on tab change ── */
    React.useEffect(() => {
        setFilters([]);
    }, [activeTab]);

    const scrollLeft  = () => scrollRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" });
    const scrollRight = () => scrollRef.current?.scrollBy({ left:  SCROLL_STEP, behavior: "smooth" });

    const fields       = FILTER_FIELDS[activeTab] ?? FILTER_FIELDS.ventas;
    const columns      = TAB_COLUMNS[activeTab] || [];
    const statusOpts   = STATUS_OPTIONS[activeTab] ?? [];

    const formatMoney = (value: number) => {
        return `$${value.toLocaleString("es-CO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    const filteredData = React.useMemo(() => {
        const rawList = MOCK_DATA[activeTab] || [];
        return rawList.filter((item: any) => {
            return filters.every((filter) => {
                if (filter.value === undefined || filter.value === "" || filter.value === null) return true;
                const filterKey = getFilterKey(filter.id);
                const itemValue = item[filterKey];
                if (itemValue === undefined || itemValue === null) return false;
                return String(itemValue)
                    .toLowerCase()
                    .includes(String(filter.value).toLowerCase());
            });
        });
    }, [activeTab, filters]);

    return (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm mb-4"
             style={{ maxWidth: "100%", overflow: "hidden" }}>

            {/* ── TAB BAR ── */}
            <div className="border-b border-slate-200 flex items-stretch h-12 px-3" style={{ minWidth: 0 }}>

                {/* Left arrow */}
                <button
                    type="button"
                    onClick={scrollLeft}
                    aria-label="Anterior"
                    className={cn(
                        "flex-shrink-0 w-8 h-8 self-center flex items-center justify-center rounded-lg bg-transparent text-slate-600 hover:bg-[#EBEEF2] hover:text-primary transition-all mr-2",
                        canLeft ? "opacity-100 scale-100" : "opacity-0 scale-90 w-0 mr-0 border-none overflow-hidden"
                    )}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Scrollable tab strip */}
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
                                "px-4 h-full flex items-center justify-center whitespace-nowrap border-b-2 flex-shrink-0 text-[13px] font-medium transition-all duration-200",
                                activeTab === tab.key
                                    ? "text-primary border-primary"
                                    : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Right arrow */}
                <button
                    type="button"
                    onClick={scrollRight}
                    aria-label="Siguiente"
                    className={cn(
                        "flex-shrink-0 w-8 h-8 self-center flex items-center justify-center rounded-lg bg-transparent text-slate-600 hover:bg-[#EBEEF2] hover:text-primary transition-all ml-2",
                        canRight ? "opacity-100 scale-100" : "opacity-0 scale-90 w-0 ml-0 border-none overflow-hidden"
                    )}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* ── CONTENT ── */}
            <div className="p-4">
                <div className="border border-slate-200 rounded-lg overflow-hidden">

                    {/* Filter bar */}
                    <div className="px-4 py-2.5 border-b border-slate-200 flex items-center bg-white">
                        {filters.length === 0 ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="flex items-center gap-1.5 text-[13px] font-medium transition-colors px-2 py-1 rounded-md text-slate-600 hover:text-slate-800 hover:bg-slate-50 data-[state=open]:text-primary data-[state=open]:bg-primary/5"
                                    >
                                        <Filter className="w-3.5 h-3.5" />
                                        Filtrar
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    sideOffset={8}
                                    className="min-w-[190px] p-1.5 rounded-xl border border-slate-200 shadow-lg bg-white"
                                >
                                    <p className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                        Filtrar por
                                    </p>
                                    {fields.map((f) => (
                                        <DropdownMenuItem
                                            key={f.id}
                                            onClick={() => {
                                                setFilters((prev) => [...prev, { id: f.id, value: "" }]);
                                            }}
                                            className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-primary focus:bg-slate-50 focus:text-primary rounded-lg transition-colors cursor-pointer"
                                        >
                                            <span className="text-slate-400">{f.icon}</span>
                                            {f.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="w-full">
                                <ItemDocumentsFilterChips
                                    fields={fields}
                                    filters={filters}
                                    setFilters={setFilters}
                                    statusOptions={statusOpts}
                                />
                            </div>
                        )}
                    </div>

                    {/* Empty state or Document list */}
                    {filteredData.length > 0 ? (
                        <div className="w-full overflow-x-auto hide-scrollbar">
                            <table className="w-full text-left border-collapse text-[13px]">
                                <thead className="bg-slate-50/80 border-b border-slate-200">
                                    <tr>
                                        {columns.map((col) => (
                                            <th key={col.key} className="py-3 px-4 font-semibold text-slate-500 whitespace-nowrap">
                                                {col.label}
                                            </th>
                                        ))}
                                        <th className="py-3 px-4 font-semibold text-slate-500 whitespace-nowrap text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, idx) => (
                                        <tr key={idx} className="border-b border-slate-100 hover:bg-[#EBEEF2] transition-colors">
                                            {columns.map((col) => {
                                                const val = item[col.key];
                                                if (col.key === "number") {
                                                    return (
                                                        <td key={col.key} className="py-3.5 px-4 font-semibold text-slate-800">
                                                            {val}
                                                        </td>
                                                    );
                                                }
                                                if (col.key === "entity") {
                                                    return (
                                                        <td key={col.key} className="py-3.5 px-4 font-medium text-primary cursor-pointer whitespace-nowrap">
                                                            {val}
                                                        </td>
                                                    );
                                                }
                                                if (col.key === "total" || col.key === "paid" || col.key === "balance") {
                                                    return (
                                                        <td key={col.key} className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                                                            {typeof val === "number" ? formatMoney(val) : val}
                                                        </td>
                                                    );
                                                }
                                                if (col.key === "status") {
                                                    const statusClass = (() => {
                                                        if (["Por cobrar", "Por pagar", "Pendiente"].includes(val)) return "text-amber-600";
                                                        if (["Anulada", "Anulado", "Inactivo"].includes(val))      return "text-red-500";
                                                        if (["Pagada", "Activo", "Recibido"].includes(val))        return "text-emerald-600";
                                                        if (["Facturado"].includes(val))                           return "text-blue-600";
                                                        if (["Borrador"].includes(val))                            return "text-slate-400";
                                                        return "text-slate-600";
                                                    })();
                                                    return (
                                                        <td key={col.key} className="py-3.5 px-4 whitespace-nowrap">
                                                            <span className={cn("font-semibold", statusClass)}>
                                                                {val}
                                                            </span>
                                                        </td>
                                                    );
                                                }
                                                return (
                                                    <td key={col.key} className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                                                        {val || "-"}
                                                    </td>
                                                );
                                            })}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            type="button"
                                                            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors inline-flex items-center justify-center cursor-pointer data-[state=open]:border-primary/50 data-[state=open]:bg-slate-50"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-48 bg-white border border-slate-200 rounded-xl p-1 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] focus:outline-none"
                                                    >
                                                        <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-[#EBEEF2] rounded-lg transition-colors cursor-pointer focus:bg-[#EBEEF2] focus:outline-none">
                                                            <Eye className="w-4 h-4 text-slate-400" />
                                                            Mostrar detalle
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-[#EBEEF2] rounded-lg transition-colors cursor-pointer focus:bg-[#EBEEF2] focus:outline-none">
                                                            <Printer className="w-4 h-4 text-slate-400" />
                                                            Imprimir
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem disabled className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-300 pointer-events-none rounded-lg focus:outline-none">
                                                            <Lock className="w-4 h-4 text-slate-200" />
                                                            Facturar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-[#EBEEF2] rounded-lg transition-colors cursor-pointer focus:bg-[#EBEEF2] focus:outline-none">
                                                            <FilePlus className="w-4 h-4 text-slate-400" />
                                                            Agregar pago
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-[#EBEEF2] rounded-lg transition-colors cursor-pointer focus:bg-[#EBEEF2] focus:outline-none">
                                                            <Edit className="w-4 h-4 text-slate-400" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer focus:bg-red-50 focus:outline-none">
                                                            <Minus className="w-4 h-4 text-red-400" />
                                                            Anular
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-red-400 hover:bg-red-50/50 rounded-lg transition-colors cursor-pointer focus:bg-red-50/50 focus:outline-none">
                                                            <X className="w-4 h-4 text-red-300" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-14 bg-white">
                            <p className="text-[13px] font-medium text-slate-400">
                                No hay contenido disponible
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
                        <div className="flex items-center gap-2.5">
                            <span className="text-[12px] font-medium text-slate-500">Resultados por página:</span>
                            <select className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary/30">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                            <span className="text-[12px] font-medium text-slate-500">
                                {filteredData.length > 0 ? `1-${filteredData.length}` : "0-0"} De {filteredData.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-slate-500">Página</span>
                            <input
                                type="number"
                                defaultValue={1}
                                className="w-10 bg-white border border-slate-200 rounded-lg px-1.5 py-1 text-[12px] font-medium text-center text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary/30"
                            />
                            <span className="text-[12px] font-medium text-slate-500">De 1</span>
                            <button type="button" className="w-6 h-6 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors ml-1">
                                <span className="text-xs">‹</span>
                            </button>
                            <button type="button" className="w-6 h-6 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
                                <span className="text-xs">›</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}