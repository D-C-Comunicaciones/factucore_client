"use client";

import { NewItemForm } from "@/components/items/new/NewItemForm";

export default function NewItemPage() {
  return (
    <div className="w-full min-h-screen text-foreground">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-lg md:text-xl font-bold text-foreground">
            Nuevo producto de venta
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Crea tus productos inventariables y/o servicios que ofreces para registrar en tus ventas.{" "}
            <span className="text-primary font-bold px-1 link-hover">Ver más</span>
          </p>
        </div>

        {/* FORM */}
        <NewItemForm />

      </div>
    </div>
  );
}
