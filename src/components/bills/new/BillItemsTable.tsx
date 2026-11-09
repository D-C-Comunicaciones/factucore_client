"use client";
import React, { useState } from "react";
import { X, ShoppingBag } from "lucide-react";
import { showToast } from "@/components/sonner/CustomToaster";
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
import { useAccountsList } from "@/hooks/accounting/useAccounting";
import type { BillLineFormState } from "@/hooks/bills/useBillBuilder";

// Reusable component for currency formatting without cursor jumps
// Idéntico al de InvoiceItemsTable — misma tabla, mismo componente.
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

/**
 * Lógica compartida de una línea (búsqueda/selección de ítem, cálculo de
 * totales). Igual que en PurchaseOrderLineItemsTable, aquí NO se valida stock:
 * una factura de compra recibe mercancía/servicios del proveedor, no consume
 * inventario propio. Tampoco se restringe por tipo de ítem — a diferencia de
 * orden de compra/remisión, una factura de compra admite productos y
 * servicios por igual (igual que Documento Soporte).
 */
function useItemRowLogic({ item, builder }: { item: BillLineFormState; builder: any }) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useItems({ params: { search: searchQuery } });

  const rawItemsList = data?.data || [];
  // El backend puede devolver el mismo item más de una vez (variantes agrupadas
  // bajo el mismo id); se deduplica para evitar keys repetidas en el listado.
  const itemsList = Array.from(new Map(rawItemsList.map((i: any) => [i.id, i])).values());

  const options = itemsList.map((i: any) => ({
    value: i.id.toString(),
    label: `${i.reference ? i.reference + ' - ' : ''}${i.name}`,
    rawItem: i,
  }));

  if (item.item_id && !options.some((o: any) => o.value === String(item.item_id))) {
    options.push({
      value: String(item.item_id),
      label: `${item.referencia ? item.referencia + ' - ' : ''}${item.item}`,
      rawItem: { id: item.item_id, name: item.item, reference: item.referencia, price: item.precio } as any,
    });
  }

  const handleItemSelect = (val: string) => {
    const selectedOption = options.find((o: any) => o.value === val);
    if (selectedOption) {
      const ri = (selectedOption as any).rawItem;

      // /items aplana variantes (entity_type: "variant") en la misma lista, cada una con
      // su propio id y parent_id apuntando al Item real — item_id debe resolver a parent_id
      // o exists:items,id lo rechaza (el id de una variante no es un id de item válido).
      const resolvedItemId = ri.entity_type === "variant" ? (ri.parent_id ?? ri.id) : ri.id;
      builder.updateItem(item.id, "item_id", resolvedItemId);
      builder.updateItem(item.id, "item", ri.name);
      builder.updateItem(item.id, "referencia", ri.reference || "");
      builder.updateItem(item.id, "description", ri.description || "");
      builder.updateItem(item.id, "precio", ri.price || 0);
      builder.updateItem(item.id, "cantidad", 1);

      if (ri.tax_rates && ri.tax_rates.length > 0) {
        const defaultTax = ri.tax_rates[0];
        builder.updateItem(item.id, "taxObj", {
          tax_rate_id: defaultTax.tax_rate_id,
          tax_id: defaultTax.tax_id,
          code: defaultTax.tax_code || defaultTax.code,
          name: defaultTax.name,
          rate: parseFloat(defaultTax.rate || "0"),
          type: defaultTax.type || 'percentage',
          description: defaultTax.description || "",
        });
      } else {
        builder.updateItem(item.id, "taxObj", null);
      }
    }
  };

  const qty = Number(item.cantidad) || 0;
  const price = Number(item.precio) || 0;
  const discValue = Number(item.discountValue) || 0;

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

  const lineTax = (item.taxObj as any)?.type === 'fixed' ? taxRate * qty : lineNet * (taxRate / 100);
  const safeNet = isNaN(lineNet) ? 0 : lineNet;
  const safeTax = isNaN(lineTax) ? 0 : lineTax;
  const rowTotal = safeNet + safeTax;

  const handleQuantityChange = (newQty: number) => {
    builder.updateItem(item.id, "cantidad", newQty);
  };

  return {
    searchQuery,
    setSearchQuery,
    isLoading,
    options,
    handleItemSelect,
    rowTotal,
    handleQuantityChange,
  };
}

