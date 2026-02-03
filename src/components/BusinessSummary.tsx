import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface BusinessSummaryProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export function BusinessSummary({ selectedMonth, onMonthChange }: BusinessSummaryProps) {
  return (
    <div className="w-full">
      {/* Primera fila: Título y controles alineados arriba */}
      <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Resumen del negocio</h2>
        <div className="flex gap-2 flex-wrap md:justify-end">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white border border-gray-200"
          >
            <option>Mes actual</option>
            <option>Último mes</option>
            <option>Último trimestre</option>
          </select>
          <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            Agregar gráfica
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards layout: 2 grandes arriba, 4 pequeñas abajo, todas en una sola grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Cuentas por cobrar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full col-span-1 md:col-span-1 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-800 mb-1 underline cursor-pointer">Cuentas por cobrar</h3>
          <div className="text-2xl font-bold mb-2">$0,00</div>
          <div className="flex flex-row gap-6 mt-auto">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="text-xs text-gray-500">Vigentes</span>
              </div>
              <div className="font-bold text-sm text-gray-900">$0,00</div>
              <div className="text-xs text-gray-500">0 documentos</div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-xs text-gray-500">Vencidas</span>
              </div>
              <div className="font-bold text-sm text-gray-900">$0,00</div>
              <div className="text-xs text-gray-500">0 documentos</div>
            </div>
          </div>
        </div>
        {/* Cuentas por pagar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full col-span-1 md:col-span-1 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-800 mb-1 underline cursor-pointer">Cuentas por pagar</h3>
          <div className="text-2xl font-bold mb-2">$0,00</div>
          <div className="flex flex-row gap-6 mt-auto">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="text-xs text-gray-500">Vigentes</span>
              </div>
              <div className="font-bold text-sm text-gray-900">$0,00</div>
              <div className="text-xs text-gray-500">0 documentos</div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-xs text-gray-500">Vencidas</span>
              </div>
              <div className="font-bold text-sm text-gray-900">$0,00</div>
              <div className="text-xs text-gray-500">0 documentos</div>
            </div>
          </div>
        </div>
        {/* Impuestos en venta */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Impuestos en venta</h3>
          <div className="text-2xl font-bold mb-2">$0,00</div>
        </div>
        {/* Productos vendidos */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Productos vendidos</h3>
          <div className="text-2xl font-bold mb-2">0</div>
        </div>
        {/* Devoluciones de clientes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Devoluciones de clientes</h3>
          <div className="text-xs text-gray-500 mb-1">Incluye impuestos</div>
          <div className="text-2xl font-bold mb-2">$0,00</div>
        </div>
        {/* Clientes con ventas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-gray-800 mb-1 underline cursor-pointer">Clientes con ventas</h3>
          <div className="text-2xl font-bold mb-2">0</div>
        </div>
      </div>
    </div>
  );
}