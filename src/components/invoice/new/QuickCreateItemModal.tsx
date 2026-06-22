"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewItemModal } from "@/components/items/NewItemModal";
import { GeneralInfoSection } from "@/components/items/new/GeneralInfoSection";
import { AdvancedOptionsSection } from "@/components/items/new/AdvancedOptionsSection";
import { ItemConfigurationSection } from "@/components/items/new/ItemConfigurationSection";
import { ItemGalleryModal } from "@/components/items/new/ItemGalleryModal";
import { AdditionalFieldsSection } from "@/components/items/new/AdditionalFieldsSection";
import { AccountingSection } from "@/components/items/new/AccountingSection";
import { NewTaxRateModal } from "@/components/taxes/NewTaxRateModal";
import { NewCategoryModal } from "@/components/category/NewCategoryModal";
import { NewWarehouseModal } from "@/components/warehouse/NewWarehouseModal";
import { CustomFieldModal } from "@/components/custom-fields/CustomFieldModal";
import { useItemForm } from "@/hooks/items/useItemForm";
import { useCreateItem } from "@/hooks/items/useCreateItem";
import { catalogsApi } from "@/lib/catalogs";
import { warehousesApi } from "@/lib/warehouses";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { invalidateCatalog } from "@/hooks/useCatalogs";
import { customFieldsApi } from "@/lib/customFields";
import { showToast } from "@/components/sonner/CustomToaster";
import { type ItemFormState } from "@/types/items";
import { type ItemImage } from "@/common/interfaces/images";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Basic form state (same as items/page.tsx)                           */
/* ------------------------------------------------------------------ */
const BLANK_BASIC: ItemFormState = {
  itemType: "producto",
  name: "",
  reference: "",
  categoryId: "",
  bodega: "Principal",
  unit: "",
  comboCode: "",
  initialQuantity: "",
  initialCost: "",
  basePrice: "",
  totalPrice: "",
  tax: "0",
};

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */
interface QuickCreateItemModalProps {
  open: boolean;
  onClose: () => void;
  catalogs: any;
  /** Called after a successful creation so the invoice can refresh its item list */
  onCreated?: (createdItem?: any) => void;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export function QuickCreateItemModal({
  open,
  onClose,
  catalogs,
  onCreated,
}: QuickCreateItemModalProps) {
  /* ---------- basic form ---------- */
  const [basicForm, setBasicForm] = React.useState<ItemFormState>(BLANK_BASIC);
  const [basicErrors, setBasicErrors] = React.useState<Record<string, boolean>>({});

  /* ---------- view mode ---------- */
  // "basic" = solo formulario básico
  // "advanced" = formulario avanzado expandido (para producto / servicio)
  // "combo" = form de combo dentro del modal (cuando itemType === "combo" y se expande)
  const [viewMode, setViewMode] = React.useState<"basic" | "advanced">("basic");
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const { mutate: createItem, isPending: isCreating } = useCreateItem();

  /* ---------- advanced form hook ---------- */
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
    buildPayload,
  } = useItemForm();

  /* advanced sub-modal states */
  const [isTaxModalOpen, setIsTaxModalOpen] = React.useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = React.useState(false);
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = React.useState(false);
  const [advancedErrors, setAdvancedErrors] = React.useState<Record<string, string>>({});
  
  /* ---- Images and Gallery ---- */
  const [images, setImages] = React.useState<ItemImage[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);

  /* ---- Sync basicForm to useItemForm ---- */
  React.useEffect(() => {
    setItemType(basicForm.itemType);
    setName(basicForm.name);
    setReference(basicForm.reference || "");
    setCategoryId(basicForm.categoryId ? Number(basicForm.categoryId) : undefined);
    setUnitMeasureId(parseInt(basicForm.unit) || 1);
    setBasePrice(basicForm.basePrice);
    setTotalPrice(parseFloat(basicForm.totalPrice) || 0);
    const taxNum = Number(basicForm.tax);
    setTaxId(isNaN(taxNum) || taxNum === 0 ? undefined : taxNum);
    
    if (basicForm.itemType === "producto") {
      const warehouse = catalogs?.warehouses?.find(
        (w: any) => w.name?.toLowerCase() === basicForm.bodega?.toLowerCase()
      );
      if (warehouse?.id) setWarehouseId(warehouse.id);
      
      // Only sync initial quantity if we haven't manually changed it via advanced warehouses
      if (!warehouses || warehouses.length === 0 || (warehouses.length === 1 && warehouses[0].warehouse_id === warehouseId)) {
         setInitialStock(String(parseFloat(basicForm.initialQuantity) || 0));
      }
    }
  }, [basicForm, catalogs]);

