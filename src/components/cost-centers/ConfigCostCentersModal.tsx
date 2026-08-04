"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { cn } from "@/lib/utils";

interface ConfigCostCentersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  costCenters: { id: number; name: string; code: string }[];
  initialConfig?: any; // We will type this properly when backend is ready
  onSave: (config: any) => void;
  onCancel: () => void;
}

const DOCUMENT_TYPES = [
  { id: 'invoice', label: 'Factura' },
  { id: 'purchase_order', label: 'Factura de compra' },
  { id: 'receipt', label: 'Recibo de caja' },
  { id: 'expense_voucher', label: 'Comprobante de egreso' },
  { id: 'credit_note', label: 'Nota crédito' },
  { id: 'debit_note', label: 'Nota débito' },
  { id: 'income_debit_note', label: 'Nota débito en ingresos' },
];

export function ConfigCostCentersModal({
  open,
  onOpenChange,
  costCenters,
  initialConfig = [],
  onSave,
  onCancel
}: ConfigCostCentersModalProps) {

  // State holds config per document type: { [docType]: { costCenterId: string, isMandatory: boolean } }
  const [config, setConfig] = React.useState<Record<string, { costCenterId: string; isMandatory: boolean }>>({});

  React.useEffect(() => {
    if (open) {
      // Initialize with default or provided config
      const newConfig: Record<string, { costCenterId: string; isMandatory: boolean }> = {};
      const safeConfig = Array.isArray(initialConfig) ? initialConfig : (initialConfig?.settings || []);
      DOCUMENT_TYPES.forEach(doc => {
        const existing = safeConfig.find((c: any) => c.document_type === doc.id);
        newConfig[doc.id] = {
          costCenterId: existing?.default_cost_center_id?.toString() || "",
          isMandatory: existing?.is_mandatory || false
        };
      });
      setConfig(newConfig);
    }
  }, [open, initialConfig]);

  const handleUpdateConfig = (docId: string, field: 'costCenterId' | 'isMandatory', value: any) => {
    setConfig(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Transform back to array for API
    const payload = {
      settings: Object.entries(config).map(([document_type, data]) => ({
        document_type,
        default_cost_center_id: data.costCenterId ? parseInt(data.costCenterId) : null,
        is_mandatory: data.isMandatory
      }))
    };

    onSave(payload);
  };

  const selectOptions = [
    { value: "", label: "Sin asignar" },
    ...costCenters.map(cc => ({
      value: cc.id.toString(),
      label: cc.name,
      description: (cc as any).description || ""
    }))
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl sm:max-w-3xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-4 border-b border-border bg-white">
          <DialogTitle className="text-base font-bold text-foreground">Configurar los centros de costos</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <p className="text-sm text-foreground mb-6">
            Selecciona un centro de costo predefinido para tus documentos. También indica si es
            obligatorio o no tener un centro de costo para crear un documento.
          </p>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Tipo de documento</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Centro de costo preferido</th>
                  <th className="py-3 px-4 text-center font-semibold text-foreground w-32 whitespace-nowrap">¿Es obligatorio?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {DOCUMENT_TYPES.map((doc) => (
                  <tr key={doc.id} className="bg-white">
                    <td className="py-3 px-4 text-foreground">{doc.label}</td>
                    <td className="py-3 px-4">
                      <SearchableSelect
                        value={config[doc.id]?.costCenterId || ""}
                        onValueChange={(val) => handleUpdateConfig(doc.id, 'costCenterId', val)}
                        options={selectOptions}
                        placeholder="Sin asignar"
                        searchPlaceholder="Buscar centro"
                        emptyMessage="No se encontraron centros"
                        className="w-full max-w-sm border-foreground/20 shadow-none h-9"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={config[doc.id]?.isMandatory || false}
                          onCheckedChange={(checked) => handleUpdateConfig(doc.id, 'isMandatory', checked)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-end gap-2 border-t border-border bg-white">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium bg-white border border-border text-foreground rounded-md hover:bg-muted transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
