"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { showToast } from "@/components/sonner/CustomToaster";
import { useCatalogs } from "@/hooks/useCatalogs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { Resolution } from "@/lib/resolutions";

const baseSchema = z.object({
  type_resolution_id: z.coerce.number().min(1, "El tipo de documento es obligatorio"),
  name: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  current_number: z.coerce.number().optional().default(0),
  is_main: z.boolean().default(false),
  is_automatic_numbering: z.boolean().default(true),

  prefix: z.string().optional(),
  from_number: z.coerce.number().optional(),
  to_number: z.coerce.number().optional(),
  resolution_number: z.string().optional(),
  resolution_date: z.string().optional(),
  valid_from: z.string().optional(),
  valid_to: z.string().optional(),
  technical_key: z.string().optional(),
  resolution_text: z.string().optional(),
});

const formSchema = baseSchema.superRefine((data, ctx) => {
  const t = data.type_resolution_id;

  if (t === 1) {
    if (!data.technical_key) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Obligatorio", path: ["technical_key"] });
  }

  if ([1, 2, 10].includes(t)) {
    if (!data.prefix) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Obligatorio", path: ["prefix"] });
    if (!data.from_number) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Obligatorio", path: ["from_number"] });
    if (!data.to_number) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Obligatorio", path: ["to_number"] });
    if (!data.resolution_number) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Obligatorio", path: ["resolution_number"] });
    if (!data.resolution_date) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Obligatorio", path: ["resolution_date"] });
    if (!data.valid_from) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Obligatorio", path: ["valid_from"] });
    if (!data.valid_to) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Obligatorio", path: ["valid_to"] });
  }

  if (t === 12) {
    if (!data.from_number) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Obligatorio", path: ["from_number"] });
  }
});

interface ResolutionFormProps {
  initialData?: Partial<Resolution>;
  onSubmit: (data: Partial<Resolution>) => Promise<void>;
  isLoading?: boolean;
  isLoadingData?: boolean;
}

