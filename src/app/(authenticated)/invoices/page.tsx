"use client";

import { StatCard } from '@/components/invoice/StatCard';
import { InvoiceTable } from '@/components/invoice/InvoiceTable';
import { useInvoicesList } from '@/hooks/invoices/useInvoices';
// import { useDebouncedQuery } from '@/hooks/useDebouncedQuery';
import { InvoicePageHeader } from '@/components/invoice/InvoicePageHeader';
import { X, MessageCircle, Clock } from 'lucide-react';
import type { InvoiceSummary } from '@/types/invoice';

interface FacturasVentaViewProps {
    onNavigate?: (view: string) => void;
}


import * as React from 'react';

export default function InvoicesPage({ onNavigate }: FacturasVentaViewProps) {
    // Estado de filtros y búsqueda
    const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
    const [search, setSearch] = React.useState("");

    // Construir objeto de filtros para el backend
    const filters = React.useMemo(() => {
        const obj: Record<string, any> = {};
        columnFilters.forEach(f => {
            obj[f.id] = f.value;
        });
        if (search) obj.customer = search;
        return obj;
    }, [columnFilters, search]);


    // Fetch de facturas usando los filtros directos (sin debounce)
    const { data, isLoading, isError } = useInvoicesList({ filters });

    // 🔥 aquí aseguras el tipo correcto
    const invoices: InvoiceSummary[] = data?.invoices ?? [];

    // Stats calculados desde la data real
    // Sin emisión: no aprobadas
    const statSinEmision = invoices.filter(inv => inv.status_dian.toLowerCase() === 'no aprobada').length;
    // Sin envío al cliente: no aprobadas
    const statSinEnvio = statSinEmision;
    // En proceso: saldo pendiente > 0
    const statEnProceso = invoices.filter(inv => Number(inv.pending_amount) > 0).length;

    const stats = [
        {
            icon: X,
            label: 'Sin emisión',
            value: statSinEmision,
            iconBgColor: 'bg-gray-100',
            iconColor: ''
        },
        {
            icon: MessageCircle,
            label: 'Sin envío al cliente',
            value: statSinEnvio,
            iconBgColor: 'bg-gray-100',
            iconColor: ''
        },
        {
            icon: Clock,
            label: 'En proceso',
            value: statEnProceso,
            iconBgColor: 'bg-gray-100',
            iconColor: ''
        }
    ];

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

                {/* Header */}
                <InvoicePageHeader onNavigate={onNavigate} />

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <StatCard key={index} stat={stat} />
                    ))}
                </div>

                {/* Table */}
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
                        />
                    )}
                </div>

            </div>
        </div>
    );
}