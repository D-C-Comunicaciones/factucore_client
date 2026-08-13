"use client";

import * as React from "react";

import {
  ImagePlus,
  HelpCircle,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { ItemGalleryModal } from "./ItemGalleryModal";
import { ImageUploader } from "./ImageUploader";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { ItemImage } from "@/common/interfaces/images";


interface ItemSidebarProps {
  name: string;
  totalPrice: number;
  images: ItemImage[];
  onImagesChange: (
    images: ItemImage[]
  ) => void;
  onSave: () => void;
  onSaveAndCreate: () => void;
  hasVariants?: boolean;
  isSubmitting?: boolean;
  itemType?: "producto" | "servicio" | "combo";
  inventariable?: boolean;
  onInventariableChange?: (val: boolean | ((prev: boolean) => boolean)) => void;
  ventaNegativo?: boolean;
  onVentaNegativoChange?: (val: boolean | ((prev: boolean) => boolean)) => void;
  hideSaveAndCreate?: boolean;
  onCancel?: () => void;
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
  itemType = "producto",
  inventariable = true,
  onInventariableChange,
  ventaNegativo = false,
  onVentaNegativoChange,
  hideSaveAndCreate = false,
  onCancel,
}: ItemSidebarProps) {
  const router = useRouter();

  const [isGalleryOpen, setIsGalleryOpen] =
    React.useState(false);

  const [scrolled, setScrolled] =
    React.useState(false);

  /* ====================================================================== */
  /* EFFECTS                                                                */
  /* ====================================================================== */

  React.useEffect(() => {
    if (hasVariants && onInventariableChange) {
      onInventariableChange(true);
    }
  }, [hasVariants, onInventariableChange]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  /* ====================================================================== */
  /* DERIVED                                                                */
  /* ====================================================================== */

  const displayName =
    name.trim() ||
    (itemType === "servicio"
      ? "Servicio sin nombre"
      : itemType === "combo"
        ? "Combo sin nombre"
        : "Producto sin nombre");

  const displayPrice =
    totalPrice > 0
      ? `$ ${totalPrice.toLocaleString(
        "es-CO",
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }
      )}`
      : "$ 0";

  const thumbnail =
    images.length > 0
      ? images[0]?.url
      : null;

  /* ====================================================================== */
  /* RENDER                                                                 */
  /* ====================================================================== */

  return (
    <div className="w-[420px] shrink-0 sticky top-20 h-fit">
      <div className="flex flex-col h-full">
        <div className="flex flex-col bg-white border border-border/40 shadow-sm rounded-xl overflow-hidden">

          {/* =============================================================== */}
          {/* IMAGE UPLOADER                                                  */}
          {/* =============================================================== */}

          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              maxHeight: scrolled
                ? "0px"
                : "300px",

              opacity: scrolled ? 0 : 1,
            }}
          >
            <ImageUploader
              images={images}
              onClick={() =>
                setIsGalleryOpen(true)
              }
            />
          </div>

          {/* =============================================================== */}
          {/* HEADER                                                          */}
          {/* =============================================================== */}

          {scrolled ? (
            <div className="flex items-center gap-3 px-5 py-3 bg-white">
              <div
                className="w-11 h-11 shrink-0 rounded-lg border border-border/40 bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() =>
                  setIsGalleryOpen(true)
                }
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlus className="w-5 h-5 text-muted-foreground/50" />
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-muted-foreground/60 truncate">
                  {displayName}
                </p>

                <p className="text-base font-bold text-muted-foreground/60">
                  {displayPrice}
                </p>
              </div>
            </div>
          ) : (
            <div className="px-6 py-6 bg-white">
              <p className="text-xl font-bold text-muted-foreground/60 truncate mb-1.5">
                {displayName}
              </p>

              <p className="text-4xl font-bold text-muted-foreground/60">
                {displayPrice}
              </p>
            </div>
          )}

          {/* =============================================================== */}
          {/* PRODUCT OPTIONS                                                 */}
          {/* =============================================================== */}

          {itemType === "producto" && (
            <>
              <div className="h-px bg-border/40 mx-4" />

              <div className="px-6 py-5 space-y-4">

                {/* INVENTARIABLE */}

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p
                      className={cn(
                        "text-sm font-semibold flex items-center gap-1",
                        hasVariants
                          ? "text-muted-foreground/40"
                          : "text-foreground"
                      )}
                    >
                      Inventariable

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle
                              className={cn(
                                "w-3.5 h-3.5 cursor-help",
                                hasVariants
                                  ? "text-primary/40"
                                  : "text-primary"
                              )}
                            />
                          </TooltipTrigger>

                          <TooltipContent
                            side="top"
                            className="bg-[#1e293b] text-white max-w-[240px]"
                          >
                            Esta condición es irreversible,
                            solo la podrás editar en
                            productos no inventariables
                            que no hayan sido asociados
                            en transacciones.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </p>

                    <p
                      className={cn(
                        "text-[11px] leading-tight mt-1 max-w-[180px]",
                        hasVariants
                          ? "text-muted-foreground/30"
                          : "text-muted-foreground"
                      )}
                    >
                      Mantén activada esta opción
                      para llevar control de costos
                      y cantidades.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={hasVariants}
                    onClick={() =>
                      onInventariableChange?.(
                        (v: boolean) => !v
                      )
                    }
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none p-[2px] items-center",
                      inventariable
                        ? "bg-primary"
                        : "bg-muted-foreground/20",

                      hasVariants &&
                      "opacity-40"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300",
                        inventariable
                          ? "translate-x-4"
                          : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {/* NEGATIVE STOCK */}

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Venta en negativo
                    </p>

                    <p className="text-[11px] text-muted-foreground leading-tight mt-1">
                      Permite vender sin
                      unidades disponibles.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onVentaNegativoChange?.(
                        (v: boolean) => !v
                      )
                    }
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none p-[2px] items-center",
                      ventaNegativo
                        ? "bg-primary"
                        : "bg-muted-foreground/20"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300",
                        ventaNegativo
                          ? "translate-x-4"
                          : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* =============================================================== */}
          {/* ACTIONS                                                         */}
          {/* =============================================================== */}

          <div className="px-6 py-5 space-y-3 bg-white border-t border-border/40 mt-auto">
            <div className="flex gap-3">

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  onCancel ? onCancel() : router.push("/items")
                }
                className="flex-1 py-2 bg-white text-sm font-bold rounded-xl border border-border text-foreground hover:bg-muted transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={onSave}
                className="flex-1 py-2 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting
                  ? "Guardando..."
                  : "Guardar"}
              </button>
            </div>

            {!hideSaveAndCreate && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onSaveAndCreate}
                className="w-full py-2 text-sm font-bold rounded-xl border border-border text-foreground hover:bg-muted transition-all active:scale-95 disabled:opacity-50"
              >
                Guardar y crear otro
              </button>
            )}
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