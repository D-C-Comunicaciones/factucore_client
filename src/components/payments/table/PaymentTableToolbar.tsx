"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Search, ListOrdered, Users, Calendar, Landmark, CircleSlash, DollarSign } from "lucide-react";
import { InvoiceFilter } from "@/components/invoice/InvoiceFilter";
import { DebouncedInput } from "@/components/ui/debounced-input";

interface FilterOption {
  label: string;
  value: string;
  icon: React.ElementType;
}

const paymentFilterOptions: FilterOption[] = [
  { value: "number", label: "Número", icon: ListOrdered },
  { value: "customer", label: "Cliente", icon: Users },
  { value: "created_at", label: "Fecha de creación", icon: Calendar },
  { value: "account_name", label: "Cuenta bancaria", icon: Landmark },
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
          <DebouncedInput
            placeholder="Buscar por número o cliente"
            value={search}
            onChange={setSearch}
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
