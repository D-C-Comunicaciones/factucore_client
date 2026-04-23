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

    const debouncedSearch = useDebounce(search, 600);

    /* ===================== RESET PAGE ON FILTER/SEARCH CHANGE ===================== */
    // Create a comprehensive filter key that includes both immediate and debounced states
    // for proper pagination reset handling
    const shouldResetPagination = React.useMemo(() => {
        // Build the actual params that would be sent to the API
        const params: Record<string, any> = {};
        
        columnFilters.forEach(f => {
            if (f.value !== "" && f.value !== undefined && f.value !== null) {
                params[f.id] = f.value;
            }
        });

        const hasCustomerFilter = columnFilters.some(f => f.id === 'customer' && f.value);
        const hasNumberFilter = columnFilters.some(f => f.id === 'number' && f.value);

        if (debouncedSearch && !hasCustomerFilter && !hasNumberFilter) {
            params.search = debouncedSearch;
        }
        
        return {
            shouldReset: Object.keys(params).length === 0 || 
                        // Also reset when params change from having values to being empty
                        JSON.stringify(params) !== JSON.stringify({}),
            paramsKey: JSON.stringify(params)
        };
    }, [columnFilters, debouncedSearch]);

    const prevParamsKeyRef = React.useRef<string>('');
    
    React.useEffect(() => {
        // Always reset pagination when filter parameters change
        // This handles both adding filters and clearing all filters
        if (prevParamsKeyRef.current !== shouldResetPagination.paramsKey) {
            prevParamsKeyRef.current = shouldResetPagination.paramsKey;
            setPage(1);
            setPerPage(10);
        }
    }, [shouldResetPagination.paramsKey]);

    // Also handle immediate search clearing for better UX
    React.useEffect(() => {
        if (search === "" && columnFilters.length === 0) {
            // Force reset even if debouncedSearch hasn't updated yet
            // This provides immediate feedback when clearing all filters
            const params: Record<string, any> = {};
            const paramsKey = JSON.stringify(params);
            if (prevParamsKeyRef.current !== paramsKey) {
                prevParamsKeyRef.current = paramsKey;
                setPage(1);
                setPerPage(10);
            }
        }
    }, [search, columnFilters]);

    /* ===================== BUILD PARAMS ===================== */
    const params = React.useMemo(() => {
        const obj: Record<string, any> = {
            current_page: page,
            per_page: perPage,
        };

        columnFilters.forEach(f => {
            if (f.value !== "" && f.value !== undefined && f.value !== null) {
                obj[f.id] = f.value;
            }
        });

        const hasCustomerFilter = columnFilters.some(f => f.id === 'customer' && f.value);
        const hasNumberFilter = columnFilters.some(f => f.id === 'number' && f.value);

        if (debouncedSearch && !hasCustomerFilter && !hasNumberFilter) {
            obj.search = debouncedSearch;
        }

        return obj;
    }, [columnFilters, debouncedSearch, page, perPage]);

    /* ===================== FETCH ===================== */
    const { data, isLoading, isError } = useInvoicesList({ 
        params,
        enabled: true // Always enabled since we control when params change
    });

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
                    {isError ? (
                        <div className="py-10 text-center text-red-500">
                            Error al cargar facturas
                        </div>
                    ) : (
                        <InvoiceTable
                            invoices={invoices}
                            loading={isLoading}
                            columnFilters={columnFilters}
                            setColumnFilters={setColumnFilters}
                            search={search}
                            setSearch={setSearch}
                            page={page}
                            setPage={setPage}
                            perPage={perPage}
                            setPerPage={setPerPage}
                            pagination={pagination}
                        />
                    )}
                </div>

            </div>
        </div>
    );
}
