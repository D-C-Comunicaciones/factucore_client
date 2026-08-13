"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle, GripVertical, Pencil, BadgePercent, Trash2 } from "lucide-react";
import { showToast } from "@/components/sonner/CustomToaster";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { AsyncSearchableSelect } from "@/components/ui/async-searchable-select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useItems } from "@/hooks/items/useItems";
import { isIvaTax } from "@/hooks/invoices/useInvoiceBuilder";
import { resolveStockFields, shouldValidateLineStock } from "@/lib/itemStock";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";

// Reusable component for currency formatting without cursor jumps
function FormattedInput({ value, onChange, placeholder, className }: any) {
  const [displayValue, setDisplayValue] = React.useState(value ? new Intl.NumberFormat('es-CO').format(value) : "");

  React.useEffect(() => {
    const numericDisplay = parseFloat(displayValue.replace(/\./g, "").replace(/,/g, ".")) || 0;
    if (value !== numericDisplay && value !== undefined) {
      setDisplayValue(value ? new Intl.NumberFormat('es-CO').format(value) : "");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (!raw) {
      setDisplayValue("");
      onChange(0);
      return;
    }
    const num = parseFloat(raw);
    setDisplayValue(new Intl.NumberFormat('es-CO').format(num));
    onChange(num);
  };

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      className={className}
    />
  );
}



function ItemRow({
  item,
  index,
  remissionBuilder,
  selectedWarehouseId,
  selectedPriceListId,
  taxes,
  errors,
  hasAnyIvaTax,
  isSelected,
  onSelect,
}: {
  item: any;
  index: number;
  remissionBuilder: any;
  selectedWarehouseId: number | null;
  selectedPriceListId: number | null;
  taxes: any[];
  errors?: Record<string, any>;
  hasAnyIvaTax: boolean;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [itemDetailsOpen, setItemDetailsOpen] = useState(false);

  const effectiveWarehouseId = item.item_id ? (item.selected_warehouse_id ?? selectedWarehouseId) : selectedWarehouseId;
  const effectivePriceListId = item.item_id ? (item.selected_price_list_id ?? selectedPriceListId) : selectedPriceListId;

  const { data, isLoading } = useItems({
    params: {
      search: searchQuery,
      warehouse_id: effectiveWarehouseId ?? undefined,
      price_list_id: effectivePriceListId ?? undefined,
    }
  });

  const itemsList = data?.data || [];
  const options = itemsList.map((i: any) => ({
    value: i.id.toString(),
    label: `${i.reference ? i.reference + ' - ' : ''}${i.name}`,
    rawItem: i
  }));

  // Preserve the currently selected item so it doesn't disappear when filters change
  if (item.item_id && !options.some((o: any) => o.value === item.item_id.toString())) {
    options.push({
      value: item.item_id.toString(),
      label: `${item.referencia ? item.referencia + ' - ' : ''}${item.item}`,
      rawItem: {
        id: item.item_id,
        name: item.item,
        reference: item.referencia,
        price: item.precio,
        stock_quantity: item.stock_quantity,
        is_inventoriable: item.is_inventoriable,
        allow_negative_stock: item.allow_negative_stock,
        warehouses: item.warehouses
      } as any
    });
  }

  const handleItemSelect = (val: string) => {
    const selectedOption = options.find((o: any) => o.value === val);
    if (selectedOption) {
      const ri = selectedOption.rawItem;
      const { is_inventoriable: isInventoriable, allow_negative_stock: allowNegativeStock, stock_quantity: stockQuantity } = resolveStockFields(ri);

      remissionBuilder.updateItem(item.id, "item_id", ri.id);
      remissionBuilder.updateItem(item.id, "standard_code", ri.standard_code || "");
      remissionBuilder.updateItem(item.id, "item", ri.name);
      remissionBuilder.updateItem(item.id, "referencia", ri.reference || "");
      remissionBuilder.updateItem(item.id, "description", ri.description || "");
      remissionBuilder.updateItem(item.id, "precio", ri.price || 0);
      remissionBuilder.updateItem(item.id, "cantidad", 1);
      remissionBuilder.updateItem(item.id, "stock_quantity", stockQuantity);
      remissionBuilder.updateItem(item.id, "is_inventoriable", isInventoriable);
      remissionBuilder.updateItem(item.id, "allow_negative_stock", allowNegativeStock);
      remissionBuilder.updateItem(item.id, "selected_warehouse_id", selectedWarehouseId);
      remissionBuilder.updateItem(item.id, "selected_price_list_id", selectedPriceListId);
      remissionBuilder.updateItem(item.id, "warehouses", ri.warehouses);

      if (ri.tax_rates && ri.tax_rates.length > 0) {
        const defaultTax = ri.tax_rates[0];
        remissionBuilder.updateItemTax(item.id, {
          tax_rate_id: defaultTax.tax_rate_id,
          tax_id: defaultTax.tax_id,
          name: defaultTax.name,
          rate: parseFloat(defaultTax.rate || "0"),
          type: defaultTax.type || 'percentage',
          description: defaultTax.description || ""
        });
      } else {
        remissionBuilder.updateItemTax(item.id, null);
      }

      // Extract minimum_stock and maximum_stock for the selected warehouse
      const warehouseData = ri.warehouses?.find((w: any) => String(w.id) === String(selectedWarehouseId));
      remissionBuilder.updateItem(item.id, "minimum_stock", warehouseData?.minimum_stock);
      remissionBuilder.updateItem(item.id, "maximum_stock", warehouseData?.maximum_stock);

      // Validate initial quantity
      const shouldValidateInitial = isInventoriable && !allowNegativeStock;
      const initialStock = stockQuantity ?? 0;
      if (shouldValidateInitial && initialStock < 1) {
        showToast("El producto seleccionado no tiene stock disponible.", "warning");
        remissionBuilder.updateItem(item.id, "cantidad", 0);
      }
    }
  };

  const qty = item.cantidad || 0;
  const price = item.precio || 0;
  const discValue = item.discountValue || 0;

  const lineBase = qty * price;
  const lineDiscount = item.discountType === 'percentage'
    ? lineBase * (discValue / 100)
    : discValue;

  const lineNet = lineBase - lineDiscount;

  let taxRate = 0;
  if (item.taxObj && item.taxObj.rate !== undefined && item.taxObj.rate !== null) {
    taxRate = Number(item.taxObj.rate);
    if (isNaN(taxRate)) taxRate = 0;
  }

  const lineTax = lineNet * (taxRate / 100);
  const safeNet = isNaN(lineNet) ? 0 : lineNet;
  const safeTax = isNaN(lineTax) ? 0 : lineTax;
  const rowTotal = safeNet + safeTax;

  const inputClasses = "bg-white h-8 px-3 text-xs border border-foreground/20 shadow-none text-foreground hover:border-primary/50 focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const hasError = errors?.items === "empty_items" && !item.item_id;

  const quantityBackendError = errors?.[`items.${index}.quantity`];
  const isInvalidQuantity = (errors?.items === "invalid_quantity" && item.item_id && (!item.cantidad || item.cantidad <= 0)) || !!quantityBackendError;

  const shouldValidateStock = shouldValidateLineStock(item);
  const currentStock = item.stock_quantity ?? 0;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = Number(e.target.value);
    if (shouldValidateStock && newQty > currentStock) {
      if (currentStock === 0) {
        showToast("Este producto está agotado.", "error");
      } else {
        showToast(`Stock insuficiente. Solo hay ${currentStock} unidades disponibles.`, "error");
      }
      remissionBuilder.updateItem(item.id, "cantidad", currentStock > 0 ? currentStock : 0);
    } else {
      remissionBuilder.updateItem(item.id, "cantidad", newQty);
    }
  };

  const minStock = Number(item.minimum_stock);
  const maxStock = Number(item.maximum_stock);
  const isLowStock = shouldValidateStock && (minStock > 0 ? currentStock <= minStock : currentStock <= 5);
  const isGoodStock = shouldValidateStock && (maxStock > 0 ? currentStock >= maxStock : currentStock >= 10);



  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-border transition-colors ${isSelected ? 'bg-primary/10 hover:bg-primary/15' : hasError ? 'bg-destructive/5' : 'bg-white'}`}
    >
      <td className="px-0.5 py-2 w-6 align-top">
        <div className="h-8 flex items-center justify-center">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-muted rounded text-muted-foreground"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
      <td className="px-0.5 py-2 w-6 align-top">
        <div className="h-8 flex items-center justify-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(item.id, checked as boolean)}
            className="w-4 h-4 rounded text-primary border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </div>
      </td>
      <td className="px-2 py-2 align-top">
        <AsyncSearchableSelect
          value={item.item_id ? item.item_id.toString() : ""}
          onValueChange={handleItemSelect}
          options={options}
          loading={isLoading}
          onSearchChange={setSearchQuery}
          placeholder="Buscar ítem"
          searchPlaceholder="Nombre o ref..."
          className={`h-8 text-xs bg-white hover:border-primary/50 focus:border-primary focus-visible:border-primary cursor-pointer transition-colors shadow-none ${hasError ? 'border-destructive !text-destructive' : 'border-foreground/20'}`}
          footer={
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('open-quick-item-modal');
                if (el) {
                  el.setAttribute('data-target-row', item.id);
                  el.click();
                }
              }}
              className="w-full text-left px-2 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 rounded-md transition-colors"
            >
              + Nuevo ítem
            </button>
          }
        />
        {item.item_id && (
          <div className="mt-1">
            <Popover>
              <PopoverTrigger className="text-[10px] text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors cursor-pointer max-w-full text-left">
                {item.referencia || item.description ? (
                  <>
                    <span className="truncate max-w-[220px]">
                      {item.referencia && item.description
                        ? `${item.referencia} | ${item.description}`
                        : item.referencia || item.description}
                    </span>
                    <Pencil className="w-3 h-3 flex-shrink-0" />
                  </>
                ) : (
                  <>
                    <Pencil className="w-3 h-3 flex-shrink-0" />
                    <span>Agregar referencia y/o descripción</span>
                  </>
                )}
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-4"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">Referencia</label>
                    <Input
                      placeholder="Ej. REF-001"
                      value={item.referencia}
                      onChange={(e) => remissionBuilder.updateItem(item.id, "referencia", e.target.value)}
                      className="h-8 text-xs border-gray-300 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">Descripción ampliada</label>
                    <textarea
                      className="flex min-h-[60px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Detalles adicionales..."
                      value={item.description}
                      onChange={(e) => remissionBuilder.updateItem(item.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <PopoverClose asChild>
                      <button className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                        Aplicar
                      </button>
                    </PopoverClose>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </td>

      <td className="px-2 py-2 align-top">
        <FormattedInput
          placeholder="Precio"
          value={item.precio || 0}
          onChange={(val: number) => remissionBuilder.updateItem(item.id, "precio", val)}
          className={inputClasses}
        />
      </td>

      <td className="px-2 py-2 align-top">
        <div className="flex items-center">
          {item.discountType === 'percentage' ? (
            <Input
              type="number"
              min={0}
              onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault(); }}
              placeholder="0"
              value={item.discountValue || ""}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > 100) {
                  showToast("El porcentaje de descuento no puede ser mayor al 100%", "warning");
                  remissionBuilder.updateItemDiscount(item.id, "", 'percentage');
                } else {
                  remissionBuilder.updateItemDiscount(item.id, val, 'percentage');
                }
              }}
              className={`${inputClasses} rounded-r-none border-r-0`}
            />
          ) : (
            <FormattedInput
              placeholder="0"
              value={item.discountValue || 0}
              onChange={(val: number) => {
                const lineBase = (Number(item.cantidad) || 0) * (Number(item.precio) || 0);
                if (lineBase > 0 && val > lineBase) {
                  showToast("El valor digitado excede el valor total del ítem", "warning");
                  remissionBuilder.updateItemDiscount(item.id, "", 'fixed');
                } else {
                  remissionBuilder.updateItemDiscount(item.id, val, 'fixed');
                }
              }}
              className={`${inputClasses} rounded-r-none border-r-0`}
            />
          )}
          <Select
            value={item.discountType || "percentage"}
            onValueChange={(val: any) => remissionBuilder.updateItemDiscount(item.id, item.discountValue || 0, val)}
          >
            <SelectTrigger size="sm" className="h-8 px-1 text-xs border border-foreground/20 bg-white shadow-none rounded-l-none w-12 hover:bg-muted cursor-pointer transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage" className="cursor-pointer hover:bg-muted focus:bg-muted">%</SelectItem>
              <SelectItem value="fixed" className="cursor-pointer hover:bg-muted focus:bg-muted">$</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </td>

      <td className="px-2 py-2 align-top">
        <SearchableSelect
          value={item.taxObj?.tax_rate_id?.toString() || item.taxObj?.tax_id?.toString() || "0"}
          onValueChange={(val) => {
            if (val === "new_tax") {
              const el = document.getElementById('open-new-tax-modal');
              if (el) el.click();
              return;
            }
            if (val === "0") {
              remissionBuilder.updateItemTax(item.id, null);
            } else {
              const tax = taxes?.find((t: any) => t.id.toString() === val);
              if (tax) {
                // Support multiple field names: code (from new tax API), rate (from item tax_rates), and percentage
                const taxRateObj = {
                  tax_rate_id: tax.id,
                  tax_id: tax.tax_id,
                  name: tax.name,
                  rate: parseFloat(tax.rate || tax.percentage || "0"),
                  type: tax.type || 'percentage',
                  description: tax.description || ""
                };
                remissionBuilder.updateItemTax(item.id, taxRateObj);
              }
            }
          }}
          options={[
            { value: "0", label: "Sin impuesto" },
            ...(taxes || []).map((tax: any) => ({
              value: tax.id.toString(),
              label: `${tax.name} (${parseFloat(tax.rate || "0")}%)`
            })),
            { value: "new_tax", label: "+ Crear impuesto" }
          ]}
          placeholder="Sin impuesto"
          searchPlaceholder="Buscar impuesto..."
          emptyMessage="No se encontraron impuestos"
          className={`h-8 text-xs bg-white shadow-none hover:border-primary/50 focus:border-primary transition-colors ${hasError ? 'border-destructive' : 'border-foreground/20'}`}
        />
      </td>

      <td className="px-2 py-2 align-top">
        <div className="relative flex items-center">
          <Input
            type="number"
            min={0}
            onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault(); }}
            value={item.cantidad || ""}
            onChange={handleQuantityChange}
            className={`${inputClasses} w-full pr-8 ${isLowStock || isInvalidQuantity ? '!text-red-600 font-bold !border-red-500' : ''} ${isGoodStock && !isInvalidQuantity ? '!text-green-600 font-bold' : ''}`}
          />
          {(isLowStock || isInvalidQuantity) && (
            <div className="absolute right-2 flex items-center">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-red-600 text-white p-2 text-xs">
                    {quantityBackendError ? quantityBackendError[0] || quantityBackendError :
                      isInvalidQuantity ? "Cantidad inválida." :
                        currentStock === 0 ? "¡Este producto está agotado!" :
                          `¡Stock bajo! Solo quedan ${currentStock} unidades.`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </td>

      <td className="px-2 py-2 text-right text-xs font-medium text-foreground whitespace-nowrap align-top">
        <div className="h-8 flex items-center justify-end">
          $ {new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(rowTotal)}
        </div>
      </td>

      <td className="px-2 py-2 text-center w-10 align-top">
        <div className="h-8 flex items-center justify-center">
          <button
            onClick={() => remissionBuilder.removeItem(item.id)}
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function RemissionItemsTable({
  remissionBuilder,
  selectedWarehouseId,
  selectedPriceListId,
  taxes,
  errors,
}: {
  remissionBuilder: any;
  selectedWarehouseId: number | null;
  selectedPriceListId: number | null;
  taxes: any[];
  errors?: Record<string, any>;
}) {
  const hasAnyIvaTax = remissionBuilder.items.some((item: any) => isIvaTax(item.taxObj));
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [batchDiscountType, setBatchDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [batchDiscountValue, setBatchDiscountValue] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApplyBatchDiscount = () => {
    selectedItems.forEach(id => {
      remissionBuilder.updateItemDiscount(id, batchDiscountValue, batchDiscountType);
    });
    showToast(`Descuento aplicado a ${selectedItems.length} ítem(s)`, "success");
    setIsDiscountModalOpen(false);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(remissionBuilder.items.map((i: any) => i.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(i => i !== id));
    }
  };

  const allSelected = remissionBuilder.items.length > 0 && selectedItems.length === remissionBuilder.items.length;
  const someSelected = selectedItems.length > 0;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = remissionBuilder.items.findIndex((i: any) => i.id === active.id);
      const newIndex = remissionBuilder.items.findIndex((i: any) => i.id === over?.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        remissionBuilder.reorderItems(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto w-full rounded-lg border border-border">
        <table className="min-w-full bg-background table-fixed">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="px-0.5 py-3 text-center w-6"></th>
              <th className="px-0.5 py-3 text-center w-6">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  className="w-4 h-4 rounded text-primary border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
              </th>
              <th style={{ width: "30%" }} className="px-2 py-3 text-xs font-semibold text-muted-foreground text-left min-w-[240px]">Ítem</th>
              <th style={{ width: "12%" }} className="px-2 py-3 text-xs font-semibold text-muted-foreground text-left">Precio</th>
              <th style={{ width: "12%" }} className="px-2 py-3 text-xs font-semibold text-muted-foreground text-left">Descuento</th>
              <th style={{ width: "13%" }} className="px-2 py-3 text-xs font-semibold text-muted-foreground text-left">Impuesto</th>
              <th style={{ width: "8%" }} className="px-2 py-3 text-xs font-semibold text-muted-foreground text-left">Cantidad</th>
              <th style={{ width: "10%" }} className="px-2 py-3 text-xs font-semibold text-muted-foreground text-right">Total</th>
              <th className="px-2 py-3 text-center w-10"></th>
            </tr>
          </thead>
          <tbody>
            <SortableContext items={remissionBuilder.items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
              {remissionBuilder.items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="bg-white">
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.837-7.17a60.81 60.81 0 00-16.58-1.986c-.64 0-1.276.019-1.907.055m-.566 0L4.5 6h15M10.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-foreground">No hay ítems agregados</p>
                      <p className="text-xs text-muted-foreground">Haz clic en <span className="font-semibold text-primary">"Agregar ítem"</span> para comenzar.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                remissionBuilder.items.map((item: any, index: number) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    index={index}
                    remissionBuilder={remissionBuilder}
                    selectedWarehouseId={selectedWarehouseId}
                    selectedPriceListId={selectedPriceListId}
                    taxes={taxes}
                    errors={errors}
                    hasAnyIvaTax={hasAnyIvaTax}
                    isSelected={selectedItems.includes(item.id)}
                    onSelect={handleSelect}
                  />
                ))
              )}
            </SortableContext>
          </tbody>
        </table>

        <div className="p-3 bg-muted/10 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={remissionBuilder.addItem}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            Agregar ítem
          </button>
        </div>

        {mounted && someSelected && createPortal(
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center justify-between gap-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-full shadow-2xl font-medium text-sm min-w-[320px]">
            <span>
              {selectedItems.length} {selectedItems.length === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}
            </span>
            <div className="flex items-center gap-1.5">
              <TooltipProvider delayDuration={100}>
                <Popover open={isDiscountModalOpen} onOpenChange={setIsDiscountModalOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer text-white flex items-center justify-center">
                        <BadgePercent className="w-4 h-4" />
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-slate-900 text-white text-xs px-2.5 py-1 mb-1 rounded-md">
                      Aplicar descuento
                    </TooltipContent>
                  </Tooltip>

                  <PopoverContent
                    side="top"
                    align="center"
                    sideOffset={14}
                    className="w-[310px] bg-white p-5 rounded-2xl border border-gray-100 shadow-2xl z-[10000]"
                  >
                    <div className="space-y-3 text-left">
                      <div>
                        <h4 className="text-base font-semibold text-slate-800">Aplicar descuento</h4>
                        <p className="text-xs text-muted-foreground">Se agregará a los ítems seleccionados</p>
                      </div>

                      <div className="relative flex items-center pt-1">
                        {batchDiscountType === "percentage" ? (
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="0"
                            value={batchDiscountValue || ""}
                            onChange={(e) => setBatchDiscountValue(Number(e.target.value))}
                            className="h-10 text-sm border-gray-300 focus-visible:ring-1 focus-visible:ring-primary pr-10 rounded-xl"
                          />
                        ) : (
                          <FormattedInput
                            placeholder="0"
                            value={batchDiscountValue}
                            onChange={(val: number) => setBatchDiscountValue(val)}
                            className="h-10 text-sm border-gray-300 focus-visible:ring-1 focus-visible:ring-primary pr-10 rounded-xl"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => setBatchDiscountType(prev => prev === "percentage" ? "fixed" : "percentage")}
                          className="absolute right-3 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer p-1"
                          title="Cambiar tipo de descuento"
                        >
                          {batchDiscountType === "percentage" ? "%" : "$"}
                        </button>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleApplyBatchDiscount}
                          className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl cursor-pointer transition-colors shadow-sm"
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        selectedItems.forEach(id => remissionBuilder.removeItem(id));
                        setSelectedItems([]);
                        showToast("Ítems eliminados", "info");
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-slate-900 text-white text-xs px-2.5 py-1 mb-1 rounded-md">
                    Eliminar seleccionados
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setSelectedItems([])}
                      className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-slate-900 text-white text-xs px-2.5 py-1 mb-1 rounded-md">
                    Cancelar selección
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>,
          document.body
        )}
      </div>
    </DndContext>
  );
}
