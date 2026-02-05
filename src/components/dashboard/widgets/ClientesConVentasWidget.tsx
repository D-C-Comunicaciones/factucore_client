"use client";

interface ClientesConVentasWidgetProps {
  total: number;
}

export function ClientesConVentasWidget({ total }: ClientesConVentasWidgetProps) {
  return (
    <div className="h-full flex flex-col p-1">
      <h3 className="text-[11px] font-medium text-gray-600 mb-1 underline">Clientes con ventas</h3>
      <div className="text-lg font-bold mt-auto text-gray-800">{total}</div>
    </div>
  );
}
