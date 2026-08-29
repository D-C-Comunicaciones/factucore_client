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

    const { data: response, isLoading, isError } = useSupportDocument(id);
    const updateMutation = useUpdateSupportDocument();
    const catalogData = useCatalogs();

    const doc: any = response?.data || response?.support_document || response || null;

    const { resolutions, refetch: refetchResolutions } = useResolutions({ is_active: true });
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

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loadingGuardar, setLoadingGuardar] = useState(false);

    const builder = useSupportDocumentBuilder();
    const prefillAppliedRef = useRef(false);

    useEffect(() => {
        if (!prefillAppliedRef.current && doc) {
            prefillAppliedRef.current = true;

            const supplier = doc.supplier || doc.customer || doc.contact || {};
            const contactId = doc.contact_id || supplier.id;

            setFormState({
                contact_id: contactId,
                supplier,
                identification: supplier.identification_number
                    ? `${supplier.identification_number}${supplier.verification_digit != null ? `-${supplier.verification_digit}` : ''}`
                    : doc.supplier_identification || "",
                phone: supplier.phone1 || supplier.phone || doc.supplier_phone || "",
                operation_date: doc.operation_date || (doc.created_at ? doc.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
                payment_form_id: doc.payment_form_id || (doc.payment_form?.id) || 1,
                payment_method_id: doc.payment_method_id || (doc.payment_method?.id) || 10,
                authorization_text: doc.authorization_text || "",
                notes: doc.notes || doc.observation || "",
                comments: [],
            });

            if (doc.resolution_id) setSelectedResolutionId(doc.resolution_id);
            if (doc.currency_id) setCurrency(String(doc.currency_id));
            if (doc.warehouse_id) setWarehouseId(doc.warehouse_id);
            if (doc.cost_center_id) setCostCenterId(String(doc.cost_center_id));
            if (doc.physical_receipt_number) setPhysicalReceiptNumber(doc.physical_receipt_number);

            // Populate lines
            const rawLines = doc.items || doc.lines || doc.support_document_lines || [];
            if (rawLines.length > 0) {
                const mappedLines = rawLines.map((l: any, idx: number) => ({
                    id: String(l.id || `line-${idx}`),
                    item_id: l.item_id || null,
                    standard_code: l.standard_code || '',
                    item: l.name || l.item || '',
                    description: l.description || '',
                    referencia: l.referencia || '',
                    cantidad: l.quantity || l.cantidad || 1,
                    unit_measure_code: l.unit_measure_code || '94',
                    precio: Number(l.price_amount || l.precio || l.price || 0),
                    discountValue: Number(l.discount_amount || l.discountValue || 0),
                    discountType: 'fixed',
                    taxObj: l.tax || (l.taxes && l.taxes[0]) || null,
                    taxes: l.taxes || [],
                    allowance_charges: [],
                }));
                builder.setItems(mappedLines);
            }

            // Populate withholdings
            const rawWithholdings = doc.withholdings || doc.withholding_taxes || [];
            if (rawWithholdings.length > 0) {
                const mappedWithholdings = rawWithholdings.map((w: any, idx: number) => ({
                    id: String(w.id || `ret-${idx}`),
                    retention_id: String(w.retention_id || w.id || ''),
                    name: w.name || w.retention_name || '',
                    percentage: Number(w.percentage || 0),
                    base: Number(w.base || 0),
                    value: Number(w.value || 0),
                    is_assumed: Boolean(w.is_assumed),
                }));
                builder.setWithholdings(mappedWithholdings);
            }
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

    // Check if DIAN status is already approved
    const dianStatusName = typeof doc.status_dian === 'object' ? doc.status_dian?.name : String(doc.status_dian || '');
    if (dianStatusName?.toLowerCase().includes("aprobada") || dianStatusName?.toLowerCase().includes("approved") || dianStatusName?.toLowerCase().includes("aceptada")) {
        return (
            <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
                <h1 className="text-2xl font-bold text-foreground">
                    Documento soporte #{doc.prefix || ""}{doc.number || doc.id}
                </h1>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    Este documento soporte ya fue aceptado por la DIAN y no puede ser editado directamente.
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

            const payload: any = {
                contact_id: formState.contact_id,
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
            };

            await updateMutation.mutateAsync({ id, data: payload });
            showToast("Documento soporte actualizado correctamente", "success");
            router.push(`/expenses/support-documents/${id}`);
        } catch (err: any) {
            console.error(err);
            showToast(err?.response?.data?.message || "Error al actualizar el documento soporte", "error");
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
