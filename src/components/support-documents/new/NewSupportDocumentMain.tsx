"use client";

import React, { useState, useEffect } from "react";
import { Settings, HelpCircle, Plus, Trash2, X, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { EditResolutionModal } from "@/components/invoice/new/EditResolutionModal";
import { AddContactModal } from "@/components/contact/new/AddContactModal";
import { QuickCreateItemModal } from "@/components/invoice/new/QuickCreateItemModal";
import { ConfigWithholdingsModal } from "@/components/support-documents/ConfigWithholdingsModal";
import { FactucoreLogo } from "@/components/brand/FactucoreLogo";
import { CompanyHeaderPdfStyle } from "@/components/shared/CompanyHeaderPdfStyle";
import { ContactsService } from "@/lib/contacts";
import { useItems } from "@/hooks/items/useItems";
import { useCatalogs } from "@/hooks/useCatalogs";
import { usePurchaseOrdersList } from "@/hooks/purchaseOrders/usePurchaseOrders";
import { showToast } from "@/components/sonner/CustomToaster";
import type { Resolution } from "@/lib/resolutions";
import type { SupportDocumentLine, SupportDocumentWithholding } from "@/types/supportDocument";

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

interface NewSupportDocumentMainProps {
    companyName?: string;
    activeResolution?: Resolution | null;
    resolutions?: Resolution[];
    selectedResolutionId?: number | null;
    setSelectedResolutionId?: (id: number | null) => void;
    onRefetchResolutions?: () => void;
    formState: any;
    setFormState: React.Dispatch<React.SetStateAction<any>>;
    builder: any;
    errors?: Record<string, any>;
}

export function NewSupportDocumentMain({
    companyName = "Andrés Leones",
    activeResolution,
    resolutions = [],
    selectedResolutionId,
    setSelectedResolutionId,
    onRefetchResolutions,
    formState,
    setFormState,
    builder,
    errors = {},
}: NewSupportDocumentMainProps) {
    const catalogs = useCatalogs();

    const [isEditResolutionOpen, setIsEditResolutionOpen] = useState(false);
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [isQuickCreateItemOpen, setIsQuickCreateItemOpen] = useState(false);
    const [itemModalRowId, setItemModalRowId] = useState<string | null>(null);
    const [isEditingAuthText, setIsEditingAuthText] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [isConfigWithholdingsOpen, setIsConfigWithholdingsOpen] = useState(false);
    const [activeWithholdingForConfig, setActiveWithholdingForConfig] = useState<SupportDocumentWithholding | null>(null);
    const [expandedPoIds, setExpandedPoIds] = useState<Record<string, boolean>>({});

    // Global Adjustments
    const [globalAdjustments, setGlobalAdjustments] = useState<any[]>([]);
    const [globalAdjType, setGlobalAdjType] = useState<"discount" | "charge">("discount");
    const [globalAdjValueType, setGlobalAdjValueType] = useState<"percentage" | "fixed">("percentage");
    const [globalAdjPercent, setGlobalAdjPercent] = useState<number>(0);
    const [globalAdjReason, setGlobalAdjReason] = useState<string>("");

    // Standard classes matching invoices
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

    // Items catalog query via React Query with automatic caching
    const { data: itemsResponse, isLoading: loadingItems } = useItems({ params: { per_page: 100 } });
    const itemsList = React.useMemo(() => {
        const list = itemsResponse?.data;
        return Array.isArray(list) ? list : [];
    }, [itemsResponse]);

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

    const handleItemSelect = (rowId: string, itemIdStr: string) => {
        if (itemIdStr === "__new__") {
            setItemModalRowId(rowId);
            setIsQuickCreateItemOpen(true);
            return;
        }

        const item: any = itemsList.find((i) => String(i.id) === itemIdStr);
        if (item) {
            const defaultPrice = Number(item.price_amount ?? item.price ?? item.cost ?? 0);
            builder.updateItem(rowId, "item_id", item.id);
            builder.updateItem(rowId, "item", item.name);
            builder.updateItem(rowId, "description", item.description || item.name);
            builder.updateItem(rowId, "referencia", item.reference || item.reference_code || item.code || "");
            builder.updateItem(rowId, "precio", defaultPrice);
            if (item.tax_rates && item.tax_rates.length > 0) {
                const tax = item.tax_rates[0];
                builder.updateItem(rowId, "taxObj", tax);
            }
        }
    };

    const handleQuickItemCreated = (newItem: any) => {
        if (!newItem) return;
        if (itemModalRowId) {
            const defaultPrice = Number(newItem.price_amount ?? newItem.price ?? newItem.cost ?? 0);
            builder.updateItem(itemModalRowId, "item_id", newItem.id);
            builder.updateItem(itemModalRowId, "item", newItem.name);
            builder.updateItem(itemModalRowId, "description", newItem.description || newItem.name);
            builder.updateItem(itemModalRowId, "precio", defaultPrice);
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
        name: t.name,
        rate: Number(t.rate ?? t.percentage ?? 0),
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

    const paymentFormsOptions = (catalogs.paymentForms && catalogs.paymentForms.length > 0)
        ? catalogs.paymentForms.map((pf: any) => ({
            value: String(pf.id),
            label: pf.name || (pf.id === 1 ? "Contado" : "Crédito"),
        }))
        : [
            { value: "1", label: "Contado" },
            { value: "2", label: "Crédito" },
        ];

    const paymentMethodsOptions = (catalogs.paymentMethods && catalogs.paymentMethods.length > 0)
        ? catalogs.paymentMethods.map((pm: any) => ({
            value: String(pm.id),
            label: pm.name,
        }))
        : [
            { value: "10", label: "Efectivo" },
            { value: "42", label: "Consignación bancaria" },
            { value: "48", label: "Tarjeta Crédito" },
            { value: "49", label: "Tarjeta Débito" },
            { value: "47", label: "Transferencia Débito Bancaria" },
            { value: "1", label: "Instrumento no definido" },
        ];

    const currentConsecutive = activeResolution
        ? `${activeResolution.prefix || ''}${((activeResolution.current_number ?? (activeResolution.from_number - 1)) + 1)}`
        : "1";

    return (
        <TooltipProvider>
            <div className="filter drop-shadow-sm">
                <div
                    className="relative bg-white rounded-lg border border-border p-4 sm:p-6 md:p-8 overflow-hidden"
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

                    {/* HEADER: Logo, Company Header Style, Consecutivo / Document Selector */}
                    <div className="flex flex-col md:grid md:grid-cols-3 items-center md:items-start gap-6 md:gap-0 mb-8 text-center md:text-left">
                        {/* Logo Container */}
                        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center md:justify-self-start flex items-center justify-center min-w-[160px] min-h-[100px]">
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

                        {/* Document type & Consecutivo No. X with gear icon */}
                        <div className="text-center md:text-right md:justify-self-end">
                            <div className="inline-flex flex-col items-center md:items-end gap-1">
                                <span className="text-sm text-muted-foreground whitespace-nowrap text-center">
                                    Documento soporte
                                </span>
                                <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                                    <span>No. {currentConsecutive}</span>
                                    <button
                                        type="button"
                                        className="p-1 rounded hover:bg-muted/40 transition cursor-pointer text-muted-foreground hover:text-foreground"
                                        onClick={() => setIsEditResolutionOpen(true)}
                                        title="Configurar resolución"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                </div>
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
                                                Selecciona el proveedor no obligado a facturar
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
                            {/* Fecha de operación */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="text-sm font-medium text-foreground sm:w-32 sm:text-right shrink-0 text-left">
                                    Fecha <span className="text-primary">*</span>
                                </label>
                                <div className="flex-1 flex items-center gap-2">
                                    <div className="flex-1">
                                        <DatePickerSimple
                                            value={formState.operation_date ? new Date(formState.operation_date) : new Date()}
                                            onChange={(d) => setFormState((prev: any) => ({ ...prev, operation_date: d ? d.toISOString().split('T')[0] : '' }))}
                                        />
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                                Fecha en la que se realizó la operación
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* Forma de pago */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="text-sm font-medium text-foreground sm:w-32 sm:text-right shrink-0 text-left">
                                    Forma de pago <span className="text-primary">*</span>
                                </label>
                                <div className="flex-1 flex items-center gap-2">
                                    <SearchableSelect
                                        value={formState.payment_form_id ? String(formState.payment_form_id) : "1"}
                                        onValueChange={(val) => setFormState((prev: any) => ({ ...prev, payment_form_id: Number(val) }))}
                                        options={paymentFormsOptions}
                                        placeholder="Forma de pago"
                                        searchPlaceholder="Buscar forma de pago..."
                                        className="w-full text-foreground"
                                    />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                                Elige si la compra es de contado o a crédito
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* Medio de pago */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="text-sm font-medium text-foreground sm:w-32 sm:text-right shrink-0 text-left">
                                    Medio de pago <span className="text-primary">*</span>
                                </label>
                                <div className="flex-1 flex items-center gap-2">
                                    <SearchableSelect
                                        value={formState.payment_method_id ? String(formState.payment_method_id) : "10"}
                                        onValueChange={(val) => setFormState((prev: any) => ({ ...prev, payment_method_id: Number(val) }))}
                                        options={paymentMethodsOptions}
                                        placeholder="Seleccionar"
                                        searchPlaceholder="Buscar medio de pago..."
                                        className="w-full text-foreground"
                                    />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                                Medio utilizado para realizar el pago
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABLE: Productos y Servicios */}
                    <div className="space-y-3 pt-2">
                        <div className="border border-border rounded-lg overflow-x-auto">
                            <table className="w-full text-xs text-left min-w-[720px]">
                                <thead>
                                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                                        <th className="px-3 py-2.5 font-medium w-[24%]">Concepto</th>
                                        <th className="px-3 py-2.5 font-medium w-[15%]">Precio</th>
                                        <th className="px-3 py-2.5 font-medium w-[15%]">Desc %</th>
                                        <th className="px-3 py-2.5 font-medium w-[16%]">Impuesto</th>
                                        <th className="px-3 py-2.5 font-medium w-[10%]">Cantidad</th>
                                        <th className="px-3 py-2.5 font-medium w-[12%]">Descripción</th>
                                        <th className="px-3 py-2.5 font-medium w-[12%] text-right">Total</th>
                                        <th className="px-3 py-2.5 font-medium w-[6%] text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {builder.items.map((line: SupportDocumentLine) => {
                                        const qty = Number(line.cantidad) || 0;
                                        const price = Number(line.precio) || 0;
                                        const sub = qty * price;
                                        let disc = 0;
                                        if (line.discountValue) {
                                            disc = line.discountType === 'percentage'
                                                ? (sub * Number(line.discountValue)) / 100
                                                : Number(line.discountValue);
                                        }
                                        const lineTotal = Math.max(0, sub - disc);

                                        return (
                                            <tr key={line.id} className="hover:bg-muted/20 transition-colors">
                                                {/* Concepto */}
                                                <td className="px-2 py-2 align-middle">
                                                    <SearchableSelect
                                                        value={line.item_id ? String(line.item_id) : ""}
                                                        onValueChange={(val) => handleItemSelect(line.id, val)}
                                                        options={itemsList.map((i: any) => ({
                                                            value: String(i.id),
                                                            label: `${(i.reference || i.code) ? `${i.reference || i.code} - ` : ''}${i.name}`,
                                                        }))}
                                                        placeholder="Seleccionar"
                                                        searchPlaceholder="Buscar ítem..."
                                                        className="h-8 text-xs bg-white shadow-none hover:border-primary focus:border-primary transition-colors border-foreground/20"
                                                        footer={
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setItemModalRowId(line.id);
                                                                    setIsQuickCreateItemOpen(true);
                                                                }}
                                                                className="w-full text-left px-2 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 rounded-md transition-colors cursor-pointer"
                                                            >
                                                                + Crear nuevo producto
                                                            </button>
                                                        }
                                                    />
                                                </td>

                                                {/* Precio */}
                                                <td className="px-2 py-2 align-middle">
                                                    <FormattedInput
                                                        placeholder="0"
                                                        value={line.precio || 0}
                                                        onChange={(num: number) => builder.updateItem(line.id, "precio", num)}
                                                        className={tableInputClass}
                                                    />
                                                </td>

                                                {/* Desc % */}
                                                <td className="px-2 py-2 align-middle">
                                                    <div className="flex items-center">
                                                        <Input
                                                            type="number"
                                                            value={line.discountValue || 0}
                                                            onChange={(e) => builder.updateItem(line.id, "discountValue", Number(e.target.value))}
                                                            className={cn(tableInputClass, "rounded-r-none border-r-0")}
                                                        />
                                                        <Select
                                                            value={line.discountType || "percentage"}
                                                            onValueChange={(val) => builder.updateItem(line.id, "discountType", val)}
                                                        >
                                                            <SelectTrigger className="h-8 px-1 text-xs border border-foreground/20 bg-white shadow-none rounded-l-none w-12 hover:bg-muted cursor-pointer transition-colors">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="percentage" className="cursor-pointer hover:bg-muted focus:bg-muted">%</SelectItem>
                                                                <SelectItem value="fixed" className="cursor-pointer hover:bg-muted focus:bg-muted">$</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </td>

                                                {/* Impuesto */}
                                                <td className="px-2 py-2 align-middle">
                                                    <SearchableSelect
                                                        value={line.taxObj?.id ? String(line.taxObj.id) : "0"}
                                                        onValueChange={(val) => {
                                                            if (val === "0") {
                                                                builder.updateItem(line.id, "taxObj", null);
                                                            } else {
                                                                const selectedTax = taxesOptions.find((t) => String(t.id) === val);
                                                                builder.updateItem(line.id, "taxObj", selectedTax || null);
                                                            }
                                                        }}
                                                        options={[
                                                            { value: "0", label: "Sin impuesto" },
                                                            ...taxesOptions.map((t) => ({
                                                                value: String(t.id),
                                                                label: `${t.name} (${t.rate}%)`,
                                                            })),
                                                        ]}
                                                        placeholder="Sin impuesto"
                                                        searchPlaceholder="Buscar impuesto..."
                                                        className="h-8 text-xs bg-white shadow-none hover:border-primary focus:border-primary transition-colors border-foreground/20"
                                                    />
                                                </td>

                                                {/* Cantidad */}
                                                <td className="px-2 py-2 align-middle">
                                                    <Input
                                                        type="number"
                                                        value={line.cantidad}
                                                        onChange={(e) => builder.updateItem(line.id, "cantidad", e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                                        className={cn(tableInputClass, "w-16")}
                                                        min="1"
                                                    />
                                                </td>

                                                {/* Descripción */}
                                                <td className="px-2 py-2 align-middle">
                                                    <Input
                                                        type="text"
                                                        value={line.description || ""}
                                                        onChange={(e) => builder.updateItem(line.id, "description", e.target.value)}
                                                        placeholder="Descripción"
                                                        className={tableInputClass}
                                                    />
                                                </td>

                                                {/* Total */}
                                                <td className="px-2 py-2 text-right text-xs font-medium text-foreground whitespace-nowrap align-middle">
                                                    ${new Intl.NumberFormat('es-CO').format(lineTotal)}
                                                </td>

                                                {/* Delete line */}
                                                <td className="px-2 py-2 text-center align-middle">
                                                    {builder.items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => builder.removeItem(line.id)}
                                                            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <button
                            type="button"
                            onClick={builder.addItem}
                            className="text-primary hover:text-primary/80 text-xs font-semibold flex items-center gap-1 transition-colors h-8 px-2 rounded-md hover:bg-muted cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar línea
                        </button>
                    </div>

                    {/* LÍNEA SEPARADORA DEBAJO DE AGREGAR LÍNEA */}
                    <div className="border-t border-gray-200 my-4" />

                    {/* SECCIÓN DE BOTONES / MENÚS DE RETENCIONES Y ÓRDENES DE COMPRA */}
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
                                                Si no existe la retención, puedes crearla. Descubre cómo <a href="#" className="underline text-teal-400 hover:text-teal-300 font-medium">aquí</a>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {builder.withholdings.map((w: SupportDocumentWithholding) => (
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
                                    Aplica un descuento o recargo al total del documento soporte. Puedes ingresar el valor en porcentaje (%) o como monto fijo ($) y agregar un motivo opcional.
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
                                            <SelectItem value="discount" className="text-sm cursor-pointer">Descuento</SelectItem>
                                            <SelectItem value="charge" className="text-sm cursor-pointer">Cargo</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={globalAdjValueType} onValueChange={(val: "percentage" | "fixed") => setGlobalAdjValueType(val)}>
                                        <SelectTrigger className="w-20 bg-white h-9 border border-border rounded-l-none border-l-0 hover:bg-muted hover:border-primary cursor-pointer transition-colors text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage" className="text-sm cursor-pointer">%</SelectItem>
                                            <SelectItem value="fixed" className="text-sm cursor-pointer">$</SelectItem>
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
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {title}{reason}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-sm font-bold ${isDiscount ? 'text-destructive' : 'text-foreground'}`}>
                                                            {isDiscount ? '-' : '+'}{adj.valueType === 'percentage' ? `${adj.value}%` : `$ ${Math.round(adj.value).toLocaleString("es-CO")}`}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveGlobalAdjustment(adj.id)}
                                                            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
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

                    {/* BOTTOM SECTION: Firma a la izquierda & Totales con botones de acción a la derecha */}
                    <div className="flex flex-col md:flex-row justify-between items-start pt-8 border-t border-border gap-8">
                        {/* Izquierda: Firma */}
                        <div className="border-2 border-dashed border-border rounded-lg p-8 pb-4 bg-muted/5 w-full max-w-[280px] flex flex-col justify-end min-h-[120px]">
                            <div className="text-center font-medium text-foreground text-sm h-5">
                                {companyName || "Usuario"}
                            </div>
                            <div className="border-t border-muted-foreground/30 my-2 w-full mx-auto"></div>
                            <div className="text-center text-xs text-muted-foreground">
                                Elaborado por
                            </div>
                        </div>

                        {/* Derecha: Desglose de Totales */}
                        <div className="w-full max-w-sm space-y-3">
                            {/* Desglose de Totales */}
                            <div className="space-y-2.5 text-sm text-foreground">
                                <div className="flex justify-between py-1 border-b border-border/40">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium text-foreground">
                                        ${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(builder.totals.subtotal || 0)}
                                    </span>
                                </div>

                                {builder.totals.discountsAmount > 0 && (
                                    <div className="flex justify-between py-1 border-b border-border/40">
                                        <span className="text-muted-foreground">Descuento en línea</span>
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

                                {builder.totals.taxesAmount > 0 && (
                                    <div className="flex justify-between py-1 border-b border-border/40">
                                        <span className="text-muted-foreground">Impuestos</span>
                                        <span className="font-medium text-foreground">
                                            +${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(builder.totals.taxesAmount)}
                                        </span>
                                    </div>
                                )}

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
                    </div>

                    {/* SECCIÓN INFERIOR: Texto de autorización a la izquierda y Notas a la derecha abarcando todo el ancho */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mt-8 pt-6 border-t border-border w-full">
                        {/* Columna Izquierda: Texto de autorización */}
                        <div className="w-full md:w-[45%] space-y-1 text-left">
                            <div className="flex items-center gap-1">
                                <label className="text-sm font-semibold text-foreground">
                                    Texto de autorización
                                </label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[280px] bg-slate-900 text-white p-3 text-xs leading-relaxed rounded-lg shadow-xl">
                                            Indica aquí la información relacionada con la autorización otorgada por la DIAN, será visible al pie de la factura
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            {!isEditingAuthText ? (
                                <div
                                    onClick={() => setIsEditingAuthText(true)}
                                    className="text-sm text-slate-400 hover:text-slate-600 cursor-pointer flex items-center gap-1.5 group py-0.5 transition-colors whitespace-pre-wrap"
                                >
                                    <span className="text-slate-400">
                                        {formState.authorization_text || "Texto de autorización"}
                                    </span>
                                    <Pencil className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                                </div>
                            ) : (
                                <Textarea
                                    autoFocus
                                    rows={3}
                                    value={formState.authorization_text || ""}
                                    onBlur={() => setIsEditingAuthText(false)}
                                    onChange={(e) => setFormState((prev: any) => ({ ...prev, authorization_text: e.target.value }))}
                                    placeholder="Texto de autorización"
                                    className="w-full text-sm bg-white border border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-lg resize-none min-h-[72px]"
                                />
                            )}
                        </div>

                        {/* Columna Derecha: Notas */}
                        <div className="w-full md:w-[48%] space-y-1 text-left">
                            <div className="flex items-center gap-1">
                                <label className="text-sm font-semibold text-foreground">
                                    Notas
                                </label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[280px] bg-slate-900 text-white p-3 text-xs leading-relaxed rounded-lg shadow-xl">
                                            Agrega información importante que tus clientes verán en el documento.
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            {!isEditingNotes ? (
                                <div
                                    onClick={() => setIsEditingNotes(true)}
                                    className="text-sm text-slate-400 hover:text-slate-600 cursor-pointer flex items-center gap-1.5 group py-0.5 transition-colors whitespace-pre-wrap"
                                >
                                    <span className="text-slate-400">
                                        {formState.notes || "Agrega una nota sobre este documento"}
                                    </span>
                                    <Pencil className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                                </div>
                            ) : (
                                <Textarea
                                    autoFocus
                                    rows={3}
                                    value={formState.notes || ""}
                                    onBlur={() => setIsEditingNotes(false)}
                                    onChange={(e) => setFormState((prev: any) => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Agrega una nota sobre este documento"
                                    className="w-full text-sm bg-white border border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-lg resize-none min-h-[72px]"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditResolutionModal
                isOpen={isEditResolutionOpen}
                onClose={() => {
                    setIsEditResolutionOpen(false);
                    if (onRefetchResolutions) onRefetchResolutions();
                }}
                resolution={activeResolution || null}
            />

            <AddContactModal
                isOpen={isAddContactOpen}
                onClose={() => setIsAddContactOpen(false)}
                catalogData={catalogs}
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

            <QuickCreateItemModal
                open={isQuickCreateItemOpen}
                onClose={() => {
                    setIsQuickCreateItemOpen(false);
                    setItemModalRowId(null);
                }}
                catalogs={catalogs}
                onCreated={handleQuickItemCreated}
            />

            {/* Configuración de retenciones asumidas modal */}
            <ConfigWithholdingsModal
                open={isConfigWithholdingsOpen}
                onOpenChange={setIsConfigWithholdingsOpen}
                retentionName={activeWithholdingForConfig?.name || "Compras"}
                rate={activeWithholdingForConfig?.percentage || 3.5}
                onSave={(selectedAccount) => {
                    if (activeWithholdingForConfig?.id) {
                        builder.updateWithholding(activeWithholdingForConfig.id, "accounting_account_id", selectedAccount);
                    }
                }}
            />
        </TooltipProvider>
    );
}
