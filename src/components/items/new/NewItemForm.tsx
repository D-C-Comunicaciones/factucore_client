"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { AdvancedOptionsSection } from "./AdvancedOptionsSection";
import { AdditionalFieldsSection } from "./AdditionalFieldsSection";
import { AccountingSection } from "./AccountingSection";
import { ItemSidebar } from "./ItemSidebar";

import { useItemForm } from "@/hooks/items/useItemForm";
import { Item } from "@/types/items";

interface NewItemFormProps {
  catalogs: any;
  onSubmit: (payload: any) => void;
  isSubmitting: boolean;
  initialData?: Partial<Item>;
}

export function NewItemForm({ catalogs, onSubmit, isSubmitting, initialData }: NewItemFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    itemType, setItemType,
    name, setName,
    reference, setReference,
    description, setDescription,
    unitMeasureId, setUnitMeasureId,
    categoryId, setCategoryId,
    basePrice, setBasePrice,
    taxId, setTaxId,
    totalPrice, setTotalPrice,
    hasVariants, setHasVariants,
    warehouseId, setWarehouseId,
    initialStock, setInitialStock,
    minimumStock, setMinimumStock,
    variants, setVariants,
    comboSettings, setComboSettings,
    customFields, setCustomFields,
    buildPayload
  } = useItemForm(initialData);

  const [images, setImages] = React.useState<string[]>([]);

  // Sync with search params for quick creation redirect
  React.useEffect(() => {
    if (!initialData) {
      const type = searchParams.get("type");
      if (type === "producto" || type === "servicio" || type === "combo") setItemType(type);
      
      const pName = searchParams.get("name");
      if (pName) setName(pName);
      
      const pBasePrice = searchParams.get("basePrice");
      if (pBasePrice) setBasePrice(pBasePrice);
      
      const pTax = searchParams.get("tax");
      // Mapping tax rate to taxId would require finding it in catalogs
    }
  }, [searchParams, initialData, setItemType, setName, setBasePrice]);

  function handleSave() {
    const payload = buildPayload();
    onSubmit(payload);
  }

  function handleSaveAndCreate() {
    const payload = buildPayload();
    onSubmit(payload);
    // Logic to reset form would go here or in a useEffect after success
  }

  return (
    <div className="flex gap-6 items-start pb-8">
      {/* LEFT: form sections */}
      <div className="flex-1 min-w-0 space-y-4">
        <GeneralInfoSection
          itemType={itemType}
          onItemTypeChange={setItemType}
          name={name}
          onNameChange={setName}
          basePrice={basePrice}
          onBasePriceChange={setBasePrice}
          tax={taxId?.toString() || ""}
          onTaxChange={(v) => {
            const val = parseInt(v);
            setTaxId(isNaN(val) ? undefined : val);
          }}
          onTotalChange={setTotalPrice}
          hasVariants={hasVariants}
          onHasVariantsChange={setHasVariants}
          // New props for full integration
          reference={reference}
          onReferenceChange={setReference}
          description={description}
          onDescriptionChange={setDescription}
          unitMeasureId={unitMeasureId}
          onUnitMeasureIdChange={setUnitMeasureId}
          categoryId={categoryId}
          onCategoryIdChange={setCategoryId}
          warehouseId={warehouseId}
          onWarehouseIdChange={setWarehouseId}
          initialStock={initialStock}
          onInitialStockChange={setInitialStock}
          minimumStock={minimumStock}
          onMinimumStockChange={setMinimumStock}
          catalogs={catalogs}
        />
        <AdvancedOptionsSection 
          itemType={itemType} 
          hasVariants={hasVariants} 
          variants={variants}
          onVariantsChange={setVariants}
          comboSettings={comboSettings}
          onComboSettingsChange={setComboSettings}
          catalogs={catalogs}
        />
        <AdditionalFieldsSection 
          customFields={customFields}
          onCustomFieldsChange={setCustomFields}
          catalogs={catalogs}
        />
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
        hasVariants={hasVariants}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
