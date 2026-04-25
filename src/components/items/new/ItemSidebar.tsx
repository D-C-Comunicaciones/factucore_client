"use client";

import * as React from "react";
import { ImagePlus, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ItemGalleryModal } from "./ItemGalleryModal";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

import { ImageUploader } from "./ImageUploader";

interface ItemSidebarProps {
  name: string;
  totalPrice: number;
  images: string[];
  onImagesChange: (images: string[]) => void;
  onSave: () => void;
  onSaveAndCreate: () => void;
}

export function ItemSidebar({
  name,
  totalPrice,
  images,
  onImagesChange,
  onSave,
  onSaveAndCreate
}: ItemSidebarProps) {
  const router = useRouter();
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [inventariable, setInventariable] = React.useState(true);
  const [ventaNegativo, setVentaNegativo] = React.useState(false);

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
    <div className="w-[300px] shrink-0 relative">
      <div className="sticky top-[72px] z-20 flex flex-col transition-all duration-300">

        {/* SECTION 1: Image Upload (Hides on scroll) */}
        <div 
          className={`grid transition-all duration-500 ease-in-out ${
            scrolled ? "grid-rows-[0fr] opacity-0 pointer-events-none" : "grid-rows-[1fr] opacity-100"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <ImageUploader
              images={images}
              onClick={() => setIsGalleryOpen(true)}
            />
          </div>
        </div>

        {/* CONTENEDOR CON BORDE (Sólo para el contenido de abajo) */}
        <div className="bg-white border-x border-b border-border/40 shadow-sm  flex flex-col">
          {/* SECTION 2: Name & Price Preview */}
          <div className="px-6 py-5 bg-white">
            <p className="text-base font-bold text-muted-foreground/60 truncate mb-1">{displayName}</p>
            <p className="text-2xl font-bold text-muted-foreground/60">{displayPrice}</p>
          </div>

          <div className="h-px bg-border/40 mx-4" />

          {/* SECTION 3: Toggles */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                  Inventariable
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-[240px]">
                        Esta condición es irreversible, solo la podrás editar en productos 'no inventariables' que no hayas asociado en documentos o transacciones.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-1 max-w-[180px]">
                  Mantén activada esta opción para llevar el control de costos y cantidades
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInventariable((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent
                  transition-colors duration-300 focus:outline-none
                  ${inventariable ? "bg-primary" : "bg-muted-foreground/20"}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md
                    transform transition-transform duration-300
                    ${inventariable ? "translate-x-5" : "translate-x-0"}`}
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
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent
                  transition-colors duration-300 focus:outline-none
                  ${ventaNegativo ? "bg-primary" : "bg-muted-foreground/20"}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md
                    transform transition-transform duration-300
                    ${ventaNegativo ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>

          {/* SECTION 4: Buttons */}
          <div className="px-6 py-5 space-y-3 bg-white border-t border-border/40">
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
