"use client";
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface ProductoItem {
  nombre: string;
  cantidad: number;
  ventas: number;
  porcentaje: number;
}

interface ProductosMasVendidosWidgetProps {
  productos: ProductoItem[];
  total: number;
}

export function ProductosMasVendidosWidget({ productos, total }: ProductosMasVendidosWidgetProps) {
  const COLORS = ['#ef4444', '#3b82f6', '#6366f1', '#14b8a6', '#f59e0b'];

  const chartData = productos.map((producto, index) => ({
    name: producto.nombre,
    value: producto.ventas,
    fill: `var(--color-producto-${index})`,
  }));

  const chartConfig = productos.reduce((acc, producto, index) => {
    acc[`producto-${index}`] = {
      label: producto.nombre,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {} as ChartConfig);

  const totalVentas = React.useMemo(() => {
    return productos.reduce((acc, curr) => acc + curr.ventas, 0);
  }, [productos]);

  return (
    <div className="h-full flex flex-col p-1">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Productos más vendidos</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-gray-400 hover:text-gray-600">
              <Info className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-[#232B3A]/95 text-white text-[10px] font-medium shadow-lg px-2.5 py-1 rounded z-50 border-none"
          >
            Identifica tus productos con mayor tendencia de venta en el periodo seleccionado.
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        El total vendido tiene impuestos incluidos.
      </p>

      <div className="flex flex-col lg:flex-row gap-4 flex-1">
        {/* Gráfica circular */}
        <div className="w-full lg:w-32 h-32 flex-shrink-0">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={35}
                outerRadius={55}
                strokeWidth={2}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-muted-foreground text-[9px]">
                            Total
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 14} className="fill-foreground text-sm font-bold">
                            ${totalVentas.toFixed(2)}
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

        {/* Tabla de productos */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-2 font-medium text-gray-500 px-2">Producto</th>
                <th className="text-right py-2 font-medium text-gray-500 px-2">Cantidad</th>
                <th className="text-right py-2 font-medium text-gray-500 px-2">Ventas</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 text-gray-600 px-2 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="truncate">{producto.nombre}</span>
                  </td>
                  <td className="text-right py-2 text-gray-600 px-2">{producto.cantidad}</td>
                  <td className="text-right py-2 text-gray-600 px-2">${producto.ventas.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
