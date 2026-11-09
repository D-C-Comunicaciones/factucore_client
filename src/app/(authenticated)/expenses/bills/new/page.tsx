"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NewBillHeader } from "@/components/bills/new/NewBillHeader";
import { NewBillOptions } from "@/components/bills/new/NewBillOptions";
import { NewBillMain } from "@/components/bills/new/NewBillMain";
import { NewBillFooter } from "@/components/bills/new/NewBillFooter";
import { useBillBuilder } from "@/hooks/bills/useBillBuilder";
import { useCreateBill } from "@/hooks/bills/useBills";
import { useCatalogs } from "@/hooks/useCatalogs";
import { costCentersApi } from "@/lib/costCenters";
import { useQuery } from "@tanstack/react-query";
import { showToast } from "@/components/sonner/CustomToaster";

export default function NewBillPage() {
    const router = useRouter();
    const catalogs = useCatalogs();

    const { data: costCentersResp } = useQuery({
        queryKey: ['costCenters', { is_active: true }],
        queryFn: async () => await costCentersApi.getCostCenters({ is_active: true })
    });
    const costCentersData = Array.isArray(costCentersResp?.data?.['cost-centers'])
        ? costCentersResp?.data['cost-centers']
        : (Array.isArray(costCentersResp?.data) ? costCentersResp.data : []);

    // Top Options Visibility
    const [showWarehouse, setShowWarehouse] = useState(true);

    // Form State
    const [formState, setFormState] = useState<any>({
        bill_number: "",
        contact_id: null,
        supplier: null,
        identification: "",
        phone: "",
        issue_date: new Date().toISOString().split("T")[0],
        due_date: new Date().toISOString().split("T")[0],
        payment_form_id: 1,
        currency: "COP",
        warehouse_id: "1",
        cost_center_id: "",
        physical_document_number: "",
        terms_conditions: "",
        notes: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const builder = useBillBuilder();
    const createBillMutation = useCreateBill();

    const validateForm = () => {
        const errs: Record<string, string> = {};
        if (!formState.contact_id) {
            errs.contact_id = "Debes seleccionar un proveedor";
            showToast("Debes seleccionar un proveedor", "warning");
        }
        if (!formState.issue_date) {
            errs.issue_date = "Debes seleccionar una fecha de creación";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // Maps the UI's local form state (builder.items/withholdings/globalAdjustments) into
    // StoreBillRequest's actual contract: `lines` (not `items`), `allowance_charges`/
    // `withholding_taxes` at global or per-line scope (CalculationService's generic shape —
    // same as Support Document/Invoice use). warehouse_id/cost_center_id/payment_form_id are
    // real Bill columns and go through as-is; purchase_orders has no backend counterpart yet
    // and is intentionally left off the payload.
    const buildPayload = () => {
        const lines = builder.items.map((item) => {
            const allowanceCharges: any[] = [];
            const discVal = Number(item.discountValue) || 0;
            if (discVal > 0) {
                allowanceCharges.push({
                    scope: "line",
                    charge_indicator: false,
                    value_type: item.discountType || "percentage",
                    value: discVal,
                });
            }

            return {
                item_id: item.item_id ? Number(item.item_id) : undefined,
                description: item.description || item.item || undefined,
                quantity: Number(item.cantidad) || 1,
                price: Number(item.precio) || 0,
                taxes: item.taxObj?.tax_id ? [{ tax_id: Number(item.taxObj.tax_id), rate: Number(item.taxObj.rate ?? item.taxObj.percentage ?? 0) }] : [],
                allowance_charges: allowanceCharges.length > 0 ? allowanceCharges : undefined,
            };
        });

        const allowanceCharges = (builder.globalAdjustments || []).map((adj) => ({
            scope: "global" as const,
            charge_indicator: adj.type === "charge",
            value_type: adj.valueType,
            value: Number(adj.value) || 0,
            reason: adj.reason || undefined,
        }));

        const withholdingTaxes = (builder.withholdings || [])
            .filter((w) => w.retention_id)
            .map((w) => ({
                scope: "global" as const,
                tax_id: Number(w.retention_id),
                rate: Number(w.percentage) || 0,
            }));

        return {
            contact_id: formState.contact_id,
            bill_number: formState.bill_number || undefined,
            issue_date: formState.issue_date,
            due_date: formState.due_date || undefined,
            payment_form_id: formState.payment_form_id || undefined,
            warehouse_id: formState.warehouse_id ? Number(formState.warehouse_id) : undefined,
            cost_center_id: formState.cost_center_id ? Number(formState.cost_center_id) : undefined,
            physical_document_number: formState.physical_document_number || undefined,
            terms_conditions: formState.terms_conditions || undefined,
            notes: formState.notes || undefined,
            lines,
            allowance_charges: allowanceCharges.length > 0 ? allowanceCharges : undefined,
            withholding_taxes: withholdingTaxes.length > 0 ? withholdingTaxes : undefined,
        };
    };

    const handleSave = async (action: "save" | "save_and_pay" | "save_and_new" = "save") => {
        if (!validateForm()) return;

        const payload = buildPayload();

        createBillMutation.mutate(payload, {
            onSuccess: (bill: any) => {
                if (action === "save_and_new") {
                    setFormState({
                        bill_number: "",
                        contact_id: null,
                        supplier: null,
                        identification: "",
                        phone: "",
                        issue_date: new Date().toISOString().split("T")[0],
                        due_date: new Date().toISOString().split("T")[0],
                        payment_form_id: 1,
                        currency: "COP",
                        warehouse_id: "1",
                        cost_center_id: "",
                        physical_document_number: "",
                        terms_conditions: "",
                        notes: "",
                    });
                    builder.setItems([
                        {
                            id: `line-0-${Date.now()}`,
                            item_id: null,
                            item: "",
                            description: "",
                            referencia: "",
                            cantidad: 1,
                            precio: 0,
                            discountValue: 0,
                            discountType: "percentage",
                            taxObj: null,
                        },
                    ]);
                    builder.setWithholdings([]);
                    builder.setPurchaseOrders([]);
                } else if (action === "save_and_pay") {
                    router.push(bill?.id ? `/expenses/payments/new?type=bill&document_id=${bill.id}` : "/expenses/bills");
                } else {
                    router.push(bill?.id ? `/expenses/bills/${bill.id}` : "/expenses/bills");
                }
            },
        });
    };

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6">
                {/* Header */}
                <NewBillHeader
                    showWarehouse={showWarehouse}
                    setShowWarehouse={setShowWarehouse}
                />

                {/* Options Bar */}
                <NewBillOptions
                    warehouseId={formState.warehouse_id}
                    setWarehouseId={(val) => setFormState((prev: any) => ({ ...prev, warehouse_id: val }))}
                    showWarehouse={showWarehouse}
                    warehousesList={catalogs.warehouses || []}
                />

                {/* Main Document Form */}
                <NewBillMain
                    formState={formState}
                    setFormState={setFormState}
                    builder={builder}
                    errors={errors}
                />

                {/* Footer Buttons */}
                <NewBillFooter
                    onSave={handleSave}
                    saving={createBillMutation.isPending}
                />
            </div>
        </div>
    );
}
