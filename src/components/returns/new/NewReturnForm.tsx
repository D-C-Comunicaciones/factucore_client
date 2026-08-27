"use client";

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { HelpCircle, Edit2, AlertCircle, Plus, Trash2, X, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { cn } from '@/lib/utils';
import { AuthService } from '@/lib/auth';
import { ContactsService } from '@/lib/contacts';
import { CreditNotesService } from '@/lib/creditNotes';
import { InvoicesService } from '@/lib/invoices';
import { useResolutions } from '@/hooks/useResolutions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { showToast } from '@/components/sonner/CustomToaster';
import { DatePickerSimple } from '@/components/ui/DatePickerSimple';
import { ChangeTypeModal } from '../modals/ChangeTypeModal';
import { ChangeClientModal } from '../modals/ChangeClientModal';
import { ExitFormModal } from '../modals/ExitFormModal';

type FieldError = {
    cliente?: string;
    tipoNota?: string;
    facturas?: string;
    lineas?: string;
};

interface SelectedInvoice {
    uid: string;
    invoiceId: string;
    details: any | null;
}

interface AddedLine {
    uid: string;
    invoiceId: string;
    productId: string;
    name: string;
    maxQuantity: number;
    price: number;
    taxes: any[];
    discounts: any[];
    charges: any[];
    // user inputs
    quantity: string;
    newPrice?: string;
    discount: { type: '%' | '$', value: string };
    invoiceLineId?: number | string;
}

const createEmptyLine = (): AddedLine => ({
    uid: crypto.randomUUID(), invoiceId: '', productId: '', name: '', maxQuantity: 0, price: 0, taxes: [], discounts: [], charges: [], quantity: '', newPrice: '', discount: { type: '%', value: '0' }
});

export function NewReturnForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialClientId = searchParams?.get('clientId');
    const initialInvoiceId = searchParams?.get('invoiceId');
    const [hasInitializedInvoice, setHasInitializedInvoice] = useState(false);

    const [docType, setDocType] = useState('nota-credito');
    const [pendingDocType, setPendingDocType] = useState<string | null>(null);

    // Form state
    const [clientId, setClientId] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());

    // Invoices state
    const [selectedInvoices, setSelectedInvoices] = useState<SelectedInvoice[]>([
        { uid: crypto.randomUUID(), invoiceId: '', details: null }
    ]);

    // Lines state
    const [addedLines, setAddedLines] = useState<AddedLine[]>([
        createEmptyLine()
    ]);
    const [globalDiscountPopoverOpen, setGlobalDiscountPopoverOpen] = useState(false);
    const [globalDiscount, setGlobalDiscount] = useState<{ type: '%' | '$', value: string }>({ type: '%', value: '0' });
    const [globalDiscounts, setGlobalDiscounts] = useState<any[]>([]);
    const [globalSurcharges, setGlobalSurcharges] = useState<any[]>([]);
    const [newGlobalDiscounts, setNewGlobalDiscounts] = useState<{ reason: string, type: '%' | '$', value: string }[]>([]);

    // Form state for adding new global discounts in Type 3
    const [newDiscountReason, setNewDiscountReason] = useState('');
    const [newDiscountType, setNewDiscountType] = useState<'%' | '$'>('%');
    const [newDiscountValue, setNewDiscountValue] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<FieldError>({});

    const [pendingType, setPendingType] = useState<string | null>(null);
    const [pendingClientId, setPendingClientId] = useState<string | null>(null);
    const [showExitModal, setShowExitModal] = useState(false);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);

    const hasDataEntered = selectedInvoices.some(i => i.invoiceId !== '') || addedLines.some(l => l.productId !== '') || addedLines.some(l => Number(l.quantity) > 0);

    const isDirty = selectedType !== '' || selectedInvoices.some(i => i.invoiceId !== '') || clientId !== '';

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

    const handleDocTypeChange = (newDocType: string) => {
        if (newDocType === docType) return;
        if (hasDataEntered) {
            setPendingDocType(newDocType);
        } else {
            setDocType(newDocType);
            setSelectedType('');
            setClientId('');
        }
    };

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
        if (val === selectedType) return;
        if (selectedType && hasDataEntered) {
            setPendingType(val);
        } else {
            setSelectedType(val);
            setErrors(prev => ({ ...prev, tipoNota: undefined }));
        }
    };

    const confirmTypeChange = () => {
        if (pendingType) {
            setSelectedType(pendingType);
            setErrors(prev => ({ ...prev, tipoNota: undefined }));
            if (pendingType === '5') {
                setAddedLines([{ uid: crypto.randomUUID(), invoiceId: selectedInvoices[0]?.invoiceId || '', productId: '', name: '', maxQuantity: 0, price: 0, taxes: [], discounts: [], charges: [], quantity: '', discount: { type: '%', value: '0' } }]);
            }
        }
        setPendingType(null);
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

    useEffect(() => {
        if (!clientId) {
            setInvoiceOptions([]);
            setSelectedInvoices([{ uid: crypto.randomUUID(), invoiceId: '', details: null }]);
            setAddedLines([createEmptyLine()]);
            return;
        }
        const loadInvoices = async () => {
            setLoadingInvoices(true);
            setSelectedInvoices([{ uid: crypto.randomUUID(), invoiceId: '', details: null }]);
            setAddedLines([createEmptyLine()]);
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

    const { resolutions, refetch: refetchResolutions, isLoading: isLoadingResolutions } = useResolutions({ type_resolution: 3, is_active: true });

    // Auto-populate lines for non-Otros types
    useEffect(() => {
        if (selectedType !== '5' && selectedInvoices.length > 0 && selectedInvoices[0].details) {
            const details = selectedInvoices[0].details;
            const lines = details.lines || details.items || [];

            const newAddedLines = lines.map((item: any, idx: number) => {
                const qty = Number(item.quantity || 1);
                const price = Number(item.price_amount || item.price || 0);

                // Find discounts and charges associated with this line
                // discounts with charge_indicator=true are CHARGES duplicated in discounts array — skip them
                const lineDiscounts = item.discounts?.filter((d: any) => !d.charge_indicator) || [];
                // line charges
                const lineCharges = item.charges || [];

                return {
                    uid: crypto.randomUUID(),
                    invoiceId: selectedInvoices[0].invoiceId,
                    productId: item.item_id || item.product_id || '',
                    name: item.item_snapshot?.name || item.item?.name || item.name || item.description || "Producto",
                    maxQuantity: qty,
                    price: price,
                    taxes: JSON.parse(JSON.stringify(item.taxes || [])),
                    discounts: JSON.parse(JSON.stringify(lineDiscounts)),
                    charges: JSON.parse(JSON.stringify(lineCharges)),
                    quantity: (selectedType === '2' || selectedType === '3' || selectedType === '6' || selectedType === '7') ? qty.toString() : '',
                    newPrice: '',
                    discount: { type: '%', value: '0' },
                    invoiceLineId: item.id || idx
                };
            });

            setAddedLines(newAddedLines.length > 0 ? newAddedLines : [createEmptyLine()]);

            const allDiscounts = details.discounts || [];
            const allCharges = details.charges || [];

            // Global discounts: charge_indicator=false AND invoice_line_id is null
            const globDiscounts = allDiscounts.filter((d: any) =>
                !d.charge_indicator && !d.invoice_line_id
            );
            // Global charges: charges with no line_id (scope=global)
            const globCharges = allCharges.filter((c: any) => !c.line_id);

            setGlobalDiscounts(JSON.parse(JSON.stringify(globDiscounts)));
            setGlobalSurcharges(JSON.parse(JSON.stringify(globCharges)));
        }
    }, [selectedType, selectedInvoices[0]?.details]);

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

    const handleInvoiceSelectAttempt = () => {
        if (!selectedType) {
            setErrors(prev => ({ ...prev, tipoNota: 'Debes seleccionar un tipo de nota crédito' }));
        }
    };

    const handleInvoiceChange = async (uid: string, invoiceId: string) => {
        if (!invoiceId) {
            setSelectedInvoices(prev => prev.map(inv => inv.uid === uid ? { ...inv, invoiceId, details: null } : inv));
            return;
        }

        try {
            const res = await InvoicesService.getById(invoiceId);
            const data = res?.data || res;
            const invoiceData = (data as any)?.invoice || (data as any)?.data?.invoice || data;

            setSelectedInvoices(prev => prev.map(inv => inv.uid === uid ? { ...inv, invoiceId, details: invoiceData } : inv));
        } catch (e) {
            console.error("Error al cargar detalles de la factura:", e);
        }
    };

    useEffect(() => {
        if (initialInvoiceId && invoiceOptions.length > 0 && !hasInitializedInvoice) {
            setHasInitializedInvoice(true);
            const uid = selectedInvoices[0]?.uid;
            if (uid && selectedInvoices[0].invoiceId !== initialInvoiceId) {
                handleInvoiceChange(uid, initialInvoiceId);
            }
        }
    }, [initialInvoiceId, invoiceOptions, hasInitializedInvoice, selectedInvoices]);

    const addInvoice = () => {
        setSelectedInvoices([...selectedInvoices, { uid: crypto.randomUUID(), invoiceId: '', details: null }]);
    };

    const removeInvoice = (uid: string) => {
        if (selectedInvoices.length <= 1) return;
        setSelectedInvoices(prev => prev.filter(inv => inv.uid !== uid));

        // Also remove any lines that belonged to this invoice
        const removedInvoice = selectedInvoices.find(inv => inv.uid === uid);
        if (removedInvoice && removedInvoice.invoiceId) {
            setAddedLines(prev => prev.filter(line => line.invoiceId !== removedInvoice.invoiceId));
            // Ensure at least 1 line exists
            setAddedLines(prev => prev.length === 0 ? [createEmptyLine()] : prev);
        }
    };

    // Calculate available products from ALL selected invoices
    const availableProducts = useMemo(() => {
        const products: any[] = [];
        selectedInvoices.forEach(inv => {
            if (inv.details) {
                const lines = inv.details.lines || inv.details.items || [];
                lines.forEach((line: any, idx: number) => {
                    const lineId = line.id || `${inv.invoiceId}-${idx}`;
                    products.push({
                        ...line,
                        _lineId: lineId, // unique within invoice
                        _invoiceId: inv.invoiceId,
                        _invoiceNumber: inv.details.number || (inv.details.prefix ? `${inv.details.prefix}${inv.details.number}` : inv.invoiceId)
                    });
                });
            }
        });
        return products;
    }, [selectedInvoices]);

    const addLine = () => {
        setAddedLines([...addedLines, createEmptyLine()]);
    };

    const removeLine = (uid: string) => {
        if (addedLines.length <= 1) return;
        setAddedLines(prev => prev.filter(l => l.uid !== uid));
    };

    const handleLineProductChange = (uid: string, value: string) => {
        const [invoiceId, lineId] = value.split('___');
        const prod = availableProducts.find(p => p._invoiceId === invoiceId && p._lineId.toString() === lineId);

        if (prod) {
            setAddedLines(prev => prev.map(l => {
                if (l.uid === uid) {
                    const price = Number(prod.price_amount || prod.price || 0);
                    const qty = Number(prod.quantity || 1);
                    // discounts with charge_indicator=true are CHARGES duplicated — skip them
                    const lineDiscounts = prod.discounts?.filter((d: any) => !d.charge_indicator) || [];
                    const lineCharges = prod.charges || [];

                    return {
                        ...l,
                        invoiceId: prod._invoiceId,
                        productId: prod.item_id || prod.product_id || '',
                        name: prod.item_snapshot?.name || prod.item?.name || prod.name || prod.description || "Producto",
                        maxQuantity: qty,
                        price: price,
                        taxes: JSON.parse(JSON.stringify(prod.taxes || [])),
                        discounts: JSON.parse(JSON.stringify(lineDiscounts)),
                        charges: JSON.parse(JSON.stringify(lineCharges)),
                        quantity: (selectedType === '2' || selectedType === '3' || selectedType === '6' || selectedType === '7') ? qty.toString() : '',
                        newPrice: '',
                        discount: { type: '%', value: '0' },
                        invoiceLineId: prod.id || Number(lineId.replace(`${invoiceId}-`, ''))
                    };
                }
                return l;
            }));
        }
    };

    const handleSave = async () => {
        const newErrors: FieldError = {};
        if (!clientId) newErrors.cliente = 'El cliente es obligatorio';
        if (!selectedType) newErrors.tipoNota = 'El tipo de nota crédito es obligatorio';

        const validInvoices = selectedInvoices.filter(i => i.invoiceId);
        if (validInvoices.length === 0) newErrors.facturas = 'Al menos una factura de venta asociada es obligatoria';

        const validLines = addedLines.filter(l => l.invoiceId);
        if (validLines.length === 0) newErrors.lineas = 'Debe agregar al menos una línea válida';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        if (rawReturnTotal < 0) {
            showToast("El total del documento no puede ser un valor negativo", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            // Build customer object from selected invoice details
            const firstInvoiceDetails = validInvoices[0]?.details;
            const customerRaw = firstInvoiceDetails?.customer || firstInvoiceDetails?.contact || null;
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

            const commonData = {
                resolution_id: selectedResolution ? Number(selectedResolution) : null,
                type_credit_note_id: Number(selectedType),
                type_operation_credit_note_id: 1,
                customer: customerObj,
                date: date.toISOString().split('T')[0],
                type_currency_id: 35,
                send_mail: true,
                observation: reason,
                note: notes,
            };

            let hasTaxErrors = false;

            const mapLineForPayload = (l: any) => {
                let effectiveQty = Number(l.quantity || 0);
                let effectivePrice = Number(l.price || 0);
                let effectiveDescription = l.name || 'Ítem';

                let effectiveTaxes = l.taxes || [];
                let effectiveDiscounts = l.discounts || [];
                let effectiveCharges = l.charges || [];

                if (selectedType === '3' || selectedType === '6' || selectedType === '7') {
                    // Treat as price reduction or global item
                    const soldSubtotal = l.maxQuantity * l.price;
                    effectiveQty = 1;
                    effectivePrice = soldSubtotal; // Needs proper calc based on how discounts are reduced
                    if (selectedType === '3') effectiveDescription = 'Descuento comercial (' + l.name + ')';
                    if (selectedType === '6') effectiveDescription = 'Descuento por pronto pago (' + l.name + ')';
                    if (selectedType === '7') effectiveDescription = 'Descuento por volumen de ventas (' + l.name + ')';
                    // clear discounts/charges for these types
                    effectiveDiscounts = [];
                    effectiveCharges = [];
                } else if (selectedType === '4') {
                    const newP = Number(l.newPrice || 0);
                    let diff = l.price - newP;
                    if (diff < 0) diff = 0;

                    effectiveQty = l.maxQuantity;
                    effectivePrice = diff;
                    effectiveDescription = 'Ajuste de precio: ' + l.name;
                    effectiveDiscounts = [];
                    effectiveCharges = [];
                }

                const invoiceDetails = validInvoices.find(i => i.invoiceId === l.invoiceId)?.details;
                const snapshotTaxTotals = invoiceDetails?.invoice_snapshot?.template_data?.taxTotals || [];

                const mappedTaxes = effectiveTaxes.map((t: any) => {
                    const percent = Number(t.percent || t.rate || 0);
                    const taxCodeToMatch = t.tax_code || String(t.tax_id || '');
                    const fallbackName = snapshotTaxTotals.find((st: any) => st.tax_code === taxCodeToMatch)?.tax_name || '';
                    const resolvedName = t.name || t.tax?.name || t.tax_name || fallbackName || '';
                    if (!resolvedName) {
                        hasTaxErrors = true;
                    }
                    return {
                        tax_id: t.tax_id || t.id,
                        type: t.type || 'percentage',
                        rate: percent,
                        tax_code: taxCodeToMatch,
                        name: resolvedName,
                        percent: percent
                    };
                });

                return {
                    description: effectiveDescription,
                    quantity: effectiveQty,
                    price: effectivePrice,
                    item_snapshot: {
                        id: l.productId,
                        name: l.name,
                    },
                    taxes: mappedTaxes,
                    discounts: effectiveDiscounts,
                    charges: effectiveCharges,
                };
            };

            let payload: any;

            const globalPayloadData = {
                global_discounts: globalDiscounts,
                global_charges: globalSurcharges
            };

            if (selectedType === '5') {
                const creditNotes = validInvoices.map(inv => {
                    const invoiceLines = validLines.filter(l => l.invoiceId === inv.invoiceId);
                    return {
                        ...commonData,
                        ...globalPayloadData,
                        invoice_id: Number(inv.invoiceId),
                        lines: invoiceLines.map(mapLineForPayload),
                    };
                }).filter(cn => cn.lines.length > 0);

                payload = { credit_notes: creditNotes };
            } else {
                const firstInvoiceId = validInvoices.length > 0 ? Number(validInvoices[0].invoiceId) : null;

                if (selectedType === '2') {
                    // Para tipo 2 (Anulación de factura) se envía un payload simplificado
                    const { customer, ...commonDataWithoutCustomer } = commonData;
                    payload = {
                        ...commonDataWithoutCustomer,
                        invoice_id: firstInvoiceId,
                    };
                } else if (['3', '6', '7'].includes(selectedType)) {
                    // Para tipos 3, 6 y 7 solo enviamos nuevos ajustes de descuentos
                    const payloadLines = validLines.filter(l => Number(l.discount.value) > 0).map(l => ({
                        invoice_line_id: l.invoiceLineId,
                        discount: {
                            type: l.discount.type === '%' ? 'percentage' : 'fixed',
                            value: Number(l.discount.value)
                        }
                    }));
                    payload = {
                        ...commonData,
                        invoice_id: firstInvoiceId,
                        lines: payloadLines,
                        global_discounts: newGlobalDiscounts.map(d => ({
                            reason: d.reason,
                            type: d.type === '%' ? 'percentage' : 'fixed',
                            value: Number(d.value)
                        }))
                    };
                } else {
                    payload = {
                        ...commonData,
                        ...globalPayloadData,
                        invoice_id: firstInvoiceId,
                        lines: validLines.map(mapLineForPayload),
                    };
                }
            }

            if (selectedType !== '2' && hasTaxErrors) {
                setErrors((prev: any) => ({ ...prev, lineas: 'Todos los impuestos en las líneas de la factura original deben tener un nombre válido para poder emitir la nota.' }));
                setIsSubmitting(false);
                return;
            }

            const response = await CreditNotesService.send(payload);
            showToast("Nota crédito guardada y enviada correctamente", "success", "Éxito");

            // Si retorna una sola nota crédito, ir al detalle. Si retorna arreglo (batch), ir a lista general
            const singleNote = response?.credit_note || response?.creditNote || response?.data?.credit_note;
            if (singleNote && !Array.isArray(singleNote) && singleNote.id) {
                router.push(`/returns/${singleNote.id}`);
            } else {
                router.push("/returns");
            }
        } catch (error: any) {
            console.error("Error guardando nota de crédito:", error);
            showToast(error?.response?.data?.message || error?.message || "Ocurrió un error al guardar la nota crédito", "error", "Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = !!clientId && !!selectedType && selectedInvoices.some(i => i.invoiceId);

    // Calc totals
    let returnSubtotal = 0;
    let lineDiscountsTotal = 0;
    const returnTaxesMap: Record<string, { amount: number, name: string, percent: string }> = {};

    addedLines.forEach((item) => {
        if (!item.invoiceId) return;

        let itemSubtotal = 0;
        let taxBase = 0;
        let discountAmount = 0;

        if (selectedType === '5') {
            const qty = Number(item.quantity) || 0;
            itemSubtotal = qty * item.price;
            const discountVal = Number(item.discount?.value) || 0;
            discountAmount = item.discount?.type === '%' ? (itemSubtotal * discountVal) / 100 : discountVal;
            taxBase = itemSubtotal - discountAmount;
        } else {
            const soldSubtotal = item.maxQuantity * item.price;

            if (selectedType === '1' || selectedType === '2') {
                const qty = Number(item.quantity) || 0;
                itemSubtotal = qty * item.price; // Gross Subtotal
                if (item.discounts && item.discounts.length > 0) {
                    const originalDiscount = item.discounts.reduce((sum: number, d: any) => sum + Number(d.amount || 0), 0);
                    discountAmount = item.maxQuantity > 0 ? (originalDiscount / item.maxQuantity) * qty : 0;
                } else {
                    discountAmount = 0;
                }
                taxBase = itemSubtotal - discountAmount;
            } else if (selectedType === '3' || selectedType === '6' || selectedType === '7') {
                const discVal = Number(item.discount.value) || 0;
                discountAmount = item.discount.type === '%' ? (soldSubtotal * discVal) / 100 : discVal;
                itemSubtotal = discountAmount;
                taxBase = itemSubtotal;
                discountAmount = 0;
            } else if (selectedType === '4') {
                const newP = Number(item.newPrice || 0);
                itemSubtotal = (item.price - newP) * item.maxQuantity;
                if (itemSubtotal < 0) itemSubtotal = 0;
                taxBase = itemSubtotal;
            }
        }

        returnSubtotal += itemSubtotal;
        lineDiscountsTotal += discountAmount;

        if (item.taxes && item.taxes.length > 0) {
            item.taxes.forEach((t: any) => {
                const percent = Number(t.percent || t.rate || 0);
                const taxAmount = (taxBase * percent) / 100;
                const key = `${t.name}-${percent}`;
                if (!returnTaxesMap[key]) {
                    returnTaxesMap[key] = { amount: 0, name: t.name, percent: Number(percent).toString() };
                }
                returnTaxesMap[key].amount += taxAmount;
            });
        }
    });

    let globalDiscountsTotal = 0;
    if (!['3', '6', '7'].includes(selectedType)) {
        globalDiscounts.forEach(d => {
            globalDiscountsTotal += Number(d.calculated_amount || d.amount || d.value || 0);
        });
    }

    let globalSurchargesTotal = 0;
    if (!['3', '6', '7'].includes(selectedType)) {
        globalSurcharges.forEach(s => {
            globalSurchargesTotal += Number(s.calculated_amount || s.amount || s.value || 0);
        });
    }

    let newGlobalDiscountsTotal = 0;
    let originalInvoiceSubtotal = 0;
    if (['3', '6', '7'].includes(selectedType)) {
        addedLines.forEach(item => {
            originalInvoiceSubtotal += item.maxQuantity * item.price;
        });

        newGlobalDiscounts.forEach(d => {
            const val = Number(d.value) || 0;
            if (d.type === '%') {
                newGlobalDiscountsTotal += (originalInvoiceSubtotal * val) / 100;
            } else {
                newGlobalDiscountsTotal += val;
            }
        });
    }

    const taxesTotal = Object.values(returnTaxesMap).reduce((sum, t) => sum + t.amount, 0);
    const rawReturnTotal = ['3', '6', '7'].includes(selectedType)
        ? returnSubtotal + newGlobalDiscountsTotal + taxesTotal
        : returnSubtotal - lineDiscountsTotal - globalDiscountsTotal + globalSurchargesTotal + taxesTotal;
    const returnTotal = Math.max(0, rawReturnTotal);


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
                                onValueChange={handleClientChange}
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
                            </div>
                            <SearchableSelect
                                value={selectedType}
                                onValueChange={handleTypeChange}
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

                    {/* Facturas Asociadas */}
                    <div className="space-y-6 mb-8 border-b border-slate-100 pb-8">
                        {selectedInvoices.map((inv, index) => {
                            const details = inv.details;
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
                                <div key={inv.uid} className="relative flex flex-col gap-4 p-4 pr-12 border border-slate-100 rounded-lg bg-slate-50/50">
                                    {selectedInvoices.length > 1 && selectedType === '5' && (
                                        <button type="button" onClick={() => removeInvoice(inv.uid)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded cursor-pointer transition-colors" title="Eliminar factura">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div className={cn("grid gap-6", details ? "grid-cols-1 md:grid-cols-5" : "grid-cols-1 md:grid-cols-3")}>
                                        <div className={cn("space-y-2", details ? "md:col-span-1" : "md:col-span-1")}>
                                            <label className={cn("block text-sm font-medium", clientId ? "text-slate-700" : "text-slate-400")}>
                                                Factura de venta asociada <span className={clientId ? "text-primary" : "text-primary/50"}>*</span>
                                            </label>

                                            {!clientId ? (
                                                <div className={cn(baseInput, "w-full rounded-md opacity-50 cursor-not-allowed")} title="Selecciona un cliente primero">
                                                    <span className="text-slate-400 text-sm">Buscar</span>
                                                </div>
                                            ) : (
                                                <div onClick={() => { if (!selectedType) handleInvoiceSelectAttempt(); }}>
                                                    <SearchableSelect
                                                        value={inv.invoiceId}
                                                        onValueChange={(v) => {
                                                            if (!selectedType) {
                                                                handleInvoiceSelectAttempt();
                                                            }
                                                            handleInvoiceChange(inv.uid, v);
                                                            setErrors(prev => ({ ...prev, facturas: undefined }));
                                                        }}
                                                        options={invoiceOptions.filter(o => o.value === inv.invoiceId || !selectedInvoices.some(i => i.invoiceId === o.value))}
                                                        placeholder={loadingInvoices ? "Cargando..." : "Buscar factura"}
                                                        searchPlaceholder="Buscar.."
                                                        emptyMessage={loadingInvoices ? "Cargando..." : "No hay facturas."}
                                                        className={cn(baseInput, "w-full rounded-md", errors.facturas && "border-red-400")}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {details && selectedType && (
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
                        })}

                        {errors.facturas && (
                            <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                {errors.facturas}
                            </p>
                        )}

                        {selectedType === '5' && (
                            <div className="flex">
                                <button
                                    type="button"
                                    onClick={addInvoice}
                                    className="flex items-center gap-1 text-sm font-medium text-primary hover:bg-slate-200 cursor-pointer rounded transition-colors py-2 px-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar Factura
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Products Table */}
                    {selectedInvoices.some(i => i.invoiceId) && selectedType && (
                        <div className="mb-8 overflow-x-auto relative border-b border-gray-200">
                            <Table className="[&_td]:border-b-0">
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="font-bold uppercase text-xs text-slate-900 border-l border-gray-200">ITEM</TableHead>

                                        {(selectedType === '1' || selectedType === '2') && (
                                            <>
                                                <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Cant. original</TableHead>
                                                <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Cant. devuelta</TableHead>
                                            </>
                                        )}
                                        {['3', '6', '7'].includes(selectedType) && (
                                            <>
                                                <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Cant. original</TableHead>
                                                <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Subtotal unit.</TableHead>
                                            </>
                                        )}
                                        {selectedType === '4' && (
                                            <>
                                                <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Cant. original</TableHead>
                                                <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Precio original</TableHead>
                                                <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Precio nuevo</TableHead>
                                            </>
                                        )}
                                        {selectedType === '5' && (
                                            <>
                                                <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Cantidad</TableHead>
                                                <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Precio</TableHead>
                                            </>
                                        )}

                                        <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Descuento</TableHead>
                                        <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Impuesto</TableHead>

                                        <TableHead className="font-bold uppercase text-xs text-slate-900 text-right border-r border-gray-200">
                                            {selectedType === '5' ? 'Subtotal' : 'Monto devuelto'}
                                        </TableHead>
                                        {selectedType === '5' && <TableHead></TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {addedLines.map((line) => {
                                        let itemSubtotal = 0;
                                        let taxBase = 0;
                                        let discountAmount = 0;
                                        let displayTotal = 0;
                                        const soldSubtotal = line.maxQuantity * line.price;

                                        if (selectedType === '1' || selectedType === '2') {
                                            const qty = Number(line.quantity) || 0;
                                            const grossSubtotal = qty * line.price;
                                            if (line.discounts && line.discounts.length > 0) {
                                                const originalDiscount = line.discounts.reduce((sum: number, d: any) => sum + Number(d.amount || 0), 0);
                                                discountAmount = line.maxQuantity > 0 ? (originalDiscount / line.maxQuantity) * qty : 0;
                                            }
                                            taxBase = grossSubtotal - discountAmount;
                                            itemSubtotal = grossSubtotal;
                                        } else if (['3', '6', '7'].includes(selectedType)) {
                                            const discVal = Number(line.discount.value) || 0;
                                            discountAmount = line.discount.type === '%' ? (soldSubtotal * discVal) / 100 : discVal;
                                            itemSubtotal = discountAmount;
                                            taxBase = itemSubtotal;
                                            discountAmount = 0;
                                        } else if (selectedType === '4') {
                                            const newP = Number(line.newPrice || 0);
                                            itemSubtotal = (line.price - newP) * line.maxQuantity;
                                            if (itemSubtotal < 0) itemSubtotal = 0;
                                            taxBase = itemSubtotal;
                                        } else if (selectedType === '5') {
                                            const qty = Number(line.quantity) || 0;
                                            const baseAmount = qty * line.price;
                                            const discVal = Number(line.discount.value) || 0;
                                            discountAmount = line.discount.type === '%' ? (baseAmount * discVal) / 100 : discVal;
                                            itemSubtotal = baseAmount - discountAmount;
                                            taxBase = itemSubtotal;
                                        }

                                        let taxesAmount = 0;
                                        if (line.taxes && line.taxes.length > 0) {
                                            line.taxes.forEach((t: any) => {
                                                taxesAmount += (taxBase * Number(t.percent || t.rate || 0)) / 100;
                                            });
                                        }
                                        displayTotal = taxBase + taxesAmount;

                                        // Discount display calculation for read-only mode
                                        let discountPercentDisplay = 0;
                                        if (discountAmount > 0) {
                                            const qty = Number(line.quantity) || 1;
                                            const grossSubtotal = qty * line.price;
                                            if (line.discounts && line.discounts.length > 0 && line.discounts[0].percent) {
                                                discountPercentDisplay = Number(line.discounts[0].percent);
                                            } else if (grossSubtotal > 0) {
                                                discountPercentDisplay = (discountAmount / grossSubtotal) * 100;
                                            }
                                        }

                                        const productOptions = availableProducts
                                            .filter(p => !addedLines.some(l =>
                                                l.uid !== line.uid &&
                                                l.invoiceId === p._invoiceId &&
                                                l.productId === (p.item_id || p.product_id)
                                            ))
                                            .map(p => ({
                                                value: `${p._invoiceId}___${p._lineId}`,
                                                label: `${p._invoiceNumber} - ${p.item_snapshot?.name || p.item?.name || p.name || p.description || 'Producto'}`
                                            }));

                                        return (
                                            <tr key={line.uid} className="hover:bg-slate-50/50 transition-colors border-0 border-b-0">
                                                <td className="px-4 py-4">
                                                    {selectedType === '5' ? (
                                                        <SearchableSelect
                                                            value={line.invoiceId && line.productId ? `${line.invoiceId}___${availableProducts.find(p => p._invoiceId === line.invoiceId && (p.item_id || p.product_id) === line.productId)?._lineId}` : ''}
                                                            onValueChange={(val) => handleLineProductChange(line.uid, val)}
                                                            options={productOptions}
                                                            placeholder="Seleccionar producto"
                                                            emptyMessage="No hay productos disponibles"
                                                            className={cn(baseInput, "w-full rounded-md", !line.productId && "border-red-400")}
                                                        />
                                                    ) : (
                                                        <div className="w-full text-sm text-slate-700 truncate px-2" title={line.name}>
                                                            {line.name}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Variables columns depending on type */}
                                                {selectedType === '1' && (
                                                    <>
                                                        <td className="px-4 py-4 text-center text-slate-500">{line.maxQuantity}</td>
                                                        <td className="px-4 py-4 text-center">
                                                            <input type="text" inputMode="numeric" value={line.quantity} onChange={(e) => {
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                if (Number(val) > line.maxQuantity) {
                                                                    showToast('No puedes aplicar devolución a cantidades mayores a las facturadas.', 'error', 'Error');
                                                                    return;
                                                                }
                                                                setAddedLines(prev => prev.map(l => l.uid === line.uid ? { ...l, quantity: val } : l));
                                                            }} className={cn("w-full h-[34px] px-3 text-center border rounded-md outline-none focus:border-primary", (Number(line.quantity) > line.maxQuantity) && "border-red-500 text-red-500")} />
                                                        </td>
                                                    </>
                                                )}
                                                {selectedType === '2' && (
                                                    <>
                                                        <td className="px-4 py-4 text-center text-slate-500">{line.maxQuantity}</td>
                                                        <td className="px-4 py-4 text-center text-slate-600 font-medium">{line.maxQuantity}</td>
                                                    </>
                                                )}
                                                {['3', '6', '7'].includes(selectedType) && (
                                                    <>
                                                        <td className="px-4 py-4 text-center text-slate-500">{line.maxQuantity}</td>
                                                        <td className="px-4 py-4 text-center text-slate-500">{formatCurrency(line.price)}</td>
                                                    </>
                                                )}
                                                {selectedType === '4' && (
                                                    <>
                                                        <td className="px-4 py-4 text-center text-slate-500">{line.maxQuantity}</td>
                                                        <td className="px-4 py-4 text-center text-slate-500">{formatCurrency(line.price)}</td>
                                                        <td className="px-4 py-4 text-center">
                                                            <input type="text" inputMode="numeric" value={line.newPrice || ''} onChange={(e) => {
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                setAddedLines(prev => prev.map(l => l.uid === line.uid ? { ...l, newPrice: val } : l));
                                                            }} className="w-full h-[34px] px-3 text-right border rounded-md outline-none focus:border-primary" />
                                                        </td>
                                                    </>
                                                )}
                                                {selectedType === '5' && (
                                                    <>
                                                        <td className="px-4 py-4 text-center">
                                                            <input type="text" inputMode="numeric" value={line.quantity} onChange={(e) => {
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                if (line.maxQuantity > 0 && Number(val) > line.maxQuantity) {
                                                                    showToast('No puedes aplicar devolución a cantidades mayores a las facturadas.', 'error', 'Error');
                                                                    return;
                                                                }
                                                                setAddedLines(prev => prev.map(l => l.uid === line.uid ? { ...l, quantity: val } : l));
                                                            }} className={cn("w-full h-[34px] px-3 text-center border rounded-md outline-none focus:border-primary", (line.maxQuantity > 0 && Number(line.quantity) > line.maxQuantity) && "border-red-500 text-red-500")} />
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <input type="text" inputMode="numeric" value={line.price || ''} onChange={(e) => {
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                setAddedLines(prev => prev.map(l => l.uid === line.uid ? { ...l, price: Number(val) } : l));
                                                            }} className="w-full h-[34px] px-3 text-right border rounded-md outline-none focus:border-primary" />
                                                        </td>
                                                    </>
                                                )}

                                                <td className="px-4 py-4">
                                                    {['1', '2'].includes(selectedType) ? (
                                                        <div className="flex justify-center text-slate-600">
                                                            {discountAmount > 0 ? (
                                                                <div className="flex items-center gap-1 whitespace-nowrap">
                                                                    <span>{discountPercentDisplay % 1 !== 0 ? discountPercentDisplay.toFixed(2) : discountPercentDisplay}%</span>
                                                                    <span className="text-slate-500 text-xs">({formatCurrency(discountAmount)})</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-slate-400">-</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex border rounded-md h-[34px] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40">
                                                            <button type="button" disabled={selectedType === '2'} onClick={() => {
                                                                setAddedLines(prev => prev.map(l => l.uid === line.uid ? { ...l, discount: { ...l.discount, type: l.discount.type === '%' ? '$' : '%' } } : l));
                                                            }} className="px-2 border-r bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-medium w-8 text-center">{line.discount.type}</button>
                                                            <input type="text" inputMode="numeric" value={line.discount.value} disabled={selectedType === '2'} onChange={(e) => {
                                                                let valNum = Number(e.target.value.replace(/[^0-9]/g, ''));
                                                                if (line.discount.type === '%' && valNum > 100) {
                                                                    showToast("El porcentaje de descuento no puede ser mayor al 100%", "warning");
                                                                    valNum = 0;
                                                                } else if (line.discount.type === '$') {
                                                                    const lineBase = line.maxQuantity * line.price;
                                                                    if (lineBase > 0 && valNum > lineBase) {
                                                                        showToast("El valor digitado excede el valor total del ítem", "warning");
                                                                        valNum = 0;
                                                                    }
                                                                }
                                                                const val = String(valNum);
                                                                setAddedLines(prev => prev.map(l => l.uid === line.uid ? { ...l, discount: { ...l.discount, value: val } } : l));
                                                            }} className="flex-1 w-full px-2 outline-none text-right" placeholder="0" />
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Impuesto */}
                                                <td className="px-4 py-4 text-center">
                                                    {line.productId && (taxesAmount > 0 || (line.taxes && line.taxes.length > 0)) ? (
                                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap text-slate-600">
                                                            {line.taxes && line.taxes.length > 0 ? line.taxes.map((t: any, i: number) => (
                                                                <span key={i}>{t.name} {Number(t.percent || t.rate || 0)}%</span>
                                                            )) : <span>IVA 0%</span>}
                                                            <span className="text-slate-500 text-xs">({formatCurrency(taxesAmount)})</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-4 text-right text-slate-600 font-medium">
                                                    {formatCurrency(displayTotal)}
                                                </td>
                                                {selectedType === '5' && (
                                                    <td className="px-4 py-4 text-center">
                                                        {addedLines.length > 1 && (
                                                            <button type="button" onClick={() => removeLine(line.uid)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded cursor-pointer transition-colors" title="Eliminar línea">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            {selectedType === '5' && (
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
                            )}
                        </div>
                    )}

                    {/* Resumen & Totales */}
                    {selectedInvoices.some(i => i.invoiceId) && addedLines.length > 0 && (
                        <div className="flex justify-between items-start pt-6 border-t border-slate-100">
                            <div className="w-1/2 space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Razón / Motivo <span className="text-primary">*</span></label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Describe el motivo de la nota crédito..."
                                        className="w-full h-24 p-3 text-sm border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none resize-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Notas adicionales (Opcional)</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Información visible en la impresión del documento."
                                        className="w-full h-24 p-3 text-sm border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none resize-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="w-[350px] space-y-4">
                                {(globalDiscounts.length > 0 || globalSurcharges.length > 0) && (
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-200/60 uppercase tracking-wide">
                                            {['3', '6', '7'].includes(selectedType) ? 'Ajustes Globales Facturados' : 'Ajustes Globales'}
                                        </h3>
                                        <div className="space-y-4">
                                            {globalSurcharges.map((s, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wide">
                                                        <span>Cargos</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-600">Motivo: {s.reason || s.description || 'Propina'} <br /><span className="text-xs text-slate-400">Tipo: {(s.charge_type === 'percentage' || s.percentage_value || s.percent) ? `Porcentual (${Number(s.percentage_value || s.percent)}%)` : (s.type || 'Fijo')}</span></span>
                                                        {!['2', '3', '6', '7'].includes(selectedType) ? (
                                                            <div className="flex items-center">
                                                                <span className="mr-1 text-slate-500">$</span>
                                                                <input type="text" inputMode="numeric" value={s.calculated_amount || s.amount || s.value || 0} onChange={(e) => {
                                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                                    setGlobalSurcharges(prev => prev.map((item, i) => i === idx ? { ...item, amount: val, value: val, calculated_amount: val } : item));
                                                                }} className="w-24 h-[28px] px-2 text-right border rounded-md outline-none focus:border-primary text-sm" />
                                                            </div>
                                                        ) : (
                                                            <span className="font-medium text-slate-700">{formatCurrency(s.calculated_amount || s.amount || s.value || 0)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {globalDiscounts.map((d, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wide">
                                                        <span>Descuentos</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-600">Motivo: {d.reason || d.description || 'Descuento global'} <br /><span className="text-xs text-slate-400">Tipo: {(d.percent || d.percentage) ? `Porcentual (${Number(d.percent || d.percentage)}%)` : (d.type || 'Fijo')}</span></span>
                                                        {!['2', '3', '6', '7'].includes(selectedType) ? (
                                                            <div className="flex items-center">
                                                                <span className="mr-1 text-red-500">-$</span>
                                                                <input type="text" inputMode="numeric" value={d.calculated_amount || d.amount || d.value || 0} disabled={selectedType === '2'} onChange={(e) => {
                                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                                    const numVal = Number(val);
                                                                    const isPercentage = !!(d.percent || d.percentage);
                                                                    
                                                                    if (isPercentage && numVal > 100) {
                                                                        showToast("El porcentaje no puede ser mayor al 100%", "warning");
                                                                        setGlobalDiscounts(prev => prev.map((item, i) => i === idx ? { ...item, amount: "", value: "", calculated_amount: "" } : item));
                                                                    } else if (!isPercentage && numVal > (originalInvoiceSubtotal || 0)) {
                                                                        showToast("El valor excede el total del documento", "warning");
                                                                        setGlobalDiscounts(prev => prev.map((item, i) => i === idx ? { ...item, amount: "", value: "", calculated_amount: "" } : item));
                                                                    } else {
                                                                        setGlobalDiscounts(prev => prev.map((item, i) => i === idx ? { ...item, amount: val, value: val, calculated_amount: val } : item));
                                                                    }
                                                                }} className="w-24 h-[28px] px-2 text-right border rounded-md outline-none focus:border-primary text-sm text-red-500" />
                                                            </div>
                                                        ) : (
                                                            <span className="font-medium text-red-500">-{formatCurrency(d.calculated_amount || d.amount || d.value || 0)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedType === '3' && (
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-200/60 uppercase tracking-wide">Nuevos Descuentos Globales</h3>
                                        <div className="space-y-4">
                                            {newGlobalDiscounts.map((d, idx) => (
                                                <div key={idx} className="flex justify-between items-start text-sm">
                                                    <div>
                                                        <span className="text-slate-600 font-medium">{d.reason}</span><br />
                                                        <span className="text-xs text-slate-400">Tipo: {d.type === '%' ? 'Porcentual' : 'Fijo'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-red-500">
                                                            -{d.type === '%' ? d.value + '%' : formatCurrency(d.value)}
                                                        </span>
                                                        <button type="button" onClick={() => setNewGlobalDiscounts(prev => prev.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Eliminar">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="pt-2 border-t border-slate-200/50 flex flex-col gap-2">
                                                <input type="text" value={newDiscountReason} onChange={e => setNewDiscountReason(e.target.value)} placeholder="Motivo" className="w-full text-sm h-8 px-2 border rounded-md outline-none focus:border-primary" />
                                                <div className="flex gap-2">
                                                    <select value={newDiscountType} onChange={e => {
                                                        setNewDiscountType(e.target.value as '%' | '$');
                                                        setNewDiscountValue('');
                                                    }} className="text-sm border rounded-md outline-none focus:border-primary w-24 px-1">
                                                        <option value="%">%</option>
                                                        <option value="$">$</option>
                                                    </select>
                                                    <input type="text" inputMode="numeric" value={newDiscountValue} onChange={e => {
                                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                                        const numVal = Number(val);
                                                        if (newDiscountType === '%' && numVal > 100) {
                                                            showToast("El porcentaje no puede ser mayor al 100%", "warning");
                                                            setNewDiscountValue('');
                                                        } else if (newDiscountType === '$' && numVal > (originalInvoiceSubtotal || 0)) {
                                                            showToast("El valor excede el total del documento", "warning");
                                                            setNewDiscountValue('');
                                                        } else {
                                                            setNewDiscountValue(val);
                                                        }
                                                    }} placeholder="Valor" className="w-full text-sm h-8 px-2 border rounded-md outline-none focus:border-primary" />
                                                </div>
                                                <button type="button" onClick={() => {
                                                    if (!newDiscountReason || !newDiscountValue) return;
                                                    setNewGlobalDiscounts(prev => [...prev, {
                                                        reason: newDiscountReason,
                                                        type: newDiscountType,
                                                        value: newDiscountValue
                                                    }]);
                                                    setNewDiscountReason('');
                                                    setNewDiscountValue('');
                                                }} className="text-xs w-full py-1.5 mt-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-medium transition-colors cursor-pointer">
                                                    Agregar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-200/60 uppercase tracking-wide">Totales de la devolución</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Subtotal</span>
                                            <span className="font-medium text-slate-700">{formatCurrency(returnSubtotal)}</span>
                                        </div>
                                        {lineDiscountsTotal > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Descuentos en línea</span>
                                                <span className="font-medium text-red-500">-{formatCurrency(lineDiscountsTotal)}</span>
                                            </div>
                                        )}
                                        {globalSurchargesTotal > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Cargos Globales</span>
                                                <span className="font-medium text-slate-700">{formatCurrency(globalSurchargesTotal)}</span>
                                            </div>
                                        )}
                                        {globalDiscountsTotal > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Descuentos Globales</span>
                                                <span className="font-medium text-red-500">-{formatCurrency(globalDiscountsTotal)}</span>
                                            </div>
                                        )}
                                        {newGlobalDiscountsTotal > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Nuevos Descuentos Globales</span>
                                                <span className="font-medium text-slate-700">{formatCurrency(newGlobalDiscountsTotal)}</span>
                                            </div>
                                        )}
                                        {Object.values(returnTaxesMap).map((tax, idx) => (
                                            <div className="flex justify-between text-sm" key={idx}>
                                                <span className="text-slate-500">Impuestos en línea ({tax.name} {tax.percent}%)</span>
                                                <span className="font-medium text-slate-700">{formatCurrency(tax.amount)}</span>
                                            </div>
                                        ))}
                                        <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between items-center">
                                            <span className="text-base font-bold text-slate-800">Total a devolver</span>
                                            <span className="text-xl font-bold text-slate-800">{formatCurrency(returnTotal)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="sticky bottom-0 z-30 pt-6">
            <div className="bg-white border border-border rounded-xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-6 flex justify-end gap-3">
                <button
                    type="button"
                    className="cursor-pointer px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    disabled={selectedType === '2'} onClick={() => {
                        if (isDirty) {
                            setShowExitModal(true);
                        } else {
                            router.push("/returns");
                        }
                    }}
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
                    {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
            </div>
            </div>

            <Dialog open={!!pendingDocType} onOpenChange={(open) => !open && setPendingDocType(null)}>
                <DialogContent className="max-w-md p-6 overflow-hidden border-0 rounded-xl shadow-lg bg-white">
                    <DialogHeader className="flex flex-row items-center justify-between mb-2">
                        <DialogTitle className="text-lg font-semibold text-slate-800">Cambiar tipo de nota y reiniciar</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-slate-600 mb-6">
                        Ten en cuenta que si eliges otro tipo de nota crédito, vas a perder el progreso de los datos diligenciados en este documento.
                    </div>
                    <div className="flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setPendingDocType(null)}
                            className="cursor-pointer px-4 py-2 bg-white border border-[#2563eb] text-[#2563eb] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                        >
                            Seguir sin cambios
                        </button>
                        <button
                            type="button"
                            disabled={selectedType === '2'} onClick={() => {
                                if (pendingDocType) {
                                    setDocType(pendingDocType);
                                    setClientId('');
                                    setSelectedType('');
                                    setSelectedInvoices([{ uid: crypto.randomUUID(), invoiceId: '', details: null }]);
                                    setPendingDocType(null);
                                }
                            }}
                            className="cursor-pointer px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-[#1d4ed8] transition-colors"
                        >
                            Cambiar tipo de nota
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

            <ChangeTypeModal
                isOpen={!!pendingType}
                onClose={() => setPendingType(null)}
                onConfirm={confirmTypeChange}
            />

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
                        router.push("/returns");
                    }
                }}
            />
        </div>
    );
}
