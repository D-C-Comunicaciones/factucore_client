"use client";

import * as React from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { Pencil, Trash2, X, Loader2 } from "lucide-react";

import { getContactColumns } from "@/components/contact/table/columns";
import { useTableSelection } from "@/hooks/use-table-selection";
import { ContactTableToolbar } from "@/components/contact/table/ContactTableToolbar";
import { ContactFilterChips } from "@/components/contact/table/ContactFilterChips";
import { ContactTableBody } from "@/components/contact/table/ContactTableBody";
import { ContactTablePagination } from "@/components/contact/table/ContactTablePagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { BulkEditContactsModal } from "@/components/contact/table/BulkEditContactsModal";
import { ContactsService } from "@/lib/contacts";
import { showToast } from "@/components/sonner/CustomToaster";
import { isConsumerFinal } from "@/utils/is-consumer-final";

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
  is_active?: boolean;
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
  onToggleActive?: (id: number, currentlyActive: boolean) => void;
  onAddContact?: () => void;
}

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
  onToggleActive = () => {},
  onAddContact,
}: ContactTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const getRowUniqueId = React.useCallback(
    (contact: Contact) => String(contact.id),
    []
  );

  const {
    selection,
    setSelection,
    toggle: toggleSelectionById,
    toggleAll: toggleSelectAll,
    allSelected,
    someSelected,
  } = useTableSelection(contacts, getRowUniqueId);

  const toggleSelection = React.useCallback(
    (id: number) => toggleSelectionById(String(id)),
    [toggleSelectionById]
  );

  const columns = React.useMemo(
    () => getContactColumns(onDelete, activeTab, onToggleActive),
    [onDelete, activeTab, onToggleActive]
  );

  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);
  const [bulkDeleting, setBulkDeleting] = React.useState(false);
  const [bulkEditOpen, setBulkEditOpen] = React.useState(false);

  const selectedIds = React.useMemo(() => Object.keys(selection).map(Number), [selection]);
  const selectionIncludesFinalConsumer = React.useMemo(
    () => contacts.some((c) => selection[String(c.id)] && isConsumerFinal(c.identification)),
    [contacts, selection]
  );

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      const results = await Promise.allSettled(selectedIds.map((id) => ContactsService.delete(id)));
      const failed = results.filter((r) => r.status === "rejected").length;
      const succeeded = results.length - failed;

      if (succeeded > 0) {
        showToast(`${succeeded} contacto${succeeded > 1 ? "s" : ""} eliminado${succeeded > 1 ? "s" : ""} correctamente`, "success");
      }
      if (failed > 0) {
        showToast(`No se pudieron eliminar ${failed} contacto${failed > 1 ? "s" : ""} (puede que tengan documentos asociados)`, "error");
      }

      setSelection({});
      onRefresh?.();
    } finally {
      setBulkDeleting(false);
      setBulkDeleteOpen(false);
    }
  };

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
        <div className="flex items-center justify-between px-4 py-2.5 bg-teal-500 rounded-lg relative z-10">
          <span className="text-sm font-medium text-white">
            {selectedCount} fila{selectedCount > 1 ? 's' : ''} seleccionad{selectedCount > 1 ? 'as' : 'a'}s
          </span>
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <button
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-white hover:bg-white/20 rounded transition cursor-pointer"
                onClick={() => setBulkEditOpen(true)}
              >
                <Pencil className="w-4 h-4" />
                Editar
              </button>

              {selectionIncludesFinalConsumer ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <button
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-white/50 rounded cursor-not-allowed"
                        disabled
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-64 text-center">
                    La selección de contactos incluye el contacto genérico, obligatorio en el sistema. No es posible eliminarlos.
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-white hover:bg-white/20 rounded transition cursor-pointer"
                  onClick={() => setBulkDeleteOpen(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              )}

              <span className="w-px h-4 bg-white/30 mx-1" />

              <button
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-white hover:bg-white/20 rounded transition cursor-pointer"
                onClick={() => setSelection({})}
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </TooltipProvider>
        </div>
      </div>
      </div>

      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`¿Eliminar ${selectedIds.length} contacto${selectedIds.length > 1 ? "s" : ""}?`}
        description="Se moverán a la papelera y podrás restaurarlos cuando lo necesites. Los contactos con documentos asociados (facturas, notas crédito, remisiones, cotizaciones, órdenes de compra o pagos) no podrán eliminarse."
        onConfirm={handleBulkDelete}
        loading={bulkDeleting}
      />

      <BulkEditContactsModal
        open={bulkEditOpen}
        onOpenChange={setBulkEditOpen}
        contactIds={selectedIds}
        onDone={() => {
          setSelection({});
          onRefresh?.();
        }}
      />

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
        allSelected={allSelected}
        someSelected={someSelected}
        onToggleSelectAll={toggleSelectAll}
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