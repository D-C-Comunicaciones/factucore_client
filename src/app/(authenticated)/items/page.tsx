"use client";

import * as React from "react";
import { Plus, ChevronDown, Upload, Download, RefreshCw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ItemTable } from "@/components/items/ItemTable";
import { NewItemModal } from "@/components/items/NewItemModal";
import { ExportItemsModal, type ExportConfig } from "@/components/items/ExportItemsModal";
import { useDebounce } from "@/hooks/useDebounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Item } from "@/components/items/table/columns";
import { AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

export interface FormState {
  itemType: "producto" | "servicio" | "combo";
  name: string;
  bodega: string;
  unit: string;
  initialQty: string;
  initialCost: string;
  basePrice: string;
  tax: string;
  totalPrice: string;
}

/* -----------------------------------------------------------------------
   Mock data – reemplazar por llamada a la API cuando esté disponible
   ----------------------------------------------------------------------- */
const MOCK_ITEMS: Item[] = [
  {
    id: 1,
    name: "Servicio de consultoría",
    reference: "SRV-001",
    price: 250000,
    description: "Consultoría especializada por hora en desarrollo de software.",
    active: true,
  },
  {
    id: 2,
    name: "Licencia de software anual",
    reference: "LIC-002",
    price: 1200000,
    description: "Licencia de uso anual para la plataforma de facturación electrónica.",
    active: true,
  },
  {
    id: 3,
    name: "Soporte técnico mensual",
    reference: "SOP-003",
    price: 180000,
    description: "Plan de soporte técnico con atención prioritaria durante el mes.",
    active: false,
  },
  {
    id: 4,
    name: "Capacitación grupal",
    reference: "CAP-004",
    price: 500000,
    description: "Sesión de capacitación para equipos de hasta 10 personas.",
    active: true,
  },
];

export default function ItemsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [items, setItems] = React.useState<Item[]>(MOCK_ITEMS);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [exportModalOpen, setExportModalOpen] = React.useState(false);

  // Form State
  const [form, setForm] = React.useState<FormState>({
    itemType: "producto",
    name: "",
    bodega: "Principal",
    unit: "",
    initialQty: "",
    initialCost: "",
    basePrice: "",
    tax: "0",
    totalPrice: "",
  });
  const [errors, setErrors] = React.useState<Record<string, boolean>>({});

  const debouncedSearch = useDebounce(search, 600);

  /* ---------- Filtering (client-side) ---------- */
  const filteredItems = React.useMemo(() => {
    if (!debouncedSearch) return items;
    const lower = debouncedSearch.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.reference.toLowerCase().includes(lower)
    );
  }, [items, debouncedSearch]);

  /* ---------- Pagination (client-side) ---------- */
  const paginatedItems = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, page, perPage]);

  const pagination = {
    current_page: page,
    per_page: perPage,
    total: filteredItems.length,
    last_page: Math.max(1, Math.ceil(filteredItems.length / perPage)),
    from: filteredItems.length === 0 ? 0 : (page - 1) * perPage + 1,
    to: Math.min(page * perPage, filteredItems.length),
  };

  /* ---------- Handlers ---------- */
  const handleRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 600);
  }, []);

  const handleView = React.useCallback((id: number) => {
    console.log("Ver ítem:", id);
  }, []);

  const handleEdit = React.useCallback((id: number) => {
    console.log("Editar ítem:", id);
  }, []);

  const handleToggleActive = React.useCallback((id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  }, []);

  const handleDelete = React.useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleNewItem = React.useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setModalOpen(false);
    setForm({
      itemType: "producto",
      name: "",
      bodega: "Principal",
      unit: "",
      initialQty: "",
      initialCost: "",
      basePrice: "",
      tax: "0",
      totalPrice: "",
    });
    setErrors({});
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.unit) newErrors.unit = true;

    // Solo validar cantidad/costo para productos
    if (form.itemType === "producto") {
      if (!form.initialQty) newErrors.initialQty = true;
      if (!form.initialCost) newErrors.initialCost = true;
    }

    if (!form.basePrice) newErrors.basePrice = true;
    if (!form.totalPrice) newErrors.totalPrice = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.custom((t) => (
        <div className="bg-[#fef2f2] border border-[#fee2e2] rounded-2xl p-4 shadow-xl max-w-md flex items-start gap-3 relative animate-in slide-in-from-right w-[380px]">
          <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-[#dc2626]" />
          </div>
          <div className="flex-1 pr-6">
            <h4 className="text-sm font-bold text-[#1e293b]">Error</h4>
            <p className="text-sm text-[#475569] mt-0.5">
              Debes verificar los campos marcados en rojo para continuar
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="absolute top-4 right-4 text-[#94a3b8] hover:text-[#64748b]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ), { duration: 4000, unstyled: true });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Ítem creado:", form);
      // Aquí iría la llamada a la API
      handleCloseModal();
    }
  };

  const handleExport = (config: ExportConfig) => {
    // Generar contenido para exportar (CSV básico)
    const headers = ["Nombre", "Referencia", "Precio", "Estado"];
    const rows = filteredItems.map(item => [
      item.name,
      item.reference,
      config.decimalSeparator === "comma" 
        ? item.price.toString().replace(".", ",") 
        : item.price.toString(),
      item.active ? "Activo" : "Inactivo"
    ]);

    const separator = config.fileType === "csv" ? "," : ";";
    const csvContent = [
      headers.join(separator),
      ...rows.map(r => r.join(separator))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `export_items_${new Date().getTime()}.${config.fileType === "excel" ? "xls" : "csv"}`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-screen text-foreground">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

        {/* HEADER */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">

            <h1 className="text-lg md:text-xl font-bold text-foreground">
              Ítems de Venta
            </h1>

            <div className="flex items-center gap-2">

              {/* Más acciones */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-border text-foreground hover:bg-primary/10 hover:text-foreground"
                  >
                    Más acciones
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-44 bg-popover text-popover-foreground border border-border"
                >
                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                    onClick={() => router.push("/items/imports/new")}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                    onClick={() => setExportModalOpen(true)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualizar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Nuevo ítem */}
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-6 ml-1"
                onClick={handleNewItem}
              >
                <Plus className="w-3 h-3 mr-1" />
                Nuevo ítem
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Gestiona los productos y servicios que ofreces para asociarlos en tus facturas.
          </p>
        </div>

        {/* TABLE */}
        <div className="w-full">
          <ItemTable
            items={paginatedItems}
            loading={isRefreshing}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            search={search}
            setSearch={setSearch}
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            pagination={pagination}
            onView={handleView}
            onEdit={handleEdit}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
            onNewItem={handleNewItem}
          />
        </div>

      </div>

      {/* MODAL */}
      <NewItemModal
        open={modalOpen}
        form={form}
        setForm={setForm}
        errors={errors}
        setErrors={setErrors}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      {/* EXPORT MODAL */}
      <ExportItemsModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        onExport={handleExport}
      />
    </div>
  );
}
