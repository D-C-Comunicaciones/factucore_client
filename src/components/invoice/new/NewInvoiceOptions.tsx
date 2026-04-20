"use client";
import { HelpCircle } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function NewInvoiceOptions({
    warehouseOptions,
    priceListOptions,
    sellerOptions,
}: {
    warehouseOptions: { value: string; label: string }[];
    priceListOptions: { value: string; label: string }[];
    sellerOptions: { value: string; label: string }[];
}) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de documento
                    </label>
                    <div className="flex gap-2">
                        <button className="flex-1 h-[42px] px-3 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium">
                            Factura de venta
                        </button>
                        <button className="flex-1 h-[42px] px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm">
                            Tiquete
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bodega
                    </label>
                    <Select>
                        <SelectTrigger className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                        >
                            <SelectValue placeholder="Selecciona bodega" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                            {warehouseOptions.map(opt => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                    style={{ minHeight: "36px", height: "36px", borderWidth: "0px" }}
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        Lista de precios
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                    </label>
                    <Select>
                        <SelectTrigger className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                        >
                            <SelectValue placeholder="Selecciona lista" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                            {priceListOptions.map(opt => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                    style={{ minHeight: "36px", height: "36px", borderWidth: "0px" }}
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        Vendedor
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                    </label>
                    <Select>
                        <SelectTrigger className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                        >
                            <SelectValue placeholder="Seleccionar vendedor" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                            {sellerOptions.map(opt => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                    style={{ minHeight: "36px", height: "36px", borderWidth: "0px" }}
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        Orden de compra
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                    </label>
                    <Input
                        className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                        defaultValue=""
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        Orden de entrega
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                    </label>
                    <Input
                        className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                        defaultValue=""
                    />
                </div>
            </div>
        </div>
    );
}
