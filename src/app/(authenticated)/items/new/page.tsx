"use client";

import { NewItemForm } from "@/components/items/new/NewItemForm";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useCreateItem } from "@/hooks/items/useCreateItem";

export default function NewItemPage() {
  const catalogs = useCatalogs();
  const { mutate: createItem, isPending: isCreating } = useCreateItem();

  return (
    <div className="w-full text-foreground pb-4">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="page-title mb-0">
            Nuevo producto de venta
          </h1>
          <p className="page-subtitle">
            Crea tus productos inventariables y/o servicios que ofreces para registrar en tus ventas.{" "}
            <span className="text-primary font-bold px-1 link-hover cursor-pointer">Ver más</span>
          </p>
        </div>

        {/* FORM */}
        <NewItemForm 
          catalogs={catalogs}
          onSubmit={(payload, options) => createItem(payload, options)}
          isSubmitting={isCreating}
        />

      </div>
    </div>
  );
}
