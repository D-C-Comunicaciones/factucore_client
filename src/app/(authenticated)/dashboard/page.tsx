"use client";
import React, { useState } from 'react';
import { SuggestedFunctions } from '../../../components/SuggestedFunctions';
import { BusinessSummary } from '../../../components/BusinessSummary';

interface DashboardViewProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export function DashboardView({ selectedMonth, onMonthChange }: DashboardViewProps) {
  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-4">
        {/* Título y controles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
          <h2 className="text-xl font-semibold">Resumen del negocio</h2>
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="bg-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>Mes actual</option>
              <option>Último mes</option>
              <option>Último trimestre</option>
            </select>
            <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              Agregar gráfica
            </button>
          </div>
        </div>
        {/* Cards layout: 2 grandes arriba, 4 pequeñas abajo, todas en una sola grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Cuentas por cobrar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full col-span-1 md:col-span-1 lg:col-span-2">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Cuentas por cobrar</h3>
            <div className="text-2xl font-bold mb-4">$0,00</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-8 bg-teal-400 rounded"></div>
                  <div>
                    <div className="text-xs text-gray-500">Vigentes</div>
                    <div className="font-semibold">$0,00</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 ml-3">0 documentos</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-8 bg-red-400 rounded"></div>
                  <div>
                    <div className="text-xs text-gray-500">Vencidas</div>
                    <div className="font-semibold">$0,00</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 ml-3">0 documentos</div>
              </div>
            </div>
          </div>
          {/* Cuentas por pagar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full col-span-1 md:col-span-1 lg:col-span-2">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Cuentas por pagar</h3>
            <div className="text-2xl font-bold mb-4">$0,00</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-8 bg-teal-400 rounded"></div>
                  <div>
                    <div className="text-xs text-gray-500">Vigentes</div>
                    <div className="font-semibold">$0,00</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 ml-3">0 documentos</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-8 bg-red-400 rounded"></div>
                  <div>
                    <div className="text-xs text-gray-500">Vencidas</div>
                    <div className="font-semibold">$0,00</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 ml-3">0 documentos</div>
              </div>
            </div>
          </div>
          {/* Impuestos en venta */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Impuestos en venta</h3>
            <div className="text-2xl font-bold">$0,00</div>
          </div>
          {/* Productos vendidos */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Productos vendidos</h3>
            <div className="text-2xl font-bold">0</div>
          </div>
          {/* Devoluciones de clientes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Devoluciones de clientes</h3>
            <div className="text-xs text-gray-500 mb-1">Incluye impuestos</div>
            <div className="text-2xl font-bold">$0,00</div>
          </div>
          {/* Clientes con ventas */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Clientes con ventas</h3>
            <div className="text-2xl font-bold">0</div>
          </div>
        </div>
        {/* Gráfica y secciones inferiores */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Total de ventas</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold">$0,00</div>
              <div className="text-sm text-gray-500">0%</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">La gráfica muestra el valor de tus ventas con impuestos incluidos.</p>
          <div className="h-64 flex items-end justify-between gap-2 border-l border-b border-gray-200 pl-2 pb-2">
            {/* ...gráfica... */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export for Next.js page
export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM

  return (
    <DashboardView
      selectedMonth={selectedMonth}
      onMonthChange={setSelectedMonth}
    />
  );
}
