"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Search, ListOrdered, Users, Calendar, Landmark, CircleSlash, DollarSign } from "lucide-react";
import { InvoiceFilter } from "@/components/invoice/InvoiceFilter";

interface FilterOption {
  label: string;
  value: string;
  icon: React.ElementType;
}

const paymentFilterOptions: FilterOption[] = [
  { value: "number", label: "Número", icon: ListOrdered },
  { value: "client", label: "Cliente", icon: Users },
  { value: "created_at", label: "Fecha de creación", icon: Calendar },
  { value: "bank_account", label: "Cuenta bancaria", icon: Landmark },
  { value: "payment_status", label: "Estado de pago", icon: CircleSlash },
  { value: "amount", label: "Monto", icon: DollarSign },
];

interface PaymentTableToolbarProps {
  table: Table<any>;
  search: string;
  setSearch: (v: string) => void;
  onAddFilter?: (filterValue: string) => void;
}

export function PaymentTableToolbar({
  table,
  search,
  setSearch,
  onAddFilter,
}: PaymentTableToolbarProps) {
  return (
    <div className="h-12 px-4 border-b border-gray-200 flex items-center gap-2">
      <div className="flex w-full md:w-auto items-center gap-2">
        <div className="relative w-full md:w-65">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Buscar por número o cliente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full pl-9 pr-2 border border-gray-200 rounded-md text-xs bg-white"
          />
        </div>
        {onAddFilter && (
          <InvoiceFilter
            options={paymentFilterOptions}
            selected=""
            onSelect={onAddFilter}
          />
        )}
      </div>
    </div>
  );
}
