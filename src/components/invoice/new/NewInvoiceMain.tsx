"use client";
import { Settings, HelpCircle, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { InvoiceItemsTable } from "@/components/invoice/new/InvoiceItemsTable";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";

export function NewInvoiceMain({ mainData, setInvoiceItems }: {
    mainData: any;
    setInvoiceItems: (items: any) => void;
}) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
            {/* Header de la factura */}
            <div className="flex items-start justify-between mb-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-gray-400 font-medium mb-1">Utilizar mi logo</div>
                    <div className="text-xs text-gray-400">176 × 51 pixeles</div>
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                        {mainData.company.name}
                    </h2>
                    <div className="text-sm text-gray-600">NIT: {mainData.company.nit}</div>
                    <div className="text-sm text-gray-600">{mainData.company.email}</div>
                </div>
                <div className="text-right">
                    <div className="mb-2">
                        <Select>
                            <SelectTrigger className="bg-white focus:bg-white focus:ring-2 focus:ring-teal-500">
                                <SelectValue placeholder={mainData.invoiceType} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Factura electrónica">Factura electrónica</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">No.</span>
                        <span className="font-bold text-lg">{mainData.invoiceNumber}</span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                            <Settings className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>
            {/* Información del cliente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documento <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <Select>
                            <SelectTrigger className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                            >
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                                {mainData.documentTypes.map((opt: any) => (
                                    <SelectItem key={opt.value} value={opt.value}
                                        className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                        style={{ minHeight: "36px", height: "36px", borderWidth: "0px" }}
                                    >{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Buscar Nº de ID"
                            className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                            defaultValue=""
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha <span className="text-red-500">*</span>
                    </label>
                    <div>
                        <DatePickerSimple />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre o razón social <span className="text-red-500">*</span>
                    </label>
                    <Select>
                        <SelectTrigger className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                        >
                            <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                            {mainData.sellerOptions.map((opt: any) => (
                                <SelectItem key={opt.value} value={opt.value}
                                    className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                    style={{ minHeight: "36px", height: "36px", borderWidth: "0px" }}
                                >{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Forma de pago <span className="text-red-500">*</span>
                    </label>
                    <Select>
                        <SelectTrigger className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                        >
                            <SelectValue placeholder="Forma de pago" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                            {mainData.paymentForms.map((opt: any) => (
                                <SelectItem key={opt.value} value={opt.value}
                                    className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                    style={{ minHeight: "36px", height: "36px", borderWidth: "0px" }}
                                >{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo
                    </label>
                    <Input
                        type="email"
                        className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                        defaultValue=""
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medio de pago <span className="text-red-500">*</span>
                    </label>
                    <Select>
                        <SelectTrigger className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                        >
                            <SelectValue placeholder="Medio de pago" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                            {mainData.paymentMethods.map((opt: any) => (
                                <SelectItem key={opt.value} value={opt.value}
                                    className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                    style={{ minHeight: "36px", height: "36px", borderWidth: "0px" }}
                                >{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 mb-6">
                <Plus className="w-4 h-4" />
                Nuevo contacto
            </button>
            {/* Tabla de items */}
            <InvoiceItemsTable items={mainData.invoiceItems} onAddItem={mainData.onAddItem} />
            {/* Sección inferior */}
            <div className="grid grid-cols-2 gap-8">
                {/* Izquierda - Firma y términos */}
                <div className="space-y-6">
                    <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        Agregar remisión
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                    </button>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <div className="text-gray-400 font-medium mb-1">Utilizar mi firma</div>
                        <div className="text-xs text-gray-400">176 × 51 pixeles</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            Términos y condiciones
                            <HelpCircle className="w-3 h-3 text-gray-400" />
                        </label>
                        <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            defaultValue="Esta factura se asimila en todos sus efectos a una letra de cambio de conformidad con el Art. 774 del código de comercio. Autorizo que en caso de incumplimiento de esta obligación sea reportado a las centrales de riesgo, se cobrarán intereses por mora..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            Notas
                            <HelpCircle className="w-3 h-3 text-gray-400" />
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Pie de factura</div>
                        <div className="text-xs text-gray-500">
                            Autorización de numeración de facturación Nº18764087804091 de 2025-01-27 Modalidad Factura Electrónica Desde Nº LTCH1 hasta LTCH100 con vigencia hasta 2027-01-27
                        </div>
                    </div>
                </div>
                {/* Derecha - Totales */}
                <div className="flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">$ 0</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Descuento</span>
                            <span className="font-medium text-red-600">-$ 0</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                            <span className="text-xl font-bold">Total</span>
                            <span className="text-2xl font-bold">$ 0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
