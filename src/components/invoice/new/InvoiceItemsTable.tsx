"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export function InvoiceItemsTable({
  items,
  onAddItem,
}: {
  items: any[];
  onAddItem: () => void;
}) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-background border border-border rounded-lg">

        {/* HEADER */}
        <thead className="bg-muted/40">
          <tr>
            {[
              "Ítem",
              "Referencia",
              "Precio",
              "Desc %",
              "Impuesto",
              "Descripción",
              "Cantidad",
              "Total",
              "",
            ].map((col) => (
              <th
                key={col}
                className="px-2 py-2 text-xs font-medium text-muted-foreground"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="bg-white border-b border-border"
            >

              {/* ITEM */}
              <td className="px-2 py-2">
                <Select>
                  <SelectTrigger className="bg-white ml-2 h-8 px-3 text-xs border border-foreground/20 shadow-none text-foreground hover:text-primary/80 text-sm font-medium flex items-center gap-1 mb-6 transition-colors">
                    <SelectValue placeholder="Ítem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="item1"
                      className="rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                    >
                      Item 1
                    </SelectItem>
                  </SelectContent>
                </Select>
              </td>

              {/* REFERENCIA */}
              < td className="px-2 py-2" >
                <Input
                  placeholder="Referencia"
                  defaultValue={item.referencia}
                  className="bg-white ml-2 h-8 px-3 text-xs border border-foreground/20 shadow-none text-foreground hover:text-primary/80 text-sm font-medium flex items-center gap-1 mb-6 transition-colors"
                />
              </td>

              {/* PRECIO */}
              <td className="px-2 py-2">
                <Input
                  placeholder="Precio"
                  defaultValue={item.precio}
                  className="bg-white ml-2 h-8 px-3 text-xs border border-foreground/20 shadow-none text-foreground hover:text-primary/80 text-sm font-medium flex items-center gap-1 mb-6 transition-colors"
                />
              </td>

              {/* DESCUENTO */}
              <td className="px-2 py-2">
                <Input
                  placeholder="%"
                  defaultValue={item.descuento}
                  className="bg-white ml-2 h-8 px-3 text-xs border border-foreground/20 shadow-none text-foreground hover:text-primary/80 text-sm font-medium flex items-center gap-1 mb-6 transition-colors"
                />
              </td>

              {/* IMPUESTO */}
              <td className="px-2 py-2">
                <Select>
                  <SelectTrigger className="bg-white ml-2 h-8 px-3 text-xs border border-foreground/20 shadow-none text-foreground hover:text-primary/80 text-sm font-medium flex items-center gap-1 mb-6 transition-colors">
                    <SelectValue placeholder="Impuesto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                      value="impuesto1">Impuesto 1</SelectItem>
                  </SelectContent>
                </Select>
              </td>

              {/* DESCRIPCIÓN */}
              <td className="px-2 py-2">
                <Input
                  placeholder="Descripción"
                  defaultValue={item.descripcion}
                  className="bg-white ml-2 h-8 px-3 text-xs border border-foreground/20 shadow-none text-foreground hover:text-primary/80 text-sm font-medium flex items-center gap-1 mb-6 transition-colors"
                />
              </td>

              {/* CANTIDAD */}
              <td className="px-2 py-2">
                <Input
                  type="number"
                  defaultValue="0"
                  className="bg-white ml-2 h-8 px-3 text-xs border border-foreground/20 shadow-none text-foreground hover:text-primary/80 text-sm font-medium flex items-center gap-1 mb-6 transition-colors w-16"
                />
              </td>

              {/* TOTAL */}
              <td className="px-2 py-2 text-right text-xs font-medium text-foreground">
                $ 0
              </td>

              {/* DELETE */}
              <td className="px-2 py-2">
                <button className="p-1 rounded hover:bg-destructive/10 transition">
                  <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table >

      {/* BOTÓN */}
      < div className="flex justify-end mt-3" >
        <button
          type="button"
          onClick={onAddItem}
          className="
            px-4 py-2
            rounded-lg
            text-sm font-medium
            transition-colors

            bg-primary
            text-primary-foreground

            hover:bg-primary/90
          "
        >
          Agregar ítem
        </button>
      </div >
    </div >
  );
}