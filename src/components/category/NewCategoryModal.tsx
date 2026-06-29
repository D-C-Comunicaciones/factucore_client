"use client";

import * as React from "react";
import { AlertCircle, Loader2, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { categoriesApi } from "@/lib/categories";
import { showToast } from "@/components/sonner/CustomToaster";
import { invalidateCatalog } from "@/hooks/useCatalogs";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queryClient } from "@/lib/queryClient";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (category: { id: number; name: string; description?: string }) => void;
}

export function NewCategoryModal({ open, onOpenChange, onCreated }: CategoryModalProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [image, setImage] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setNameError(false);
      setImage(null);
      setIsDragging(false);
    }
  }, [open]);

  const baseInput =
    "bg-white px-3 text-sm border border-foreground/20 rounded-xl shadow-none text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none w-full";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImage(URL.createObjectURL(file));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setImage(URL.createObjectURL(file));
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError(true);
      showToast("El nombre de la categoría es requerido.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const response = await categoriesApi.createCategory({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      // 🔥 Invalida la caché local de categorías
      invalidateCatalog(queryClient, QUERY_KEYS.catalogs.categories());

      // Try to extract the created category from different response shapes
      const created =
        response?.data?.category ??
        response?.data?.categories?.[0] ??
        response?.data ??
        { id: Date.now(), name: name.trim(), description: description.trim() };

      const normalized = {
        id: created?.id ?? Date.now(),
        name: created?.name ?? name.trim(),
        description: created?.description ?? description.trim(),
      };

      onCreated(normalized);
      showToast(`La categoría "${normalized.name}" fue creada exitosamente.`, "success");
      onOpenChange(false);
    } catch {
      showToast("Ocurrió un error al crear la categoría. Intenta de nuevo.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isSaving) onOpenChange(v); }}>
      <DialogContent
        className="max-w-[520px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => { if (isSaving) e.preventDefault(); }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/40 bg-white">
          <DialogTitle className="text-base font-bold text-[#123159]">
            Nueva categoría
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-5 flex gap-5">
          {/* Left: fields */}
          <div className="flex-1 space-y-4">
            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#123159]">
                Nombre <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <input
                  id="category-name-input"
                  type="text"
                  autoComplete="off"
                  className={`${baseInput} h-[36px] ${nameError
                    ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/10"
                    : ""
                    }`}
                  value={name}
                  placeholder="Ej: Electrónica"
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setNameError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                  }}
                />
                {nameError && (
                  <AlertCircle className="w-4 h-4 text-[#ef4444] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>
              {nameError && (
                <p className="text-[11px] text-[#ef4444] font-medium">
                  El nombre es requerido.
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#123159]">
                Descripción
              </label>
              <textarea
                id="category-description-input"
                rows={4}
                className={`${baseInput} py-2 resize-none`}
                value={description}
                placeholder="Descripción opcional de la categoría"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Right: image placeholder */}
          <div className="w-[140px] shrink-0 flex flex-col">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div
              className={`w-full flex-1 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground select-none cursor-pointer overflow-hidden relative transition-colors ${isDragging
                ? "border-primary bg-primary/5"
                : "border-border/50 bg-[#f8fafc] hover:bg-muted/50"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
              ) : (
                <>
                  <Tag className="w-8 h-8 text-border" strokeWidth={1.5} />
                  <span className="text-[11px] text-center leading-tight px-2">
                    Imagen de la categoría
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
            className="px-5 py-2 hover:bg-muted text-primary text-sm font-bold rounded-xl transition-all cursor-pointer border border-transparent disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            id="category-save-btn"
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="px-8 py-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
