"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
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
import { showToast } from "@/components/sonner/CustomToaster";

function FormattedInput({ value, onChange, placeholder, className }: any) {
  const [displayValue, setDisplayValue] = React.useState(value ? new Intl.NumberFormat("es-CO").format(value) : "");

  React.useEffect(() => {
    const numericDisplay = parseFloat(displayValue.replace(/\./g, "").replace(/,/g, ".")) || 0;
    if (value !== numericDisplay && value !== undefined) {
      setDisplayValue(value ? new Intl.NumberFormat("es-CO").format(value) : "");
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
    setDisplayValue(new Intl.NumberFormat("es-CO").format(num));
    onChange(num);
  };

  return <Input type="text" placeholder={placeholder} value={displayValue} onChange={handleChange} className={className} />;
}

function ItemRow({ item, builder, taxes, errors }: { item: any; builder: any; taxes: any[]; errors?: Record<string, any> }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useItems({ params: { search: searchQuery } });

  const rawItemsList = data?.data || [];
  // El backend puede devolver el mismo item más de una vez (variantes agrupadas
  // bajo el mismo id); se deduplica para evitar keys repetidas en el listado.
  const dedupedItemsList = Array.from(new Map(rawItemsList.map((i: any) => [i.id, i])).values());
  // Las órdenes de compra solo admiten productos (inventariables); los servicios
  // (type_item_id 2) no se listan porque no tienen stock que reponer.
  const itemsList = dedupedItemsList.filter((i: any) => i.type_item_id === 1);
  const options = itemsList.map((i: any) => ({
    value: i.id.toString(),
    label: `${i.reference ? i.reference + " - " : ""}${i.name}`,
  }));

  if (item.item_id && !options.some((o: any) => o.value === item.item_id.toString())) {
    options.push({
      value: item.item_id.toString(),
      label: `${item.referencia ? item.referencia + " - " : ""}${item.item}`,
    });
  }

  const handleItemSelect = (val: string) => {
    const raw = itemsList.find((i: any) => i.id.toString() === val);
    if (raw) {
      builder.updateItem(item.id, "item_id", raw.id);
      builder.updateItem(item.id, "item", raw.name);
      builder.updateItem(item.id, "referencia", raw.reference || "");
      builder.updateItem(item.id, "precio", raw.price || 0);
      builder.updateItem(item.id, "cantidad", 1);

      if (raw.tax_rates && raw.tax_rates.length > 0) {
        const defaultTax = raw.tax_rates[0];
        builder.updateItemTax(item.id, {
          tax_rate_id: defaultTax.tax_rate_id,
          tax_id: defaultTax.tax_id,
          code: defaultTax.tax_code || defaultTax.code,
          name: defaultTax.name,
          rate: parseFloat(defaultTax.rate || "0"),
          type: defaultTax.type || "percentage",
        });
      } else {
        builder.updateItemTax(item.id, null);
      }
    }
  };

  const qty = Number(item.cantidad) || 0;
  const price = Number(item.precio) || 0;
  const discValue = Number(item.discountValue) || 0;
  const lineBase = qty * price;
  const lineDiscount = item.discountType === "percentage" ? lineBase * (discValue / 100) : discValue;
  const lineNet = lineBase - lineDiscount;

  let taxRate = 0;
  if (item.taxObj && item.taxObj.rate !== undefined && item.taxObj.rate !== null) {
    taxRate = Number(item.taxObj.rate);
    if (isNaN(taxRate)) taxRate = 0;
  }
  const lineTax = item.taxObj?.type === "fixed" ? taxRate * qty : lineNet * (taxRate / 100);
  const rowTotal = (isNaN(lineNet) ? 0 : lineNet) + (isNaN(lineTax) ? 0 : lineTax);

  const inputClasses =
    "bg-white h-8 px-3 text-xs border border-foreground/20 shadow-none text-foreground hover:border-primary/50 focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const hasError = errors?.items === "empty_items" && !item.item_id;
  const isInvalidQuantity = errors?.items === "invalid_quantity" && item.item_id && (!item.cantidad || item.cantidad <= 0);

  return (
    <tr className={`border-b border-border transition-colors ${hasError ? "bg-destructive/5" : "bg-white"}`}>
      <td className="px-2 py-2 align-middle">
        <AsyncSearchableSelect
          value={item.item_id ? item.item_id.toString() : ""}
          onValueChange={handleItemSelect}
          options={options}
          loading={isLoading}
          onSearchChange={setSearchQuery}
          placeholder="Buscar concepto"
          searchPlaceholder="Nombre o ref..."
          className={`h-8 text-xs bg-white hover:border-primary/50 focus:border-primary focus-visible:border-primary cursor-pointer transition-colors shadow-none ${hasError ? "border-destructive !text-destructive" : "border-foreground/20"}`}
          footer={
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("open-quick-item-modal");
                if (el) {
                  el.setAttribute("data-target-row", item.id);
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
        <FormattedInput
          placeholder="Precio"
          value={item.precio || 0}
          onChange={(val: number) => builder.updateItem(item.id, "precio", val)}
          className={inputClasses}
        />
      </td>

      <td className="px-2 py-2 align-middle">
        <div className="flex items-center">
          {item.discountType === "percentage" ? (
            <Input
              type="number"
              min={0}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") e.preventDefault();
              }}
              placeholder="0"
              value={item.discountValue || ""}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > 100) {
                  showToast("El porcentaje de descuento no puede ser mayor al 100%", "warning");
                  builder.updateItemDiscount(item.id, "", "percentage");
                } else {
                  builder.updateItemDiscount(item.id, val, "percentage");
                }
              }}
              className={`${inputClasses} rounded-r-none border-r-0`}
            />
          ) : (
            <FormattedInput
              placeholder="0"
              value={item.discountValue || 0}
              onChange={(val: number) => builder.updateItemDiscount(item.id, val, "fixed")}
              className={`${inputClasses} rounded-r-none border-r-0`}
            />
          )}
          <Select
            value={item.discountType || "percentage"}
            onValueChange={(val: any) => builder.updateItemDiscount(item.id, item.discountValue || 0, val)}
          >
            <SelectTrigger className="h-8 px-1 text-xs border border-foreground/20 bg-white shadow-none rounded-l-none w-12 hover:bg-muted cursor-pointer transition-colors">
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
          value={item.taxObj?.tax_rate_id?.toString() || item.taxObj?.tax_id?.toString() || "0"}
          onValueChange={(val) => {
            if (val === "0") {
              builder.updateItemTax(item.id, null);
              return;
            }
            const tax = taxes?.find((t: any) => t.id.toString() === val);
            if (tax) {
              builder.updateItemTax(item.id, {
                tax_rate_id: tax.id,
                tax_id: tax.tax_id,
                code: tax.tax_code || tax.code,
                name: tax.name,
                rate: parseFloat(tax.rate || tax.percentage || "0"),
                type: tax.type || "percentage",
              });
            }
          }}
          options={[
            { value: "0", label: "Ninguno" },
            ...(taxes || []).map((tax: any) => ({
              value: tax.id.toString(),
              label: `${tax.name} (${parseFloat(tax.rate || "0")}%)`,
            })),
          ]}
          placeholder="Ninguno"
          searchPlaceholder="Buscar impuesto..."
          emptyMessage="No se encontraron impuestos"
          className="h-8 text-xs bg-white shadow-none hover:border-primary/50 focus:border-primary transition-colors border-foreground/20"
        />
      </td>

      <td className="px-2 py-2 align-middle">
        <Input
          type="number"
          min={0}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") e.preventDefault();
          }}
          value={item.cantidad}
          onChange={(e) => builder.updateItem(item.id, "cantidad", e.target.value === "" ? "" : Number(e.target.value))}
          className={`${inputClasses} ${isInvalidQuantity ? "!text-red-600 font-bold !border-red-500" : ""}`}
        />
      </td>

      <td className="px-2 py-2 align-middle">
        <Input
          placeholder="Observaciones"
          value={item.description}
          onChange={(e) => builder.updateItem(item.id, "description", e.target.value)}
          className={inputClasses}
        />
      </td>

      <td className="px-2 py-2 text-right text-xs font-medium text-foreground whitespace-nowrap align-middle">
        $ {new Intl.NumberFormat("es-CO").format(rowTotal)}
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

