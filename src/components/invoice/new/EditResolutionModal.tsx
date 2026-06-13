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

interface EditResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  resolution: Resolution | null;
}

export function EditResolutionModal({ isOpen, onClose, resolution }: EditResolutionModalProps) {
  const { updateResolution, isUpdating } = useResolutions();
  
  const [formData, setFormData] = useState({
    prefix: "",
    from_number: 1,
    footer_text: "",
  });

  useEffect(() => {
    if (resolution) {
      setFormData({
        prefix: resolution.prefix || "",
        from_number: resolution.from_number || 1,
        footer_text: resolution.footer_text || "",
      });
    }
  }, [resolution]);

  const handleSubmit = async () => {
    if (!resolution) return;
    try {
      await updateResolution({ id: resolution.id, data: formData });
      onClose();
    } catch (error) {
      console.error("Failed to update resolution", error);
    }
  };

  // if (!resolution) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-teal-600 font-normal">Editar numeración</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <span className="text-right text-sm text-gray-500">Nombre:</span>
            <span className="text-sm font-medium">{resolution?.description || "Principal"}</span>
          </div>

          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <span className="text-right text-sm text-gray-500">Numeración automática:</span>
            <input type="checkbox" className="w-4 h-4 rounded text-teal-500" checked readOnly />
          </div>

          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <span className="text-right text-sm text-gray-500">Prefijo:</span>
            <input
              type="text"
              value={formData.prefix}
              onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
              className="w-full h-8 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <span className="text-right text-sm text-gray-500">
              Siguiente número: <span className="text-teal-600">*</span>
            </span>
            <input
              type="number"
              value={formData.from_number}
              onChange={(e) => setFormData({ ...formData, from_number: parseInt(e.target.value) || 0 })}
              className="w-full h-8 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="pt-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Pie de factura
            </label>
            <textarea
              rows={4}
              value={formData.footer_text}
              onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
              className="w-full p-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <a href="#" className="text-teal-600 text-sm hover:underline">
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
              className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
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
