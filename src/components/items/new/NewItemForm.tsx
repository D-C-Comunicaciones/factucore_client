"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { AdvancedOptionsSection } from "./AdvancedOptionsSection";
import { AdditionalFieldsSection } from "./AdditionalFieldsSection";
import { AccountingSection } from "./AccountingSection";
import { ItemSidebar } from "./ItemSidebar";

type ItemType = "producto" | "servicio" | "combo";

export function NewItemForm() {
  const router = useRouter();

  /* Shared state lifted up so sidebar can reflect live changes */
  const [itemType, setItemType] = React.useState<ItemType>("producto");
  const [name, setName] = React.useState("");
  const [basePrice, setBasePrice] = React.useState("");
  const [tax, setTax] = React.useState("0");
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [images, setImages] = React.useState<string[]>([]);

  function handleSave() {
    console.log("Guardar ítem", { name, totalPrice, images });
    router.push("/items");
  }

  function handleSaveAndCreate() {
    console.log("Guardar y crear otro");
    /* Reset form */
    setName("");
    setBasePrice("");
    setTax("0");
    setTotalPrice(0);
    setImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex gap-6 items-stretch">
      {/* LEFT: form sections */}
      <div className="flex-1 min-w-0 space-y-4">
        <GeneralInfoSection
          itemType={itemType}
          onItemTypeChange={setItemType}
          name={name}
          onNameChange={setName}
          basePrice={basePrice}
          onBasePriceChange={setBasePrice}
          tax={tax}
          onTaxChange={setTax}
          onTotalChange={setTotalPrice}
        />
        <AdvancedOptionsSection />
        <AdditionalFieldsSection />
        <AccountingSection />
      </div>

      {/* RIGHT: sticky sidebar */}
      <ItemSidebar
        name={name}
        totalPrice={totalPrice}
        images={images}
        onImagesChange={setImages}
        onSave={handleSave}
        onSaveAndCreate={handleSaveAndCreate}
      />
    </div>
  );
}
