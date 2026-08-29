import { useState } from "react";
import { useRouter } from "next/navigation";
import { Printer, CreditCard, Truck, FileText, BarChart3, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────── */
/* Empty state helper                  */
/* ─────────────────────────────────── */
function EmptyTabMessage({
    icon,
    message,
    description,
}: {
    icon: React.ReactNode;
    message: string;
    description?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="rounded-full bg-slate-50 p-4 border border-slate-100">
                {icon}
            </div>
            <p className="text-slate-600 font-medium text-base">{message}</p>
            {description && (
                <p className="text-slate-400 text-sm max-w-sm">{description}</p>
            )}
        </div>
    );
}

export function InvoiceDetailTabs({
    payments = [],
    creditNotes = [],
    remissions = [],
    quotes = [],
    invoiceTotal = 0
}: {
    payments?: any[],
    creditNotes?: any[],
    remissions?: any[],
    quotes?: any[],
    invoiceTotal?: number
}) {
    type TabType = 'pagos' | 'remisiones' | 'notas_credito' | 'cotizaciones' | 'contabilidad';
    const [activeTab, setActiveTab] = useState<TabType>('pagos');
    const router = useRouter();

    const tabs: { key: TabType; label: string; icon: React.ReactNode; count: number }[] = [
        {
            key: 'pagos',
            label: 'Pagos recibidos',
            icon: <CreditCard className="w-4 h-4" />,
            count: payments.length,
        },
        {
            key: 'remisiones',
            label: 'Remisiones',
            icon: <Truck className="w-4 h-4" />,
            count: remissions.length,
        },
        {
            key: 'notas_credito',
            label: 'Notas de crédito',
            icon: <FileText className="w-4 h-4" />,
            count: creditNotes.length,
        },
        {
            key: 'cotizaciones',
            label: 'Cotizaciones',
            icon: <FileCheck className="w-4 h-4" />,
            count: quotes.length,
        },
        {
            key: 'contabilidad',
            label: 'Contabilidad',
            icon: <BarChart3 className="w-4 h-4" />,
            count: -1,
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            {/* Tab headers — always visible */}
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
                                ${activeTab === tab.key
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }
                            `}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="p-6">

                {/* ── PAGOS ── */}
                {activeTab === 'pagos' && (
                    payments.length === 0 ? (
                        <EmptyTabMessage
                            icon={<CreditCard className="w-10 h-10 text-slate-300" />}
                            message="No tiene pagos asociados"
                            description="Los pagos registrados para esta factura aparecerán aquí."
                        />
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                    <tr>
                                        <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                        <th className="py-3.5 px-4 text-center">Pago #</th>
                                        <th className="py-3.5 px-4 text-center">Estado</th>
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
                                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                                                onClick={() => paymentId && router.push(`/sales/payments/${paymentId}`)}
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
                    )
                )}

                {/* ── REMISIONES ── */}
                {activeTab === 'remisiones' && (
                    remissions.length === 0 ? (
                        <EmptyTabMessage
                            icon={<Truck className="w-10 h-10 text-slate-300" />}
                            message="No tiene remisiones asociadas"
                            description="Las remisiones vinculadas a esta factura aparecerán aquí."
                        />
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                    <tr>
                                        <th className="py-3.5 px-4 rounded-tl-md">Número</th>
                                        <th className="py-3.5 px-4 text-center">Fecha emisión</th>
                                        <th className="py-3.5 px-4 text-center">Fecha expiración</th>
                                        <th className="py-3.5 px-4 text-center">Tipo</th>
                                        <th className="py-3.5 px-4 text-center">Estado</th>
                                        <th className="py-3.5 px-4 text-right rounded-tr-md">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {remissions.map((r, idx) => {
                                        const remissionId = r.id;
                                        return (
                                            <tr
                                                key={r.id || idx}
                                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                                                onClick={() => remissionId && router.push(`/sales/remissions/${remissionId}`)}
                                            >
                                                <td className="py-3.5 px-4 text-primary font-semibold">
                                                    {(r.prefix || '') + (r.number || r.id || '')}
                                                </td>
                                                <td className="py-3.5 px-4 text-center text-slate-700">{r.issue_date || '-'}</td>
                                                <td className="py-3.5 px-4 text-center text-slate-700">{r.expiration_date || '-'}</td>
                                                <td className="py-3.5 px-4 text-center text-slate-600">
                                                    {r.type_remission?.name || r.type_remission || '-'}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                        {r.remission_status?.name || r.status || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                                                    $ {Number(r.total || 0).toLocaleString('es-CO')}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

                {/* ── NOTAS DE CRÉDITO ── */}
                {activeTab === 'notas_credito' && (
                    creditNotes.length === 0 ? (
                        <EmptyTabMessage
                            icon={<FileText className="w-10 h-10 text-slate-300" />}
                            message="No tiene notas crédito registradas"
                            description="Las notas de crédito emitidas para esta factura aparecerán aquí."
                        />
                    ) : (
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
                                        const totalAplicado = total;
                                        const creditNoteId = cn.id;
                                        return (
                                            <tr
                                                key={cn.id || idx}
                                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                                                onClick={() => creditNoteId && router.push(`/sales/returns/${creditNoteId}`)}
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
                    )
                )}

                {/* ── COTIZACIONES ── */}
                {activeTab === 'cotizaciones' && (
                    quotes.length === 0 ? (
                        <EmptyTabMessage
                            icon={<FileCheck className="w-10 h-10 text-slate-300" />}
                            message="No tiene cotizaciones asociadas"
                            description="Las cotizaciones relacionadas con esta factura aparecerán aquí."
                        />
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc] text-[#1e293b] font-semibold border-b border-slate-100">
                                    <tr>
                                        <th className="py-3.5 px-4 rounded-tl-md">Fecha</th>
                                        <th className="py-3.5 px-4 text-center">Cotización #</th>
                                        <th className="py-3.5 px-4 text-center">Estado</th>
                                        <th className="py-3.5 px-4 text-right rounded-tr-md">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotes.map((q, idx) => {
                                        const quoteId = q.id;
                                        return (
                                            <tr
                                                key={q.id || idx}
                                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                                                onClick={() => quoteId && router.push(`/sales/quotes/${quoteId}`)}
                                            >
                                                <td className="py-3.5 px-4">{q.created_at || q.issue_date || '-'}</td>
                                                <td className="py-3.5 px-4 text-center text-primary font-medium">{q.prefix || ''}{q.number || q.id}</td>
                                                <td className="py-3.5 px-4 text-center">{q.quotation_status?.name || q.status || '-'}</td>
                                                <td className="py-3.5 px-4 text-right font-medium">$ {Number(q.total || 0).toLocaleString('es-CO')}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

                {/* ── CONTABILIDAD ── */}
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
