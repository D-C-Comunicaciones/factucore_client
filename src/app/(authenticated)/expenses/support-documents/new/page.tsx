"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NewSupportDocumentHeader } from "@/components/support-documents/new/NewSupportDocumentHeader";
import { NewSupportDocumentOptions } from "@/components/support-documents/new/NewSupportDocumentOptions";
import { NewSupportDocumentMain } from "@/components/support-documents/new/NewSupportDocumentMain";
import { NewSupportDocumentFooter } from "@/components/support-documents/new/NewSupportDocumentFooter";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { useSupportDocumentBuilder } from "@/hooks/supportDocuments/useSupportDocumentBuilder";
import { useCreateSupportDocument } from "@/hooks/supportDocuments/useSupportDocuments";
import { SupportDocumentsService } from "@/lib/supportDocuments";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useResolutions } from "@/hooks/useResolutions";
import { costCentersApi } from "@/lib/costCenters";
import { AuthService } from "@/lib/auth";
import { getSession } from "@/common/interfaces/session";
import { useQuery } from "@tanstack/react-query";
import { showToast } from "@/components/sonner/CustomToaster";
import type { Resolution } from "@/lib/resolutions";

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

    // Resolution for Documento Soporte (type_resolution: 10 or from active resolutions)
    const { resolutions, refetch: refetchResolutions } = useResolutions({
        is_active: true,
    });
    const [selectedResolutionId, setSelectedResolutionId] = useState<number | null>(null);

    // Set default resolution
    useEffect(() => {
        if (resolutions && resolutions.length > 0) {
            const valid = resolutions.find((r: Resolution) => r.id === selectedResolutionId);
            if (!valid) {
                const supportRes = resolutions.find((r: Resolution) => r.type_resolution_id === 10 || r.name?.toLowerCase().includes("soporte")) || resolutions[0];
                setSelectedResolutionId(supportRes.id);
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

    const handleSaveAction = async (actionType: "SAVE" | "SEND" | "DRAFT" | "CREATE_NEW" | "SAVE_PAYMENT") => {
        if (!validateForm()) return;

        setLoadingGuardar(true);
        try {
            const session = getSession();

            const itemsPayload = builder.items.map((line) => {
                const qty = Number(line.cantidad) || 1;
                const price = Number(line.precio) || 0;
                let discountVal = 0;
                if (line.discountValue) {
                    discountVal = line.discountType === 'percentage'
                        ? (qty * price * Number(line.discountValue)) / 100
                        : Number(line.discountValue);
                }

                return {
                    item_id: line.item_id,
                    name: line.item,
                    description: line.description,
                    quantity: qty,
                    price_amount: price,
                    unit_measure_code: line.unit_measure_code || '94',
                    discount_amount: discountVal,
                    taxes: line.taxObj ? [{
                        tax_id: line.taxObj.id,
                        rate: line.taxObj.rate,
                        name: line.taxObj.name,
                    }] : [],
                };
            });

            const withholdingsPayload = builder.withholdings.map((w) => ({
                retention_id: w.retention_id,
                name: w.name,
                base: Number(w.base) || 0,
                percentage: Number(w.percentage) || 0,
                value: Number(w.value) || 0,
                is_assumed: Boolean(w.is_assumed),
            }));

            const purchaseOrderIds = builder.purchaseOrders
                .map((po) => po.purchase_order_id)
                .filter(Boolean);

            const payload: any = {
                resolution_id: selectedResolutionId,
                contact_id: formState.contact_id,
                user_id: session?.user?.id,
                currency_id: currency,
                warehouse_id: warehouseId ? Number(warehouseId) : undefined,
                cost_center_id: costCenterId ? Number(costCenterId) : undefined,
                physical_receipt_number: physicalReceiptNumber || undefined,
                operation_date: formState.operation_date,
                payment_form_id: formState.payment_form_id,
                payment_method_id: formState.payment_method_id,
                authorization_text: formState.authorization_text || undefined,
                notes: formState.notes || undefined,
                items: itemsPayload,
                withholdings: withholdingsPayload,
                purchase_order_ids: purchaseOrderIds.length > 0 ? purchaseOrderIds : undefined,
            };

            if (actionType === "SEND") {
                const res: any = await SupportDocumentsService.sendDirect(payload);
                showToast("Documento soporte enviado a la DIAN correctamente", "success");
                const newId = res?.data?.id || res?.id || res?.support_document?.id;
                if (newId) router.push(`/expenses/support-documents/${newId}`);
                else router.push("/expenses/support-documents");
            } else if (actionType === "DRAFT") {
                const res: any = await SupportDocumentsService.saveDraft(payload);
                showToast("Borrador de documento soporte guardado", "success");
                const newId = res?.data?.id || res?.id || res?.support_document?.id;
                if (newId) router.push(`/expenses/support-documents/${newId}`);
                else router.push("/expenses/support-documents");
            } else if (actionType === "CREATE_NEW") {
                await createDoc.mutateAsync(payload);
                showToast("Documento soporte guardado correctamente", "success");
                builder.reset();
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
            } else if (actionType === "SAVE_PAYMENT") {
                const res: any = await createDoc.mutateAsync(payload);
                showToast("Documento soporte guardado. Redirigiendo a pagos...", "success");
                const newId = res?.data?.id || res?.id || res?.support_document?.id;
                router.push(`/sales/payments/new?support_document_id=${newId || ''}`);
            } else {
                // Standard SAVE
                const res: any = await createDoc.mutateAsync(payload);
                showToast("Documento soporte guardado correctamente", "success");
                const newId = res?.data?.id || res?.id || res?.support_document?.id;
                if (newId) router.push(`/expenses/support-documents/${newId}`);
                else router.push("/expenses/support-documents");
            }
        } catch (error: any) {
            console.error(error);
            showToast(error?.response?.data?.message || "Error al guardar el documento soporte", "error");
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
