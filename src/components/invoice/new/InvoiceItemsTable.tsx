"use client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export function InvoiceItemsTable({ items, onAddItem }: { items: any[]; onAddItem: () => void }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 text-xs font-medium text-gray-600">Ítem</th>
            <th className="px-2 py-2 text-xs font-medium text-gray-600">Referencia</th>
            <th className="px-2 py-2 text-xs font-medium text-gray-600">Precio</th>
            <th className="px-2 py-2 text-xs font-medium text-gray-600">Desc %</th>
            <th className="px-2 py-2 text-xs font-medium text-gray-600">Impuesto</th>
            <th className="px-2 py-2 text-xs font-medium text-gray-600">Descripción</th>
            <th className="px-2 py-2 text-xs font-medium text-gray-600">Cantidad</th>
            <th className="px-2 py-2 text-xs font-medium text-gray-600">Total</th>
            <th className="px-2 py-2 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="px-2 py-2">
                <Select>
                  <SelectTrigger className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                  >
                    <SelectValue placeholder="Ítem" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                    <SelectItem value="item1" className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors" style={{ minHeight: "36px", height: "36px", borderWidth: "0px" }}>Item 1</SelectItem>
                    <SelectItem value="item2" className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors" style={{ minHeight: "36px", height: "36px", borderWidth: "0px" }}>Item 2</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="px-2 py-2">
                <Input
                  placeholder="Referencia"
                  className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                  defaultValue={item.referencia}
                />
              </td>
              <td className="px-2 py-2">
                <Input
                  placeholder="Precio unit"
                  className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                  defaultValue={item.precio}
                />
              </td>
              <td className="px-2 py-2">
                <Input
                  placeholder="%"
                  className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                  defaultValue={item.descuento}
                />
              </td>
              <td className="px-2 py-2">
                <Select>
                  <SelectTrigger className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    style={{ minHeight: "36px", height: "36px", borderWidth: "1px" }}
                  >
                    <SelectValue placeholder="Impuesto" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                    <SelectItem value="impuesto1" className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors" style={{ minHeight: "36px", height: "36px", borderWidth: "0px" }}>Impuesto 1</SelectItem>
                    <SelectItem value="impuesto2" className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors" style={{ minHeight: "36px", height: "36px", borderWidth: "0px" }}>Impuesto 2</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="px-2 py-2">
                <Input
                  type="text"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  defaultValue={item.descripcion}
                />
              </td>
              <td className="px-2 py-2">
                <Input
                  type="number"
                  defaultValue="0"
                  className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </td>
              <td className="px-2 py-2 text-right text-sm font-medium">
                $ 0
              </td>
              <td className="px-2 py-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={onAddItem}
          className="px-3 py-1.5 bg-teal-500 text-white rounded-lg text-xs font-medium hover:bg-teal-600 transition-colors"
        >
          Agregar ítem
        </button>
      </div>
    </div>
  );
}
