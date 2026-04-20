"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";

interface DateFilterPopoverInlineProps {
    filter: { id: string; value: unknown };
    setFilterValue: (val: string) => void;
}


import { format } from "date-fns";

function formatDateDisplay(date?: Date) {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
}


export function DateFilterPopoverInline({ filter, setFilterValue }: DateFilterPopoverInlineProps) {
    const [open, setOpen] = React.useState(false);
    const [tempDate, setTempDate] = React.useState<Date | undefined>(
        typeof filter.value === "string" && filter.value ? new Date(filter.value) : undefined
    );

    React.useEffect(() => {
        setTempDate(typeof filter.value === "string" && filter.value ? new Date(filter.value) : undefined);
    }, [filter.value]);

    function formatDateDisplay(date?: Date) {
        if (!date) return "";
        return date.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
    }

    return (
        <div className="flex flex-col items-center w-full">
            {/* Input visual */}
            <button
                type="button"
                className="flex items-center w-[220px] border-2 border-teal-300 rounded-lg px-3 py-2 bg-white text-sm text-gray-700 font-medium gap-2 mb-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                onClick={() => setOpen((v) => !v)}
            >
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M7 2v3M13 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="10" cy="11" r="2" fill="currentColor" /></svg>
                <span className={tempDate ? "" : "text-gray-400"}>
                    {tempDate ? formatDateDisplay(tempDate) : "dd/mm/aaaa"}
                </span>
            </button>
            {open && (
                <div className="shadow-lg rounded-xl border bg-white p-4 w-[340px] flex flex-col items-center z-50">
                    <Calendar
                        mode="single"
                        selected={tempDate}
                        onSelect={setTempDate}
                        captionLayout="dropdown"
                        locale={es}
                        className="rounded-lg w-full text-base"
                    />
                    <div className="flex justify-end gap-2 mt-4 w-full">
                        <button
                            className="px-3 py-1 text-xs rounded border border-gray-200 text-gray-600 hover:bg-gray-100"
                            onClick={() => {
                                setTempDate(typeof filter.value === "string" && filter.value ? new Date(filter.value) : undefined);
                                setOpen(false);
                            }}
                            type="button"
                        >
                            Cancelar
                        </button>
                        <button
                            className="px-3 py-1 text-xs rounded bg-teal-500 text-white hover:bg-teal-600"
                            onClick={() => {
                                if (tempDate) setFilterValue(tempDate.toISOString());
                                setOpen(false);
                            }}
                            type="button"
                        >
                            Aplicar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}