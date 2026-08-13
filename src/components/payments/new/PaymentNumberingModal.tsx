import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface PaymentNumberingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resolutions?: any[];
  selectedResolutionId: number | null;
  setSelectedResolutionId: (id: number | null) => void;
  currentNextNumber: string;
}

export function PaymentNumberingModal({
  open,
  onOpenChange,
  resolutions,
  selectedResolutionId,
  setSelectedResolutionId,
  currentNextNumber,
}: PaymentNumberingModalProps) {
  
  const resolutionOptions = resolutions?.map((r: any) => ({
    value: r.id.toString(),
    label: r.name || r.prefix || `Resolución ${r.id}`
  })) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Cambiar numeración</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Numeración <span className="text-primary">*</span>
            </label>
            <SearchableSelect
              value={selectedResolutionId?.toString() || ""}
              onValueChange={(val) => setSelectedResolutionId(Number(val))}
              options={resolutionOptions}
              placeholder="Seleccionar"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Siguiente numero <span className="text-primary">*</span>
            </label>
            <Input 
              value={currentNextNumber}
              disabled
              className="h-9 bg-white border border-gray-300 hover:border-primary focus-visible:ring-1 focus-visible:ring-primary text-black disabled:text-black disabled:opacity-100 cursor-not-allowed font-medium"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg bg-white text-slate-800 border border-gray-300 hover:bg-gray-100 font-medium cursor-pointer">
            Cancelar
          </Button>
          <Button onClick={() => onOpenChange(false)} className="rounded-lg bg-primary hover:bg-primary/90 text-white font-medium cursor-pointer">
            Guardar cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
