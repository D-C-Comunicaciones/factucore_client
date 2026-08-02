import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Printer, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InvoiceDetailTabs({ 
    payments = [],
    creditNotes = [],
    remissions = [],
    invoiceTotal = 0
}: { 
    payments?: any[],
    creditNotes?: any[],
    remissions?: any[],
    invoiceTotal?: number
}) {
    type TabType = 'pagos' | 'remisiones' | 'notas_credito' | 'contabilidad';
    const [activeTab, setActiveTab] = useState<TabType>('pagos');
    const router = useRouter();

    const hasPayments = payments && payments.length > 0;
    const hasRemissions = remissions && remissions.length > 0;
    const hasCreditNotes = creditNotes && creditNotes.length > 0;

    // Set default active tab based on what data is available
    useEffect(() => {
        if (hasPayments) {
            setActiveTab('pagos');
        } else if (hasRemissions) {
            setActiveTab('remisiones');
        } else if (hasCreditNotes) {
            setActiveTab('notas_credito');
        } else {
            setActiveTab('contabilidad');
        }
    }, [hasPayments, hasRemissions, hasCreditNotes]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex border-b border-slate-100">
                {hasPayments && (
                    <button 
                        onClick={() => setActiveTab('pagos')}
                        className={`px-6 py-4 cursor-pointer transition-colors ${activeTab === 'pagos' ? 'font-medium text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Pagos recibidos
                    </button>
                )}
                {hasRemissions && (
                    <button 
                        onClick={() => setActiveTab('remisiones')}
                        className={`px-6 py-4 cursor-pointer transition-colors ${activeTab === 'remisiones' ? 'font-medium text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Remisiones
                    </button>
                )}
                {hasCreditNotes && (
                    <button 
                        onClick={() => setActiveTab('notas_credito')}
                        className={`px-6 py-4 cursor-pointer transition-colors ${activeTab === 'notas_credito' ? 'font-medium text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Notas de crédito
                    </button>
                )}
                <button 
                    onClick={() => setActiveTab('contabilidad')}
                    className={`px-6 py-4 cursor-pointer transition-colors ${activeTab === 'contabilidad' ? 'font-medium text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Contabilidad
                </button>
            </div>
            
            <div className="p-6">
                {activeTab === 'pagos' && hasPayments && (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                    <th className="py-3.5 px-4 text-center">Pago #</th>
                                    <th className="py-3.5 px-4 text-center">Estado #</th>
                                    <th className="py-3.5 px-4 text-center">Método de pago</th>
                                    <th className="py-3.5 px-4 text-right">Monto</th>
                                    <th className="py-3.5 px-4 rounded-tr-md">Observaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p, idx) => {
                                    const dateStr = p.payment_date || p.date || p.created_at;
                                    let formattedDate = '-';
                                    if (dateStr) {
                                        const d = new Date(dateStr);
                                        if (!isNaN(d.getTime())) {
                                            formattedDate = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                        } else {
                                            const parts = String(dateStr).split(/[-/]/);
                                            if (parts.length === 3 && parts[2].length === 4) {
                                                const newDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`);
                                                if (!isNaN(newDate.getTime())) {
                                                    formattedDate = newDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                                }
                                            } else {
                                                formattedDate = String(dateStr);
                                            }
                                        }
                                    }
                                    const paymentId = p.id;
                                    return (
                                        <tr
                                            key={p.id || idx}
                                            className="border-b border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
                                            onClick={() => paymentId && router.push(`/payments/${paymentId}`)}
                                        >
                                            <td className="py-3.5 px-4">
                                                <span className="text-slate-800 font-medium">{formattedDate}</span>
                                            </td>
                                            <td className="py-3.5 px-4 text-center text-slate-700 font-medium">{p.prefix != null ? `${p.prefix}${p.number}` : (p.number || p.id || '-')}</td>
                                            <td className="py-3.5 px-4 text-center text-slate-700">{p.status || 'Abierto'}</td>
                                            <td className="py-3.5 px-4 text-center text-slate-700">{p.payment_method?.name || p.payment_method || 'Efectivo'}</td>
                                            <td className="py-3.5 px-4 text-right text-slate-700 font-medium">
                                                $ {Number(p.amount || p.total || p.value || 0).toLocaleString('es-CO')}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-500">{p.observation || p.notes || ''}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'remisiones' && hasRemissions && (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                    <th className="py-3.5 px-4 text-center">Remisión #</th>
                                    <th className="py-3.5 px-4 text-center">Estado</th>
                                    <th className="py-3.5 px-4 text-right rounded-tr-md">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {remissions.map((r, idx) => {
                                    return (
                                        <tr key={r.id || idx} className="border-b border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                                            <td className="py-3.5 px-4">{r.issue_date || '-'}</td>
                                            <td className="py-3.5 px-4 text-center text-primary font-medium underline cursor-pointer">{r.prefix || ''}{r.number || r.id}</td>
                                            <td className="py-3.5 px-4 text-center">{r.status || '-'}</td>
                                            <td className="py-3.5 px-4 text-right font-medium">$ {Number(r.total || 0).toLocaleString('es-CO')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'notas_credito' && hasCreditNotes && (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                    <th className="py-3.5 px-4 text-center">Nota de crédito #</th>
                                    <th className="py-3.5 px-4 text-right">Total devolución</th>
                                    <th className="py-3.5 px-4 text-right rounded-tr-md">Total aplicado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {creditNotes.map((cn, idx) => {
                                    const dateStr = cn.issue_date || cn.created_at;
                                    let formattedDate = '-';
                                    if (dateStr) {
                                        const d = new Date(dateStr);
                                        if (!isNaN(d.getTime())) {
                                            formattedDate = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                        } else {
                                            formattedDate = String(dateStr);
                                        }
                                    }
                                    const total = Number(cn.payable_amount || cn.total || 0);
                                    // El total aplicado debe ser igual al total de la nota de crédito
                                    const totalAplicado = total;
                                    
                                    const creditNoteId = cn.id;
                                    return (
                                        <tr
                                            key={cn.id || idx}
                                            className="border-b border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
                                            onClick={() => creditNoteId && router.push(`/returns/${creditNoteId}`)}
                                        >
                                            <td className="py-3.5 px-4">
                                                <span className="text-slate-800 font-medium">{formattedDate}</span>
                                            </td>
                                            <td className="py-3.5 px-4 text-center text-slate-700 font-medium">{cn.prefix || ''}{cn.number || cn.id || '-'}</td>
                                            <td className="py-3.5 px-4 text-right text-slate-700 font-medium">
                                                $ {total.toLocaleString('es-CO')}
                                            </td>
                                            <td className="py-3.5 px-4 text-right text-slate-700 font-medium">
                                                $ {totalAplicado.toLocaleString('es-CO')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'contabilidad' && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <span className="text-slate-500">Asiento contable </span>
                                <span className="font-semibold text-slate-800">FV-1</span>
                            </div>
                            <div className="text-slate-500 text-sm">
                                Fecha <span className="font-semibold text-slate-800">27/04/2026</span>
                            </div>
                        </div>
                
                <Button variant="outline" size="sm" className="mb-4">
                    <Printer className="w-4 h-4 mr-2" /> Imprimir
                </Button>

                <div className="bg-[#f0f9fa] border border-[#bce3eb] text-[#3e8e9b] p-3 rounded text-sm mb-6">
                    Visualiza el movimiento contable de este comprobante. Puedes personalizar las cuentas contables y sus códigos <span className="underline cursor-pointer">aquí</span>.
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-slate-600">
                        <thead>
                            <tr className="border-b-2 border-slate-100 text-primary font-semibold text-left">
                                <th className="py-3 px-2">Tercero</th>
                                <th className="py-3 px-2">Código</th>
                                <th className="py-3 px-2">Cuenta contable</th>
                                <th className="py-3 px-2">Centro de costo</th>
                                <th className="py-3 px-2">Débito</th>
                                <th className="py-3 px-2">Crédito</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                                <td className="py-4 px-2">34564uytuj ghjg...</td>
                                <td className="py-4 px-2 text-slate-400">---</td>
                                <td className="py-4 px-2 text-primary underline cursor-pointer">Cuentas por cobrar clientes nacionales</td>
                                <td className="py-4 px-2"></td>
                                <td className="py-4 px-2">$ 5.000</td>
                                <td className="py-4 px-2"></td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                                <td className="py-4 px-2">34564uytuj ghjg...</td>
                                <td className="py-4 px-2 text-slate-400">---</td>
                                <td className="py-4 px-2 text-primary underline cursor-pointer">Ventas</td>
                                <td className="py-4 px-2"></td>
                                <td className="py-4 px-2"></td>
                                <td className="py-4 px-2">$ 5.000</td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                                <td className="py-4 px-2">34564uytuj ghjg...</td>
                                <td className="py-4 px-2 text-slate-400">---</td>
                                <td className="py-4 px-2 text-primary underline cursor-pointer">Inventarios</td>
                                <td className="py-4 px-2"></td>
                                <td className="py-4 px-2"></td>
                                <td className="py-4 px-2">$ 10.000</td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-2">34564uytuj ghjg...</td>
                                <td className="py-4 px-2 text-slate-400">---</td>
                                <td className="py-4 px-2 text-primary underline cursor-pointer">Costos del inventario</td>
                                <td className="py-4 px-2"></td>
                                <td className="py-4 px-2">$ 10.000</td>
                                <td className="py-4 px-2"></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold">
                                <td colSpan={4} className="py-4 px-2 text-right text-primary">TOTAL</td>
                                <td className="py-4 px-2">$ 15.000</td>
                                <td className="py-4 px-2">$ 15.000</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                </>
                )}
            </div>
        </div>
    );
}
