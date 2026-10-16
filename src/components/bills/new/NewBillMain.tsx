"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HelpCircle, Plus, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { AddContactModal } from "@/components/contact/new/AddContactModal";
import { QuickCreateItemModal } from "@/components/invoice/new/QuickCreateItemModal";
import { NewTaxRateModal } from "@/components/taxes/NewTaxRateModal";
import { BillItemsTable } from "./BillItemsTable";
import { FactucoreLogo } from "@/components/brand/FactucoreLogo";
import { CompanyHeaderPdfStyle } from "@/components/shared/CompanyHeaderPdfStyle";
import { ContactsService } from "@/lib/contacts";
import { useCatalogs } from "@/hooks/useCatalogs";
import { usePurchaseOrdersList } from "@/hooks/purchaseOrders/usePurchaseOrders";
import { showToast } from "@/components/sonner/CustomToaster";
import type { BillWithholdingFormState } from "@/hooks/bills/useBillBuilder";

// Reusable component for currency formatting without cursor jumps
function FormattedInput({ value, onChange, placeholder, className }: any) {
    const [displayValue, setDisplayValue] = React.useState(value ? new Intl.NumberFormat('es-CO').format(value) : "");

    React.useEffect(() => {
        const numericDisplay = parseFloat(displayValue.replace(/\./g, "").replace(/,/g, ".")) || 0;
        if (value !== numericDisplay && value !== undefined) {
            setDisplayValue(value ? new Intl.NumberFormat('es-CO').format(value) : "");
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (!raw) {
            setDisplayValue("");
            onChange(0);
            return;
        }
        const num = parseFloat(raw);
        setDisplayValue(new Intl.NumberFormat('es-CO').format(num));
        onChange(num);
    };

    return (
        <Input
            type="text"
            placeholder={placeholder}
            value={displayValue}
            onChange={handleChange}
            className={className}
        />
    );
}

interface NewBillMainProps {
    formState: any;
    setFormState: React.Dispatch<React.SetStateAction<any>>;
    builder: any;
    errors?: Record<string, any>;
}

export function NewBillMain({
    formState,
    setFormState,
    builder,
    errors = {},
}: NewBillMainProps) {
    const catalogs = useCatalogs();
    const queryClient = useQueryClient();

    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [isQuickCreateItemOpen, setIsQuickCreateItemOpen] = useState(false);
    const [itemModalRowId, setItemModalRowId] = useState<string | null>(null);
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
    const [expandedPoIds, setExpandedPoIds] = useState<Record<string, boolean>>({});

    // Global Adjustments
    const [globalAdjustments, setGlobalAdjustments] = useState<any[]>([]);
    const [globalAdjType, setGlobalAdjType] = useState<"discount" | "charge">("discount");
    const [globalAdjValueType, setGlobalAdjValueType] = useState<"percentage" | "fixed">("percentage");
    const [globalAdjPercent, setGlobalAdjPercent] = useState<number>(0);
    const [globalAdjReason, setGlobalAdjReason] = useState<string>("");

    // Standard styling classes matching invoices
    const inputClass =
        "bg-white border border-foreground/20 rounded-lg h-9 px-3 text-sm text-foreground hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors";
    const tableInputClass =
        "h-8 text-xs bg-white border border-foreground/20 rounded-md shadow-none hover:border-primary focus:border-primary transition-colors";
    const selectItemClass =
        "cursor-pointer hover:bg-muted focus:bg-muted data-[state=checked]:bg-primary data-[state=checked]:text-white text-xs";

    // Contacts search state
    const [contactSearch, setContactSearch] = useState("");
    const [contactOptions, setContactOptions] = useState<{ value: string; label: string; details?: any }[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(false);

    // Fetch contacts
    useEffect(() => {
        let isCancelled = false;
        const fetchContacts = async () => {
            setLoadingContacts(true);
            try {
                const res: any = await ContactsService.list({ search: contactSearch, per_page: 30, type_contact_id: 2 });
                if (!isCancelled && res?.data?.contacts) {
                    const mapped = res.data.contacts.map((c: any) => ({
                        value: String(c.id),
                        label: c.name || c.registration_name || `${c.first_name || ''} ${c.last_name || ''}`.trim(),
                        details: c,
                    }));
                    setContactOptions(mapped);
                }
            } catch {
                try {
                    const resAll: any = await ContactsService.list({ search: contactSearch, per_page: 30 });
                    if (!isCancelled && resAll?.data?.contacts) {
                        const mapped = resAll.data.contacts.map((c: any) => ({
                            value: String(c.id),
                            label: c.name || c.registration_name || `${c.first_name || ''} ${c.last_name || ''}`.trim(),
                            details: c,
                        }));
                        setContactOptions(mapped);
                    }
                } catch {
                    // ignore
                }
            } finally {
                if (!isCancelled) setLoadingContacts(false);
            }
        };

        const timer = setTimeout(fetchContacts, 300);
        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [contactSearch]);

    // Purchase orders for contact
    const { data: purchaseOrdersData } = usePurchaseOrdersList({
        params: { contact_id: formState.contact_id },
        enabled: Boolean(formState.contact_id),
    });
    const poList = Array.isArray(purchaseOrdersData?.purchase_orders)
        ? purchaseOrdersData.purchase_orders
        : (Array.isArray(purchaseOrdersData) ? purchaseOrdersData : []);

    const handleSelectContact = (contactId: string) => {
        const selected = contactOptions.find((c) => c.value === contactId)?.details;
        if (selected) {
            setFormState((prev: any) => ({
                ...prev,
                contact_id: Number(contactId),
                supplier: selected,
                identification: selected.identification_number
                    ? `${selected.identification_number}${selected.verification_digit != null ? `-${selected.verification_digit}` : ''}`
                    : '',
                phone: selected.phone1 || selected.phone || '',
            }));
        } else {
            setFormState((prev: any) => ({
                ...prev,
                contact_id: contactId ? Number(contactId) : null,
            }));
        }
    };

    const handleQuickItemCreated = (newItem: any) => {
        if (!newItem) return;
        if (itemModalRowId) {
            const defaultPrice = Number(newItem.price_amount ?? newItem.price ?? newItem.cost ?? newItem.base_price ?? newItem.total_price ?? 0);
            builder.updateItem(itemModalRowId, "item_id", newItem.id);
            builder.updateItem(itemModalRowId, "item", newItem.name);
            builder.updateItem(itemModalRowId, "description", newItem.description || newItem.name);
            builder.updateItem(itemModalRowId, "referencia", newItem.reference || newItem.reference_code || newItem.code || "");
            builder.updateItem(itemModalRowId, "precio", defaultPrice);

            // El ítem recién creado no siempre trae tax_rates aplanado (según venga de
            // creación básica o avanzada) — se revisan ambas formas, igual que en factura
            // de venta, para que el impuesto quede preseleccionado sin que el usuario
            // tenga que volver a elegirlo.
            const itemTaxes = newItem.tax_rates || newItem.pricing?.tax_rates;
            if (itemTaxes && itemTaxes.length > 0) {
                const defaultTax = itemTaxes[0];
                builder.updateItem(itemModalRowId, "taxObj", {
                    tax_rate_id: defaultTax.tax_rate_id || defaultTax.id,
                    tax_id: defaultTax.tax_id,
                    code: defaultTax.tax_code || defaultTax.code,
                    name: defaultTax.name,
                    rate: parseFloat(defaultTax.rate || defaultTax.percentage || "0"),
                    type: defaultTax.type || "percentage",
                });
            } else {
                builder.updateItem(itemModalRowId, "taxObj", null);
            }

            queryClient.invalidateQueries({ queryKey: ["items"] });
        }
        setIsQuickCreateItemOpen(false);
        setItemModalRowId(null);
    };

    const togglePoExpand = (poId: string) => {
        setExpandedPoIds((prev) => ({ ...prev, [poId]: prev[poId] !== undefined ? !prev[poId] : false }));
    };

    const handleAddGlobalAdjustment = () => {
        if (globalAdjPercent <= 0) {
            showToast("Ingresa un valor mayor a 0", "warning");
            return;
        }
        const newAdj = {
            id: Date.now(),
            type: globalAdjType,
            valueType: globalAdjValueType,
            value: globalAdjPercent,
            reason: globalAdjReason.trim(),
        };
        setGlobalAdjustments((prev) => [...prev, newAdj]);
        setGlobalAdjPercent(0);
        setGlobalAdjReason("");
    };

    const handleRemoveGlobalAdjustment = (id: number) => {
        setGlobalAdjustments((prev) => prev.filter((a) => a.id !== id));
    };

    const globalDiscounts = globalAdjustments
        .filter((a) => a.type === "discount")
        .reduce((acc, a) => {
            if (a.valueType === "percentage") {
                return acc + (builder.totals.subtotal * a.value) / 100;
            }
            return acc + a.value;
        }, 0);

    const globalCharges = globalAdjustments
        .filter((a) => a.type === "charge")
        .reduce((acc, a) => {
            if (a.valueType === "percentage") {
                return acc + (builder.totals.subtotal * a.value) / 100;
            }
            return acc + a.value;
        }, 0);

    const finalPayableAmount = Math.max(0, builder.totals.payableAmount - globalDiscounts + globalCharges);

    const taxesOptions = (catalogs.taxes || []).map((t: any) => ({
        id: t.id,
        tax_id: t.tax_id,
        name: t.name,
        rate: Number(t.rate ?? t.percentage ?? 0),
        type: t.type || "percentage",
    }));

    const retentionTypes = (catalogs.withholdingRates && catalogs.withholdingRates.length > 0)
        ? catalogs.withholdingRates.map((r: any) => ({
            value: String(r.id),
            label: `${r.name} (${r.rate ?? r.percentage}%)`,
            rate: Number(r.rate ?? r.percentage ?? 0),
        }))
        : [
            { value: "1", label: "ReteFuente (2.5%)", rate: 2.5 },
            { value: "2", label: "ReteFuente (3.5%)", rate: 3.5 },
            { value: "3", label: "ReteFuente (4%)", rate: 4.0 },
            { value: "4", label: "ReteFuente (10%)", rate: 10.0 },
            { value: "5", label: "ReteIVA (15%)", rate: 15.0 },
            { value: "6", label: "ReteICA (0.414%)", rate: 0.414 },
            { value: "7", label: "ReteICA (0.966%)", rate: 0.966 },
            { value: "8", label: "ReteICA (1.104%)", rate: 1.104 },
        ];

    return (
        <TooltipProvider>
            <div className="filter drop-shadow-sm">
                <div
                    className="relative bg-white rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8 overflow-hidden"
                    style={{
                        clipPath: 'polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)'
                    }}
                >
                    {/* Folded Corner Effect */}
                    <div
                        className="absolute top-0 right-0 w-10 h-10 pointer-events-none"
                        style={{
                            filter: 'drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.08))'
                        }}
                    >
                        <div
                            className="w-full h-full bg-gradient-to-bl from-slate-200 via-slate-100 to-white border-l border-b border-slate-200/80"
                            style={{
                                clipPath: 'polygon(0 0, 0 100%, 100% 100%)'
                            }}
                        />
                    </div>

                    {/* HEADER: Logo, Company Header Style, Bill Number */}
                    <div className="flex flex-col md:grid md:grid-cols-3 items-center md:items-start gap-6 md:gap-0 mb-8 text-center md:text-left">
                        {/* Logo Container */}
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center md:justify-self-start flex items-center justify-center min-w-[160px] min-h-[100px]">
                            <FactucoreLogo
                                variant="icon"
                                className="max-h-[80px] w-auto"
                                alt="Logo de la empresa"
                            />
                        </div>

                        {/* Company Header Style */}
                        <div className="text-center pt-2">
                            <CompanyHeaderPdfStyle />
                        </div>

                        {/* Bill Number */}
                        <div className="text-center md:text-right md:justify-self-end">
                            <div className="inline-flex flex-col items-center md:items-end gap-1">
                                <span className="text-sm text-muted-foreground whitespace-nowrap text-center">
                                    Factura de compra
                                </span>
                                <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                                    <span>No. <span className="text-primary">*</span></span>
                                    <Input
                                        type="text"
                                        placeholder="FAC1"
                                        value={formState.bill_number || ""}
                                        onChange={(e) => setFormState((prev: any) => ({ ...prev, bill_number: e.target.value }))}
                                        className={cn(
                                            "w-36 h-8 text-sm font-bold text-center bg-white border rounded-md focus:border-primary",
                                            errors.bill_number ? "border-destructive" : "border-foreground/20"
                                        )}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground max-w-[220px]">
                                    Númeración de la factura hecha por el proveedor.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* FORM FIELDS: Proveedor, Fechas, Identificación, Forma/Medio de pago */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4 mb-2">
                        {/* Columna Izquierda */}
                        <div className="space-y-4">
                            {/* Proveedor */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="text-sm font-medium text-foreground sm:w-40 sm:text-right shrink-0 text-left">
                                    Proveedor <span className="text-primary">*</span>
                                </label>
                                <div className="flex-1 flex items-center gap-2">
                                    <SearchableSelect
                                        options={contactOptions}
                                        value={formState.contact_id ? String(formState.contact_id) : ""}
                                        onValueChange={handleSelectContact}
                                        placeholder="Seleccionar proveedor"
                                        searchPlaceholder="Buscar proveedor..."
                                        loading={loadingContacts}
                                        className={cn("w-full text-foreground", errors.contact_id && "border-destructive !text-destructive")}
                                    />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                                Selecciona el proveedor registrado para esta factura
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* Identificación */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="text-sm font-medium text-foreground sm:w-40 sm:text-right shrink-0 text-left">
                                    Identificación
                                </label>
                                <div className="flex-1 flex items-center gap-2">
                                    <Input
                                        type="text"
                                        readOnly
                                        value={formState.identification || ""}
                                        placeholder="Identificación del proveedor"
                                        className={cn(inputClass, "w-full bg-muted/20 cursor-default text-muted-foreground")}
                                    />
                                    <div className="w-4 shrink-0"></div>
                                </div>
                            </div>

                            {/* Teléfono */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="text-sm font-medium text-foreground sm:w-40 sm:text-right shrink-0 text-left">
                                    Teléfono
                                </label>
                                <div className="flex-1 flex items-center gap-2">
                                    <Input
                                        type="text"
                                        readOnly
                                        value={formState.phone || ""}
                                        placeholder="Teléfono del proveedor"
                                        className={cn(inputClass, "w-full bg-muted/20 cursor-default text-muted-foreground")}
                                    />
                                    <div className="w-4 shrink-0"></div>
                                </div>
                            </div>

                            {/* Nuevo proveedor link */}
                            <div className="flex items-center gap-3 mt-4">
                                <div className="hidden sm:block w-40 shrink-0"></div>
                                <div className="flex-1 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddContactOpen(true)}
                                        className="w-full text-primary hover:text-primary/80 text-sm font-medium flex justify-center items-center gap-1 transition-colors h-9 rounded-md hover:bg-muted cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Nuevo proveedor
                                    </button>
                                    <div className="w-4 shrink-0"></div>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-4">
                            {/* Fecha de Creación */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="text-sm font-medium text-foreground sm:w-32 sm:text-right shrink-0 text-left">
                                    Creación <span className="text-primary">*</span>
                                </label>
                                <div className="flex-1 flex items-center gap-2">
                                    <div className="flex-1">
                                        <DatePickerSimple
                                            value={formState.issue_date ? new Date(formState.issue_date) : new Date()}
                                            onChange={(d) => setFormState((prev: any) => ({ ...prev, issue_date: d ? d.toISOString().split('T')[0] : '' }))}
                                        />
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                                Fecha en la que se expide la factura de compra
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* Fecha de Vencimiento */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="text-sm font-medium text-foreground sm:w-32 sm:text-right shrink-0 text-left">
                                    Vencimiento <span className="text-primary">*</span>
                                </label>
                                <div className="flex-1 flex items-center gap-2">
                                    <div className="flex-1">
                                        <DatePickerSimple
                                            value={formState.due_date ? new Date(formState.due_date) : new Date()}
                                            onChange={(d) => setFormState((prev: any) => ({ ...prev, due_date: d ? d.toISOString().split('T')[0] : '' }))}
                                        />
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                                Fecha límite para el pago de la factura
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* Plazo / Forma de pago */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="text-sm font-medium text-foreground sm:w-32 sm:text-right shrink-0 text-left">
                                    Plazo de pago
                                </label>
                                <div className="flex-1 flex items-center gap-2">
                                    <SearchableSelect
                                        value={formState.payment_form_id ? String(formState.payment_form_id) : "1"}
                                        onValueChange={(val) => setFormState((prev: any) => ({ ...prev, payment_form_id: Number(val) }))}
                                        options={[
                                            { value: "1", label: "De contado" },
                                            { value: "2", label: "Crédito (8 días)" },
                                            { value: "3", label: "Crédito (15 días)" },
                                            { value: "4", label: "Crédito (30 días)" },
                                            { value: "5", label: "Crédito (60 días)" },
                                        ]}
                                        placeholder="De contado"
                                        searchPlaceholder="Buscar plazo..."
                                        className="w-full text-foreground"
                                    />
                                    <div className="w-4 shrink-0"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABLE: Productos y Servicios — mismo componente y estilos que factura de venta */}
                    <div className="space-y-3 pt-2">
                        <BillItemsTable builder={builder} taxes={taxesOptions} errors={errors} />
                    </div>

                    {/* LÍNEA SEPARADORA DEBAJO DE AGREGAR LÍNEA */}
                    <div className="border-t border-gray-200 my-4" />

                    {/* SECCIÓN DE BOTONES / MENÚS DE RETENCIONES Y ÓRDENES DE COMPRA (UNO A LA IZQUIERDA Y OTRO A LA DERECHA) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* COLUMNA IZQUIERDA: RETENCIONES */}
                        <div>
                            {builder.withholdings.length === 0 ? (
                                <div className="flex items-center justify-center py-2">
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => builder.addWithholding(builder.totals.subtotalAfterDiscount)}
                                            className="px-3 py-1.5 rounded-md hover:bg-muted text-primary hover:text-primary/90 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Agregar retención
                                        </button>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-slate-900 text-white px-3 py-2 text-xs rounded-lg font-medium shadow-xl max-w-[280px] text-center leading-relaxed">
                                                Si no existe la retención, puedes crearla. Descubre cómo <a href="#" className="underline text-primary hover:text-primary/80 font-medium">aquí</a>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {builder.withholdings.map((w: BillWithholdingFormState) => (
                                        <div key={w.id} className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-1.5 min-w-[170px] flex-1">
                                                <label className="text-xs font-semibold text-primary shrink-0">
                                                    Retención <span className="text-primary">*</span>
                                                </label>
                                                <Select
                                                    value={String(w.retention_id || "")}
                                                    onValueChange={(val) => {
                                                        const ret = retentionTypes.find((r) => r.value === val);
                                                        if (ret) {
                                                            builder.updateWithholding(w.id!, "retention_id", ret.value);
                                                            builder.updateWithholding(w.id!, "name", ret.label);
                                                            builder.updateWithholding(w.id!, "percentage", ret.rate);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="h-8 text-xs bg-white border border-gray-200 rounded-md cursor-pointer hover:border-primary">
                                                        <SelectValue placeholder="Retención" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {retentionTypes.map((ret) => (
                                                            <SelectItem key={ret.value} value={ret.value} className={selectItemClass}>
                                                                {ret.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex items-center gap-1 w-28">
                                                <label className="text-xs font-semibold text-primary shrink-0">Base <span className="text-primary">*</span></label>
                                                <FormattedInput
                                                    value={w.base || 0}
                                                    onChange={(val: number) => builder.updateWithholding(w.id!, "base", val)}
                                                    className={tableInputClass}
                                                />
                                            </div>

                                            <div className="flex items-center gap-1 w-28">
                                                <label className="text-xs font-semibold text-foreground shrink-0">Valor</label>
                                                <FormattedInput
                                                    value={w.value || 0}
                                                    onChange={(val: number) => builder.updateWithholding(w.id!, "value", val)}
                                                    className={tableInputClass}
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => builder.removeWithholding(w.id!)}
                                                className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                                title="Eliminar retención"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Botón para agregar otra retención */}
                                    <button
                                        type="button"
                                        onClick={() => builder.addWithholding(builder.totals.subtotalAfterDiscount)}
                                        className="text-primary hover:text-primary/80 text-xs font-semibold flex items-center gap-1 transition-colors h-7 px-2 rounded-md hover:bg-muted cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Agregar otra retención
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* COLUMNA DERECHA: ÓRDENES DE COMPRA */}
                        <div>
                            {builder.purchaseOrders.length === 0 ? (
                                <div className="flex items-center justify-center py-2">
                                    {formState.contact_id ? (
                                        <button
                                            type="button"
                                            onClick={builder.addPurchaseOrder}
                                            className="px-3 py-1.5 rounded-md hover:bg-muted text-primary hover:text-primary/90 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Órdenes de compra
                                        </button>
                                    ) : (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="px-3 py-1.5 rounded-md text-muted-foreground/40 text-sm font-semibold flex items-center gap-1.5 cursor-not-allowed select-none">
                                                    <Plus className="w-4 h-4" />
                                                    Órdenes de compra
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-slate-900 text-white px-3 py-2 text-xs rounded-lg font-medium shadow-xl">
                                                Selecciona un proveedor para agregar órdenes de compra
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {builder.purchaseOrders.map((poItem: any) => {
                                        const isExpanded = expandedPoIds[poItem.id] ?? false;
                                        const selectedPo = poList.find((p: any) => String(p.id) === String(poItem.purchase_order_id));
                                        const poLines = selectedPo?.items || selectedPo?.details || [];

                                        return (
                                            <div key={poItem.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all shadow-xs">
                                                <div className="flex items-center justify-between p-2 bg-slate-50/50">
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <label className="text-xs font-semibold text-primary shrink-0">Órden de compra</label>
                                                        <Select
                                                            value={poItem.purchase_order_id || ""}
                                                            onValueChange={(val) => builder.updatePurchaseOrder(poItem.id, val)}
                                                        >
                                                            <SelectTrigger className="h-8 text-xs bg-white border border-gray-200 rounded-md cursor-pointer hover:border-primary">
                                                                <SelectValue placeholder="Selecciona una orden de compra" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {poList.length > 0 ? (
                                                                    poList.map((po: any) => (
                                                                        <SelectItem key={po.id} value={String(po.id)} className={selectItemClass}>
                                                                            {po.reference || `${po.prefix || ''}${po.number || po.id}`} - ${Number(po.total || 0).toLocaleString('es-CO')}
                                                                        </SelectItem>
                                                                    ))
                                                                ) : (
                                                                    <SelectItem value="none" disabled className="text-xs text-muted-foreground">
                                                                        La búsqueda no obtuvo ningún resultado
                                                                    </SelectItem>
                                                                )}
                                                            </SelectContent>
                                                        </Select>

                                                        <button
                                                            type="button"
                                                            onClick={() => builder.removePurchaseOrder(poItem.id)}
                                                            className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                                            title="Eliminar orden de compra"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {poLines.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => togglePoExpand(poItem.id)}
                                                            className="p-1 rounded-md hover:bg-muted text-slate-500 transition-colors cursor-pointer"
                                                            title={isExpanded ? "Colapsar líneas" : "Expandir líneas"}
                                                        >
                                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </button>
                                                    )}
                                                </div>

                                                {isExpanded && poLines.length > 0 && (
                                                    <div className="p-2.5 overflow-x-auto bg-white border-t border-gray-200">
                                                        <table className="w-full text-xs text-left min-w-[500px]">
                                                            <thead>
                                                                <tr className="border-b border-gray-200 text-muted-foreground font-medium bg-muted/20">
                                                                    <th className="px-2 py-1.5 font-medium">Concepto</th>
                                                                    <th className="px-2 py-1.5 font-medium">Costo</th>
                                                                    <th className="px-2 py-1.5 font-medium">Desc</th>
                                                                    <th className="px-2 py-1.5 font-medium">Cant</th>
                                                                    <th className="px-2 py-1.5 font-medium text-right">Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-200">
                                                                {poLines.map((line: any, idx: number) => {
                                                                    const lineCost = Number(line.price ?? line.cost ?? line.price_amount ?? 0);
                                                                    const lineQty = Number(line.quantity ?? line.cantidad ?? 1);
                                                                    const lineDisc = Number(line.discount ?? 0);
                                                                    const lineTotal = lineCost * lineQty * (1 - lineDisc / 100);

                                                                    return (
                                                                        <tr key={line.id || idx} className="hover:bg-muted/10">
                                                                            <td className="px-2 py-1 font-medium text-foreground align-middle">
                                                                                {line.name || line.item_name || ""}
                                                                            </td>
                                                                            <td className="px-2 py-1 align-middle">
                                                                                ${lineCost.toLocaleString('es-CO')}
                                                                            </td>
                                                                            <td className="px-2 py-1 align-middle">
                                                                                {lineDisc}%
                                                                            </td>
                                                                            <td className="px-2 py-1 align-middle text-center">
                                                                                {lineQty}
                                                                            </td>
                                                                            <td className="px-2 py-1 text-right font-semibold text-foreground align-middle">
                                                                                ${lineTotal.toLocaleString('es-CO')}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Botón para agregar otra orden de compra */}
                                    <button
                                        type="button"
                                        onClick={builder.addPurchaseOrder}
                                        className="text-primary hover:text-primary/80 text-xs font-semibold flex items-center gap-1 transition-colors h-7 px-2 rounded-md hover:bg-muted cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Agregar otra orden de compra
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AJUSTES GLOBALES */}
                    <div className="space-y-4 pt-6 border-t border-border">
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-semibold text-foreground">Ajustes Globales</h3>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[240px] bg-slate-900 text-white p-2.5 text-xs leading-relaxed rounded-lg">
                                    Aplica un descuento o recargo al total de la factura de compra. Puedes ingresar el valor en porcentaje (%) o como monto fijo ($).
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Formulario a la izquierda */}
                            <div className="w-full md:w-1/3 space-y-3">
                                <div className="flex">
                                    <Select value={globalAdjType} onValueChange={(val: "discount" | "charge") => {
                                        setGlobalAdjType(val);
                                        setGlobalAdjValueType("percentage");
                                    }}>
                                        <SelectTrigger className="w-full bg-white h-9 border border-border rounded-r-none hover:bg-muted hover:border-primary cursor-pointer transition-colors text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="discount" className="text-sm cursor-pointer hover:bg-muted focus:bg-muted">Descuento</SelectItem>
                                            <SelectItem value="charge" className="text-sm cursor-pointer hover:bg-muted focus:bg-muted">Cargo</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={globalAdjValueType} onValueChange={(val: "percentage" | "fixed") => setGlobalAdjValueType(val)}>
                                        <SelectTrigger className="w-20 bg-white h-9 border border-border rounded-l-none border-l-0 hover:bg-muted hover:border-primary cursor-pointer transition-colors text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage" className="text-sm cursor-pointer hover:bg-muted focus:bg-muted">%</SelectItem>
                                            <SelectItem value="fixed" className="text-sm cursor-pointer hover:bg-muted focus:bg-muted">$</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {globalAdjValueType === 'percentage' ? (
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Valor"
                                        value={globalAdjPercent || ""}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            if (val > 100) {
                                                showToast("El porcentaje no puede ser mayor al 100%", "warning");
                                                setGlobalAdjPercent(0);
                                            } else {
                                                setGlobalAdjPercent(val);
                                            }
                                        }}
                                        className="w-full bg-white h-9 text-sm border border-foreground/20 rounded-lg"
                                    />
                                ) : (
                                    <FormattedInput
                                        placeholder="Valor"
                                        value={globalAdjPercent || 0}
                                        onChange={(val: number) => setGlobalAdjPercent(val)}
                                        className="w-full bg-white h-9 text-sm border border-foreground/20 rounded-lg"
                                    />
                                )}

                                <Input
                                    placeholder="Motivo"
                                    value={globalAdjReason}
                                    onChange={(e) => setGlobalAdjReason(e.target.value)}
                                    className="w-full bg-white h-9 text-sm border border-foreground/20 rounded-lg"
                                />

                                <button
                                    type="button"
                                    onClick={handleAddGlobalAdjustment}
                                    className="w-full bg-primary hover:bg-primary/90 text-white px-4 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                                >
                                    {globalAdjType === 'discount' ? 'Agregar descuento' : 'Agregar cargo'}
                                </button>
                            </div>

                            {/* Lista a la derecha */}
                            <div className="w-full md:w-2/3">
                                {globalAdjustments.length === 0 ? (
                                    <div className="text-sm text-muted-foreground italic h-full min-h-[140px] flex items-center justify-center border border-dashed border-border rounded-lg p-6 bg-muted/5">
                                        No hay ajustes globales agregados.
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                        {globalAdjustments.map((adj: any) => {
                                            const isDiscount = adj.type === 'discount';
                                            const title = isDiscount ? 'Descuento' : 'Cargo';
                                            const reason = adj.reason ? `: ${adj.reason}` : "";

                                            return (
                                                <div key={adj.id} className="flex items-center justify-between gap-4 bg-muted/10 p-3 rounded-lg border border-border">
                                                    <span className="text-sm font-medium text-foreground">
                                                        {title}{reason}
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-sm font-bold ${isDiscount ? 'text-destructive' : 'text-foreground'}`}>
                                                            {isDiscount ? '-' : '+'}{adj.valueType === 'percentage' ? `${adj.value}%` : `$ ${Math.round(adj.value).toLocaleString("es-CO")}`}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveGlobalAdjustment(adj.id)}
                                                            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM SECTION: Totales */}
                    <div className="flex flex-col md:flex-row justify-end items-start pt-6 border-t border-border gap-6 mt-6">
                        <div className="w-full max-w-xs space-y-2.5 text-sm text-foreground">
                            <div className="flex justify-between py-1 border-b border-border/40">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium text-foreground">
                                    ${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(builder.totals.subtotal || 0)}
                                </span>
                            </div>

                            {builder.totals.discountsAmount > 0 && (
                                <div className="flex justify-between py-1 border-b border-border/40">
                                    <span className="text-muted-foreground">Descuentos en Línea</span>
                                    <span className="font-medium text-destructive">
                                        -${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(builder.totals.discountsAmount)}
                                    </span>
                                </div>
                            )}

                            {globalDiscounts > 0 && (
                                <div className="flex justify-between py-1 border-b border-border/40 text-destructive">
                                    <span>Descuentos Globales</span>
                                    <span className="font-medium text-destructive">
                                        -${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(globalDiscounts)}
                                    </span>
                                </div>
                            )}

                            {globalCharges > 0 && (
                                <div className="flex justify-between py-1 border-b border-border/40">
                                    <span className="text-muted-foreground">Cargos Globales</span>
                                    <span className="font-medium text-foreground">
                                        +${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(globalCharges)}
                                    </span>
                                </div>
                            )}

                            {builder.totals.taxBreakdown && (Object.values(builder.totals.taxBreakdown) as { name: string; amount: number }[]).map(({ name, amount }) => (
                                <div key={name} className="flex justify-between py-1 border-b border-border/40">
                                    <span className="text-muted-foreground">{name}</span>
                                    <span className="font-medium text-foreground">
                                        +${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount || 0)}
                                    </span>
                                </div>
                            ))}

                            {builder.totals.withholdingsAmount > 0 && (
                                <div className="flex justify-between py-1 border-b border-border/40 text-amber-700">
                                    <span>Retenciones</span>
                                    <span className="font-medium">
                                        -${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(builder.totals.withholdingsAmount)}
                                    </span>
                                </div>
                            )}

                            <div className="border-t border-border/50 pt-3 flex justify-between items-center mt-2">
                                <span className="text-xl font-medium text-foreground">Total</span>
                                <span className="text-2xl font-medium text-foreground">
                                    ${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(finalPayableAmount || 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN INFERIOR: Términos y condiciones y Notas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mb-4 border-t border-border pt-6">
                        {/* Columna 1: Términos y condiciones */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                                Términos y condiciones
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[280px] bg-slate-900 text-white p-2.5 text-xs leading-relaxed rounded-lg shadow-xl">
                                            Condiciones comerciales acordadas con tu proveedor
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </label>
                            <textarea
                                rows={3}
                                value={formState.terms_conditions || ""}
                                onChange={(e) => setFormState((prev: any) => ({ ...prev, terms_conditions: e.target.value }))}
                                placeholder="Condiciones comerciales..."
                                className="w-full px-3 py-2 border border-foreground/20 rounded-lg text-sm text-foreground bg-white hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors resize-none"
                            />
                        </div>

                        {/* Columna 2: Notas */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                                Notas
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[280px] bg-slate-900 text-white p-2.5 text-xs leading-relaxed rounded-lg shadow-xl">
                                            Visible en la impresión del documento
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </label>
                            <textarea
                                rows={3}
                                value={formState.notes || ""}
                                onChange={(e) => setFormState((prev: any) => ({ ...prev, notes: e.target.value }))}
                                placeholder="Visible en la impresión del documento"
                                className="w-full px-3 py-2 border border-foreground/20 rounded-lg text-sm text-foreground bg-white hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddContactModal
                isOpen={isAddContactOpen}
                onClose={() => setIsAddContactOpen(false)}
                catalogData={catalogs}
                prefilledData={{ contactTypes: ["proveedor"] } as any}
                onCustomerCreated={(c: any) => {
                    if (c) {
                        setContactOptions((prev) => [
                            {
                                value: String(c.id),
                                label: c.name || c.registration_name || `${c.first_name || ''} ${c.last_name || ''}`.trim(),
                                details: c,
                            },
                            ...prev,
                        ]);
                        handleSelectContact(String(c.id));
                    }
                    setIsAddContactOpen(false);
                }}
            />

            {/* Botón oculto para abrir el modal de creación rápida desde la tabla de ítems */}
            <button
                id="open-quick-item-modal"
                className="hidden"
                onClick={(e) => {
                    const targetRowId = e.currentTarget.getAttribute("data-target-row");
                    setItemModalRowId(targetRowId);
                    setIsQuickCreateItemOpen(true);
                }}
            />

            <QuickCreateItemModal
                open={isQuickCreateItemOpen}
                onClose={() => {
                    setIsQuickCreateItemOpen(false);
                    setItemModalRowId(null);
                }}
                catalogs={catalogs}
                onCreated={handleQuickItemCreated}
            />

            <button id="open-new-tax-modal" className="hidden" onClick={() => setIsTaxModalOpen(true)} />

            <NewTaxRateModal
                open={isTaxModalOpen}
                onOpenChange={setIsTaxModalOpen}
                taxTypes={catalogs?.taxTypes || []}
                onSave={async () => {
                    // El componente NewTaxRateModal ya actualiza el cache de impuestos.
                }}
            />
        </TooltipProvider>
    );
}
