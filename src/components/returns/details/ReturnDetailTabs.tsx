import { useState } from "react";
import { formatCurrency } from "@/utils/format-currency";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

interface ReturnDetailTabsProps {
    creditNote: any;
}

export function ReturnDetailTabs({ creditNote }: ReturnDetailTabsProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'contabilidad' | 'factura'>('contabilidad');
    
    // In a real scenario, you'd have actual accounting data (Asiento contable)
    // For now, I'm displaying a mock to match the screenshot as the backend might not send it structured this way yet.
    // Replace `mockEntries` with real data from `creditNote` if available.
    const mockEntries = [
        { thirdParty: "Leones Palacio Andrés...", code: "-", account: "Impuesto a las ventas por pagar", costCenter: "", debit: 19000, credit: 0 },
        { thirdParty: "Leones Palacio Andrés...", code: "-", account: "Devoluciones en ventas", costCenter: "", debit: 100000, credit: 0 },
        { thirdParty: "Leones Palacio Andrés...", code: "-", account: "Devoluciones de clientes", costCenter: "", debit: 0, credit: 1 },
        { thirdParty: "Leones Palacio Andrés...", code: "-", account: "Cuentas por cobrar clientes nacionales", costCenter: "", debit: 0, credit: 118999 },
        { thirdParty: "Leones Palacio Andrés...", code: "-", account: "Inventarios", costCenter: "", debit: 100000, credit: 0 },
        { thirdParty: "Leones Palacio Andrés...", code: "-", account: "Costos del inventario", costCenter: "", debit: 0, credit: 100000 },
    ];

    const currencyCode = creditNote?.invoice?.type_currency_id === 35 || !creditNote?.invoice?.type_currency_id ? 'COP' : 'USD';

    // Helper para fechas que pueden venir como "22/07/2026" (ya formateadas) o ISO
    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return '—';
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
        return dayjs(dateStr).isValid() ? dayjs(dateStr).format('DD/MM/YYYY') : '—';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mt-6">
            <div className="flex border-b border-slate-100">
                <button 
                    onClick={() => setActiveTab('contabilidad')}
                    className={`px-6 py-4 cursor-pointer transition-colors ${activeTab === 'contabilidad' ? 'font-medium text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Contabilidad
                </button>
                <button 
                    onClick={() => setActiveTab('factura')}
                    className={`px-6 py-4 cursor-pointer transition-colors ${activeTab === 'factura' ? 'font-medium text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Factura asociada
                </button>
            </div>
            
            <div className="p-6">
                {activeTab === 'contabilidad' && (
                    <>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-700">Asiento contable: <span className="font-normal">NC-{creditNote?.number || creditNote?.id || 1}</span></p>
                                <p className="text-sm font-semibold text-slate-700 mt-1">Fecha: <span className="font-normal">{formatDate(creditNote?.issue_date)}</span></p>
                            </div>
                            <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600">
                                <Printer className="w-4 h-4 mr-2" /> Imprimir
                            </Button>
                        </div>

                        <div className="bg-[#eeeffc] rounded-lg p-4 mb-6 text-sm text-[#4b5563]">
                            Revisa el movimiento contable de este documento. Si deseas, puedes aprender <a href="#" className="text-[#3b82f6] underline">cómo personalizar tus cuentas</a>.
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="text-slate-500 border-b border-slate-200 text-xs">
                                        <th className="py-3 px-4 font-medium">Tercero</th>
                                        <th className="py-3 px-4 font-medium">Código</th>
                                        <th className="py-3 px-4 font-medium">Cuenta contable</th>
                                        <th className="py-3 px-4 font-medium">Centro de costo</th>
                                        <th className="py-3 px-4 font-medium text-right">Débito</th>
                                        <th className="py-3 px-4 font-medium text-right">Crédito</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {mockEntries.map((entry, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-4 text-slate-600">{entry.thirdParty}</td>
                                            <td className="py-4 px-4 text-slate-600 text-center">{entry.code}</td>
                                            <td className="py-4 px-4 text-slate-600">{entry.account}</td>
                                            <td className="py-4 px-4 text-slate-600">{entry.costCenter}</td>
                                            <td className="py-4 px-4 text-slate-600 text-right">{entry.debit > 0 ? formatCurrency(entry.debit) : ''}</td>
                                            <td className="py-4 px-4 text-slate-600 text-right">{entry.credit > 0 ? formatCurrency(entry.credit) : ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold text-slate-700">
                                        <td colSpan={4} className="py-4 px-4 text-right">Total</td>
                                        <td className="py-4 px-4 text-right">{formatCurrency(219000)}</td>
                                        <td className="py-4 px-4 text-right">{formatCurrency(219000)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </>
                )}
                
                {activeTab === 'factura' && (
                    <div>
                        {creditNote?.invoice ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="py-3 px-4 font-medium text-slate-600">Fecha</th>
                                            <th className="py-3 px-4 font-medium text-slate-600">Número de factura</th>
                                            <th className="py-3 px-4 font-medium text-slate-600 text-right">Total aplicado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            className="hover:bg-slate-50 transition-colors cursor-pointer"
                                            onClick={() => router.push(`/sales/invoices/${creditNote.invoice.id}`)}
                                        >
                                            <td className="py-4 px-4 text-slate-700">
                                                {formatDate(creditNote.invoice.issue_date)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="font-semibold text-slate-800">
                                                    {creditNote.invoice.prefix || ''}{creditNote.invoice.number}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right font-semibold text-slate-800">
                                                {formatCurrency(Number(creditNote.invoice.total || 0), currencyCode)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">
                                {creditNote?.invoice_id
                                    ? `Factura asociada #${creditNote.invoice_id} (detalle no disponible)`
                                    : 'No hay factura asociada a esta nota crédito.'}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
