"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { DateFilterPopoverInline } from "./DateFilterPopoverInline";
import { useRouter } from "next/navigation";
import { Search, Printer, ArrowUp, ArrowDown, Funnel, Trash2 } from "lucide-react";
import { InvoicesService } from "@/lib/invoices";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { InvoiceFilter, defaultFilterOptions } from "./InvoiceFilter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { InvoiceSummary } from "@/types/invoice";

/* =========================
   COLUMNS FACTORY (IMPORTANTE)
   ========================= */
function getColumns(router: ReturnType<typeof useRouter>): ColumnDef<InvoiceSummary>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 48,
    },
    {
      accessorKey: "number",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        // Primer clic: descendente, segundo: ascendente, tercero: reset
        const handleSort = () => {
          if (!isSorted) column.toggleSorting(false); // descendente
          else if (isSorted === "desc") column.toggleSorting(true); // ascendente
          else column.clearSorting(); // reset
        };
        return (
          <button
            className={`flex items-center gap-1 w-full px-2 py-1 rounded group transition-colors duration-100 cursor-pointer ${isSorted ? "bg-[#f1f5fd]" : "hover:bg-[#e5e7eb]"}`}
            onClick={handleSort}
            tabIndex={0}
            type="button"
            style={{ background: "none" }}
          >
            <span className="text-xs font-medium text-gray-700">Número</span>
            <span style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
              {isSorted === "desc" && <ArrowUp className="w-4 h-4 ml-1 text-black" />}
              {isSorted === "asc" && <ArrowDown className="w-4 h-4 ml-1 text-black" />}
              {!isSorted && <ArrowUp className="w-4 h-4 ml-1 text-black opacity-0 group-hover:opacity-60 transition-opacity duration-100" />}
            </span>
          </button>
        );
      },
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs text-gray-900 font-medium">
          {row.original.number}
        </span>
      ),
    },
    {
      accessorKey: "customer",
      header: "Cliente",
      cell: ({ row }) => (
        <span className="text-xs text-gray-900">
          {row.original.customer ?? "NO ESPECIFICADO"}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        const handleSort = () => {
          if (!isSorted) column.toggleSorting(false); // descendente
          else if (isSorted === "desc") column.toggleSorting(true); // ascendente
          else column.clearSorting(); // reset
        };
        return (
          <button
            className={`flex items-center gap-1 w-full px-2 py-1 rounded group transition-colors duration-100 cursor-pointer ${isSorted ? "bg-[#f1f5fd]" : "hover:bg-[#e5e7eb]"}`}
            onClick={handleSort}
            tabIndex={0}
            type="button"
            style={{ background: "none" }}
          >
            <span className="text-xs font-medium text-gray-700">Creación</span>
            <span style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
              {isSorted === "desc" && <ArrowUp className="w-4 h-4 ml-1 text-black" />}
              {isSorted === "asc" && <ArrowDown className="w-4 h-4 ml-1 text-black" />}
              {!isSorted && <ArrowUp className="w-4 h-4 ml-1 text-black opacity-0 group-hover:opacity-60 transition-opacity duration-100" />}
            </span>
          </button>
        );
      },
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs text-gray-600">
          {row.original.created_at}
        </span>
      ),
    },
    {
      accessorKey: "payment_due_date",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        const handleSort = () => {
          if (!isSorted) column.toggleSorting(false); // descendente
          else if (isSorted === "desc") column.toggleSorting(true); // ascendente
          else column.clearSorting(); // reset
        };
        return (
          <button
            className={`flex items-center gap-1 w-full px-2 py-1 rounded group transition-colors duration-100 cursor-pointer ${isSorted ? "bg-[#f1f5fd]" : "hover:bg-[#e5e7eb]"}`}
            onClick={handleSort}
            tabIndex={0}
            type="button"
            style={{ background: "none" }}
          >
            <span className="text-xs font-medium text-gray-700">Vencimiento</span>
            <span style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
              {isSorted === "desc" && <ArrowUp className="w-4 h-4 ml-1 text-black" />}
              {isSorted === "asc" && <ArrowDown className="w-4 h-4 ml-1 text-black" />}
              {!isSorted && <ArrowUp className="w-4 h-4 ml-1 text-black opacity-0 group-hover:opacity-60 transition-opacity duration-100" />}
            </span>
          </button>
        );
      },
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs text-gray-600">
          {row.original.payment_due_date ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => (
        <div className="text-xs text-gray-900 font-medium text-right">
          $ {Number(row.original.total).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "pending_amount",
      header: () => <div className="text-right">Por cobrar</div>,
      cell: ({ row }) => (
        <div className="text-xs text-gray-900 text-right">
          $ {Number(row.original.pending_amount).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "status_dian",
      header: "Estado DIAN",
      cell: ({ row }) => {
        const estado = (row.original.status_dian || "").toLowerCase();
        if (estado === "aprobada") {
          return (
            <span className="inline-flex items-center gap-1 text-xs text-black font-medium">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M7 10.5l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Aprobada
            </span>
          );
        }
        if (estado === "no aprobada") {
          return (
            <span className="inline-flex items-center gap-1 text-xs text-black font-medium">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="7" y1="7" x2="13" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="13" y1="7" x2="7" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              No aprobada
            </span>
          );
        }
        if (estado === "pendiente") {
          return (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M10 6v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Pendiente
            </span>
          );
        }
        return (
          <span className="text-xs text-gray-500">
            {row.original.status_dian}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const estado = (row.original.status || "").toLowerCase();
        if (estado === "enviada") {
          return (
            <span className="inline-flex px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
              Enviada
            </span>
          );
        }
        const styles: Record<string, string> = {
          cobrada: "bg-green-100 text-green-700",
          parcial: "bg-yellow-100 text-yellow-700",
          pendiente: "bg-blue-100 text-blue-700",
          vencida: "bg-red-100 text-red-700",
        };
        const style = styles[estado] ?? "bg-gray-100 text-gray-700";
        return (
          <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${style}`}>
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const invoice = row.original;


        // Usar axios para obtener el PDF
        const handleDownloadPDF = async () => {
          const url = InvoicesService.getPdfUrl(invoice.id, 1);
          try {
            // Importar axios dinámicamente si no está en el scope
            const axios = (await import('axios')).default;
            const response = await axios.get(url, {
              responseType: 'blob',
              headers: {
                Accept: 'application/pdf',
              },
              withCredentials: true, // importante para cookies de sesión
            });
            const blob = response.data;
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `FEV_${invoice.number || invoice.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
          } catch (err) {
            alert('No se pudo descargar el PDF');
          }
        };

        return (
          <div className="relative inline-block text-left">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                    <circle cx="10" cy="4.5" r="1.2" fill="currentColor" />
                    <circle cx="10" cy="10" r="1.2" fill="currentColor" />
                    <circle cx="10" cy="15.5" r="1.2" fill="currentColor" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" sideOffset={8} className="mt-2 min-w-[140px]">
                <DropdownMenuItem onClick={handleDownloadPDF}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 48,
    },
  ];
}

/* =========================
   COMPONENTE
   ========================= */
interface InvoiceTableProps {
  invoices: InvoiceSummary[];
  loading?: boolean;
  columnFilters?: any[];
  setColumnFilters?: (filters: any[]) => void;
  search?: string;
  setSearch?: (v: string) => void;
}

export function InvoiceTable({ invoices, loading, columnFilters, setColumnFilters, search, setSearch }: InvoiceTableProps) {

  // Mapeo de valores del menú de filtro a ids de columna
  const filterValueToColumnId: Record<string, string> = {
    fecha_creacion: "created_at",
    fecha_vencimiento: "payment_due_date",
    estado_dian: "status_dian",
    facturas_vencidas: "pending_amount", // O el id correcto si es otro
    estado: "status",
    numero_factura: "number",
  };

  // Agrega un filtro a columnFilters si no existe
  function handleAddFilter(filterValue: string) {
    const columnId = filterValueToColumnId[filterValue];
    if (!columnId) return;
    const filters = columnFilters ?? [];
    // Si ya existe, no lo agregues de nuevo
    if (filters.some(f => f.id === columnId)) return;
    setColumnFilters?.([...filters, { id: columnId, value: "" }]);
  }
  const router = useRouter();

  const columns = React.useMemo(() => getColumns(router), [router]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalColumnFilters, internalSetColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Permitir control externo de filtros
  const effectiveColumnFilters = columnFilters !== undefined ? columnFilters : internalColumnFilters;
  // Adaptador para TanStack Table: acepta updater o valor
  const setEffectiveColumnFilters = React.useCallback((updaterOrValue: any) => {
    if (setColumnFilters) {
      if (typeof updaterOrValue === "function") {
        // Ejecuta la función con el valor actual y pasa el resultado
        setColumnFilters(updaterOrValue(effectiveColumnFilters));
      } else {
        setColumnFilters(updaterOrValue);
      }
    } else {
      if (typeof updaterOrValue === "function") {
        internalSetColumnFilters((prev) => updaterOrValue(prev));
      } else {
        internalSetColumnFilters(updaterOrValue);
      }
    }
  }, [setColumnFilters, effectiveColumnFilters]);

  const table = useReactTable({
    data: invoices,
    columns,
    state: {
      sorting,
      columnFilters: effectiveColumnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setEffectiveColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: rowsPerPage,
      },
    },
  });

  React.useEffect(() => {
    table.setPageSize(rowsPerPage);
  }, [rowsPerPage, table]);

  const start = table.getState().pagination.pageIndex * rowsPerPage + 1;
  const end =
    start + table.getRowModel().rows.length - 1;

  const total = table.getFilteredRowModel().rows.length;


  // Utilidad para mostrar chips de filtros activos
  const filterLabels: Record<string, string> = {
    customer: "Cliente",
    number: "Número",
    created_at: "Fecha de creación",
    payment_due_date: "Fecha de vencimiento",
    status: "Estado",
    status_dian: "Estado DIAN",
    total: "Total",
    pending_amount: "Por cobrar",
  };



  // Íconos para cada filtro
  const filterIcons: Record<string, React.ReactNode> = {
    customer: <Search className="w-4 h-4 mr-1 text-gray-400" />, // ejemplo
    number: <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><text x="10" y="14" textAnchor="middle" fontSize="8" fill="currentColor">#</text></svg>,
    created_at: <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M7 2v3M13 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="10" cy="11" r="2" fill="currentColor" /></svg>,
    payment_due_date: <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M7 2v3M13 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="14" cy="11" r="2" fill="currentColor" /></svg>,
    status: <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M7 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
    status_dian: <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M7 10.5l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    total: <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><text x="10" y="14" textAnchor="middle" fontSize="10" fill="currentColor">$</text></svg>,
    pending_amount: <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><text x="10" y="14" textAnchor="middle" fontSize="10" fill="currentColor">⏳</text></svg>,
  };


  // Estado para mostrar el menú de filtro flotante '+'
  const [showPlusFilter, setShowPlusFilter] = React.useState(false);
  const plusFilterBtnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Buscar cliente o número"
              value={search ?? (table.getColumn("customer")?.getFilterValue() as string) ?? ""}
              onChange={(e) => {
                setSearch?.(e.target.value);
                table.getColumn("customer")?.setFilterValue(e.target.value);
              }}
              className="w-full pl-9 pr-2 py-1.5 border border-gray-200 rounded-md text-xs"
            />
          </div>
          <InvoiceFilter
            options={defaultFilterOptions}
            selected={""}
            onSelect={handleAddFilter}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Registros por página:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1 text-xs"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros activos como chips: justo debajo del toolbar y antes de la tabla */}
      {(columnFilters?.length ?? 0) > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-t border-b border-gray-200 bg-white relative">
          {(columnFilters ?? []).map((filter) => {
            // Si es filtro de fecha, muestra calendario
            const isDate = filter.id === "created_at" || filter.id === "payment_due_date";
            return (
              <DropdownMenu key={filter.id}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`inline-flex items-center px-3 py-1 rounded-full border ${isDate ? 'border-teal-300 bg-[#f8ffff]' : 'border-gray-300 bg-white'} text-xs text-gray-700 font-medium shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition`}
                    type="button"
                  >
                    {filterIcons[filter.id] || <Funnel className="w-4 h-4 mr-1 text-gray-400" />}
                    <span className="mr-1">{filterLabels[filter.id] || filter.id}</span>
                    <span className="font-normal text-gray-500">
                      {isDate && typeof filter.value === "string" && filter.value
                        ? (() => {
                          const d = new Date(filter.value);
                          if (!isNaN(d.getTime())) return d.toLocaleDateString();
                          return "";
                        })()
                        : typeof filter.value === "string" && filter.value
                          ? filter.value
                          : ""}
                    </span>
                    {/* No icono de eliminar aquí, solo en el menú expandido */}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={4} className="min-w-[220px]">
                  <div className="flex items-center justify-between px-3 pt-2 pb-1 text-xs font-semibold text-gray-600">
                    {filterLabels[filter.id] || filter.id}
                    <button
                      className="ml-2 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition p-0 w-6 h-6 border border-gray-300"
                      style={{ borderRadius: 6 }}
                      onClick={() => {
                        if (setColumnFilters) {
                          setColumnFilters((columnFilters ?? []).filter(f => f.id !== filter.id));
                        } else {
                          internalSetColumnFilters((prev) => prev.filter(f => f.id !== filter.id));
                        }
                      }}
                      title="Quitar filtro"
                    >
                      <Trash2 className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  {/* Opciones específicas por filtro */}
                  {isDate && (
                    <DateFilterPopoverInline
                      filter={filter}
                      setFilterValue={(val) => table.getColumn(filter.id)?.setFilterValue(val)}
                    />
                  )}
                  {/* Estado checkboxes */}
                  {filter.id === "status" && (
                    <div className="flex flex-col gap-1 px-3 py-2">
                      {["Por cobrar", "Cobrada", "Anulada", "Borrador", "Enviada"].map(opt => (
                        <label key={opt} className="flex items-center gap-2 text-xs cursor-pointer">
                          <Checkbox
                            checked={Array.isArray(filter.value) ? filter.value.includes(opt) : filter.value === opt}
                            onCheckedChange={(checked) => {
                              let newValue: string[] = Array.isArray(filter.value) ? [...filter.value] : filter.value ? [filter.value] : [];
                              if (checked) {
                                if (!newValue.includes(opt)) newValue.push(opt);
                              } else {
                                newValue = newValue.filter(v => v !== opt);
                              }
                              table.getColumn(filter.id)?.setFilterValue(newValue);
                            }}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                  {/* Estado DIAN checkboxes */}
                  {filter.id === "status_dian" && (
                    <div className="flex flex-col gap-1 px-3 py-2">
                      {["Aprobada", "No aprobada", "En proceso"].map(opt => (
                        <label key={opt} className="flex items-center gap-2 text-xs cursor-pointer">
                          <Checkbox
                            checked={Array.isArray(filter.value) ? filter.value.includes(opt) : filter.value === opt}
                            onCheckedChange={(checked) => {
                              let newValue: string[] = Array.isArray(filter.value) ? [...filter.value] : filter.value ? [filter.value] : [];
                              if (checked) {
                                if (!newValue.includes(opt)) newValue.push(opt);
                              } else {
                                newValue = newValue.filter(v => v !== opt);
                              }
                              table.getColumn(filter.id)?.setFilterValue(newValue);
                            }}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                  {/* Número de factura input */}
                  {filter.id === "number" && (
                    <div className="px-3 py-2">
                      <input
                        className="w-full border rounded px-2 py-1 text-xs"
                        placeholder="Número de factura"
                        value={filter.value as string}
                        onChange={e => table.getColumn(filter.id)?.setFilterValue(e.target.value)}
                      />
                    </div>
                  )}
                  {/* Facturas vencidas solo label */}
                  {filter.id === "pending_amount" && (
                    <div className="px-3 py-2 text-xs">Facturas vencidas</div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
          {/* Botón + para añadir filtro, solo si hay filtros disponibles */}
          {(columnFilters?.length ?? 0) < defaultFilterOptions.length && (
            <DropdownMenu open={showPlusFilter} onOpenChange={setShowPlusFilter}>
              <DropdownMenuTrigger asChild>
                <button
                  ref={plusFilterBtnRef}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 bg-[#f5f7fa] text-gray-500 hover:bg-gray-100 focus:outline-none ml-1"
                  title="Agregar filtro"
                  type="button"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="none" /><path d="M10 6v8M6 10h8" stroke="#64748b" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={4} className="min-w-[180px]">
                <div className="px-3 py-2 text-xs text-muted-foreground font-semibold">Filtrar Por</div>
                {defaultFilterOptions.map((opt) => {
                  // Solo mostrar opciones que no estén ya activas
                  const columnId = filterValueToColumnId[opt.value];
                  if ((columnFilters ?? []).some(f => f.id === columnId)) return null;
                  const Icon = opt.icon;
                  return (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => {
                        handleAddFilter(opt.value);
                        setShowPlusFilter(false);
                      }}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {opt.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <button
            className="ml-auto text-xs text-black font-medium px-2 py-1 rounded focus:outline-none hover:no-underline"
            style={{ textDecoration: "none" }}
            onClick={() => (columnFilters ?? []).forEach(f => table.getColumn(f.id)?.setFilterValue(""))}
          >
            Remover filtros
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-gray-50">
                {hg.headers.map((header, idx) => {
                  // Solo aplicar hover/cursor-pointer a número, creación y vencimiento
                  const sortableIds = ["number", "created_at", "payment_due_date"];
                  const isSortable = sortableIds.includes(header.column.id);
                  // Detectar si es la columna de acciones (última y id === 'actions')
                  const isActions = header.column.id === "actions";
                  let thClass = "";
                  if (isActions) {
                    // No borde derecho ni redondeo
                    thClass = "";
                  } else if (idx === 0) {
                    thClass = "rounded-l-xl border-l border-gray-200";
                  } else if (idx === hg.headers.length - 1) {
                    thClass = "rounded-r-xl border-r border-gray-200";
                  }
                  if (isSortable) {
                    thClass += " group hover:bg-[#e5e7eb] transition-colors duration-100 cursor-pointer";
                  }
                  return (
                    <TableHead
                      key={header.id}
                      className={thClass}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <TableRow key={"skeleton-" + idx}>
                  {columns.map((_, colIdx) => (
                    <TableCell key={colIdx}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64 text-center align-middle">
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 text-gray-300">
                      <rect x="8" y="10" width="32" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                      <rect x="14" y="18" width="20" height="2" rx="1" fill="currentColor" />
                      <rect x="14" y="24" width="12" height="2" rx="1" fill="currentColor" />
                    </svg>
                    <div className="text-lg font-semibold text-gray-700">Sin resultados</div>
                    <div className="text-sm text-gray-500 mt-1">La búsqueda no arrojó facturas electrónicas</div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION (MISMO DISEÑO QUE TU UI) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 border-t border-gray-200 gap-2">

        <div className="text-xs text-gray-600">
          {table.getFilteredSelectedRowModel().rows.length} de {total} seleccionados.
        </div>

        <div className="text-xs text-gray-600">
          Mostrando {total === 0 ? 0 : start}-{end} de {total} registros
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>

          <span className="text-xs">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}