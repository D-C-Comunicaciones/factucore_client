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
import { showToast } from "@/components/sonner/CustomToaster";
import { useItems } from "@/hooks/items/useItems";
import { useToggleItemStatus } from "@/hooks/items/useToggleItemStatus";
import { useDeleteItem } from "@/hooks/items/useDeleteItem";
import { useItemCatalogs } from "@/hooks/items/useItemCatalogs";
import { useCreateItem } from "@/hooks/items/useCreateItem";
import { Item } from "@/types/items";

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


export default function ItemsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
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

  const catalogs = useItemCatalogs();
  const { mutate: createItem, isPending: isCreating } = useCreateItem();

  const debouncedSearch = useDebounce(search, 600);

  const { data, isLoading: isLoadingItems, isRefetching, refetch } = useItems({
    search: debouncedSearch,
    page,
    per_page: perPage,
  });

  const { mutate: toggleStatus } = useToggleItemStatus();
  const { mutate: deleteItem } = useDeleteItem();

  const items = data?.data || [];
  const pagination = data ? {
    current_page: data.current_page,
    per_page: data.per_page,
    total: data.total,
    last_page: data.last_page,
    from: (data.current_page - 1) * data.per_page + 1,
    to: Math.min(data.current_page * data.per_page, data.total),
  } : {
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0,
  };

  /* ---------- Handlers ---------- */
  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const handleView = React.useCallback((id: number) => {
    router.push(`/items/${id}`);
  }, [router]);

  const handleEdit = React.useCallback((id: number) => {
    router.push(`/items/${id}/edit`);
  }, [router]);

  const handleToggleActive = React.useCallback((id: number) => {
    toggleStatus(id);
  }, [toggleStatus]);

  const handleDelete = React.useCallback((id: number) => {
    deleteItem(id);
  }, [deleteItem]);

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
      showToast("Debes verificar los campos marcados en rojo para continuar", "error");
      return false;
    }
    return true;
  };

  const handleAdvanced = () => {
    const params = new URLSearchParams({
      type: form.itemType,
      name: form.name,
      basePrice: form.basePrice,
      tax: form.tax,
      unit: form.unit,
      bodega: form.bodega,
      qty: form.initialQty,
      cost: form.initialCost
    });
    router.push(`/items/new?${params.toString()}`);
    handleCloseModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (form.itemType === "combo") {
        // Redirigir siempre al formulario avanzado para combos
        handleAdvanced();
      } else {
        // Buscar IDs en catálogos
        const unitMeasure = catalogs.unitMeasures?.find((u: any) => u.name?.toLowerCase() === form.unit.toLowerCase());
        const unitMeasureId = unitMeasure ? unitMeasure.id : 1; // Fallback a 1

        const warehouse = catalogs.warehouses?.find((w: any) => w.name?.toLowerCase() === form.bodega.toLowerCase());
        const warehouseId = warehouse ? warehouse.id : 1; // Fallback a 1

        const taxRate = catalogs.taxes?.find((t: any) => t.percentage == form.tax);
        const taxId = taxRate ? taxRate.id : null;

        const payload: any = {
            basic_info: {
                type_item_id: form.itemType === "producto" ? 1 : 2,
                name: form.name,
                code: "REF-" + Date.now(), // Código generado automáticamente
                unit_measure_id: unitMeasureId,
                has_variants: false,
            },
            pricing: {
                base_price: parseFloat(form.basePrice) || 0,
                total_price: parseFloat(form.totalPrice) || 0,
                default_cost_price: parseFloat(form.initialCost) || 0,
                tax_id: taxId,
                apply_to_variants: false,
            }
        };

        if (form.itemType === "producto") {
            payload.inventory = {
                initial_stock: {
                    warehouse_id: warehouseId,
                    quantity: parseFloat(form.initialQty) || 0,
                }
            };
        }

        createItem(payload, {
          onSuccess: () => {
            handleCloseModal();
          }
        });
      }
    }
  };

  const handleExport = (config: ExportConfig) => {
    // Generar contenido para exportar (CSV básico)
    const headers = ["Nombre", "Referencia", "Precio", "Estado"];
    const rows = items.map((item: Item) => [
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
      ...rows.map((r: any[]) => r.join(separator))
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

            <h1 className="page-title mb-0">
              Ítems de Venta
            </h1>

            <div className="flex items-center gap-2">

              {/* Más acciones */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="btn-base border-border bg-white text-foreground hover:bg-primary/10 hover:text-foreground"
                  >
                    Más acciones
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-44 bg-popover text-popover-foreground border border-border"
                >
                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer text-base py-2"
                    onClick={() => router.push("/items/imports/new")}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer text-base py-2"
                    onClick={() => setExportModalOpen(true)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors text-base py-2"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualizar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Nuevo ítem */}
              <Button
                className="btn-base bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground ml-1"
                onClick={handleNewItem}
              >
                <Plus className="w-4 h-4 mr-1" />
                Nuevo ítem
              </Button>
            </div>
          </div>

          <p className="page-subtitle mb-0">
            Gestiona los productos y servicios que ofreces para asociarlos en tus facturas.
          </p>
        </div>

        {/* TABLE */}
        <div className="w-full">
          <ItemTable
            items={items}
            loading={isLoadingItems}
            refreshing={isRefetching}
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
        onAdvanced={handleAdvanced}
        isCreating={isCreating}
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
