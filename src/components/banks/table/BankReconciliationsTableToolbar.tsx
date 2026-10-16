"use client";

import { BankReconciliationFilter, defaultReconciliationFilterOptions } from "@/components/banks/BankReconciliationFilter";

interface BankReconciliationsTableToolbarProps {
    onAddFilter: (filterValue: string) => void;
    activeFilterCount: number;
}

export function BankReconciliationsTableToolbar({ onAddFilter, activeFilterCount }: BankReconciliationsTableToolbarProps) {
    const hasFiltersLeft = activeFilterCount < defaultReconciliationFilterOptions.length;

    return (
        <div
            className={`overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-in-out grid ${hasFiltersLeft ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
        >
            <div className="min-h-0 overflow-hidden">
                <div className="min-h-12 px-4 py-2 border-b border-gray-200 flex items-center">
                    <BankReconciliationFilter options={defaultReconciliationFilterOptions} selected="" onSelect={onAddFilter} />
                </div>
            </div>
        </div>
    );
}
