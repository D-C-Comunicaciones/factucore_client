"use client";

import * as React from "react";
import { ImagePlus, Camera, Plus, Star, MoreVertical, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface VariantGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (images: string[], favorite: string | null) => void;
  images?: string[];
  favorite?: string | null;
}

export function VariantGalleryModal({
  open,
  onOpenChange,
  onSave,
  images: propImages = [],
  favorite: propFavorite = null
}: VariantGalleryModalProps) {
  const [images, setImages] = React.useState<string[]>(propImages);
  const [favorite, setFavorite] = React.useState<string | null>(propFavorite);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Update state when modal opens
  React.useEffect(() => {
    if (open) {
      setImages(propImages || []);
      setFavorite(propFavorite || null);
    }
  }, [open, propImages, propFavorite]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setImages(prev => {
        const next = [...prev, ...newImages];
        if (!favorite && next.length > 0) setFavorite(next[0]);
        return next;
    });
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
    onSave(images, favorite);
    onOpenChange(false);
  };
  
  const [previewIndex, setPreviewIndex] = React.useState<number>(images.length > 0 ? images.length - 1 : -1);
  
  React.useEffect(() => {
      if (images.length > 0 && previewIndex === -1) {
          setPreviewIndex(images.length - 1);
      } else if (images.length === 0) {
          setPreviewIndex(-1);
      } else if (previewIndex >= images.length) {
          setPreviewIndex(images.length - 1);
      }
  }, [images.length, previewIndex]);

  const currentPreview = previewIndex >= 0 ? images[previewIndex] : null;

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
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-lg transition-all shadow-sm"
            >
              Subir imagen
            </button>
          </div>

          {/* Main Dropzone / Preview */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              "relative aspect-[16/10] w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all overflow-hidden",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border/60 bg-white hover:border-primary/40"
            )}
            onClick={(e) => {
                if (images.length === 0) {
                   fileInputRef.current?.click();
                }
            }}
          >
            {currentPreview ? (
              <>
                 <div className="absolute top-4 right-4 flex gap-2 z-10">
                     <button 
                        onClick={(e) => { e.stopPropagation(); setFavorite(currentPreview); }}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium bg-white shadow-sm transition-colors",
                            favorite === currentPreview ? "border-primary text-primary" : "border-border text-muted-foreground hover:bg-muted"
                        )}>
                        <Star className={cn("w-4 h-4", favorite === currentPreview ? "fill-primary" : "")} />
                        Favorita
                     </button>
                     <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-border rounded-md shadow-sm hover:bg-muted">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                     </button>
                 </div>
                 <img
                   src={currentPreview}
                   alt="Preview"
                   className="w-full h-full object-contain p-4"
                 />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center cursor-pointer h-full w-full group">
                <Camera className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="mt-4 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
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
                onClick={() => setPreviewIndex(idx)}
                className={cn(
                    "w-20 h-20 shrink-0 border rounded-lg bg-muted/10 overflow-hidden group relative cursor-pointer",
                    previewIndex === idx ? "border-[#123159] border-2" : "border-border/40 hover:border-primary/50"
                )}
              >
                <img src={src} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newImages = images.filter((_, i) => i !== idx);
                    setImages(newImages);
                    if (favorite === src) {
                        setFavorite(newImages.length > 0 ? newImages[0] : null);
                    }
                  }}
                  className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Plus className="w-3 h-3 rotate-45" />
                </button>
              </div>
            ))}
            {/* Fillers if empty */}
            {images.length === 0 && [1, 2, 3, 4].map(i => (
              <div key={i} className="w-20 h-20 shrink-0 border border-border/40 rounded-lg bg-muted/5 opacity-40" />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex justify-start gap-3 rounded-b-2xl">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-xl transition-all cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