// Tabla de ítems compartida por órdenes de compra internal/external — mismo
// componente que Cotizaciones/Remisiones para descuento/impuesto por línea.
export function PurchaseOrderLineItemsTable({ builder, taxes, errors }: { builder: any; taxes: any[]; errors?: Record<string, any> }) {
  return (
    <div className="overflow-x-auto w-full rounded-lg border border-border">
      <table className="min-w-full bg-background">
        <thead className="bg-muted/30 border-b border-border">
          <tr>
            {[
              { title: "Concepto", width: "24%" },
              { title: "Precio", width: "12%" },
              { title: "Desc %", width: "13%" },
              { title: "Impuesto", width: "14%" },
              { title: "Cantidad", width: "9%" },
              { title: "Observaciones", width: "16%" },
              { title: "Total", width: "10%" },
              { title: "", width: "2%" },
            ].map((col) => (
              <th key={col.title} style={{ width: col.width }} className="px-2 py-3 text-xs font-semibold text-muted-foreground text-left first:pl-4">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {builder.items.length === 0 ? (
            <tr>
              <td colSpan={8} className="bg-white">
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <p className="text-sm font-medium text-foreground">No hay ítems agregados</p>
                  <p className="text-xs text-muted-foreground">
                    Haz clic en <span className="font-semibold text-primary">"Agregar línea"</span> para comenzar.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            builder.items.map((item: any) => <ItemRow key={item.id} item={item} builder={builder} taxes={taxes} errors={errors} />)
          )}
        </tbody>
      </table>

      <div className="p-3 bg-muted/10 border-t border-border flex justify-end">
        <button
          type="button"
          onClick={builder.addItem}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          + Agregar línea
        </button>
      </div>
    </div>
  );
}
