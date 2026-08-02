"use client";

import * as React from 'react';
import { ReturnPageHeader } from '@/components/returns/ReturnPageHeader';
import { ReturnsTable } from '@/components/returns/table/ReturnsTable';
import { useQuery } from '@tanstack/react-query';
import { CreditNotesService } from '@/lib/creditNotes';
import { useDebounce } from '@/hooks/useDebounce';

export default function ReturnsPage() {

    /* ===================== STATE ===================== */
    const [search, setSearch] = React.useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);

    // Reset a página 1 cuando cambia búsqueda o filtros
    React.useEffect(() => {
        setPage(1);
    }, [debouncedSearch, activeFilters]);

    /* ===================== API ===================== */
    const { data: response, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["creditNotes", page, perPage, debouncedSearch, activeFilters],
        queryFn: async () => {
            return await CreditNotesService.index({
                page,
                per_page: perPage,
                search: debouncedSearch,
                filters: activeFilters.join(','), // depends on backend
            });
        },
    });

    const dataObj = response?.data || response || {};
    const items = Array.isArray(dataObj.credit_notes) 
        ? dataObj.credit_notes 
        : (Array.isArray(response?.credit_notes) ? response.credit_notes : []);
    const meta = dataObj;

    const pagination = {
        current_page: meta.current_page || page,
        per_page: meta.per_page || perPage,
        total: meta.total || 0,
        last_page: meta.last_page || 1,
        from: meta.from || 0,
        to: meta.to || 0,
    };

    /* ===================== RENDER ===================== */
    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

                <ReturnPageHeader />

                <div className="w-full">
                    <ReturnsTable
                        search={search}
                        setSearch={setSearch}
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                        page={page}
                        setPage={setPage}
                        perPage={perPage}
                        setPerPage={setPerPage}
                        pagination={pagination}
                        loading={isLoading}
                        refreshing={isFetching}
                        onRefresh={() => refetch()}
                        items={items}
                    />
                </div>

            </div>
        </div>
    );
}
