"use client";

import * as React from "react";
import { Plus, MoreVertical, Package, Pencil, Trash2, Check, Camera, Lightbulb, AlertCircle, LightbulbOff } from "lucide-react";
import { VariantEditModal } from "@/components/variant/VariantEditModal";
import { VariantGalleryModal } from "@/components/items/new/VariantGalleryModal";
import { showToast } from "@/components/sonner/CustomToaster";
import { SectionCard } from "./SectionCard";
import { ProductComboModal, ComboProductData } from "./ProductComboModal";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AttributeModal } from "@/components/attribute/AttributeModal";
import { WarehouseData, WarehouseModal } from "@/components/warehouse/WarehouseModal";
import { PriceListModal } from "./PriceListModal";

interface WarehouseEntry extends WarehouseData {
  id: string;
}

interface ComboProductEntry extends ComboProductData {
  id: string;
}

interface PriceListEntry {
  id: string;
  list: string;
  value: string;
}

export function AdvancedOptionsSection({
  itemType,
  hasVariants,
  variants,
  onVariantsChange,
  comboSettings,
  onComboSettingsChange,
  catalogs
}: {
  itemType: "producto" | "servicio" | "combo",
  hasVariants: boolean,
  variants: any[],
  onVariantsChange: React.Dispatch<React.SetStateAction<any[]>>,
  comboSettings: any,
  onComboSettingsChange: React.Dispatch<React.SetStateAction<any>>,
  catalogs: any
}) {
  // --- Compatibility Aliases for Integration ---
  const setVariants = onVariantsChange;
  const comboProducts: any[] = comboSettings?.components || [];
  const setComboProducts = (update: any) => {
    onComboSettingsChange((prev: any) => {
      const nextComponents = typeof update === "function" ? update(prev.components || []) : update;
      return { ...prev, components: nextComponents };
    });
  };
  // ----------------------------------------------

  const baseInput = "bg-white h-[34px] pl-3 pr-3 text-sm border border-foreground/20 shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none flex items-center w-full rounded-xl box-border";
  const selectItemClass = "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary";

  const [priceLists, setPriceLists] = React.useState<PriceListEntry[]>([
    { id: "1", list: "", value: "" }
  ]);
  const [deletingPriceListId, setDeletingPriceListId] = React.useState<string | null>(null);
  const [isPriceListModalOpen, setIsPriceListModalOpen] = React.useState(false);
  const [customPriceLists, setCustomPriceLists] = React.useState<{ name: string; description: string; type: string }[]>([]);

  const [warehouses, setWarehouses] = React.useState<WarehouseEntry[]>([
    { id: "1", warehouse: "Principal", initialQty: "", minQty: "", maxQty: "" }
  ]);
  const [editingWarehouseId, setEditingWarehouseId] = React.useState<string | null>(null);
  const [isNewWarehouse, setIsNewWarehouse] = React.useState(false);

  // El estado de comboProducts se maneja desde comboSettings en las props
  const [editingComboId, setEditingComboId] = React.useState<string | null>(null);
  const [deletingComboId, setDeletingComboId] = React.useState<string | null>(null);
  const [isNewComboProduct, setIsNewComboProduct] = React.useState(false);

  // Attribute Modal state
  const [isAttributeModalOpen, setIsAttributeModalOpen] = React.useState(false);

  // Variants UI state (attributes, errors, modals)
  const [attributes, setAttributes] = React.useState<{ id: string, name: string, values: string[], selectedValues: string[] }[]>([
    { id: "initial-1", name: "", values: [], selectedValues: [] }
  ]);
  
  const [availableAttributes, setAvailableAttributes] = React.useState<{ name: string, values: string[] }[]>([
    { name: "Color", values: ["Rojo", "Azul", "Negro", "Blanco"] },
    { name: "Talla", values: ["S", "M", "L", "XL"] },
  ]);

  const [isVariantEditModalOpen, setIsVariantEditModalOpen] = React.useState(false);
  const [editingVariantId, setEditingVariantId] = React.useState<string | null>(null);
  const [variantErrors, setVariantErrors] = React.useState<{ attributes: boolean[], general: boolean }>({
    attributes: [false],
    general: false
  });
  const [editingAttributeId, setEditingAttributeId] = React.useState<string | null>("initial-1");
  const [galleryOpenForVariant, setGalleryOpenForVariant] = React.useState<string | null>(null);

  const handleToggleValue = (attrId: string, value: string) => {
    setAttributes(prev => prev.map(attr => {
      if (attr.id === attrId) {
        const isSelected = attr.selectedValues.includes(value);
        const newSelected = isSelected
          ? attr.selectedValues.filter(v => v !== value)
          : [...attr.selectedValues, value];

        // If value was removed, remove variants with that name
        if (isSelected) {
          onVariantsChange(variants.filter(v => v.name !== value));
        }

        return { ...attr, selectedValues: newSelected };
      }
      return attr;
    }));
  };

  const handleUpdateAttributeName = (id: string, name: string) => {
    setAttributes(prev => prev.map(a => a.id === id ? { ...a, name } : a));
    // Clear error for this index
    setVariantErrors(prev => {
      const idx = attributes.findIndex(a => a.id === id);
      if (idx === -1) return prev;
      const newAttrErrors = [...prev.attributes];
      newAttrErrors[idx] = false;
      return { ...prev, attributes: newAttrErrors };
    });
  };

  const handleGenerateVariants = () => {
    // 1. Get all attributes with selected values
    const activeAttrs = attributes.filter(a => a.selectedValues.length > 0);

    if (activeAttrs.length === 0) {
      setVariants([]);
      setEditingAttributeId(null);
      return;
    }

    // 2. Generate Cartesian Product of selected values
    let combinations: string[][] = [[]];
    for (const attr of activeAttrs) {
      const nextCombinations: string[][] = [];
      for (const comb of combinations) {
        for (const val of attr.selectedValues) {
          nextCombinations.push([...comb, val]);
        }
      }
      combinations = nextCombinations;
    }

    const newVariantNames = combinations.map(c => c.join(" - "));

    // 3. Update variants state, preserving data for existing ones
    const updatedVariants = newVariantNames.map(name => {
      const existing = variants.find(v => v.name === name);
      if (existing) return existing;

      return {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        warehouse: "",
        initialQty: "-",
        active: true,
        inventory: [],
        images: [],
        favoriteImage: null
      };
    });

    onVariantsChange(updatedVariants);

    setEditingAttributeId(null);
  };

  const handleDeleteAttribute = (id: string) => {
    const updatedAttributes = attributes.filter(a => a.id !== id);
    setAttributes(updatedAttributes);

    // Recalculate variants based on remaining attributes
    const activeAttrs = updatedAttributes.filter(a => a.selectedValues.length > 0);
    if (activeAttrs.length === 0) {
      setVariants([]);
    } else {
      // Re-trigger the logic (we can't call handleGenerateVariants directly easily here with updated state)
      // So I'll duplicate the logic or use useEffect (but user wants direct actions)
      // I'll just use a local recalculation
      let combinations: string[][] = [[]];
      for (const attr of activeAttrs) {
        const nextCombinations: string[][] = [];
        for (const comb of combinations) {
          for (const val of attr.selectedValues) {
            nextCombinations.push([...comb, val]);
          }
        }
        combinations = nextCombinations;
      }
      const newNames = combinations.map(c => c.join(" - "));
      setVariants((prev: any[]) => newNames.map((name: string) => prev.find((v: any) => v.name === name) || {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        warehouse: "",
        initialQty: "-",
        active: true,
        inventory: [],
        images: [],
        favoriteImage: null
      }));
    }
  };

  const handleToggleVariantActive = (id: string) => {
    setVariants((prev: any[]) => prev.map((v: any) => v.id === id ? { ...v, active: !v.active } : v));
  };

  const handleDeleteVariant = (id: string) => {
    setVariants((prev: any[]) => prev.filter((v: any) => v.id !== id));
  };

  const handleEditVariant = (id: string) => {
    setEditingVariantId(id);
    setIsVariantEditModalOpen(true);
  };

  const handleSaveVariantData = (data: { active: boolean; inventory: any[] }) => {
    if (editingVariantId) {
      setVariants((prev: any[]) => prev.map((v: any) =>
        v.id === editingVariantId
          ? { ...v, active: data.active, inventory: data.inventory, initialQty: data.inventory[0]?.initialQty || "-" }
          : v
      ));
    }
    setIsVariantEditModalOpen(false);
    setEditingVariantId(null);
  };

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
          setWarehouses((prev: WarehouseEntry[]) => prev.filter(w => w.id !== idToDelete));
          setDeletingWarehouseId(null);
        }, 300);
      }
      setEditingWarehouseId(null);
      setIsNewWarehouse(false);
    }
  };

  const handleAddComboProduct = () => {
    const newId = Date.now().toString();
    setComboProducts((prev: any[]) => [...prev, { id: newId, product: "", quantity: "", unit: "", cost: "" }]);
    setEditingComboId(newId);
    setIsNewComboProduct(true);
  };

  const handleCloseComboModal = (open: boolean) => {
    if (!open) {
      if (editingComboId && isNewComboProduct) {
        const idToDelete = editingComboId;
        setDeletingComboId(idToDelete);
        setTimeout(() => {
          setComboProducts((prev: any[]) => prev.filter(p => p.id !== idToDelete));
          setDeletingComboId(null);
        }, 300);
      }
      setEditingComboId(null);
      setIsNewComboProduct(false);
    }
  };

  const handleAddPriceList = () => {
    const newId = Date.now().toString();
    setPriceLists((prev: PriceListEntry[]) => [...prev, { id: newId, list: "", value: "" }]);
  };

  const handleDeletePriceList = (id: string) => {
    if (priceLists.length <= 1) return;
    setDeletingPriceListId(id);
    setTimeout(() => {
      setPriceLists((prev: PriceListEntry[]) => prev.filter(pl => pl.id !== id));
      setDeletingPriceListId(null);
    }, 300);
  };

  return (
    <SectionCard title="Opciones avanzadas" defaultOpen={true}>
      {/* Detalle de inventario / Variantes */}
      {itemType === "producto" && (
        <div className="mb-8">
          {!hasVariants ? (
            <>
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
                          className="flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Editar</span>
                        </DropdownMenuItem>
                        {warehouses.length > 1 && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWarehouse(w.id);
                            }}
                            className="flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
                className="flex items-center gap-1 text-sm font-bold text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-all cursor-pointer mt-2"
              >
                <Plus className="w-4 h-4" />
                Agregar bodega
              </button>
            </>
          ) : (
            <>
              <h3 className="text-sm font-bold text-foreground mb-1">Variantes</h3>
              <p className="text-xs text-muted-foreground mb-6">
                Agrega atributos para categorizar tus productos, como talla y color.{" "}
                <span className="text-primary font-bold transition-colors px-1 link-hover">Ver más.</span>
              </p>

              {/* Attributes Table */}
              <div className="border border-border rounded-xl overflow-hidden mb-4 bg-white shadow-sm">
                <div className="grid grid-cols-[40px_1.2fr_1.5fr_100px] bg-[#f8fafc] border-b border-border py-2 px-4 text-[10px] font-bold text-[#64748b] uppercase tracking-widest">
                  <div></div>
                  <div className="flex justify-center items-center px-4">Atributos</div>
                  <div className="flex justify-center items-center px-4 border-l border-border/60">Valores de atributos</div>
                  <div className="border-l border-border/60"></div>
                </div>
                <div className="divide-y divide-border">
                  {attributes.map((attr, idx) => {
                    const isEditing = editingAttributeId === attr.id;
                    return (
                      <div key={attr.id} className="grid grid-cols-[40px_1.2fr_1.5fr_100px] items-center py-3 px-4 bg-white transition-all">
                        <div className="flex justify-center text-muted-foreground/30 cursor-grab">
                          <MoreVertical className="w-4 h-4" />
                        </div>

                        {/* Attribute Name Column */}
                        <div className="px-2 space-y-1">
                          {isEditing ? (
                            <>
                              <Select value={attr.name} onValueChange={(val) => handleUpdateAttributeName(attr.id, val)}>
                                <SelectTrigger className={cn(
                                  baseInput,
                                  variantErrors.attributes[idx] && "border-[#ef4444] ring-[#ef4444]/20 text-[#ef4444]"
                                )}>
                                  <SelectValue placeholder="Seleccionar Atributo" />
                                  {variantErrors.attributes[idx] && <AlertCircle className="w-3.5 h-3.5 ml-auto" />}
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-border rounded-xl shadow-lg">
                                  {availableAttributes.map((avail) => (
                                    <SelectItem
                                      key={avail.name}
                                      value={avail.name}
                                      className={cn(selectItemClass, "flex items-center gap-2 py-2")}
                                      onPointerDown={(e) => {
                                        // Update the row with the selected attribute's values
                                        setAttributes(prev => prev.map(a =>
                                          a.id === attr.id ? { ...a, name: avail.name, values: avail.values, selectedValues: [] } : a
                                        ));
                                      }}
                                    >
                                      {avail.name}
                                    </SelectItem>
                                  ))}
                                  <SelectSeparator />
                                  <div
                                    className="p-1"
                                    onPointerDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setIsAttributeModalOpen(true);
                                    }}
                                  >
                                    <button
                                      type="button"
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                    >
                                      <Plus className="w-4 h-4" />
                                      Nueva Variante
                                    </button>
                                  </div>
                                </SelectContent>
                              </Select>
                              {variantErrors.attributes[idx] && (
                                <p className="text-[10px] text-[#ef4444] font-medium ml-1">Debes seleccionar un atributo</p>
                              )}
                            </>
                          ) : (
                            <span className="text-sm font-medium text-[#123159] ml-2 block py-2">{attr.name || "Sin nombre"}</span>
                          )}
                        </div>

                        {/* Attribute Values Column */}
                        <div className="px-2">
                          {isEditing ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className={cn(
                                  baseInput,
                                  "justify-between text-muted-foreground overflow-hidden",
                                  attr.selectedValues.length > 0 && "h-auto py-1.5"
                                )}>
                                  {attr.selectedValues.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {attr.selectedValues.map(v => (
                                        <span key={v} className="bg-[#f1f5f9] text-[#475569] text-[11px] font-semibold px-2 py-0.5 rounded-md border border-border/50">
                                          {v}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span>Seleccionar valores</span>
                                  )}
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-white border border-border rounded-xl shadow-lg min-w-[200px] p-1">
                                {attr.values.map((val) => (
                                  <div
                                    key={val}
                                    onClick={() => handleToggleValue(attr.id, val)}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer group transition-all"
                                  >
                                    <div className={cn(
                                      "w-4 h-4 border rounded flex items-center justify-center transition-all",
                                      attr.selectedValues.includes(val) ? "bg-[#2563eb] border-[#2563eb]" : "border-border group-hover:border-[#2563eb]"
                                    )}>
                                      {attr.selectedValues.includes(val) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className={cn(
                                      "text-sm",
                                      attr.selectedValues.includes(val) ? "text-[#2563eb] font-semibold" : "text-[#475569]"
                                    )}>{val}</span>
                                  </div>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 ml-2">
                              {attr.selectedValues.map(v => (
                                <span key={v} className="bg-[#f1f5f9] text-[#475569] text-[12px] font-medium px-2.5 py-1 rounded-lg border border-border/40">
                                  {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Actions Column */}
                        <div className="flex justify-end gap-1 px-2">
                          {isEditing ? (
                            <button
                              type="button"
                              onClick={() => handleGenerateVariants()}
                              disabled={!attr.name || attr.selectedValues.length === 0}
                              className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-xl transition-colors text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setEditingAttributeId(attr.id)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-xl transition-colors text-muted-foreground"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteAttribute(attr.id)}
                            disabled={attributes.length <= 1}
                            className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-xl transition-colors text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = Date.now().toString();
                  setAttributes(prev => [...prev, { id: newId, name: "", values: [], selectedValues: [] }]);
                  setVariantErrors(prev => ({ ...prev, attributes: [...prev.attributes, false] }));
                  setEditingAttributeId(newId);
                }}
                disabled={attributes.some(attr => !attr.name || attr.selectedValues.length === 0)}
                className="flex items-center gap-1 text-sm font-bold text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-all cursor-pointer mb-6 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Asignar atributo
              </button>

              {(variantErrors.general || (hasVariants && variants.length === 0)) && (
                <div className="flex items-center gap-2 mb-6 text-[#ef4444] animate-in fade-in slide-in-from-left-1">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[13px] font-medium text-[#ef4444]">Debes crear al menos una variante</span>
                </div>
              )}

              {/* Variants Summary Table (Generated) */}
              {variants.length > 0 && (
                <div className="border border-border rounded-[24px] overflow-hidden bg-white shadow-sm mb-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_100px] bg-[#f8fafc] border-b border-border py-3 px-6 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    <div>Variante</div>
                    <div className="px-4 border-l border-border/60">Bodega</div>
                    <div className="px-4 border-l border-border/60">Cantidad inicial</div>
                    <div className="border-l border-border/60"></div>
                  </div>
                  <div className="divide-y divide-border max-h-[400px] overflow-y-auto custom-scrollbar">
                    {variants.map((v) => (
                      <div key={v.id} className="grid grid-cols-[1.5fr_1fr_1fr_100px] items-center py-3.5 px-6 group hover:bg-muted/5 transition-all">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-14 h-14 border border-border/80 rounded-xl flex items-center justify-center bg-white shadow-sm transition-all group-hover:border-primary/40 group-hover:shadow-md cursor-pointer overflow-hidden p-0.5"
                            onClick={() => setGalleryOpenForVariant(v.id)}
                          >
                            {v.favoriteImage ? (
                              <img src={v.favoriteImage} alt={v.name} className="w-full h-full object-contain rounded-lg" />
                            ) : (
                              <Camera className="w-6 h-6 text-[#123159]/20" />
                            )}
                          </div>
                          <span className="text-sm font-semibold text-[#123159]">{v.name}</span>
                        </div>
                        <div className="px-4 border-l border-border/40 h-full flex items-center py-2 flex-wrap gap-1">
                          {v.inventory && v.inventory.length > 1 ? (
                            <TooltipProvider>
                              <Tooltip delayDuration={300}>
                                <TooltipTrigger asChild>
                                  <span className="text-sm text-[#123159] cursor-pointer hover:underline font-medium">
                                    {v.inventory.length} Bodegas
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="flex flex-col gap-1 bg-white border border-border shadow-lg" sideOffset={5}>
                                  {v.inventory.map((inv: any, idx: number) => (
                                    <span key={idx} className="px-2 py-1 bg-slate-50 border border-border/40 rounded-md text-[11px] font-medium text-[#123159] uppercase tracking-wide inline-block w-fit">
                                      {inv.warehouse} - {inv.initialQty}
                                    </span>
                                  ))}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : v.inventory && v.inventory.length === 1 && v.inventory[0].warehouse ? (
                            <span className="px-2 py-1 bg-slate-50 border border-border/40 rounded-md text-[11px] font-medium text-[#123159] uppercase tracking-wide inline-block">
                              {v.inventory[0].warehouse} - {v.inventory[0].initialQty}
                            </span>
                          ) : (
                            <span className="text-sm text-[#475569]">{v.warehouse || ""}</span>
                          )}
                        </div>
                        <div className="px-4 border-l border-border/40 h-full flex items-center justify-center">
                          <span className="text-sm text-[#475569] font-medium">
                            {v.inventory && v.inventory.length > 0 && v.inventory[0].warehouse ? "-" : (v.initialQty || "-")}
                          </span>
                        </div>
                        <div className="flex justify-end items-center gap-1 transition-all">
                          <button
                            type="button"
                            onClick={() => handleToggleVariantActive(v.id)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-xl transition-colors text-muted-foreground"
                          >
                            {v.active ? (
                              <Lightbulb className="w-4 h-4" />
                            ) : (
                              <LightbulbOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditVariant(v.id)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-xl transition-colors text-muted-foreground"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVariant(v.id)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-xl transition-colors text-muted-foreground"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Variant Gallery Modal */}
          {galleryOpenForVariant !== null && (
            <VariantGalleryModal
              open={true}
              onOpenChange={(open) => {
                if (!open) setGalleryOpenForVariant(null);
              }}
              images={variants.find(v => v.id === galleryOpenForVariant)?.images || []}
              favorite={variants.find(v => v.id === galleryOpenForVariant)?.favoriteImage || null}
              onSave={(images, favorite) => {
                setVariants(prev => prev.map(v =>
                  v.id === galleryOpenForVariant
                    ? { ...v, images, favoriteImage: favorite }
                    : v
                ));
              }}
            />
          )}
        </div>
      )}

      {/* Listas de precios */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Listas de precios</h3>
        <div className="space-y-2">
          {priceLists.map((pl) => (
            <div
              key={pl.id}
              className={cn(
                "flex items-center gap-3 transition-all",
                deletingPriceListId === pl.id
                  ? "animate-out fade-out slide-out-to-top-2 duration-300 fill-mode-forwards"
                  : "animate-in fade-in slide-in-from-top-2 duration-300"
              )}
            >
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Lista de precios</label>
                <Select
                  value={pl.list}
                  onValueChange={(val) => {
                    setPriceLists(prev => prev.map(item =>
                      item.id === pl.id ? { ...item, list: val } : item
                    ));
                  }}
                >
                  <SelectTrigger className={cn(baseInput, "justify-between pr-2")}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-border rounded-xl shadow-xl p-1">
                    <SelectItem value="general" className={selectItemClass}>General</SelectItem>
                    <SelectItem value="especial" className={selectItemClass}>Especial</SelectItem>
                    {customPriceLists.map((cpl) => (
                      <SelectItem key={cpl.name} value={cpl.name} className={selectItemClass}>
                        {cpl.name}
                      </SelectItem>
                    ))}
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsPriceListModalOpen(true);
                        }}
                        className="w-full text-left px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors"
                      >
                        Nueva Lista de precios
                      </button>
                    </div>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Valor</label>
                <input
                  type="text"
                  value={pl.value}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, "");
                    setPriceLists(prev => prev.map(item =>
                      item.id === pl.id ? { ...item, value: val } : item
                    ));
                  }}
                  className={cn(baseInput, "pr-8")}
                  placeholder="0"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="mt-5 w-8 h-8 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors">
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-border rounded-xl shadow-xl min-w-[100px]">
                  <DropdownMenuItem
                    onClick={() => priceLists.length > 1 && handleDeletePriceList(pl.id)}
                    disabled={priceLists.length <= 1}
                    className="flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddPriceList}
          className="flex items-center gap-1 text-sm font-bold text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-all cursor-pointer mt-4"
        >
          <Plus className="w-4 h-4" />
          Agregar lista de precio
        </button>
      </div>

      {/* Combo Section */}
      {
        itemType === "combo" && (
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="text-sm font-bold text-foreground mb-1">Combo</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Selecciona los productos y sus cantidades para armar un combo
            </p>

            <div className="space-y-2">
              {comboProducts.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    "flex items-center gap-5 border-none rounded-xl px-5 py-4 transition-all group cursor-pointer hover:bg-muted/30",
                    deletingComboId === p.id
                      ? "animate-out fade-out slide-out-to-top-2 duration-300 fill-mode-forwards"
                      : "animate-in fade-in slide-in-from-top-2 duration-300"
                  )}
                  onClick={() => setEditingComboId(p.id)}
                >
                  <div className="w-20 h-20 rounded-sm border border-border flex items-center justify-center bg-white shrink-0">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-lg font-medium mb-0.5",
                      p.product ? "text-[#123159]" : "text-primary"
                    )}>
                      {p.product || "Seleccionar"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {p.product
                        ? `${p.quantity} unidad${Number(p.quantity) !== 1 ? 's' : ''} - $${p.cost}`
                        : "Agrega aquí uno de los productos de tu combo"
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.product && (
                      <input
                        type="text"
                        placeholder="0"
                        value={p.quantity}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setComboProducts((prev: any[]) => prev.map((item: any) =>
                            item.id === p.id ? { ...item, quantity: val } : item
                          ));
                        }}
                        className={cn(baseInput, "w-16 text-center")}
                      />
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="w-10 h-10 flex items-center justify-center rounded-xl border border-transparent hover:border-border/60 hover:bg-muted transition-colors">
                          <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border border-border rounded-xl shadow-xl min-w-[100px]">
                        <DropdownMenuItem
                          onClick={() => setEditingComboId(p.id)}
                          className="flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Editar</span>
                        </DropdownMenuItem>
                        {comboProducts.length > 1 && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingComboId(p.id);
                              setTimeout(() => {
                                setComboProducts((prev: any[]) => prev.filter((item: any) => item.id !== p.id));
                                setDeletingComboId(null);
                              }, 300);
                            }}
                            className="flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">Eliminar</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={handleAddComboProduct}
                className="flex items-center gap-1 text-sm font-bold text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-all"
              >
                <Plus className="w-4 h-4" />
                Agregar producto
              </button>
              <div className="text-right">
                <span className="text-lg font-bold text-[#123159]">
                  Costo total: ${comboProducts.reduce((acc: number, p: any) => acc + (parseFloat(p.cost.replace(/\./g, "")) || 0) * (parseInt(p.quantity) || 0), 0).toLocaleString("es-CO")}
                </span>
              </div>
            </div>
          </div>
        )
      }

      <ProductComboModal
        open={editingComboId !== null}
        onOpenChange={handleCloseComboModal}
        initialData={comboProducts.find((p: any) => p.id === editingComboId)}
        existingProducts={comboProducts.map((p: any) => p.product).filter(Boolean)}
        onSave={(data) => {
          if (editingComboId !== null) {
            setComboProducts((prev: any[]) => prev.map((item: any) =>
              item.id === editingComboId ? { ...item, ...data } : item
            ));
          }
          setEditingComboId(null);
          setIsNewComboProduct(false);
        }}
      />
      <AttributeModal
        open={isAttributeModalOpen}
        onOpenChange={setIsAttributeModalOpen}
        onSave={(name, values) => {
          setAvailableAttributes(prev => [...prev, { name, values }]);
          showToast(`La variante ${name} ha sido creada exitosamente.`, "success");
        }}
      />
      <VariantEditModal
        open={isVariantEditModalOpen}
        onOpenChange={setIsVariantEditModalOpen}
        variantName={variants.find(v => v.id === editingVariantId)?.name || ""}
        initialData={variants.find(v => v.id === editingVariantId)}
        onSave={handleSaveVariantData}
      />
      <PriceListModal
        open={isPriceListModalOpen}
        onOpenChange={setIsPriceListModalOpen}
        onSave={(data) => {
          setCustomPriceLists(prev => [...prev, data]);
          showToast(`La lista de precios "${data.name}" ha sido creada.`, "success");
        }}
      />
    </SectionCard >
  );
}
