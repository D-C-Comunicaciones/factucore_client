"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search, Check } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

export interface ConfigWithholdingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    retentionName?: string;
    rate?: number | string;
    onSave?: (selectedAccount: string) => void;
    onCancel?: () => void;
}

// Standard chart of accounts categories for Colombian PUC (Gastos)
const expenseAccounts = [
    {
        category: "GASTOS",
        subcategories: [
            {
                name: "GASTOS DE VENTA",
                groups: [
                    {
                        groupName: "GASTOS DE PERSONAL DE VENTAS",
                        accounts: [
                            { id: "520506", name: "Sueldos personal de ventas" },
                            { id: "520515", name: "Horas extras y recargos personal de ventas" },
                            { id: "520518", name: "Comisiones personal de ventas" },
                            { id: "520527", name: "Auxilio de transporte personal de ventas" },
                            { id: "520530", name: "Cesantías personal de ventas" },
                            { id: "520533", name: "Intereses sobre cesantías personal de ventas" },
                            { id: "520536", name: "Prima de servicios personal de ventas" },
                            { id: "520539", name: "Vacaciones personal de ventas" },
                        ],
                    },
                    {
                        groupName: "GASTOS GENERALES DE VENTA",
                        accounts: [
                            { id: "5210", name: "Honorarios ventas" },
                            { id: "5220", name: "Arrendamientos ventas" },
                            { id: "5235", name: "Servicios ventas" },
                            { id: "5295", name: "Diversos ventas" },
                        ],
                    },
                ],
            },
            {
                name: "GASTOS DE ADMINISTRACIÓN",
                groups: [
                    {
                        groupName: "GASTOS DE PERSONAL DE ADMINISTRACIÓN",
                        accounts: [
                            { id: "510506", name: "Sueldos de administración" },
                            { id: "510515", name: "Horas extras administración" },
                            { id: "510527", name: "Auxilio de transporte administración" },
                        ],
                    },
                    {
                        groupName: "GASTOS GENERALES DE ADMINISTRACIÓN",
                        accounts: [
                            { id: "5110", name: "Honorarios de administración" },
                            { id: "5120", name: "Arrendamientos de administración" },
                            { id: "5135", name: "Servicios de administración" },
                            { id: "5195", name: "Diversos administración" },
                        ],
                    },
                ],
            },
            {
                name: "GASTOS NO OPERACIONALES",
                groups: [
                    {
                        groupName: "FINANCIEROS Y OTROS",
                        accounts: [
                            { id: "5305", name: "Gastos financieros" },
                            { id: "5315", name: "Gastos extraordinarios" },
                            { id: "5395", name: "Gastos diversos" },
                        ],
                    },
                ],
            },
        ],
    },
];

export function ConfigWithholdingsModal({
    open,
    onOpenChange,
    retentionName = "Compras",
    rate = "3.5",
    onSave,
    onCancel,
}: ConfigWithholdingsModalProps) {
    const [selectedAccount, setSelectedAccount] = useState<string>("");
    const [selectedAccountName, setSelectedAccountName] = useState<string>("");
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [search, setSearch] = useState("");

    const handleSelect = (accId: string, accName: string) => {
        setSelectedAccount(accId);
        setSelectedAccountName(accName);
        setIsSelectOpen(false);
    };

    const handleConfirm = () => {
        onSave?.(selectedAccount);
        onOpenChange(false);
    };

    const handleClose = () => {
        onCancel?.();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px] p-6 bg-white rounded-2xl shadow-2xl border border-border">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-base font-bold text-foreground">
                        Configuración de retenciones
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-1">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Selecciona la cuenta contable en la que se registrará el valor del gasto por las retenciones asumidas.
                    </p>

                    {/* Retention info */}
                    <div className="text-xs space-y-1 text-foreground font-medium">
                        <div>
                            <span className="text-muted-foreground font-normal">Retención: </span>
                            {retentionName}
                        </div>
                        <div>
                            <span className="text-muted-foreground font-normal">Tarifa: </span>
                            {rate}%
                        </div>
                    </div>

                    {/* Cuentas contables para gastos */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                            Cuentas contables para gastos <span className="text-primary">*</span>
                        </label>

                        <Popover open={isSelectOpen} onOpenChange={setIsSelectOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    role="combobox"
                                    aria-expanded={isSelectOpen}
                                    className="w-full flex items-center justify-between h-9 px-3 text-xs bg-white border border-teal-500 rounded-lg hover:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors text-left"
                                >
                                    <span className={selectedAccountName ? "text-foreground font-medium truncate" : "text-muted-foreground"}>
                                        {selectedAccountName || "Selecciona una cuenta contable..."}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[390px] p-0 bg-white shadow-xl rounded-xl border border-border max-h-[320px] overflow-hidden" align="start">
                                <Command className="w-full">
                                    <div className="flex items-center border-b px-3">
                                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                        <input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Buscar cuenta contable..."
                                            className="flex h-9 w-full rounded-md bg-transparent py-3 text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                    <CommandList className="max-h-[260px] overflow-y-auto p-2">
                                        <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                                            No se encontraron cuentas contables.
                                        </CommandEmpty>

                                        {expenseAccounts.map((cat) => (
                                            <div key={cat.category} className="space-y-2 mb-2">
                                                <div className="text-[11px] font-bold text-slate-500 uppercase px-2 py-0.5 tracking-wider">
                                                    {cat.category}
                                                </div>

                                                {cat.subcategories.map((sub) => (
                                                    <div key={sub.name} className="space-y-1 pl-2">
                                                        <div className="text-[11px] font-semibold text-slate-600 uppercase px-2 py-0.5 border-b border-slate-100">
                                                            {sub.name}
                                                        </div>

                                                        {sub.groups.map((grp) => (
                                                            <div key={grp.groupName} className="space-y-0.5 pl-2">
                                                                <div className="text-[11px] font-medium text-slate-500 uppercase px-2 py-0.5">
                                                                    {grp.groupName}
                                                                </div>

                                                                {grp.accounts
                                                                    .filter((acc) =>
                                                                        !search ||
                                                                        acc.name.toLowerCase().includes(search.toLowerCase()) ||
                                                                        acc.id.includes(search)
                                                                    )
                                                                    .map((acc) => (
                                                                        <CommandItem
                                                                            key={acc.id}
                                                                            value={`${acc.id} - ${acc.name}`}
                                                                            onSelect={() => handleSelect(acc.id, acc.name)}
                                                                            className="flex items-center justify-between text-xs py-1.5 px-3 rounded-md hover:bg-teal-50 hover:text-teal-900 cursor-pointer transition-colors"
                                                                        >
                                                                            <span>{acc.name}</span>
                                                                            {selectedAccount === acc.id && (
                                                                                <Check className="w-3.5 h-3.5 text-teal-600 ml-2 shrink-0" />
                                                                            )}
                                                                        </CommandItem>
                                                                    ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="h-9 px-4 text-xs font-medium rounded-lg"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        className="h-9 px-4 text-xs font-medium rounded-lg bg-primary hover:bg-primary/90 text-white"
                    >
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
