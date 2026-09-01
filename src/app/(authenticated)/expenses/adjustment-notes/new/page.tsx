"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Loader2, ChevronDown, Settings, HelpCircle, Plus, Trash2, RefreshCw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EditResolutionModal } from "@/components/invoice/new/EditResolutionModal";
import { FactucoreLogo } from "@/components/brand/FactucoreLogo";
import { CompanyHeaderPdfStyle } from "@/components/shared/CompanyHeaderPdfStyle";
import { showToast } from "@/components/sonner/CustomToaster";
import { cn } from "@/lib/utils";
import { useResolutions } from "@/hooks/useResolutions";
import { useSupportDocumentsList, useSupportDocument } from "@/hooks/supportDocuments/useSupportDocuments";
import { useCreateAdjustmentNote, useSendTestAdjustmentNote } from "@/hooks/adjustmentNotes/useAdjustmentNotes";
import { useItems } from "@/hooks/items/useItems";
import { useCatalogs } from "@/hooks/useCatalogs";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { costCentersApi } from "@/lib/costCenters";
import { useQuery } from "@tanstack/react-query";
import type { AdjustmentNoteLineInput, AdjustmentNotePayload } from "@/types/adjustmentNote";
import type { Resolution } from "@/lib/resolutions";
import type { SupportDocumentContact } from "@/types/supportDocument";

// Matches TypeAdjustmentNote's real catalog (id/name), confirmed via direct DB query — id 2 is
// the annulment type, every other id is a correction subtype. A single flat select over this
// list replaces the old two-step "Corrección/Anulación total" toggle + sub-select.
const ADJUSTMENT_TYPES = [
    { id: 1, label: "Devolución parcial de los bienes y/o no aceptación parcial del servicio" },
    { id: 2, label: "Anulación del documento soporte" },
    { id: 3, label: "Rebaja o descuento parcial o total" },
    { id: 4, label: "Ajuste de precio" },
    { id: 5, label: "Otros" },
];
const ANNULMENT_TYPE_ID = 2;

interface EditableLine {
    key: string;
    support_document_line_id: number | null;
    item_id: number | null;
    name: string;
    description: string;
    quantity: number;
    price: number;
    discountPercent: number;
    taxes: { tax_id: number; rate: number; name?: string }[];
}

let lineKeySeq = 0;
function makeLineKey() {
    lineKeySeq += 1;
    return `new-line-${lineKeySeq}`;
}

export default function NewAdjustmentNotePage() {
    return (
        <Suspense fallback={null}>
            <NewAdjustmentNoteContent />
        </Suspense>
    );
}

function NewAdjustmentNoteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [supportDocumentId, setSupportDocumentId] = useState<number | null>(
        searchParams?.get("support_document_id") ? Number(searchParams.get("support_document_id")) : null
    );
    const [typeAdjustmentNoteId, setTypeAdjustmentNoteId] = useState<number>(
        searchParams?.get("type") === "annulment" ? ANNULMENT_TYPE_ID : 1
    );
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
    const [note, setNote] = useState("");
    const [discrepancyDescription, setDiscrepancyDescription] = useState("");
    const [lines, setLines] = useState<EditableLine[]>([]);
    const [loadingAction, setLoadingAction] = useState(false);

    // Ajustes globales — same shape as Invoice/Documento Soporte's global adjustments.
    const [globalAdjustments, setGlobalAdjustments] = useState<any[]>([]);
    const [globalAdjType, setGlobalAdjType] = useState<"discount" | "charge">("discount");
    const [globalAdjValueType, setGlobalAdjValueType] = useState<"percentage" | "fixed">("percentage");
    const [globalAdjValue, setGlobalAdjValue] = useState<number>(0);
    const [globalAdjReason, setGlobalAdjReason] = useState("");
    const [comments, setComments] = useState<any[]>([]);

    // Numbering — type_resolution_id 13 = Nota de Ajuste a Doc. Soporte (see resolveResolution()
    // in AdjustmentNoteService, and TypeAdjustmentNoteSeeder for the catalog behind it).
    const { resolutions, refetch: refetchResolutions, isLoading: isLoadingResolutions } = useResolutions({ type_resolution: 13, is_active: true });
    const [isNumerationModalOpen, setIsNumerationModalOpen] = useState(false);
    const [selectedResolutionId, setSelectedResolutionId] = useState<number | null>(null);

    useEffect(() => {
        if (resolutions && resolutions.length > 0 && !selectedResolutionId) {
            const mainRes = resolutions.find((r: Resolution) => r.is_main) || resolutions[0];
            setSelectedResolutionId(mainRes.id);
        }
    }, [resolutions, selectedResolutionId]);

    const activeResolution = resolutions.find((r: Resolution) => r.id === selectedResolutionId) || resolutions[0] || null;
    const nextNumber = activeResolution
        ? ((activeResolution.current_number ?? ((activeResolution.from_number || 1) - 1)) + 1)
        : 1;

    const { data: sdListData } = useSupportDocumentsList({ params: { per_page: 100 } });
    const supportDocuments = (sdListData?.support_documents || []).filter((d: any) => Boolean(d.cuds));

    const { data: sdDetailData, isLoading: loadingSdDetail } = useSupportDocument(supportDocumentId || "", {
        enabled: Boolean(supportDocumentId),
    });
    const sourceDoc = sdDetailData?.support_document;

    // When the source document loads (or changes), (re)prefill the line editor from its own
    // lines — matches what a correction/annulment naturally starts from: the same lines, with
    // quantities/prices the user can then adjust down for a partial correction.
    useEffect(() => {
        if (!sourceDoc) return;
        const mapped: EditableLine[] = (sourceDoc.lines || []).map((l: any, idx: number) => ({
            key: `line-${l.id ?? idx}`,
            support_document_line_id: l.id,
            item_id: l.product_id,
            name: l.item_snapshot?.name || l.description || `Ítem #${idx + 1}`,
            description: "",
            quantity: Number(l.quantity) || 1,
            price: Number(l.price) || 0,
            discountPercent: 0,
            taxes: (l.taxes || []).map((t: any) => ({ tax_id: t.tax_id, rate: Number(t.percent), name: t.name })),
        }));
        setLines(mapped);
    }, [sourceDoc]);

    const isAnnulment = typeAdjustmentNoteId === ANNULMENT_TYPE_ID;
    const effectiveTypeId = typeAdjustmentNoteId;

    const total = useMemo(() => {
        return lines.reduce((sum, l) => {
            const gross = l.quantity * l.price;
            const discount = l.discountPercent > 0 ? (gross * l.discountPercent) / 100 : 0;
            const base = gross - discount;
            const taxAmount = l.taxes.reduce((tSum, t) => tSum + (base * t.rate) / 100, 0);
            return sum + base + taxAmount;
        }, 0);
    }, [lines]);

    const updateLine = (key: string, field: "quantity" | "price" | "discountPercent", value: number) => {
        setLines((prev) => prev.map((l) => (l.key === key ? { ...l, [field]: value } : l)));
    };

    const updateLineDescription = (key: string, value: string) => {
        setLines((prev) => prev.map((l) => (l.key === key ? { ...l, description: value } : l)));
    };

    // Catalog data for manually added lines — a nota de ajuste isn't limited to correcting
    // quantities/prices of the referenced document's own lines; the backend accepts brand-new
    // lines with support_document_line_id: null (see StoreAdjustmentNoteRequest::rules()).
    const catalogs = useCatalogs();

    // Bodega / Centro de costo — purely decorative here (mirrors Documento Soporte's own
    // NewSupportDocumentOptions, which likewise doesn't submit these to the backend yet); kept
    // for visual uniformity with Invoice/Documento Soporte's "Personalizar opciones" header.
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [showWarehouseOption, setShowWarehouseOption] = useState(true);
    const [showCostCenterOption, setShowCostCenterOption] = useState(true);
    const [warehouseId, setWarehouseId] = useState<string | null>(null);
    const [costCenterId, setCostCenterId] = useState<string | null>(null);
    const { data: costCentersResp } = useQuery({
        queryKey: ['costCenters', { is_active: true }],
        queryFn: async () => await costCentersApi.getCostCenters({ is_active: true }),
    });
    const costCentersData = Array.isArray(costCentersResp?.data?.['cost-centers'])
        ? costCentersResp?.data['cost-centers']
        : (Array.isArray(costCentersResp?.data) ? costCentersResp.data : []);
    const warehouseOptions = (catalogs.warehouses || []).map((w: any) => ({ value: String(w.id), label: w.name }));
    const costCenterOptions = [
        { value: "none", label: "Ninguno" },
        ...costCentersData.map((cc: any) => ({ value: String(cc.id), label: cc.name })),
    ];

    const { data: itemsResponse } = useItems({ params: { per_page: 100 } });
    const itemsList = useMemo(() => {
        const list = itemsResponse?.data;
        return Array.isArray(list) ? list : [];
    }, [itemsResponse]);

    const taxesOptions = useMemo(() => (catalogs.taxes || []).map((t: any) => ({
        id: t.id,
        tax_id: t.tax_id,
        name: t.name,
        rate: Number(t.rate ?? t.percentage ?? 0),
    })), [catalogs.taxes]);

    const addLine = () => {
        setLines((prev) => [
            ...prev,
            {
                key: makeLineKey(),
                support_document_line_id: null,
                item_id: null,
                name: "",
                description: "",
                quantity: 1,
                price: 0,
                discountPercent: 0,
                taxes: [],
            },
        ]);
    };

    const removeLine = (key: string) => {
        setLines((prev) => prev.filter((l) => l.key !== key));
    };

    const handleAddGlobalAdjustment = () => {
        if (globalAdjValue <= 0) {
            showToast("Ingresa un valor mayor a 0", "warning");
            return;
        }
        const newAdj = {
            id: Date.now(),
            type: globalAdjType,
            valueType: globalAdjValueType,
            value: globalAdjValue,
            reason: globalAdjReason.trim(),
        };
        setGlobalAdjustments((prev) => [...prev, newAdj]);
        setGlobalAdjValue(0);
        setGlobalAdjReason("");
    };

    const handleRemoveGlobalAdjustment = (id: number) => {
        setGlobalAdjustments((prev) => prev.filter((a) => a.id !== id));
    };

    const handleLineItemSelect = (key: string, itemIdStr: string) => {
        const item: any = itemsList.find((i: any) => String(i.id) === itemIdStr);
        if (!item) return;
        const defaultPrice = Number(item.price_amount ?? item.price ?? item.cost ?? 0);
        const firstTax = item.tax_rates && item.tax_rates.length > 0 ? item.tax_rates[0] : null;
        // /items flattens variants (entity_type: "variant") into the same list, each with its OWN
        // id plus parent_id pointing at the real Item — item_id must resolve to parent_id or
        // exists:items,id rejects it (a variant id isn't a valid item id).
        const resolvedItemId = item.entity_type === "variant" ? (item.parent_id ?? item.item_id ?? item.id) : item.id;
        setLines((prev) => prev.map((l) => (l.key === key ? {
            ...l,
            item_id: resolvedItemId,
            name: item.name,
            price: defaultPrice,
            taxes: firstTax ? [{ tax_id: firstTax.tax_id, rate: Number(firstTax.rate ?? firstTax.percentage ?? 0), name: firstTax.name }] : [],
        } : l)));
    };

    const handleLineTaxSelect = (key: string, val: string) => {
        if (val === "0") {
            setLines((prev) => prev.map((l) => (l.key === key ? { ...l, taxes: [] } : l)));
            return;
        }
        const tax = taxesOptions.find((t) => String(t.id) === val);
        if (!tax) return;
        setLines((prev) => prev.map((l) => (l.key === key ? { ...l, taxes: [{ tax_id: tax.tax_id, rate: tax.rate, name: tax.name }] } : l)));
    };

    const buildPayload = (): AdjustmentNotePayload | null => {
        if (!supportDocumentId) {
            showToast("Selecciona el Documento Soporte a ajustar", "error");
            return null;
        }
        if (lines.length === 0) {
            showToast("La nota de ajuste debe tener al menos una línea", "error");
            return null;
        }

        const lineInputs: AdjustmentNoteLineInput[] = lines.map((l) => ({
            item_id: l.item_id ?? undefined,
            support_document_line_id: l.support_document_line_id,
            description: l.description || l.name,
            quantity: l.quantity,
            price: l.price,
            taxes: l.taxes.map((t) => ({ tax_id: t.tax_id, rate: t.rate })),
            allowance_charges: l.discountPercent > 0
                ? [{ scope: "line" as const, charge_indicator: false, value_type: "percentage" as const, value: l.discountPercent }]
                : undefined,
        }));

        const globalAllowanceCharges = globalAdjustments.map((adj) => ({
            scope: "global" as const,
            charge_indicator: adj.type === "charge",
            value_type: adj.valueType,
            value: adj.value,
            reason: adj.reason || undefined,
        }));

        return {
            support_document_id: supportDocumentId,
            resolution_id: selectedResolutionId ?? undefined,
            type_adjustment_note_id: effectiveTypeId,
            issue_date: issueDate,
            note: note || undefined,
            discrepancy_response_description: discrepancyDescription || undefined,
            lines: lineInputs,
            allowance_charges: globalAllowanceCharges.length > 0 ? globalAllowanceCharges : undefined,
        };
    };

    const createNote = useCreateAdjustmentNote();
    const sendTestNote = useSendTestAdjustmentNote();

    const handleSave = async () => {
        const payload = buildPayload();
        if (!payload) return;

        setLoadingAction(true);
        try {
            const created = await createNote.mutateAsync(payload);
            showToast("Nota de ajuste guardada correctamente", "success");
            router.push(`/expenses/adjustment-notes/${created?.id}`);
        } catch (error: any) {
            showToast(error?.message || "Error al guardar la nota de ajuste", "error");
        } finally {
            setLoadingAction(false);
        }
    };

    const handleSaveAndSend = async () => {
        const payload = buildPayload();
        if (!payload) return;

        setLoadingAction(true);
        try {
            const result = await sendTestNote.mutateAsync(payload);
            showToast(result.message || "Nota de ajuste enviada en habilitación a la DIAN", "success");
            const newId = result.adjustment_note?.id;
            router.push(newId ? `/expenses/adjustment-notes/${newId}` : "/expenses/adjustment-notes");
        } catch (error: any) {
            showToast(error?.message || "Error al enviar la nota de ajuste a la DIAN", "error");
        } finally {
            setLoadingAction(false);
        }
    };

    const sdOptions = supportDocuments.map((d: any) => ({
        value: String(d.id),
        label: `${d.prefix || ""}${d.number} — ${d.contact?.registration_name || d.contact?.name || "Sin proveedor"}`,
    }));

    const contact: Partial<SupportDocumentContact> = sourceDoc?.contact || {};
    const inputClass =
        "bg-white border border-foreground/20 rounded-lg h-9 px-3 text-sm text-foreground hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors";

    return (
        <div className="w-full min-h-screen py-6 px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto space-y-6">
            <div>
                <div className="flex items-center text-sm text-primary mb-2 font-medium">
                    <Link href="/expenses/adjustment-notes" className="hover:underline">
                        Notas de ajuste
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
                    <span className="text-slate-500">Nueva nota de ajuste</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#001D4A]">Nueva nota de ajuste</h1>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all border h-[38px] cursor-pointer ${
                                showOptionsMenu
                                    ? "border-primary bg-white text-primary shadow-sm ring-1 ring-primary/20"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary"
                            }`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Personalizar opciones
                        </button>

                        {showOptionsMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowOptionsMenu(false)} />
                                <div className="absolute right-0 top-full mt-2 w-[240px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                                    <h4 className="text-[13px] font-bold text-primary mb-3">Opciones disponibles</h4>
                                    <div className="border-t border-gray-100 my-2"></div>
                                    <div className="space-y-3 pt-1">
                                        <label className="flex items-center justify-between cursor-pointer group py-1 border-b border-gray-50">
                                            <span className="text-[13px] text-gray-700 group-hover:text-gray-900 font-medium">Bodega</span>
                                            <input
                                                type="checkbox"
                                                checked={showWarehouseOption}
                                                onChange={(e) => setShowWarehouseOption(e.target.checked)}
                                                className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary accent-primary cursor-pointer"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between cursor-pointer group py-1">
                                            <span className="text-[13px] text-gray-700 group-hover:text-gray-900 font-medium">Centro de costo</span>
                                            <input
                                                type="checkbox"
                                                checked={showCostCenterOption}
                                                onChange={(e) => setShowCostCenterOption(e.target.checked)}
                                                className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary accent-primary cursor-pointer"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {(showWarehouseOption || showCostCenterOption) && (
                <div className="bg-white rounded-lg border border-border p-4 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {showWarehouseOption && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Bodega</label>
                                <SearchableSelect
                                    value={warehouseId ? String(warehouseId) : (warehouseOptions[0]?.value || "")}
                                    onValueChange={(val) => setWarehouseId(val)}
                                    options={warehouseOptions}
                                    placeholder="Principal"
                                    searchPlaceholder="Buscar bodega..."
                                    className="w-full text-foreground"
                                />
                            </div>
                        )}
                        {showCostCenterOption && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Centro de costo</label>
                                <SearchableSelect
                                    value={costCenterId ? String(costCenterId) : "none"}
                                    onValueChange={(val) => setCostCenterId(val === "none" ? null : val)}
                                    options={costCenterOptions}
                                    placeholder="Ninguno"
                                    searchPlaceholder="Buscar centro de costo..."
                                    className="w-full text-foreground"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <TooltipProvider>
            <div className="filter drop-shadow-sm">
            <div
                className="relative bg-white rounded-lg border border-border p-4 sm:p-6 md:p-8 overflow-hidden space-y-6"
                style={{ clipPath: 'polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)' }}
            >
                {/* Folded Corner Effect */}
                <div className="absolute top-0 right-0 w-10 h-10 pointer-events-none" style={{ filter: 'drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.08))' }}>
                    <div
                        className="w-full h-full bg-gradient-to-bl from-slate-200 via-slate-100 to-white border-l border-b border-slate-200/80"
                        style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
                    />
                </div>

                {/* HEADER: Logo, Company Header Style, Consecutivo No. X con engranaje */}
                <div className="flex flex-col md:grid md:grid-cols-3 items-center md:items-start gap-6 md:gap-0 text-center md:text-left">
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center md:justify-self-start flex items-center justify-center min-w-[160px] min-h-[100px]">
                        <FactucoreLogo variant="icon" className="max-h-[80px] w-auto" alt="Logo de la empresa" />
                    </div>

                    <div className="text-center pt-2">
                        <CompanyHeaderPdfStyle />
                    </div>

                    <div className="text-center md:text-right md:justify-self-end">
                        <div className="inline-flex flex-col items-center md:items-end gap-1">
                            <div className="grid grid-cols-[minmax(160px,220px)_auto] gap-x-2 gap-y-1 items-center">
                                <span className="text-sm text-muted-foreground text-center col-start-1 leading-snug">
                                    {activeResolution?.name || (activeResolution?.is_main ? "Numeración Principal" : "Nota de ajuste")}
                                </span>
                                <div className="col-start-1 row-start-2">
                                    <SearchableSelect
                                        value={selectedResolutionId?.toString() || ""}
                                        onValueChange={(val) => setSelectedResolutionId(Number(val))}
                                        options={resolutions?.map((res: Resolution) => ({
                                            value: res.id.toString(),
                                            label: res.prefix || `Resolución ${res.id}`
                                        })) || []}
                                        placeholder="Seleccionar"
                                        className="w-full text-foreground"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="p-1 rounded hover:bg-muted/40 transition col-start-2 row-start-2 cursor-pointer"
                                    onClick={() => setIsNumerationModalOpen(true)}
                                    title="Configurar resolución"
                                >
                                    <Settings className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="flex items-center justify-center md:justify-end w-full gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-muted-foreground">No.</span>
                                    <span className="font-bold text-lg text-foreground">
                                        {activeResolution?.prefix || ''}{nextNumber}
                                    </span>
                                </div>
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
                </div>

                {/* FORM FIELDS: Proveedor, Identificación, Teléfono, Nro. Documento Soporte — Fecha, Tipo */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                    {/* Columna Izquierda */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="text-sm font-medium text-foreground sm:w-40 sm:text-right shrink-0 text-left">
                                Proveedor
                            </label>
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                <Input
                                    type="text"
                                    readOnly
                                    value={contact?.registration_name || contact?.name || ""}
                                    placeholder="Selecciona un documento soporte"
                                    className={cn(inputClass, "w-full bg-muted/20 cursor-default text-muted-foreground")}
                                />
                                <div className="w-4 shrink-0"></div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="text-sm font-medium text-foreground sm:w-40 sm:text-right shrink-0 text-left">
                                Identificación
                            </label>
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                <Input
                                    type="text"
                                    readOnly
                                    value={contact?.identification_number
                                        ? `${contact.identification_number}${contact.verification_digit != null ? `-${contact.verification_digit}` : ''}`
                                        : ""}
                                    placeholder="Identificación del proveedor"
                                    className={cn(inputClass, "w-full bg-muted/20 cursor-default text-muted-foreground")}
                                />
                                <div className="w-4 shrink-0"></div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="text-sm font-medium text-foreground sm:w-40 sm:text-right shrink-0 text-left">
                                Teléfono
                            </label>
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                <Input
                                    type="text"
                                    readOnly
                                    value={contact?.phone || contact?.email || ""}
                                    placeholder="Teléfono del proveedor"
                                    className={cn(inputClass, "w-full bg-muted/20 cursor-default text-muted-foreground")}
                                />
                                <div className="w-4 shrink-0"></div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="text-sm font-medium text-foreground sm:w-40 sm:text-right shrink-0 text-left">
                                Nro. Documento Soporte <span className="text-primary">*</span>
                            </label>
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                <SearchableSelect
                                    options={sdOptions}
                                    value={supportDocumentId ? String(supportDocumentId) : ""}
                                    onValueChange={(val) => setSupportDocumentId(val ? Number(val) : null)}
                                    placeholder="Seleccionar documento soporte"
                                    searchPlaceholder="Buscar por número o proveedor..."
                                    className="w-full text-foreground"
                                />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                        Solo se muestran documentos ya firmados (con CUDS) — solo esos pueden ajustarse.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="text-sm font-medium text-foreground sm:w-32 sm:text-right shrink-0 text-left">
                                Fecha <span className="text-primary">*</span>
                            </label>
                            <div className="flex-1 flex items-center gap-2">
                                <div className="flex-1">
                                    <DatePickerSimple
                                        value={issueDate ? new Date(issueDate) : new Date()}
                                        onChange={(d) => setIssueDate(d ? d.toISOString().split("T")[0] : "")}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                            <label className="text-sm font-medium text-foreground sm:w-32 sm:text-right shrink-0 text-left pt-2">
                                Tipo <span className="text-primary">*</span>
                            </label>
                            <div className="flex-1 min-w-0 space-y-2">
                                <SearchableSelect
                                    value={String(typeAdjustmentNoteId)}
                                    onValueChange={(val) => setTypeAdjustmentNoteId(Number(val))}
                                    options={ADJUSTMENT_TYPES.map((t) => ({ value: String(t.id), label: t.label }))}
                                    placeholder="Tipo de nota de ajuste"
                                    className="w-full text-foreground"
                                />

                                {isAnnulment && (
                                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
                                        La anulación total revierte por completo el Documento Soporte referenciado. Las líneas se toman tal cual del documento original.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lines */}
                {loadingSdDetail ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Cargando líneas del documento...
                    </div>
                ) : (
                    <div className="w-full rounded-lg border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left min-w-[760px]">
                                <thead className="bg-muted/30 border-b border-border">
                                    <tr>
                                        <th className="px-3 py-2.5 font-semibold text-muted-foreground w-[22%]">Ítem</th>
                                        <th className="px-3 py-2.5 font-semibold text-muted-foreground w-[12%]">Precio</th>
                                        <th className="px-3 py-2.5 font-semibold text-muted-foreground w-[10%] text-right">Descuento</th>
                                        <th className="px-3 py-2.5 font-semibold text-muted-foreground w-[15%]">Impuesto</th>
                                        <th className="px-3 py-2.5 font-semibold text-muted-foreground w-[15%]">Descripción</th>
                                        <th className="px-3 py-2.5 font-semibold text-muted-foreground w-[9%] text-right">Cantidad</th>
                                        <th className="px-3 py-2.5 font-semibold text-muted-foreground w-[10%] text-right">Total</th>
                                        <th className="px-3 py-2.5 font-semibold text-muted-foreground w-[3%]"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {lines.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="bg-white">
                                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.837-7.17a60.81 60.81 0 00-16.58-1.986c-.64 0-1.276.019-1.907.055m-.566 0L4.5 6h15M10.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-sm font-medium text-foreground">No hay líneas agregadas</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Selecciona un documento soporte o haz clic en <span className="font-semibold text-primary">"Agregar línea"</span> para comenzar.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {lines.map((line) => {
                                        const gross = line.quantity * line.price;
                                        const discountAmount = line.discountPercent > 0 ? (gross * line.discountPercent) / 100 : 0;
                                        const lineTotal = gross - discountAmount;
                                        const firstTax = line.taxes[0];
                                        const isNewLine = line.support_document_line_id === null;
                                        return (
                                            <tr key={line.key} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-2 py-2 align-middle">
                                                    {isNewLine ? (
                                                        <SearchableSelect
                                                            value={line.item_id ? String(line.item_id) : ""}
                                                            onValueChange={(val) => handleLineItemSelect(line.key, val)}
                                                            options={itemsList.map((i: any) => ({ value: String(i.id), label: i.name }))}
                                                            placeholder="Seleccionar producto"
                                                            searchPlaceholder="Buscar producto..."
                                                            className="h-8 text-xs bg-white"
                                                        />
                                                    ) : (
                                                        <span className="px-1 font-medium text-slate-800">{line.name}</span>
                                                    )}
                                                </td>
                                                <td className="px-2 py-2 align-middle">
                                                    <Input
                                                        type="number"
                                                        value={line.price}
                                                        disabled={isAnnulment}
                                                        onChange={(e) => updateLine(line.key, "price", Number(e.target.value) || 0)}
                                                        className="h-8 text-xs"
                                                    />
                                                </td>
                                                <td className="px-2 py-2 align-middle">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        value={line.discountPercent || ""}
                                                        disabled={isAnnulment}
                                                        placeholder="0"
                                                        onChange={(e) => {
                                                            const val = Number(e.target.value) || 0;
                                                            updateLine(line.key, "discountPercent", val > 100 ? 100 : val);
                                                        }}
                                                        className="h-8 text-xs text-right"
                                                    />
                                                </td>
                                                <td className="px-2 py-2 align-middle">
                                                    {isAnnulment ? (
                                                        <span className="px-1 text-slate-600">
                                                            {firstTax ? `${firstTax.name || 'IVA'} ${firstTax.rate}%` : '-'}
                                                        </span>
                                                    ) : (
                                                        <SearchableSelect
                                                            value={firstTax?.tax_id ? String(firstTax.tax_id) : "0"}
                                                            onValueChange={(val) => handleLineTaxSelect(line.key, val)}
                                                            options={[
                                                                { value: "0", label: "Sin impuesto" },
                                                                ...taxesOptions.map((t) => ({ value: String(t.id), label: t.name })),
                                                            ]}
                                                            placeholder="Sin impuesto"
                                                            searchPlaceholder="Buscar impuesto..."
                                                            className="h-8 text-xs bg-white"
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-2 py-2 align-middle">
                                                    <Input
                                                        type="text"
                                                        value={line.description}
                                                        onChange={(e) => updateLineDescription(line.key, e.target.value)}
                                                        placeholder="Opcional"
                                                        className="h-8 text-xs"
                                                    />
                                                </td>
                                                <td className="px-2 py-2 align-middle">
                                                    <Input
                                                        type="number"
                                                        value={line.quantity}
                                                        disabled={isAnnulment}
                                                        onChange={(e) => updateLine(line.key, "quantity", Number(e.target.value) || 0)}
                                                        className="h-8 text-xs text-right"
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-right align-middle font-medium">$ {lineTotal.toLocaleString("es-CO")}</td>
                                                <td className="px-2 py-2 text-center align-middle">
                                                    {!isAnnulment && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLine(line.key)}
                                                            className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                                            title="Eliminar línea"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {!isAnnulment && (
                            <div className="p-3 bg-muted/10 border-t border-border flex justify-end">
                                <button
                                    type="button"
                                    onClick={addLine}
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                                >
                                    Agregar línea
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end text-sm font-semibold text-foreground">
                    Total (sin impuestos): $ {total.toLocaleString("es-CO")}
                </div>

                {/* AJUSTES GLOBALES */}
                {!isAnnulment && (
                    <div className="space-y-4 pt-6 border-t border-border">
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-semibold text-foreground">Ajustes Globales</h3>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[240px] bg-slate-900 text-white p-2.5 text-xs leading-relaxed rounded-lg">
                                    Aplica un descuento o recargo al total de la nota de ajuste. Puedes ingresar el valor en porcentaje (%) o como monto fijo ($) y agregar un motivo opcional.
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

                                <Input
                                    type="number"
                                    min={0}
                                    max={globalAdjValueType === "percentage" ? 100 : undefined}
                                    placeholder="Valor"
                                    value={globalAdjValue || ""}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        if (globalAdjValueType === "percentage" && val > 100) {
                                            showToast("El porcentaje no puede ser mayor al 100%", "warning");
                                            setGlobalAdjValue(0);
                                        } else {
                                            setGlobalAdjValue(val);
                                        }
                                    }}
                                    className="w-full bg-white h-9 text-sm border border-foreground/20 rounded-lg"
                                />

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
                )}

                {/* Notas / Razón */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Notas</label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Notas adicionales"
                            rows={3}
                            className="text-sm bg-white border-gray-200 hover:border-primary focus-visible:border-primary"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Razón {typeAdjustmentNoteId === 5 && <span className="text-primary">*</span>}
                        </label>
                        <Textarea
                            value={discrepancyDescription}
                            onChange={(e) => setDiscrepancyDescription(e.target.value)}
                            placeholder="Explica el motivo del ajuste (obligatorio si el concepto es 'Otros')"
                            rows={3}
                            className="text-sm bg-white border-gray-200 hover:border-primary focus-visible:border-primary"
                        />
                    </div>
                </div>
            </div>
            </div>
            </TooltipProvider>

            <CommentsAndReminders
                comments={comments}
                setComments={setComments}
                requiresSaveFirst={true}
            />

            <div className="sticky bottom-0 z-30 pt-6">
                <div className="bg-white border border-border rounded-xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-3 sm:p-5 flex flex-wrap items-center justify-end gap-3">
                    <Button variant="outline" onClick={() => router.push("/expenses/adjustment-notes")} className="cursor-pointer text-xs sm:text-sm">
                        Cancelar
                    </Button>

                    <div className="inline-flex">
                        <Button
                            onClick={handleSave}
                            disabled={loadingAction}
                            className="rounded-r-none bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer text-xs sm:text-sm"
                        >
                            {loadingAction ? "Guardando..." : "Guardar"}
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled={loadingAction} className="px-2 rounded-l-none border-l border-white/20 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 bg-white text-slate-700">
                                <DropdownMenuItem className="cursor-pointer hover:bg-slate-50" disabled={loadingAction} onClick={handleSave}>
                                    Guardar como borrador
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer hover:bg-slate-50" disabled={loadingAction} onClick={handleSaveAndSend}>
                                    Guardar y enviar a la DIAN
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <EditResolutionModal
                isOpen={isNumerationModalOpen}
                onClose={() => {
                    setIsNumerationModalOpen(false);
                    refetchResolutions();
                }}
                resolution={activeResolution || null}
            />
        </div>
    );
}
