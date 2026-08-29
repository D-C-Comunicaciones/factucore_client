"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NewBillHeader } from "@/components/bills/new/NewBillHeader";
import { NewBillOptions } from "@/components/bills/new/NewBillOptions";
import { NewBillMain } from "@/components/bills/new/NewBillMain";
import { NewBillFooter } from "@/components/bills/new/NewBillFooter";
import { useBillBuilder } from "@/hooks/bills/useBillBuilder";
import { useBillDetail, useUpdateBill } from "@/hooks/bills/useBills";
import { useCatalogs } from "@/hooks/useCatalogs";
import { costCentersApi } from "@/lib/costCenters";
import { useQuery } from "@tanstack/react-query";
import { showToast } from "@/components/sonner/CustomToaster";

export default function EditBillPage() {
    const router = useRouter();
    const params = useParams();
    const billId = params?.id as string;
    const catalogs = useCatalogs();

    const { data: costCentersResp } = useQuery({
        queryKey: ['costCenters', { is_active: true }],
        queryFn: async () => await costCentersApi.getCostCenters({ is_active: true })
    });
    const costCentersData = Array.isArray(costCentersResp?.data?.['cost-centers'])
        ? costCentersResp?.data['cost-centers']
        : (Array.isArray(costCentersResp?.data) ? costCentersResp.data : []);

    const { data: billData, isLoading: loadingBill } = useBillDetail(billId);
    const updateBillMutation = useUpdateBill();

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

    // Pre-populate data when loaded
    useEffect(() => {
        if (billData) {
            const bill = billData;
            setFormState({
                bill_number: bill.number || bill.bill_number || bill.consecutive || "",
                contact_id: bill.contact_id || bill.supplier?.id || bill.contact?.id || null,
                supplier: bill.supplier || bill.contact || null,
                identification:
                    bill.supplier?.identification_number ||
                    bill.contact?.identification_number ||
                    "",
                phone: bill.supplier?.phone || bill.contact?.phone || "",
                issue_date: bill.issue_date || bill.created_at || new Date().toISOString().split("T")[0],
                due_date: bill.due_date || new Date().toISOString().split("T")[0],
                payment_form_id: bill.payment_form_id || 1,
                currency: bill.currency || "COP",
                warehouse_id: bill.warehouse_id ? String(bill.warehouse_id) : "1",
                cost_center_id: bill.cost_center_id ? String(bill.cost_center_id) : "",
                physical_document_number: bill.physical_document_number || "",
                terms_conditions: bill.terms_conditions || "",
                notes: bill.notes || "",
            });

            if (bill.items && bill.items.length > 0) {
                builder.setItems(
                    bill.items.map((it: any, index: number) => ({
                        id: String(it.id || `line-${index}`),
                        item_id: it.item_id || it.id || null,
                        item: it.name || it.item || "",
                        description: it.description || "",
                        referencia: it.reference_code || it.referencia || "",
                        cantidad: Number(it.quantity ?? it.cantidad ?? 1),
                        precio: Number(it.price ?? it.cost ?? it.precio ?? 0),
                        discountValue: Number(it.discount ?? it.discountValue ?? 0),
                        discountType: it.discount_type || it.discountType || "percentage",
                        taxObj: it.tax || it.taxObj || null,
                    }))
                );
            }

            if (bill.withholdings && bill.withholdings.length > 0) {
                builder.setWithholdings(bill.withholdings);
            }

            if (bill.purchase_orders && bill.purchase_orders.length > 0) {
                builder.setPurchaseOrders(bill.purchase_orders);
            }

            if (bill.global_adjustments && bill.global_adjustments.length > 0) {
                builder.setGlobalAdjustments(bill.global_adjustments);
            }
        }
    }, [billData]);

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

    const handleSave = async () => {
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

        updateBillMutation.mutate(
            { id: billId, data: payload },
            {
                onSuccess: () => {
                    router.push("/expenses/bills");
                },
            }
        );
    };

    if (loadingBill) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-muted-foreground">Cargando factura de compra...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6">
                {/* Header */}
                <NewBillHeader
                    isEdit={true}
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
                    isEdit={true}
                    onSave={handleSave}
                    saving={updateBillMutation.isPending}
                />
            </div>
        </div>
    );
}
