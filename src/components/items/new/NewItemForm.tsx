"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { AdvancedOptionsSection } from "./AdvancedOptionsSection";
import { AdditionalFieldsSection } from "./AdditionalFieldsSection";
import { AccountingSection } from "./AccountingSection";
import { ItemSidebar } from "./ItemSidebar";
import { CustomFieldModal } from "@/components/custom-fields/CustomFieldModal";
import { showToast } from "@/components/sonner/CustomToaster";
import { NewTaxRateModal } from "@/components/items/taxes/NewTaxRateModal";
import { NewCategoryModal } from "@/components/category/NewCategoryModal";
import { NewWarehouseModal } from "@/components/warehouse/NewWarehouseModal";

import { useItemForm } from "@/hooks/items/useItemForm";
import { catalogsApi } from "@/lib/catalogs";
import { warehousesApi } from "@/lib/warehouses";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { ItemResponse, CreateItemPayload } from "@/types/items";
import { customFieldsApi } from "@/lib/customFields";
import { invalidateCatalog } from "@/hooks/useCatalogs";
import { ItemImage } from "@/common/interfaces/images";

interface NewItemFormProps {
  catalogs: Record<string, any>;
  onSubmit: (payload: CreateItemPayload) => void;
  isSubmitting: boolean;
  initialData?: Partial<ItemResponse>;
}

