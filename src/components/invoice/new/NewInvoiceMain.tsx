"use client";
import { Settings, HelpCircle, Plus, Trash2 } from "lucide-react";
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
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { EditResolutionModal } from "@/components/invoice/new/EditResolutionModal";
import { type Resolution } from "@/lib/resolutions";

export function NewInvoiceMain({
    mainData,
    invoiceBuilder,
    selectedWarehouseId,
    selectedPriceListId,
    taxes,
    activeResolution,
    resolutions,
    selectedResolutionId,
    setSelectedResolutionId,
    notes,
    onNotesChange,
}: {
    mainData: any;
    invoiceBuilder: any;
    selectedWarehouseId: number | null;
    selectedPriceListId: number | null;
    taxes: any[];
    activeResolution?: Resolution | null;
    resolutions?: Resolution[];
    selectedResolutionId?: number | null;
    setSelectedResolutionId?: (id: number | null) => void;
    notes?: string;
    onNotesChange?: (val: string) => void;
}) {
    const inputClass =
        "bg-white border border-foreground/20 rounded-lg h-9 px-3 text-sm text-foreground hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors";

    const selectItemClass =
        "rounded-lg cursor-pointer transition-colors hover:bg-muted hover:text-foreground focus:bg-muted data-[state=checked]:bg-muted/50";

    const [globalAdjType, setGlobalAdjType] = useState<"discount" | "charge">("discount");
    const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
    const [globalAdjValueType, setGlobalAdjValueType] = useState<"percentage" | "fixed">("percentage");
    const [globalAdjPercent, setGlobalAdjPercent] = useState<number>(0);
    const [globalAdjReason, setGlobalAdjReason] = useState<string>("");
    const [formaPago, setFormaPago] = useState<string>("");
    const [fecha, setFecha] = useState<Date>(new Date());
    const [plazo, setPlazo] = useState<string>("0");
    const [vencimiento, setVencimiento] = useState<Date>(new Date());
    const [cliente, setCliente] = useState<string>("");
    const [medioPago, setMedioPago] = useState<string>("");
    const [docType, setDocType] = useState<string>("");

    useEffect(() => {
        if (mainData.paymentForms && mainData.paymentForms.length > 0 && !formaPago) {
            const contadoOpt = mainData.paymentForms.find((f: any) =>
                f.label?.toLowerCase().includes("contado") ||
                f.value?.toLowerCase() === "contado" ||
                f.value === "1"
            );
            if (contadoOpt) {
                setFormaPago(contadoOpt.value);
            } else {
                setFormaPago(mainData.paymentForms[0].value);
            }
        }
    }, [mainData.paymentForms, formaPago]);

    const selectedForm = mainData.paymentForms?.find((f: any) => f.value === formaPago);
    const isContado = !formaPago || !selectedForm ||
        selectedForm.label?.toLowerCase().includes("contado") ||
        selectedForm.value?.toLowerCase() === "contado" ||
        selectedForm.value === "1";

    useEffect(() => {
        if (plazo) {
            const days = parseInt(plazo, 10);
            if (!isNaN(days)) {
                const newDate = new Date(fecha);
                newDate.setDate(newDate.getDate() + days);
                setVencimiento(newDate);
            }
        }
    }, [plazo, fecha]);

    const handleAddGlobalAdjustment = () => {
        if (globalAdjPercent <= 0) return;
        invoiceBuilder.addGlobalAdjustment(globalAdjType, globalAdjValueType, globalAdjPercent, globalAdjReason);
        setGlobalAdjPercent(0);
        setGlobalAdjReason("");
    };

    return (
        <div className="relative bg-white rounded-lg border border-border p-8 overflow-hidden">
            {/* Punta doblada (folded page corner) */}
            <div className="absolute top-0 right-0 w-10 h-8 pointer-events-none overflow-hidden rounded-tr-lg">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#F3F4F6] rotate-45 transform origin-top-right translate-x-8 -translate-y-8 border-l border-b border-gray-200/80 shadow-sm bg-gradient-to-br from-gray-50 via-gray-100 to-white"></div>
            </div>

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
                    <div className="inline-flex flex-col items-start gap-1 text-left">
                        <span className="text-sm text-muted-foreground">Numeración</span>
                        <div className="flex items-center gap-2">
                            <SearchableSelect
                                value={selectedResolutionId?.toString() || ""}
                                onValueChange={(val) => setSelectedResolutionId?.(Number(val))}
                                options={resolutions?.map((res) => ({
                                    value: res.id.toString(),
                                    label: res.prefix || res.description || `Resolución ${res.id}`
                                })) || []}
                                placeholder="Seleccionar"
                                className="w-[160px] text-foreground"
                            />
                            <button
                                className="p-1 rounded hover:bg-muted/40 transition"
                                onClick={() => setIsResolutionModalOpen(true)}
                            >
                                <Settings className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-sm text-muted-foreground">No.</span>
                            <span className="font-bold text-lg text-foreground">
                                {mainData.invoiceNumber}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CLIENTE Y CONFIGURACIÓN */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4 mb-2">
                {/* Columna Izquierda */}
                <div className="space-y-4">
                    {/* DOCUMENTO */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground w-40 text-right shrink-0">
                            Documento
                        </label>
                        <div className="flex-1 flex items-center gap-2">
                            <div className="flex flex-1">
                                <SearchableSelect
                                    value={docType}
                                    onValueChange={setDocType}
                                    options={mainData.documentTypes}
                                    placeholder="Tipo"
                                    className={cn(inputClass, "w-28 rounded-r-none border-r-0 cursor-pointer")}
                                />
                                <Input placeholder="Buscar Nº de ID" className={cn(inputClass, "rounded-l-none flex-1")} />
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                        Selecciona el tipo de documento e ingresa el número de identificación del cliente
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {/* NOMBRE O RAZÓN SOCIAL */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground w-40 text-right shrink-0">
                            Nombre o razón social <span className="text-primary">*</span>
                        </label>
                        <div className="flex-1 flex items-center gap-2">
                            <SearchableSelect
                                value={cliente}
                                onValueChange={setCliente}
                                options={mainData.sellerOptions || []}
                                placeholder="Seleccionar cliente"
                                className="w-full text-foreground"
                            />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                        Selecciona el cliente para el cual se emitirá esta factura
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {/* CORREO */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground w-40 text-right shrink-0">
                            Correo
                        </label>
                        <div className="flex-1 flex items-center gap-2">
                            <Input type="email" placeholder="Leones1997@live.com" className={cn(inputClass, "w-full bg-muted/20")} />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                        Correo electrónico del cliente registrado para el envío de la factura electrónica
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha */}
                <div className="space-y-4">
                    {/* FECHA */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground w-32 text-right shrink-0">
                            Fecha <span className="text-primary">*</span>
                        </label>
                        <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1">
                                <DatePickerSimple value={fecha} onChange={setFecha} />
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                        Fecha en la que se emite la factura
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {/* FORMA DE PAGO */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground w-32 text-right shrink-0">
                            Forma de pago <span className="text-primary">*</span>
                        </label>
                        <div className="flex-1 flex items-center gap-2">
                            <SearchableSelect
                                value={formaPago}
                                onValueChange={setFormaPago}
                                options={mainData.paymentForms || []}
                                placeholder="Forma de pago"
                                className="w-full text-foreground"
                            />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                        Elige si la transacción es de contado (pago inmediato) o a crédito (pago diferido)
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {isContado ? (
                        <div className="flex items-center gap-3">
                            {/* MEDIO DE PAGO */}
                            <label className="text-sm font-medium text-foreground w-32 text-right shrink-0">
                                Medio de pago <span className="text-primary">*</span>
                            </label>
                            <div className="flex-1 flex items-center gap-2">
                                <SearchableSelect
                                    value={medioPago}
                                    onValueChange={setMedioPago}
                                    options={mainData.paymentMethods || []}
                                    placeholder="Seleccionar"
                                    className="w-full text-foreground"
                                />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                            Método utilizado por el cliente para saldar la factura (Efectivo, Consignación, etc.)
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* PLAZO DE PAGO */}
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-foreground w-32 text-right shrink-0">
                                    Plazo de pago
                                </label>
                                <div className="flex-1 flex items-center gap-2">
                                    <SearchableSelect
                                        value={plazo}
                                        onValueChange={setPlazo}
                                        options={[
                                            { value: "0", label: "De contado" },
                                            { value: "8", label: "8 días" },
                                            { value: "15", label: "15 días" },
                                            { value: "30", label: "30 días" },
                                            { value: "60", label: "60 días" },
                                            { value: "90", label: "90 días" },
                                        ]}
                                        placeholder="Seleccionar"
                                        className="w-full text-foreground"
                                    />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-zinc-800 text-white p-2 text-xs max-w-xs">
                                                Selecciona el tiempo máximo para el pago. Puedes agregar nuevos plazos <a href="#" className="underline">aquí</a>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* VENCIMIENTO */}
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-foreground w-32 text-right shrink-0">
                                    Vencimiento <span className="text-primary">*</span>
                                </label>
                                <div className="flex-1 flex items-center gap-2">
                                    <div className="flex-1">
                                        <DatePickerSimple value={vencimiento} onChange={setVencimiento} />
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-zinc-800 text-white p-2 text-xs max-w-xs">
                                                Fecha de vencimiento. Se calcula automáticamente si se define el plazo
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* NUEVO CONTACTO */}
            <div className="flex justify-start mb-8 pl-[11rem]">
                <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" />
                    Nuevo contacto
                </button>
            </div>

            {/* ITEMS */}
            <InvoiceItemsTable
                invoiceBuilder={invoiceBuilder}
                selectedWarehouseId={selectedWarehouseId}
                selectedPriceListId={selectedPriceListId}
                taxes={taxes}
            />

            {/* AJUSTES GLOBALES */}
            <div className="mt-8 border-t border-border pt-6">
                <div className="flex items-center gap-1.5 mb-4">
                    <h3 className="text-sm font-semibold text-foreground">Ajustes Globales</h3>
                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-zinc-800 text-white p-2 text-xs max-w-[220px] leading-relaxed">
                                Aplica un descuento o recargo al total de la factura. Puedes ingresar el valor en porcentaje (%) o como monto fijo ($) y agregar un motivo opcional.
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Formulario a la izquierda */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <div className="flex">
                            <Select value={globalAdjType} onValueChange={(val: "discount" | "charge") => setGlobalAdjType(val)}>
                                <SelectTrigger className="w-full bg-white h-9 border border-border rounded-r-none hover:bg-muted cursor-pointer transition-colors">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="discount" className="cursor-pointer hover:bg-muted focus:bg-muted">Descuento</SelectItem>
                                    <SelectItem value="charge" className="cursor-pointer hover:bg-muted focus:bg-muted">Recargo</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={globalAdjValueType} onValueChange={(val: "percentage" | "fixed") => setGlobalAdjValueType(val)}>
                                <SelectTrigger className="w-20 bg-white h-9 border border-border rounded-l-none border-l-0 hover:bg-muted cursor-pointer transition-colors">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage" className="cursor-pointer hover:bg-muted focus:bg-muted">%</SelectItem>
                                    <SelectItem value="fixed" className="cursor-pointer hover:bg-muted focus:bg-muted">$</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Input
                            type="number"
                            min={0}
                            onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault(); }}
                            placeholder="Valor"
                            value={globalAdjPercent || ""}
                            onChange={(e) => setGlobalAdjPercent(Number(e.target.value))}
                            className="w-full bg-white h-9 border border-border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />

                        <Input
                            placeholder="Motivo"
                            value={globalAdjReason}
                            onChange={(e) => setGlobalAdjReason(e.target.value)}
                            className="w-full bg-white h-9 border border-border"
                        />

                        <button
                            onClick={handleAddGlobalAdjustment}
                            className="w-full bg-primary text-primary-foreground px-4 h-9 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            Agregar ajuste
                        </button>
                    </div>

                    {/* Lista a la derecha */}
                    <div className="w-full md:w-2/3">
                        <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                            {invoiceBuilder.globalAdjustments.length === 0 && (
                                <div className="text-sm text-muted-foreground italic h-full min-h-32 flex items-center justify-center border border-dashed border-border rounded-lg p-6">
                                    No hay ajustes globales agregados.
                                </div>
                            )}
                            {invoiceBuilder.globalAdjustments.map((adj: any) => (
                                <div key={adj.id} className="flex items-center gap-4 bg-muted/10 p-3 rounded-lg border border-border">
                                    <span className="text-sm font-medium flex-1 truncate">
                                        {adj.type === 'discount' ? 'Descuento' : 'Recargo'}: {adj.reason}
                                    </span>
                                    <span className="text-sm font-bold w-20 text-right">
                                        {adj.valueType === 'percentage' ? `${adj.value}%` : `$${adj.value.toFixed(2)}`}
                                    </span>
                                    <button onClick={() => invoiceBuilder.removeGlobalAdjustment(adj.id)} className="p-1.5 rounded hover:bg-destructive/10 transition">
                                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER & TOTALS */}
            <div className="mt-8 border-t border-border pt-8">
                {/* Primera fila: Firma y Totales */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                    {/* Firma */}
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/5 w-full max-w-[280px]">
                        <div className="text-muted-foreground font-medium mb-1">
                            Utilizar mi firma
                        </div>
                        <div className="text-xs text-muted-foreground">
                            178 × 51 pixeles
                        </div>
                    </div>

                    {/* Totales y Remisión */}
                    <div className="w-full max-w-xs space-y-3 p-2 mt-6 md:mt-0">
                        <div className="flex justify-end mb-4">
                            <div className="flex items-center gap-1">
                                <button className="text-primary hover:text-primary hover:bg-muted/40 px-2 py-1 rounded-md text-sm font-medium flex items-center gap-1 transition-colors">
                                    <Plus className="w-4 h-4" />
                                    Agregar remisión
                                </button>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="w-3 h-3 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-white text-zinc-800 border border-border shadow-md p-3 text-xs">
                                            Aprende a crear tus remisiones <a href="#" className="underline font-medium">aquí</a>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium text-foreground">${(invoiceBuilder.totals.subtotal || 0).toFixed(2)}</span>
                        </div>

                        {invoiceBuilder.totals.lineDiscountsAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Descuento</span>
                                <span className="font-medium text-destructive">-${(invoiceBuilder.totals.lineDiscountsAmount || 0).toFixed(2)}</span>
                            </div>
                        )}

                        {invoiceBuilder.totals.globalDiscountsAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Descuentos Globales</span>
                                <span className="font-medium text-destructive">-${(invoiceBuilder.totals.globalDiscountsAmount || 0).toFixed(2)}</span>
                            </div>
                        )}

                        {invoiceBuilder.totals.globalChargesAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Recargos Globales</span>
                                <span className="font-medium text-foreground">${(invoiceBuilder.totals.globalChargesAmount || 0).toFixed(2)}</span>
                            </div>
                        )}

                        {invoiceBuilder.totals.taxBreakdown && (Object.values(invoiceBuilder.totals.taxBreakdown) as { name: string; amount: number }[]).map(({ name, amount }) => (
                            <div key={name} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{name}</span>
                                <span className="font-medium text-foreground">${(amount || 0).toFixed(2)}</span>
                            </div>
                        ))}

                        <div className="border-t border-border/50 pt-3 flex justify-between items-center mt-2">
                            <span className="text-xl font-medium text-foreground">Total</span>
                            <span className="text-2xl font-medium text-foreground">${(invoiceBuilder.totals.total || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Segunda fila: Términos y Notas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                            Términos y condiciones
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-3 h-3 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[280px] bg-zinc-800 text-white p-3 text-xs leading-relaxed">
                                        Define las condiciones que informarás a tus clientes sobre las ventas generadas. Para definir un texto por defecto haz <a href="#" className="underline font-medium">clic aquí</a>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </label>
                        <textarea
                            readOnly
                            rows={4}
                            defaultValue="Este documento se asimila en todos sus efectos a una letra de cambio de conformidad con el Art. 774 del código de comercio. Autorizo que en caso de incumplimiento de esta obligación sea reportado a las centrales de riesgo, se cobraran intereses por mora."
                            className="w-full px-3 py-2 border border-foreground/20 rounded-lg text-sm text-foreground bg-muted/10 cursor-default resize-none focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                            Notas
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-3 h-3 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[280px] bg-zinc-800 text-white p-3 text-xs leading-relaxed">
                                        Agrega información importante que tus clientes verán en esta factura. Para definir un texto por defecto haz <a href="#" className="underline font-medium">clic aquí</a>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </label>
                        <textarea
                            rows={4}
                            value={notes ?? ""}
                            onChange={(e) => onNotesChange?.(e.target.value)}
                            className="w-full px-3 py-2 border border-foreground/20 rounded-lg text-sm text-foreground hover:bg-primary/10 focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors resize-none"
                        />
                    </div>
                </div>

                {/* Tercera fila: Notas adicionales y Pie de factura */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">
                            Notas adicionales
                        </label>
                        <p className="text-xs text-muted-foreground mb-2">
                            Agrega comentarios para aclarar datos adicionales de la factura de venta, serán visibles para tus clientes
                        </p>
                    </div>

                    <div className="opacity-50 pointer-events-none">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Pie de factura
                        </label>
                        <textarea
                            disabled
                            rows={2}
                            value={activeResolution?.footer_text || ""}
                            placeholder="Visible en la impresión del documento"
                            className="w-full px-3 py-2 border border-foreground/20 rounded-lg text-sm text-foreground bg-muted/10 cursor-not-allowed resize-none"
                        />
                    </div>

                    <div className="text-xs text-muted-foreground pt-4">
                        Los campos marcados con <span className="text-primary">*</span> son obligatorios
                    </div>
                </div>
            </div>

            {/* Resolution Edit Modal */}
            <EditResolutionModal
                isOpen={isResolutionModalOpen}
                onClose={() => setIsResolutionModalOpen(false)}
                resolution={activeResolution || null}
            />
        </div>
    );
}