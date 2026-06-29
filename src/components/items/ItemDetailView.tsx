"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Edit,
  FileText,
  ImagePlus,
  Package,
  Paperclip,
  Plus,
  ShoppingCart,
  Upload,
  Download,
  Trash2,
  Copy,
  MoreHorizontal,
  Box,
  Tag,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ItemResponse } from "@/types/items";

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function formatMoney(value: number | undefined | null): string {
  if (!value && value !== 0) return "$0";
  return `$${value.toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })}`;
}

function getItemTypeName(typeId: number): string {
  switch (typeId) {
    case 1:
      return "Producto";
    case 2:
      return "Servicio";
    case 3:
      return "Combo";
    default:
      return "Ítem";
  }
}

/* ========================================================================== */
/* SUB-COMPONENTS                                                             */
/* ========================================================================== */

/** Status toggle pill */
function StatusToggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg overflow-hidden border border-border/40">
      <button
        type="button"
        onClick={active ? undefined : onToggle}
        className={cn(
          "px-4 py-1.5 text-sm font-bold transition-all",
          active
            ? "bg-primary text-white"
            : "bg-white text-muted-foreground hover:bg-muted/50"
        )}
      >
        Activado
      </button>
      <button
        type="button"
        onClick={active ? onToggle : undefined}
        className={cn(
          "px-4 py-1.5 text-sm font-bold transition-all",
          !active
            ? "bg-destructive text-white"
            : "bg-white text-muted-foreground hover:bg-muted/50"
        )}
      >
        Desactivado
      </button>
    </div>
  );
}

/** Info field (label + value) */
function InfoField({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="text-sm text-muted-foreground">{value || "-"}</p>
    </div>
  );
}

/** Badge-style info chip */
function InfoChip({
  icon: Icon,
  label,
  value,
  active,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          active ? "bg-primary/10" : "bg-muted"
        )}
      >
        <Icon
          className={cn(
            "w-4 h-4",
            active ? "text-primary" : "text-muted-foreground"
          )}
        />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={cn(
            "text-sm font-semibold",
            active ? "text-emerald-600" : "text-muted-foreground"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/** Document tab button */
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2",
        active
          ? "text-primary border-primary"
          : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/30"
      )}
    >
      {label}
    </button>
  );
}

/* ========================================================================== */
/* MAIN COMPONENT                                                             */
/* ========================================================================== */

interface ItemDetailViewProps {
  item: ItemResponse;
  catalogs: any;
  onToggleStatus: () => void;
  onDelete: () => void;
  isTogglingStatus?: boolean;
}

