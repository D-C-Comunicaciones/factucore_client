"use client";

interface DevolucionesWidgetProps {
  total: number;
}

export function DevolucionesWidget({ total }: DevolucionesWidgetProps) {
  return (
    <div className="h-full flex flex-col p-1">
      <h3 className="text-[11px] font-medium text-gray-600 mb-1">Devoluciones de clientes</h3>
      <div className="text-[8px] text-gray-500 mb-1">Incluye impuestos</div>
      <div className="text-lg font-bold mt-auto text-gray-800">${total.toFixed(2)}</div>
    </div>
  );
}
