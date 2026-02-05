import React from 'react';
import { X, Plus } from 'lucide-react';

interface FacturaItem {
  id: number;
  item: string;
  referencia: string;
  precio: string;
  descuento: string;
  impuesto: string;
  descripcion: string;
  cantidad: number;
  total: number;
}

interface InvoiceItemsTableProps {
  items: FacturaItem[];
  onAddItem: () => void;
  onUpdateItem?: (id: number, field: string, value: any) => void;
  onRemoveItem?: (id: number) => void;
}

export function InvoiceItemsTable({ items, onAddItem }: InvoiceItemsTableProps) {
  return (
    <div>
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">Ítem</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">Referencia</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">Precio</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">Desc %</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">Impuesto</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">Descripción</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">Cantidad</th>
              <th className="px-3 py-3 text-right text-sm font-medium text-gray-700">Total</th>
              <th className="px-3 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="px-3 py-3">
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Buscar ítem facturable</option>
                  </select>
                </td>
                <td className="px-3 py-3">
                  <input 
                    type="text"
                    placeholder="Referencia"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </td>
                <td className="px-3 py-3">
                  <input 
                    type="text"
                    placeholder="Precio unit"
                    className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </td>
                <td className="px-3 py-3">
                  <input 
                    type="text"
                    placeholder="%"
                    className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </td>
                <td className="px-3 py-3">
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Impuesto</option>
                  </select>
                </td>
                <td className="px-3 py-3">
                  <input 
                    type="text"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </td>
                <td className="px-3 py-3">
                  <input 
                    type="number"
                    defaultValue="0"
                    className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </td>
                <td className="px-3 py-3 text-right text-sm font-medium">
                  $ 0
                </td>
                <td className="px-3 py-3">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button 
        onClick={onAddItem}
        className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 mb-8"
      >
        <Plus className="w-4 h-4" />
        Agregar línea
      </button>
    </div>
  );
}
