import { useState } from "react";
import { Printer, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InvoiceDetailTabs({ payments = [] }: { payments?: any[] }) {
    const [activeTab, setActiveTab] = useState<'pagos' | 'remisiones' | 'contabilidad'>('pagos');

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex border-b border-slate-100">
                <button 
                    onClick={() => setActiveTab('pagos')}
                    className={`px-6 py-4 cursor-pointer transition-colors ${activeTab === 'pagos' ? 'font-medium text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Pagos recibidos
                </button>
                <button 
                    onClick={() => setActiveTab('remisiones')}
                    className={`px-6 py-4 cursor-pointer transition-colors ${activeTab === 'remisiones' ? 'font-medium text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Remisiones
                </button>
                <button 
                    onClick={() => setActiveTab('contabilidad')}
                    className={`px-6 py-4 cursor-pointer transition-colors ${activeTab === 'contabilidad' ? 'font-medium text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Contabilidad
                </button>
            </div>
            <div className="p-6">
                {activeTab === 'pagos' && (
                    payments.length > 0 ? (
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
                                                // Intentar parsear DD-MM-YYYY o DD/MM/YYYY
                                                const parts = String(dateStr).split(/[-/]/);
                                                if (parts.length === 3 && parts[2].length === 4) {
                                                    const newDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`);
                                                    if (!isNaN(newDate.getTime())) {
                                                        formattedDate = newDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                                    }
                                                } else {
                                                    formattedDate = String(dateStr); // fallback to raw string
                                                }
                                            }
                                        }
                                        return (
                                            <tr key={p.id || idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3.5 px-4">
                                                    <span className="text-primary font-medium underline cursor-pointer">{formattedDate}</span>
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
                    ) : (
                        <div className="flex items-center justify-center py-12 gap-8">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center relative">
                                <div className="absolute w-12 h-16 bg-white border border-slate-200 rounded-sm right-2 bottom-3 opacity-60 flex flex-col items-end p-2 gap-1.5">
                                    <div className="w-4 h-0.5 bg-slate-200"></div>
                                    <div className="w-6 h-0.5 bg-slate-200"></div>
                                    <div className="w-5 h-0.5 bg-slate-200"></div>
                                    <div className="w-6 h-0.5 bg-slate-200"></div>
                                </div>
                                <div className="absolute w-12 h-16 bg-white border border-slate-200 shadow-sm rounded-sm flex items-center justify-center z-10 -ml-4 -mt-2">
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-2 left-2 w-3 h-0.5 bg-slate-200"></div>
                                </div>
                            </div>
                            <div className="text-slate-500 text-[15px]">
                                Tu venta aún no tiene pagos recibidos
                            </div>
                            <Button variant="outline" className="text-slate-700 border-gray-300 cursor-pointer rounded-lg font-normal hover:bg-gray-100">
                                <Plus className="w-4 h-4 mr-2" /> Agregar pago
                            </Button>
                        </div>
                    )
                )}

                {activeTab === 'remisiones' && (
                    <div className="text-slate-500 py-12 text-center">
                        No hay remisiones asociadas a esta factura.
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
                            <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-2">34564uytuj ghjg...</td>
                                <td className="py-4 px-2 text-slate-400">---</td>
                                <td className="py-4 px-2 text-primary underline cursor-pointer">Cuentas por cobrar clientes nacionales</td>
                                <td className="py-4 px-2"></td>
                                <td className="py-4 px-2">$ 5.000</td>
                                <td className="py-4 px-2"></td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-2">34564uytuj ghjg...</td>
                                <td className="py-4 px-2 text-slate-400">---</td>
                                <td className="py-4 px-2 text-primary underline cursor-pointer">Ventas</td>
                                <td className="py-4 px-2"></td>
                                <td className="py-4 px-2"></td>
                                <td className="py-4 px-2">$ 5.000</td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
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
