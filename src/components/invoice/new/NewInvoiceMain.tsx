"use client";
import { Settings, HelpCircle, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { InvoiceItemsTable } from "@/components/invoice/new/InvoiceItemsTable";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";

export function NewInvoiceMain({
    mainData,
    setInvoiceItems,
}: {
    mainData: any;
    setInvoiceItems: (items: any) => void;
}) {
    const inputClass =
        "bg-white border border-foreground/20 rounded-lg h-9 px-3 text-sm text-foreground hover:bg-primary/10 focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors";

    const selectItemClass =
        "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/20";

    return (
        <div className="bg-white rounded-lg border border-border p-8">
            {/* HEADER */}
            <div className="flex items-start justify-between mb-8">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <div className="text-muted-foreground font-medium mb-1">
                        Utilizar mi logo
                    </div>
                    <div className="text-xs text-muted-foreground">
                        176 × 51 pixeles
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground mb-1">
                        {mainData.company.name}
                    </h2>
                    <div className="text-sm text-muted-foreground">
                        NIT: {mainData.company.nit}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {mainData.company.email}
                    </div>
                </div>

                <div className="text-right">
                    <div className="mb-2">
                        <Select>
                            <SelectTrigger className={inputClass}>
                                <SelectValue placeholder={mainData.invoiceType} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Factura electrónica" className={selectItemClass}>
                                    Factura electrónica
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">No.</span>
                        <span className="font-bold text-lg text-foreground">
                            {mainData.invoiceNumber}
                        </span>
                        <button className="p-1 rounded hover:bg-muted/40 transition">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>
                </div>
            </div>

            {/* CLIENTE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mb-8">
                {/* DOCUMENTO */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Documento <span className="text-destructive">*</span>
                    </label>

                    <div className="flex gap-2">
                        <Select>
                            <SelectTrigger className={inputClass}>
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {mainData.documentTypes.map((opt: any) => (
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

                        <Input placeholder="Buscar Nº de ID" className={inputClass} />
                    </div>
                </div>

                {/* FECHA */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Fecha <span className="text-destructive">*</span>
                    </label>
                    <DatePickerSimple />
                </div>

                {/* CLIENTE */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Nombre o razón social{" "}
                        <span className="text-destructive">*</span>
                    </label>

                    <Select>
                        <SelectTrigger className={inputClass}>
                            <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            {mainData.sellerOptions.map((opt: any) => (
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

                {/* FORMA DE PAGO */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Forma de pago <span className="text-destructive">*</span>
                    </label>

                    <Select>
                        <SelectTrigger className={inputClass}>
                            <SelectValue placeholder="Forma de pago" />
                        </SelectTrigger>
                        <SelectContent>
                            {mainData.paymentForms.map((opt: any) => (
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

                {/* EMAIL */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Correo
                    </label>
                    <Input type="email" className={inputClass} />
                </div>

                {/* MEDIO DE PAGO */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Medio de pago <span className="text-destructive">*</span>
                    </label>

                    <Select>
                        <SelectTrigger className={inputClass}>
                            <SelectValue placeholder="Medio de pago" />
                        </SelectTrigger>
                        <SelectContent>
                            {mainData.paymentMethods.map((opt: any) => (
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
            </div>

            {/* NUEVO CONTACTO */}
            <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 mb-6 transition-colors">
                <Plus className="w-4 h-4" />
                Nuevo contacto
            </button>

            {/* ITEMS */}
            <InvoiceItemsTable
                items={mainData.invoiceItems}
                onAddItem={mainData.onAddItem}
            />

            {/* FOOTER */}
            <div className="grid grid-cols-2 gap-8 mt-8">
                <div className="space-y-6">
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors">
                        <Plus className="w-4 h-4" />
                        Agregar remisión
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </button>

                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <div className="text-muted-foreground font-medium mb-1">
                            Utilizar mi firma
                        </div>
                        <div className="text-xs text-muted-foreground">
                            176 × 51 pixeles
                        </div>
                    </div>

                    <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-foreground/20 rounded-lg text-sm text-foreground hover:bg-primary/10 focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors"
                    />

                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-foreground/20 rounded-lg text-sm text-foreground hover:bg-primary/10 focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors"
                    />

                    <div className="bg-muted/40 rounded-lg p-4 text-xs text-muted-foreground">
                        Autorización de numeración de facturación...
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">$ 0</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Descuento</span>
                            <span className="font-medium text-destructive">-$ 0</span>
                        </div>

                        <div className="border-t border-border pt-3 flex justify-between">
                            <span className="text-xl font-bold">Total</span>
                            <span className="text-2xl font-bold">$ 0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}