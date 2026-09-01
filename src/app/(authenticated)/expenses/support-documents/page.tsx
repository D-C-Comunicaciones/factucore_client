"use client";

import * as React from 'react';
import { SupportDocumentPageHeader } from '@/components/support-documents/SupportDocumentPageHeader';
import { SupportDocumentTable } from '@/components/support-documents/SupportDocumentTable';
import { ExportModal } from '@/components/support-documents/ExportModal';
import { useSupportDocumentsList, useCancelSupportDocument } from '@/hooks/supportDocuments/useSupportDocuments';
import { showToast } from '@/components/sonner/CustomToaster';
import type { SupportDocument } from '@/types/supportDocument';

export default function SupportDocumentsPage() {
    const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);
    const [fetchKey, setFetchKey] = React.useState(0);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);

    React.useEffect(() => {
        setPage(1);
    }, [search, columnFilters]);

    const params = React.useMemo(() => {
        const obj: Record<string, any> = {
            page,
            per_page: perPage,
        };

        if (search) {
            obj.search = search;
        }

        columnFilters.forEach((f: any) => {
            if (f.value === "" || f.value === undefined || f.value === null) return;
            if (Array.isArray(f.value) && f.value.length === 0) return;

            // The "issue_date"/"due_date" filter chips are a single-date picker (see
            // SupportDocumentFilterChips.tsx) — treat the picked date as an exact-day match by
            // sending it as both bounds of the backend's date_from/date_to range.
            if (f.id === "issue_date") {
                obj.date_from = f.value;
                obj.date_to = f.value;
            } else if (f.id === "due_date") {
                obj.due_date_from = f.value;
                obj.due_date_to = f.value;
            } else {
                obj[f.id] = f.value;
            }
        });

        return obj;
    }, [columnFilters, search, page, perPage]);

    const paramsKey = JSON.stringify(params);
    const prevParamsKeyRef = React.useRef<string>('');

    React.useEffect(() => {
        if (prevParamsKeyRef.current !== paramsKey) {
            prevParamsKeyRef.current = paramsKey;
            setFetchKey((k) => k + 1);
        }
    }, [paramsKey]);

    const { data, isLoading, isFetching, isError, refetch } = useSupportDocumentsList({
        params,
        enabled: true,
        fetchKey,
    });

    const handleRefreshTable = React.useCallback(async () => {
        setIsRefreshing(true);
        try {
            await refetch();
        } finally {
            setIsRefreshing(false);
        }
    }, [refetch]);

    const cancelMutation = useCancelSupportDocument();

    const documents: SupportDocument[] = data?.support_documents || (Array.isArray(data) ? data : []);
    const pagination = data?.pagination || {
        current_page: page,
        per_page: perPage,
        total: documents.length,
        last_page: Math.ceil(documents.length / perPage) || 1,
        from: documents.length > 0 ? (page - 1) * perPage + 1 : 0,
        to: Math.min(page * perPage, documents.length),
    };

    const handleCancel = async (id: number | string) => {
        if (!confirm("¿Estás seguro de anular este documento soporte? Esta acción no se puede deshacer.")) return;
        try {
            await cancelMutation.mutateAsync(id);
            showToast("Documento soporte anulado correctamente", "success");
            refetch();
        } catch (error: any) {
            showToast(error?.message || "Error al anular el documento soporte", "error");
        }
    };

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6">
                <SupportDocumentPageHeader onExport={() => setIsExportModalOpen(true)} />

                {/* Table */}
                <div className="w-full">
                    <SupportDocumentTable
                        documents={documents}
                        loading={isLoading || isFetching || isRefreshing}
                        refreshing={isRefreshing}
                        onRefresh={handleRefreshTable}
                        columnFilters={columnFilters}
                        setColumnFilters={setColumnFilters}
                        search={search}
                        setSearch={setSearch}
                        page={page}
                        setPage={setPage}
                        perPage={perPage}
                        setPerPage={setPerPage}
                        pagination={pagination}
                        isError={isError}
                        onCancel={handleCancel}
                    />
                </div>

                {/* Export Modal */}
                <ExportModal
                    isOpen={isExportModalOpen}
                    onClose={() => setIsExportModalOpen(false)}
                />
            </div>
        </div>
    );
}
