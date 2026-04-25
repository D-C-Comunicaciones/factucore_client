"use client";

import * as React from "react";
import { Plus, MoreVertical, Package, Pencil, Trash2 } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { WarehouseModal, WarehouseData } from "./WarehouseModal";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WarehouseEntry extends WarehouseData {
  id: string;
}

export function AdvancedOptionsSection() {
  const [priceList, setPriceList] = React.useState("");
  const [priceValue, setPriceValue] = React.useState("");

  const [warehouses, setWarehouses] = React.useState<WarehouseEntry[]>([
    { id: "1", warehouse: "Principal", initialQty: "", minQty: "", maxQty: "" }
  ]);
  const [editingWarehouseId, setEditingWarehouseId] = React.useState<string | null>(null);
  const [isNewWarehouse, setIsNewWarehouse] = React.useState(false);

  const activeWarehouse = warehouses.find(w => w.id === editingWarehouseId);

  const handleAddWarehouse = () => {
    const newId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const newEntry: WarehouseEntry = { id: newId, warehouse: "", initialQty: "", minQty: "", maxQty: "" };
    setWarehouses(prev => [...prev, newEntry]);
    setEditingWarehouseId(newId);
    setIsNewWarehouse(true);
  };

  const handleEditWarehouse = (id: string) => {
    setEditingWarehouseId(id);
    setIsNewWarehouse(false);
  };

  const handleSaveWarehouse = (data: WarehouseData) => {
    if (editingWarehouseId) {
      setWarehouses(prev => prev.map(w =>
        w.id === editingWarehouseId ? { ...w, ...data } : w
      ));
    }
    setEditingWarehouseId(null);
    setIsNewWarehouse(false);
  };

  const [deletingWarehouseId, setDeletingWarehouseId] = React.useState<string | null>(null);

  const handleDeleteWarehouse = (id: string) => {
    if (warehouses.length <= 1) return;
    setDeletingWarehouseId(id);
    setTimeout(() => {
      setWarehouses(prev => prev.filter(w => w.id !== id));
      setDeletingWarehouseId(null);
    }, 300);
  };

  const handleCloseModal = (open: boolean) => {
    if (!open) {
      if (editingWarehouseId && isNewWarehouse) {
        const idToDelete = editingWarehouseId;
        setDeletingWarehouseId(idToDelete);
        setTimeout(() => {
          setWarehouses(prev => prev.filter(w => w.id !== idToDelete));
          setDeletingWarehouseId(null);
        }, 300);
      }
      setEditingWarehouseId(null);
      setIsNewWarehouse(false);
    }
  };

  return (
    <SectionCard title="Opciones avanzadas" defaultOpen={true}>
      {/* Detalle de inventario */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-1">Detalle de inventario</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Distribuye y controla las cantidades de tus productos en diferentes lugares.{" "}
          <span className="text-primary font-bold transition-colors px-1 link-hover">Ver más.</span>
        </p>

        <div className="space-y-2">
          {warehouses.map((w) => (
            <div
              key={w.id}
              onClick={() => handleEditWarehouse(w.id)}
              className={cn(
                "flex items-center gap-5 border-none rounded-xl px-5 py-4 transition-all group cursor-pointer",
                deletingWarehouseId === w.id
                  ? "animate-out fade-out slide-out-to-top-2 duration-300 fill-mode-forwards"
                  : "animate-in fade-in slide-in-from-top-2 duration-300"
              )}
            >
              <div className="w-20 h-20 rounded-sm border border-border flex items-center justify-center bg-white shrink-0">
                <Package className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium text-[#123159] mb-0.5">
                  {w.warehouse || "Nueva bodega"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(() => {
                    const parts = [];
                    if (w.initialQty) parts.push(`${w.initialQty} cantidad`);
                    else if (parts.length === 0 && (w.minQty || w.maxQty)) parts.push("0 cantidad");

                    if (w.minQty) parts.push(`${w.minQty} min`);
                    if (w.maxQty) parts.push(`${w.maxQty} max`);

                    return parts.length > 0 ? parts.join(" - ") : "Agrega aquí la cantidad inicial de tu producto";
                  })()}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="w-10 h-10 flex items-center justify-center rounded-xl border border-transparent hover:border-border/60 hover:bg-muted transition-colors">
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-border rounded-xl shadow-xl min-w-[100px]">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditWarehouse(w.id);
                    }}
                    className="flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-muted focus:bg-muted rounded-lg"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Editar</span>
                  </DropdownMenuItem>
                  {warehouses.length > 1 && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWarehouse(w.id);
                      }}
                      className="flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-muted focus:bg-muted rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium">Eliminar</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>

        <WarehouseModal
          open={editingWarehouseId !== null}
          onOpenChange={handleCloseModal}
          initialData={activeWarehouse}
          onSave={handleSaveWarehouse}
          existingWarehouses={warehouses.map(w => w.warehouse).filter(w => w && w !== activeWarehouse?.warehouse)}
        />

        <button
          type="button"
          onClick={handleAddWarehouse}
          className="flex items-center gap-1 text-sm font-bold text-primary px-4 py-2 rounded-lg bg-background transition-all cursor-pointer mt-2"
        >
          <Plus className="w-4 h-4" />
          Agregar bodega
        </button>
      </div>

      {/* Listas de precios */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Listas de precios</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Lista de precios</label>
            <select value={priceList} onChange={(e) => setPriceList(e.target.value)}
              className="w-full h-8 px-3 border border-foreground/20 rounded-md text-sm bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors text-muted-foreground">
              <option value=""></option>
              <option value="general">General</option>
              <option value="especial">Especial</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Valor</label>
            <input type="text" value={priceValue} onChange={(e) => setPriceValue(e.target.value)}
              className="w-full h-8 px-3 border border-foreground/20 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors" />
          </div>
          <button type="button" className="mt-5 w-8 h-8 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <button type="button" className="flex items-center gap-1 text-sm font-bold text-primary px-4 py-2 rounded-lg bg-background transition-all cursor-pointer mt-4">
          <Plus className="w-4 h-4" />
          Agregar lista de precio
        </button>
      </div>
    </SectionCard>
  );
}
