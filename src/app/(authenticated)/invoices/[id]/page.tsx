"use client";
import { useParams } from "next/navigation";
import { useInvoice } from "@/hooks/invoices/useInvoices";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function InvoiceDetailPage() {
    const params = useParams();
    const id = params?.id;
    // Solo llamar useInvoice si id es string|number
    const enabled = typeof id === 'string' || typeof id === 'number';
    const { data, isLoading, isError } = useInvoice(enabled ? id : "");

    useEffect(() => {
        if (data?.message) {
            toast(data.message);
        }
    }, [data?.message]);

    if (!enabled) return <div className="py-10 text-center text-red-500">ID de factura inválido</div>;
    if (isLoading) return <div className="py-10 text-center">Cargando factura...</div>;
    if (isError || !data || !data.data || !data.data.bill) return <div className="py-10 text-center text-red-500">No se pudo cargar la factura</div>;

    const bill = data.data.bill;
    const customer = data.data.customer;

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">Factura #{bill.number}</h1>
            <div className="mb-4">
                <div><b>Cliente:</b> {customer?.names || customer?.names || customer?.company || ""}</div>
                <div><b>Fecha de creación:</b> {bill.created_at || ""}</div>
                <div><b>Fecha de vencimiento:</b> {bill.payment_due_date || ""}</div>
                <div><b>Total:</b> $ {bill.total ? Number(bill.total).toLocaleString() : ''}</div>
                <div><b>Estado DIAN:</b> {data.dian?.estado_documento || ''}</div>
                <div><b>Estado interno:</b> {bill.status}</div>
            </div>
            <div className="flex gap-2 mt-6">
                {/* Solo mostrar botón de editar si la factura NO está aceptada por la DIAN */}
                {data.dian?.estado_documento?.toUpperCase() !== "ACEPTADA" && (
                    <Link href={`/invoices/${bill.id}/edit`}>
                        <Button>Editar</Button>
                    </Link>
                )}
                <Link href="/invoices">
                    <Button variant="outline">Volver</Button>
                </Link>
            </div>
        </div>
    );
}
