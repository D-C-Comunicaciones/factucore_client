"use client";

import * as React from 'react';
import { ReturnPageHeader } from '@/components/returns/ReturnPageHeader';
import { ReturnsTable } from '@/components/returns/table/ReturnsTable';

export default function ReturnsPage() {

    /* ===================== STATE ===================== */
    const [search, setSearch] = React.useState("");
    const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);

    // Reset a página 1 cuando cambia búsqueda o filtros
    React.useEffect(() => {
        setPage(1);
    }, [search, activeFilters]);

    /* ===================== PAGINATION (placeholder hasta conectar API) ===================== */
    const pagination = {
        current_page: page,
        per_page: perPage,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
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
                    />
                </div>

            </div>
        </div>
    );
}
