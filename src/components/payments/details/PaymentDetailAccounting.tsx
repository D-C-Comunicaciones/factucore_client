import React from "react";
import { Info } from "lucide-react";

export function PaymentDetailAccounting() {
  return (
    <div className="p-10 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <Info className="w-6 h-6 text-blue-500" />
      </div>
      <h3 className="text-sm font-medium text-slate-800 mb-1">
        Sin información contable
      </h3>
    </div>
  );
}
