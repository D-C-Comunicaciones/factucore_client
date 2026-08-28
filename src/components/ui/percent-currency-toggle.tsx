"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PercentCurrencyToggleProps {
    value: "%" | "$";
    onValueChange: (value: "%" | "$") => void;
    disabled?: boolean;
    className?: string;
    /**
     * "standalone": selector con su propio borde completo (ej. sección de Propinas).
     * "inline": pensado para fusionarse visualmente con un input adyacente dentro de un
     * mismo contenedor con borde (ej. columna Descuento de una tabla de líneas).
     */
    variant?: "standalone" | "inline";
}

const OPTIONS: Array<"%" | "$"> = ["%", "$"];

/**
 * Selector %/$ con el mismo estilo (chevron, checkmark, resaltado azul) que los demás selects
 * de la app — construido sobre DropdownMenu (ya usado en este mismo formulario) en vez del
 * <select> nativo del navegador o del componente shadcn `Select`, que no tenía sus tokens de
 * color (--accent/--popover) configurados en este proyecto y desbordaba el input al que se
 * fusiona en la variante "inline".
 */
export function PercentCurrencyToggle({
    value,
    onValueChange,
    disabled,
    className,
    variant = "standalone",
}: PercentCurrencyToggleProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={disabled}>
                <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                        "flex shrink-0 items-center justify-center gap-1 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                        variant === "inline"
                            ? "h-full w-12 border-r bg-slate-50 px-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                            : "h-9 w-20 rounded-lg border border-foreground/20 bg-white px-3 hover:border-primary",
                        className,
                    )}
                >
                    <span>{value}</span>
                    <ChevronDown className="size-3.5 shrink-0 opacity-50" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[4.5rem] bg-white p-1 text-slate-700">
                {OPTIONS.map((option) => (
                    <DropdownMenuItem
                        key={option}
                        onSelect={() => onValueChange(option)}
                        className="cursor-pointer justify-between rounded-lg data-[highlighted]:bg-primary/5 data-[highlighted]:text-primary"
                    >
                        <span>{option}</span>
                        {value === option && <Check className="size-4 text-primary" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
