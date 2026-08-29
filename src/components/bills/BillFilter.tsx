import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarDays, Clock, BadgeCheck, Funnel, CheckCircle, ListOrdered } from "lucide-react";

export interface FilterOption {
    label: string;
    value: string;
    icon: React.ElementType;
}

interface BillFilterProps {
    options?: FilterOption[];
    selected?: string;
    onSelect?: (value: string) => void;
}

export const defaultBillFilterOptions: FilterOption[] = [
    {
        label: "Fecha de creación",
        value: "created_at",
        icon: CalendarDays,
    },
    {
        label: "Fecha de vencimiento",
        value: "due_date",
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

export function BillFilter({
    options = defaultBillFilterOptions,
    selected = "",
    onSelect = () => {},
}: BillFilterProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="bg-white ml-2 flex items-center gap-2 h-8 px-3 text-xs border-0 shadow-none text-foreground hover:bg-primary/10 hover:text-foreground transition-colors cursor-pointer"
                >
                    <Funnel className="w-3.5 h-3.5" />
                    <span>Filtrar</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1 bg-white shadow-xl rounded-xl border border-border">
                {options.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selected === opt.value;
                    return (
                        <DropdownMenuItem
                            key={opt.value}
                            onClick={() => onSelect(opt.value)}
                            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium cursor-pointer rounded-lg ${
                                isSelected
                                    ? "bg-primary text-white"
                                    : "text-foreground hover:bg-muted"
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                            <span>{opt.label}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
