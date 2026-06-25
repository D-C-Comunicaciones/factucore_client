"use client";

import * as React from "react";
import { Plus, ChevronDown, Upload, Download, RefreshCw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ColumnFiltersState } from "@tanstack/react-table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/components/sonner/CustomToaster";
import { useItems } from "@/hooks/items/useItems";
import { useToggleItemStatus } from "@/hooks/items/useToggleItemStatus";
import { useDeleteItem } from "@/hooks/items/useDeleteItem";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useCreateItem } from "@/hooks/items/useCreateItem";
import { CreateItemPayload, ItemListResponse } from "@/types/items";

export type FormState = {
  itemType: "producto" | "servicio" | "combo";
  name: string;
  reference: string;
  categoryId: string;
  bodega: string;
  unit: string;
  comboCode: string;
  initialQuantity: string;
  initialCost: string;
  basePrice: string;
  totalPrice: string;
  tax: string;
};

export default function ItemsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [exportModalOpen, setExportModalOpen] = React.useState(false);
  const [selectedPriceList, setSelectedPriceList] = React.useState<string>("General");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  // Form State
  const [form, setForm] = React.useState<FormState>({
    itemType: "producto",
    name: "",
    reference: "",
    categoryId: "",
    bodega: "Principal",
    unit: "",
    comboCode: "",
    initialQuantity: "",
    initialCost: "",
    basePrice: "",
    totalPrice: "",
    tax: "0",
  });
  const [errors, setErrors] = React.useState<Record<string, boolean>>({});

  const catalogs = useCatalogs();
  const catalogsData = {
    taxes: catalogs.taxes,
    taxTypes: catalogs.taxTypes,
    categories: catalogs.categories,
    warehouses: catalogs.warehouses,
    unitMeasures: catalogs.unitMeasures,
    isLoading: catalogs.isLoading,
  };
  const { mutate: createItem, isPending: isCreating } = useCreateItem();

  const debouncedSearch = useDebounce(search, 600);

  const buildApiFilters = React.useCallback(() => {
    const apiParams: Record<string, any> = {};

    // Map selected price list
    if (selectedPriceList !== "General" && selectedPriceList) {
      const pl = catalogs.priceLists?.find((p: any) => p.name === selectedPriceList);
      if (pl) {
        apiParams.price_list_id = pl.id;
      }
    }

    // Map column filters
    columnFilters.forEach((f) => {
      // Ignorar valores vacíos (pero permitir false, que es un valor válido para el filtro "active")
      if (f.value === "" || f.value === undefined || f.value === null) return;
      if (f.id !== "active" && f.value === false) return;

      if (f.id === "type") {
        if (f.value === "producto") apiParams.Type_item_id = 1;
        else if (f.value === "servicio") apiParams.Type_item_id = 2;
        else if (f.value === "combo") apiParams.Type_item_id = 3;
      } else if (f.id === "active") {
        apiParams.is_active = f.value ? 1 : 0;
      } else if (f.id === "reference") {
        apiParams.Reference = f.value;
      } else if (f.id === "description") {
        apiParams.Description = f.value;
      } else if (f.id === "price") {
        apiParams.Price = f.value;
      } else if (f.id === "warehouse") {
        const w = catalogs.warehouses?.find((w: any) => w.name === f.value);
        if (w) apiParams.Warehouse_id = w.id;
      } else if (f.id === "category") {
        const c = catalogs.categories?.find((c: any) => c.name === f.value);
        if (c) apiParams.Category_id = c.id;
      } else if (f.id === "inventariable") {
        apiParams.Inventariable = f.value ? 1 : 0;
      }
    });

    return apiParams;
  }, [selectedPriceList, columnFilters, catalogs]);

  const { data, isLoading: isLoadingItems, isRefetching, refetch } = useItems({
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    page,
    per_page: perPage,
    ...buildApiFilters(),
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

  const handleToggleActive = React.useCallback((
    ids: number | number[],
    isActive?: boolean,
    entityType?: "item" | "variant"
  ) => {
    toggleStatus({ ids, isActive, entityType: entityType ?? "item" });
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
      reference: "",
      categoryId: "",
      bodega: "Principal",
      unit: "",
      comboCode: "",
      initialQuantity: "",
      initialCost: "",
      basePrice: "",
      totalPrice: "",
      tax: "0",
    });
    setErrors({});
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.unit) newErrors.unit = true;

    if (form.itemType === "producto") {
      if (!form.bodega) newErrors.bodega = true;
      if (!form.initialQuantity) newErrors.initialQuantity = true;
      if (!form.initialCost) newErrors.initialCost = true;
    } else if (form.itemType === "combo") {
      if (!form.bodega) newErrors.bodega = true;
      // if (!form.comboCode) newErrors.comboCode = true; // Opcional según UI
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
      qty: form.initialQuantity,
      cost: form.initialCost
    });
    router.push(`/items/new?${params.toString()}`);
    handleCloseModal();
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    const unitMeasureId = parseInt(form.unit) || 1;

    const warehouse =
      catalogsData.warehouses?.find(
        (w: any) =>
          w.name?.toLowerCase() ===
          form.bodega.toLowerCase()
      );

    const warehouseId =
      warehouse?.id ?? 1;

    const taxRateIds =
      form.tax && form.tax !== "0"
        ? [Number(form.tax)]
        : [];

    /* ==================================================================== */
    /* PRODUCTO                                                             */
    /* ==================================================================== */

    if (form.itemType === "producto") {
      const payload: CreateItemPayload = {
        basic_info: {
          type_item_id: 1,
          type_item_identification_id: 1,
          name: form.name,
          reference:
            form.reference || undefined,
          category_id: form.categoryId
            ? Number(form.categoryId)
            : undefined,
          unit_measure_id:
            unitMeasureId,
          has_variants: false,
        },

        pricing: {
          base_price:
            parseFloat(form.basePrice) ||
            0,

          total_price:
            parseFloat(form.totalPrice) ||
            0,

          default_cost_price:
            parseFloat(
              form.initialCost
            ) || 0,

          apply_to_variants: false,

          tax_rate_ids: taxRateIds,

          price_lists: [
            {
              id: 1,
              value:
                parseFloat(
                  form.basePrice
                ) || 0,
            },
          ],
        },

        inventory: {
          initial_stock: {
            warehouse_id: warehouseId,

            quantity:
              parseFloat(
                form.initialQuantity
              ) || 0,
          },
        },
      };

      createItem(payload, {
        onSuccess: () => {
          handleCloseModal();
        },
      });

      return;
    }

    /* ==================================================================== */
    /* SERVICIO                                                             */
    /* ==================================================================== */

    if (form.itemType === "servicio") {
      const payload: CreateItemPayload = {
        basic_info: {
          type_item_id: 2,
          type_item_identification_id: 1,
          name: form.name,
          reference:
            form.reference || undefined,
          category_id: form.categoryId
            ? Number(form.categoryId)
            : undefined,
          unit_measure_id:
            unitMeasureId,
          has_variants: false,
        },

        pricing: {
          base_price:
            parseFloat(form.basePrice) ||
            0,

          total_price:
            parseFloat(form.totalPrice) ||
            0,

          apply_to_variants: false,

          tax_rate_ids: taxRateIds,

          price_lists: [
            {
              id: 1,
              value:
                parseFloat(
                  form.basePrice
                ) || 0,
            },
          ],
        },
      };

      createItem(payload, {
        onSuccess: () => {
          handleCloseModal();
        },
      });

      return;
    }

    /* ==================================================================== */
    /* COMBO                                                                 */
    /* ==================================================================== */

    const payload: CreateItemPayload = {
      basic_info: {
        type_item_id: 3,
        type_item_identification_id: 1,
        name: form.name,
        reference:
          form.reference || undefined,
        category_id: form.categoryId
          ? Number(form.categoryId)
          : undefined,
        unit_measure_id:
          unitMeasureId,
        has_variants: false,
      },

      pricing: {
        base_price:
          parseFloat(form.basePrice) ||
          0,

        total_price:
          parseFloat(form.totalPrice) ||
          0,

        apply_to_variants: false,

        tax_rate_ids: taxRateIds,

        price_lists: [
          {
            id: 1,
            value:
              parseFloat(
                form.basePrice
              ) || 0,
          },
        ],
      },

      combo_settings: {
        cost_calculation_mode_id: 1,

        components: [
          {
            child_item_id:
              form.comboCode &&
                !isNaN(
                  Number(form.comboCode)
                )
                ? Number(
                  form.comboCode
                )
                : 1,

            quantity: 1,
          },
        ],
      },
    };

    createItem(payload, {
      onSuccess: () => {
        handleCloseModal();
      },
    });
  };

  const handleExport = (config: ExportConfig) => {
    // Generar contenido para exportar (CSV básico)
    const headers = ["Nombre", "Referencia", "Precio", "Estado"];
    const rows = items.map((item: ItemListResponse) => [
      item.name,
      item.reference,
      config.decimalSeparator === "comma"
        ? item.price.toString().replace(".", ",")
        : item.price.toString(),
      (item.is_active ?? item.active) ? "Activo" : "Inactivo"
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

        {/* PRICE LIST SELECTOR */}
        <div className="mb-6 w-full max-w-xs">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Lista de precios
          </label>
          <Select
            value={selectedPriceList}
            onValueChange={setSelectedPriceList}
          >
            <SelectTrigger className="w-full bg-white h-9 border border-border/60 text-sm focus:ring-1 focus:ring-primary/20 transition-all rounded-lg">
              <SelectValue placeholder="Selecciona una lista de precios" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl shadow-lg border-border">
              {catalogs.priceLists?.map((pl: any) => (
                <SelectItem
                  key={pl.id}
                  value={pl.name}
                  className="cursor-pointer focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900"
                >
                  {pl.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* TABLE */}
        <div className="w-full">
          <ItemTable
            items={items}
            loading={isLoadingItems || catalogs.isLoading}
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
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            emptyMessage={data?.message}
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
        catalogs={catalogsData}
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
