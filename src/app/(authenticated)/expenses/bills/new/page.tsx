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

    const handleSave = async (action: "save" | "save_and_pay" | "save_and_new" = "save") => {
        if (!validateForm()) return;

        const payload: any = {
            bill_number: formState.bill_number,
            contact_id: formState.contact_id,
            issue_date: formState.issue_date,
            due_date: formState.due_date,
            payment_form_id: formState.payment_form_id,
            warehouse_id: formState.warehouse_id ? Number(formState.warehouse_id) : null,
            cost_center_id: formState.cost_center_id ? Number(formState.cost_center_id) : null,
            physical_document_number: formState.physical_document_number,
            terms_conditions: formState.terms_conditions,
            notes: formState.notes,
            items: builder.items.map((item) => ({
                item_id: item.item_id,
                name: item.item,
                description: item.description,
                reference_code: item.referencia,
                quantity: Number(item.cantidad) || 1,
                price: Number(item.precio) || 0,
                discount: Number(item.discountValue) || 0,
                discount_type: item.discountType || "percentage",
                tax_id: item.taxObj?.id || null,
            })),
            withholdings: builder.withholdings,
            purchase_orders: builder.purchaseOrders,
            global_adjustments: builder.globalAdjustments,
            subtotal: builder.totals.subtotal,
            discounts_total: builder.totals.discountsAmount,
            taxes_total: builder.totals.taxesAmount,
            withholdings_total: builder.totals.withholdingsAmount,
            total: builder.totals.payableAmount,
        };

        createBillMutation.mutate(payload, {
            onSuccess: (res: any) => {
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
                    const billId = res?.data?.bill?.id || res?.data?.id;
                    if (billId) {
                        router.push(`/gastos/pagos/new?bill_id=${billId}`);
                    } else {
                        router.push("/expenses/bills");
                    }
                } else {
                    router.push("/expenses/bills");
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
