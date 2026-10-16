"use client";

import * as React from "react";
import { Search } from "lucide-react";

interface RadioFilterOption {
    value: string;
    label: string;
}

interface RadioFilterListProps {
    options: RadioFilterOption[];
    value: string;
    onChange: (value: string) => void;
    allLabel?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
}

/** Lista de selección única (radio) reutilizada por los filtros de banco/estado/tipo de cuenta. */
export function RadioFilterList({
    options,
    value,
    onChange,
    allLabel,
    searchable = false,
    searchPlaceholder = "Buscar...",
}: RadioFilterListProps) {
    const [search, setSearch] = React.useState("");

    const filtered = searchable && search.trim()
        ? options.filter((o) => o.label.toLowerCase().includes(search.trim().toLowerCase()))
        : options;

    return (
        <div className="px-3 py-2">
            {searchable && (
                <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full h-8 pl-7 pr-2 text-xs border border-gray-300 rounded-md outline-none focus:border-gray-400"
                    />
                </div>
            )}
            <div className="flex flex-col gap-1 max-h-56 overflow-y-auto">
                {allLabel && (
                    <label className="flex items-center gap-2 text-xs cursor-pointer py-1">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${value === "" ? "border-primary" : "border-gray-300"}`}>
                            {value === "" && <span className="w-2 h-2 rounded-full bg-primary" />}
                        </span>
                        <input type="radio" className="hidden" checked={value === ""} onChange={() => onChange("")} />
                        {allLabel}
                    </label>
                )}
                {filtered.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-xs cursor-pointer py-1">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${value === opt.value ? "border-primary" : "border-gray-300"}`}>
                            {value === opt.value && <span className="w-2 h-2 rounded-full bg-primary" />}
                        </span>
                        <input type="radio" className="hidden" checked={value === opt.value} onChange={() => onChange(opt.value)} />
                        {opt.label}
                    </label>
                ))}
            </div>
        </div>
    );
}
