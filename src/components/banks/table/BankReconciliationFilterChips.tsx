"use client";

import * as React from "react";
import { Table, ColumnFiltersState } from "@tanstack/react-table";
import { BadgeCheck, CalendarDays, Landmark, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateFilterPopoverInline } from "@/components/ui/DateFilterPopoverInline";
import { RadioFilterList } from "@/components/banks/table/RadioFilterList";
import { defaultReconciliationFilterOptions } from "@/components/banks/BankReconciliationFilter";
import type { BankAccount, BankReconciliation } from "@/lib/banks";

const filterLabels: Record<string, string> = {
    period: "Fecha",
    bank_account_id: "Banco",
    status: "Estado",
};

const filterIcons: Record<string, React.ReactNode> = {
    period: <CalendarDays className="w-4 h-4 mr-1 text-gray-400" />,
    bank_account_id: <Landmark className="w-4 h-4 mr-1 text-gray-400" />,
    status: <BadgeCheck className="w-4 h-4 mr-1 text-gray-400" />,
};

const STATUS_OPTIONS = [
    { value: "in_progress", label: "En progreso" },
    { value: "completed", label: "Conciliada" },
];

export const filterValueToColumnId: Record<string, string> = {
    period: "period",
    bank_account_id: "bank_account_id",
    status: "status",
};

interface BankReconciliationFilterChipsProps {
    columnFilters: ColumnFiltersState;
    setColumnFilters: (filters: ColumnFiltersState) => void;
    table: Table<BankReconciliation>;
    bankAccounts: BankAccount[];
    onAddFilter: (filterValue: string) => void;
}

export function BankReconciliationFilterChips({
    columnFilters,
    setColumnFilters,
    bankAccounts,
    onAddFilter,
}: BankReconciliationFilterChipsProps) {
    const [showPlusFilter, setShowPlusFilter] = React.useState(false);
    const hasFilters = columnFilters.length > 0;

    const bankOptions = bankAccounts.map((a) => ({ value: String(a.id), label: a.name }));

    function removeFilter(id: string) {
        setColumnFilters(columnFilters.filter((f) => f.id !== id));
    }

    function removeAllFilters() {
        setColumnFilters([]);
    }

    return (
        <div
            className={`overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-in-out grid ${hasFilters ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
        >
            <div className="min-h-0 overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-t border-b border-gray-200 bg-white relative">
                    {columnFilters.map((filter) => {
                        let valueSummary = "";
                        if (filter.id === "period" && filter.value instanceof Date) {
                            valueSummary = (filter.value as Date).toLocaleDateString();
                        }
                        if (filter.id === "bank_account_id" && typeof filter.value === "string" && filter.value) {
                            valueSummary = bankOptions.find((o) => o.value === filter.value)?.label ?? "";
                        }
                        if (filter.id === "status" && typeof filter.value === "string" && filter.value) {
                            valueSummary = STATUS_OPTIONS.find((o) => o.value === filter.value)?.label ?? "";
                        }

                        return (
                            <DropdownMenu key={filter.id}>
                                <DropdownMenuTrigger asChild>
                                    <button className="animate-in fade-in slide-in-from-left-1 duration-200 inline-flex items-center px-3 py-1 rounded-full border border-border bg-background text-foreground text-xs font-medium shadow-sm hover:bg-primary/10 hover:text-primary hover:border-primary/40 focus:bg-primary/10 focus:text-primary transition-colors">
                                        {filterIcons[filter.id]}
                                        <span className="mr-1">{filterLabels[filter.id] ?? filter.id}</span>
                                        <span className="font-normal text-gray-500">{valueSummary}</span>
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="start" sideOffset={4} className="min-w-[220px]">
                                    <div className="flex items-center justify-between px-3 pt-2 pb-1 text-xs font-semibold text-gray-600">
                                        {filterLabels[filter.id] ?? filter.id}
                                        <button
                                            className="ml-2 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition p-0 w-6 h-6 border border-gray-300 rounded-md"
                                            onClick={() => removeFilter(filter.id)}
                                            title="Quitar filtro"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                                        </button>
                                    </div>

                                    {filter.id === "period" && (
                                        <DateFilterPopoverInline
                                            filter={filter}
                                            setFilterValue={(val) => setColumnFilters(columnFilters.map((f) => (f.id === filter.id ? { ...f, value: val } : f)))}
                                        />
                                    )}

                                    {filter.id === "bank_account_id" && (
                                        <RadioFilterList
                                            options={bankOptions}
                                            value={typeof filter.value === "string" ? filter.value : ""}
                                            onChange={(v) => setColumnFilters(columnFilters.map((f) => (f.id === filter.id ? { ...f, value: v } : f)))}
                                            allLabel="Todos los bancos"
                                            searchable
                                            searchPlaceholder="Buscar bancos"
                                        />
                                    )}

                                    {filter.id === "status" && (
                                        <RadioFilterList
                                            options={STATUS_OPTIONS}
                                            value={typeof filter.value === "string" ? filter.value : ""}
                                            onChange={(v) => setColumnFilters(columnFilters.map((f) => (f.id === filter.id ? { ...f, value: v } : f)))}
                                            allLabel="Todos los estados"
                                        />
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        );
                    })}

                    <div
                        className={`overflow-hidden transition-all duration-200 ease-in-out ${columnFilters.length < defaultReconciliationFilterOptions.length ? "max-w-[40px] opacity-100 ml-1" : "max-w-0 opacity-0 ml-0"
                            }`}
                    >
                        <DropdownMenu open={showPlusFilter} onOpenChange={setShowPlusFilter}>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-border bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 focus:bg-primary/10 focus:text-primary transition-colors"
                                    title="Agregar filtro"
                                    type="button"
                                >
                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={4} className="min-w-[180px]">
                                <div className="px-3 py-2 text-xs text-muted-foreground font-semibold">Filtrar Por</div>
                                {defaultReconciliationFilterOptions.map((opt) => {
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
                    </div>

                    <button
                        className="ml-auto text-xs text-black font-medium px-2 py-1 rounded focus:outline-none hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={removeAllFilters}
                    >
                        Remover filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
