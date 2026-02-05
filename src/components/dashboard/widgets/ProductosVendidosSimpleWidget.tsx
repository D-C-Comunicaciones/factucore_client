"use client";
import React from 'react';

interface ProductosVendidosSimpleWidgetProps {
  total: number;
}

export function ProductosVendidosSimpleWidget({ total }: ProductosVendidosSimpleWidgetProps) {
  return (
    <div className="h-full flex flex-col p-1">
      <h3 className="text-[11px] font-medium text-gray-600 mb-1.5">Productos vendidos</h3>
      <div className="text-lg font-bold mt-auto text-gray-800">{total}</div>
    </div>
  );
}
