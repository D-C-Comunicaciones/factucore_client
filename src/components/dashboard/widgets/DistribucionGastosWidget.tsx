"use client";
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface GastoItem {
  concepto: string;
  valor: number;
  porcentaje: number;
  color: string;
}

interface DistribucionGastosWidgetProps {
  gastos: GastoItem[];
  total: number;
}

export function DistribucionGastosWidget({ gastos, total }: DistribucionGastosWidgetProps) {
  const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-primary)', 'var(--color-ring)'];

  const chartData = gastos.map((gasto, index) => ({
    name: gasto.concepto,
    value: gasto.valor,
    fill: `var(--color-gasto-${index})`,
  }));

  const chartConfig = gastos.reduce((acc, gasto, index) => {
    acc[`gasto-${index}`] = {
      label: gasto.concepto,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {} as ChartConfig);

  const totalGastos = React.useMemo(() => {
    return gastos.reduce((acc, curr) => acc + curr.valor, 0);
  }, [gastos]);

  return (
    <div className="h-full flex flex-col p-1">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Distribución de gastos</h3>
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
            Conoce la participación de cada gasto en los gastos totales de tu negocio.
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        La gráfica muestra el valor de tu top 5 de gastos
      </p>

      <div className="flex flex-col lg:flex-row gap-6 mb-4 flex-1">
        {/* Gráfica circular */}
        <div className="w-full lg:w-48 h-48 flex-shrink-0">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                strokeWidth={2}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-muted-foreground text-xs">
                            Total
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} className="fill-foreground text-xl font-bold">
                            ${totalGastos.toFixed(2)}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        {/* Tabla de gastos */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-2 font-medium text-gray-500 px-2">Concepto</th>
                <th className="text-right py-2 font-medium text-gray-500 px-2">Valor</th>
                <th className="text-right py-2 font-medium text-gray-500 px-2">Participación</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((gasto, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-gray-600">{gasto.concepto}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 text-gray-600 px-2">${gasto.valor.toFixed(2)}</td>
                  <td className="text-right py-3 text-gray-500 px-2">{gasto.porcentaje}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
