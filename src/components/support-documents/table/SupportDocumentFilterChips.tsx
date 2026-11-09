"use client";

import * as React from "react";
import { Table, ColumnFiltersState } from "@tanstack/react-table";
import { Funnel, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateFilterPopoverInline } from "@/components/ui/DateFilterPopoverInline";
import { defaultSupportDocumentFilterOptions } from "@/components/support-documents/SupportDocumentFilter";
import type { SupportDocument } from "@/types/supportDocument";

/* Same interaction pattern as Invoice's FilterChips (components/invoice/table/FilterChips.tsx) —
 * a chip per active filter, click to edit its value, "+" to add another, values pushed straight
 * into react-table's columnFilters and read by the parent page to build query params. */

const filterLabels: Record<string, string> = {
    issue_date: "Fecha de generación",
    due_date: "Fecha de vencimiento",
    dian_status_id: "Estado DIAN",
    support_document_status_id: "Estado",
};

export const filterValueToColumnId: Record<string, string> = {
    issue_date: "issue_date",
    due_date: "due_date",
    dian_status_id: "dian_status_id",
    support_document_status_id: "support_document_status_id",
};

const DIAN_STATUS_OPTIONS = [
    { label: "Aprobado", id: 2 },
    { label: "No aprobado", id: 3 },
    { label: "No electrónica", id: 1 },
];

const SUPPORT_DOCUMENT_STATUS_OPTIONS = [
    { label: "Borrador", id: 1 },
    { label: "Guardado", id: 2 },
    { label: "Pagado", id: 3 },
    { label: "Por pagar", id: 4 },
    { label: "Anulado", id: 5 },
];

interface SupportDocumentFilterChipsProps {
    columnFilters: ColumnFiltersState;
    setColumnFilters: (filters: ColumnFiltersState) => void;
    table: Table<SupportDocument>;
    onAddFilter: (filterValue: string) => void;
}

export function SupportDocumentFilterChips({
    columnFilters,
    setColumnFilters,
    onAddFilter,
}: SupportDocumentFilterChipsProps) {
    const [showPlusFilter, setShowPlusFilter] = React.useState(false);

    if (columnFilters.length === 0) return null;

    function removeFilter(id: string) {
        setColumnFilters(columnFilters.filter((f) => f.id !== id));
    }

    function removeAllFilters() {
        setColumnFilters([]);
    }

    function renderIdCheckboxGroup(filter: { id: string; value: unknown }, options: { label: string; id: number }[]) {
        const selectedIds: number[] = Array.isArray(filter.value) ? filter.value : [];

        return (
            <div className="flex flex-col gap-1 px-3 py-2">
                {options.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 text-xs cursor-pointer">
                        <Checkbox
                            checked={selectedIds.includes(opt.id)}
                            onCheckedChange={(checked) => {
                                const next = checked
                                    ? [...selectedIds, opt.id]
                                    : selectedIds.filter((id) => id !== opt.id);
                                setColumnFilters(columnFilters.map((f) => (f.id === filter.id ? { ...f, value: next } : f)));
                            }}
                        />
                        {opt.label}
                    </label>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-t border-b border-gray-200 bg-white relative">
            {columnFilters.map((filter) => {
                const isDate = filter.id === "issue_date" || filter.id === "due_date";
                const isMultiSelect = filter.id === "dian_status_id" || filter.id === "support_document_status_id";
                const options = filter.id === "dian_status_id" ? DIAN_STATUS_OPTIONS : SUPPORT_DOCUMENT_STATUS_OPTIONS;

                const chipValueLabel = (() => {
                    if (isDate && typeof filter.value === "string" && filter.value) {
                        const d = new Date(filter.value);
                        return !isNaN(d.getTime()) ? d.toLocaleDateString() : "";
                    }
                    if (isMultiSelect && Array.isArray(filter.value) && filter.value.length > 0) {
                        return options
                            .filter((o) => (filter.value as number[]).includes(o.id))
                            .map((o) => o.label)
                            .join(", ");
                    }
                    return "";
                })();

                return (
                    <DropdownMenu key={filter.id}>
                        <DropdownMenuTrigger asChild>
                            <button
                                className={`inline-flex items-center px-3 py-1 rounded-full border ${isDate ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-background text-foreground"} text-xs font-medium shadow-sm hover:bg-primary/10 hover:text-primary hover:border-primary/40 focus:bg-primary/10 focus:text-primary transition-colors`}
                            >
                                <Funnel className="w-4 h-4 mr-1 text-gray-400" />
                                <span className="mr-1">{filterLabels[filter.id] ?? filter.id}</span>
                                <span className="font-normal text-gray-500 max-w-[160px] truncate">{chipValueLabel}</span>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" sideOffset={4} className="min-w-[220px]">
                            <div className="flex items-center justify-between px-3 pt-2 pb-1 text-xs font-semibold text-gray-600">
                                {filterLabels[filter.id] ?? filter.id}
                                <button
                                    className="ml-2 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition p-0 w-6 h-6 border border-gray-300"
                                    style={{ borderRadius: 6 }}
                                    onClick={() => removeFilter(filter.id)}
                                    title="Quitar filtro"
                                >
                                    <Trash2 className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {isDate && (
                                <DateFilterPopoverInline
                                    filter={filter}
                                    setFilterValue={(val) => {
                                        // DateFilterPopoverInline hands back a raw Date object — format
                                        // to YYYY-MM-DD before it reaches the backend, which sends it
                                        // straight into a Postgres ::date comparison (see
                                        // SupportDocumentController::index()'s date_from/date_to).
                                        // Date.toString() (e.g. "Sat Aug 22 2026 00:00:00 GMT-0500 ...")
                                        // is not valid Postgres date input.
                                        const isoDate = val instanceof Date
                                            ? `${val.getFullYear()}-${String(val.getMonth() + 1).padStart(2, "0")}-${String(val.getDate()).padStart(2, "0")}`
                                            : val;
                                        setColumnFilters(columnFilters.map((f) => (f.id === filter.id ? { ...f, value: isoDate } : f)));
                                    }}
                                />
                            )}

                            {isMultiSelect && renderIdCheckboxGroup(filter, options)}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            })}

            {columnFilters.length < defaultSupportDocumentFilterOptions.length && (
                <DropdownMenu open={showPlusFilter} onOpenChange={setShowPlusFilter}>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-border bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 focus:bg-primary/10 focus:text-primary transition-colors ml-1"
                            title="Agregar filtro"
                            type="button"
                        >
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="9" fill="none" />
                                <path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={4} className="min-w-[180px]">
                        <div className="px-3 py-2 text-xs text-muted-foreground font-semibold">Filtrar Por</div>
                        {defaultSupportDocumentFilterOptions.map((opt) => {
                            const columnId = filterValueToColumnId[opt.value];
                            if (columnFilters.some((f) => f.id === columnId)) return null;
                            const Icon = opt.icon;
                            return (
                                <DropdownMenuItem
                                    key={opt.value}
                                    onClick={() => {
                                        onAddFilter(opt.value);
                                        setShowPlusFilter(false);
                                    }}
                                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {opt.label}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            <button
                className="ml-auto text-xs text-black font-medium px-2 py-1 rounded focus:outline-none hover:bg-gray-100 cursor-pointer transition-colors"
                style={{ textDecoration: "none" }}
                onClick={removeAllFilters}
            >
                Remover filtros
            </button>
        </div>
    );
}
