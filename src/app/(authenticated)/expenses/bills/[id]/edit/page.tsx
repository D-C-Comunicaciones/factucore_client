"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NewBillHeader } from "@/components/bills/new/NewBillHeader";
import { NewBillOptions } from "@/components/bills/new/NewBillOptions";
import { NewBillMain } from "@/components/bills/new/NewBillMain";
import { NewBillFooter } from "@/components/bills/new/NewBillFooter";
import { useBillBuilder } from "@/hooks/bills/useBillBuilder";
import { useBill, useUpdateBill } from "@/hooks/bills/useBills";
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

    const { data: billDetailData, isLoading: loadingBill } = useBill(billId);
    const billData = billDetailData?.bill;
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
            const contact = bill.contact;
            setFormState({
                bill_number: bill.bill_number || "",
                contact_id: bill.contact_id || contact?.id || null,
                supplier: contact || null,
                identification: contact?.identification_number || "",
                phone: contact?.phone || "",
                issue_date: bill.issue_date || new Date().toISOString().split("T")[0],
                due_date: bill.due_date || "",
                payment_form_id: bill.payment_form_id || 1,
                currency: "COP",
                warehouse_id: bill.warehouse_id ? String(bill.warehouse_id) : "",
                cost_center_id: bill.cost_center_id ? String(bill.cost_center_id) : "",
                physical_document_number: bill.physical_document_number || "",
                terms_conditions: bill.terms_conditions || "",
                notes: bill.notes || "",
            });

            if (bill.lines && bill.lines.length > 0) {
                builder.setItems(
                    bill.lines.map((line: any, index: number) => {
                        const firstTax = (line.taxes || [])[0];
                        return {
                            id: String(line.id || `line-${index}`),
                            item_id: line.product_id || null,
                            item: line.item_snapshot?.name || line.description || "",
                            description: line.description || "",
                            referencia: line.item_code || "",
                            cantidad: Number(line.quantity) || 1,
                            precio: Number(line.price) || 0,
                            discountValue: Number(line.discount) || 0,
                            discountType: "fixed" as const,
                            taxObj: firstTax ? { tax_id: firstTax.tax_id, name: firstTax.name, rate: Number(firstTax.percent) } : null,
                        };
                    })
                );
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

        const payload = {
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

        updateBillMutation.mutate(
            { id: billId, data: payload },
            {
                onSuccess: () => {
                    router.push(`/expenses/bills/${billId}`);
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