  /* ---- Reset on close ---- */
  const handleClose = () => {
    setBasicForm(BLANK_BASIC);
    setBasicErrors({});
    setShowAdvanced(false);
    onClose();
  };

  const handleToggleAdvanced = () => {
    setShowAdvanced((v) => !v);
  };

  /* ================================================================ */
  /* SUBMIT                                                           */
  /* ================================================================ */
  const validateBasic = () => {
    const errs: Record<string, boolean> = {};
    if (!basicForm.name.trim()) errs.name = true;
    if (!basicForm.unit) errs.unit = true;
    if (basicForm.itemType === "producto") {
      if (!basicForm.bodega) errs.bodega = true;
      if (!basicForm.initialQuantity) errs.initialQuantity = true;
      if (!basicForm.initialCost) errs.initialCost = true;
    }
    if (!basicForm.basePrice) errs.basePrice = true;
    if (!basicForm.totalPrice) errs.totalPrice = true;
    if (Object.keys(errs).length > 0) {
      setBasicErrors(errs);
      showToast("Debes verificar los campos marcados en rojo para continuar", "error");
      return false;
    }
    setBasicErrors({});
    return true;
  };

  const handleBackendError = (error: any) => {
    const backendErrors = error.response?.data?.errors;
    if (!backendErrors) return;

    const newErrors: Record<string, string | boolean> = { ...basicErrors, ...advancedErrors };
    const mapBackendErrorKey = (key: string): string => {
      const map: Record<string, string> = {
        'basic_info.name': 'name',
        'basic_info.reference': 'reference',
        'basic_info.barcode': 'barcode',
        'basic_info.category_id': 'categoryId',
        'basic_info.unit_measure_id': 'unit',
        'basic_info.type_item_identification_id': 'typeItemIdentificationId',
        'basic_info.standard_code_id': 'standard_code_id',
        'pricing.base_price': 'basePrice',
        'pricing.total_price': 'totalPrice',
        'pricing.default_cost_price': 'initialCost',
        'inventory.initial_stock.warehouse_id': 'bodega',
        'inventory.initial_stock.quantity': 'initialQuantity',
        'inventory.initial_stock.minimum_stock': 'minimumStock',
      };
      return map[key] || key;
    };

    let hasErrors = false;
    Object.entries(backendErrors).forEach(([key, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        newErrors[mapBackendErrorKey(key)] = messages[0];
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setBasicErrors(newErrors as Record<string, boolean>);
      setAdvancedErrors(newErrors as Record<string, string>);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBasic()) return;

    if (showAdvanced) {
       // Validate advanced
       const errs: Record<string, string> = {};
       if (itemType !== "servicio" && !hasVariants && !warehouseId) {
         errs.warehouseId = "Debe seleccionar una bodega";
       }
       if (Object.keys(errs).length > 0) {
         setAdvancedErrors(errs);
         showToast("Por favor, completa todos los campos obligatorios.", "error");
         return;
       }
       setAdvancedErrors({});
       
       const payload = buildPayload();
       createItem(payload as any, {
         onSuccess: (resp: any) => {
           handleClose();
           const createdItem = resp?.data?.item || resp?.data?.data || resp?.data || resp;
           onCreated?.(createdItem);
         },
         onError: handleBackendError,
       });
    } else {
       // Basic submit
       const unitMeasureIdBasic = parseInt(basicForm.unit) || 1;
       const warehouse = catalogs?.warehouses?.find(
         (w: any) => w.name?.toLowerCase() === basicForm.bodega?.toLowerCase()
       );
       const warehouseIdBasic = warehouse?.id ?? 1;
       const taxRateIds = basicForm.tax && basicForm.tax !== "0" ? [Number(basicForm.tax)] : [];

       const typeItemId = basicForm.itemType === "producto" ? 1 : basicForm.itemType === "servicio" ? 2 : 3;

       const payload: any = {
         basic_info: {
           type_item_id: typeItemId,
           type_item_identification_id: 1,
           name: basicForm.name,
           reference: basicForm.reference || undefined,
           category_id: basicForm.categoryId ? Number(basicForm.categoryId) : undefined,
           unit_measure_id: unitMeasureIdBasic,
           has_variants: false,
         },
         pricing: {
           base_price: parseFloat(basicForm.basePrice) || 0,
           total_price: parseFloat(basicForm.totalPrice) || 0,
           default_cost_price: parseFloat(basicForm.initialCost) || 0,
           apply_to_variants: false,
           tax_rate_ids: taxRateIds,
           price_lists: [{ id: 1, value: parseFloat(basicForm.totalPrice) || 0 }],
         },
         ...(basicForm.itemType === "producto" && {
           inventory: {
             initial_stock: {
               warehouse_id: warehouseIdBasic,
               quantity: parseFloat(basicForm.initialQuantity) || 0,
             },
           },
         }),
       };

       createItem(payload, {
         onSuccess: (resp: any) => {
           handleClose();
           const createdItem = resp?.data?.item || resp?.data?.data || resp?.data || resp;
           onCreated?.(createdItem);
         },
         onError: handleBackendError,
       });
    }
  };

  /* ================================================================ */
  /* ADVANCED sub-handlers (mirrors NewItemForm)                      */
  /* ================================================================ */
  const handleSaveTaxRate = async (newTaxRate: any) => {
    const response = await catalogsApi.createTaxRate({ ...newTaxRate, type: "percentage" });
    const created = response?.data?.tax_rates?.[0] ?? response?.data?.tax_rate ?? response?.data ?? newTaxRate;
    invalidateCatalog(queryClient, QUERY_KEYS.catalogs.taxRates());
    if (created.id) setTaxId(Number(created.id));
    showToast(`El impuesto "${created.name ?? newTaxRate.name}" ha sido creado.`, "success");
  };

  const handleSaveCategory = (newCategory: { id: number; name: string }) => {
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
    } catch {
      showToast("Ocurrió un error al crear la bodega. Intenta de nuevo.", "error");
    }
  };

  const handleSaveCustomField = async (newField: any) => {
    const typeMap: Record<string, number> = { text: 1, number: 2, decimal: 3, date: 4, boolean: 5, select: 6 };
    const sanitizeCode = (v: string) =>
      `CF_${v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "") || Date.now()}`;
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
      ...(newField.type === "select" ? { options: (newField.options || []).filter(Boolean).map((o: string, i: number) => ({ value: o.trim(), label: o.trim(), order: i + 1 })) } : {}),
    };
    await customFieldsApi.createCustomField(payload);
    invalidateCatalog(queryClient, QUERY_KEYS.catalogs.customFields());
    showToast(`El campo "${newField.name}" ha sido creado.`, "success");
  };

