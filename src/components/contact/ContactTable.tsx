"use client";

import * as React from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { Pencil, Trash2, X } from "lucide-react";

import { getContactColumns } from "@/components/contact/table/columns";
import { ContactTableToolbar } from "@/components/contact/table/ContactTableToolbar";
import { ContactFilterChips } from "@/components/contact/table/ContactFilterChips";
import { ContactTableBody } from "@/components/contact/table/ContactTableBody";
import { ContactTablePagination } from "@/components/contact/table/ContactTablePagination";

interface ServerPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

interface Contact {
  id: number;
  name: string;
  identification: string;
  phone: string;
  type: 'customer' | 'provider' | 'both';
}

interface ContactTableProps {
  contacts: Contact[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  activeTab?: "all" | "customer" | "provider";
  search?: string;
  setSearch?: (v: string) => void;
  page: number;
  setPage: (p: number) => void;
  perPage: number;
  setPerPage: (n: number) => void;
  pagination: ServerPagination;
  onDelete: (id: number) => void;
  onAddContact?: () => void;
}

type SelectionState = Record<string, boolean>;

export function ContactTable({
  contacts,
  loading,
  refreshing = false,
  onRefresh,
  activeTab = "all",
  search = "",
  setSearch,
  page,
  setPage,
  perPage,
  setPerPage,
  pagination,
  onDelete,
  onAddContact,
}: ContactTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [selection, setSelection] = React.useState<SelectionState>({});

  const toggleSelection = React.useCallback((id: number) => {
    setSelection(prev => {
      const key = String(id);
      const newSel = { ...prev };
      if (newSel[key]) {
        delete newSel[key];
      } else {
        newSel[key] = true;
      }
      return newSel;
    });
  }, []);

  const toggleSelectAll = React.useCallback(() => {
    setSelection(prev => {
      const visibleIds = new Set(contacts.map(c => String(c.id)));
      const areAllVisibleSelected = contacts.length > 0 && contacts.every(c => prev[String(c.id)]);
      
      if (areAllVisibleSelected) {
        const newSel: SelectionState = {};
        Object.keys(prev).forEach(key => {
          if (!visibleIds.has(key)) {
            newSel[key] = true;
          }
        });
        return newSel;
      } else {
        const newSel: SelectionState = {};
        contacts.forEach(c => {
          newSel[String(c.id)] = true;
        });
        return { ...prev, ...newSel };
      }
    });
  }, [contacts]);

  const allSelected = React.useMemo(() => {
    if (contacts.length === 0) return false;
    return contacts.every((c) => selection[String(c.id)]);
  }, [contacts, selection]);

  const someSelected = React.useMemo(() => {
    return contacts.some((c) => selection[String(c.id)]);
  }, [contacts, selection]);

  const columns = React.useMemo(() => 
    getContactColumns(
      onDelete,
      activeTab,
      toggleSelection, 
      toggleSelectAll,
      allSelected,
      someSelected,
      selection
    ), 
    [onDelete, activeTab, toggleSelection, toggleSelectAll, allSelected, someSelected, selection]
  );

  const table = useReactTable({
    data: contacts,
    columns,
    getRowId: (row) => String(row.id),
    state: { 
      sorting, 
      columnFilters, 
      columnVisibility,
      rowSelection: selection,
    },
    onRowSelectionChange: setSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualFiltering: true,
    rowCount: pagination.total,
  });

  function handleAddFilter() {
    const newFilters = [
      { id: 'status', value: '' },
      { id: 'phone', value: '' },
    ];
    setColumnFilters(newFilters);
  }

  const selectedCount = Object.keys(selection).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="relative">
        <ContactTableToolbar
          table={table}
          search={search}
          setSearch={setSearch ?? (() => {})}
          onAddFilter={handleAddFilter}
        />

      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          selectedCount > 0 
            ? "max-h-32 opacity-100 translate-y-0 mb-4" 
            : "max-h-0 opacity-0 -translate-y-4 mb-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 z-20 flex h-full items-center justify-between px-4 bg-teal-500 rounded-lg">
          <span className="text-sm font-medium text-white">
            {selectedCount} fila{selectedCount > 1 ? 's' : ''} seleccionad{selectedCount > 1 ? 'as' : 'a'}s
          </span>
          <div className="flex items-center gap-1">
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-white hover:bg-white/20 rounded transition"
              onClick={() => console.log('Edit selected')}
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-white hover:bg-white/20 rounded transition"
              onClick={() => {
                Object.keys(selection).forEach(id => {
                  onDelete(Number(id));
                });
                setSelection({});
              }}
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-white hover:bg-white/20 rounded transition"
              onClick={() => setSelection({})}
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      </div>
      </div>

      <ContactFilterChips
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        table={table}
        onAddFilter={handleAddFilter}
      />

      <ContactTableBody
        table={table}
        columns={columns}
        loading={loading}
        rowSelection={selection}
        onToggleSelection={toggleSelection}
        activeTab={activeTab}
        searchTerm={search}
        onAddContact={onAddContact}
      />

      <ContactTablePagination
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        pagination={pagination}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </div>
  );
}