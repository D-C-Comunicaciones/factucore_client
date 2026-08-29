"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BillPageHeader } from "@/components/bills/BillPageHeader";
import { BillTable } from "@/components/bills/BillTable";
import { ExportModal } from "@/components/bills/ExportModal";
import { ImportExcelModal } from "@/components/bills/ImportExcelModal";
import { UploadBillFileModal } from "@/components/bills/UploadBillFileModal";
import { useBillsList, useDeleteBill } from "@/hooks/bills/useBills";
import { BillsService } from "@/lib/bills";
import { showToast } from "@/components/sonner/CustomToaster";

export default function BillsPage() {
    const router = useRouter();

    // Table & Pagination states
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [appliedFilters, setAppliedFilters] = useState<any>({});

    // Modals state
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isImportExcelOpen, setIsImportExcelOpen] = useState(false);
    const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);

    // Queries & Mutations
    const { data, isLoading, isRefetching, refetch } = useBillsList({
        page,
        per_page: perPage,
        search: search.trim() || undefined,
        ...appliedFilters,
    });
    const deleteBillMutation = useDeleteBill();

    const bills = (data as any)?.bills || (Array.isArray(data) ? data : []);
    const pagination = (data as any)?.pagination || {
        current_page: page,
        per_page: perPage,
        total: bills.length,
        last_page: Math.ceil(bills.length / perPage) || 1,
        from: bills.length > 0 ? (page - 1) * perPage + 1 : 0,
        to: Math.min(page * perPage, bills.length),
    };

    const handleDeleteBill = async (id: number | string) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta factura de compra?")) {
            deleteBillMutation.mutate(id);
        }
    };

    const handleDownloadPdf = async (id: number | string) => {
        try {
            const blob = await BillsService.printPdfBlob(id);
            const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Factura_Compra_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            showToast("PDF descargado correctamente", "success");
        } catch (error: any) {
            showToast("Error al descargar el PDF", "error");
        }
    };

    const handleApplyFilters = (newFilters: any) => {
        setAppliedFilters(newFilters);
        setPage(1);
    };

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6">
                {/* Header */}
                <BillPageHeader
                    onExportClick={() => setIsExportOpen(true)}
                    onImportExcelClick={() => setIsImportExcelOpen(true)}
                    onUploadFileClick={() => setIsUploadFileOpen(true)}
                />

                {/* Table */}
                <div className="w-full">
                    <BillTable
                        data={bills}
                        loading={isLoading}
                        refreshing={isRefetching}
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
                        onDeleteBill={handleDeleteBill}
                        onApplyFilters={handleApplyFilters}
                        onRefresh={() => refetch()}
                    />
                </div>

                {/* Modals */}
                <ExportModal
                    open={isExportOpen}
                    onOpenChange={setIsExportOpen}
                />

                <ImportExcelModal
                    open={isImportExcelOpen}
                    onOpenChange={setIsImportExcelOpen}
                    onSuccess={() => refetch()}
                />

                <UploadBillFileModal
                    open={isUploadFileOpen}
                    onOpenChange={setIsUploadFileOpen}
                    onSuccess={(parsedData) => {
                        if (parsedData) {
                            router.push("/expenses/bills/new");
                        }
                    }}
                />
            </div>
        </div>
    );
}
