"use client";

import * as React from "react";
import { ImagePlus, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ItemGalleryModal } from "./ItemGalleryModal";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

import { ImageUploader } from "./ImageUploader";
import { cn } from "@/lib/utils";

interface ItemSidebarProps {
  name: string;
  totalPrice: number;
  images: string[];
  onImagesChange: (images: string[]) => void;
  onSave: () => void;
  onSaveAndCreate: () => void;
  hasVariants?: boolean;
  isSubmitting?: boolean;
}

export function ItemSidebar({
  name,
  totalPrice,
  images,
  onImagesChange,
  onSave,
  onSaveAndCreate,
  hasVariants = false,
  isSubmitting = false,
}: ItemSidebarProps) {
  const router = useRouter();
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [inventariable, setInventariable] = React.useState(true);
  const [ventaNegativo, setVentaNegativo] = React.useState(false);

  React.useEffect(() => {
    if (hasVariants) {
      setInventariable(true);
    }
  }, [hasVariants]);

  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName = name.trim() || "Producto sin nombre";
  const displayPrice = totalPrice > 0
    ? `$ ${totalPrice.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : "$ 0";

  return (
    <div className="w-[420px] shrink-0 sticky top-20 h-fit">
      <div className="flex flex-col h-full">
        {/* Inner wrapper handles visual clipping — overflow-hidden MUST NOT be on the sticky element */}
        <div className="flex flex-col bg-white border border-border/40 shadow-sm rounded-xl overflow-hidden">

          {/* SECTION 1: Image Upload - minimiza en scroll con transición suave */}
          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: scrolled ? "0px" : "300px", opacity: scrolled ? 0 : 1 }}
          >
            {scrolled ? (
              <div className="flex items-center justify-center h-12 bg-muted-foreground/10">
                <svg className="w-6 h-6 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
              </div>
            ) : (
              <ImageUploader
                images={images}
                onClick={() => setIsGalleryOpen(true)}
              />
            )}
          </div>

          {/* SECTION 2: Name & Price Preview */}
          <div className="px-6 py-6 bg-white">
            <p className="text-xl font-bold text-muted-foreground/60 truncate mb-1.5">{displayName}</p>
            <p className="text-4xl font-bold text-muted-foreground/60">{displayPrice}</p>
          </div>

          <div className="h-px bg-border/40 mx-4" />

          {/* SECTION 3: Toggles */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-semibold flex items-center gap-1",
                  hasVariants ? "text-muted-foreground/40" : "text-foreground"
                )}>
                  Inventariable
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className={cn(
                          "w-3.5 h-3.5 cursor-help",
                          hasVariants ? "text-primary/40" : "text-primary"
                        )} />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-[240px]">
                        Esta condición es irreversible, solo la podrás editar en productos 'no inventariables' que no hayas asociado en documentos o transacciones.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </p>
                <p className={cn(
                  "text-[11px] leading-tight mt-1 max-w-[180px]",
                  hasVariants ? "text-muted-foreground/30" : "text-muted-foreground"
                )}>
                  Mantén activada esta opción para llevar el control de costos y cantidades
                </p>
              </div>
              <button
                type="button"
                disabled={hasVariants}
                onClick={() => setInventariable((v) => !v)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none p-[2px] items-center",
                  inventariable ? "bg-primary" : "bg-muted-foreground/20",
                  hasVariants && "opacity-40"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300",
                    inventariable ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Venta en negativo</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-1">Vende sin unidades disponibles</p>
              </div>
              <button
                type="button"
                onClick={() => setVentaNegativo((v) => !v)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none p-[2px] items-center",
                  ventaNegativo ? "bg-primary" : "bg-muted-foreground/20"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300",
                    ventaNegativo ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>

          {/* SECTION 4: Buttons */}
          <div className="px-6 py-5 space-y-3 bg-white border-t border-border/40 mt-auto">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/items")}
                className="flex-1 py-2 bg-white text-sm font-bold rounded-xl border border-border text-foreground hover:bg-muted transition-all cursor-pointer active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onSave}
                className="flex-1 py-2 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 active:scale-95"
              >
                Guardar
              </button>
            </div>
            <button
              type="button"
              onClick={onSaveAndCreate}
              className="w-full py-2 text-sm font-bold rounded-xl border border-border text-foreground hover:bg-muted transition-all active:scale-95"
            >
              Guardar y crear otro
            </button>
          </div>

        </div>
      </div>

      <ItemGalleryModal
        open={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
        images={images}
        onImagesChange={onImagesChange}
      />
    </div>
  );
}