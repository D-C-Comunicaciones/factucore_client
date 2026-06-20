"use client";

import * as React from "react";
import { HelpCircle, ImagePlus } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ItemConfigurationSection({
  itemType,
  hasVariants,
  inventariable,
  onInventariableChange,
  ventaNegativo,
  onVentaNegativoChange,
  images,
  onImagesClick,
  name,
  totalPrice,
}: {
  itemType: "producto" | "servicio" | "combo";
  hasVariants: boolean;
  inventariable: boolean;
  onInventariableChange: (val: boolean | ((prev: boolean) => boolean)) => void;
  ventaNegativo: boolean;
  onVentaNegativoChange: (val: boolean | ((prev: boolean) => boolean)) => void;
  images: any[];
  onImagesClick: () => void;
  name: string;
  totalPrice: number;
}) {
  const displayName =
    name.trim() ||
    (itemType === "servicio"
      ? "Servicio sin nombre"
      : itemType === "combo"
      ? "Combo sin nombre"
      : "Producto sin nombre");

  const displayPrice =
    totalPrice > 0
      ? `$ ${totalPrice.toLocaleString("es-CO", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`
      : "$ 0";

  const thumbnail = images.length > 0 ? images[0]?.url : null;

  return (
    <SectionCard title="Configuración" defaultOpen={true}>
      <div className="space-y-4">
        {/* COMPACT IMAGE DISPLAY */}
        <div className="flex items-center gap-3 bg-white">
          <div
            className="w-11 h-11 shrink-0 rounded-lg border border-border/40 bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={onImagesClick}
          >
            {thumbnail ? (
              <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
            ) : (
              <ImagePlus className="w-5 h-5 text-muted-foreground/50" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-muted-foreground/60 truncate">{displayName}</p>
            <p className="text-base font-bold text-muted-foreground/60">{displayPrice}</p>
          </div>
        </div>

        {itemType === "producto" && (
          <>
            <div className="h-px bg-border/40" />

            {/* INVENTARIABLE */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold flex items-center gap-1",
                    hasVariants ? "text-muted-foreground/40" : "text-[#123159]"
                  )}
                >
                  Inventariable
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle
                          className={cn(
                            "w-3.5 h-3.5 cursor-help",
                            hasVariants ? "text-[#38bdf8]/40" : "text-[#38bdf8]"
                          )}
                        />
                      </TooltipTrigger>

                      <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-[240px]">
                        Esta condición es irreversible, solo la podrás editar en productos no inventariables que no hayan sido asociados en transacciones.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </p>

                <p
                  className={cn(
                    "text-[11px] leading-tight mt-1 max-w-[280px]",
                    hasVariants ? "text-muted-foreground/30" : "text-muted-foreground"
                  )}
                >
                  Mantén activada esta opción para llevar control de costos y cantidades.
                </p>
              </div>

              <button
                type="button"
                disabled={hasVariants}
                onClick={() => onInventariableChange((v: boolean) => !v)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none p-[2px] items-center",
                  inventariable ? "bg-[#2563eb]" : "bg-muted-foreground/20",
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

            {/* NEGATIVE STOCK */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#123159]">Venta en negativo</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-1">
                  Permite vender sin unidades disponibles.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onVentaNegativoChange((v: boolean) => !v)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none p-[2px] items-center",
                  ventaNegativo ? "bg-[#2563eb]" : "bg-muted-foreground/20"
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
          </>
        )}
      </div>
    </SectionCard>
  );
}
