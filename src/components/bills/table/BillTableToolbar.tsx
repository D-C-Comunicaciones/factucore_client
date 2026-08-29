"use client";

import React, { useState } from "react";
import { Funnel, Search } from "lucide-react";
import { DebouncedInput } from "@/components/ui/debounced-input";
import { BillFilter, defaultBillFilterOptions } from "../BillFilter";

interface BillTableToolbarProps {
    search: string;
    setSearch: (v: string) => void;
    onAddFilter?: (filterValue: string) => void;
}

export function BillTableToolbar({
    search,
    setSearch,
    onAddFilter = () => {},
}: BillTableToolbarProps) {
    return (
        <div className="min-h-12 px-4 py-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 bg-white">
            <div className="flex w-full md:w-auto items-center gap-2">
                <div className="relative w-full md:w-65">
                    <DebouncedInput
                        placeholder="Buscar por proveedor o No. de factura"
                        value={search}
                        onChange={setSearch}
                    />
                </div>
                <BillFilter
                    options={defaultBillFilterOptions}
                    selected=""
                    onSelect={onAddFilter}
                />
            </div>
        </div>
    );
}
