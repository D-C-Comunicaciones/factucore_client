"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDebitNote, useUpdateDebitNote } from "@/hooks/debitNotes/useDebitNotes";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ContactsService } from "@/lib/contacts";
import { showToast } from "@/components/sonner/CustomToaster";
import { ArrowLeft } from "lucide-react";

const APPROVED_STATUSES = ["APROBADA", "ACEPTADA", "PROCESADO CORRECTAMENTE", "AUTORIZADA"];

export default function DebitNoteEditPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string | number | undefined;

    const { data, isLoading, isError } = useDebitNote(id ?? "", { poll: false });
    const updateDebitNote = useUpdateDebitNote();

    const debitNote: any = data?.data?.debit_note || data?.debit_note || data?.debitNote;

    const [clientId, setClientId] = useState<string>("");
    const [clientOptions, setClientOptions] = useState<{ value: string; label: string }[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [note, setNote] = useState("");
    const [observation, setObservation] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (debitNote) {
            setClientId(String(debitNote.customer?.id ?? ""));
            setNote(debitNote.note ?? "");
            setObservation(debitNote.observation ?? "");
        }
    }, [debitNote]);

    useEffect(() => {
        const loadCustomers = async () => {
            setLoadingCustomers(true);
            try {
                const res = await ContactsService.list({ role: "customer" });
                let list: any[] = [];
                if (res && res.data) {
                    if (Array.isArray(res.data)) list = res.data;
                    else if (res.data.data && Array.isArray(res.data.data)) list = res.data.data;
                    else if (res.data.contacts && Array.isArray(res.data.contacts)) list = res.data.contacts;
                }
                setClientOptions(list.map((c: any) => ({
                    value: c.id.toString(),
                    label: c.registration_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.identification_number,
                })));
            } catch (e) {
                console.error("Error al cargar clientes:", e);
            } finally {
                setLoadingCustomers(false);
            }
        };
        loadCustomers();
    }, []);

    if (isLoading) {
        return <div className="py-10 text-center text-sm text-slate-500">Cargando nota débito...</div>;
    }
    if (isError || !debitNote) {
        return <div className="py-10 text-center text-red-500">No se pudo cargar la nota débito</div>;
    }

    const dianStatusName: string = (debitNote.dian_status_name || debitNote.dian_status?.name || "").toUpperCase();
    const isApproved = APPROVED_STATUSES.includes(dianStatusName);

    if (isApproved) {
        return (
            <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 text-center">
                <h1 className="text-xl sm:text-2xl font-semibold text-[#0F2843] mb-4">
                    Nota débito {debitNote.prefix || ""}{debitNote.number || debitNote.id}
                </h1>
                <div className="mb-4 text-red-600">Esta nota débito ya fue aprobada por la DIAN y no puede ser editada.</div>
                <Link href={`/expenses/debit-notes/${id}`}>
                    <Button variant="outline">Volver al detalle</Button>
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateDebitNote.mutateAsync({
                id: id!,
                data: {
                    customer: clientId ? { id: Number(clientId) } : undefined,
                    note,
                    observation,
                },
            });
            showToast("Nota débito actualizada", "success", "Éxito");
            router.push(`/expenses/debit-notes/${id}`);
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.data?.message || "No se pudo actualizar la nota débito";
            showToast(msg, "error", "Error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
            <Link href={`/expenses/debit-notes/${id}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" /> Volver al detalle
            </Link>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#0F2843] mb-6">
                Editar nota débito {debitNote.prefix || ""}{debitNote.number || debitNote.id}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Cliente</label>
                    <SearchableSelect
                        value={clientId}
                        onValueChange={setClientId}
                        options={clientOptions}
                        loading={loadingCustomers}
                        placeholder="Seleccionar cliente"
                        searchPlaceholder="Buscar cliente..."
                        emptyMessage="No se encontraron clientes."
                        className="w-full rounded-md"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Notas</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Observación</label>
                    <textarea
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        rows={3}
                        className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                    <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                        {isSaving ? "Guardando..." : "Guardar"}
                    </Button>
                    <Link href={`/expenses/debit-notes/${id}`} className="w-full sm:w-auto">
                        <Button variant="outline" type="button" className="w-full sm:w-auto">Cancelar</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
