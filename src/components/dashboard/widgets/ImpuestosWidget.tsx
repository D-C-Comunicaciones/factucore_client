"use client";
import React from 'react';

interface ImpuestosWidgetProps {
  total: number;
}

export function ImpuestosWidget({ total }: ImpuestosWidgetProps) {
  return (
    <div className="h-full flex flex-col p-1">
      <h3 className="text-[11px] font-medium text-gray-600 mb-1.5">Impuestos en venta</h3>
      <div className="text-lg font-bold mt-auto text-gray-800">${total.toFixed(2)}</div>
    </div>
  );
}
