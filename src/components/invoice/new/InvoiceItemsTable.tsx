"use client";
import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { showToast } from "@/components/sonner/CustomToaster";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  invoiceBuilder,
  selectedWarehouseId,
  selectedPriceListId,
  taxes,
  errors,
}: {
  item: any;
  index: number;
  invoiceBuilder: any;
  selectedWarehouseId: number | null;
  selectedPriceListId: number | null;
  taxes: any[];
  errors?: Record<string, any>;
  hasAnyIvaTax: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const effectiveWarehouseId = item.item_id ? (item.selected_warehouse_id ?? selectedWarehouseId) : selectedWarehouseId;
  const effectivePriceListId = item.item_id ? (item.selected_price_list_id ?? selectedPriceListId) : selectedPriceListId;

  const { data, isLoading } = useItems({
    params: {
      search: searchQuery,
      warehouse_id: effectiveWarehouseId ?? undefined,
      price_list_id: effectivePriceListId ?? undefined,
      per_page: 20
    }
  });

  const itemsList = data?.data || [];
  const options = itemsList.map(i => ({
    value: i.id.toString(),
    label: `${i.reference ? i.reference + ' - ' : ''}${i.name}`,
    rawItem: i
  }));

  // Preserve the currently selected item so it doesn't disappear when filters change
  if (item.item_id && !options.some(o => o.value === item.item_id.toString())) {
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
    const selectedOption = options.find(o => o.value === val);
    if (selectedOption) {
      const ri = selectedOption.rawItem;
      const isService = ri.type_item_id === 2;
      const isInventoriable = isService ? false : (ri.is_inventoriable ?? true);

      invoiceBuilder.updateItem(item.id, "item_id", ri.id);
      invoiceBuilder.updateItem(item.id, "standard_code", ri.standard_code || "");
      invoiceBuilder.updateItem(item.id, "item", ri.name);
      invoiceBuilder.updateItem(item.id, "referencia", ri.reference || "");
      invoiceBuilder.updateItem(item.id, "description", ri.description || "");
      invoiceBuilder.updateItem(item.id, "precio", ri.price || 0);
      invoiceBuilder.updateItem(item.id, "cantidad", 1);
      invoiceBuilder.updateItem(item.id, "stock_quantity", ri.stock_quantity ?? null);
      invoiceBuilder.updateItem(item.id, "is_inventoriable", isInventoriable);
      invoiceBuilder.updateItem(item.id, "allow_negative_stock", ri.allow_negative_stock ?? false);
      invoiceBuilder.updateItem(item.id, "selected_warehouse_id", selectedWarehouseId);
      invoiceBuilder.updateItem(item.id, "selected_price_list_id", selectedPriceListId);
      invoiceBuilder.updateItem(item.id, "warehouses", ri.warehouses);

      if (ri.tax_rates && ri.tax_rates.length > 0) {
        const defaultTax = ri.tax_rates[0];
        invoiceBuilder.updateItemTax(item.id, {
          tax_rate_id: defaultTax.tax_rate_id,
          tax_id: defaultTax.tax_id,
          name: defaultTax.name,
          rate: parseFloat(defaultTax.rate || "0"),
          type: defaultTax.type || 'percentage',
          description: defaultTax.description || ""
        });
      } else {
        invoiceBuilder.updateItemTax(item.id, null);
      }

      // Extract minimum_stock and maximum_stock for the selected warehouse
      const warehouseData = ri.warehouses?.find((w: any) => String(w.id) === String(selectedWarehouseId));
      invoiceBuilder.updateItem(item.id, "minimum_stock", warehouseData?.minimum_stock);
      invoiceBuilder.updateItem(item.id, "maximum_stock", warehouseData?.maximum_stock);

      // Validate initial quantity
      const shouldValidateInitial = isInventoriable && !(ri.allow_negative_stock ?? false);
      const initialStock = ri.stock_quantity ?? 0;
      if (shouldValidateInitial && initialStock < 1) {
        showToast("El producto seleccionado no tiene stock disponible.", "warning");
        invoiceBuilder.updateItem(item.id, "cantidad", 0);
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

  const shouldValidateStock = !!item.item_id && item.is_inventoriable && !item.allow_negative_stock;
  const currentStock = item.stock_quantity ?? 0;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = Number(e.target.value);
    if (shouldValidateStock && newQty > currentStock) {
      if (currentStock === 0) {
        showToast("Este producto está agotado.", "error");
      } else {
        showToast(`Stock insuficiente. Solo hay ${currentStock} unidades disponibles.`, "error");
      }
      invoiceBuilder.updateItem(item.id, "cantidad", currentStock > 0 ? currentStock : 0);
    } else {
      invoiceBuilder.updateItem(item.id, "cantidad", newQty);
    }
  };

  const minStock = Number(item.minimum_stock);
  const maxStock = Number(item.maximum_stock);
  const isLowStock = shouldValidateStock && (minStock > 0 ? currentStock <= minStock : currentStock <= 5);
  const isGoodStock = shouldValidateStock && (maxStock > 0 ? currentStock >= maxStock : currentStock >= 10);



  return (
    <tr className={`border-b border-border transition-colors ${hasError ? 'bg-destructive/5' : 'bg-white'}`}>
      <td className="px-2 py-2 w-48">
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
      </td>

      <td className="px-2 py-2">
        <Input
          placeholder="Referencia"
          value={item.referencia}
          onChange={(e) => invoiceBuilder.updateItem(item.id, "referencia", e.target.value)}
          className={inputClasses}
        />
      </td>

      <td className="px-2 py-2 w-24">
        <FormattedInput
          placeholder="Precio"
          value={item.precio || 0}
          onChange={(val: number) => invoiceBuilder.updateItem(item.id, "precio", val)}
          className={inputClasses}
        />
      </td>

      <td className="px-2 py-2 w-32">
        <div className="flex items-center">
          {item.discountType === 'percentage' ? (
            <Input
              type="number"
              min={0}
              onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault(); }}
              placeholder="0"
              value={item.discountValue || ""}
              onChange={(e) => invoiceBuilder.updateItemDiscount(item.id, Number(e.target.value), 'percentage')}
              className={`${inputClasses} rounded-r-none border-r-0`}
            />
          ) : (
            <FormattedInput
              placeholder="0"
              value={item.discountValue || 0}
              onChange={(val: number) => invoiceBuilder.updateItemDiscount(item.id, val, 'fixed')}
              className={`${inputClasses} rounded-r-none border-r-0`}
            />
          )}
          <Select
            value={item.discountType || "percentage"}
            onValueChange={(val: any) => invoiceBuilder.updateItemDiscount(item.id, item.discountValue || 0, val)}
          >
            <SelectTrigger className={`h-8 px-1 text-xs border border-foreground/20 bg-white shadow-none rounded-l-none w-12 hover:bg-muted cursor-pointer transition-colors`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage" className="cursor-pointer hover:bg-muted focus:bg-muted">%</SelectItem>
              <SelectItem value="fixed" className="cursor-pointer hover:bg-muted focus:bg-muted">$</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </td>

      <td className="px-2 py-2 w-48">
        <SearchableSelect
          value={item.taxObj?.tax_rate_id?.toString() || item.taxObj?.tax_id?.toString() || "0"}
          onValueChange={(val) => {
            if (val === "new_tax") {
              const el = document.getElementById('open-new-tax-modal');
              if (el) el.click();
              return;
            }
            if (val === "0") {
              invoiceBuilder.updateItemTax(item.id, null);
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
                invoiceBuilder.updateItemTax(item.id, taxRateObj);
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



      <td className="px-2 py-2">
        <Input
          placeholder="Descripción"
          value={item.description}
          onChange={(e) => invoiceBuilder.updateItem(item.id, "description", e.target.value)}
          className={inputClasses}
        />
      </td>

      <td className="px-2 py-2 w-24">
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

      <td className="px-2 py-2 text-right text-xs font-medium text-foreground whitespace-nowrap">
        $ {new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(rowTotal)}
      </td>

      <td className="px-2 py-2 text-center w-10">
        <button
          onClick={() => invoiceBuilder.removeItem(item.id)}
          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

export function InvoiceItemsTable({
  invoiceBuilder,
  selectedWarehouseId,
  selectedPriceListId,
  taxes,
  errors,
}: {
  invoiceBuilder: any;
  selectedWarehouseId: number | null;
  selectedPriceListId: number | null;
  taxes: any[];
  errors?: Record<string, any>;
}) {
  const hasAnyIvaTax = invoiceBuilder.items.some((item: any) => isIvaTax(item.taxObj));

  return (
    <div className="overflow-x-auto w-full rounded-lg border border-border">
      <table className="min-w-full bg-background">
        <thead className="bg-muted/30 border-b border-border">
          <tr>
            {[
              "Ítem",
              "Referencia",
              "Precio",
              "Desc",
              "Impuesto",
              "Descripción",
              "Cant",
              "Total",
              "",
            ].filter(Boolean).map((col) => (
              <th
                key={col as string}
                className="px-2 py-3 text-xs font-semibold text-muted-foreground text-left first:pl-4"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoiceBuilder.items.length === 0 ? (
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
            invoiceBuilder.items.map((item: any, index: number) => (
              <ItemRow
                key={item.id}
                item={item}
                index={index}
                invoiceBuilder={invoiceBuilder}
                selectedWarehouseId={selectedWarehouseId}
                selectedPriceListId={selectedPriceListId}
                taxes={taxes}
                errors={errors}
                hasAnyIvaTax={hasAnyIvaTax}
              />
            ))
          )}
        </tbody>
      </table>

      <div className="p-3 bg-muted/10 border-t border-border flex justify-end">
        <button
          type="button"
          onClick={invoiceBuilder.addItem}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          Agregar ítem
        </button>
      </div>
    </div>
  );
}