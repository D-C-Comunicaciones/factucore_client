"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { showToast } from "@/components/sonner/CustomToaster";

interface InlineDocumentSelectorProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SearchableSelectOption[];
    disabledReason?: string;
    className?: string;
    displayPrefix?: string;
}

// Selector compacto para "Orden de compra" / "Remisión": el mismo botón hace de
// trigger ("+ Orden de compra"), de select de búsqueda (al hacer clic) y de chip
// con el valor ya seleccionado + una X para quitarlo — sin abrir una tarjeta
// aparte ni mostrar más que el número del documento (prefix+number ya viene así
// en `options`, ver purchaseOrderOptions/remissionOptions).
export function InlineDocumentSelector({
    label,
    value,
    onChange,
    options,
    disabledReason,
    className,
    displayPrefix,
}: InlineDocumentSelectorProps) {
    const [picking, setPicking] = useState(false);
    const selectedLabel = options.find((o) => o.value === value)?.label || value;

    if (!value && !picking) {
        return (
            <button
                type="button"
                onClick={() => {
                    if (disabledReason) {
                        showToast(disabledReason, "error");
                        return;
                    }
                    setPicking(true);
                }}
                className={`text-primary text-sm font-medium flex items-center justify-center gap-1 hover:bg-primary/10 px-3 h-9 rounded-md transition-colors cursor-pointer whitespace-nowrap bg-primary/5 ${className || ""}`}
            >
                <Plus className="w-4 h-4 shrink-0" />
                {label}
            </button>
        );
    }

    if (value && !picking) {
        return (
            <div className={`flex items-center gap-1.5 border border-border rounded-md pl-2.5 pr-1 h-9 bg-white ${className || ""}`}>
                <button
                    type="button"
                    onClick={() => setPicking(true)}
                    className="text-sm text-foreground font-medium hover:text-primary transition-colors truncate max-w-[200px]"
                    title={selectedLabel}
                >
                    {displayPrefix ? `${displayPrefix} ${selectedLabel}` : selectedLabel}
                </button>
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted/50 rounded transition-colors shrink-0"
                    aria-label={`Quitar ${label.toLowerCase()}`}
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        );
    }

    // picking: mostrando el select de búsqueda en el mismo lugar del botón
    return (
        <div className={`flex items-center gap-1 ${className || ""}`}>
            <div className="w-[180px]">
                <SearchableSelect
                    value={value}
                    onValueChange={(val) => {
                        onChange(val);
                        setPicking(false);
                    }}
                    options={options}
                    placeholder="Buscar"
                    searchPlaceholder={`Buscar ${label.toLowerCase()}...`}
                    className="w-full bg-white h-9"
                    emptyMessage="Sin resultados"
                />
            </div>
            <button
                type="button"
                onClick={() => setPicking(false)}
                className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted/50 rounded transition-colors shrink-0"
                aria-label="Cancelar"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
