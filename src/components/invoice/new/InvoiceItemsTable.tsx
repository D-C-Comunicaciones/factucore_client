"use client";
import { useState } from "react";
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
import { useItems } from "@/hooks/items/useItems";

function ItemRow({ 
  item, 
  invoiceBuilder, 
  selectedWarehouseId, 
  selectedPriceListId,
  taxes 
}: { 
  item: any; 
  invoiceBuilder: any;
  selectedWarehouseId: number | null;
  selectedPriceListId: number | null;
  taxes: any[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading } = useItems({
    search: searchQuery,
    Warehouse_id: selectedWarehouseId ?? undefined,
    price_list_id: selectedPriceListId ?? undefined,
    per_page: 20
  } as any);

  const itemsList = data?.data || [];
  const options = itemsList.map(i => ({
    value: i.id.toString(),
    label: `${i.reference ? i.reference + ' - ' : ''}${i.name}`,
    rawItem: i
  }));

  const handleItemSelect = (val: string) => {
    const selectedOption = options.find(o => o.value === val);
    if (selectedOption) {
      const ri = selectedOption.rawItem;
      // Auto-fill row
      invoiceBuilder.updateItem(item.id, "item_id", ri.id);
      invoiceBuilder.updateItem(item.id, "standard_code", ri.standard_code || "");
      invoiceBuilder.updateItem(item.id, "item", ri.name);
      invoiceBuilder.updateItem(item.id, "referencia", ri.reference || "");
      invoiceBuilder.updateItem(item.id, "description", ri.description || "");
      invoiceBuilder.updateItem(item.id, "precio", ri.price || 0);
      invoiceBuilder.updateItem(item.id, "cantidad", 1);
      
      // Attempt to auto-fill tax if the item has one assigned
      if (ri.tax_rates && ri.tax_rates.length > 0) {
        const tax = ri.tax_rates[0];
        const rawRate = tax.code ?? tax.rate ?? tax.percentage ?? 0;
        const taxRate = Number(rawRate);
        const safeRate = isNaN(taxRate) ? 0 : taxRate;
        const normalizedName = `${tax.name || 'IVA'} (${safeRate}%)`;
        const taxObj = {
          tax_id: tax.id,
          type: "percentage",
          rate: safeRate,
          name: normalizedName
        };
        invoiceBuilder.updateItemTax(item.id, taxObj);
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

  return (
    <tr className="bg-white border-b border-border">
      <td className="px-2 py-2 w-48">
        <AsyncSearchableSelect
          value={options.find(o => o.rawItem.name === item.item)?.value || ""}
          onValueChange={handleItemSelect}
          options={options}
          loading={isLoading}
          onSearchChange={setSearchQuery}
          placeholder="Buscar ítem..."
          searchPlaceholder="Nombre o ref..."
          className="h-8 text-xs border-foreground/20 bg-white hover:bg-muted cursor-pointer transition-colors"
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
        <Input
          type="number"
          min={0}
          onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault(); }}
          placeholder="Precio"
          value={item.precio || ""}
          onChange={(e) => invoiceBuilder.updateItem(item.id, "precio", Number(e.target.value))}
          className={inputClasses}
        />
      </td>

      <td className="px-2 py-2 w-32">
        <div className="flex items-center">
            <Input
                type="number"
                min={0}
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault(); }}
                placeholder="0"
                value={item.discountValue || ""}
                onChange={(e) => invoiceBuilder.updateItemDiscount(item.id, Number(e.target.value), item.discountType || 'percentage')}
                className={`${inputClasses} rounded-r-none border-r-0`}
            />
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

      <td className="px-2 py-2 w-32">
        <Select 
          value={item.taxObj?.tax_id?.toString() || "0"} 
          onValueChange={(val) => {
            if (val === "0") {
              invoiceBuilder.updateItemTax(item.id, null);
            } else {
              const tax = taxes?.find((t: any) => t.id.toString() === val);
              if (tax) {
                // Support multiple field names: code (from new tax API), rate (from item tax_rates), and percentage
                const rawRate = tax.code ?? tax.rate ?? tax.percentage ?? 0;
                const taxRate = Number(rawRate);
                const normalizedName = `${tax.name || 'IVA'} (${isNaN(taxRate) ? 0 : taxRate}%)`;
                invoiceBuilder.updateItemTax(item.id, {
                  tax_id: tax.id,
                  type: "percentage",
                  rate: isNaN(taxRate) ? 0 : taxRate,
                  name: normalizedName
                });
              }
            }
          }}
        >
          <SelectTrigger className={`${inputClasses} hover:bg-muted cursor-pointer`}>
            <SelectValue placeholder="Impuesto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0" className="cursor-pointer hover:bg-muted focus:bg-muted">Sin impuesto</SelectItem>
            {taxes?.map((t: any) => {
              const rawRate = t.code ?? t.rate ?? t.percentage ?? 0;
              const displayRate = Number(rawRate);
              return (
                <SelectItem key={t.id} value={t.id.toString()} className="cursor-pointer hover:bg-muted focus:bg-muted">
                  {t.name} ({isNaN(displayRate) ? 0 : displayRate}%)
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </td>

      <td className="px-2 py-2">
        <Input
          placeholder="Descripción"
          value={item.description}
          onChange={(e) => invoiceBuilder.updateItem(item.id, "description", e.target.value)}
          className={inputClasses}
        />
      </td>

      <td className="px-2 py-2 w-20">
        <Input
          type="number"
          min={0}
          onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault(); }}
          value={item.cantidad || ""}
          onChange={(e) => invoiceBuilder.updateItem(item.id, "cantidad", Number(e.target.value))}
          className={inputClasses}
        />
      </td>

      <td className="px-2 py-2 text-right text-xs font-medium text-foreground whitespace-nowrap">
        ${rowTotal.toFixed(2)}
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
  taxes
}: {
  invoiceBuilder: any;
  selectedWarehouseId: number | null;
  selectedPriceListId: number | null;
  taxes: any[];
}) {
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
            ].map((col) => (
              <th
                key={col}
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
            invoiceBuilder.items.map((item: any) => (
              <ItemRow 
                key={item.id} 
                item={item} 
                invoiceBuilder={invoiceBuilder}
                selectedWarehouseId={selectedWarehouseId}
                selectedPriceListId={selectedPriceListId}
                taxes={taxes}
              />
            ))
          )}
        </tbody>
      </table>

      <div className="p-3 bg-muted/10 border-t border-border flex justify-end">
        <button
          type="button"
          onClick={invoiceBuilder.addItem}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Agregar ítem
        </button>
      </div>
    </div>
  );
}