"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface FlujoTransaccionesData {
  fecha: string;
  ingresos: number;
  egresos: number;
}

interface FlujoTransaccionesWidgetProps {
  data: FlujoTransaccionesData[];
  totalIngresos: number;
  totalEgresos: number;
  porcentajeIngresos: number;
  porcentajeEgresos: number;
}

export function FlujoTransaccionesWidget({
  data,
  totalIngresos,
  totalEgresos,
  porcentajeIngresos,
  porcentajeEgresos,
}: FlujoTransaccionesWidgetProps) {
  return (
    <div className="h-full flex flex-col p-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-gray-700">Flujo de transacciones</h3>
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
              Revisa el resumen de tus entradas y salidas de dinero en este periodo.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-0.5">Total ingresos</div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-gray-700">${totalIngresos.toFixed(2)}</span>
              <span className="text-xs text-gray-500">{porcentajeIngresos}%</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-0.5">Total egresos</div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-gray-700">${totalEgresos.toFixed(2)}</span>
              <span className="text-xs text-gray-500">{porcentajeEgresos}%</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        La gráfica muestra el valor de tus transacciones con impuestos incluidos.
      </p>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="fecha"
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              wrapperStyle={{
                outline: 'none',
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: '12px',
                paddingTop: '10px'
              }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Ingresos"
            />
            <Line
              type="monotone"
              dataKey="egresos"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Egresos"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
