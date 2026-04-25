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

interface DateFilterPopoverInlineProps {
    filter: any;
    setFilterValue: (val: any) => void;
}

export function DateFilterPopoverInline({
    filter,
    setFilterValue,
}: DateFilterPopoverInlineProps) {
    const [date, setDate] = React.useState<Date>();
    const [tempDate, setTempDate] = React.useState<Date>();
    const [open, setOpen] = React.useState(false);
    const [view, setView] = React.useState<"default" | "month" | "year">("default");

    const safeMonth = tempDate ?? new Date();

    const months = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"
    ];

    const years = Array.from({ length: 30 }, (_, i) => 2010 + i);

    React.useEffect(() => {
        if (open) {
            setTempDate(date);
            setView("default");
        }
    }, [open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    className={cn(
                        "w-[220px] justify-start text-left font-normal",
                        "bg-white border border-foreground/20 rounded-lg h-9 px-3 text-sm",
                        "hover:bg-primary/10 transition-colors",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {date
                        ? format(date, "dd/MM/yyyy", { locale: es })
                        : "dd/mm/aaaa"}
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
                            {/* MES */}
                            <button
                                onClick={() =>
                                    setView(v => v === "month" ? "default" : "month")
                                }
                                className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                            >
                                {months[safeMonth.getMonth()]}
                                {view === "month" ? <ChevronUp /> : <ChevronDown />}
                            </button>

                            {/* AÑO */}
                            <button
                                onClick={() =>
                                    setView(v => v === "year" ? "default" : "year")
                                }
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

                    {/* CONTENIDO */}
                    <div className="pt-2 pb-0">

                        {/* CALENDARIO */}
                        {view === "default" && (
                            <Calendar
                                mode="single"
                                selected={tempDate}
                                onSelect={setTempDate}
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

                                  /* 🔥 bloquear hover del seleccionado */
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
                            <div className="grid grid-cols-3 gap-3 p-3">
                                {months.map((m, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setTempDate(new Date(safeMonth.getFullYear(), i));
                                            setView("default");
                                        }}
                                        className={cn(
                                            "h-12 rounded-xl text-sm font-medium transition-colors",
                                            "hover:bg-primary/10",
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
                            <div className="grid grid-cols-3 gap-3 p-3 max-h-[260px] overflow-y-auto">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => {
                                            setTempDate(new Date(year, safeMonth.getMonth()));
                                            setView("default");
                                        }}
                                        className={cn(
                                            "h-12 rounded-xl text-sm font-medium transition-colors",
                                            "hover:bg-primary/10",
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
                                setTempDate(date);
                                setOpen(false);
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => {
                                setDate(tempDate);
                                setFilterValue(tempDate);
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