"use client"
import { StatCard } from '@/components/invoice/StatCard';
import { InvoiceTable } from '@/components/invoice/InvoiceTable';
import { invoiceStatsMock, invoicesMock } from '@/data/InvoiceMockData';
import { InvoicePageHeader } from '@/components/invoice/InvoicePageHeader';

interface FacturasVentaViewProps {
    onNavigate?: (view: string) => void;
}

export default function InvoicesPage({ onNavigate }: FacturasVentaViewProps) {
    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8">
                {/* Título y acciones */}
                <InvoicePageHeader onNavigate={onNavigate} />

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {invoiceStatsMock.map((stat, index) => (
                        <StatCard key={index} stat={stat} />
                    ))}
                </div>

                {/* Tabla */}
                <InvoiceTable 
                    invoices={invoicesMock}
                />
            </div>
        </div>
    );
}