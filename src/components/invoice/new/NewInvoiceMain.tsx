"use client";
import { Settings, HelpCircle, Plus, Trash2, Loader2, X, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCatalogs } from "@/hooks/useCatalogs";
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
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchableSelect } from "@/components/ui/searchable-select";

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

import { EditResolutionModal } from "@/components/invoice/new/EditResolutionModal";
import { AddContactModal } from "@/components/contact/new/AddContactModal";
import { QuickCreateItemModal } from "@/components/invoice/new/QuickCreateItemModal";
import { NewPaymentTermModal } from "@/components/payment-terms/NewPaymentTermModal";
import { FactucoreLogo } from "@/components/brand/FactucoreLogo";
import { CompanyHeaderPdfStyle } from "@/components/shared/CompanyHeaderPdfStyle";
import { NewTaxRateModal } from "@/components/taxes/NewTaxRateModal";
import { type Resolution } from "@/lib/resolutions";
import { ContactsService } from "@/lib/contacts";
import { adquirerApi } from "@/lib/acquirers";
import { showToast, showToastWithAction } from "@/components/sonner/CustomToaster";
import { getSession } from "@/common/interfaces/session";

export function NewInvoiceMain({
    mainData,
    catalogData,
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
    formState,
    setFormState,
    showRemissionBar,
    setShowRemissionBar,
    errors,
    onRefetchResolutions,
}: {
    mainData: any;
    catalogData: any;
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
    formState: any;
    setFormState: React.Dispatch<React.SetStateAction<any>>;
    showRemissionBar?: boolean;
    setShowRemissionBar?: (show: boolean) => void;
    errors?: Record<string, string>;
    onRefetchResolutions?: () => void;
}) {
    const catalogs = useCatalogs();
    const queryClient = useQueryClient();
    const paymentTerms = catalogs?.paymentTerms || [];

    const [clientUser, setClientUser] = useState<any>(null);
    useEffect(() => {
        const session = getSession();
        if (session?.user) {
            setClientUser(session.user);
        }
    }, []);

    const inputClass =
        "bg-white border border-foreground/20 rounded-lg h-9 px-3 text-sm text-foreground hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors";

    const selectItemClass =
        "rounded-lg cursor-pointer transition-colors hover:bg-muted hover:text-foreground focus:bg-muted data-[state=checked]:bg-muted/50";

    const [globalAdjType, setGlobalAdjType] = useState<"discount" | "charge">("discount");
    const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    const [isQuickCreateItemModalOpen, setIsQuickCreateItemModalOpen] = useState(false);
    const [isNewPaymentTermModalOpen, setIsNewPaymentTermModalOpen] = useState(false);
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
    const [quickCreateItemTargetRow, setQuickCreateItemTargetRow] = useState<string | null>(null);
    const [prefilledContactData, setPrefilledContactData] = useState<any>(null);
    const [globalAdjValueType, setGlobalAdjValueType] = useState<string>("percentage");
    const [globalAdjPercent, setGlobalAdjPercent] = useState<number>(0);
    const [globalAdjReason, setGlobalAdjReason] = useState<string>("");
    const [formaPago, setFormaPago] = useState<string>("");
    const [fecha, setFecha] = useState<Date>(new Date());
    const [plazo, setPlazo] = useState<string>("0");
    const [vencimiento, setVencimiento] = useState<Date>(new Date());
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    const [cliente, setCliente] = useState<string>("");
    const [medioPago, setMedioPago] = useState<string>("");
    const [docType, setDocType] = useState<string>("");

    const [docNumber, setDocNumber] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>(""); // name shown in the invoice form
    const [emailAutoFilled, setEmailAutoFilled] = useState<boolean>(false);
    const [customersList, setCustomersList] = useState<any[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState<boolean>(false);
    const [searchingDocument, setSearchingDocument] = useState<boolean>(false);

    // Cargar clientes locales
    const loadCustomers = async (searchVal?: string) => {
        setLoadingCustomers(true);
        try {
            const res = await ContactsService.list({ role: 'customer', search: searchVal });
            let list: any[] = [];
            if (res && res.data) {
                if (Array.isArray(res.data)) {
                    list = res.data;
                } else if (res.data.data && Array.isArray(res.data.data)) {
                    list = res.data.data;
                } else if (res.data.contacts && Array.isArray(res.data.contacts)) {
                    list = res.data.contacts;
                }
            }
            setCustomersList(list);
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        } finally {
            setLoadingCustomers(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    // Sincronizar estados de pago y cliente con formState del padre
    useEffect(() => {
        let isMounted = true;
        const syncContact = async () => {
            if (cliente) {
                // Sincronización inmediata (optimista) para que el payload sea reactivo
                const partialCustomer = customersList.find((c: any) => c.id.toString() === cliente) || null;
                if (isMounted && partialCustomer) {
                    setFormState((prev: any) => ({
                        ...prev,
                        contact_id: Number(cliente),
                        customer: { ...prev.customer, ...partialCustomer }, // Mantener los datos previos si existen mientras carga
                        payment_form_id: formaPago ? Number(formaPago) : null,
                        payment_method_id: medioPago ? Number(medioPago) : null,
                        payment_term_id: plazo ? Number(plazo) : null,
                    }));
                }

                try {
                    const res = await ContactsService.getById(cliente);
                    const fetchedCustomer = res.data?.contact || res.data?.data || res.data;
                    if (isMounted) {
                        setFormState((prev: any) => ({
                            ...prev,
                            contact_id: Number(cliente),
                            customer: fetchedCustomer,
                            payment_form_id: formaPago ? Number(formaPago) : null,
                            payment_method_id: medioPago ? Number(medioPago) : null,
                            payment_term_id: plazo ? Number(plazo) : null,
                        }));
                    }
                } catch (e) {
                    if (isMounted) {
                        const fullCustomer = customersList.find((c: any) => c.id.toString() === cliente) || null;
                        setFormState((prev: any) => ({
                            ...prev,
                            contact_id: Number(cliente),
                            customer: fullCustomer,
                            payment_form_id: formaPago ? Number(formaPago) : null,
                            payment_method_id: medioPago ? Number(medioPago) : null,
                            payment_term_id: plazo ? Number(plazo) : null,
                        }));
                    }
                }
            } else {
                if (isMounted) {
                    setFormState((prev: any) => ({
                        ...prev,
                        contact_id: null,
                        customer: null,
                        payment_form_id: formaPago ? Number(formaPago) : null,
                        payment_method_id: medioPago ? Number(medioPago) : null,
                        payment_term_id: plazo ? Number(plazo) : null,
                    }));
                }
            }
        };

        syncContact();

        return () => {
            isMounted = false;
        };
    }, [cliente, formaPago, medioPago, plazo, setFormState, customersList]);

    // Sincronizar fecha de vencimiento
    useEffect(() => {
        if (vencimiento) {
            const dateStr = vencimiento.toISOString().split("T")[0];
            setFormState((prev: any) => {
                if (prev.payment_due_date !== dateStr) {
                    return { ...prev, payment_due_date: dateStr };
                }
                return prev;
            });
        }
    }, [vencimiento, setFormState]);

    // Algoritmo matemático para calcular el DV (Dígito de Verificación) de NIT en Colombia
    const calculateDV = (nit: string): number => {
        const vpri = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
        const cleanNit = nit.replace(/\D/g, "");
        if (!cleanNit) return 0;
        const len = cleanNit.length;
        let sum = 0;
        for (let i = 0; i < len; i++) {
            sum += Number(cleanNit.charAt(len - 1 - i)) * vpri[i];
        }
        const val = sum % 11;
        return val > 1 ? 11 - val : val;
    };

    // Buscar cliente por número de documento
    const handleSearchDocument = async () => {
        const cleanNum = docNumber.trim();
        if (!cleanNum) {
            showToast("Por favor ingrese un número de documento", "warning");
            return;
        }

        setSearchingDocument(true);

        try {
            // 1. Buscar en el backend local
            const res = await ContactsService.list({ role: 'customer', search: cleanNum });

            let foundCustomer: any = null;
            let list: any[] = [];

            if (res && res.data) {
                if (Array.isArray(res.data)) {
                    list = res.data;
                } else if (res.data.data && Array.isArray(res.data.data)) {
                    list = res.data.data;
                } else if (res.data.contacts && Array.isArray(res.data.contacts)) {
                    list = res.data.contacts;
                }
            }

            // Coincidencia exacta de identification_number
            foundCustomer = list.find((c: any) => String(c.identification_number) === cleanNum);

            if (foundCustomer) {
                // Encontrado en local
                showToast("Cliente encontrado", "success");

                setCustomersList(prev => {
                    if (!prev.some(c => c.id === foundCustomer.id)) {
                        return [foundCustomer, ...prev];
                    }
                    return prev;
                });

                const name = foundCustomer.registration_name ||
                    `${foundCustomer.first_name || ""} ${foundCustomer.last_name || ""}`.trim() ||
                    foundCustomer.identification_number;

                setCliente(foundCustomer.id.toString());
                setDisplayName(name);
                setEmail(foundCustomer.email || "");
                setEmailAutoFilled(true);
                if (foundCustomer.type_document_identification_id) {
                    setDocType(foundCustomer.type_document_identification_id.toString());
                }
            } else {
                // 2. No existe en local → consultar DIAN
                const docTypeId = docType
                    ? Number(docType)
                    : mainData.documentTypes?.[0]?.value
                        ? Number(mainData.documentTypes[0].value)
                        : 1;

                let acquirerRes: any = null;
                try {
                    acquirerRes = await adquirerApi.getAcquirer({
                        type_document_identification_id: docTypeId,
                        identification_number: cleanNum,
                    });
                } catch (acquirerErr: any) {
                    const apiMessage = acquirerErr?.response?.data?.message || acquirerErr?.message || "No se encontró información en la DIAN";

                    showToastWithAction(
                        'Sin datos para autocompletar',
                        'Por favor, ingresa el tipo de identificación, o ingresa los datos manualmente',
                        'info',
                        {
                            label: 'Completar',
                            onClick: () => {
                                setPrefilledContactData({
                                    docType: "3",
                                    docNumber: cleanNum,
                                    firstName: "",
                                    lastName: "",
                                    email: "",
                                    registration_name: "",
                                    showAutocompleteToast: false,
                                });
                                setIsAddContactModalOpen(true);
                            }
                        }
                    );
                    return;
                }

                const acquirerData =
                    (acquirerRes as any)?.data?.acquirer ||
                    (acquirerRes as any)?.acquirer ||
                    acquirerRes?.data;

                if (acquirerData && (acquirerData.found || acquirerData.receiver_name)) {
                    const dianName = acquirerData.receiver_name || "";
                    const dianEmail = acquirerData.receiver_email || "";

                    // DIAN format: APELLIDO1 APELLIDO2 NOMBRE1 NOMBRE2
                    const parts = dianName.trim().split(/\s+/);
                    let parsedApellidos = "";
                    let parsedNombres = "";

                    if (parts.length <= 1) {
                        parsedApellidos = dianName;
                    } else if (parts.length === 2) {
                        parsedApellidos = parts[0];
                        parsedNombres = parts[1];
                    } else {
                        parsedApellidos = `${parts[0]} ${parts[1]}`;
                        parsedNombres = parts.slice(2).join(" ");
                    }

                    // Show name in the invoice form field
                    setDisplayName(dianName);
                    setEmail(dianEmail);
                    setEmailAutoFilled(!!dianEmail);

                    // Open the modal pre-filled (modal will show the autocomplete toast)
                    setPrefilledContactData({
                        docType: docTypeId.toString(),
                        docNumber: cleanNum,
                        firstName: parsedNombres,
                        lastName: parsedApellidos,
                        email: dianEmail,
                        registration_name: dianName,
                        showAutocompleteToast: true,
                    });
                    setIsAddContactModalOpen(true);
                } else {
                    showToastWithAction(
                        'Sin datos para autocompletar',
                        'Por favor, ingresa el tipo de identificación, o ingresa los datos manualmente',
                        'info',
                        {
                            label: 'Completar',
                            onClick: () => {
                                setPrefilledContactData({
                                    docType: "3",
                                    docNumber: cleanNum,
                                    firstName: "",
                                    lastName: "",
                                    email: "",
                                    registration_name: "",
                                    showAutocompleteToast: false,
                                });
                                setIsAddContactModalOpen(true);
                            }
                        }
                    );
                }
            }
        } catch (err: any) {
            console.error("Error al buscar documento:", err);
            const errMsg = err?.response?.data?.message || err?.message || "Ocurrió un error al buscar el cliente";
            showToast(errMsg, "error");
        } finally {
            setSearchingDocument(false);
        }
    };

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
            let days = 0;
            if (paymentTerms) {
                const selectedTerm = paymentTerms.find((pt: any) => pt.id.toString() === plazo);
                if (selectedTerm) {
                    days = parseInt(selectedTerm.days, 10);
                }
            } else {
                days = parseInt(plazo, 10);
            }
            if (!isNaN(days)) {
                const newDate = new Date(fecha);
                newDate.setDate(newDate.getDate() + days);
                setVencimiento((prev) => {
                    if (prev.getTime() === newDate.getTime()) return prev;
                    return newDate;
                });
            }
        }
    }, [plazo, fecha, paymentTerms]);



    const handleAddGlobalAdjustment = () => {
        if (globalAdjPercent <= 0) return;
        invoiceBuilder.addGlobalAdjustment(globalAdjType, globalAdjValueType, globalAdjPercent, globalAdjReason);
        setGlobalAdjPercent(0);
        setGlobalAdjReason("");
    };

    return (
        <div className="filter drop-shadow-sm">
            <div
                className="relative bg-white rounded-lg border border-border p-8 overflow-hidden"
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

                {/* HEADER */}
                <div className="grid grid-cols-3 items-start mb-8">
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center justify-self-start flex items-center justify-center min-w-[160px] min-h-[100px]">
                        <FactucoreLogo
                            variant="icon"
                            className="max-h-[80px] w-auto"
                            alt="Logo de la empresa"
                        />
                    </div>

                    <div className="text-center pt-2">
                        <CompanyHeaderPdfStyle />
                    </div>

                    <div className="text-right justify-self-end">
                        <div className="inline-flex flex-col items-end gap-1">
                            <div className="grid grid-cols-[160px_auto] gap-x-2 gap-y-1 items-center">
                                <span className="text-sm text-muted-foreground whitespace-nowrap text-center col-start-1">
                                    {activeResolution?.name || (activeResolution?.is_main ? "Numeración Principal" : "Numeración")}
                                </span>
                                <div className="col-start-1 row-start-2">
                                    <SearchableSelect
                                        value={selectedResolutionId?.toString() || ""}
                                        onValueChange={(val) => setSelectedResolutionId?.(Number(val))}
                                        options={resolutions?.map((res) => ({
                                            value: res.id.toString(),
                                            label: res.prefix || res.prefix || `Resolución ${res.id}`
                                        })) || []}
                                        placeholder="Seleccionar"
                                        className="w-full text-foreground"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="p-1 rounded hover:bg-muted/40 transition col-start-2 row-start-2"
                                    onClick={() => setIsResolutionModalOpen(true)}
                                    title="Configurar resolución"
                                >
                                    <Settings className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="flex items-center justify-end w-full gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-muted-foreground">No.</span>
                                    {mainData.invoiceNumber ? (
                                        <span className="font-bold text-lg text-foreground">
                                            {mainData.invoiceNumber}
                                        </span>
                                    ) : (
                                        <div className="h-6 w-24 bg-muted animate-pulse rounded-md" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="p-1 rounded hover:bg-muted/40 transition"
                                    onClick={() => onRefetchResolutions?.()}
                                    title="Actualizar numeración"
                                >
                                    <RefreshCw className="w-4 h-4 text-muted-foreground" />
                                </button>
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
                                    <div className="relative flex-1 flex">
                                        <Input
                                            placeholder="Buscar Nº de ID"
                                            value={docNumber}
                                            onChange={(e) => setDocNumber(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleSearchDocument();
                                                }
                                            }}
                                            className={cn(inputClass, "rounded-l-none flex-1 pr-10")}
                                        />
                                        {searchingDocument && (
                                            <div className="absolute right-0 top-0 h-9 w-9 flex items-center justify-center">
                                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                            </div>
                                        )}
                                    </div>
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
                                {displayName ? (
                                    // Show the auto-filled name as a read-only pill with a clear button
                                    <div className="flex-1 flex items-center gap-2">
                                        <div className={cn(inputClass, "flex-1 flex items-center justify-between gap-2 bg-white")}>
                                            <span className="truncate text-sm font-medium text-foreground">{displayName}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDisplayName("");
                                                    setCliente("");
                                                    setEmail("");
                                                    setEmailAutoFilled(false);
                                                    setDocNumber("");
                                                }}
                                                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <SearchableSelect
                                            value={cliente}
                                            onValueChange={(val) => {
                                                setCliente(val);
                                                const selected = customersList.find(c => c.id.toString() === val);
                                                if (selected) {
                                                    const name = selected.registration_name ||
                                                        `${selected.first_name || ""} ${selected.last_name || ""}`.trim() ||
                                                        selected.identification_number;
                                                    setDisplayName(name);
                                                    setEmail(selected.email || "");
                                                    setEmailAutoFilled(true);
                                                    setDocNumber(selected.identification_number || "");
                                                    if (selected.type_document_identification_id) {
                                                        setDocType(selected.type_document_identification_id.toString());
                                                    }
                                                } else {
                                                    setDisplayName("");
                                                    setEmail("");
                                                    setEmailAutoFilled(false);
                                                    setDocNumber("");
                                                }
                                            }}
                                            options={customersList.map((c: any) => ({
                                                value: c.id.toString(),
                                                label: c.registration_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.identification_number
                                            }))}
                                            placeholder="Seleccionar cliente"
                                            className={cn("w-full text-foreground", errors?.contact_id && "border-destructive !text-destructive")}
                                            errorIcon={errors?.contact_id ? <AlertCircle className="size-4 text-destructive" /> : undefined}
                                        />
                                        {errors?.contact_id && (
                                            <div className="text-destructive text-sm mt-1">
                                                {errors.contact_id}
                                            </div>
                                        )}
                                    </div>
                                )}
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
                                <Input
                                    type="email"
                                    placeholder="email@mail.com"
                                    value={email}
                                    readOnly={emailAutoFilled}
                                    onChange={(e) => !emailAutoFilled && setEmail(e.target.value)}
                                    className={cn(inputClass, "w-full", emailAutoFilled ? "bg-muted/20 cursor-default text-muted-foreground" : "")}
                                />
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

                        {/* NUEVO CONTACTO */}
                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-40 shrink-0"></div>
                            <div className="flex-1 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddContactModalOpen(true)}
                                    className="w-full text-primary hover:text-primary/80 text-sm font-medium flex justify-center items-center gap-1 transition-colors h-9 rounded-md hover:bg-muted cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    Nuevo contacto
                                </button>
                                <div className="w-6 shrink-0"></div> {/* Espaciador para alinear con el icono de ayuda del correo */}
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
                                    <div className="w-full">
                                        <SearchableSelect
                                            value={medioPago}
                                            onValueChange={setMedioPago}
                                            options={mainData.paymentMethods || []}
                                            placeholder="Seleccionar"
                                            className={cn("w-full text-foreground", errors?.payment_method_id && "border-destructive !text-destructive")}
                                            errorIcon={errors?.payment_method_id ? <AlertCircle className="size-4 text-destructive" /> : undefined}
                                        />
                                        {errors?.payment_method_id && (
                                            <div className="text-destructive text-sm mt-1">
                                                {errors.payment_method_id}
                                            </div>
                                        )}
                                    </div>
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
                                            onValueChange={(val) => {
                                                setPlazo(val);
                                            }}
                                            options={paymentTerms?.map((pt: any) => ({
                                                value: pt.id.toString(),
                                                label: pt.name
                                            })) || []}
                                            placeholder="Seleccionar"
                                            className="w-full text-foreground"
                                            footer={
                                                <button
                                                    type="button"
                                                    onClick={() => setIsNewPaymentTermModalOpen(true)}
                                                    className="w-full text-left px-2 py-1.5 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors"
                                                >
                                                    + Nuevo plazo
                                                </button>
                                            }
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
                                        <div className="flex-1 flex items-center gap-2">
                                            <input
                                                type="text"
                                                disabled
                                                value={vencimiento.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}
                                                className="h-9 flex-1 w-full rounded-md border border-foreground/20 bg-muted/30 px-3 py-1 text-sm text-muted-foreground cursor-not-allowed text-center"
                                            />
                                            <div className="flex-1 flex justify-center items-center gap-1.5 px-3 py-1.5 h-9 rounded-md bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
                                                <Clock className="w-4 h-4" />
                                                {currentTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
                                            </div>
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
                                <Select value={globalAdjType} onValueChange={(val: "discount" | "charge") => {
                                    setGlobalAdjType(val);
                                    setGlobalAdjValueType("percentage");
                                }}>
                                    <SelectTrigger className="w-full bg-white h-9 border border-border rounded-r-none hover:bg-muted hover:border-primary cursor-pointer transition-colors">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="discount" className="cursor-pointer hover:bg-muted focus:bg-muted">Descuento</SelectItem>
                                        <SelectItem value="charge" className="cursor-pointer hover:bg-muted focus:bg-muted">Cargo</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={globalAdjValueType} onValueChange={(val: "percentage" | "fixed") => setGlobalAdjValueType(val)}>
                                    <SelectTrigger className="w-20 bg-white h-9 border border-border rounded-l-none border-l-0 hover:bg-muted hover:border-primary cursor-pointer transition-colors">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage" className="cursor-pointer hover:bg-muted focus:bg-muted">%</SelectItem>
                                        <SelectItem value="fixed" className="cursor-pointer hover:bg-muted focus:bg-muted">$</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {globalAdjValueType === 'percentage' ? (
                                <Input
                                    type="number"
                                    min={0}
                                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault(); }}
                                    placeholder="Valor"
                                    value={globalAdjPercent || ""}
                                    onChange={(e) => setGlobalAdjPercent(Number(e.target.value))}
                                    className="w-full bg-white h-9 border border-border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            ) : (
                                <FormattedInput
                                    placeholder="Valor"
                                    value={globalAdjPercent || 0}
                                    onChange={(val: number) => setGlobalAdjPercent(val)}
                                    className="w-full bg-white h-9 border border-border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            )}

                            <Input
                                placeholder="Motivo"
                                value={globalAdjReason}
                                onChange={(e) => setGlobalAdjReason(e.target.value)}
                                className="w-full bg-white h-9 border border-border"
                            />

                            <button
                                onClick={handleAddGlobalAdjustment}
                                className="w-full bg-primary text-primary-foreground px-4 h-9 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                            >
                                {globalAdjType === 'discount' ? 'Agregar descuento' : 'Agregar cargo'}
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
                                {invoiceBuilder.globalAdjustments.map((adj: any) => {
                                    const title = adj.type === 'discount' ? 'Descuento' : 'Cargo';
                                    const reason = adj.reason ? `: ${adj.reason}` : "";

                                    return (
                                        <div key={adj.id} className="flex items-center gap-4 bg-muted/10 p-3 rounded-lg border border-border">
                                            <span className="text-sm font-medium flex-1 truncate">
                                                {title}{reason}
                                            </span>
                                            <span className="text-sm font-bold min-w-[100px] text-right">
                                                {adj.valueType === 'percentage' ? `${adj.value}%` : `$ ${Math.round(adj.value).toLocaleString("es-CO")}`}
                                            </span>
                                            <button onClick={() => invoiceBuilder.removeGlobalAdjustment(adj.id)} className="p-1.5 rounded hover:bg-destructive/10 transition cursor-pointer group">
                                                <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* REMISIÓN BAR */}
                <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    showRemissionBar ? "max-h-24 opacity-100 mt-6" : "max-h-0 opacity-0"
                )}>
                    <div className="bg-slate-50 flex items-center justify-between gap-4 p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-primary">Remisión</span>
                            <div className="w-[240px]">
                                <SearchableSelect
                                    value={formState.remission_id || ""}
                                    onValueChange={(val) => setFormState((prev: any) => ({ ...prev, remission_id: val }))}
                                    options={[]}
                                    placeholder="Buscar"
                                    searchPlaceholder="Buscar remisión..."
                                    className="w-full bg-white h-9"
                                    emptyMessage={cliente ? "Sin resultados" : "Debe seleccionar primero un cliente para la factura"}
                                />
                            </div>
                        </div>
                        <button onClick={() => setShowRemissionBar?.(false)} className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted/50 rounded transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* FOOTER & TOTALS */}
                <div className="mt-8 border-t border-border pt-8">
                    {/* Primera fila: Firma y Totales */}
                    <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                        {/* Firma */}
                        <div className="border-2 border-dashed border-border rounded-lg p-8 pb-4 bg-muted/5 w-full max-w-[280px] flex flex-col justify-end min-h-[120px]">
                            <div className="text-center font-medium text-foreground text-sm h-5">
                                {clientUser?.name || mainData?.user?.name || "Usuario"}
                            </div>
                            <div className="border-t border-muted-foreground/30 my-2 w-full mx-auto"></div>
                            <div className="text-center text-xs text-muted-foreground">
                                Elaborado por
                            </div>
                        </div>

                        {/* Totales y Remisión */}
                        <div className="w-full max-w-xs space-y-3 p-2 mt-6 md:mt-0">
                            <div className="flex justify-end mb-4">
                                <div className="flex items-center gap-1">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle className="w-3 h-3 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-white text-zinc-800 border border-border shadow-md p-3 text-xs">
                                                Aprende a crear tus facturas <a href="#" className="underline font-medium">aquí</a>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-end gap-3 mb-4">
                                <button
                                    onClick={() => setShowRemissionBar?.(!showRemissionBar)}
                                    className="text-primary text-sm font-medium flex items-center gap-1 hover:bg-primary/10 px-2 py-1 rounded-md transition-colors cursor-pointer"
                                >
                                    <Plus className="w-4 h-4 shrink-0" />
                                    Agregar remisión
                                </button>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium text-foreground">${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoiceBuilder.totals.subtotal || 0)}</span>
                            </div>

                            {invoiceBuilder.totals.lineDiscountsAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Descuentos en línea</span>
                                    <span className="font-medium text-destructive">-${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoiceBuilder.totals.lineDiscountsAmount || 0)}</span>
                                </div>
                            )}

                            {invoiceBuilder.totals.globalDiscountsAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Descuentos Globales</span>
                                    <span className="font-medium text-destructive">-${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoiceBuilder.totals.globalDiscountsAmount || 0)}</span>
                                </div>
                            )}

                            {invoiceBuilder.totals.globalChargesAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Cargos Globales</span>
                                    <span className="font-medium text-foreground">${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoiceBuilder.totals.globalChargesAmount || 0)}</span>
                                </div>
                            )}

                            {invoiceBuilder.totals.taxBreakdown && (Object.values(invoiceBuilder.totals.taxBreakdown) as { name: string; amount: number }[]).map(({ name, amount }) => (
                                <div key={name} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{name}</span>
                                    <span className="font-medium text-foreground">${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount || 0)}</span>
                                </div>
                            ))}



                            <div className="border-t border-border/50 pt-3 flex justify-between items-center mt-2">
                                <span className="text-xl font-medium text-foreground">Total</span>
                                <span className="text-2xl font-medium text-foreground">${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoiceBuilder.totals.payableAmount || 0)}</span>
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
                        <div className="opacity-50 pointer-events-none">
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                Pie de factura
                            </label>
                            <textarea
                                disabled
                                rows={2}
                                value={activeResolution?.resolution_text || ""}
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

                {/* Add Contact Modal (Simple / Advanced) */}
                <AddContactModal
                    isOpen={isAddContactModalOpen}
                    onClose={() => {
                        setIsAddContactModalOpen(false);
                        setPrefilledContactData(null);
                    }}
                    prefilledData={prefilledContactData}
                    catalogData={catalogData}
                    onCustomerCreated={(respCustomer) => {
                        const newCustomer = respCustomer?.customer || respCustomer?.data || respCustomer;
                        if (!newCustomer) return;
                        // Agregar a la lista local
                        setCustomersList((prev) => [newCustomer, ...prev]);
                        // Seleccionar cliente
                        setCliente(newCustomer.id.toString());
                        // Mostrar nombre en el formulario
                        const name = newCustomer.registration_name ||
                            `${newCustomer.first_name || ""} ${newCustomer.last_name || ""}`.trim() ||
                            newCustomer.identification_number;
                        setDisplayName(name);
                        // Autocompletar datos en pantalla principal
                        setEmail(newCustomer.email || "");
                        setEmailAutoFilled(!!(newCustomer.email));
                        setDocNumber(newCustomer.identification_number || "");
                        if (newCustomer.type_document_identification_id) {
                            setDocType(newCustomer.type_document_identification_id.toString());
                        }
                    }}
                />

                {/* Hidden button to open item modal from table */}
                <button
                    id="open-quick-item-modal"
                    className="hidden"
                    onClick={(e) => {
                        const targetRowId = e.currentTarget.getAttribute('data-target-row');
                        setQuickCreateItemTargetRow(targetRowId);
                        setIsQuickCreateItemModalOpen(true);
                    }}
                />

                {/* Quick Create Item Modal */}
                <QuickCreateItemModal
                    open={isQuickCreateItemModalOpen}
                    onClose={() => setIsQuickCreateItemModalOpen(false)}
                    catalogs={catalogs}
                    onCreated={(createdItem) => {
                        if (createdItem && quickCreateItemTargetRow) {
                            // Update item data into the specific row
                            invoiceBuilder.updateItem(quickCreateItemTargetRow, "item_id", createdItem.id);
                            invoiceBuilder.updateItem(quickCreateItemTargetRow, "standard_code", createdItem.standard_code || "");
                            invoiceBuilder.updateItem(quickCreateItemTargetRow, "item", createdItem.name);
                            invoiceBuilder.updateItem(quickCreateItemTargetRow, "referencia", createdItem.reference || "");
                            invoiceBuilder.updateItem(quickCreateItemTargetRow, "description", createdItem.description || "");

                            const price = parseFloat(createdItem.base_price) || parseFloat(createdItem.total_price) || parseFloat(createdItem.price) || 0;
                            invoiceBuilder.updateItem(quickCreateItemTargetRow, "precio", price);
                            invoiceBuilder.updateItem(quickCreateItemTargetRow, "cantidad", 1);

                            // Fix for inventory tracking of newly created items (e.g. services)
                            const isInventoriable = createdItem.type_item_id !== undefined ? createdItem.type_item_id === 1 : (createdItem.type_item?.name?.toLowerCase() === 'producto' || createdItem.type_item?.id === 1);
                            invoiceBuilder.updateItem(quickCreateItemTargetRow, "stock_quantity", createdItem.stock_quantity ?? null);
                            invoiceBuilder.updateItem(quickCreateItemTargetRow, "is_inventoriable", isInventoriable);
                            invoiceBuilder.updateItem(quickCreateItemTargetRow, "allow_negative_stock", createdItem.allow_negative_stock ?? false);

                            // Auto-fill default tax
                            let itemTaxes = createdItem.tax_rates || createdItem.pricing?.tax_rates;
                            if (itemTaxes && itemTaxes.length > 0) {
                                const defaultTax = itemTaxes[0];
                                const taxRate = parseFloat(defaultTax.rate || defaultTax.percentage || "0");
                                const taxName = defaultTax.name || defaultTax.tax?.name || "Impuesto";
                                invoiceBuilder.updateItemTax(quickCreateItemTargetRow, {
                                    tax_rate_id: defaultTax.id || defaultTax.tax_rate_id,
                                    tax_id: defaultTax.tax_id,
                                    name: taxName,
                                    rate: taxRate,
                                    type: defaultTax.type || 'percentage',
                                    description: defaultTax.description || ""
                                });
                            } else {
                                invoiceBuilder.updateItemTax(quickCreateItemTargetRow, null);
                            }
                            // Force refresh the items list in dropdowns
                            queryClient.invalidateQueries({ queryKey: ["items"] });
                        }
                        setQuickCreateItemTargetRow(null);
                    }}
                />

                <NewPaymentTermModal
                    open={isNewPaymentTermModalOpen}
                    onOpenChange={setIsNewPaymentTermModalOpen}
                    onSave={(newTerm) => {
                        setPlazo(newTerm.id.toString());
                    }}
                />

                <button id="open-new-tax-modal" className="hidden" onClick={() => setIsTaxModalOpen(true)} />

                <NewTaxRateModal
                    open={isTaxModalOpen}
                    onOpenChange={setIsTaxModalOpen}
                    taxTypes={catalogs?.taxTypes || []}
                    onSave={async (newTax) => {
                        // El componente NewTaxRateModal actualiza el cache
                    }}
                />
            </div>
        </div>
    );
}