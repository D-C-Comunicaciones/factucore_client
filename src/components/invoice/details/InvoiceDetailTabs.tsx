import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InvoiceDetailTabs() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex border-b border-slate-100">
                <button className="px-6 py-4 text-slate-500 hover:text-slate-700 transition-colors">
                    Pagos recibidos
                </button>
                <button className="px-6 py-4 text-slate-500 hover:text-slate-700 transition-colors">
                    Remisiones
                </button>
                <button className="px-6 py-4 font-medium text-primary border-b-2 border-primary">
                    Contabilidad
                </button>
            </div>
            <div className="p-6">
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
            </div>
        </div>
    );
}
