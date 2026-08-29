"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    CalendarIcon,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

export function DatePickerSimple({
    value,
    onChange,
    onClear,
    className,
    side,
    align = "start",
}: {
    value?: Date;
    onChange?: (date: Date) => void;
    onClear?: () => void;
    className?: string;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
} = {}) {
    const [date, setDate] = React.useState<Date | undefined>(value);
    const [tempDate, setTempDate] = React.useState<Date>(value || new Date());
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (value !== undefined) {
            setDate(value);
            setTempDate(value);
        }
    }, [value]);
    const [view, setView] = React.useState<"default" | "month" | "year">("default");

    const safeMonth = tempDate ?? new Date();

    const months = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"
    ];

    const years = Array.from({ length: 20 }, (_, i) => 2010 + i);

    const inputClass =
        "flex h-9 w-full rounded-md border border-foreground/20 bg-white px-3 py-1 text-xs transition-colors hover:border-primary hover:bg-white focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50";

    React.useEffect(() => {
        if (open) {
            setTempDate(date || new Date());
            setView("default");
        }
    }, [open, date]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className={cn(inputClass, "cursor-pointer w-full justify-start font-normal text-xs", !date && "text-muted-foreground", className)}>
                    {date
                        ? format(date, "dd/MM/yyyy", { locale: es })
                        : "dd/mm/aaaa"}
                    <span className="ml-auto flex items-center gap-1">
                        {date && onClear && (
                            <span
                                role="button"
                                tabIndex={-1}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDate(undefined);
                                    onClear();
                                }}
                                className="p-0.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                                <X className="h-3.5 w-3.5" />
                            </span>
                        )}
                        <CalendarIcon className="h-4 w-4 text-foreground" />
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align={align}
                side={side}
                sideOffset={6}
                collisionPadding={16}
                className="w-[260px] p-0 rounded-xl border border-border shadow-xl z-[150] bg-white"
            >
                <div className="p-2 flex flex-col h-[360px]">

                    {/* HEADER */}
                    <div className="flex items-center w-full px-2 mb-2 shrink-0">
                        <button
                            type="button"
                            onClick={() =>
                                setTempDate(
                                    new Date(
                                        safeMonth.getFullYear(),
                                        safeMonth.getMonth() - 1
                                    )
                                )
                            }
                            className="p-1 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="flex-1 flex justify-center items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setView(v => v === "month" ? "default" : "month")}
                                className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                            >
                                {months[safeMonth.getMonth()]}
                                {view === "month" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => setView(v => v === "year" ? "default" : "year")}
                                className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                            >
                                {safeMonth.getFullYear()}
                                {view === "year" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setTempDate(
                                    new Date(
                                        safeMonth.getFullYear(),
                                        safeMonth.getMonth() + 1
                                    )
                                )
                            }
                            className="p-1 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* CALENDARIO */}
                    <div className="flex-1 overflow-hidden relative">
                        {view === "default" && (
                            <div className="absolute inset-0 flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={tempDate}
                                    onSelect={(val) => val && setTempDate(val)}
                                    locale={es}
                                    hideNavigation
                                    month={safeMonth}
                                    className="
                                      w-full
                                      [&_.rdp]:w-full
                                      [&_.rdp-table]:w-full
                                      [&_.rdp-cell]:p-0

                                      [&_button]:w-7
                                      [&_button]:h-7
                                      [&_button]:rounded-lg
                                      [&_button]:transition-colors
                                      [&_button]:text-xs

                                      /* hover SOLO para no seleccionados */
                                      [&_button:not([data-selected]):hover]:bg-primary/10
                                      [&_button:not([data-selected]):hover]:text-primary

                                      /* seleccionado */
                                      [&_[data-selected]]:bg-primary
                                      [&_[data-selected]]:text-primary-foreground
                                      [&_[data-selected]]:rounded-lg

                                      /* bloquear hover del seleccionado completamente */
                                      [&_[data-selected]:hover]:bg-primary
                                      [&_[data-selected]:hover]:text-primary-foreground

                                      /* quitar today */
                                      [&_[data-today]]:bg-transparent
                                      [&_[data-today]]:text-foreground
                                      [&_[data-today]]:border-0
                                    "
                                />
                            </div>
                        )}

                        {/* MESES */}
                        {view === "month" && (
                            <div className="absolute inset-0 grid grid-cols-3 gap-2 overflow-y-auto p-1 content-start">
                                {months.map((m, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => {
                                            setTempDate(new Date(safeMonth.getFullYear(), i));
                                            setView("default");
                                        }}
                                        className={cn(
                                            "py-2 rounded-md text-xs font-medium transition-colors hover:bg-primary/10 cursor-pointer",
                                            safeMonth.getMonth() === i &&
                                            "bg-primary text-primary-foreground hover:bg-primary"
                                        )}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* AÑOS */}
                        {view === "year" && (
                            <div className="absolute inset-0 grid grid-cols-3 gap-2 overflow-y-auto p-1 content-start">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        type="button"
                                        onClick={() => {
                                            setTempDate(new Date(year, safeMonth.getMonth()));
                                            setView("default");
                                        }}
                                        className={cn(
                                            "py-2 rounded-md text-xs font-medium transition-colors hover:bg-primary/10 cursor-pointer",
                                            safeMonth.getFullYear() === year &&
                                            "bg-primary text-primary-foreground hover:bg-primary"
                                        )}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-end items-center gap-2 mt-2 pt-2 border-t border-border shrink-0">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:bg-muted text-xs h-7 px-2 cursor-pointer"
                            onClick={() => {
                                setTempDate(date || new Date());
                                setOpen(false);
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-7 px-3 cursor-pointer"
                            onClick={() => {
                                if (tempDate) {
                                    setDate(tempDate);
                                    if (onChange) onChange(tempDate);
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