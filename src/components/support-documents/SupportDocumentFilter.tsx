import * as React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CalendarDays, Filter, User, ListOrdered, CheckCircle2 } from "lucide-react";

export interface FilterOption {
    label: string;
    value: string;
    icon: React.ElementType;
}

interface SupportDocumentFilterProps {
    options?: FilterOption[];
    selected: string;
    onSelect: (value: string) => void;
}

export const defaultSupportDocumentFilterOptions: FilterOption[] = [
    {
        label: "Número",
        value: "number",
        icon: ListOrdered,
    },
    {
        label: "Proveedor",
        value: "supplier",
        icon: User,
    },
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
        icon: CheckCircle2,
    },
];

export function SupportDocumentFilter({
    options = defaultSupportDocumentFilterOptions,
    selected,
    onSelect
}: SupportDocumentFilterProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-white ml-2 flex items-center gap-1.5 h-8 px-3 text-xs border border-border text-foreground hover:bg-primary/10 hover:text-foreground transition-colors cursor-pointer shadow-none"
                >
                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                    Filtrar
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[200px] p-1.5 shadow-md">
                <div className="px-2.5 py-1.5 text-xs text-muted-foreground font-medium">Filtrar por</div>
                {options.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selected === opt.value;
                    return (
                        <DropdownMenuItem
                            key={opt.value}
                            onClick={() => onSelect(opt.value)}
                            className={`
                                flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-md cursor-pointer transition-colors
                                ${isSelected ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted focus:bg-muted"}
                            `}
                        >
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            {opt.label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
