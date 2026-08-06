"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { NewItemForm } from "@/components/items/new/NewItemForm";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useItemById } from "@/hooks/items/useItemById";
import { useUpdateItem } from "@/hooks/items/useUpdateItem";

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const catalogs = useCatalogs();
  const { data: item, isLoading, isError } = useItemById(id);
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItem();

  if (isLoading || catalogs.isLoading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 text-center text-muted-foreground">
        Cargando ítem...
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 text-center text-destructive">
        No se pudo cargar el ítem
      </div>
    );
  }

  return (
    <div className="w-full text-foreground pb-4">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="page-title mb-0">
            Editar {item.basic_info?.name || "ítem"}
          </h1>
          <p className="page-subtitle">
            Actualiza la información de tu producto o servicio.
          </p>
        </div>

        {/* FORM */}
        <NewItemForm
          catalogs={catalogs}
          initialData={item}
          isEditMode
          onCancel={() => router.push(`/items/${id}`)}
          onSubmit={(payload, options) => updateItem({ id, payload }, {
            ...options,
            onSuccess: () => {
              router.push(`/items/${id}`);
            },
          })}
          isSubmitting={isUpdating}
        />

      </div>
    </div>
  );
}
