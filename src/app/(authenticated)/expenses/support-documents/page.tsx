"use client";

import * as React from 'react';
import { SupportDocumentPageHeader } from '@/components/support-documents/SupportDocumentPageHeader';
import { SupportDocumentTable } from '@/components/support-documents/SupportDocumentTable';
import { ExportModal } from '@/components/support-documents/ExportModal';
import { useSupportDocumentsList, useDeleteSupportDocument } from '@/hooks/supportDocuments/useSupportDocuments';
import { showToast } from '@/components/sonner/CustomToaster';
import type { SupportDocumentSummary } from '@/types/supportDocument';

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

        columnFilters.forEach((f) => {
            if (f.value !== "" && f.value !== undefined && f.value !== null) {
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

    const deleteMutation = useDeleteSupportDocument();

    const documents: SupportDocumentSummary[] = data?.support_documents || (Array.isArray(data) ? data : []);
    const pagination = data?.pagination || {
        current_page: page,
        per_page: perPage,
        total: documents.length,
        last_page: Math.ceil(documents.length / perPage) || 1,
        from: documents.length > 0 ? (page - 1) * perPage + 1 : 0,
        to: Math.min(page * perPage, documents.length),
    };

    const handleDelete = async (id: number | string) => {
        if (!confirm("¿Estás seguro de eliminar este documento soporte?")) return;
        try {
            await deleteMutation.mutateAsync(id);
            showToast("Documento soporte eliminado correctamente", "success");
            refetch();
        } catch {
            showToast("Error al eliminar el documento soporte", "error");
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
                        onDelete={handleDelete}
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