function ItemRow({
  item,
  index,
  builder,
  taxes,
  accountOptions,
  errors,
}: {
  item: BillLineFormState;
  index: number;
  builder: any;
  taxes: any[];
  accountOptions: { value: string; label: string }[];
  errors?: Record<string, any>;
}) {
  const {
    setSearchQuery,
    isLoading,
    options,
    handleItemSelect,
    rowTotal,
    handleQuantityChange,
  } = useItemRowLogic({ item, builder });

  const inputClasses = "bg-white h-8 px-3 text-xs border border-foreground/20 shadow-none text-foreground hover:border-primary/50 focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const hasError = errors?.items === "empty_items" && !item.item_id;

  const quantityBackendError = errors?.[`items.${index}.quantity`];
  const isInvalidQuantity = (errors?.items === "invalid_quantity" && item.item_id && (!item.cantidad || Number(item.cantidad) <= 0)) || !!quantityBackendError;

  const taxObj: any = item.taxObj;

  return (
    <tr className={`border-b border-border transition-colors ${hasError ? 'bg-destructive/5' : 'bg-white'}`}>
      <td className="px-2 py-2 align-middle">
        <AsyncSearchableSelect
          value={item.item_id ? String(item.item_id) : ""}
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

      <td className="px-2 py-2 align-middle">
        <Input
          placeholder="Referencia"
          value={item.referencia || ""}
          onChange={(e) => builder.updateItem(item.id, "referencia", e.target.value)}
          className={inputClasses}
        />
      </td>

      <td className="px-2 py-2 align-middle">
        <FormattedInput
          placeholder="Precio"
          value={item.precio || 0}
          onChange={(val: number) => builder.updateItem(item.id, "precio", val)}
          className={inputClasses}
        />
      </td>

      <td className="px-2 py-2 align-middle">
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
                  builder.updateItem(item.id, "discountValue", "");
                } else {
                  builder.updateItem(item.id, "discountValue", val);
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
                  builder.updateItem(item.id, "discountValue", "");
                } else {
                  builder.updateItem(item.id, "discountValue", val);
                }
              }}
              className={`${inputClasses} rounded-r-none border-r-0`}
            />
          )}
          <Select
            value={item.discountType || "percentage"}
            onValueChange={(val: any) => builder.updateItem(item.id, "discountType", val)}
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

      <td className="px-2 py-2 align-middle">
        <SearchableSelect
          value={taxObj?.tax_rate_id?.toString() || taxObj?.id?.toString() || taxObj?.tax_id?.toString() || "0"}
          onValueChange={(val) => {
            if (val === "new_tax") {
              const el = document.getElementById('open-new-tax-modal');
              if (el) el.click();
              return;
            }
            if (val === "0") {
              builder.updateItem(item.id, "taxObj", null);
            } else {
              const tax = taxes?.find((t: any) => String(t.id) === val);
              if (tax) {
                const taxRateObj = {
                  tax_rate_id: tax.id,
                  tax_id: tax.tax_id,
                  code: tax.tax_code || tax.code,
                  name: tax.name,
                  rate: parseFloat(tax.rate || tax.percentage || "0"),
                  type: tax.type || 'percentage',
                  description: tax.description || "",
                };
                builder.updateItem(item.id, "taxObj", taxRateObj);
              }
            }
          }}
          options={[
            { value: "0", label: "Sin impuesto" },
            ...(taxes || []).map((tax: any) => ({
              value: String(tax.id),
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

      <td className="px-2 py-2 align-middle">
        <Input
          placeholder="Descripción"
          value={item.description || ""}
          onChange={(e) => builder.updateItem(item.id, "description", e.target.value)}
          className={inputClasses}
        />
      </td>

      <td className="px-2 py-2 align-middle">
        <SearchableSelect
          value={item.account_id ? String(item.account_id) : ""}
          onValueChange={(val) => builder.updateItem(item.id, "account_id", val || null)}
          options={accountOptions}
          placeholder="Automática"
          searchPlaceholder="Buscar cuenta..."
          className={`h-8 text-xs bg-white shadow-none hover:border-primary/50 focus:border-primary transition-colors border-foreground/20`}
        />
      </td>

      <td className="px-2 py-2 align-middle">
        <div className="relative flex items-center">
          <Input
            type="number"
            min={0}
            onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault(); }}
            value={item.cantidad || ""}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className={`${inputClasses} w-full ${isInvalidQuantity ? '!text-red-600 font-bold !border-red-500' : ''}`}
          />
        </div>
      </td>

      <td className="px-2 py-2 text-right text-xs font-medium text-foreground whitespace-nowrap align-middle">
        $ {new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(rowTotal)}
      </td>

      <td className="px-2 py-2 text-center align-middle">
        <button
          onClick={() => builder.removeItem(item.id)}
          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

/**
 * Misma línea que ItemRow, en formato tarjeta para pantallas angostas donde
 * una fila de 9 columnas es inutilizable. Reusa useItemRowLogic así que el
 * comportamiento (descuentos, impuestos, totales) es idéntico.
 */
function ItemCard({
  item,
  index,
  builder,
  taxes,
  accountOptions,
  errors,
}: {
  item: BillLineFormState;
  index: number;
  builder: any;
  taxes: any[];
  accountOptions: { value: string; label: string }[];
  errors?: Record<string, any>;
}) {
  const {
    setSearchQuery,
    isLoading,
    options,
    handleItemSelect,
    rowTotal,
    handleQuantityChange,
  } = useItemRowLogic({ item, builder });

  const fieldClasses = "bg-white h-9 px-3 text-sm border border-foreground/20 shadow-none text-foreground hover:border-primary/50 focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const hasError = errors?.items === "empty_items" && !item.item_id;
  const quantityBackendError = errors?.[`items.${index}.quantity`];
  const isInvalidQuantity = (errors?.items === "invalid_quantity" && item.item_id && (!item.cantidad || Number(item.cantidad) <= 0)) || !!quantityBackendError;

  const taxObj: any = item.taxObj;

  return (
    <div className={`rounded-lg border p-3 space-y-3 ${hasError ? 'bg-destructive/5 border-destructive/40' : 'bg-white border-border'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-medium text-muted-foreground mb-1">Ítem</label>
          <AsyncSearchableSelect
            value={item.item_id ? String(item.item_id) : ""}
            onValueChange={handleItemSelect}
            options={options}
            loading={isLoading}
            onSearchChange={setSearchQuery}
            placeholder="Buscar ítem"
            searchPlaceholder="Nombre o ref..."
            className={`h-9 text-sm bg-white hover:border-primary/50 focus:border-primary cursor-pointer transition-colors shadow-none ${hasError ? 'border-destructive !text-destructive' : 'border-foreground/20'}`}
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
        </div>
        <button
          onClick={() => builder.removeItem(item.id)}
          className="mt-6 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
          aria-label="Quitar ítem"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Referencia</label>
          <Input
            placeholder="Referencia"
            value={item.referencia || ""}
            onChange={(e) => builder.updateItem(item.id, "referencia", e.target.value)}
            className={fieldClasses}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Precio</label>
          <FormattedInput
            placeholder="Precio"
            value={item.precio || 0}
            onChange={(val: number) => builder.updateItem(item.id, "precio", val)}
            className={fieldClasses}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">Descripción</label>
        <Input
          placeholder="Descripción"
          value={item.description || ""}
          onChange={(e) => builder.updateItem(item.id, "description", e.target.value)}
          className={fieldClasses}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">Cuenta contable</label>
        <SearchableSelect
          value={item.account_id ? String(item.account_id) : ""}
          onValueChange={(val) => builder.updateItem(item.id, "account_id", val || null)}
          options={accountOptions}
          placeholder="Automática"
          searchPlaceholder="Buscar cuenta..."
          className="h-9 text-sm bg-white shadow-none hover:border-primary/50 focus:border-primary transition-colors border-foreground/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Descuento</label>
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
                    builder.updateItem(item.id, "discountValue", "");
                  } else {
                    builder.updateItem(item.id, "discountValue", val);
                  }
                }}
                className={`${fieldClasses} rounded-r-none border-r-0 min-w-0`}
              />
            ) : (
              <FormattedInput
                placeholder="0"
                value={item.discountValue || 0}
                onChange={(val: number) => {
                  const lineBase = (Number(item.cantidad) || 0) * (Number(item.precio) || 0);
                  if (lineBase > 0 && val > lineBase) {
                    showToast("El valor digitado excede el valor total del ítem", "warning");
                    builder.updateItem(item.id, "discountValue", "");
                  } else {
                    builder.updateItem(item.id, "discountValue", val);
                  }
                }}
                className={`${fieldClasses} rounded-r-none border-r-0 min-w-0`}
              />
            )}
            <Select
              value={item.discountType || "percentage"}
              onValueChange={(val: any) => builder.updateItem(item.id, "discountType", val)}
            >
              <SelectTrigger className="h-9 px-2 text-sm border border-foreground/20 bg-white shadow-none rounded-l-none w-14 hover:bg-muted cursor-pointer transition-colors shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage" className="cursor-pointer hover:bg-muted focus:bg-muted">%</SelectItem>
                <SelectItem value="fixed" className="cursor-pointer hover:bg-muted focus:bg-muted">$</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Cantidad</label>
          <div className="relative flex items-center">
            <Input
              type="number"
              min={0}
              onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault(); }}
              value={item.cantidad || ""}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className={`${fieldClasses} w-full ${isInvalidQuantity ? '!text-red-600 font-bold !border-red-500' : ''}`}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">Impuesto</label>
        <SearchableSelect
          value={taxObj?.tax_rate_id?.toString() || taxObj?.id?.toString() || taxObj?.tax_id?.toString() || "0"}
          onValueChange={(val) => {
            if (val === "new_tax") {
              const el = document.getElementById('open-new-tax-modal');
              if (el) el.click();
              return;
            }
            if (val === "0") {
              builder.updateItem(item.id, "taxObj", null);
            } else {
              const tax = taxes?.find((t: any) => String(t.id) === val);
              if (tax) {
                const taxRateObj = {
                  tax_rate_id: tax.id,
                  tax_id: tax.tax_id,
                  code: tax.tax_code || tax.code,
                  name: tax.name,
                  rate: parseFloat(tax.rate || tax.percentage || "0"),
                  type: tax.type || 'percentage',
                  description: tax.description || "",
                };
                builder.updateItem(item.id, "taxObj", taxRateObj);
              }
            }
          }}
          options={[
            { value: "0", label: "Sin impuesto" },
            ...(taxes || []).map((tax: any) => ({
              value: String(tax.id),
              label: `${tax.name} (${parseFloat(tax.rate || "0")}%)`
            })),
            { value: "new_tax", label: "+ Crear impuesto" }
          ]}
          placeholder="Sin impuesto"
          searchPlaceholder="Buscar impuesto..."
          emptyMessage="No se encontraron impuestos"
          className={`h-9 text-sm bg-white shadow-none hover:border-primary/50 focus:border-primary transition-colors ${hasError ? 'border-destructive' : 'border-foreground/20'}`}
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <span className="text-xs font-medium text-muted-foreground">Total línea</span>
        <span className="text-sm font-semibold text-foreground">
          $ {new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(rowTotal)}
        </span>
      </div>
    </div>
  );
}

// Tabla de ítems de factura de compra — mismo componente, columnas y estilos
// que InvoiceItemsTable (factura de venta). No valida stock (una factura de
// compra recibe mercancía/servicios, no consume inventario propio) y no
// restringe por tipo de ítem (a diferencia de orden de compra/remisión, admite
// productos y servicios, igual que Documento Soporte).
export function BillItemsTable({
  builder,
  taxes,
  errors,
}: {
  builder: any;
  taxes: any[];
  errors?: Record<string, any>;
}) {
  const items: BillLineFormState[] = builder.items;
  const isEmpty = items.length === 0;

  // Override opcional de cuenta contable por línea — si no se elige, el backend resuelve
  // la cuenta de Inventario/Gastos automáticamente desde el ítem o el catálogo por defecto.
  const { data: accountsData } = useAccountsList({ postable_only: true });
  const accountOptions = [
    { value: "", label: "Automática" },
    ...(accountsData || []).map((a: any) => ({ value: String(a.id), label: `${a.code} — ${a.name}` })),
  ];

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
        <ShoppingBag className="w-7 h-7 text-primary" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium text-foreground">No hay ítems agregados</p>
      <p className="text-xs text-muted-foreground">Haz clic en <span className="font-semibold text-primary">"Agregar ítem"</span> para comenzar.</p>
    </div>
  );

  return (
    <div className="w-full rounded-lg border border-border overflow-hidden">
      {/* Tarjetas — pantallas angostas (below md) */}
      <div className="md:hidden bg-muted/10">
        {isEmpty ? emptyState : (
          <div className="p-3 space-y-3">
            {items.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                index={index}
                builder={builder}
                taxes={taxes}
                accountOptions={accountOptions}
                errors={errors}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tabla — md y superior */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-background">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              {[
                { title: "Ítem", width: "24%" },
                { title: "Referencia", width: "8%" },
                { title: "Precio", width: "10%" },
                { title: "Descuento", width: "10%" },
                { title: "Impuesto", width: "11%" },
                { title: "Descripción", width: "8%" },
                { title: "Cuenta contable", width: "14%" },
                { title: "Cantidad", width: "6%" },
                { title: "Total", width: "9%" },
                { title: "", width: "5%" }
              ].map((col) => (
                <th
                  key={col.title}
                  style={{ width: col.width }}
                  className="px-2 py-3 text-xs font-semibold text-muted-foreground text-left first:pl-4"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td colSpan={10} className="bg-white">
                  {emptyState}
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  builder={builder}
                  taxes={taxes}
                  accountOptions={accountOptions}
                  errors={errors}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-muted/10 border-t border-border flex justify-end">
        <button
          type="button"
          onClick={builder.addItem}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          Agregar ítem
        </button>
      </div>
    </div>
  );
}
