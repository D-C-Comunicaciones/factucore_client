"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { BankAccountFilter, defaultBankAccountFilterOptions } from "@/components/banks/BankAccountFilter";
import { DebouncedInput } from "@/components/ui/debounced-input";
import type { BankAccount } from "@/lib/banks";

interface BankAccountsTableToolbarProps {
    table: Table<BankAccount>;
    search: string;
    setSearch: (v: string) => void;
    onAddFilter: (filterValue: string) => void;
    activeFilterCount: number;
}

export function BankAccountsTableToolbar({ search, setSearch, onAddFilter, activeFilterCount }: BankAccountsTableToolbarProps) {
    const hasFiltersLeft = activeFilterCount < defaultBankAccountFilterOptions.length;

    return (
        <div className="min-h-12 px-4 py-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex w-full md:w-auto items-center gap-2">
                <div className="relative w-full md:w-65">
                    <DebouncedInput placeholder="Buscar bancos..." value={search} onChange={setSearch} />
                </div>
                <div
                    className={`overflow-hidden transition-all duration-200 ease-in-out ${hasFiltersLeft ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"
                        }`}
                >
                    <BankAccountFilter options={defaultBankAccountFilterOptions} selected="" onSelect={onAddFilter} />
                </div>
            </div>
        </div>
    );
}
