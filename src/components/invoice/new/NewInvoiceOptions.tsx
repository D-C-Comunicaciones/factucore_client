"use client";
import { HelpCircle } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function NewInvoiceOptions({
    warehouseOptions,
    priceListOptions,
    sellerOptions,
}: {
    warehouseOptions: { value: string; label: string }[];
    priceListOptions: { value: string; label: string }[];
    sellerOptions: { value: string; label: string }[];
}) {
    const baseInput =
        "bg-white h-9 px-3 text-sm border border-foreground/20 shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40";

    const selectItemClass =
        "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary";

    return (
        <div className="bg-white rounded-lg border border-border p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

                {/* TIPO DOCUMENTO */}
                <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Tipo de documento
                    </label>

                    <div className="flex gap-2">
                        <button
                            className="
                                flex-1 h-[42px] rounded-lg text-sm font-medium
                                bg-primary text-primary-foreground
                                hover:bg-primary/90 transition-colors
                            "
                        >
                            FE Venta
                        </button>

                        <button
                            className="
                                flex-1 h-[42px] rounded-lg text-sm font-medium
                                border border-border bg-background
                                hover:bg-primary/10 hover:text-primary hover:border-primary/40
                                transition-colors
                            "
                        >
                            Tiquete
                        </button>
                    </div>
                </div>

                {/* BODEGA */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Bodega
                    </label>

                    <Select>
                        <SelectTrigger className={baseInput}>
                            <SelectValue placeholder="Selecciona bodega" />
                        </SelectTrigger>

                        <SelectContent className="bg-background border border-border rounded-xl shadow-lg">
                            {warehouseOptions.map((opt) => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className={selectItemClass}
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* LISTA DE PRECIOS */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                        Lista de precios
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </label>

                    <Select>
                        <SelectTrigger className={baseInput}>
                            <SelectValue placeholder="Selecciona lista" />
                        </SelectTrigger>

                        <SelectContent className="bg-background border border-border rounded-xl shadow-lg">
                            {priceListOptions.map((opt) => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className={selectItemClass}
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* VENDEDOR */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                        Vendedor
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </label>

                    <Select>
                        <SelectTrigger className={baseInput}>
                            <SelectValue placeholder="Seleccionar vendedor" />
                        </SelectTrigger>

                        <SelectContent className="bg-background border border-border rounded-xl shadow-lg">
                            {sellerOptions.map((opt) => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className={selectItemClass}
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* ORDEN COMPRA */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                        Orden de compra
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </label>

                    <Input className={baseInput} />
                </div>

                {/* ORDEN ENTREGA */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                        Orden de entrega
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </label>

                    <Input className={baseInput} />
                </div>
            </div>
        </div>
    );
}