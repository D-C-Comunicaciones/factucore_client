"use client";

import * as React from 'react';
import { DebitNotePageHeader } from '@/components/debit-notes/DebitNotePageHeader';
import { DebitNotesTable } from '@/components/debit-notes/table/DebitNotesTable';
import { useQuery } from '@tanstack/react-query';
import { DebitNotesService } from '@/lib/debitNotes';
import { useDebounce } from '@/hooks/useDebounce';

export default function DebitNotesPage() {

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
        queryKey: ["debitNotes", page, perPage, debouncedSearch, activeFilters],
        queryFn: async () => {
            return await DebitNotesService.index({
                page,
                per_page: perPage,
                search: debouncedSearch,
                filters: activeFilters.join(','), // depends on backend
            });
        },
    });

    const dataObj = response?.data || response || {};
    const items = Array.isArray(dataObj.debit_notes)
        ? dataObj.debit_notes
        : (Array.isArray(response?.debit_notes) ? response.debit_notes : []);
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

                <DebitNotePageHeader />

                <div className="w-full">
                    <DebitNotesTable
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
