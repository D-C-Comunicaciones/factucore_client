"use client";

import { useState } from "react";
import { CreditCard, Receipt, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/sonner/CustomToaster";
import {
    useCreateBillPayment,
    useDeleteBillPayment,
    useCreateBillDebitNote,
    useDeleteBillDebitNote,
} from "@/hooks/bills/useBills";

function EmptyTabMessage({ icon, message, description }: { icon: React.ReactNode; message: string; description: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="opacity-40">{icon}</div>
            <p className="text-sm font-semibold text-slate-600">{message}</p>
            <p className="text-xs text-slate-400 max-w-xs">{description}</p>
        </div>
    );
}

interface BillDetailTabsProps {
    bill: any;
    initialTab?: string;
}

export function BillDetailTabs({ bill, initialTab }: BillDetailTabsProps) {
    const payments: any[] = bill?.payments || [];
    const debitNotes: any[] = bill?.debit_notes || [];

    const tabs = [
        { key: "pagos", label: "Pagos", icon: <CreditCard className="w-4 h-4" />, count: payments.length },
        { key: "notas_debito", label: "Notas débito", icon: <Receipt className="w-4 h-4" />, count: debitNotes.length },
    ];

    const [activeTab, setActiveTab] = useState(initialTab === "debit_notes" ? "notas_debito" : "pagos");
    const [isAddingPayment, setIsAddingPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
    const [isAddingDebitNote, setIsAddingDebitNote] = useState(false);
    const [debitNoteReason, setDebitNoteReason] = useState("");
    const [debitNoteAmount, setDebitNoteAmount] = useState("");

    const createPayment = useCreateBillPayment();
    const deletePayment = useDeleteBillPayment();
    const createDebitNote = useCreateBillDebitNote();
    const deleteDebitNote = useDeleteBillDebitNote();

    const balance = Number(bill?.balance ?? 0);

    const handleAddPayment = async () => {
        const amount = Number(paymentAmount);
        if (!amount || amount <= 0) {
            showToast("Ingresa un monto válido", "error");
            return;
        }
        try {
            await createPayment.mutateAsync({ id: bill.id, data: { amount, payment_date: paymentDate } });
            showToast("Pago registrado correctamente", "success");
            setIsAddingPayment(false);
            setPaymentAmount("");
        } catch (error: any) {
            showToast(error?.message || "Error al registrar el pago", "error");
        }
    };

    const handleDeletePayment = async (paymentId: number) => {
        if (!confirm("¿Eliminar este pago? El saldo pendiente de la factura se recalculará.")) return;
        try {
            await deletePayment.mutateAsync({ id: bill.id, paymentId });
            showToast("Pago eliminado correctamente", "success");
        } catch (error: any) {
            showToast(error?.message || "Error al eliminar el pago", "error");
        }
    };

    const handleAddDebitNote = async () => {
        const amount = Number(debitNoteAmount);
        if (!amount || amount <= 0) {
            showToast("Ingresa un monto válido", "error");
            return;
        }
        if (!debitNoteReason.trim()) {
            showToast("Ingresa el motivo de la nota débito", "error");
            return;
        }
        try {
            await createDebitNote.mutateAsync({ id: bill.id, data: { reason: debitNoteReason, amount } });
            showToast("Nota débito registrada correctamente", "success");
            setIsAddingDebitNote(false);
            setDebitNoteReason("");
            setDebitNoteAmount("");
        } catch (error: any) {
            showToast(error?.message || "Error al registrar la nota débito", "error");
        }
    };

    const handleDeleteDebitNote = async (debitNoteId: number) => {
        if (!confirm("¿Eliminar esta nota débito?")) return;
        try {
            await deleteDebitNote.mutateAsync({ id: bill.id, debitNoteId });
            showToast("Nota débito eliminada correctamente", "success");
        } catch (error: any) {
            showToast(error?.message || "Error al eliminar la nota débito", "error");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex flex-wrap border-b border-slate-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`
                            flex items-center gap-2 px-5 py-4 cursor-pointer whitespace-nowrap transition-all text-sm font-medium
                            ${activeTab === tab.key
                                ? 'text-primary border-b-2 border-primary -mb-px bg-primary/5'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-b-2 border-transparent'
                            }
                        `}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                            <span className={`
                                inline-flex items-center justify-center text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[20px]
                                ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}
                            `}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="p-6">
                {/* ── PAGOS ── */}
                {activeTab === "pagos" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-500">
                                Saldo pendiente: <span className="font-semibold text-slate-700">$ {balance.toLocaleString("es-CO")}</span>
                            </p>
                            {balance > 0 && !isAddingPayment && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => { setIsAddingPayment(true); setPaymentAmount(String(balance)); }}
                                    className="text-xs cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                                    Registrar pago
                                </Button>
                            )}
                        </div>

                        {isAddingPayment && (
                            <div className="bg-slate-50/70 border border-border rounded-lg p-4 flex flex-wrap items-end gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-slate-600">Monto</label>
                                    <Input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        className="h-9 w-36 text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-slate-600">Fecha</label>
                                    <Input
                                        type="date"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        className="h-9 text-sm"
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    onClick={handleAddPayment}
                                    disabled={createPayment.isPending}
                                    className="h-9 text-xs cursor-pointer"
                                >
                                    {createPayment.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Guardar pago"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsAddingPayment(false)}
                                    className="h-9 text-xs cursor-pointer"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        )}

                        {payments.length === 0 ? (
                            <EmptyTabMessage
                                icon={<CreditCard className="w-10 h-10 text-slate-300" />}
                                message="Sin registros aún"
                                description="Los pagos registrados para esta factura de compra aparecerán aquí."
                            />
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                        <tr>
                                            <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                            <th className="py-3.5 px-4 text-center">Pago #</th>
                                            <th className="py-3.5 px-4 text-right">Monto</th>
                                            <th className="py-3.5 px-4 text-center rounded-tr-md"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((p: any, idx: number) => (
                                            <tr key={p.id || idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                <td className="py-3.5 px-4 text-slate-800 font-medium">{p.payment_date || p.created_at || "-"}</td>
                                                <td className="py-3.5 px-4 text-center text-slate-700 font-medium">
                                                    {p.prefix != null ? `${p.prefix}${p.number}` : (p.number || p.id || "-")}
                                                </td>
                                                <td className="py-3.5 px-4 text-right text-slate-700 font-medium">
                                                    $ {Number(p.amount || 0).toLocaleString("es-CO")}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <button
                                                        onClick={() => handleDeletePayment(p.id)}
                                                        className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                                        title="Eliminar pago"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── NOTAS DÉBITO ── */}
                {activeTab === "notas_debito" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-end">
                            {!isAddingDebitNote && (
                                <Button size="sm" variant="outline" onClick={() => setIsAddingDebitNote(true)} className="text-xs cursor-pointer">
                                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Registrar nota débito
                                </Button>
                            )}
                        </div>

                        {isAddingDebitNote && (
                            <div className="bg-slate-50/70 border border-border rounded-lg p-4 flex flex-wrap items-end gap-3">
                                <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
                                    <label className="text-xs font-medium text-slate-600">Motivo</label>
                                    <Input value={debitNoteReason} onChange={(e) => setDebitNoteReason(e.target.value)} placeholder="Ej. Interés de mora" className="h-9 text-sm" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-slate-600">Monto</label>
                                    <Input type="number" value={debitNoteAmount} onChange={(e) => setDebitNoteAmount(e.target.value)} className="h-9 w-36 text-sm" />
                                </div>
                                <Button size="sm" onClick={handleAddDebitNote} disabled={createDebitNote.isPending} className="h-9 text-xs cursor-pointer">
                                    {createDebitNote.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Guardar"}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setIsAddingDebitNote(false)} className="h-9 text-xs cursor-pointer">
                                    Cancelar
                                </Button>
                            </div>
                        )}

                        {debitNotes.length === 0 ? (
                            <EmptyTabMessage
                                icon={<Receipt className="w-10 h-10 text-slate-300" />}
                                message="Sin registros aún"
                                description="Las notas débito registradas para esta factura de compra aparecerán aquí."
                            />
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                        <tr>
                                            <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                            <th className="py-3.5 px-4">Motivo</th>
                                            <th className="py-3.5 px-4 text-right">Monto</th>
                                            <th className="py-3.5 px-4 text-center rounded-tr-md"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {debitNotes.map((dn: any) => (
                                            <tr key={dn.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                <td className="py-3.5 px-4 text-slate-800 font-medium">{dn.issue_date}</td>
                                                <td className="py-3.5 px-4 text-slate-700">{dn.reason}</td>
                                                <td className="py-3.5 px-4 text-right font-medium">$ {Number(dn.amount).toLocaleString("es-CO")}</td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <button
                                                        onClick={() => handleDeleteDebitNote(dn.id)}
                                                        className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                                        title="Eliminar nota débito"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
