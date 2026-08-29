"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { DebouncedInput } from "@/components/ui/debounced-input";
import { SupportDocumentFilter, defaultSupportDocumentFilterOptions } from "../SupportDocumentFilter";
import type { SupportDocumentSummary } from "@/types/supportDocument";

interface SupportDocumentTableToolbarProps {
    table?: Table<SupportDocumentSummary>;
    search: string;
    setSearch: (v: string) => void;
    onAddFilter: (filterValue: string) => void;
    perPage?: number;
    setPerPage?: (n: number) => void;
}

export function SupportDocumentTableToolbar({
    search,
    setSearch,
    onAddFilter,
}: SupportDocumentTableToolbarProps) {
    return (
        <div className="min-h-12 px-4 py-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex w-full md:w-auto items-center gap-2">
                <div className="relative w-full md:w-64">
                    <DebouncedInput
                        placeholder="Buscar por proveedor o no. de documento soporte"
                        value={search}
                        onChange={setSearch}
                    />
                </div>
                <SupportDocumentFilter
                    options={defaultSupportDocumentFilterOptions}
                    selected=""
                    onSelect={onAddFilter}
                />
            </div>
        </div>
    );
}
