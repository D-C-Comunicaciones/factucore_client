import * as React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CalendarDays, Clock, BadgeCheck, Funnel, CheckCircle, ListOrdered } from "lucide-react";

interface FilterOption {
    label: string;
    value: string;
    icon: React.ElementType;
}

interface InvoiceFilterProps {
    options: FilterOption[];
    selected: string;
    onSelect: (value: string) => void;
}

export const defaultFilterOptions: FilterOption[] = [
    {
        label: "Fecha de creación",
        value: "created_at",
        icon: CalendarDays,
    },
    {
        label: "Fecha de vencimiento",
        value: "payment_due_date",
        icon: CalendarDays,
    },
    {
        label: "Estado DIAN",
        value: "status_dian",
        icon: CheckCircle,
    },
    {
        label: "Facturas vencidas",
        value: "overdue",
        icon: Clock,
    },
    {
        label: "Estado",
        value: "status",
        icon: BadgeCheck,
    },
    {
        label: "Número de factura",
        value: "number",
        icon: ListOrdered,
    },
];

export function InvoiceFilter({ options, selected, onSelect }: InvoiceFilterProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2 flex gap-2 items-center">
                    <Funnel className="w-4 h-4" />
                    Filtrar
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[220px]">
                <div className="px-3 py-2 text-xs text-muted-foreground font-semibold">Filtrar Por</div>
                {options.map((opt) => {
                    const Icon = opt.icon;
                    return (
                        <DropdownMenuItem
                            key={opt.value}
                            onClick={() => onSelect(opt.value)}
                            className={
                                selected === opt.value
                                    ? "bg-muted/50 font-semibold text-primary"
                                    : ""
                            }
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {opt.label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
