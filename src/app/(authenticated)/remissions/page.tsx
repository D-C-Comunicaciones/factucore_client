"use client";

import * as React from 'react';
import { StatCard } from '@/components/remission/StatCard';
import { RemissionTable } from '@/components/remission/RemissionTable';
import { useRemissionsList } from '@/hooks/remissions/useRemissions';
import { RemissionPageHeader } from '@/components/remission/RemissionPageHeader';
import { X, MessageCircle, Clock, Ban } from 'lucide-react';
import type { RemissionSummary } from '@/types/remission';

interface FacturasVentaViewProps {
    onNavigate?: (view: string) => void;
}

export default function RemissionsPage({ onNavigate }: FacturasVentaViewProps) {

    /* ===================== STATE ===================== */
    const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);
    const [fetchKey, setFetchKey] = React.useState(0);
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    // Reset pagination to page 1 when search or filters change
    React.useEffect(() => {
        setPage(1);
    }, [search, columnFilters]);

    /* ===================== BUILD PARAMS - DEFAULT PAGINATION ===================== */
    const params = React.useMemo(() => {
        const obj: Record<string, any> = {
            page: page,
            per_page: perPage,
        };

        columnFilters.forEach(f => {
            if (f.value !== "" && f.value !== undefined && f.value !== null && f.id !== 'overdue') {
                obj[f.id] = f.value;
            }
        });

        const hasCustomerFilter = columnFilters.some(f => f.id === 'customer' && f.value);
        const hasNumberFilter = columnFilters.some(f => f.id === 'number' && f.value);

        if (search && !hasCustomerFilter && !hasNumberFilter) {
            obj.search = search;
        }

        return obj;
    }, [columnFilters, search, page, perPage]);

    const paramsKey = JSON.stringify(params);

    const prevParamsKeyRef = React.useRef<string>('');

    React.useEffect(() => {
        if (prevParamsKeyRef.current !== paramsKey) {
            prevParamsKeyRef.current = paramsKey;
            setFetchKey(k => k + 1);
        }
    }, [paramsKey]);

    /* ===================== FETCH ===================== */
    const { data, isLoading, isFetching, isError, refetch } = useRemissionsList({
        params,
        enabled: true,
        fetchKey
    });

    const handleRefreshTable = React.useCallback(async () => {
        setIsRefreshing(true);

        try {
            await refetch();
        } finally {
            setIsRefreshing(false);
        }
    }, [refetch]);

    const remissions: RemissionSummary[] = data?.remissions ?? [];
    const pagination = data?.pagination ?? { current_page: 1, per_page: 10, total: 0, last_page: 1, from: 0, to: 0 };

    /* ===================== RENDER ===================== */
    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

                <RemissionPageHeader onNavigate={onNavigate} />



                <div className="w-full">
                    <RemissionTable
                        remissions={remissions}
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
                    />
                </div>

            </div>
        </div>
    );
}

