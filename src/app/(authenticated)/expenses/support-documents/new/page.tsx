"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NewSupportDocumentHeader } from "@/components/support-documents/new/NewSupportDocumentHeader";
import { NewSupportDocumentOptions } from "@/components/support-documents/new/NewSupportDocumentOptions";
import { NewSupportDocumentMain } from "@/components/support-documents/new/NewSupportDocumentMain";
import { NewSupportDocumentFooter } from "@/components/support-documents/new/NewSupportDocumentFooter";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { useSupportDocumentBuilder } from "@/hooks/supportDocuments/useSupportDocumentBuilder";
import { useCreateSupportDocument, useSaveDraftSupportDocument, useSendTestSupportDocument } from "@/hooks/supportDocuments/useSupportDocuments";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useResolutions } from "@/hooks/useResolutions";
import { costCentersApi } from "@/lib/costCenters";
import { AuthService } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { showToast } from "@/components/sonner/CustomToaster";
import type { Resolution } from "@/lib/resolutions";
import type { SupportDocumentPayload, AllowanceCharge } from "@/types/supportDocument";

export default function NewSupportDocumentPage() {
    return (
        <Suspense fallback={null}>
            <NewSupportDocumentContent />
        </Suspense>
    );
}

function NewSupportDocumentContent() {
    const router = useRouter();
    const catalogData = useCatalogs();
    const createDoc = useCreateSupportDocument();
    const saveDraftDoc = useSaveDraftSupportDocument();
    const sendTestDoc = useSendTestSupportDocument();

    // type_resolution: 10 = Documento Soporte — filtered server-side (ResolutionService::getAll())
    // rather than fetching every resolution and comparing type_resolution_id client-side: that
    // comparison is a strict `=== 10`, and the API can hand this field back as a string, which
    // silently fails the check and falls through to whatever resolution happened to come first
    // (this is exactly what was pointing new Documento Soporte drafts at the Notas Débito
    // resolution, with no visible error). Same fix already applied to the NAS "new" page.
    const { resolutions, refetch: refetchResolutions } = useResolutions({
        type_resolution: 10,
        is_active: true,
    });
    const [selectedResolutionId, setSelectedResolutionId] = useState<number | null>(null);

    // Set default resolution
    useEffect(() => {
        if (resolutions && resolutions.length > 0) {
            const valid = resolutions.find((r: Resolution) => r.id === selectedResolutionId);
            if (!valid) {
                const mainRes = resolutions.find((r: Resolution) => r.is_main) || resolutions[0];
                setSelectedResolutionId(mainRes.id);
            }
        }
    }, [resolutions]);

    const activeResolution = resolutions.find((r: Resolution) => r.id === selectedResolutionId) || resolutions[0] || null;
    const storedCompany = AuthService.getCompany<any>();
    const companyName = storedCompany?.company_name || storedCompany?.name || "Andrés Leones";

    // Top options state
    const [currency, setCurrency] = useState("COP");
    const [warehouseId, setWarehouseId] = useState<string | number | null>(null);
    const [costCenterId, setCostCenterId] = useState<string | null>(null);
    const [physicalReceiptNumber, setPhysicalReceiptNumber] = useState("");
    const [showCurrency, setShowCurrency] = useState(true);
    const [showWarehouse, setShowWarehouse] = useState(true);
    const [showCostCenter, setShowCostCenter] = useState(true);

    // Cost Centers
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

    // Form main state
    const [formState, setFormState] = useState<any>({
        contact_id: null,
        supplier: null,
        identification: "",
        phone: "",
        operation_date: new Date().toISOString().split("T")[0],
        payment_form_id: 1, // Contado
        payment_method_id: 10, // Efectivo
        authorization_text: "",
        notes: "",
        comments: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loadingGuardar, setLoadingGuardar] = useState(false);
    const [globalAdjustments, setGlobalAdjustments] = useState<any[]>([]);

    const builder = useSupportDocumentBuilder();

    const warehouseOptions = (catalogData.warehouses || []).map((w: any) => ({
        value: String(w.id),
        label: w.name,
    }));

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formState.contact_id) {
            newErrors.contact_id = "El proveedor es requerido";
            showToast("El proveedor es requerido", "error");
        }

        if (!builder.items || builder.items.length === 0) {
            newErrors.items = "Debe agregar al menos un ítem";
            showToast("Debe agregar al menos un ítem al documento soporte", "error");
        } else {
            const emptyItems = builder.items.some((it) => !it.item_id && !it.item);
            if (emptyItems) {
                newErrors.items = "Selecciona un producto en todas las filas";
                showToast("Por favor selecciona un producto o servicio en todas las filas", "error");
            }
            const invalidQty = builder.items.some((it) => !it.cantidad || Number(it.cantidad) <= 0);
            if (invalidQty) {
                newErrors.items = "Cantidad inválida";
                showToast("La cantidad debe ser mayor a 0 en todos los productos", "error");
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    /**
     * Maps the UI's rich local form state (builder.items/withholdings + globalAdjustments,
     * declared in NewSupportDocumentMain) into StoreSupportDocumentRequest's actual contract:
     * `lines` (not `items`), `allowance_charges`/`withholding_taxes` at global or per-line scope
     * (CalculationService's generic shape — see StoreSupportDocumentRequest::rules()), `issue_date`
     * (not `operation_date`), `note` (not `notes`). Fields the DS backend doesn't model at all yet
     * (warehouse, cost center, physical receipt number, payment form/method, purchase orders) are
     * intentionally left off the payload — the backend has no columns for them.
     */
    const buildPayload = (extra?: Partial<SupportDocumentPayload>): SupportDocumentPayload => {
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

        return {
            resolution_id: selectedResolutionId ?? undefined,
            contact_id: formState.contact_id,
            issue_date: formState.operation_date,
            note: formState.notes || undefined,
            lines,
            allowance_charges: allowanceCharges.length > 0 ? allowanceCharges : undefined,
            withholding_taxes: withholdingTaxes.length > 0 ? withholdingTaxes : undefined,
            ...extra,
        };
    };

    const resetForm = () => {
        builder.reset();
        setGlobalAdjustments([]);
        setFormState({
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
        refetchResolutions();
    };

    const handleSaveAction = async (actionType: "SAVE" | "SEND" | "DRAFT" | "CREATE_NEW" | "SAVE_PAYMENT") => {
        if (!validateForm()) return;

        setLoadingGuardar(true);
        try {
            const payload = buildPayload();

            if (actionType === "SEND") {
                const result = await sendTestDoc.mutateAsync(payload);
                showToast(result.message || "Documento soporte enviado en habilitación a la DIAN", "success");
                const newId = result.support_document?.id;
                router.push(newId ? `/expenses/support-documents/${newId}` : "/expenses/support-documents");
            } else if (actionType === "DRAFT") {
                const doc = await saveDraftDoc.mutateAsync(payload);
                showToast("Borrador de documento soporte guardado", "success");
                router.push(doc?.id ? `/expenses/support-documents/${doc.id}` : "/expenses/support-documents");
            } else if (actionType === "CREATE_NEW") {
                await createDoc.mutateAsync(payload);
                showToast("Documento soporte guardado correctamente", "success");
                resetForm();
            } else if (actionType === "SAVE_PAYMENT") {
                const doc = await createDoc.mutateAsync(payload);
                showToast("Documento soporte guardado. Redirigiendo a pagos...", "success");
                router.push(doc?.id ? `/expenses/support-documents/${doc.id}?tab=payments` : "/expenses/support-documents");
            } else {
                const doc = await createDoc.mutateAsync(payload);
                showToast("Documento soporte guardado correctamente", "success");
                router.push(doc?.id ? `/expenses/support-documents/${doc.id}` : "/expenses/support-documents");
            }
        } catch (error: any) {
            console.error(error);
            showToast(error?.response?.data?.message || error?.message || "Error al guardar el documento soporte", "error");
        } finally {
            setLoadingGuardar(false);
        }
    };

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6">
                <NewSupportDocumentHeader
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

            {/* Comments & Reminders - Locked on creation until saved */}
            <CommentsAndReminders
                comments={formState.comments || []}
                setComments={(c) => setFormState({ ...formState, comments: c })}
                requiresSaveFirst={true}
            />

            <NewSupportDocumentFooter
                onNavigate={() => router.push("/expenses/support-documents")}
                onSaveAction={handleSaveAction}
                loadingGuardar={loadingGuardar}
            />
            </div>
        </div>
    );
}
