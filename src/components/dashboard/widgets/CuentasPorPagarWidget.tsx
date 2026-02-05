"use client";

interface CuentasPorPagarData {
  total: number;
  vigentes: { valor: number; documentos: number };
  vencidas: { valor: number; documentos: number };
}

interface CuentasPorPagarWidgetProps extends CuentasPorPagarData {}

export function CuentasPorPagarWidget({ total, vigentes, vencidas }: CuentasPorPagarWidgetProps) {
  return (
    <div className="h-full flex flex-col justify-between p-1">
      <div>
        <h3 className="text-[11px] font-medium text-gray-600 mb-1 underline">Cuentas por pagar</h3>
        <div className="text-lg font-bold mb-1.5 text-gray-800">${total.toFixed(2)}</div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <div className="flex items-start gap-1">
            <div className="w-0.5 h-8 bg-teal-500 rounded"></div>
            <div className="flex-1">
              <div className="text-[9px] text-gray-500">Vigentes</div>
              <div className="text-xs font-semibold mt-0.5 text-gray-700">${vigentes.valor.toFixed(2)}</div>
              <div className="text-[8px] text-gray-500 mt-0.5">{vigentes.documentos} documentos</div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-start gap-1">
            <div className="w-0.5 h-8 bg-red-500 rounded"></div>
            <div className="flex-1">
              <div className="text-[9px] text-gray-500">Vencidas</div>
              <div className="text-xs font-semibold mt-0.5 text-gray-700">${vencidas.valor.toFixed(2)}</div>
              <div className="text-[8px] text-gray-500 mt-0.5">{vencidas.documentos} documentos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
