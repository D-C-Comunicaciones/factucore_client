"use client";


import { useParams, useRouter } from "next/navigation";
import { useInvoice, useUpdateInvoice } from "@/hooks/invoices/useInvoices";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Invoice } from "@/types/invoice";


export default function InvoiceEditPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string | number | undefined;
    const { data, isLoading, isError } = useInvoice(id ?? "");
    const updateInvoice = useUpdateInvoice();
    // El backend retorna un objeto con los datos de la factura
    const invoice: any = data && typeof data === 'object' ? data : undefined;
    // El formulario debe ser Partial<Invoice> y mapear los campos editables reales
    const [form, setForm] = useState<Partial<Invoice>>({ contact_id: undefined, observation: "" });

    useEffect(() => {
        if (invoice) {
            setForm({
                contact_id: invoice.contact_id ?? invoice.customer?.id,
                observation: invoice.observation ?? ""
            });
        }
    }, [invoice]);

    if (isLoading) return <div className="py-10 text-center">Cargando factura...</div>;
    if (isError || !invoice) return <div className="py-10 text-center text-red-500">No se pudo cargar la factura</div>;
    // Bloquear edición si la factura está aceptada por la DIAN
    if ((invoice.estadoDian || invoice.dian_status)?.toUpperCase() === "ACEPTADA") {
        return (
            <div className="max-w-2xl mx-auto py-10 px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Factura #{invoice.numero || invoice.number || invoice.id}</h1>
                <div className="mb-4 text-red-600">Esta factura ya fue aceptada por la DIAN y no puede ser editada.</div>
                <Link href={`/invoices/${id}`}>
                    <Button variant="outline">Volver al detalle</Button>
                </Link>
            </div>
        );
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateInvoice.mutateAsync({ id: id!, data: { ...form, invoice_status_id: 2 } });
        router.push(`/invoices/${id}`);
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">Editar Factura #{invoice.numero || invoice.number || invoice.id}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Cliente ID</label>
                    <input
                        name="contact_id"
                        type="number"
                        value={form.contact_id ?? ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                {/* El campo 'total' no es editable y no existe en el tipo Invoice, así que se elimina del formulario */}
                <div>
                    <label className="block text-sm font-medium mb-1">Observación</label>
                    <input
                        name="observation"
                        value={form.observation ?? ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="flex gap-2 mt-6">
                    <Button type="submit" disabled={updateInvoice.isPending}>Guardar</Button>
                    <Link href={`/invoices/${id}`}>
                        <Button variant="outline" type="button">Cancelar</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
