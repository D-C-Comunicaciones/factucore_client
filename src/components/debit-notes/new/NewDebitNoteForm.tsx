"use client";

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Edit2, AlertCircle, Plus, X, RefreshCw, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { PercentCurrencyToggle } from '@/components/ui/percent-currency-toggle';
import { cn } from '@/lib/utils';
import { AuthService } from '@/lib/auth';
import { ContactsService } from '@/lib/contacts';
import { DebitNotesService } from '@/lib/debitNotes';
import { InvoicesService } from '@/lib/invoices';
import { useResolutions } from '@/hooks/useResolutions';
import { useCatalogs } from '@/hooks/useCatalogs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { showToast } from '@/components/sonner/CustomToaster';
import { DatePickerSimple } from '@/components/ui/DatePickerSimple';
import { CommentsAndReminders } from '@/components/shared/CommentsAndReminders';
import { ChangeClientModal } from '../modals/ChangeClientModal';
import { ExitFormModal } from '../modals/ExitFormModal';

type FieldError = {
    cliente?: string;
    tipoNota?: string;
    factura?: string;
    lineas?: string;
    razon?: string;
    metodoPago?: string;
};

interface InvoiceSelection {
    invoiceId: string;
    details: any | null;
}

interface AddedLine {
    uid: string;
    productId: string;
    name: string;
    price: number;
    taxes: any[];
    quantity: string;
    discount: { type: '%' | '$', value: string };
    invoiceLineId?: number | string;
}

interface TipItem {
    uid: string;
    reason: string;
    type: '%' | '$';
    value: string;
}

const createEmptyLine = (): AddedLine => ({
    uid: crypto.randomUUID(), productId: '', name: '', price: 0, taxes: [], quantity: '', discount: { type: '%', value: '0' }
});

