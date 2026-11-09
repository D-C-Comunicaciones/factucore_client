"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { NewSupportDocumentHeader } from "@/components/support-documents/new/NewSupportDocumentHeader";
import { NewSupportDocumentOptions } from "@/components/support-documents/new/NewSupportDocumentOptions";
import { NewSupportDocumentMain } from "@/components/support-documents/new/NewSupportDocumentMain";
import { NewSupportDocumentFooter } from "@/components/support-documents/new/NewSupportDocumentFooter";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { useSupportDocument, useUpdateSupportDocument } from "@/hooks/supportDocuments/useSupportDocuments";
import { useSupportDocumentBuilder } from "@/hooks/supportDocuments/useSupportDocumentBuilder";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useResolutions } from "@/hooks/useResolutions";
import type { Resolution } from "@/lib/resolutions";
import type { SupportDocumentPayload, AllowanceCharge } from "@/types/supportDocument";
import { costCentersApi } from "@/lib/costCenters";
import { AuthService } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { showToast } from "@/components/sonner/CustomToaster";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditSupportDocumentPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const { data, isLoading, isError } = useSupportDocument(id);
    const updateMutation = useUpdateSupportDocument();
    const catalogData = useCatalogs();

    const doc: any = data?.support_document || null;

    const { resolutions, refetch: refetchResolutions } = useResolutions({ type_resolution: 10, is_active: true });
    const [selectedResolutionId, setSelectedResolutionId] = useState<number | null>(null);

    const storedCompany = AuthService.getCompany<any>();
    const companyName = storedCompany?.company_name || storedCompany?.name || "Andrés Leones";

    const [currency, setCurrency] = useState("COP");
    const [warehouseId, setWarehouseId] = useState<string | number | null>(null);
    const [costCenterId, setCostCenterId] = useState<string | null>(null);
    const [physicalReceiptNumber, setPhysicalReceiptNumber] = useState("");
    const [showCurrency, setShowCurrency] = useState(true);
    const [showWarehouse, setShowWarehouse] = useState(true);
    const [showCostCenter, setShowCostCenter] = useState(true);

    const { data: costCentersResp } = useQuery({
        queryKey: ['costCenters', { is_active: true }],
        queryFn: async () => await costCentersApi.getCostCenters({ is_active: true })
    });
    const costCentersData = Array.isArray(costCentersResp?.data?.['cost-centers'])
        ? costCentersResp?.data['cost-centers']
        : (Array.isArray(costCentersResp?.data) ? costCentersResp.data : []);
    const costCenterOptions = costCentersData.map((cc: any) => ({
        value: String(cc.id),
        label: cc.name,
    }));

    const [formState, setFormState] = useState<any>({
        contact_id: null,
        supplier: null,
        identification: "",
        phone: "",
        operation_date: new Date().toISOString().split("T")[0],
        payment_form_id: 1,
        payment_method_id: 10,
        authorization_text: "",
        notes: "",
        comments: [],
    });
    const [globalAdjustments, setGlobalAdjustments] = useState<any[]>([]);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loadingGuardar, setLoadingGuardar] = useState(false);

    const builder = useSupportDocumentBuilder();
    const prefillAppliedRef = useRef(false);

    useEffect(() => {
        if (!prefillAppliedRef.current && doc) {
            prefillAppliedRef.current = true;

            const contact = doc.contact || {};

            setFormState({
                contact_id: doc.contact_id || contact.id,
                supplier: contact,
                identification: contact.identification_number
                    ? `${contact.identification_number}${contact.verification_digit != null ? `-${contact.verification_digit}` : ''}`
                    : "",
                phone: contact.phone || "",
                operation_date: doc.issue_date || new Date().toISOString().split('T')[0],
                payment_form_id: 1,
                payment_method_id: 10,
                authorization_text: "",
                notes: doc.note || "",
                comments: [],
            });

            if (doc.resolution_id) setSelectedResolutionId(doc.resolution_id);

            // Populate lines
            const rawLines = doc.lines || [];
            if (rawLines.length > 0) {
                const mappedLines = rawLines.map((l: any, idx: number) => {
                    const firstTax = l.taxes && l.taxes[0];
                    return {
                        id: String(l.id || `line-${idx}`),
                        item_id: l.product_id || null,
                        standard_code: l.item_snapshot?.type_item_identification?.code || '',
                        item: l.item_snapshot?.name || l.description || '',
                        description: l.description || '',
                        referencia: l.item_code || '',
                        cantidad: Number(l.quantity) || 1,
                        unit_measure_code: l.item_snapshot?.unit_measure?.code || '94',
                        precio: Number(l.price) || 0,
                        discountValue: Number(l.discount) || 0,
                        discountType: 'fixed' as const,
                        taxObj: firstTax ? { tax_id: firstTax.tax_id, rate: Number(firstTax.percent), name: firstTax.name } : null,
                        taxes: (l.taxes || []).map((t: any) => ({ tax_id: t.tax_id, rate: Number(t.percent), name: t.name })),
                        allowance_charges: [],
                    };
                });
                builder.setItems(mappedLines);
            }

            // Global discounts/charges -> local "global adjustments" UI list
            const globalDiscounts = (doc.discounts || []).filter((d: any) => d.support_document_line_id === null);
            const globalCharges = (doc.charges || []).filter((c: any) => c.scope === 'global');
            const mappedAdjustments = [
                ...globalDiscounts.map((d: any, idx: number) => ({
                    id: `d-${d.id ?? idx}`,
                    type: 'discount' as const,
                    valueType: Number(d.percent) > 0 ? 'percentage' as const : 'fixed' as const,
                    value: Number(d.percent) > 0 ? Number(d.percent) : Number(d.amount),
                    reason: d.reason || '',
                })),
                ...globalCharges.map((c: any, idx: number) => ({
                    id: `c-${c.id ?? idx}`,
                    type: 'charge' as const,
                    valueType: Number(c.percent) > 0 ? 'percentage' as const : 'fixed' as const,
                    value: Number(c.percent) > 0 ? Number(c.percent) : Number(c.amount),
                    reason: c.reason || '',
                })),
            ];
            if (mappedAdjustments.length > 0) setGlobalAdjustments(mappedAdjustments);
        }
    }, [doc]);

    const activeResolution = resolutions.find((r: Resolution) => r.id === selectedResolutionId) || resolutions[0] || null;

    const warehouseOptions = (catalogData.warehouses || []).map((w: any) => ({
        value: String(w.id),
        label: w.name,
    }));

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                <p className="text-sm">Cargando documento soporte para editar...</p>
            </div>
        );
    }

    if (isError || !doc) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center py-20 text-center px-4">
                <h3 className="text-base font-semibold text-foreground mb-2">No se encontró el documento soporte</h3>
                <Button variant="outline" size="sm" onClick={() => router.push("/expenses/support-documents")}>
                    Volver a la lista
                </Button>
            </div>
        );
    }

    // Only BORRADOR/GUARDADO (and GUARDADO after a DIAN rejection) are editable — mirrors
    // SupportDocument::isEditable() on the backend.
    const statusCode = String(doc.support_document_status?.code || "").toUpperCase();
    const isEditable = (statusCode === "BORRADOR" || statusCode === "GUARDADO") && doc.dian_status_id !== 2;
    if (!isEditable) {
        return (
            <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
                <h1 className="text-2xl font-bold text-foreground">
                    Documento soporte #{doc.prefix || ""}{doc.number || doc.id}
                </h1>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    Este documento soporte ya fue enviado/aprobado por la DIAN y no puede ser editado directamente.
                </div>
                <Link href={`/expenses/support-documents/${id}`}>
                    <Button variant="outline">Volver al detalle</Button>
                </Link>
            </div>
        );
    }

    const handleSaveAction = async () => {
        if (!formState.contact_id) {
            showToast("El proveedor es requerido", "error");
            return;
        }

        setLoadingGuardar(true);
        try {
            const lines = builder.items.map((line) => {
                const allowanceCharges: AllowanceCharge[] = [];
                if (line.discountValue && Number(line.discountValue) > 0) {
                    allowanceCharges.push({
                        scope: "line",
                        charge_indicator: false,
                        value_type: line.discountType,
                        value: Number(line.discountValue),
                    });
                }

                return {
                    item_id: line.item_id ?? undefined,
                    description: line.description || line.item || undefined,
                    quantity: Number(line.cantidad) || 1,
                    price: Number(line.precio) || 0,
                    taxes: line.taxObj?.tax_id ? [{ tax_id: Number(line.taxObj.tax_id), rate: Number(line.taxObj.rate) || 0 }] : [],
                    allowance_charges: allowanceCharges.length > 0 ? allowanceCharges : undefined,
                };
            });

            const allowanceCharges: AllowanceCharge[] = globalAdjustments.map((adj) => ({
                scope: "global" as const,
                charge_indicator: adj.type === "charge",
                value_type: adj.valueType,
                value: Number(adj.value) || 0,
                reason: adj.reason || undefined,
            }));

            const withholdingTaxes = builder.withholdings
                .filter((w) => w.retention_id)
                .map((w) => ({
                    scope: "global" as const,
                    tax_id: Number(w.retention_id),
                    rate: Number(w.percentage) || 0,
                }));

            const payload: SupportDocumentPayload = {
                contact_id: formState.contact_id,
                resolution_id: selectedResolutionId ?? undefined,
                issue_date: formState.operation_date,
                note: formState.notes || undefined,
                lines,
                allowance_charges: allowanceCharges.length > 0 ? allowanceCharges : undefined,
                withholding_taxes: withholdingTaxes.length > 0 ? withholdingTaxes : undefined,
            };

            await updateMutation.mutateAsync({ id, data: payload });
            showToast("Documento soporte actualizado correctamente", "success");
            router.push(`/expenses/support-documents/${id}`);
        } catch (err: any) {
            console.error(err);
            showToast(err?.response?.data?.message || err?.message || "Error al actualizar el documento soporte", "error");
        } finally {
            setLoadingGuardar(false);
        }
    };

    return (
        <div className="w-full min-h-screen py-6 px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto space-y-6">
            <NewSupportDocumentHeader
                isEdit={true}
                documentNumber={`${doc.prefix || ""}${doc.number || doc.id}`}
                showCurrency={showCurrency}
                setShowCurrency={setShowCurrency}
                showWarehouse={showWarehouse}
                setShowWarehouse={setShowWarehouse}
                showCostCenter={showCostCenter}
                setShowCostCenter={setShowCostCenter}
            />

            <NewSupportDocumentOptions
                currency={currency}
                setCurrency={setCurrency}
                warehouseId={warehouseId}
                setWarehouseId={setWarehouseId}
                warehouseOptions={warehouseOptions}
                costCenterId={costCenterId}
                setCostCenterId={setCostCenterId}
                costCenterOptions={costCenterOptions}
                physicalReceiptNumber={physicalReceiptNumber}
                setPhysicalReceiptNumber={setPhysicalReceiptNumber}
                showCurrency={showCurrency}
                showWarehouse={showWarehouse}
                showCostCenter={showCostCenter}
            />

            <NewSupportDocumentMain
                companyName={companyName}
                activeResolution={activeResolution}
                resolutions={resolutions}
                selectedResolutionId={selectedResolutionId}
                setSelectedResolutionId={setSelectedResolutionId}
                onRefetchResolutions={refetchResolutions}
                formState={formState}
                setFormState={setFormState}
                builder={builder}
                errors={errors}
                globalAdjustments={globalAdjustments}
                setGlobalAdjustments={setGlobalAdjustments}
            />

            {/* Comments & Reminders */}
            <CommentsAndReminders
                type="support_document"
                commentableId={Number(id)}
                requiresSaveFirst={false}
            />

            <NewSupportDocumentFooter
                isEdit={true}
                onNavigate={() => router.push(`/expenses/support-documents/${id}`)}
                onSaveAction={handleSaveAction}
                loadingGuardar={loadingGuardar}
            />
        </div>
    );
}