export function ResolutionForm({ initialData, onSubmit, isLoading, isLoadingData }: ResolutionFormProps) {
  const router = useRouter();
  const { typeResolutions, isLoading: catalogsLoading } = useCatalogs();

  const [isGeneralOpen, setIsGeneralOpen] = React.useState(true);
  const [isDianOpen, setIsDianOpen] = React.useState(true);

  const isEditMode = !!initialData?.id;

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<z.infer<typeof baseSchema>>,
    defaultValues: {
      type_resolution_id: initialData?.type_resolution_id || 0,
      name: initialData?.name || "",
      current_number: initialData?.current_number || 0,
      is_main: initialData?.is_main || false,
      is_automatic_numbering: initialData?.is_automatic_numbering ?? true,
      prefix: initialData?.prefix || "",
      from_number: initialData?.from_number || undefined,
      to_number: initialData?.to_number || undefined,
      resolution_number: initialData?.resolution_number || "",
      resolution_date: initialData?.resolution_date || "",
      valid_from: initialData?.valid_from || "",
      valid_to: initialData?.valid_to || "",
      technical_key: initialData?.technical_key || "",
      resolution_text: initialData?.footer_text || initialData?.resolution_text || "",
    },
  });

  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      form.reset({
        type_resolution_id: initialData.type_resolution_id || 0,
        name: initialData.name || "",
        current_number: initialData.current_number || 0,
        is_main: initialData.is_main || false,
        is_automatic_numbering: initialData.is_automatic_numbering ?? true,
        prefix: initialData.prefix || "",
        from_number: initialData.from_number || undefined,
        to_number: initialData.to_number || undefined,
        resolution_number: initialData.resolution_number || "",
        resolution_date: initialData.resolution_date || "",
        valid_from: initialData.valid_from || "",
        valid_to: initialData.valid_to || "",
        technical_key: initialData.technical_key || "",
        resolution_text: initialData.footer_text || initialData.resolution_text || "",
      });
    }
  }, [initialData, form]);

  const selectedType = form.watch("type_resolution_id");
  const isAutomatic = form.watch("is_automatic_numbering");

  // Type definitions based on rules
  const requiresFullDIAN = selectedType === 1;
  const requiresBaseDIAN = [1, 2, 10].includes(selectedType);
  const isInventoryAdj = selectedType === 12;

  const handleSubmit = async (values: z.infer<typeof baseSchema>) => {
    try {
      if (isEditMode) {
        // Enviar solo campos editados (dirtyFields)
        const dirtyFields = form.formState.dirtyFields;
        const dataToSubmit: any = {};
        let hasChanges = false;

        Object.keys(dirtyFields).forEach((key) => {
          dataToSubmit[key] = (values as any)[key];
          hasChanges = true;
        });

        if (!hasChanges) {
          showToast("No se han realizado cambios", "info");
          return;
        }
        await onSubmit(dataToSubmit);
      } else {
        await onSubmit(values);
      }
    } catch (error) {
      console.error("Form error:", error);
    }
  };

  const handleInvalid = () => {
    showToast("Debes verificar los campos marcados en rojo para continuar", "error");
  };

  const parseDateForPicker = (dateStr?: string) => {
    if (!dateStr) return undefined;

    if (dateStr.includes("/")) {
      const parts = dateStr.split(" ")[0].split("/");
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00`);
      }
    }

    return new Date(dateStr + "T12:00:00");
  };

  const inputClasses = "border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary text-foreground";
  const labelClasses = "text-foreground font-medium flex items-center gap-1";
  const iconClasses = "w-4 h-4 text-primary";

  const renderTooltip = (content: string) => (
    <Tooltip>
      <TooltipTrigger type="button" tabIndex={-1} className="cursor-help" onClick={(e) => e.preventDefault()}>
        <HelpCircle className={iconClasses} />
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-[#2d2d2d] text-white max-w-[280px]">
        {content}
      </TooltipContent>
    </Tooltip>
  );

  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 animate-pulse">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
            <div>
              <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-64 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-100 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit, handleInvalid)} className="space-y-6">

          {/* BLOQUE: CONFIGURACIÓN GENERAL */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div
              className="flex items-center justify-between p-6 pb-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsGeneralOpen(!isGeneralOpen)}
            >
              <div className="flex items-center gap-2">
                {isGeneralOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Configuración general</h2>
                  <p className="text-sm text-gray-500">Agrega los datos principales de tu numeración</p>
                </div>
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <FormField
                  control={form.control}
                  name="is_main"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormLabel className="text-sm font-medium text-foreground cursor-pointer">Preferida</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      {renderTooltip("Si marcas esta numeración como preferida será seleccionada por defecto cuando vayas a crear un documento.")}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {isGeneralOpen && (
              <div className="p-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <FormField
                  control={form.control}
                  name="type_resolution_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClasses}>Tipo de documento *</FormLabel>
                      <FormControl>
                        <SearchableSelect
                          value={String(field.value || "")}
                          onValueChange={(val) => field.onChange(Number(val))}
                          options={typeResolutions.map((t) => ({ value: String(t.id), label: t.name }))}
                          placeholder="Selecciona tipo de Numeración"
                          disabled={isEditMode || catalogsLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_automatic_numbering"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 h-full mt-6">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium text-foreground cursor-pointer">Numeración automática</FormLabel>
                      {renderTooltip("Al activar esta opción el sistema generará el siguiente número correlativo de forma automática.")}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClasses}>Nombre *</FormLabel>
                      <FormControl>
                        <Input placeholder="Escribe un nombre para identificar esta numeración" {...field} className={inputClasses} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="current_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClasses}>Próximo documento * {renderTooltip("Ingresa el número con el que se creará tu próxima factura.")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                          className={inputClasses}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Solo muestra "from_number" en ajustes de inventario o si se requiere */}
                {isInventoryAdj && (
                  <FormField
                    control={form.control}
                    name="from_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClasses}>Desde el número *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Si NO es un doc DIAN (que ya tiene prefix abajo), pero queremos dejarlo opcional */}
                {!requiresBaseDIAN && !isInventoryAdj && selectedType > 0 && (
                  <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClasses}>Prefijo {renderTooltip("Te permite diferenciar entre varias numeraciones, por ejemplo para distintos puntos de venta.")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. COT" {...field} className={inputClasses} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              </div>
            )}
          </div>

          {/* BLOQUE: AUTORIZACIÓN DIAN */}
          {requiresBaseDIAN && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div
                className="flex items-center gap-2 p-6 pb-4 cursor-pointer hover:bg-gray-50 transition-colors mb-2"
                onClick={() => setIsDianOpen(!isDianOpen)}
              >
                {isDianOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Autorización DIAN</h2>
                  <p className="text-sm text-gray-500">Ingresa la información correspondiente para la DIAN</p>
                </div>
              </div>

              {isDianOpen && (
                <div className="p-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-start">
                    <FormField
                      control={form.control}
                      name="prefix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClasses}>Prefijo {renderTooltip("Te permite diferenciar entre varias numeraciones, por ejemplo para distintos puntos de venta.")}</FormLabel>
                          <FormControl>
                            <Input placeholder="SETT" {...field} className={inputClasses} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="valid_from"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClasses}>Vigencia desde {renderTooltip("Fecha de inicio de la vigencia de la resolución.")}</FormLabel>
                          <FormControl>
                            <DatePickerSimple
                              value={parseDateForPicker(field.value)}
                              onChange={(date) => field.onChange(format(date, "yyyy-MM-dd"))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="valid_to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClasses}>Vigencia hasta {renderTooltip("Fecha de fin de la vigencia de la resolución.")}</FormLabel>
                          <FormControl>
                            <DatePickerSimple
                              value={parseDateForPicker(field.value)}
                              onChange={(date) => field.onChange(format(date, "yyyy-MM-dd"))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-start">
                    <FormField
                      control={form.control}
                      name="from_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClasses}>Desde el número {renderTooltip("Campo informativo para identificar desde dónde puedes facturar con esta numeración.")}</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              inputMode="numeric"
                              placeholder="1"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                              className={inputClasses}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="to_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClasses}>Hasta el número {renderTooltip("Campo informativo para identificar hasta dónde puedes facturar con esta numeración.")}</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              inputMode="numeric"
                              placeholder="500000"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                              className={inputClasses}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-1 space-y-4">
                      <FormField
                        control={form.control}
                        name="resolution_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClasses}>Número de formulario {renderTooltip("Indica aquí el número de resolución otorgado por la DIAN.")}</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: 18760000001" {...field} className={inputClasses} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="resolution_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClasses}>Fecha de Resolución {renderTooltip("Fecha de expedición de la resolución.")}</FormLabel>
                            <FormControl>
                              <DatePickerSimple
                                value={parseDateForPicker(field.value)}
                                onChange={(date) => field.onChange(format(date, "yyyy-MM-dd"))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {requiresFullDIAN && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
                      <FormField
                        control={form.control}
                        name="technical_key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClasses}>Clave Técnica * {renderTooltip("Clave alfanumérica proporcionada por la DIAN para la facturación electrónica.")}</FormLabel>
                            <FormControl>
                              <Input placeholder="Clave proporcionada por DIAN" {...field} className={inputClasses} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="resolution_text"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClasses}>Texto de Resolución {renderTooltip("Indica aquí la información relacionada con la autorización otorgada por la DIAN, será visible en el pie de factura.")}</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Autorización de numeración de facturación N°18760000001 de 2019-01-19 Modalidad Factura Electrónica Desde N° 990000000 hasta 995000000 con vigencia hasta 2030-01-19." {...field} className={`bg-white resize-none h-10 ${inputClasses}`} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Los campos marcados con <span className="text-primary">*</span> son obligatorios</span>
            <div className="flex gap-4">
              <Button
                type="button"
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push("/resolutions")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px] cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>

        </form>
      </Form>
    </TooltipProvider>
  );
}
