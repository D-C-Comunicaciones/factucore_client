import React from "react";
import { Plus, X } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Input } from "@/components/ui/input";

interface OtherIncomeTableProps {
  formState: any;
  setFormState: React.Dispatch<React.SetStateAction<any>>;
}

export function OtherIncomeTable({ formState, setFormState }: OtherIncomeTableProps) {
  const addIncomeLine = () => {
    setFormState((prev: any) => ({
      ...prev,
      other_incomes: [...(prev.other_incomes || []), { id: Date.now(), concept: "", qty: 1, value: 0, tax: "", total: 0 }]
    }));
  };

  const removeIncomeLine = (id: number) => {
    setFormState((prev: any) => ({
      ...prev,
      other_incomes: prev.other_incomes.filter((item: any) => item.id !== id)
    }));
  };

  const lines = formState.other_incomes || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-foreground mb-1">Cuentas contables</h3>
        <p className="text-sm text-muted-foreground mb-4">Selecciona las cuentas contables que están relacionadas con este ingreso</p>

        <div className="bg-muted/30 rounded-lg overflow-hidden border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground w-[35%]">Concepto</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-[15%]">Cantidad</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-[20%]">Valor</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-[20%]">Impuesto</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-[10%] text-right">Total</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line: any) => (
                <tr key={line.id} className="border-b border-border/50">
                  <td className="p-2">
                    <SearchableSelect
                      value={line.concept}
                      onValueChange={() => {}}
                      options={[]}
                      placeholder="Seleccionar"
                    />
                  </td>
                  <td className="p-2">
                    <Input type="number" defaultValue={line.qty} className="h-9" />
                  </td>
                  <td className="p-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input type="text" defaultValue={line.value} className="h-9 pl-7" />
                    </div>
                  </td>
                  <td className="p-2">
                    <SearchableSelect
                      value={line.tax}
                      onValueChange={() => {}}
                      options={[]}
                      placeholder="Seleccionar"
                    />
                  </td>
                  <td className="p-2 text-right font-medium">
                    $ 0
                  </td>
                  <td className="p-2 text-center">
                    <button 
                      onClick={() => removeIncomeLine(line.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {lines.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground text-sm">
                    No hay cuentas contables agregadas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="p-3 bg-white border-t border-border">
            <button
              type="button"
              onClick={addIncomeLine}
              className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Agregar línea
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-4">Retenciones</h3>
        <button
          type="button"
          className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar retención
        </button>
      </div>
    </div>
  );
}