export function NewDebitNoteForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialClientId = searchParams?.get('clientId');
    const initialInvoiceId = searchParams?.get('invoiceId');
    const [hasInitializedInvoice, setHasInitializedInvoice] = useState(false);

    // Form state
    const [clientId, setClientId] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());

    // Invoice state (una sola factura asociada — sin batch)
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceSelection>({ invoiceId: '', details: null });

    // Lines state
    const [addedLines, setAddedLines] = useState<AddedLine[]>([createEmptyLine()]);

    // Propinas / cargos globales
    const [tips, setTips] = useState<TipItem[]>([]);
    const [newTipReason, setNewTipReason] = useState('');
    const [newTipType, setNewTipType] = useState<'%' | '$'>('%');
    const [newTipValue, setNewTipValue] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingMode, setSubmittingMode] = useState<'send' | 'draft' | 'print' | null>(null);
    const [reason, setReason] = useState('');
    const [reasonTouched, setReasonTouched] = useState(false);
    const [notes, setNotes] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState<string>('');
    const [errors, setErrors] = useState<FieldError>({});

    const [pendingClientId, setPendingClientId] = useState<string | null>(null);
    const [showExitModal, setShowExitModal] = useState(false);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);

    const [comments, setComments] = useState<any[]>([]);

    const hasDataEntered = selectedInvoice.invoiceId !== '' || addedLines.some(l => l.productId !== '') || addedLines.some(l => Number(l.quantity) > 0);
    const isDirty = selectedType !== '' || selectedInvoice.invoiceId !== '' || clientId !== '';

    useEffect(() => {
        const handleLinkClick = (e: MouseEvent) => {
            if (!isDirty) return;
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');
            if (anchor && anchor.href && !anchor.target) {
                const currentUrl = new URL(window.location.href);
                const anchorUrl = new URL(anchor.href, window.location.origin);
                if (anchorUrl.origin === currentUrl.origin && anchorUrl.pathname !== currentUrl.pathname) {
                    e.preventDefault();
                    e.stopPropagation();
                    setPendingUrl(anchorUrl.pathname + anchorUrl.search + anchorUrl.hash);
                    setShowExitModal(true);
                }
            }
        };

        document.addEventListener('click', handleLinkClick, true);
        return () => {
            document.removeEventListener('click', handleLinkClick, true);
        };
    }, [isDirty]);

    useEffect(() => {
        if (initialClientId && !clientId) {
            setClientId(initialClientId);
        }
    }, [initialClientId, clientId]);

    const handleClientChange = (val: string) => {
        if (val === clientId) return;
        if (clientId && hasDataEntered) {
            setPendingClientId(val);
        } else {
            setClientId(val);
            setErrors(prev => ({ ...prev, cliente: undefined }));
        }
    };

    const confirmClientChange = () => {
        if (pendingClientId) {
            setClientId(pendingClientId);
            setErrors(prev => ({ ...prev, cliente: undefined }));
        }
        setPendingClientId(null);
    };

    const handleTypeChange = (val: string) => {
        setSelectedType(val);
        setErrors(prev => ({ ...prev, tipoNota: undefined }));
    };

    const formatCurrency = (val: number | string | undefined) => {
        if (!val && val !== 0) return '$0';
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 20 }).format(Number(val));
    };

    // Company info
    const [companyName, setCompanyName] = useState('...');
    const [companyNit, setCompanyNit] = useState('...');

    // Customers
    const [clientOptions, setClientOptions] = useState<{ value: string; label: string }[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    // Debit note types from API
    const [debitNoteTypes, setDebitNoteTypes] = useState<{ value: string; label: string }[]>([]);
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

    // Catálogos (métodos de pago)
    const catalogData = useCatalogs();
    const paymentMethodOptions = (catalogData.paymentMethods || []).map((pm: any) => ({
        value: pm.id.toString(),
        label: pm.name,
    }));

    const baseInput = "bg-white h-[34px] pl-3 pr-3 text-sm border border-foreground/20 shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none flex items-center w-full rounded-xl box-border";

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

    const FALLBACK_DEBIT_NOTE_TYPES = [
        { value: "1", label: "Intereses" },
        { value: "2", label: "Gastos por cobrar" },
        { value: "3", label: "Cambio del valor" },
        { value: "4", label: "Otros" },
    ];

    useEffect(() => {
        const loadTypes = async () => {
            setLoadingTypes(true);
            try {
                const types = await DebitNotesService.listTypes();
                if (types.length > 0) {
                    setDebitNoteTypes(types.map((t) => ({
                        value: t.id.toString(),
                        label: t.name,
                    })));
                } else {
                    setDebitNoteTypes(FALLBACK_DEBIT_NOTE_TYPES);
                }
            } catch (e) {
                console.error("Error al cargar tipos de nota débito:", e);
                setDebitNoteTypes(FALLBACK_DEBIT_NOTE_TYPES);
            } finally {
                setLoadingTypes(false);
            }
        };
        loadTypes();
    }, []);

    useEffect(() => {
        if (!clientId) {
            setInvoiceOptions([]);
            setSelectedInvoice({ invoiceId: '', details: null });
            setAddedLines([createEmptyLine()]);
            return;
        }
        const loadInvoices = async () => {
            setLoadingInvoices(true);
            setSelectedInvoice({ invoiceId: '', details: null });
            setAddedLines([createEmptyLine()]);
            try {
                const invoices = await DebitNotesService.listInvoicesByCustomer(clientId);
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

    const { resolutions, refetch: refetchResolutions, isLoading: isLoadingResolutions } = useResolutions({ type_resolution: 4, is_active: true });

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
                    next_consecutive: ((r.current_number ?? ((r.from_number || 1) - 1)) + 1),
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
            } else {
                const currentRes = opts.find((o: any) => o.value === selectedResolution);
                if (currentRes) {
                    setNextNumber(currentRes.next_consecutive?.toString() || '1');
                    setCurrentPrefix(currentRes.prefix || '');
                }
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

    const handleInvoiceChange = async (invoiceId: string) => {
        if (!invoiceId) {
            setSelectedInvoice({ invoiceId, details: null });
            return;
        }

        try {
            const res = await InvoicesService.getById(invoiceId);
            const data = res?.data || res;
            const invoiceData = (data as any)?.invoice || (data as any)?.data?.invoice || data;

            setSelectedInvoice({ invoiceId, details: invoiceData });
            setErrors(prev => ({ ...prev, factura: undefined }));

            // Reinicia las líneas a una fila en blanco: en notas débito el usuario
            // digita cantidad/valor manualmente, no se heredan de la factura.
            setAddedLines([createEmptyLine()]);

            if (!reasonTouched) {
                const num = invoiceData?.prefix ? `${invoiceData.prefix}${invoiceData.number}` : (invoiceData?.number || invoiceId);
                setReason(`Nota de débito a factura ${num}`);
            }
        } catch (e) {
            console.error("Error al cargar detalles de la factura:", e);
        }
    };

    useEffect(() => {
        if (initialInvoiceId && invoiceOptions.length > 0 && !hasInitializedInvoice) {
            setHasInitializedInvoice(true);
            if (selectedInvoice.invoiceId !== initialInvoiceId) {
                handleInvoiceChange(initialInvoiceId);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialInvoiceId, invoiceOptions, hasInitializedInvoice]);

    // Catálogo de productos disponible: las líneas de la factura seleccionada,
    // ofrecidas como opciones seleccionables — la cantidad/valor los digita el usuario.
    const availableProducts = useMemo(() => {
        const details = selectedInvoice.details;
        if (!details) return [] as any[];
        const lines = details.lines || details.items || [];
        return lines.map((line: any, idx: number) => ({
            ...line,
            _lineId: line.id ?? idx,
        }));
    }, [selectedInvoice.details]);

    const addLine = () => {
        setAddedLines([...addedLines, createEmptyLine()]);
    };

    const removeLine = (uid: string) => {
        setAddedLines(prev => prev.filter(l => l.uid !== uid));
    };

    const handleLineProductChange = (uid: string, lineId: string) => {
        const prod = availableProducts.find((p: any) => String(p._lineId) === lineId);
        if (prod) {
            setAddedLines(prev => prev.map(l => {
                if (l.uid === uid) {
                    const price = Number(prod.price_amount || prod.price || 0);
                    let mappedTaxes: any[] = [];
                    if (prod.taxes && prod.taxes.length > 0) {
                        const pt = prod.taxes[0];
                        const foundTax = catalogData.taxes?.find((ct: any) => 
                            ct.id === pt.tax_rate_id || 
                            (ct.name === pt.name && Number(ct.rate || ct.percentage) === Number(pt.percent || pt.rate))
                        );
                        if (foundTax) {
                            mappedTaxes = [{
                                id: foundTax.id,
                                tax_rate_id: foundTax.id,
                                tax_id: foundTax.tax_id,
                                name: foundTax.name,
                                rate: parseFloat(foundTax.rate || foundTax.percentage || "0"),
                                percent: parseFloat(foundTax.rate || foundTax.percentage || "0"),
                                type: foundTax.type || 'percentage',
                            }];
                        }
                    }

                    return {
                        ...l,
                        productId: prod.item_id || prod.product_id || '',
                        name: prod.item_snapshot?.name || prod.item?.name || prod.name || prod.description || "Producto",
                        price: price,
                        quantity: l.quantity === '' ? '1' : l.quantity,
                        taxes: mappedTaxes,
                        invoiceLineId: prod.id || prod._lineId,
                    };
                }
                return l;
            }));
        }
    };

    const addTip = () => {
        if (!newTipReason || !newTipValue) return;
        setTips(prev => [...prev, { uid: crypto.randomUUID(), reason: newTipReason, type: newTipType, value: newTipValue }]);
        setNewTipReason('');
        setNewTipValue('');
    };

    const removeTip = (uid: string) => {
        setTips(prev => prev.filter(t => t.uid !== uid));
    };

    const buildPayload = () => {
        const details = selectedInvoice.details;
        const customerRaw = details?.customer || details?.contact || null;
        const customerObj: Record<string, any> = customerRaw
            ? {
                id: customerRaw.id ?? Number(clientId),
                identification_number: customerRaw.identification_number,
                registration_name: customerRaw.registration_name || customerRaw.name,
                type_document_identification: customerRaw.type_document_identification,
                type_organization: customerRaw.type_organization,
                type_regime: customerRaw.type_regime,
                type_liabilities: customerRaw.type_liabilities,
                municipality: customerRaw.municipality,
                address: customerRaw.address,
                email: customerRaw.email,
                phone1: customerRaw.phone1,
            }
            : { id: Number(clientId) };

        const validLines = addedLines.filter(l => l.productId && Number(l.quantity) > 0);

        const mapLine = (l: AddedLine) => {
            const discVal = Number(l.discount.value) || 0;
            const discounts = discVal > 0 ? [{
                type: l.discount.type === '%' ? 'percentage' : 'fixed',
                percent: l.discount.type === '%' ? discVal : undefined,
                value: discVal,
                reason: 'Descuento de línea',
            }] : [];

            return {
                description: l.name || 'Ítem',
                quantity: Number(l.quantity) || 0,
                price: Number(l.price) || 0,
                item_snapshot: { id: l.productId, name: l.name },
                taxes: (l.taxes || []).map((t: any) => {
                    const percent = Number(t.percent || t.rate || 0);
                    return {
                        tax_id: t.tax_id || t.id,
                        type: t.type || 'percentage',
                        rate: percent,
                        tax_code: t.tax_code || String(t.tax_id || ''),
                        name: t.name || t.tax?.name || t.tax_name || '',
                        percent: percent,
                    };
                }),
                discounts,
                charges: [],
            };
        };

        return {
            invoice_id: selectedInvoice.invoiceId ? Number(selectedInvoice.invoiceId) : null,
            resolution_id: selectedResolution ? Number(selectedResolution) : null,
            type_currency_id: 35,
            type_debit_note_id: Number(selectedType),
            customer: customerObj,
            date: date.toISOString().split('T')[0],
            observation: reason,
            note: notes,
            send_mail: true,
            payment_method_id: paymentMethodId ? Number(paymentMethodId) : undefined,
            lines: validLines.map(mapLine),
            global_discounts: [],
            global_charges: tips.map(t => ({
                reason: t.reason,
                type: t.type === '%' ? 'percentage' : 'fixed',
                percent: t.type === '%' ? Number(t.value) : undefined,
                value: Number(t.value),
            })),
        };
    };

    const validate = () => {
        const newErrors: FieldError = {};
        if (!clientId) newErrors.cliente = 'El cliente es obligatorio';
        if (!selectedType) newErrors.tipoNota = 'El tipo de nota de débito es obligatorio';
        if (!selectedInvoice.invoiceId) newErrors.factura = 'La factura de venta asociada es obligatoria';

        const validLines = addedLines.filter(l => l.productId && Number(l.quantity) > 0);
        // Las líneas son opcionales: una nota débito puede ser un único ajuste global
        // (ej. propina/recargo) sin anexar líneas de la factura original.
        if (validLines.length === 0 && tips.length === 0) {
            newErrors.lineas = 'Debe agregar al menos una línea o una propina/recargo';
        }

        if (!reason.trim()) newErrors.razon = 'La razón es obligatoria';
        if (!paymentMethodId) newErrors.metodoPago = 'El método de pago es obligatorio';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveAction = async (mode: 'send' | 'draft' | 'print') => {
        if (!validate()) return;

        if (dnTotal < 0) {
            showToast("El total del documento no puede ser un valor negativo", "error");
            return;
        }

        setIsSubmitting(true);
        setSubmittingMode(mode);
        try {
            const payload = buildPayload();

            if (mode === 'draft') {
                const response = await DebitNotesService.store(payload);
                const note = response?.debit_note || response?.data?.debit_note;
                showToast("Nota débito guardada como borrador", "success", "Éxito");
                if (note && note.id) {
                    router.push(`/expenses/debit-notes/${note.id}`);
                } else {
                    router.push("/expenses/debit-notes");
                }
                return;
            }

            const response = await DebitNotesService.send(payload);
            const note = response?.debit_note || response?.data?.debit_note;
            showToast("Nota débito guardada y enviada correctamente", "success", "Éxito");

            if (mode === 'print' && note?.id) {
                try {
                    const blob = await DebitNotesService.printPdfBlob(note.id);
                    const docName = `Nota Débito No. ${note.prefix || ''}${note.number || note.id}`;
                    const file = new File([blob], docName + ".pdf", { type: "application/pdf" });
                    const url = window.URL.createObjectURL(file);
                    const iframe = document.createElement("iframe");
                    iframe.style.position = "absolute";
                    iframe.style.width = "0";
                    iframe.style.height = "0";
                    iframe.style.border = "none";
                    iframe.src = url;
                    iframe.onload = () => {
                        const win = iframe.contentWindow;
                        if (win) {
                            setTimeout(() => {
                                win.print();
                                const cleanup = () => {
                                    if (document.body.contains(iframe)) document.body.removeChild(iframe);
                                    window.URL.revokeObjectURL(url);
                                };
                                win.onafterprint = cleanup;
                                setTimeout(cleanup, 120000);
                            }, 100);
                        }
                    };
                    document.body.appendChild(iframe);
                } catch (e) {
                    console.error("No se pudo preparar la impresión:", e);
                }
            }

            if (note && note.id) {
                router.push(`/expenses/debit-notes/${note.id}`);
            } else {
                router.push("/expenses/debit-notes");
            }
        } catch (error: any) {
            console.error("Error guardando nota de débito:", error);
            showToast(error?.response?.data?.message || error?.message || "Ocurrió un error al guardar la nota débito", "error", "Error");
        } finally {
            setIsSubmitting(false);
            setSubmittingMode(null);
        }
    };

    const isFormValid = !!clientId && !!selectedType && !!selectedInvoice.invoiceId && !!reason.trim() && !!paymentMethodId;

    // Calc totals
    let dnSubtotal = 0;
    let lineDiscountsTotal = 0;
    const dnTaxesMap: Record<string, { amount: number, name: string, percent: string }> = {};

    addedLines.forEach((item) => {
        if (!item.productId) return;

        const qty = Number(item.quantity) || 0;
        const baseAmount = qty * item.price;
        const discVal = Number(item.discount?.value) || 0;
        const discountAmount = item.discount?.type === '%' ? (baseAmount * discVal) / 100 : discVal;
        const itemSubtotal = baseAmount - discountAmount;
        const taxBase = itemSubtotal;

        dnSubtotal += baseAmount;
        lineDiscountsTotal += discountAmount;

        if (item.taxes && item.taxes.length > 0) {
            item.taxes.forEach((t: any) => {
                const percent = Number(t.percent || t.rate || 0);
                const taxAmount = (taxBase * percent) / 100;
                const key = `${t.name}-${percent}`;
                if (!dnTaxesMap[key]) {
                    dnTaxesMap[key] = { amount: 0, name: t.name, percent: Number(percent).toString() };
                }
                dnTaxesMap[key].amount += taxAmount;
            });
        }
    });

    let tipsTotal = 0;
    tips.forEach(t => {
        const val = Number(t.value) || 0;
        tipsTotal += t.type === '%' ? (dnSubtotal * val) / 100 : val;
    });

    const taxesTotal = Object.values(dnTaxesMap).reduce((sum, t) => sum + t.amount, 0);
    const dnTotal = dnSubtotal - lineDiscountsTotal + taxesTotal + tipsTotal;

    const menuBtnClass = "cursor-pointer px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2";

    return (
        <div className="w-full">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

                {/* Form fields */}
                <div className="p-6">
                    {/* Header company info */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-lg font-bold text-slate-800">{companyName}</h2>
                            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{companyNit}</span>
                        </div>
                        <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
                            <div className="flex items-center gap-2">
                                <div className="text-lg font-bold text-slate-800 tracking-tight">No. {currentPrefix}{nextNumber}</div>
                                <button
                                    type="button"
                                    className="p-1 rounded hover:bg-slate-100 transition"
                                    onClick={() => refetchResolutions()}
                                    title="Actualizar numeración"
                                    disabled={isLoadingResolutions}
                                >
                                    <RefreshCw className={cn("w-4 h-4 text-slate-400", isLoadingResolutions && "animate-spin")} />
                                </button>
                            </div>
                            <div
                                className="text-xs text-slate-500 flex items-center justify-end gap-1 cursor-pointer hover:bg-slate-100 p-1.5 rounded-md transition-colors w-fit mt-0.5"
                                onClick={() => setIsNumerationModalOpen(true)}
                            >
                                Nota débito
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
                                onValueChange={handleClientChange}
                                options={clientOptions}
                                loading={loadingCustomers}
                                placeholder="Seleccionar cliente"
                                searchPlaceholder="Buscar cliente..."
                                emptyMessage="No se encontraron clientes."
                                className={cn(baseInput, "w-full rounded-md", errors.cliente && "border-red-400")}
                            />
                            {errors.cliente && (
                                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.cliente}
                                </p>
                            )}
                        </div>

                        {/* Tipo de nota de débito */}
                        <div className="space-y-2 relative">
                            <label className="block text-sm font-medium text-slate-700">
                                Tipo de nota de débito <span className="text-primary">*</span>
                            </label>
                            <SearchableSelect
                                value={selectedType}
                                onValueChange={handleTypeChange}
                                options={debitNoteTypes}
                                loading={loadingTypes}
                                placeholder="Seleccionar"
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

                    {/* Factura asociada */}
                    <div className="space-y-6 mb-8 border-b border-slate-100 pb-8">
                        {(() => {
                            const details = selectedInvoice.details;
                            let totalVenta = 0, pendingAmount = 0, retenciones = 0, cobrado = 0;
                            if (details) {
                                totalVenta = Number(details.total_payable_amount || details.total || details.bill?.total_payable_amount || details.bill?.total || 0);
                                pendingAmount = details.pending_to_collect !== undefined
                                    ? Number(details.pending_to_collect)
                                    : (details.pending_amount !== undefined
                                        ? Number(details.pending_amount)
                                        : (details.bill?.pending_to_collect !== undefined
                                            ? Number(details.bill?.pending_to_collect)
                                            : (details.bill?.pending_amount !== undefined
                                                ? Number(details.bill?.pending_amount)
                                                : totalVenta)));
                                retenciones = Number(details.withholdings_total || details.bill?.withholdings_total || 0);
                                cobrado = totalVenta - pendingAmount;
                            }

                            return (
                                <div className="relative flex flex-col gap-4 p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                                    <div className={cn("grid gap-6", details ? "grid-cols-1 md:grid-cols-5" : "grid-cols-1 md:grid-cols-3")}>
                                        <div className="space-y-2 md:col-span-1">
                                            <label className={cn("block text-sm font-medium", clientId ? "text-slate-700" : "text-slate-400")}>
                                                Factura de venta asociada <span className={clientId ? "text-primary" : "text-primary/50"}>*</span>
                                            </label>

                                            {!clientId ? (
                                                <div className={cn(baseInput, "w-full rounded-md opacity-50 cursor-not-allowed")} title="Selecciona un cliente primero">
                                                    <span className="text-slate-400 text-sm">Buscar</span>
                                                </div>
                                            ) : (
                                                <SearchableSelect
                                                    value={selectedInvoice.invoiceId}
                                                    onValueChange={(v) => handleInvoiceChange(v)}
                                                    options={invoiceOptions}
                                                    loading={loadingInvoices}
                                                    placeholder="Buscar factura"
                                                    searchPlaceholder="Buscar.."
                                                    emptyMessage="No hay facturas."
                                                    className={cn(baseInput, "w-full rounded-md", errors.factura && "border-red-400")}
                                                />
                                            )}
                                        </div>

                                        {details && (
                                            <>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-slate-700">Total venta</label>
                                                    <div className="text-sm text-slate-600 h-[34px] flex items-center border-b border-slate-200">{formatCurrency(totalVenta)}</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-slate-700">Retenciones</label>
                                                    <div className="text-sm text-slate-600 h-[34px] flex items-center border-b border-slate-200">{formatCurrency(retenciones)}</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-slate-700">Cobrado</label>
                                                    <div className="text-sm text-slate-600 h-[34px] flex items-center border-b border-slate-200">{formatCurrency(cobrado)}</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-slate-700">Por cobrar</label>
                                                    <div className="text-sm text-slate-600 h-[34px] flex items-center border-b border-slate-200">{formatCurrency(pendingAmount)}</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}

                        {errors.factura && (
                            <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                {errors.factura}
                            </p>
                        )}
                    </div>

                    {/* Products Table */}
                    {selectedInvoice.invoiceId && (
                        <div className="mb-8 overflow-x-auto relative border-b border-gray-200">
                            <Table className="[&_td]:border-b-0">
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="font-bold uppercase text-xs text-slate-900 border-l border-gray-200">Producto o servicios</TableHead>
                                        <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Cantidad</TableHead>
                                        <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Precio</TableHead>
                                        <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Descuento</TableHead>
                                        <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Impuesto</TableHead>
                                        <TableHead className="font-bold uppercase text-xs text-slate-900 text-right border-r border-gray-200">Subtotal</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {addedLines.map((line) => {
                                        const qty = Number(line.quantity) || 0;
                                        const baseAmount = qty * line.price;
                                        const discVal = Number(line.discount.value) || 0;
                                        const discountAmount = line.discount.type === '%' ? (baseAmount * discVal) / 100 : discVal;
                                        const itemSubtotal = baseAmount - discountAmount;
                                        const taxBase = itemSubtotal;

                                        let taxesAmount = 0;
                                        if (line.taxes && line.taxes.length > 0) {
                                            line.taxes.forEach((t: any) => {
                                                taxesAmount += (taxBase * Number(t.percent || t.rate || 0)) / 100;
                                            });
                                        }
                                        const displayTotal = taxBase + taxesAmount;

                                        const productOptions = availableProducts.map((p: any) => ({
                                            value: String(p._lineId),
                                            label: p.item_snapshot?.name || p.item?.name || p.name || p.description || 'Producto',
                                        }));

                                        const selectedProductValue = line.invoiceLineId != null ? String(line.invoiceLineId) : '';

                                        return (
                                            <tr key={line.uid} className="hover:bg-slate-50/50 transition-colors border-0 border-b-0">
                                                <td className="px-4 py-4">
                                                    <SearchableSelect
                                                        value={selectedProductValue}
                                                        onValueChange={(val) => handleLineProductChange(line.uid, val)}
                                                        options={productOptions}
                                                        placeholder="Seleccionar producto"
                                                        emptyMessage="No hay productos disponibles"
                                                        className={cn(baseInput, "w-full rounded-md", !line.productId && "border-red-400")}
                                                    />
                                                </td>

                                                <td className="px-4 py-4 text-center">
                                                    <input type="text" inputMode="numeric" value={line.quantity} onChange={(e) => {
                                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                                        setAddedLines(prev => prev.map(l => l.uid === line.uid ? { ...l, quantity: val } : l));
                                                    }} className="w-full h-[34px] px-3 text-center border rounded-md outline-none focus:border-primary" />
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <input type="text" inputMode="numeric" value={line.price || ''} onChange={(e) => {
                                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                                        setAddedLines(prev => prev.map(l => l.uid === line.uid ? { ...l, price: Number(val) } : l));
                                                    }} className="w-full h-[34px] px-3 text-right border rounded-md outline-none focus:border-primary" />
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex border rounded-md h-[34px] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40">
                                                        <PercentCurrencyToggle
                                                            variant="inline"
                                                            value={line.discount.type}
                                                            onValueChange={(type) => {
                                                                setAddedLines(prev => prev.map(l => l.uid === line.uid ? { ...l, discount: { ...l.discount, type } } : l));
                                                            }}
                                                        />
                                                        <input type="text" inputMode="numeric" value={line.discount.value} onChange={(e) => {
                                                            let valNum = Number(e.target.value.replace(/[^0-9]/g, ''));
                                                            if (line.discount.type === '%' && valNum > 100) {
                                                                showToast("El porcentaje de descuento no puede ser mayor al 100%", "warning");
                                                                valNum = 0;
                                                            }
                                                            const val = String(valNum);
                                                            setAddedLines(prev => prev.map(l => l.uid === line.uid ? { ...l, discount: { ...l.discount, value: val } } : l));
                                                        }} className="flex-1 w-full px-2 outline-none text-right" placeholder="0" />
                                                    </div>
                                                </td>

                                                {/* Impuesto */}
                                                <td className="px-4 py-4 text-center">
                                                    <SearchableSelect
                                                        value={line.taxes && line.taxes.length > 0 ? (line.taxes[0].tax_rate_id || line.taxes[0].id || "0").toString() : "0"}
                                                        onValueChange={(val) => {
                                                            if (val === "0") {
                                                                setAddedLines(prev => prev.map(l => l.uid === line.uid ? { ...l, taxes: [] } : l));
                                                            } else {
                                                                const tax = catalogData.taxes?.find((t: any) => t.id.toString() === val);
                                                                if (tax) {
                                                                    setAddedLines(prev => prev.map(l => l.uid === line.uid ? {
                                                                        ...l, taxes: [{
                                                                            id: tax.id,
                                                                            tax_rate_id: tax.id,
                                                                            tax_id: tax.tax_id,
                                                                            name: tax.name,
                                                                            rate: parseFloat(tax.rate || tax.percentage || "0"),
                                                                            percent: parseFloat(tax.rate || tax.percentage || "0"),
                                                                            type: tax.type || 'percentage',
                                                                        }]
                                                                    } : l));
                                                                }
                                                            }
                                                        }}
                                                        options={[
                                                            { value: "0", label: "Sin impuesto" },
                                                            ...(catalogData.taxes || []).map((tax: any) => ({
                                                                value: tax.id.toString(),
                                                                label: `${tax.name} (${parseFloat(tax.rate || tax.percentage || "0")}%)`
                                                            }))
                                                        ]}
                                                        placeholder="Sin impuesto"
                                                        searchPlaceholder="Buscar impuesto..."
                                                        emptyMessage="No se encontraron impuestos"
                                                        className={cn(baseInput, "w-[160px] rounded-md mx-auto")}
                                                    />
                                                </td>

                                                <td className="px-4 py-4 text-right text-slate-600 font-medium">
                                                    {formatCurrency(displayTotal)}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <button type="button" onClick={() => removeLine(line.uid)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded cursor-pointer transition-colors" title="Eliminar línea">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            <div className="mt-4 px-4">
                                <button
                                    type="button"
                                    onClick={addLine}
                                    className="flex items-center gap-1 text-sm font-medium text-primary hover:bg-slate-200 cursor-pointer rounded transition-colors py-2 px-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar línea
                                </button>
                            </div>
                            {errors.lineas && (
                                <p className="flex items-center gap-1 text-xs text-red-500 mt-1 px-4 pb-4">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.lineas}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Propinas */}
                    {selectedInvoice.invoiceId && (
                        <div className="mb-8 border-b border-slate-100 pb-8">
                            <h3 className="text-sm font-bold text-slate-800 mb-4">Propinas</h3>
                            <div className="space-y-3">
                                {tips.map((t) => (
                                    <div key={t.uid} className="flex justify-between items-center text-sm bg-slate-50 border border-slate-100 rounded-lg px-4 py-2">
                                        <div>
                                            <span className="text-slate-600 font-medium">{t.reason}</span>
                                            <span className="text-xs text-slate-400 ml-2">({t.type === '%' ? `${t.value}%` : formatCurrency(t.value)})</span>
                                        </div>
                                        <button type="button" onClick={() => removeTip(t.uid)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Eliminar">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                    <input type="text" value={newTipReason} onChange={e => setNewTipReason(e.target.value)} placeholder="Motivo" className="flex-1 text-sm h-9 px-3 border rounded-md outline-none focus:border-primary w-full sm:w-auto" />
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <PercentCurrencyToggle value={newTipType} onValueChange={(v) => { setNewTipType(v); setNewTipValue(''); }} />
                                        <input type="text" inputMode="numeric" value={newTipValue} onChange={e => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            if (newTipType === '%' && Number(val) > 100) {
                                                showToast("El porcentaje no puede ser mayor al 100%", "warning");
                                                return;
                                            }
                                            setNewTipValue(val);
                                        }} placeholder="Valor" className="w-28 text-sm h-9 px-3 border rounded-md outline-none focus:border-primary" />
                                    </div>
                                    <button type="button" onClick={addTip} className="text-sm px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1">
                                        <Plus className="w-4 h-4" /> Agregar propina
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resumen & Totales */}
                    {selectedInvoice.invoiceId && (
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 pt-6 border-t border-slate-100">
                            <div className="w-full lg:w-1/2 space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Razón <span className="text-primary">*</span></label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => { setReason(e.target.value); setReasonTouched(true); }}
                                        placeholder="Describe el motivo de la nota de débito..."
                                        className={cn("w-full h-24 p-3 text-sm border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none resize-none transition-colors", errors.razon ? "border-red-400" : "border-slate-200")}
                                    />
                                    {errors.razon && (
                                        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                            {errors.razon}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Notas (Opcional)</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Información visible para el cliente."
                                        className="w-full h-24 p-3 text-sm border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none resize-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="w-full lg:w-[350px] space-y-4">
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-200/60 uppercase tracking-wide">Totales de la nota débito</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Subtotal</span>
                                            <span className="font-medium text-slate-700">{formatCurrency(dnSubtotal)}</span>
                                        </div>
                                        {lineDiscountsTotal > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Descuento</span>
                                                <span className="font-medium text-red-500">-{formatCurrency(lineDiscountsTotal)}</span>
                                            </div>
                                        )}
                                        {Object.values(dnTaxesMap).map((tax, idx) => (
                                            <div className="flex justify-between text-sm" key={idx}>
                                                <span className="text-slate-500">IVA ({tax.name} {tax.percent}%)</span>
                                                <span className="font-medium text-slate-700">{formatCurrency(tax.amount)}</span>
                                            </div>
                                        ))}
                                        {tipsTotal > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Propinas</span>
                                                <span className="font-medium text-slate-700">{formatCurrency(tipsTotal)}</span>
                                            </div>
                                        )}
                                        <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between items-center">
                                            <span className="text-base font-bold text-slate-800">Total</span>
                                            <span className="text-xl font-bold text-slate-800">{formatCurrency(dnTotal)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Información de pago */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">Información de pago</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Método de pago <span className="text-primary">*</span>
                                </label>
                                <SearchableSelect
                                    value={paymentMethodId}
                                    onValueChange={(v) => { setPaymentMethodId(v); setErrors(prev => ({ ...prev, metodoPago: undefined })); }}
                                    options={paymentMethodOptions}
                                    placeholder="Seleccionar método de pago"
                                    searchPlaceholder="Buscar..."
                                    emptyMessage="No se encontraron métodos de pago."
                                    className={cn(baseInput, "w-full rounded-md", errors.metodoPago && "border-red-400")}
                                />
                                {errors.metodoPago && (
                                    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                        {errors.metodoPago}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <CommentsAndReminders
                    comments={comments}
                    setComments={setComments}
                    requiresSaveFirst={true}
                />
            </div>

            <div className="sticky bottom-0 z-30 pt-6">
            <div className="bg-white border border-border rounded-xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-4 sm:p-6 flex flex-wrap justify-end gap-3">
                <button
                    type="button"
                    className="cursor-pointer px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    onClick={() => {
                        if (isDirty) {
                            setShowExitModal(true);
                        } else {
                            router.push("/expenses/debit-notes");
                        }
                    }}
                >
                    Cancelar
                </button>

                <div className="inline-flex">
                    <button
                        type="button"
                        onClick={() => handleSaveAction('send')}
                        disabled={!isFormValid || isSubmitting}
                        className={cn(
                            menuBtnClass,
                            "rounded-r-none",
                            (isFormValid && !isSubmitting)
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "bg-primary/40 text-primary-foreground cursor-not-allowed"
                        )}
                    >
                        {isSubmitting && submittingMode === 'send' ? "Guardando..." : "Guardar"}
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                disabled={!isFormValid || isSubmitting}
                                className={cn(
                                    "cursor-pointer px-2 py-2.5 rounded-r-lg border-l border-white/20 transition-colors",
                                    (isFormValid && !isSubmitting)
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "bg-primary/40 text-primary-foreground cursor-not-allowed"
                                )}
                            >
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white text-slate-700">
                            <DropdownMenuItem
                                className="cursor-pointer hover:bg-slate-50"
                                disabled={!isFormValid || isSubmitting}
                                onClick={() => handleSaveAction('draft')}
                            >
                                Guardar como borrador
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer hover:bg-slate-50"
                                disabled={!isFormValid || isSubmitting}
                                onClick={() => handleSaveAction('send')}
                            >
                                Guardar y ver factura
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer hover:bg-slate-50"
                                disabled={!isFormValid || isSubmitting}
                                onClick={() => handleSaveAction('print')}
                            >
                                Guardar e imprimir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            </div>

            {/* Numeration Modal */}
            <Dialog open={isNumerationModalOpen} onOpenChange={setIsNumerationModalOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-xl shadow-lg bg-white">
                    <DialogHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
                        <DialogTitle className="text-base font-semibold text-slate-800">Cambiar numeración</DialogTitle>
                    </DialogHeader>

                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <ChangeClientModal
                isOpen={!!pendingClientId}
                onClose={() => setPendingClientId(null)}
                onConfirm={confirmClientChange}
            />

            <ExitFormModal
                isOpen={showExitModal}
                onClose={() => {
                    setShowExitModal(false);
                    setPendingUrl(null);
                }}
                onConfirm={() => {
                    if (pendingUrl) {
                        router.push(pendingUrl);
                    } else {
                        router.push("/expenses/debit-notes");
                    }
                }}
            />
        </div>
    );
}
