import * as React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CalendarDays, CheckCircle, BadgeCheck, Funnel } from "lucide-react";

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

// Mirrors defaultFilterOptions in components/invoice/InvoiceFilter.tsx — same chip ids as
// SupportDocumentFilterChips.tsx (issue_date/due_date/dian_status_id/support_document_status_id).
export const defaultSupportDocumentFilterOptions: FilterOption[] = [
    {
        label: "Fecha de generación",
        value: "issue_date",
        icon: CalendarDays,
    },
    {
        label: "Fecha de vencimiento",
        value: "due_date",
        icon: CalendarDays,
    },
    {
        label: "Estado DIAN",
        value: "dian_status_id",
        icon: CheckCircle,
    },
    {
        label: "Estado",
        value: "support_document_status_id",
        icon: BadgeCheck,
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
