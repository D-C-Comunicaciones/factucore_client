"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

interface TimeParts {
    hour12: number;
    minute: number;
    period: "AM" | "PM";
}

function toParts(hour24: number, minute: number): TimeParts {
    const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    return { hour12, minute, period };
}

// Acepta "HH:mm" (24h, lo que ya guarda el resto del formulario) y lo separa
// en horas de 12h + AM/PM para la UI.
function parseTime(value?: string): TimeParts {
    if (!value) {
        const now = new Date();
        return toParts(now.getHours(), now.getMinutes());
    }
    const [h, m] = value.split(":").map((n) => parseInt(n, 10));
    return toParts(Number.isNaN(h) ? 0 : h, Number.isNaN(m) ? 0 : m);
}

function toValue(hour12: number, minute: number, period: "AM" | "PM"): string {
    let hour24 = hour12 % 12;
    if (period === "PM") hour24 += 12;
    return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function formatDisplay(value?: string): string {
    if (!value) return "hh:mm";
    const { hour12, minute, period } = parseTime(value);
    const d = new Date();
    d.setHours(period === "PM" ? (hour12 % 12) + 12 : hour12 % 12, minute, 0, 0);
    return format(d, "hh:mm a", { locale: es });
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export function TimePickerSimple({
    value,
    onChange,
    onClear,
    className,
}: { value?: string; onChange?: (time: string) => void; onClear?: () => void; className?: string } = {}) {
    const [open, setOpen] = React.useState(false);
    const initial = parseTime(value);
    const [tempHour, setTempHour] = React.useState(initial.hour12);
    const [tempMinute, setTempMinute] = React.useState(initial.minute);
    const [tempPeriod, setTempPeriod] = React.useState<"AM" | "PM">(initial.period);

    const hourListRef = React.useRef<HTMLDivElement>(null);
    const minuteListRef = React.useRef<HTMLDivElement>(null);

    const inputClass =
        "flex h-9 w-full rounded-md border border-foreground/20 bg-white px-3 py-1 text-sm transition-colors hover:border-primary hover:bg-white focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50";

    React.useEffect(() => {
        if (!open) return;
        const parts = parseTime(value);
        setTempHour(parts.hour12);
        setTempMinute(parts.minute);
        setTempPeriod(parts.period);

        // Centra la hora/minuto actuales en su columna al abrir, en vez de
        // dejar el scroll siempre arriba.
        requestAnimationFrame(() => {
            hourListRef.current
                ?.querySelector(`[data-value="${parts.hour12}"]`)
                ?.scrollIntoView({ block: "center" });
            minuteListRef.current
                ?.querySelector(`[data-value="${parts.minute}"]`)
                ?.scrollIntoView({ block: "center" });
        });
    }, [open, value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(inputClass, "cursor-pointer w-full justify-start font-normal", !value && "text-muted-foreground", className)}
                >
                    {formatDisplay(value)}
                    <span className="ml-auto flex items-center gap-1">
                        {value && onClear && (
                            <span
                                role="button"
                                tabIndex={-1}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClear();
                                }}
                                className="p-0.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                                <X className="h-3.5 w-3.5" />
                            </span>
                        )}
                        <Clock className="h-4 w-4 text-foreground" />
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" side="bottom" avoidCollisions={false} className="w-[220px] p-0 rounded-xl border border-border shadow-lg">
                <div className="p-2 flex flex-col h-[280px]">
                    <div className="flex-1 flex gap-1 overflow-hidden">
                        <div ref={hourListRef} className="flex-1 overflow-y-auto flex flex-col gap-1 p-1">
                            {HOURS.map((h) => (
                                <button
                                    key={h}
                                    type="button"
                                    data-value={h}
                                    onClick={() => setTempHour(h)}
                                    className={cn(
                                        "py-1.5 rounded-md text-sm transition-colors hover:bg-primary/10",
                                        tempHour === h && "bg-primary text-primary-foreground hover:bg-primary"
                                    )}
                                >
                                    {String(h).padStart(2, "0")}
                                </button>
                            ))}
                        </div>
                        <div ref={minuteListRef} className="flex-1 overflow-y-auto flex flex-col gap-1 p-1">
                            {MINUTES.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    data-value={m}
                                    onClick={() => setTempMinute(m)}
                                    className={cn(
                                        "py-1.5 rounded-md text-sm transition-colors hover:bg-primary/10",
                                        tempMinute === m && "bg-primary text-primary-foreground hover:bg-primary"
                                    )}
                                >
                                    {String(m).padStart(2, "0")}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1 p-1">
                            {(["AM", "PM"] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setTempPeriod(p)}
                                    className={cn(
                                        "px-2 py-1.5 rounded-md text-sm transition-colors hover:bg-primary/10",
                                        tempPeriod === p && "bg-primary text-primary-foreground hover:bg-primary"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-3 mt-3 pt-3 border-t border-border shrink-0">
                        <Button
                            variant="ghost"
                            className="text-muted-foreground hover:bg-primary/10"
                            onClick={() => setOpen(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => {
                                onChange?.(toValue(tempHour, tempMinute, tempPeriod));
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