  /* ================================================================ */
  /* RENDER                                                           */
  /* ================================================================ */
  const advancedContentNode = (
    <div className="space-y-4 px-1 py-2">
      <ItemConfigurationSection
        itemType={itemType}
        hasVariants={hasVariants}
        inventariable={isInventoriable}
        onInventariableChange={setIsInventoriable}
        ventaNegativo={allowNegativeStock}
        onVentaNegativoChange={setAllowNegativeStock}
        images={images}
        onImagesClick={() => setIsGalleryOpen(true)}
        name={name}
        totalPrice={totalPrice}
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
        setInitialStock={(val) => {
           setInitialStock(val);
           setBasicForm(f => ({ ...f, initialQuantity: String(val) }));
        }}
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
  );

  return (
    <>
      <NewItemModal
        open={open}
        onClose={handleClose}
        form={basicForm}
        setForm={(updater) => {
          setBasicForm((prev) => {
            const next = typeof updater === "function" ? (updater as any)(prev) : updater;
            if (next.itemType !== prev.itemType && next.itemType === "combo") {
              setShowAdvanced(true);
            }
            return next;
          });
        }}
        errors={basicErrors}
        setErrors={setBasicErrors}
        onSubmit={handleSubmit}
        onAdvanced={handleToggleAdvanced}
        isCreating={isCreating}
        catalogs={catalogs}
        advancedContent={advancedContentNode}
        advancedExpanded={showAdvanced}
        onToggleAdvanced={handleToggleAdvanced}
      />

      {/* ---- Sub-modals for advanced form ---- */}
      <NewTaxRateModal
        open={isTaxModalOpen}
        onOpenChange={setIsTaxModalOpen}
        taxTypes={catalogs?.taxTypes || []}
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
      <CustomFieldModal
        open={isCustomFieldModalOpen}
        onOpenChange={setIsCustomFieldModalOpen}
        fieldTypes={catalogs?.typeCustomFields}
        onSave={handleSaveCustomField}
      />
      <ItemGalleryModal
        open={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
        images={images}
        onImagesChange={setImages}
      />
    </>
  );
}
