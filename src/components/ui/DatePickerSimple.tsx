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
} from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

export function DatePickerSimple({ value, onChange }: { value?: Date, onChange?: (date: Date) => void } = {}) {
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
        "flex h-9 w-full rounded-md border border-foreground/20 bg-white px-3 py-1 text-sm transition-colors hover:border-primary hover:bg-white focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50";

    React.useEffect(() => {
        if (open) {
            setTempDate(date || new Date());
            setView("default");
        }
    }, [open, date]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className={cn(inputClass, "w-full justify-start font-normal", !date && "text-muted-foreground")}>
                    {date
                        ? format(date, "dd/MM/yyyy", { locale: es })
                        : "dd/mm/aaaa"}
                    <CalendarIcon className="ml-auto h-4 w-4 text-foreground" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-[320px] p-0 rounded-xl border border-border shadow-lg"
            >
                <div className="p-2">

                    {/* HEADER */}
                    <div className="flex items-center w-full px-2 mb-2">
                        <button
                            onClick={() =>
                                setTempDate(
                                    new Date(
                                        safeMonth.getFullYear(),
                                        safeMonth.getMonth() - 1
                                    )
                                )
                            }
                            className="p-1 rounded hover:bg-primary/10 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="flex-1 flex justify-center items-center gap-2">
                            <button
                                onClick={() => setView(v => v === "month" ? "default" : "month")}
                                className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                            >
                                {months[safeMonth.getMonth()]}
                                {view === "month" ? <ChevronUp /> : <ChevronDown />}
                            </button>

                            <button
                                onClick={() => setView(v => v === "year" ? "default" : "year")}
                                className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                            >
                                {safeMonth.getFullYear()}
                                {view === "year" ? <ChevronUp /> : <ChevronDown />}
                            </button>
                        </div>

                        <button
                            onClick={() =>
                                setTempDate(
                                    new Date(
                                        safeMonth.getFullYear(),
                                        safeMonth.getMonth() + 1
                                    )
                                )
                            }
                            className="p-1 rounded hover:bg-primary/10 transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* CALENDARIO */}
                    <div className="pt-2 pb-0">
                        {view === "default" && (
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

                                  [&_button]:w-9
                                  [&_button]:h-9
                                  [&_button]:rounded-lg
                                  [&_button]:transition-colors

                                  /* hover SOLO para no seleccionados */
                                  [&_button:not([data-selected]):hover]:bg-primary/10
                                  [&_button:not([data-selected]):hover]:text-primary

                                  /* seleccionado */
                                  [&_[data-selected]]:bg-primary
                                  [&_[data-selected]]:text-primary-foreground
                                  [&_[data-selected]]:rounded-lg

                                  /* 🔥 bloquear hover del seleccionado completamente */
                                  [&_[data-selected]:hover]:bg-primary
                                  [&_[data-selected]:hover]:text-primary-foreground

                                  /* quitar today */
                                  [&_[data-today]]:bg-transparent
                                  [&_[data-today]]:text-foreground
                                  [&_[data-today]]:border-0
                                "
                            />
                        )}

                        {/* MESES */}
                        {view === "month" && (
                            <div className="grid grid-cols-3 gap-2 h-full overflow-y-auto p-2">
                                {months.map((m, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setTempDate(new Date(safeMonth.getFullYear(), i));
                                            setView("default");
                                        }}
                                        className={cn(
                                            "py-3 rounded-md text-sm transition-colors hover:bg-primary/10",
                                            safeMonth.getMonth() === i &&
                                            "bg-primary text-primary-foreground"
                                        )}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* AÑOS */}
                        {view === "year" && (
                            <div className="grid grid-cols-3 gap-2 h-full overflow-y-auto p-2">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => {
                                            setTempDate(new Date(year, safeMonth.getMonth()));
                                            setView("default");
                                        }}
                                        className={cn(
                                            "py-3 rounded-md text-sm transition-colors hover:bg-primary/10",
                                            safeMonth.getFullYear() === year &&
                                            "bg-primary text-primary-foreground"
                                        )}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-end items-center gap-3 mt-3 pt-3 border-t border-border">
                        <Button
                            variant="ghost"
                            className="text-muted-foreground hover:bg-primary/10"
                            onClick={() => {
                                setTempDate(date || new Date());
                                setOpen(false);
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
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