export function ItemDetailView({
  item,
  catalogs,
  onToggleStatus,
  onDelete,
  isTogglingStatus,
}: ItemDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("ventas");
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  /* ---------------------------------------------------------------------- */
  /* Derived data                                                           */
  /* ---------------------------------------------------------------------- */

  const itemTypeName = getItemTypeName(item.basic_info.type_item_id);
  const isProduct = item.basic_info.type_item_id === 1;
  const isService = item.basic_info.type_item_id === 2;

  const basePrice = item.pricing?.base_price ?? 0;
  const totalPrice = item.pricing?.total_price ?? 0;
  const costPrice = item.pricing?.default_cost_price ?? 0;

  // Find tax name from catalogs
  const taxName = React.useMemo(() => {
    if (!item.pricing?.tax_rate_ids?.length) return "Ninguno";
    const taxId = item.pricing.tax_rate_ids[0];
    const tax = catalogs?.taxes?.find(
      (t: any) => Number(t.id) === Number(taxId)
    );
    return tax ? `${tax.name} (${tax.rate}%)` : "Impuesto";
  }, [item.pricing?.tax_rate_ids, catalogs?.taxes]);

  // Find unit measure name
  const unitName = React.useMemo(() => {
    const unit = catalogs?.unitMeasures?.find(
      (u: any) => Number(u.id) === Number(item.basic_info.unit_measure_id)
    );
    return unit?.name ?? "Unidad";
  }, [item.basic_info.unit_measure_id, catalogs?.unitMeasures]);

  // Find category name
  const categoryName = React.useMemo(() => {
    if (!item.basic_info?.category_id) return null;
    const cat = catalogs?.categories?.find(
      (c: any) => Number(c.id) === Number(item.basic_info?.category_id)
    );
    return cat?.name ?? null;
  }, [item.basic_info?.category_id, catalogs?.categories]);

  // Inventory info
  const inventoryQty = React.useMemo(() => {
    if (!item.inventory?.inventory_stocks) return 0;
    return item.inventory.inventory_stocks.reduce(
      (sum, stock) => sum + (parseFloat(stock.stock_quantity) || 0),
      0
    );
  }, [item.inventory?.inventory_stocks]);
  const isInventoriable = item.inventory?.is_inventoriable !== false;
  const allowNegative = item.inventory?.allow_negative_stock ?? false;

  const TABS = [
    { key: "ventas", label: "Facturas de venta" },
    { key: "compras", label: "Facturas de compras" },
    { key: "soporte", label: "Documentos soporte" },
    { key: "credito", label: "Notas de crédito" },
    { key: "debito", label: "Notas débito" },
    { key: "remisiones", label: "Remisiones" },
  ];

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="w-full min-h-screen text-foreground">
      <div className="w-full max-w-[1100px] mx-auto">
        {/* ================================================================ */}
        {/* BACK + TITLE                                                     */}
        {/* ================================================================ */}

        <button
          type="button"
          onClick={() => router.push("/items")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-3 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Volver a ítems
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-4">
          {item.basic_info.name}
        </h1>

        {/* ================================================================ */}
        {/* HEADER: STATUS + ACTIONS                                         */}
        {/* ================================================================ */}

        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <StatusToggle active={item.basic_info.is_active} onToggle={onToggleStatus} />

          <Button
            variant="outline"
            className="btn-base border-border bg-white text-foreground hover:bg-primary/10 hover:text-primary"
            onClick={() => router.push(`/invoices/new?item=${item.id}`)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Facturar este ítem
          </Button>

          <Button
            variant="outline"
            className="btn-base border-border bg-white text-foreground hover:bg-primary/10 hover:text-primary"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Comprar este ítem
          </Button>

          <Button
            variant="outline"
            className="btn-base border-border bg-white text-foreground hover:bg-primary/10 hover:text-primary"
            onClick={() => router.push(`/items/${item.id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-1.5" />
            Editar
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="btn-base border-border bg-white text-foreground hover:bg-primary/10 hover:text-primary"
              >
                Más acciones
                <ChevronDown className="w-4 h-4 ml-1.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-popover text-popover-foreground border border-border"
            >
              <DropdownMenuItem
                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2"
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer py-2"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ================================================================ */}
        {/* MAIN CARD                                                        */}
        {/* ================================================================ */}

        <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden mb-4">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
              {/* ---------------------------------------------------------- */}
              {/* LEFT: Info fields                                          */}
              {/* ---------------------------------------------------------- */}

              <div className="space-y-6">
                {/* Row 1: Código + Referencia */}
                <div className="grid grid-cols-2 gap-6">
                  <InfoField label="Código" value={item.id} />
                  <InfoField
                    label="Referencia"
                    value={item.basic_info.reference}
                  />
                </div>

                {/* Row 2: Categoría + Tipo de ítem */}
                <div className="grid grid-cols-2 gap-6">
                  <InfoField
                    label="Categoría"
                    value={categoryName}
                  />
                  <InfoField
                    label="Tipo de ítem"
                    value={itemTypeName}
                  />
                </div>

                {/* Row 3: Unidad de medida */}
                <InfoField label="Unidad de medida" value={unitName} />

                {/* Row 4: Descripción */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Descripción
                  </p>
                  <div className="border-b border-border/30 pb-3">
                    <p className="text-sm text-muted-foreground">
                      {item.basic_info.description || "-"}
                    </p>
                  </div>
                </div>

                {/* Inventory chips (product only) */}
                {isProduct && (
                  <div className="flex items-center gap-6 pt-2">
                    <InfoChip
                      icon={Box}
                      label="Ítem inventariable"
                      value={isInventoriable ? "Activado" : "Desactivado"}
                      active={isInventoriable}
                    />
                    <InfoChip
                      icon={Tag}
                      label="Venta en negativo"
                      value={allowNegative ? "Activado" : "Desactivado"}
                      active={allowNegative}
                    />
                  </div>
                )}

                {/* Advanced options (collapsible) */}
                <button
                  type="button"
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-primary border-2 border-primary/20 rounded-lg hover:bg-primary/5 transition-all"
                >
                  Opciones avanzadas
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      advancedOpen && "rotate-180"
                    )}
                  />
                </button>

                {advancedOpen && (
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <InfoField
                      label="Código de barras"
                      value={item.basic_info?.barcode}
                    />
                    <InfoField
                      label="Código estándar"
                      value={item.basic_info?.standard_code_id}
                    />
                    <InfoField
                      label="Tipo de identificación del ítem"
                      value={item.basic_info?.type_item_identification_id}
                    />
                  </div>
                )}
              </div>

              {/* ---------------------------------------------------------- */}
              {/* RIGHT: Image + Pricing                                     */}
              {/* ---------------------------------------------------------- */}

              <div className="space-y-5">
                {/* Image placeholder */}
                <div className="w-full aspect-square max-h-[240px] rounded-xl border-2 border-dashed border-border/50 bg-muted/20 flex items-center justify-center transition-colors hover:border-primary/30 cursor-pointer group">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <ImagePlus className="w-6 h-6 text-muted-foreground/50 group-hover:text-primary/60 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Pricing card */}
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Precio Total
                    </p>
                    <span className="text-xs text-muted-foreground">COP</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">
                    {formatMoney(parseFloat(totalPrice))}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Precio sin impuesto
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatMoney(parseFloat(basePrice))}{" "}
                        <span className="text-xs text-muted-foreground font-normal">
                          COP
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Impuesto
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {taxName}
                      </p>
                    </div>
                  </div>

                  {isProduct && (
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Costo inicial
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatMoney(parseFloat(costPrice))}
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-3.5"
                        >
                          Cargar costo promedio
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* INVENTORY BAR (product only)                                     */}
        {/* ================================================================ */}

        {isProduct && (
          <div className="bg-card rounded-xl border border-border/40 shadow-sm px-6 py-4 flex flex-wrap items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <p className="text-base font-bold text-foreground">
                En inventario
              </p>
              <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md bg-muted text-sm font-bold text-foreground">
                {inventoryQty}
              </span>
              <span className="text-sm text-muted-foreground">
                (0 en remisiones)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="btn-base border-border bg-white text-foreground hover:bg-primary/10 hover:text-primary"
              >
                <Download className="w-4 h-4 mr-1.5" />
                Historial
              </Button>
              <Button
                variant="outline"
                className="btn-base border-border bg-white text-foreground hover:bg-primary/10 hover:text-primary"
              >
                Mostrar detalle
              </Button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* PRICE LISTS + ATTACHMENTS                                        */}
        {/* ================================================================ */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Price lists */}
          <div className="bg-card rounded-xl border border-border/40 shadow-sm p-6">
            <p className="text-base font-bold text-foreground mb-4">
              Listas de precios
            </p>
            {item.pricing?.price_lists?.length ? (
              <div className="space-y-2">
                {item.pricing.price_lists.map((pl, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-sm text-primary font-medium">
                      General
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatMoney(parseFloat(pl.value ?? totalPrice))}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/20">
                <span className="text-sm text-primary font-medium">
                  General
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {formatMoney(parseFloat(totalPrice))}
                </span>
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="bg-card rounded-xl border border-border/40 shadow-sm p-6">
            <p className="text-base font-bold text-foreground mb-4">
              Archivos adjuntos
            </p>
            <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-border/40 rounded-xl hover:border-primary/30 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground/50 group-hover:text-primary/60 transition-colors" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Adjuntar archivo
              </p>
              <p className="text-xs text-primary">Tamaño máximo 10MB</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-border bg-white text-foreground hover:bg-primary/10 hover:text-primary text-xs"
              >
                Adjuntar archivo
              </Button>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* DOCUMENT TABS                                                    */}
        {/* ================================================================ */}

        <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden mb-4">
          {/* Tab bar */}
          <div className="flex items-center border-b border-border/30 overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => (
              <TabButton
                key={tab.key}
                label={tab.label}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>

          {/* Filter bar */}
          <div className="px-6 py-3 border-b border-border/20">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </div>

          {/* Empty state */}
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-primary">
              No hay contenido disponible
            </p>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-border/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Resultados por página:
              </span>
              <select className="bg-white border border-border rounded-md px-2 py-1 text-sm text-foreground">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-muted-foreground">
                1-1 De 1
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Página</span>
              <input
                type="number"
                defaultValue={1}
                className="w-12 bg-white border border-border rounded-md px-2 py-1 text-sm text-center text-foreground"
              />
              <span className="text-sm text-muted-foreground">De 1</span>
              <button
                type="button"
                className="w-8 h-8 rounded-md border border-border bg-white flex items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-md border border-border bg-white flex items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* ACCOUNTING                                                       */}
        {/* ================================================================ */}

        <div className="bg-card rounded-xl border border-border/40 shadow-sm px-6 py-4 flex items-center justify-between mb-8">
          <p className="text-base font-bold text-foreground">Contabilidad</p>
          <Button
            variant="outline"
            className="btn-base border-border bg-white text-foreground hover:bg-primary/10 hover:text-primary"
          >
            Mostrar detalle
          </Button>
        </div>
      </div>
    </div>
  );
}
