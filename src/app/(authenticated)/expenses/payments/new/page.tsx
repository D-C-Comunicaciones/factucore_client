"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Info, RefreshCw, X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { showToast } from "@/components/sonner/CustomToaster";
import { ContactsService } from "@/lib/contacts";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useResolutions } from "@/hooks/useResolutions";
import { useSupportDocumentsList } from "@/hooks/supportDocuments/useSupportDocuments";
import { useCreateSupportDocumentPayment } from "@/hooks/supportDocuments/useSupportDocuments";
import { useBillsList, useCreateBillPayment } from "@/hooks/bills/useBills";
import { useAccountsList } from "@/hooks/accounting/useAccounting";
import type { Resolution } from "@/lib/resolutions";

interface AccountingLineDraft {
    key: string;
    account_id: string;
    description: string;
    amount: string;
}

let accountingLineKeySeq = 0;
function makeAccountingLineKey() {
    accountingLineKeySeq += 1;
    return `acc-line-${accountingLineKeySeq}`;
}

export default function NewExpensePaymentPage() {
    return (
        <Suspense fallback={null}>
            <NewExpensePaymentContent />
        </Suspense>
    );
}

function NewExpensePaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const catalogs = useCatalogs();

    const initialContactId = searchParams?.get("contact_id") ? Number(searchParams.get("contact_id")) : null;
    const initialDocumentId = searchParams?.get("document_id") || searchParams?.get("support_document_id") || searchParams?.get("bill_id");
    const initialDocType: "support_document" | "bill" | null = searchParams?.get("type") === "bill" ? "bill" : searchParams?.get("type") === "support_document" ? "support_document" : null;

    const [contactId, setContactId] = useState<number | null>(initialContactId);
    const [contactSearch, setContactSearch] = useState("");
    const [contactOptions, setContactOptions] = useState<{ value: string; label: string; details?: any }[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(false);

    const [documentKey, setDocumentKey] = useState<string | null>(
        initialDocumentId && initialDocType ? `${initialDocType}-${initialDocumentId}` : null
    );
    const [amount, setAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
    const [accountId, setAccountId] = useState<string | null>(null);
    const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showBankTip, setShowBankTip] = useState(true);

    // "Cuentas contables" — optional allocation of the payment across specific accounting
    // accounts, matching Alegra's egreso voucher. When left empty, the backend auto-posts a
    // single generic "Proveedores" line instead (see JournalEntryService::postSupplierPayment()).
    const [showAccountingLines, setShowAccountingLines] = useState(false);
    const [accountingLines, setAccountingLines] = useState<AccountingLineDraft[]>([]);
    const { data: postableAccounts } = useAccountsList({ postable_only: true });
    const accountOptions = (postableAccounts || []).map((a: any) => ({ value: String(a.id), label: `${a.code} — ${a.name}` }));

    const accountingLinesTotal = accountingLines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);

    const addAccountingLine = () => {
        setAccountingLines((prev) => [...prev, { key: makeAccountingLineKey(), account_id: "", description: "", amount: "" }]);
    };
    const removeAccountingLine = (key: string) => {
        setAccountingLines((prev) => prev.filter((l) => l.key !== key));
    };
    const updateAccountingLine = (key: string, field: keyof AccountingLineDraft, value: string) => {
        setAccountingLines((prev) => prev.map((l) => (l.key === key ? { ...l, [field]: value } : l)));
    };

    // Numeración — type_resolution_id 6 = Comprobantes de Egreso ("CE"), shared by Documento
    // Soporte y Factura de Compra (BillPaymentService/SupportDocumentPaymentService both number
    // off the same resolution). Same real numbering preview pattern as Invoice/Documento Soporte.
    const { resolutions, refetch: refetchResolutions } = useResolutions({ type_resolution: 6, is_active: true });
    const activeResolution = resolutions.find((r: Resolution) => r.is_main) || resolutions[0] || null;
    const nextNumber = activeResolution
        ? ((activeResolution.current_number ?? ((activeResolution.from_number || 1) - 1)) + 1)
        : null;

    const bankAccountOptions = (catalogs.bankAccounts || []).map((ba: any) => ({ value: String(ba.id), label: ba.name }));
    const paymentMethodOptions = (catalogs.paymentMethods || []).map((pm: any) => ({ value: String(pm.id), label: pm.name }));

    // Proveedor search — same pattern as Documento Soporte/Factura de Compra's own contact picker.
    useEffect(() => {
        let isCancelled = false;
        const fetchContacts = async () => {
            setLoadingContacts(true);
            try {
                const res: any = await ContactsService.list({ search: contactSearch, per_page: 30, type_contact_id: 2 });
                if (!isCancelled && res?.data?.contacts) {
                    setContactOptions(res.data.contacts.map((c: any) => ({
                        value: String(c.id),
                        label: c.registration_name || c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim(),
                        details: c,
                    })));
                }
            } catch {
                // ignore — keep previous options rather than blanking the list on a transient error
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

    // Once a provider is selected, list ALL of their outstanding documents — Documento Soporte and
    // Factura de Compra together, undifferentiated up front (the user picks the specific document,
    // not the document type first).
    const { data: sdListData, isLoading: loadingSdList } = useSupportDocumentsList({
        params: { per_page: 100, contact_id: contactId ?? undefined },
        enabled: Boolean(contactId),
    });
    const { data: billListData, isLoading: loadingBillList } = useBillsList({
        params: { per_page: 100, contact_id: contactId ?? undefined },
        enabled: Boolean(contactId),
    });

    const createSdPayment = useCreateSupportDocumentPayment();
    const createBillPayment = useCreateBillPayment();

    const documentOptions = useMemo(() => {
        const sdDocs = (sdListData?.support_documents || [])
            .filter((d: any) => Number(d.balance) > 0)
            .map((d: any) => ({
                key: `support_document-${d.id}`,
                type: "support_document" as const,
                id: d.id,
                balance: Number(d.balance),
                total: Number(d.payable_amount ?? d.total ?? 0),
                label: `${d.prefix || ""}${d.number} — Documento soporte — Saldo $${Number(d.balance).toLocaleString("es-CO")}`,
            }));
        const billDocs = (billListData?.bills || [])
            .filter((b: any) => Number(b.balance) > 0)
            .map((b: any) => ({
                key: `bill-${b.id}`,
                type: "bill" as const,
                id: b.id,
                balance: Number(b.balance),
                total: Number(b.total ?? 0),
                label: `${b.bill_number || `#${b.id}`} — Factura de compra — Saldo $${Number(b.balance).toLocaleString("es-CO")}`,
            }));
        return [...sdDocs, ...billDocs];
    }, [sdListData, billListData]);

    const selectedDocument = useMemo(
        () => documentOptions.find((d) => d.key === documentKey) || null,
        [documentOptions, documentKey]
    );

    const balance = selectedDocument?.balance ?? 0;
    const loadingDocuments = loadingSdList || loadingBillList;

    const handleContactChange = (val: string) => {
        setContactId(val ? Number(val) : null);
        setDocumentKey(null);
        setAmount("");
    };

    const handleDocumentChange = (key: string) => {
        setDocumentKey(key);
        const doc = documentOptions.find((d) => d.key === key);
        if (doc) setAmount(String(doc.balance));
    };

    const handleSubmit = async () => {
        if (!contactId) {
            showToast("Selecciona el proveedor", "error");
            return;
        }
        if (!selectedDocument) {
            showToast("Selecciona el documento a pagar", "error");
            return;
        }
        const amountNum = Number(amount);
        if (!amountNum || amountNum <= 0) {
            showToast("Ingresa un monto válido", "error");
            return;
        }

        setSubmitting(true);
        try {
            const validAccountingLines = accountingLines.filter((l) => l.account_id && Number(l.amount) > 0);
            const paymentData = {
                amount: amountNum,
                payment_date: paymentDate,
                notes: notes || undefined,
                account_id: accountId ? Number(accountId) : undefined,
                payment_method_id: paymentMethodId ? Number(paymentMethodId) : undefined,
                accounting_lines: validAccountingLines.length > 0
                    ? validAccountingLines.map((l) => ({
                        account_id: Number(l.account_id),
                        amount: Number(l.amount),
                        description: l.description || undefined,
                    }))
                    : undefined,
            };

            if (selectedDocument.type === "support_document") {
                await createSdPayment.mutateAsync({ id: selectedDocument.id, data: paymentData });
                showToast("Pago registrado correctamente", "success");
                refetchResolutions();
                router.push(`/expenses/support-documents/${selectedDocument.id}?tab=payments`);
            } else {
                await createBillPayment.mutateAsync({ id: selectedDocument.id, data: paymentData });
                showToast("Pago registrado correctamente", "success");
                refetchResolutions();
                router.push(`/expenses/bills/${selectedDocument.id}`);
            }
        } catch (error: any) {
            showToast(error?.message || "Error al registrar el pago", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen py-6 px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto space-y-6">
            <div className="flex items-start gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.push("/expenses/payments")} className="h-8 w-8 text-slate-500 cursor-pointer mt-0.5">
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#001D4A]">Nuevo pago</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Los comprobantes de egreso te ayudarán a respaldar los pagos a tus proveedores.
                    </p>
                </div>
            </div>

            {showBankTip && (
                <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg p-3 relative">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground pr-6">
                        Este pago queda registrado sobre el Documento Soporte o Factura de Compra seleccionado — es independiente de los pagos recibidos de clientes (Ingresos &gt; Pagos).
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowBankTip(false)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-border p-6 space-y-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-bold text-foreground">Información general del pago</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Indica los detalles generales asociados a este egreso.</p>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">No.</span>
                            {nextNumber ? (
                                <span className="font-bold text-lg text-foreground">
                                    {activeResolution?.prefix || ''}{nextNumber}
                                </span>
                            ) : (
                                <div className="h-6 w-16 bg-muted animate-pulse rounded-md" />
                            )}
                            <button
                                type="button"
                                className="p-1 rounded hover:bg-muted/40 transition cursor-pointer"
                                onClick={() => refetchResolutions()}
                                title="Actualizar numeración"
                            >
                                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Proveedor <span className="text-primary">*</span></label>
                        <SearchableSelect
                            options={contactOptions}
                            value={contactId ? String(contactId) : ""}
                            onValueChange={handleContactChange}
                            placeholder="Seleccionar proveedor"
                            searchPlaceholder="Buscar proveedor..."
                            loading={loadingContacts}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Cuenta bancaria</label>
                        <SearchableSelect
                            options={bankAccountOptions}
                            value={accountId || ""}
                            onValueChange={setAccountId}
                            placeholder="Seleccionar cuenta"
                            searchPlaceholder="Buscar cuenta..."
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Fecha <span className="text-primary">*</span></label>
                        <DatePickerSimple
                            value={paymentDate ? new Date(paymentDate) : new Date()}
                            onChange={(d) => setPaymentDate(d ? d.toISOString().split("T")[0] : "")}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Forma de pago</label>
                        <SearchableSelect
                            options={paymentMethodOptions}
                            value={paymentMethodId || ""}
                            onValueChange={setPaymentMethodId}
                            placeholder="Seleccionar"
                            searchPlaceholder="Buscar forma de pago..."
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">Documento a pagar <span className="text-primary">*</span></label>
                        <SearchableSelect
                            options={documentOptions.map((d) => ({ value: d.key, label: d.label }))}
                            value={documentKey || ""}
                            onValueChange={handleDocumentChange}
                            placeholder={!contactId ? "Selecciona primero un proveedor" : loadingDocuments ? "Cargando..." : "Seleccionar documento"}
                            searchPlaceholder="Buscar por número..."
                            disabled={!contactId}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            Se listan los documentos soporte y facturas de compra con saldo pendiente de este proveedor.
                        </p>
                    </div>

                    {selectedDocument && (
                        <div className="sm:col-span-3 grid grid-cols-2 gap-4 p-4 border border-slate-100 rounded-lg bg-slate-50/50 text-sm">
                            <div>
                                <div className="text-xs text-slate-500">Total documento</div>
                                <div className="font-medium text-slate-700">$ {selectedDocument.total.toLocaleString("es-CO")}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500">Saldo pendiente</div>
                                <div className="font-medium text-slate-700">$ {balance.toLocaleString("es-CO")}</div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Monto <span className="text-primary">*</span></label>
                        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-9" />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">Nota de egreso</label>
                        <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opcional" className="h-9" />
                    </div>
                </div>

                <p className="text-xs text-muted-foreground text-right pt-2 border-t border-slate-100">
                    Los campos marcados con <span className="text-primary">*</span> son obligatorios.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-border p-6 space-y-4 shadow-sm">
                <button
                    type="button"
                    onClick={() => setShowAccountingLines((v) => !v)}
                    className="w-full flex items-center justify-between cursor-pointer"
                >
                    <div className="text-left">
                        <h2 className="text-sm font-bold text-foreground">Cuentas contables</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Opcional — desglosa este pago en cuentas contables específicas. Si lo dejas vacío, se contabiliza automáticamente contra Proveedores.
                        </p>
                    </div>
                    {showAccountingLines ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>

                {showAccountingLines && (
                    <div className="space-y-3 pt-2">
                        {accountingLines.length > 0 && (
                            <div className="border border-border rounded-lg overflow-x-auto">
                                <table className="w-full text-xs text-left min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                                            <th className="px-3 py-2.5 font-medium w-[40%]">Concepto</th>
                                            <th className="px-3 py-2.5 font-medium w-[35%]">Observaciones</th>
                                            <th className="px-3 py-2.5 font-medium w-[20%] text-right">Valor</th>
                                            <th className="px-3 py-2.5 font-medium w-[5%]"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {accountingLines.map((line) => (
                                            <tr key={line.key} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-2 py-2 align-middle">
                                                    <SearchableSelect
                                                        value={line.account_id}
                                                        onValueChange={(v) => updateAccountingLine(line.key, "account_id", v)}
                                                        options={accountOptions}
                                                        placeholder="Seleccionar cuenta"
                                                        searchPlaceholder="Buscar cuenta..."
                                                        className="h-8 text-xs bg-white"
                                                    />
                                                </td>
                                                <td className="px-2 py-2 align-middle">
                                                    <Input
                                                        value={line.description}
                                                        onChange={(e) => updateAccountingLine(line.key, "description", e.target.value)}
                                                        placeholder="Opcional"
                                                        className="h-8 text-xs"
                                                    />
                                                </td>
                                                <td className="px-2 py-2 align-middle">
                                                    <Input
                                                        type="number"
                                                        value={line.amount}
                                                        onChange={(e) => updateAccountingLine(line.key, "amount", e.target.value)}
                                                        className="h-8 text-xs text-right"
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-center align-middle">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAccountingLine(line.key)}
                                                        className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={addAccountingLine}
                            className="text-primary hover:text-primary/80 text-xs font-semibold flex items-center gap-1 transition-colors h-8 px-2 rounded-md hover:bg-muted cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar cuenta contable
                        </button>

                        {accountingLines.length > 0 && (
                            <div className="flex justify-end text-xs pt-1">
                                <span className="text-muted-foreground mr-2">Asignado: $ {accountingLinesTotal.toLocaleString("es-CO")} de $ {(Number(amount) || 0).toLocaleString("es-CO")}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => router.push("/expenses/payments")} className="cursor-pointer">
                    Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={submitting} className="bg-primary hover:bg-primary/90 text-white cursor-pointer">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Guardar
                </Button>
            </div>
        </div>
    );
}
