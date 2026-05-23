"use client";

import * as React from 'react';
import { StatCard } from '@/components/invoice/StatCard';
import { InvoiceTable } from '@/components/invoice/InvoiceTable';
import { useInvoicesList } from '@/hooks/invoices/useInvoices';
import { useDebounce } from '@/hooks/useDebounce';
import { InvoicePageHeader } from '@/components/invoice/InvoicePageHeader';
import { X, MessageCircle, Clock } from 'lucide-react';
import type { InvoiceSummary } from '@/types/invoice';

interface FacturasVentaViewProps {
    onNavigate?: (view: string) => void;
}

export default function InvoicesPage({ onNavigate }: FacturasVentaViewProps) {

    /* ===================== STATE ===================== */
    const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);
    const [fetchKey, setFetchKey] = React.useState(0);
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const debouncedSearch = useDebounce(search, 600);

    /* ===================== BUILD PARAMS - ALWAYS DEFAULT PAGINATION ===================== */
    const params = React.useMemo(() => {
        const obj: Record<string, any> = {
            current_page: 1,
            per_page: 10,
        };

        columnFilters.forEach(f => {
            if (f.value !== "" && f.value !== undefined && f.value !== null && f.id !== 'overdue') {
                obj[f.id] = f.value;
            }
        });

        const hasCustomerFilter = columnFilters.some(f => f.id === 'customer' && f.value);
        const hasNumberFilter = columnFilters.some(f => f.id === 'number' && f.value);

        if (debouncedSearch && !hasCustomerFilter && !hasNumberFilter) {
            obj.search = debouncedSearch;
        }

        return obj;
    }, [columnFilters, debouncedSearch]);

    const paramsKey = JSON.stringify(params);

    const prevParamsKeyRef = React.useRef<string>('');

    React.useEffect(() => {
        if (prevParamsKeyRef.current !== paramsKey) {
            prevParamsKeyRef.current = paramsKey;
            setFetchKey(k => k + 1);
        }
    }, [paramsKey]);

    /* ===================== FETCH ===================== */
    const { data, isLoading, isFetching, isError, refetch } = useInvoicesList({ 
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

    const invoices: InvoiceSummary[] = data?.invoices ?? [];
    const pagination = data?.pagination ?? { current_page: 1, per_page: 10, total: 0, last_page: 1, from: 0, to: 0 };

    /* ===================== STATS ===================== */
    const statSinEmision = invoices.filter(inv => inv.status_dian.toLowerCase() === 'no aprobada').length;
    const statSinEnvio = statSinEmision;
    const statEnProceso = invoices.filter(inv => Number(inv.pending_amount) > 0).length;

    const stats = [
        { icon: X, label: 'Sin emisión', value: statSinEmision, iconBgColor: 'bg-gray-100', iconColor: '' },
        { icon: MessageCircle, label: 'Sin envío al cliente', value: statSinEnvio, iconBgColor: 'bg-gray-100', iconColor: '' },
        { icon: Clock, label: 'En proceso', value: statEnProceso, iconBgColor: 'bg-gray-100', iconColor: '' }
    ];

    /* ===================== RENDER ===================== */
    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

                <InvoicePageHeader onNavigate={onNavigate} />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <StatCard key={index} stat={stat} />
                    ))}
                </div>

                <div className="w-full">
                    <InvoiceTable
                        invoices={invoices}
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
