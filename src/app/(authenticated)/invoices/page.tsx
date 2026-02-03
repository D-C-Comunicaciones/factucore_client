"use client";
import React from 'react';
import { FileText, Bell, TrendingUp, Search, ChevronDown, Plus } from 'lucide-react';

interface FacturasVentaViewProps {
    onNavigate: (view: string) => void;
}

export default function InvoicesPage({ onNavigate }: FacturasVentaViewProps) {
    return (
        <div className="space-y-6 py-4">
            {/* Banner de personalización */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between border border-blue-100 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white/80 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-8 h-8 md:w-12 md:h-12 text-teal-500" />
                    </div>
                    <div>
                        <h3 className="text-base md:text-lg font-semibold mb-1 flex items-center gap-2">
                            Personaliza tus facturas 🎨
                        </h3>
                        <p className="text-sm text-gray-600">
                            ¿Te gustaría cambiar el color y diseño de tus facturas? ¡Prueba nuestras plantillas!
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 self-end md:self-auto">
                    <button className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium transition-colors">
                        Personalizar ahora
                    </button>
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                        ✕
                    </button>
                </div>
            </div>

            {/* Título y acciones */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold mb-2">Facturas de venta</h1>
                <p className="text-sm text-gray-600">
                    Crea, edita y gestiona facturas detalladas para tus transacciones comerciales.{' '}
                    <a href="#" className="text-teal-600 hover:text-teal-700">Saber más.</a>
                </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">Sin emisión</div>
                            <div className="text-2xl font-bold">0</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Bell className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">Sin envío al cliente</div>
                            <div className="text-2xl font-bold">0</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">En proceso</div>
                            <div className="text-2xl font-bold">0</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-initial">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar cliente"
                                className="w-full md:w-auto pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                            </svg>
                            <span className="hidden sm:inline">Filtrar</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <span className="hidden sm:inline">Más acciones</span>
                            <span className="sm:hidden">Acciones</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onNavigate('nueva-factura')}
                            className="flex-1 md:flex-initial px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Nueva factura de venta</span>
                            <span className="sm:hidden">Nueva</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input type="checkbox" className="rounded border-gray-300 text-teal-500 focus:ring-teal-500" />
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Número</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cliente</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Creación</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vencimiento</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Por cobrar</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado DIAN</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <input type="checkbox" className="rounded border-gray-300 text-teal-500 focus:ring-teal-500" />
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">LTCH1</td>
                                <td className="px-4 py-3 text-sm text-gray-900">Consumidor Final</td>
                                <td className="px-4 py-3 text-sm text-gray-600">27/01/2025</td>
                                <td className="px-4 py-3 text-sm text-gray-600">27/01/2025</td>
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">$ 840</td>
                                <td className="px-4 py-3 text-sm text-gray-900">$ 0</td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1 text-sm text-green-700">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        Aprobada
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                        Cobrada
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}