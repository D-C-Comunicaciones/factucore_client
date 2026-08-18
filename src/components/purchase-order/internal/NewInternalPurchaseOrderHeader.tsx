"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";

interface NewInternalPurchaseOrderHeaderProps {
  showWarehouse: boolean;
  setShowWarehouse: (show: boolean) => void;
  showCostCenter: boolean;
  setShowCostCenter: (show: boolean) => void;
  title?: string;
}

export function NewInternalPurchaseOrderHeader({
  showWarehouse,
  setShowWarehouse,
  showCostCenter,
  setShowCostCenter,
  title = "Nueva orden de compra",
}: NewInternalPurchaseOrderHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center text-sm text-primary mb-2 font-medium">
        <Link href="/expenses/purchase-orders" className="hover:underline">
          Órdenes de compra
        </Link>
        <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
        <span className="text-slate-500">{title}</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#001D4A]">{title}</h1>

        <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all border h-[38px] ${
            isOpen
              ? "border-primary bg-white text-primary shadow-sm ring-1 ring-primary/20"
              : "border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Personalizar opciones
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <div className="absolute right-0 top-full mt-2 w-[240px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 animate-in fade-in-50 slide-in-from-top-1 duration-200">
              <h4 className="text-[13px] font-bold text-primary mb-3">Opciones disponibles</h4>
              <div className="border-t border-gray-100 my-2"></div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-[13px] text-gray-700 group-hover:text-gray-900 font-medium">Bodega</span>
                  <input
                    type="checkbox"
                    checked={showWarehouse}
                    onChange={(e) => setShowWarehouse(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-[13px] text-gray-700 group-hover:text-gray-900 font-medium">Centro de costo</span>
                  <input
                    type="checkbox"
                    checked={showCostCenter}
                    onChange={(e) => setShowCostCenter(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary accent-primary"
                  />
                </label>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
