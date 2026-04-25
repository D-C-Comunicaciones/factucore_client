"use client";

import * as React from "react";
import { ImagePlus, Camera, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ItemGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImagesChange: (images: string[]) => void;
  images?: string[];
}

export function ItemGalleryModal({
  open,
  onOpenChange,
  onImagesChange,
  images: propImages = []
}: ItemGalleryModalProps) {
  const [images, setImages] = React.useState<string[]>(propImages);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSave = () => {
    onImagesChange(images);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Header Custom */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-[#f8fafc]">
          <DialogTitle className="text-base font-bold text-foreground">Galería de producto</DialogTitle>
        </div>

        <div className="p-6">
          {/* Subheader info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl border border-border/40 flex items-center justify-center bg-muted/20">
                <ImagePlus className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Imágenes de producto</h3>
                <p className="text-xs text-muted-foreground">Agrega imágenes de referencia para tu producto</p>
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-all shadow-sm"
            >
              Subir imagen
            </button>
          </div>

          {/* Main Dropzone / Preview */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative aspect-[16/10] w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border/60 bg-muted/5 hover:border-primary/40 hover:bg-primary/5"
            )}
          >
            {images.length > 0 ? (
              <img
                src={images[images.length - 1]}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Camera className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                  Arrastra tus imágenes aquí o haz clic para subir
                </p>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide min-h-[80px]">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 shrink-0 border border-border/40 rounded-lg flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Plus className="w-5 h-5 text-muted-foreground" />
            </button>
            {images.map((src, idx) => (
              <div
                key={idx}
                className="w-20 h-20 shrink-0 border border-border/40 rounded-lg bg-muted/10 overflow-hidden group relative"
              >
                <img src={src} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImages(prev => prev.filter((_, i) => i !== idx));
                  }}
                  className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Plus className="w-3 h-3 rotate-45" />
                </button>
              </div>
            ))}
            {/* Fillers if empty */}
            {images.length === 0 && [1, 2, 3].map(i => (
              <div key={i} className="w-20 h-20 shrink-0 border border-border/40 rounded-lg bg-muted/5 opacity-40" />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 bg-white border border-border text-foreground text-sm font-bold rounded-xl hover:bg-muted transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
