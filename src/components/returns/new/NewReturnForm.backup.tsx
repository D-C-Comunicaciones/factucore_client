"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { HelpCircle, Edit2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { DatePickerSimple } from '@/components/ui/DatePickerSimple';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AuthService } from '@/lib/auth';
import { ContactsService } from '@/lib/contacts';
import { CreditNotesService } from '@/lib/creditNotes';
import { InvoicesService } from '@/lib/invoices';
import { useResolutions } from '@/hooks/useResolutions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showToast } from '@/components/sonner/CustomToaster';

type FieldError = {
    cliente?: string;
    tipoNota?: string;
    factura?: string;
};

export function NewReturnForm() {
    const router = useRouter();
    const [docType, setDocType] = useState('nota-credito');
    const [pendingDocType, setPendingDocType] = useState<string | null>(null);

    // Form state
    const [clientId, setClientId] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [selectedInvoice, setSelectedInvoice] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isDirty = selectedType !== '' || selectedInvoice !== '';

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleDocTypeChange = (newDocType: string) => {
        if (newDocType === docType) return;
        if (isDirty) {
            setPendingDocType(newDocType);
        } else {
            setDocType(newDocType);
        }
    };

    // Invoice details state
    const [invoiceDetails, setInvoiceDetails] = useState<any>(null);
    const [loadingInvoiceDetails, setLoadingInvoiceDetails] = useState(false);
    const [returnedQuantities, setReturnedQuantities] = useState<Record<number, string>>({});

    // New states for different credit note types
    const [lineDiscounts, setLineDiscounts] = useState<Record<number, { type: '%' | '$', value: string }>>({});
    const [newPrices, setNewPrices] = useState<Record<number, string>>({});
    const [customLines, setCustomLines] = useState<Array<{ id: string, productId: string, quantity: string, price: string, discount: { type: '%' | '$', value: string }, taxes: any[], name?: string }>>([]);
    const [globalDiscountPopoverOpen, setGlobalDiscountPopoverOpen] = useState(false);
    const [globalDiscount, setGlobalDiscount] = useState<{ type: '%' | '$', value: string }>({ type: '%', value: '0' });

    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');

    const formatCurrency = (val: number | string | undefined) => {
        if (!val && val !== 0) return '$0';
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(val));
    };

    // Field errors (validation)
    const [errors, setErrors] = useState<FieldError>({});

    // Company info
    const [companyName, setCompanyName] = useState('...');
    const [companyNit, setCompanyNit] = useState('...');

    // Customers
    const [clientOptions, setClientOptions] = useState<{ value: string; label: string }[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    // Credit note types from API
    const [creditNoteTypes, setCreditNoteTypes] = useState<{ value: string; label: string }[]>([]);
    const [loadingTypes, setLoadingTypes] = useState(false);

    // Invoices for selected customer
    const [invoiceOptions, setInvoiceOptions] = useState<{ value: string; label: string }[]>([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);

    // Resolutions Modal
    const [isNumerationModalOpen, setIsNumerationModalOpen] = useState(false);
    const [resolutionsOptions, setResolutionsOptions] = useState<{ value: string; label: string; next_consecutive?: number; prefix?: string }[]>([]);
    const [selectedResolution, setSelectedResolution] = useState<string>('');
    const [nextNumber, setNextNumber] = useState<string>('1');
    const [currentPrefix, setCurrentPrefix] = useState<string>('');

    interface CreditInvoice { id: string; amount: string; invoiceId: string; }
    interface RefundPayment { id: string; date: string; account: string; amount: string; }

    const [creditInvoices, setCreditInvoices] = useState<CreditInvoice[]>([]);
    const [refunds, setRefunds] = useState<RefundPayment[]>([]);


    const baseInput = "bg-white h-[34px] pl-3 pr-3 text-sm border border-foreground/20 shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none flex items-center w-full rounded-xl box-border";

    // ── Load company info ──────────────────────────────────────────────────────
    useEffect(() => {
        const comp: any = AuthService.getCompany();
        if (comp) {
            setCompanyName(comp.company_name || comp.name || 'Empresa');
            const nit = comp.identification_number || 'NIT';
            const dvPart = comp.verification_digit != null && comp.verification_digit !== ''
                ? `-${comp.verification_digit}`
                : (comp.dv != null && comp.dv !== '' ? `-${comp.dv}` : '');
            setCompanyNit(`${nit}${dvPart}`);
        }
    }, []);

    // ── Load customers ─────────────────────────────────────────────────────────
    useEffect(() => {
        const loadCustomers = async () => {
            setLoadingCustomers(true);
            try {
                const res = await ContactsService.list({ role: 'customer' });
                let data: any[] = [];
                if (res && res.data) {
                    if (Array.isArray(res.data)) data = res.data;
                    else if (res.data.data && Array.isArray(res.data.data)) data = res.data.data;
                    else if (res.data.contacts && Array.isArray(res.data.contacts)) data = res.data.contacts;
                }
                setClientOptions(data.map((c: any) => ({
                    value: c.id.toString(),
                    label: c.registration_name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.identification_number,
                })));
            } catch (e) {
                console.error("Error al cargar clientes:", e);
            } finally {
                setLoadingCustomers(false);
            }
        };
        loadCustomers();
    }, []);

    // ── Load credit note types from API ────────────────────────────────────────
    useEffect(() => {
        const loadTypes = async () => {
            setLoadingTypes(true);
            try {
                const types = await CreditNotesService.listTypes();
                if (types.length > 0) {
                    setCreditNoteTypes(types.map((t) => ({
                        value: t.id.toString(),
                        label: t.name,
                    })));
                } else {
                    // Fallback estático si la API no devuelve datos
                    setCreditNoteTypes([
                        { value: "1", label: "Devolución parcial de los bienes y/o no aceptación parcial del servicio" },
                        { value: "2", label: "Anulación de factura" },
                        { value: "3", label: "Rebaja o descuento parcial o total" },
                        { value: "4", label: "Ajuste de precio" },
                        { value: "5", label: "Otros" },
                        { value: "6", label: "Descuento comercial por pronto pago" },
                        { value: "7", label: "Descuento comercial por volumen de ventas" },
                    ]);
                }
            } catch (e) {
                console.error("Error al cargar tipos de nota crédito:", e);
                // Fallback estático en caso de error
                setCreditNoteTypes([
                    { value: "1", label: "Devolución parcial de los bienes y/o no aceptación parcial del servicio" },
                    { value: "2", label: "Anulación de factura" },
                    { value: "3", label: "Rebaja o descuento parcial o total" },
                    { value: "4", label: "Ajuste de precio" },
                    { value: "5", label: "Otros" },
                    { value: "6", label: "Descuento comercial por pronto pago" },
                    { value: "7", label: "Descuento comercial por volumen de ventas" },
                ]);
            } finally {
                setLoadingTypes(false);
            }
        };
        loadTypes();
    }, []);

    // ── Load invoices when customer is selected ────────────────────────────────
    useEffect(() => {
        if (!clientId) {
            setInvoiceOptions([]);
            setSelectedInvoice('');
            return;
        }
        const loadInvoices = async () => {
            setLoadingInvoices(true);
            setSelectedInvoice('');
            try {
                const invoices = await CreditNotesService.listInvoicesByCustomer(clientId);
                setInvoiceOptions(invoices.map((inv) => ({
                    value: inv.id.toString(),
                    label: inv.prefix ? `${inv.prefix}${inv.number}` : inv.number?.toString() ?? inv.id.toString(),
                })));
            } catch (e) {
                console.error("Error al cargar facturas:", e);
                setInvoiceOptions([]);
            } finally {
                setLoadingInvoices(false);
            }
        };
        loadInvoices();
    }, [clientId]);

    // ── Load invoice details when selected ─────────────────────────────────────
    useEffect(() => {
        if (!selectedInvoice) {
            setInvoiceDetails(null);
            setReturnedQuantities({});
            return;
        }
        const loadInvoiceDetails = async () => {
            setLoadingInvoiceDetails(true);
            try {
                const res = await InvoicesService.getById(selectedInvoice);
                const data = res?.data || res;
                const invoiceData = (data as any)?.invoice || (data as any)?.data?.invoice || data;
                setInvoiceDetails(invoiceData);

                const lines = invoiceData.lines || invoiceData.items || [];
                const initialQty: Record<number, string> = {};
                lines.forEach((_: any, idx: number) => {
                    initialQty[idx] = '';
                });
                setReturnedQuantities(initialQty);
            } catch (e) {
                console.error("Error al cargar detalles de la factura:", e);
                setInvoiceDetails(null);
            } finally {
                setLoadingInvoiceDetails(false);
            }
        };
        loadInvoiceDetails();
    }, [selectedInvoice]);

    // ── Update values based on selectedType ────────────────────────────────────
    useEffect(() => {
        if (!invoiceDetails) return;
        const lines = invoiceDetails.lines || invoiceDetails.items || [];
        const initialQty: Record<number, string> = {};
        const initialDiscounts: Record<number, { type: '%' | '$', value: string }> = {};
        const initialPrices: Record<number, string> = {};

        lines.forEach((item: any, idx: number) => {
            if (selectedType === '2' || selectedType === '3' || selectedType === '6' || selectedType === '7') {
                // Anulación de factura or Rebaja/descuento: Quantity is max (full)
                initialQty[idx] = Number(item.quantity || 1).toString();
            } else {
                initialQty[idx] = ''; // Wait for user input for Devolución parcial (1) or Ajuste de precio (4)
            }
            initialDiscounts[idx] = { type: '%', value: '0' };
            initialPrices[idx] = ''; // For Ajuste de precio
        });

        setReturnedQuantities(initialQty);
        setLineDiscounts(initialDiscounts);
        setNewPrices(initialPrices);
        setGlobalDiscount({ type: '%', value: '0' });

        // Setup initial custom lines for 'Otros'
        if (selectedType === '5') {
            const initialCustomLines = lines.map((item: any, idx: number) => ({
                id: Date.now().toString() + idx,
                productId: item.item_id || item.product_id || '',
                name: item.item_snapshot?.name || item.item?.name || item.name || item.description || "Producto",
                quantity: Number(item.quantity || 1).toString(),
                price: Number(item.price_amount || item.price || 0).toString(),
                discount: { type: '%', value: '0' },
                taxes: item.taxes || []
            }));
            setCustomLines(initialCustomLines);
        }
    }, [selectedType, invoiceDetails]);


    // ── Resolutions ────────────────────────────────────────────────────────────
    const { resolutions } = useResolutions({ type_resolution: 3, is_active: true });

    useEffect(() => {
        if (resolutions && resolutions.length > 0) {
            const opts = resolutions.map((r: any) => {
                let displayName = r.name || r.description || r.resolution_text || r.resolution_number || `Resolución ${r.id}`;
                if (r.prefix) {
                    const regex = new RegExp(`^${r.prefix}\\s*[-]?\\s*`, 'i');
                    displayName = displayName.replace(regex, '');
                }
                return {
                    value: r.id.toString(),
                    label: displayName,
                    next_consecutive: r.next_consecutive || r.initial_range || 1,
                    prefix: r.prefix || '',
                    is_main: r.is_main,
                };
            });
            setResolutionsOptions(opts);
            if (!selectedResolution) {
                const mainRes = opts.find((o: any) => o.is_main) || opts[0];
                setSelectedResolution(mainRes.value);
                setNextNumber(mainRes.next_consecutive?.toString() || '1');
                setCurrentPrefix(mainRes.prefix || '');
            }
        }
    }, [resolutions]);

    const handleResolutionChange = (val: string) => {
        setSelectedResolution(val);
        const res = resolutionsOptions.find(r => r.value === val);
        if (res) {
            setNextNumber(res.next_consecutive?.toString() || '1');
            setCurrentPrefix(res.prefix || '');
        }
    };

    // ── Select invoice — validate tipo nota crédito first ─────────────────────
    const handleInvoiceSelectAttempt = () => {
        if (!selectedType) {
            setErrors(prev => ({ ...prev, tipoNota: 'Debes seleccionar un tipo de nota crédito' }));
        }
    };

    // ── Validate & Save ────────────────────────────────────────────────────────
    const handleSave = async () => {
        const newErrors: FieldError = {};
        if (!clientId) newErrors.cliente = 'El cliente es obligatorio';
        if (!selectedType) newErrors.tipoNota = 'El tipo de nota crédito es obligatorio';
        if (!selectedInvoice) newErrors.factura = 'La factura de venta asociada es obligatoria';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            const payload = {
                contact_id: Number(clientId),
                type_credit_note_id: Number(selectedType),
                invoice_id: Number(selectedInvoice),
                resolution_id: selectedResolution ? Number(selectedResolution) : null,
                date: date.toISOString().split('T')[0],
                reason,
                notes
            };
            
            await CreditNotesService.send(payload);
            showToast("Nota crédito guardada y enviada correctamente", "success", "Éxito");
            router.push("/returns");
        } catch (error: any) {
            console.error("Error guardando nota de crédito:", error);
            showToast(error?.response?.data?.message || error?.message || "Ocurrió un error al guardar la nota crédito", "error", "Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = !!clientId && !!selectedType && !!selectedInvoice;

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="w-full">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

                {/* Document Type */}
                <div className="p-6 border-b border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                        Tipo de documento <span className="text-primary">*</span>
                    </label>
                    <div className="inline-flex bg-slate-50 p-1 rounded-lg">
                        <button
                            type="button"
                            className={`cursor-pointer px-6 py-2 text-sm font-medium rounded-md transition-colors ${docType === 'nota-credito'
                                ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                                : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => handleDocTypeChange('nota-credito')}
                        >
                            Nota crédito
                        </button>
                        <button
                            type="button"
                            className={`cursor-pointer px-6 py-2 text-sm font-medium rounded-md transition-colors ${docType === 'nota-ajuste'
                                ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                                : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => handleDocTypeChange('nota-ajuste')}
                        >
                            Nota ajuste POS
                        </button>
                    </div>
                </div>

                {/* Form fields */}
                <div className="p-6">
                    {/* Header company info */}
                    <div className="flex justify-between items-end mb-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-slate-800">{companyName}</h2>
                            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{companyNit}</span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <div className="text-lg font-bold text-slate-800 tracking-tight">No. {currentPrefix}{nextNumber}</div>
                            <div
                                className="text-xs text-slate-500 flex items-center justify-end gap-1 cursor-pointer hover:bg-slate-100 p-1.5 rounded-md transition-colors w-fit mt-0.5"
                                onClick={() => setIsNumerationModalOpen(true)}
                            >
                                {docType === 'nota-credito' ? 'Nota crédito' : 'Nota ajuste POS'}
                                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                        </div>
                    </div>

                    {/* Row 1: Cliente / Tipo nota / Fecha */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b border-slate-100 pb-8">
                        {/* Cliente */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Cliente <span className="text-primary">*</span>
                            </label>
                            <SearchableSelect
                                value={clientId}
                                onValueChange={(v) => {
                                    setClientId(v);
                                    setErrors(prev => ({ ...prev, cliente: undefined }));
                                }}
                                options={clientOptions}
                                placeholder={loadingCustomers ? "Cargando..." : "Seleccionar cliente"}
                                searchPlaceholder="Buscar cliente..."
                                emptyMessage={loadingCustomers ? "Cargando..." : "No se encontraron clientes."}
                                className={cn(baseInput, "w-full rounded-md", errors.cliente && "border-red-400")}
                            />
                            {errors.cliente && (
                                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.cliente}
                                </p>
                            )}
                        </div>

                        {/* Tipo de nota crédito */}
                        <div className="space-y-2 relative">
                            <div className="flex items-center gap-1">
                                <label className="block text-sm font-medium text-slate-700">
                                    Tipo de nota crédito <span className="text-primary">*</span>
                                </label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="w-4 h-4 text-primary cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="bg-[#1e293b] text-white p-3 max-w-xs text-xs font-normal border-0 leading-relaxed shadow-lg">
                                            Indica el motivo por el cual vas a realizar la nota crédito a tu cliente.
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <SearchableSelect
                                value={selectedType}
                                onValueChange={(v) => {
                                    setSelectedType(v);
                                    setErrors(prev => ({ ...prev, tipoNota: undefined }));
                                }}
                                options={creditNoteTypes}
                                placeholder={loadingTypes ? "Cargando..." : "Seleccionar"}
                                searchPlaceholder="Buscar tipo..."
                                emptyMessage="No se encontraron tipos."
                                className={cn(baseInput, "w-full rounded-md", errors.tipoNota && "border-red-400")}
                            />
                            {errors.tipoNota && (
                                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.tipoNota}
                                </p>
                            )}
                        </div>

                        {/* Fecha de creación */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Fecha de creación <span className="text-primary">*</span>
                            </label>
                            <DatePickerSimple value={date} onChange={setDate} />
                        </div>
                    </div>

                    {/* Row 2: Factura asociada y Totales */}
                    <div className={cn("grid gap-6", invoiceDetails ? "grid-cols-1 md:grid-cols-5" : "grid-cols-1 md:grid-cols-3")}>
                        <div className={cn("space-y-2", invoiceDetails ? "md:col-span-1" : "md:col-span-1")}>
                            <label className={cn(
                                "block text-sm font-medium",
                                clientId ? "text-slate-700" : "text-slate-400"
                            )}>
                                Factura de venta asociada <span className={clientId ? "text-primary" : "text-primary/50"}>*</span>
                            </label>

                            {/* Si no hay cliente o no hay tipo, mostrar tooltip de validación */}
                            {!clientId ? (
                                <div
                                    className={cn(baseInput, "w-full rounded-md opacity-50 cursor-not-allowed")}
                                    title="Selecciona un cliente primero"
                                >
                                    <span className="text-slate-400 text-sm">Buscar</span>
                                </div>
                            ) : !selectedType ? (
                                <div className="relative">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className={cn(baseInput, "w-full rounded-md opacity-60 cursor-not-allowed")}
                                                    onClick={handleInvoiceSelectAttempt}
                                                >
                                                    <span className="text-slate-400 text-sm">Buscar</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" className="bg-[#1e293b] text-white p-2 text-xs border-0 shadow-lg">
                                                Debes seleccionar un tipo de nota crédito
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            ) : (
                                <SearchableSelect
                                    value={selectedInvoice}
                                    onValueChange={(v) => {
                                        setSelectedInvoice(v);
                                        setErrors(prev => ({ ...prev, factura: undefined }));
                                    }}
                                    options={invoiceOptions}
                                    placeholder={loadingInvoices ? "Cargando..." : "Buscar"}
                                    searchPlaceholder="Buscar factura..."
                                    emptyMessage={
                                        loadingInvoices
                                            ? "Cargando..."
                                            : "No se han encontrado facturas\nNo hay facturas abiertas para ese cliente"
                                    }
                                    className={cn(baseInput, "w-full rounded-md", errors.factura && "border-red-400")}
                                />
                            )}

                            {errors.factura && (
                                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.factura}
                                </p>
                            )}
                        </div>

                        {/* Summary Totals */}
                        {invoiceDetails && (() => {
                            // Logic similar to InvoiceDetailDocument / Payments
                            const totalVenta = Number(invoiceDetails.total_payable_amount || invoiceDetails.total || invoiceDetails.bill?.total_payable_amount || invoiceDetails.bill?.total || 0);
                            const pendingAmount = invoiceDetails.pending_to_collect !== undefined
                                ? Number(invoiceDetails.pending_to_collect)
                                : (invoiceDetails.pending_amount !== undefined
                                    ? Number(invoiceDetails.pending_amount)
                                    : (invoiceDetails.bill?.pending_to_collect !== undefined
                                        ? Number(invoiceDetails.bill?.pending_to_collect)
                                        : (invoiceDetails.bill?.pending_amount !== undefined
                                            ? Number(invoiceDetails.bill?.pending_amount)
                                            : totalVenta)));
                            const retenciones = Number(invoiceDetails.withholdings_total || invoiceDetails.bill?.withholdings_total || 0);
                            const cobrado = totalVenta - pendingAmount;

                            return (
                                <>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Total venta</label>
                                        <div className="text-sm text-slate-600 h-[34px] flex items-center border-b border-slate-100">
                                            {formatCurrency(totalVenta)}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Retenciones</label>
                                        <div className="text-sm text-slate-600 h-[34px] flex items-center border-b border-slate-100">
                                            {formatCurrency(retenciones)}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Cobrado</label>
                                        <div className="text-sm text-slate-600 h-[34px] flex items-center border-b border-slate-100">
                                            {formatCurrency(cobrado)}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Por cobrar</label>
                                        <div className="text-sm text-slate-600 h-[34px] flex items-center border-b border-slate-100">
                                            {formatCurrency(pendingAmount)}
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>

                    {/* Products Table */}
                    {invoiceDetails && (() => {
                        const lines = invoiceDetails.lines || invoiceDetails.items || [];
                        let returnSubtotal = 0;
                        const returnTaxesMap: Record<string, { amount: number, name: string, percent: string }> = {};

                        // If it's type 5 "Otros", we iterate over customLines, else lines
                        const iterableLines = selectedType === '5' ? customLines : lines;

                        iterableLines.forEach((item: any, idx: number) => {
                            let itemSubtotal = 0;
                            let taxBase = 0;
                            let itemTaxes = item.taxes || [];

                            if (selectedType === '5') {
                                // Otros
                                const qty = Number(item.quantity) || 0;
                                const price = Number(item.price) || 0;
                                const discountVal = Number(item.discount?.value) || 0;
                                const baseAmount = qty * price;
                                const discountAmount = item.discount?.type === '%' ? (baseAmount * discountVal) / 100 : discountVal;
                                itemSubtotal = baseAmount - discountAmount;
                                taxBase = itemSubtotal;
                            } else {
                                const price = Number(item.price_amount || item.price || 0);
                                const maxQty = Number(item.quantity || 0);
                                const soldSubtotal = maxQty * price;

                                if (selectedType === '1' || selectedType === '2') {
                                    const qty = Number(returnedQuantities[idx]) || 0;
                                    itemSubtotal = qty * price;
                                    taxBase = itemSubtotal;
                                } else if (selectedType === '3' || selectedType === '6' || selectedType === '7') {
                                    const disc = lineDiscounts[idx] || { type: '%', value: '0' };
                                    const discVal = Number(disc.value) || 0;
                                    const discountAmount = disc.type === '%' ? (soldSubtotal * discVal) / 100 : discVal;
                                    itemSubtotal = discountAmount; // The discount is the amount returned
                                    taxBase = itemSubtotal;
                                } else if (selectedType === '4') {
                                    const newPriceStr = newPrices[idx];
                                    if (newPriceStr) {
                                        const newP = Number(newPriceStr);
                                        itemSubtotal = (price - newP) * maxQty;
                                        if (itemSubtotal < 0) itemSubtotal = 0; // Just in case new price > old price? Usually returns positive diff
                                        taxBase = itemSubtotal;
                                    } else {
                                        itemSubtotal = 0;
                                        taxBase = 0;
                                    }
                                }
                            }
                            returnSubtotal += itemSubtotal;

                            if (itemTaxes.length > 0) {
                                itemTaxes.forEach((t: any) => {
                                    const percent = Number(t.percent || t.rate || 0);
                                    const taxAmount = (taxBase * percent) / 100;
                                    const key = `${t.name}-${percent}`;
                                    if (!returnTaxesMap[key]) {
                                        returnTaxesMap[key] = { amount: 0, name: t.name, percent: percent.toFixed(2) };
                                    }
                                    returnTaxesMap[key].amount += taxAmount;
                                });
                            }
                        });

                        const returnTotal = returnSubtotal + Object.values(returnTaxesMap).reduce((sum, t) => sum + t.amount, 0);

                        // --- RENDER HELPERS ---
                        const renderTableHeaders = () => {
                            if (selectedType === '1') {
                                return (
                                    <tr>
                                        <th className="px-4 py-3 whitespace-nowrap">Productos</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Cantidad vendida</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap w-32">Cantidad devuelta</th>
                                        <th className="px-4 py-3 text-right whitespace-nowrap">Precio</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Descuento</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Impuesto</th>
                                        <th className="px-4 py-3 text-right whitespace-nowrap">Monto devuelto</th>
                                    </tr>
                                )
                            }
                            if (selectedType === '2') {
                                return (
                                    <tr>
                                        <th className="px-4 py-3 whitespace-nowrap">Productos</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Subtotal</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Descuento</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Impuesto</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Cantidad</th>
                                        <th className="px-4 py-3 text-right whitespace-nowrap">Monto devuelto</th>
                                    </tr>
                                )
                            }
                            if (['3', '6', '7'].includes(selectedType)) {
                                return (
                                    <tr>
                                        <th className="px-4 py-3 whitespace-nowrap">Productos</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Subtotal unitario</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Cantidad</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Impuesto</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap w-48">Descuento</th>
                                        <th className="px-4 py-3 text-right whitespace-nowrap">Monto devuelto</th>
                                    </tr>
                                )
                            }
                            if (selectedType === '4') {
                                return (
                                    <tr>
                                        <th className="px-4 py-3 whitespace-nowrap">Productos</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Cantidad</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Precio original</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap w-40">Precio nuevo</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Impuesto</th>
                                        <th className="px-4 py-3 text-right whitespace-nowrap">Monto devuelto</th>
                                    </tr>
                                )
                            }
                            if (selectedType === '5') {
                                return (
                                    <tr>
                                        <th className="px-4 py-3 whitespace-nowrap w-8"></th>
                                        <th className="px-4 py-3 whitespace-nowrap">Productos</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap w-32">Cantidad</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap w-40">Precio</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap w-48">Descuento</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Impuesto</th>
                                        <th className="px-4 py-3 text-right whitespace-nowrap">Subtotal</th>
                                    </tr>
                                )
                            }
                            return null;
                        };

                        const renderTableRow = (item: any, idx: number) => {
                            if (selectedType === '5') {
                                // OTROS
                                const qty = Number(item.quantity) || 0;
                                const price = Number(item.price) || 0;
                                const discVal = Number(item.discount?.value) || 0;
                                const baseAmount = qty * price;
                                const discountAmount = item.discount?.type === '%' ? (baseAmount * discVal) / 100 : discVal;
                                const itemSubtotal = baseAmount - discountAmount;

                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4 text-center">
                                            <button type="button" onClick={() => setCustomLines(customLines.filter(l => l.id !== item.id))} className="text-slate-400 hover:text-red-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <input type="text" value={item.name || ''} onChange={(e) => {
                                                const newL = [...customLines];
                                                newL[idx].name = e.target.value;
                                                setCustomLines(newL);
                                            }} className="w-full h-[34px] px-3 border rounded-md outline-none focus:border-primary" placeholder="Producto" />
                                        </td>
                                        <td className="px-4 py-4">
                                            <input type="text" inputMode="numeric" value={item.quantity || ''} onChange={(e) => {
                                                const newL = [...customLines];
                                                newL[idx].quantity = e.target.value.replace(/[^0-9]/g, '');
                                                setCustomLines(newL);
                                            }} className="w-full h-[34px] px-3 text-center border rounded-md outline-none focus:border-primary" />
                                        </td>
                                        <td className="px-4 py-4">
                                            <input type="text" inputMode="numeric" value={item.price || ''} onChange={(e) => {
                                                const newL = [...customLines];
                                                newL[idx].price = e.target.value.replace(/[^0-9]/g, '');
                                                setCustomLines(newL);
                                            }} className="w-full h-[34px] px-3 text-right border rounded-md outline-none focus:border-primary" />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex border rounded-md h-[34px] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40">
                                                <button type="button" onClick={() => {
                                                    const newL = [...customLines];
                                                    newL[idx].discount.type = newL[idx].discount.type === '%' ? '$' : '%';
                                                    setCustomLines(newL);
                                                }} className="px-2 border-r bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-medium w-8 text-center">{item.discount?.type}</button>
                                                <input type="text" inputMode="numeric" value={item.discount?.value || ''} onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                    const newL = [...customLines];
                                                    newL[idx].discount.value = val;
                                                    setCustomLines(newL);
                                                }} className="flex-1 w-full px-2 outline-none text-right" placeholder="0" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center text-slate-500 text-xs">
                                            {/* Simplified taxes select - in a real app this would be a full dropdown */}
                                            <Select value={item.taxes?.[0]?.percent?.toString() || '0'} onValueChange={(val) => {
                                                const newL = [...customLines];
                                                const rate = Number(val);
                                                newL[idx].taxes = rate > 0 ? [{ name: 'IVA', percent: rate, rate: rate }] : [];
                                                setCustomLines(newL);
                                            }}>
                                                <SelectTrigger className="w-full h-[34px] text-xs">
                                                    <SelectValue placeholder="Impuesto" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0" className="cursor-pointer text-xs">Sin impuestos</SelectItem>
                                                    <SelectItem value="19" className="cursor-pointer text-xs">IVA (19.00%)</SelectItem>
                                                    <SelectItem value="5" className="cursor-pointer text-xs">IVA (5.00%)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-4 py-4 text-right text-slate-600 font-medium">{formatCurrency(itemSubtotal)}</td>
                                    </tr>
                                );
                            }

                            // Types 1-4 logic
                            const productName = item.item_snapshot?.name || item.item?.name || item.name || item.description || "Producto";
                            const maxQty = Number(item.quantity || 0);
                            const price = Number(item.price_amount || item.price || 0);
                            const soldSubtotal = maxQty * price;
                            const taxStr = item.taxes?.length > 0
                                ? item.taxes.map((t: any) => `${t.name} (${Number(t.percent || t.rate || 0).toFixed(2)}%)`).join(', ')
                                : 'Sin impuestos';
                            const origDiscount = item.discount_amount ? formatCurrency(item.discount_amount) : (item.discount || '0%');

                            if (selectedType === '1') {
                                // DEVOLUCIÓN PARCIAL
                                const qtyDevueltaNum = Number(returnedQuantities[idx]) || 0;
                                const isOver = qtyDevueltaNum > maxQty;
                                const itemSubtotal = qtyDevueltaNum * price;
                                return (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4 text-slate-600">{productName}</td>
                                        <td className="px-4 py-4 text-center text-primary font-medium">{maxQty}</td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="relative inline-block w-full">
                                                <input
                                                    type="text" inputMode="numeric"
                                                    value={returnedQuantities[idx] || ''}
                                                    onChange={(e) => setReturnedQuantities(prev => ({ ...prev, [idx]: e.target.value.replace(/[^0-9]/g, '') }))}
                                                    className={cn("w-full h-[34px] px-3 text-center border rounded-md outline-none transition-colors",
                                                        isOver ? "border-red-400 text-red-600 focus:border-red-500" : "border-slate-200 focus:border-primary"
                                                    )}
                                                />
                                                {isOver && <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />}
                                            </div>
                                            {isOver && <p className="text-[10px] text-red-500 text-left mt-1 leading-tight">Supera la cantidad<br />vendida</p>}
                                        </td>
                                        <td className="px-4 py-4 text-right text-slate-600">{formatCurrency(price)}</td>
                                        <td className="px-4 py-4 text-center text-slate-600">{origDiscount}</td>
                                        <td className="px-4 py-4 text-center text-slate-500 text-xs">{taxStr}</td>
                                        <td className="px-4 py-4 text-right text-slate-600 font-medium">{formatCurrency(itemSubtotal)}</td>
                                    </tr>
                                );
                            }

                            if (selectedType === '2') {
                                // ANULACIÓN DE FACTURA
                                const itemSubtotal = maxQty * price;
                                return (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4 text-slate-600">{productName}</td>
                                        <td className="px-4 py-4 text-center text-slate-600">{formatCurrency(soldSubtotal)}</td>
                                        <td className="px-4 py-4 text-center text-slate-600">{origDiscount}</td>
                                        <td className="px-4 py-4 text-center text-slate-500 text-xs">{taxStr}</td>
                                        <td className="px-4 py-4 text-center text-primary font-medium">{maxQty}</td>
                                        <td className="px-4 py-4 text-right text-slate-600 font-medium">{formatCurrency(itemSubtotal)}</td>
                                    </tr>
                                );
                            }

                            if (['3', '6', '7'].includes(selectedType)) {
                                // DESCUENTOS
                                const disc = lineDiscounts[idx] || { type: '%', value: '0' };
                                const discVal = Number(disc.value) || 0;
                                const discountAmount = disc.type === '%' ? (soldSubtotal * discVal) / 100 : discVal;

                                return (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4 text-slate-600">{productName}</td>
                                        <td className="px-4 py-4 text-center text-slate-600">{formatCurrency(soldSubtotal)}</td>
                                        <td className="px-4 py-4 text-center text-primary font-medium">{maxQty}</td>
                                        <td className="px-4 py-4 text-center text-slate-500 text-xs">{taxStr}</td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex border rounded-md h-[34px] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40 max-w-[140px] mx-auto">
                                                <button type="button" onClick={() => {
                                                    setLineDiscounts(prev => ({
                                                        ...prev,
                                                        [idx]: { ...prev[idx], type: prev[idx]?.type === '%' ? '$' : '%' }
                                                    }));
                                                }} className="px-2 border-r bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-medium w-8 text-center">{disc.type}</button>
                                                <input type="text" inputMode="numeric" value={disc.value} onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                    setLineDiscounts(prev => ({ ...prev, [idx]: { ...prev[idx], value: val } }));
                                                }} className="flex-1 w-full px-2 outline-none text-right" placeholder="0" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right text-slate-600 font-medium">{formatCurrency(discountAmount)}</td>
                                    </tr>
                                );
                            }

                            if (selectedType === '4') {
                                // AJUSTE DE PRECIO
                                const newPriceStr = newPrices[idx];
                                const isMissing = !newPriceStr;
                                const diff = newPriceStr ? (price - Number(newPriceStr)) * maxQty : 0;
                                const montoDevuelto = diff > 0 ? diff : 0;

                                return (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4 text-slate-600">{productName}</td>
                                        <td className="px-4 py-4 text-center text-primary font-medium">{maxQty}</td>
                                        <td className="px-4 py-4 text-center text-slate-600">{formatCurrency(price)}</td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="relative inline-block w-full max-w-[120px]">
                                                <div className={cn("flex border rounded-md h-[34px] focus-within:border-primary transition-colors overflow-hidden", isMissing ? "border-red-400" : "border-slate-200")}>
                                                    <span className="flex items-center px-2 bg-slate-50 border-r text-slate-500 text-xs">$</span>
                                                    <input type="text" inputMode="numeric" value={newPriceStr || ''} onChange={(e) => {
                                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                                        setNewPrices(prev => ({ ...prev, [idx]: val }));
                                                    }} className={cn("flex-1 w-full px-2 outline-none text-right", isMissing && "text-red-600")} />
                                                </div>
                                                {isMissing && <AlertCircle className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />}
                                            </div>
                                            {isMissing && <p className="text-[10px] text-red-500 text-left mt-1 leading-tight max-w-[120px] mx-auto">Pendiente de diligenciar</p>}
                                        </td>
                                        <td className="px-4 py-4 text-center text-slate-500 text-xs">{taxStr}</td>
                                        <td className="px-4 py-4 text-right text-slate-600 font-medium">{formatCurrency(montoDevuelto)}</td>
                                    </tr>
                                );
                            }

                            return null;
                        };

                        return (
                            <>
                                {['3', '6', '7'].includes(selectedType) && (
                                    <div className="flex justify-end mb-3 mt-4 relative">
                                        <button type="button" onClick={() => setGlobalDiscountPopoverOpen(!globalDiscountPopoverOpen)} className="px-4 py-1.5 text-sm font-medium border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                                            Aplicar descuento a todo
                                        </button>
                                        {globalDiscountPopoverOpen && (
                                            <div className="absolute top-full right-0 mt-2 p-4 bg-white border border-slate-200 rounded-xl shadow-xl z-10 w-72">
                                                <h4 className="text-sm font-semibold text-slate-800 mb-1">Indica el descuento total de la venta</h4>
                                                <p className="text-xs text-slate-500 mb-4">El valor se divide entre todos los productos</p>
                                                <div className="flex border rounded-md h-[34px] focus-within:border-primary mb-3">
                                                    <button type="button" onClick={() => {
                                                        setGlobalDiscount(prev => ({ ...prev, type: prev.type === '%' ? '$' : '%' }));
                                                    }} className="px-3 border-r bg-slate-50 text-slate-600 hover:bg-slate-100 text-sm font-medium w-10 text-center">{globalDiscount.type}</button>
                                                    <input type="text" inputMode="numeric" value={globalDiscount.value} onChange={(e) => {
                                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                                        setGlobalDiscount(prev => ({ ...prev, value: val }));
                                                    }} className="flex-1 w-full px-3 outline-none text-right" placeholder="0" />
                                                </div>
                                                <div className="flex justify-end">
                                                    <button type="button" onClick={() => {
                                                        // Apply to all
                                                        const gVal = Number(globalDiscount.value) || 0;
                                                        const newDiscounts = { ...lineDiscounts };
                                                        if (globalDiscount.type === '%') {
                                                            lines.forEach((_: any, idx: number) => {
                                                                newDiscounts[idx] = { type: '%', value: gVal.toString() };
                                                            });
                                                        } else {
                                                            // Divide $ among all proportional to soldSubtotal
                                                            const totalSold = lines.reduce((sum: number, item: any) => sum + (Number(item.quantity || 0) * Number(item.price_amount || item.price || 0)), 0);
                                                            if (totalSold > 0) {
                                                                lines.forEach((item: any, idx: number) => {
                                                                    const soldSub = Number(item.quantity || 0) * Number(item.price_amount || item.price || 0);
                                                                    const share = (soldSub / totalSold) * gVal;
                                                                    newDiscounts[idx] = { type: '$', value: Math.round(share).toString() };
                                                                });
                                                            }
                                                        }
                                                        setLineDiscounts(newDiscounts);
                                                        setGlobalDiscountPopoverOpen(false);
                                                    }} className="px-4 py-1.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                                                        Aplicar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedType === '5' && (
                                    <div className="flex gap-4 mb-3 mt-4">
                                        <button type="button" onClick={() => {
                                            setCustomLines([...customLines, { id: Date.now().toString(), productId: '', quantity: '1', price: '0', discount: { type: '%', value: '0' }, taxes: [] }]);
                                        }} className="text-primary text-sm font-medium hover:text-primary/80 flex items-center gap-1">
                                            + Agregar línea
                                        </button>
                                    </div>
                                )}

                                <div className="mt-2 border border-slate-100 rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto min-h-[150px]">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-100 text-slate-700 font-normal border-b border-slate-200">
                                                {renderTableHeaders()}
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {iterableLines.map((item: any, idx: number) => renderTableRow(item, idx))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Totales */}
                                    <div className="p-6 bg-white flex flex-col items-end gap-3 border-t border-slate-100">
                                        <div className="flex justify-between w-64 text-sm text-slate-500">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(returnSubtotal)}</span>
                                        </div>
                                        {Object.values(returnTaxesMap).map((tax, idx) => (
                                            <div key={idx} className="flex justify-between w-64 text-sm text-slate-500">
                                                <span>Devolución {tax.name} ({tax.percent}%)</span>
                                                <span>{formatCurrency(tax.amount)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between w-64 text-base font-bold text-slate-800">
                                            <span>Total devolución</span>
                                            <span>{formatCurrency(returnTotal)}</span>
                                        </div>
                                    </div>
                                </div>


                                {/* Text Areas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Razón</label>
                                        <textarea
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Incluye el motivo por el cual realizas la devolución."
                                            className="w-full h-24 p-3 text-sm border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none resize-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2 relative">
                                        <div className="flex items-center gap-1">
                                            <label className="block text-sm font-medium text-slate-700">Notas</label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="w-4 h-4 text-primary cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="bg-[#1e293b] text-white p-2 text-xs font-normal border-0 shadow-lg">
                                                        Información visible en la impresión del documento.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Información visible en la impresión del documento."
                                            className="w-full h-24 p-3 text-sm border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none resize-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>

            {/* Footer buttons */}
            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    className="cursor-pointer px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    onClick={() => router.push("/returns")}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={!isFormValid || isSubmitting}
                    className={cn(
                        "px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",
                        (isFormValid && !isSubmitting)
                            ? "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-primary/40 text-primary-foreground cursor-not-allowed"
                    )}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Guardando...
                        </>
                    ) : "Guardar"}
                </button>
            </div>

            <Dialog open={!!pendingDocType} onOpenChange={(open) => !open && setPendingDocType(null)}>
                <DialogContent className="max-w-md p-6 overflow-hidden border-0 rounded-xl shadow-lg bg-white">
                    <DialogHeader className="flex flex-row items-center justify-between mb-2">
                        <DialogTitle className="text-lg font-semibold text-slate-800">Cambiar de documento y reiniciar</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-slate-600 mb-6">
                        Ten en cuenta que si cambias el tipo de documento, vas a perder el progreso de los datos diligenciados en esta nota crédito.
                    </div>
                    <div className="flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setPendingDocType(null)}
                            className="cursor-pointer px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                            Seguir sin cambios
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (pendingDocType) {
                                    setDocType(pendingDocType);
                                    setClientId('');
                                    setSelectedType('');
                                    setSelectedInvoice('');
                                    setPendingDocType(null);
                                }
                            }}
                            className="cursor-pointer px-4 py-2 bg-[#2DD4BF] text-white rounded-lg text-sm font-medium hover:bg-[#2DD4BF]/90 transition-colors"
                        >
                            Cambiar documento
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Numeration Modal */}
            <Dialog open={isNumerationModalOpen} onOpenChange={setIsNumerationModalOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-xl shadow-lg bg-white">
                    <DialogHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
                        <DialogTitle className="text-base font-semibold text-slate-800">Cambiar numeración</DialogTitle>
                    </DialogHeader>

                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Numeración <span className="text-primary">*</span>
                                </label>
                                <SearchableSelect
                                    value={selectedResolution}
                                    onValueChange={handleResolutionChange}
                                    options={resolutionsOptions}
                                    placeholder="Seleccionar..."
                                    searchPlaceholder="Buscar numeración..."
                                    emptyMessage="No se encontraron resoluciones."
                                    className={cn(baseInput, "w-full rounded-md")}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">
                                    Siguiente número <span className="text-primary/50">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={nextNumber}
                                    disabled
                                    className="bg-white h-[34px] pl-3 pr-3 text-sm border border-foreground/10 text-slate-400 outline-none flex items-center w-full rounded-xl box-border opacity-70 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                        <button
                            type="button"
                            onClick={() => setIsNumerationModalOpen(false)}
                            className="cursor-pointer px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsNumerationModalOpen(false)}
                            className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
