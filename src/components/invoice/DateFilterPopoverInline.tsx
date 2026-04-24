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

export function DateFilterPopoverInline({ filter, setFilterValue }: DateFilterPopoverInlineProps) {
    const [date, setDate] = React.useState<Date>();
    const [tempDate, setTempDate] = React.useState<Date>();
    const [open, setOpen] = React.useState(false);

    const [view, setView] = React.useState<"default" | "month" | "year">("default");

    const safeMonth = tempDate ?? new Date();

    const months = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"
    ];

    const years = Array.from({ length: 20 }, (_, i) => 2020 + i);

    const toggleView = (type: "month" | "year") => {
        setView((prev) => (prev === type ? "default" : type));
    };

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
                    variant="outline"
                    className={cn(
                        "w-[220px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                        ? format(date, "dd/MM/yyyy", { locale: es })
                        : "dd/mm/aaaa"}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-[320px] p-0 rounded-xl shadow-xl"
            >
                <div className="p-2">

                    {/* 🔥 HEADER (SIEMPRE VISIBLE) */}
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
                            className="p-1 rounded hover:bg-gray-100"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="flex-1 flex justify-center items-center gap-2">
                            {/* MES */}
                            <button
                                onClick={() => toggleView("month")}
                                className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100"
                            >
                                {months[safeMonth.getMonth()]}
                                {view === "month" ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </button>

                            {/* AÑO */}
                            <button
                                onClick={() => toggleView("year")}
                                className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100"
                            >
                                {safeMonth.getFullYear()}
                                {view === "year" ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
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
                            className="p-1 rounded hover:bg-gray-100"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* 🔥 CONTENIDO (MISMO ALTO SIEMPRE) */}
                    <div className="h-[300px] overflow-hidden">

                        {/* CALENDARIO */}
                        {view === "default" && (
                            <div className="flex justify-center w-full">
                                <Calendar
                                    mode="single"
                                    selected={tempDate}
                                    onSelect={setTempDate}
                                    locale={es}
                                    hideNavigation
                                    month={safeMonth}
                                    className="w-full max-w-[320px]"

                                    classNames={{
                                        months: "w-full",
                                        month: "w-full",

                                        table: "w-full",

                                        head_cell: "text-xs text-gray-500 text-center font-medium",

                                        head_row: "grid grid-cols-7 w-full mb-2",
                                        row: "grid grid-cols-7 w-full mb-1",

                                        cell: "flex justify-center items-center",

                                        day: "w-10 h-10 flex items-center justify-center rounded-md transition",


                                        day_selected:
                                            "bg-primary text-primary-foreground hover:bg-primary/90",

                                        day_today:
                                            "border border-ring/60 text-primary",

                                        day_outside:
                                            "text-gray-300",
                                    }}
                                />
                            </div>
                        )}

                        {/* MESES */}
                        {view === "month" && (
                            <div className="grid grid-cols-3 gap-2 h-full overflow-y-auto p-2">
                                {months.map((m, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setTempDate(
                                                new Date(safeMonth.getFullYear(), i)
                                            );
                                            setView("default");
                                        }}
                                        className={`py-3 rounded-md text-sm hover:bg-gray-100 ${safeMonth.getMonth() === i
                                            ? "bg-primary text-primary-foreground"
                                            : ""
                                            }`}
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
                                            setTempDate(
                                                new Date(year, safeMonth.getMonth())
                                            );
                                            setView("default");
                                        }}
                                        className={`py-3 rounded-md text-sm hover:bg-gray-100 ${safeMonth.getFullYear() === year
                                            ? "bg-primary text-primary-foreground"
                                            : ""
                                            }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 🔥 FOOTER */}
                    <div className="flex justify-end items-center gap-3 mt-3 pt-3 border-t">
                        <Button
                            variant="ghost"
                            className="text-gray-600"
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