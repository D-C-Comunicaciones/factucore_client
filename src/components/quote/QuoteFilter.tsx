import * as React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CalendarDays, Clock, BadgeCheck, Funnel, CheckCircle, ListOrdered } from "lucide-react";

interface FilterOption {
    label: string;
    value: string;
    icon: React.ElementType;
}

interface QuoteFilterProps {
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
        label: "Cotizaciones vencidas",
        value: "overdue",
        icon: Clock,
    },
    {
        label: "Estado",
        value: "status",
        icon: BadgeCheck,
    },
    {
        label: "Número de Cotización",
        value: "number",
        icon: ListOrdered,
    },
];

export function QuoteFilter({ options, selected, onSelect }: QuoteFilterProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="bg-white ml-2 flex items-center gap-2 h-8 px-3 text-xs border-0 shadow-none text-foreground hover:bg-primary/10 hover:text-foreground transition-colors"
                >
                    <Funnel className="w-3.5 h-3.5" />
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
                            className={`
                            ${selected === opt.value ? "bg-primary/10 text-primary font-semibold" : ""}
                            data-[highlighted]:bg-primary/10
                            data-[highlighted]:text-primary
                            focus:bg-primary/10
                            focus:text-primary
                            transition-colors
                            `}
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

