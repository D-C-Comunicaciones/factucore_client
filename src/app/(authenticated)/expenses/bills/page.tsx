"use client";

import React, { useState } from "react";
import { FileEdit, Clock, CheckCircle2, Ban } from "lucide-react";
import { StatCard } from "@/components/invoice/StatCard";
import { BillPageHeader } from "@/components/bills/BillPageHeader";
import { BillTable } from "@/components/bills/BillTable";
import { ExportModal } from "@/components/bills/ExportModal";
import { useBillsList, useCancelBill } from "@/hooks/bills/useBills";
import { showToast } from "@/components/sonner/CustomToaster";

export default function BillsPage() {
    // Table & Pagination states
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState("");

    // Modals state
    const [isExportOpen, setIsExportOpen] = useState(false);

    // Queries & Mutations
    const { data, isLoading, isFetching, refetch } = useBillsList({
        params: { page, per_page: perPage, search: search.trim() || undefined },
    });
    const cancelBillMutation = useCancelBill();

    const bills = data?.bills || [];
    const pagination = data?.pagination || {
        current_page: page,
        per_page: perPage,
        total: bills.length,
        last_page: Math.ceil(bills.length / perPage) || 1,
        from: bills.length > 0 ? (page - 1) * perPage + 1 : 0,
        to: Math.min(page * perPage, bills.length),
    };

    const getStatusCode = (bill: any): string => String(bill.bill_status?.code || "").toUpperCase();

    const statBorrador = bills.filter((b: any) => getStatusCode(b) === "BORRADOR").length;
    const statPorPagar = bills.filter((b: any) => getStatusCode(b) === "POR_PAGAR" || getStatusCode(b) === "GUARDADO").length;
    const statPagadas = bills.filter((b: any) => getStatusCode(b) === "PAGADO").length;
    const statAnuladas = bills.filter((b: any) => getStatusCode(b) === "ANULADO").length;

    const stats = [
        { icon: FileEdit, label: "Borrador", value: statBorrador, iconBgColor: "bg-gray-100", iconColor: "" },
        { icon: Clock, label: "Por pagar", value: statPorPagar, iconBgColor: "bg-gray-100", iconColor: "" },
        { icon: CheckCircle2, label: "Pagadas", value: statPagadas, iconBgColor: "bg-gray-100", iconColor: "" },
        { icon: Ban, label: "Anuladas", value: statAnuladas, iconBgColor: "bg-gray-100", iconColor: "" },
    ];

    const handleCancelBill = async (id: number | string) => {
        if (!window.confirm("¿Estás seguro de que deseas anular esta factura de compra?")) return;
        try {
            await cancelBillMutation.mutateAsync(id);
            showToast("Factura de compra anulada correctamente", "success");
        } catch (error: any) {
            showToast(error?.message || "Error al anular la factura de compra", "error");
        }
    };

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6">
                <BillPageHeader onExportClick={() => setIsExportOpen(true)} />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <StatCard key={index} stat={stat} />
                    ))}
                </div>

                <div className="w-full">
                    <BillTable
                        data={bills}
                        loading={isLoading || isFetching}
                        page={page}
                        setPage={setPage}
                        perPage={perPage}
                        setPerPage={setPerPage}
                        pagination={pagination}
                        search={search}
                        setSearch={(val) => {
                            setSearch(val);
                            setPage(1);
                        }}
                        onCancelBill={handleCancelBill}
                        onRefresh={() => refetch()}
                    />
                </div>

                <ExportModal
                    open={isExportOpen}
                    onOpenChange={setIsExportOpen}
                />
            </div>
        </div>
    );
}
