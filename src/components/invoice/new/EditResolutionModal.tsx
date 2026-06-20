"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Resolution } from "@/lib/resolutions";
import { useResolutions } from "@/hooks/useResolutions";
import { showToast } from "@/components/sonner/CustomToaster";

interface EditResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  resolution: Resolution | null;
}

export function EditResolutionModal({ isOpen, onClose, resolution }: EditResolutionModalProps) {
  const { updateResolution, createResolution, isUpdating } = useResolutions();

  const [formData, setFormData] = useState({
    prefix: "",
    current_number: 1,
    resolution_text: "",
  });

  useEffect(() => {
    if (resolution) {
      setFormData({
        prefix: resolution.prefix || "",
        current_number: resolution.current_number !== undefined ? resolution.current_number : (resolution.from_number || 1),
        resolution_text: resolution.resolution_text || resolution.footer_text || "",
      });
    } else {
      setFormData({
        prefix: "",
        current_number: 1,
        resolution_text: "",
      });
    }
  }, [resolution, isOpen]);

  const handleSubmit = async () => {
    try {
      if (resolution && resolution.id > 0) {
        await updateResolution({ id: resolution.id, data: formData });
        showToast("Numeración actualizada correctamente.", "success");
      } else {
        await createResolution({
          ...formData,
          name: "Principal",
          type_resolution_id: 1,
          is_active: true,
          resolution_number: "0",
        });
        showToast("Numeración creada correctamente.", "success");
      }
      onClose();
    } catch (error: any) {
      console.error("Failed to save resolution", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Ocurrió un error al guardar la numeración.";
      showToast(message, "error");
    }
  };

  // if (!resolution) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-primary font-normal">Editar numeración</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <span className="text-right text-sm text-gray-500">Nombre:</span>
            <span className="text-sm font-medium">{resolution?.name || resolution?.description || "Principal"}</span>
          </div>

          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <span className="text-right text-sm text-gray-500">Numeración automática:</span>
            <input type="checkbox" className="w-4 h-4 rounded text-primary" checked readOnly />
          </div>

          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <span className="text-right text-sm text-gray-500">Prefijo:</span>
            <input
              type="text"
              value={formData.prefix}
              disabled
              className="w-full h-8 px-3 rounded-md border border-border bg-muted/50 text-muted-foreground text-sm cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <span className="text-right text-sm text-gray-500">
              Siguiente número: <span className="text-primary">*</span>
            </span>
            <input
              type="number"
              min={0}
              onKeyDown={(e) => { if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault(); }}
              value={formData.current_number}
              onChange={(e) => setFormData({ ...formData, current_number: parseInt(e.target.value) || 0 })}
              className="w-full h-8 px-3 rounded-md border border-border hover:border-primary bg-white text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="pt-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Pie de factura
            </label>
            <textarea
              rows={4}
              value={formData.resolution_text}
              onChange={(e) => setFormData({ ...formData, resolution_text: e.target.value })}
              className="w-full p-3 rounded-md border border-border hover:border-primary bg-white text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <a href="/resolutions" target="_blank" className="text-primary text-sm hover:underline">
            Administrar mis numeraciones
          </a>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
              disabled={isUpdating}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              disabled={isUpdating}
            >
              {isUpdating ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
