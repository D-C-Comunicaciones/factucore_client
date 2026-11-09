"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import {
    CalendarIcon,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"];
const YEARS = Array.from({ length: 20 }, (_, i) => 2010 + i);

/**
 * Selector de rango de fechas — dos calendarios lado a lado, basado en DatePickerSimple (mismo
 * header con acceso rápido a mes/año, mismo footer Cancelar/Aplicar). El segundo mes siempre
 * sigue al primero (anchor + 1); saltar de mes/año mueve ambos juntos.
 */
export function DateRangePickerSimple({
    value,
    onChange,
    disabledDates,
    className,
    side,
    align = "start",
}: {
    value?: DateRange;
    onChange?: (range: DateRange) => void;
    /** Fechas seleccionables — cualquier otra queda deshabilitada (cursor not-allowed). */
    disabledDates?: (date: Date) => boolean;
    className?: string;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
} = {}) {
    const [range, setRange] = React.useState<DateRange | undefined>(value);
    const [tempRange, setTempRange] = React.useState<DateRange | undefined>(value);
    const [anchorMonth, setAnchorMonth] = React.useState<Date>(value?.from ?? new Date());
    const [open, setOpen] = React.useState(false);
    const [view, setView] = React.useState<"default" | "month" | "year">("default");

    React.useEffect(() => {
        setRange(value);
        setTempRange(value);
    }, [value?.from, value?.to]);

    React.useEffect(() => {
        if (open) {
            setTempRange(range);
            setAnchorMonth(range?.from ?? new Date());
            setView("default");
        }
    }, [open, range]);

    const inputClass =
        "flex h-9 w-full rounded-md border border-foreground/20 bg-white px-3 py-1 text-xs transition-colors hover:border-primary hover:bg-white focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50";

    const label = range?.from
        ? `${format(range.from, "dd/MM/yyyy", { locale: es })} - ${range.to ? format(range.to, "dd/MM/yyyy", { locale: es }) : "…"}`
        : "dd/mm/aaaa - dd/mm/aaaa";

    const secondMonth = new Date(anchorMonth.getFullYear(), anchorMonth.getMonth() + 1);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={cn(inputClass, "cursor-pointer w-full justify-start font-normal text-xs", !range?.from && "text-muted-foreground", className)}
                >
                    <CalendarIcon className="h-4 w-4 mr-1.5 shrink-0" />
                    <span className="truncate">{label}</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align={align}
                side={side}
                sideOffset={6}
                collisionPadding={16}
                className="w-auto p-0 rounded-xl border border-border shadow-xl z-[150] bg-white"
            >
                <div className="p-3">
                    {/* HEADER */}
                    <div className="flex items-center w-full px-2 mb-2">
                        <button
                            type="button"
                            onClick={() => setAnchorMonth(new Date(anchorMonth.getFullYear(), anchorMonth.getMonth() - 1))}
                            className="p-1 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="flex-1 flex justify-center items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setView((v) => (v === "month" ? "default" : "month"))}
                                className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                            >
                                {MONTHS[anchorMonth.getMonth()]}
                                {view === "month" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                            <button
                                type="button"
                                onClick={() => setView((v) => (v === "year" ? "default" : "year"))}
                                className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                            >
                                {anchorMonth.getFullYear()}
                                {view === "year" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                            <span className="text-xs text-muted-foreground mx-1">·</span>
                            <span className="text-sm font-medium px-2 py-1">
                                {MONTHS[secondMonth.getMonth()]} {secondMonth.getFullYear()}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setAnchorMonth(new Date(anchorMonth.getFullYear(), anchorMonth.getMonth() + 1))}
                            className="p-1 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {view === "default" && (
                        <Calendar
                            mode="range"
                            numberOfMonths={2}
                            month={anchorMonth}
                            onMonthChange={setAnchorMonth}
                            selected={tempRange}
                            onSelect={setTempRange}
                            disabled={disabledDates}
                            locale={es}
                            className="
                              [&_button]:text-xs
                              [&_button:disabled]:cursor-not-allowed
                              [&_[data-selected-single]]:bg-primary
                              [&_[data-selected-single]]:text-primary-foreground
                              [&_[data-range-start]]:bg-primary
                              [&_[data-range-start]]:text-primary-foreground
                              [&_[data-range-end]]:bg-primary
                              [&_[data-range-end]]:text-primary-foreground
                              [&_[data-range-middle]]:bg-primary/15
                            "
                        />
                    )}

                    {view === "month" && (
                        <div className="grid grid-cols-3 gap-2 p-2 w-[280px]">
                            {MONTHS.map((m, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        setAnchorMonth(new Date(anchorMonth.getFullYear(), i));
                                        setView("default");
                                    }}
                                    className={cn(
                                        "py-2 rounded-md text-xs font-medium transition-colors hover:bg-primary/10 cursor-pointer",
                                        anchorMonth.getMonth() === i && "bg-primary text-primary-foreground hover:bg-primary"
                                    )}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    )}

                    {view === "year" && (
                        <div className="grid grid-cols-3 gap-2 p-2 w-[280px] max-h-[220px] overflow-y-auto">
                            {YEARS.map((year) => (
                                <button
                                    key={year}
                                    type="button"
                                    onClick={() => {
                                        setAnchorMonth(new Date(year, anchorMonth.getMonth()));
                                        setView("default");
                                    }}
                                    className={cn(
                                        "py-2 rounded-md text-xs font-medium transition-colors hover:bg-primary/10 cursor-pointer",
                                        anchorMonth.getFullYear() === year && "bg-primary text-primary-foreground hover:bg-primary"
                                    )}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end items-center gap-2 mt-2 pt-2 border-t border-border">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:bg-muted text-xs h-7 px-2 cursor-pointer"
                            onClick={() => {
                                setTempRange(range);
                                setOpen(false);
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-7 px-3 cursor-pointer"
                            disabled={!tempRange?.from || !tempRange?.to}
                            onClick={() => {
                                if (tempRange?.from && tempRange?.to) {
                                    setRange(tempRange);
                                    onChange?.(tempRange);
                                }
                                setOpen(false);
                            }}
                        >
                            Aplicar
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
