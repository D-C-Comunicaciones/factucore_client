"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface VentasData {
  fecha: string;
  valor: number;
}

interface TotalVentasWidgetProps {
  data: VentasData[];
  total: number;
  porcentaje: number;
}

export function TotalVentasWidget({ data, total, porcentaje }: TotalVentasWidgetProps) {
  return (
    <div className="h-full flex flex-col p-1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-gray-700">Total de ventas</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-primary text-primary-foreground text-[10px] font-medium shadow-lg px-2.5 py-1 rounded z-50 border-none"
            >
              Conoce el rendimiento de las estrategias comerciales de tu negocio.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold text-gray-700">${total.toFixed(2)}</div>
          <div className="text-xs text-gray-500">{porcentaje}%</div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        La gráfica muestra el valor de tus ventas con impuestos incluidos.
      </p>
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="fecha"
              tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
