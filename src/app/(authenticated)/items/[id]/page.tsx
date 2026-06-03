"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useItemById } from "@/hooks/items/useItemById";
import { useToggleItemStatus } from "@/hooks/items/useToggleItemStatus";
import { useDeleteItem } from "@/hooks/items/useDeleteItem";
import { useCatalogs } from "@/hooks/useCatalogs";
import { ItemHeader } from "@/components/items/details/ItemHeader";
import { ItemMainInfo } from "@/components/items/details/ItemMainInfo";
import { ItemInventory } from "@/components/items/details/ItemInventory";
import { ItemPriceLists } from "@/components/items/details/ItemPriceLists";
import { ItemAttachments } from "@/components/items/details/ItemAttachments";
import { ItemDocumentsTab } from "@/components/items/details/ItemDocumentsTab";
import { ItemAccounting } from "@/components/items/details/ItemAccounting";

/* ========================================================================== */
/* LOADING SKELETON                                                           */
/* ========================================================================== */

function ItemDetailSkeleton() {
  return (
    <div className="w-full max-w-[1100px] mx-auto animate-pulse">
      {/* Back button */}
      <div className="h-5 w-28 bg-muted rounded mb-3" />

      {/* Title */}
      <div className="h-8 w-64 bg-muted rounded mb-4" />

      {/* Action bar */}
      <div className="flex gap-2.5 mb-6">
        <div className="h-9 w-44 bg-muted rounded-lg" />
        <div className="h-9 w-36 bg-muted rounded-lg" />
        <div className="h-9 w-36 bg-muted rounded-lg" />
        <div className="h-9 w-20 bg-muted rounded-lg" />
        <div className="h-9 w-28 bg-muted rounded-lg" />
      </div>

      {/* Main card */}
      <div className="bg-card rounded-xl border border-border/40 p-6 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded" />
                <div className="h-5 w-12 bg-muted rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-5 w-16 bg-muted rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-5 w-24 bg-muted rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-5 w-20 bg-muted rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-5 w-16 bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-5 w-full bg-muted rounded" />
            </div>
          </div>
          <div className="space-y-5">
            <div className="w-full aspect-square max-h-[240px] bg-muted rounded-xl" />
            <div className="space-y-3">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-9 w-36 bg-muted rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory bar */}
      <div className="bg-card rounded-xl border border-border/40 px-6 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-5 w-28 bg-muted rounded" />
            <div className="h-7 w-8 bg-muted rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-muted rounded-lg" />
            <div className="h-9 w-28 bg-muted rounded-lg" />
          </div>
        </div>
      </div>

      {/* Price + Attachments */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-card rounded-xl border border-border/40 p-6">
          <div className="h-5 w-32 bg-muted rounded mb-4" />
          <div className="h-10 bg-muted rounded" />
        </div>
        <div className="bg-card rounded-xl border border-border/40 p-6">
          <div className="h-5 w-32 bg-muted rounded mb-4" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-xl border border-border/40 mb-4">
        <div className="flex gap-4 px-6 py-3 border-b border-border/30">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-5 w-28 bg-muted rounded" />
          ))}
        </div>
        <div className="h-48" />
      </div>
    </div>
  );
}

/* ========================================================================== */
/* ERROR STATE                                                                */
/* ========================================================================== */

function ItemNotFound() {
  const router = useRouter();

  return (
    <div className="w-full max-w-[1100px] mx-auto">
      <div className="bg-card rounded-xl border border-border/40 shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">❌</span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Ítem no encontrado
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          El ítem que buscas no existe o fue eliminado.
        </p>
        <button
          type="button"
          onClick={() => router.push("/items")}
          className="px-5 py-2 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md active:scale-95"
        >
          Volver a ítems
        </button>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* PAGE                                                                       */
/* ========================================================================== */

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: item, isLoading, isError } = useItemById(id);
  const { mutate: toggleStatus, isPending: isTogglingStatus } =
    useToggleItemStatus();
  const { mutate: deleteItem } = useDeleteItem();
  const catalogs = useCatalogs();

  const handleToggleStatus = React.useCallback(() => {
    if (id) toggleStatus(id);
  }, [id, toggleStatus]);

  const handleDeleteItem = React.useCallback(() => {
    if (id) {
      deleteItem(id, {
        onSuccess: () => {
          router.push("/items");
        },
      });
    }
  }, [id, deleteItem, router]);

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  if (isLoading || catalogs.isLoading) {
    return <ItemDetailSkeleton />;
  }

  if (isError || !item) {
    return <ItemNotFound />;
  }

  const categoryName = React.useMemo(() => {
    if (!item.basic_info?.category_id) return null;
    const cat = catalogs?.categories?.find(
      (c: any) => Number(c.id) === Number(item.basic_info?.category_id)
    );
    return cat?.name ?? null;
  }, [item, catalogs]);

  const unitName = React.useMemo(() => {
    return item?.basic_info?.unit_measure?.name ?? "Unidad";
  }, [item]);

  const taxName = React.useMemo(() => {
    if (!item.pricing?.tax_rate_ids?.length) return "Ninguno";
    const taxId = item.pricing.tax_rate_ids[0];
    const tax = catalogs?.taxes?.find(
      (t: any) => Number(t.id) === Number(taxId)
    );
    return tax ? tax.name : "Ninguno";
  }, [item, catalogs]);

  const formatMoney = (value: number | undefined | null) => {
    if (!value && value !== 0) return "$0";
    return `$${value.toLocaleString("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    })}`;
  };

  const getItemTypeName = (typeId: number | undefined) => {
    if (!typeId) return "Ítem";
    switch (typeId) {
      case 1:
        return "Producto";
      case 2:
        return "Servicio";
      case 3:
        return "Combo";
      default:
        return "Ítem";
    }
  };

  const isProduct = Number(item?.basic_info?.type_item_id) === 1;

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-[1100px] mx-auto pb-10">
        <ItemHeader
          item={item}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteItem}
          isTogglingStatus={isTogglingStatus}
        />

        <ItemMainInfo
          item={item}
          categoryName={categoryName}
          unitName={unitName}
          itemTypeName={getItemTypeName(item?.basic_info?.type_item_id)}
          taxName={taxName}
          formatMoney={formatMoney}
        />

        {isProduct && (
          <ItemInventory
            inventoryQty={
              item?.inventory?.inventory_stocks?.reduce(
                (acc: number, stock: { stock_quantity: string }) => acc + parseFloat(stock.stock_quantity),
                0
              ) ?? 0
            }
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <ItemPriceLists item={item} formatMoney={formatMoney} />
          <ItemAttachments />
        </div>

        <div className="mt-4">
          <ItemDocumentsTab />
        </div>

        <div className="mt-4">
          <ItemAccounting />
        </div>
      </div>
    </div>
  );
}