export function NewItemForm({ catalogs, onSubmit, isSubmitting, initialData }: NewItemFormProps) {
  const searchParams = useSearchParams();

  const {
    itemType, setItemType,
    name, setName,
    reference, setReference,
    description, setDescription,
    unitMeasureId, setUnitMeasureId,
    categoryId, setCategoryId,
    typeItemIdentificationId, setTypeItemIdentificationId,
    basePrice, setBasePrice,
    taxId, setTaxId,
    totalPrice, setTotalPrice,
    hasVariants, setHasVariants,
    warehouseId, setWarehouseId,
    initialStock, setInitialStock,
    minimumStock, setMinimumStock,
    warehouses, setWarehouses,
    isInventoriable, setIsInventoriable,
    allowNegativeStock, setAllowNegativeStock,
    variants, setVariants,
    comboSettings, setComboSettings,
    customFields, setCustomFields,
    priceLists, setPriceLists,
    salesAccountId, setSalesAccountId,
    inventoryAccountId, setInventoryAccountId,
    costAccountId, setCostAccountId,
    buildPayload
  } = useItemForm(initialData);

  const [images, setImages] = React.useState<ItemImage[]>([]);
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = React.useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = React.useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = React.useState(false);

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
      if (pTax) {
        const parsed = Number(pTax);
        if (!Number.isNaN(parsed)) setTaxId(parsed);
      }
    }
  }, [searchParams, initialData, setItemType, setName, setBasePrice, setTaxId]);

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Debe ingresar un nombre";


    if (itemType !== "servicio" && !hasVariants) {
      if (!warehouseId) newErrors.warehouseId = "Debe seleccionar una bodega";
    }

    if (!unitMeasureId) newErrors.unitMeasureId = "Debe seleccionar una unidad de medida";

    if (itemType === "producto" && !hasVariants) {
      if (!initialStock.toString().trim()) {
        newErrors.initialStock = "Debe ingresar la cantidad inicial";
      }
    }

    if (!basePrice.toString().trim()) {
      newErrors.basePrice = "Debe ingresar un precio base";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("Por favor, completa todos los campos obligatorios.", "error");
      return false;
    }

    return true;
  };

  function handleSave() {
    if (!validateForm()) return;
    const payload = buildPayload();
    onSubmit(payload);
  }

  function handleSaveAndCreate() {
    if (!validateForm()) return;
    const payload = buildPayload();
    onSubmit(payload);
    // Logic to reset form would go here or in a useEffect after success
  }

  const handleSaveCustomField = async (newField: any) => {
    const typeMap: Record<string, number> = {
      text: 1,
      number: 2,
      decimal: 3,
      date: 4,
      boolean: 5,
      select: 6,
    };

    const sanitizeCode = (value: string) => {
      const normalized = value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_|_$/g, "");

      return normalized ? `CF_${normalized}` : `CF_${Date.now()}`;
    };

    const payload = {
      custom_field_type_id: newField.type_id ?? typeMap[newField.type] ?? 1,
      custom_field_target_id: 1,
      code: sanitizeCode(newField.name),
      name: newField.name,
      description: newField.description,
      default_value: newField.default_value,
      is_required: newField.required,
      include_in_invoice: newField.is_printable,
      is_active: true,
      ...(newField.type === "select"
        ? {
          options: (newField.options || [])
            .map((option: string, index: number) => {
              const trimmed = option.trim();
              return trimmed
                ? {
                  value: trimmed,
                  label: trimmed,
                  order: index + 1,
                }
                : null;
            })
            .filter(Boolean),
        }
        : {}),
    };

    const response = await customFieldsApi.createCustomField(payload);
    const createdField = response?.data?.custom_fields ?? response?.data?.custom_field ?? response?.data ?? payload;
    const normalizedField = {
      id: createdField.id ?? Date.now(),
      name: createdField.name,
      type: newField.type,
      description: createdField.description,
      required: createdField.is_required ?? newField.required,
      is_printable: createdField.include_in_invoice ?? newField.is_printable,
      default_value: createdField.default_value ?? newField.default_value,
      options: createdField.options ?? payload.options,
      code: createdField.code,
      custom_field_type_id: createdField.custom_field_type_id ?? payload.custom_field_type_id,
      custom_field_target_id: createdField.custom_field_target_id ?? payload.custom_field_target_id,
      is_active: createdField.is_active ?? true,
    };

    invalidateCatalog(queryClient, QUERY_KEYS.catalogs.customFields());

    showToast(`El campo "${newField.name}" ha sido creado e integrado en la lista.`, "success");
  };

  const handleSaveTaxRate = async (newTaxRate: {
    name: string;
    tax_id: number;
    rate: number;
    description?: string;
    type: "percentage";
  }) => {
    const response = await catalogsApi.createTaxRate({
      ...newTaxRate,
      type: "percentage",
    });

    const created = response?.data?.tax_rates?.[0] ?? response?.data?.tax_rate ?? response?.data ?? newTaxRate;

    invalidateCatalog(queryClient, QUERY_KEYS.catalogs.taxRates());

    if (created.id) setTaxId(Number(created.id));
    showToast(`El impuesto "${created.name ?? newTaxRate.name}" ha sido creado.`, "success");
  };

  const handleSaveCategory = (newCategory: {
    id: number;
    name: string;
    description?: string;
  }) => {
    invalidateCatalog(queryClient, QUERY_KEYS.catalogs.categories());

    setCategoryId(newCategory.id);
  };

  const handleSaveWarehouse = async (warehouseData: { name: string; address: string; observations: string }) => {
    try {
      const response = await warehousesApi.createWarehouse(warehouseData);
      const newWarehouse = response?.data?.warehouse ?? response?.data ?? { id: Date.now(), ...warehouseData };

      invalidateCatalog(queryClient, QUERY_KEYS.catalogs.warehouses());

      setWarehouseId(newWarehouse.id);
      setIsWarehouseModalOpen(false);
      showToast(`La bodega "${newWarehouse.name}" fue creada exitosamente.`, "success");
    } catch (error) {
      showToast("Ocurrió un error al crear la bodega. Intenta de nuevo.", "error");
    }
  };

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
            const val = Number(v);
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
          typeItemIdentificationId={typeItemIdentificationId}
          onTypeItemIdentificationIdChange={setTypeItemIdentificationId}
          warehouseId={warehouseId}
          onWarehouseIdChange={setWarehouseId}
          initialStock={initialStock}
          onInitialStockChange={setInitialStock}
          minimumStock={minimumStock}
          onMinimumStockChange={setMinimumStock}
          catalogs={catalogs}
          errors={errors}
          onOpenNewTaxModal={() => setIsTaxModalOpen(true)}
          onOpenNewCategoryModal={() => setIsCategoryModalOpen(true)}
          onOpenNewWarehouseModal={() => setIsWarehouseModalOpen(true)}
        />
        <AdvancedOptionsSection
          itemType={itemType}
          hasVariants={hasVariants}
          variants={variants}
          onVariantsChange={setVariants}
          comboSettings={comboSettings}
          onComboSettingsChange={setComboSettings}
          basePrice={basePrice}
          catalogs={catalogs}
          priceLists={priceLists}
          onPriceListsChange={setPriceLists}
          warehouses={warehouses}
          onWarehousesChange={setWarehouses}
          setInitialStock={setInitialStock}
        />
        <AdditionalFieldsSection
          customFields={customFields}
          onCustomFieldsChange={setCustomFields}
          catalogs={catalogs}
          onOpenNewFieldModal={() => setIsCustomFieldModalOpen(true)}
        />
        <AccountingSection
          salesAccountId={salesAccountId}
          setSalesAccountId={setSalesAccountId}
          inventoryAccountId={inventoryAccountId}
          setInventoryAccountId={setInventoryAccountId}
          costAccountId={costAccountId}
          setCostAccountId={setCostAccountId}
        />
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
        itemType={itemType}
        inventariable={isInventoriable}
        onInventariableChange={setIsInventoriable}
        ventaNegativo={allowNegativeStock}
        onVentaNegativoChange={setAllowNegativeStock}
      />

      <CustomFieldModal
        open={isCustomFieldModalOpen}
        onOpenChange={setIsCustomFieldModalOpen}
        fieldTypes={catalogs.typeCustomFields}
        onSave={handleSaveCustomField}
      />

      <NewTaxRateModal
        open={isTaxModalOpen}
        onOpenChange={setIsTaxModalOpen}
        taxTypes={catalogs.taxTypes || []}
        onSave={handleSaveTaxRate}
      />

      <NewCategoryModal
        open={isCategoryModalOpen}
        onOpenChange={setIsCategoryModalOpen}
        onCreated={handleSaveCategory}
      />

      <NewWarehouseModal
        open={isWarehouseModalOpen}
        onOpenChange={setIsWarehouseModalOpen}
        onCancel={() => setIsWarehouseModalOpen(false)}
        onSave={handleSaveWarehouse}
      />
    </div>
  );
}
