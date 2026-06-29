"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SectionCard } from "./SectionCard";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CircleHelp, EllipsisVertical, Plus, Trash2, ChevronDown, CalendarIcon, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { showToast } from "@/components/sonner/CustomToaster";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
export function AdditionalFieldsSection({
  customFields,
  onCustomFieldsChange,
  catalogs,
  onOpenNewFieldModal
}: {
  customFields: any[],
  onCustomFieldsChange: (v: any[]) => void,
  catalogs: any,
  onOpenNewFieldModal: () => void
}) {
  const baseInput = "bg-white h-[34px] pl-3 pr-3 text-sm border border-foreground/20 shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none flex items-center w-full rounded-xl box-border";
  const selectItemClass = "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary";

  const [search, setSearch] = React.useState("");
  const [selectedFieldIds, setSelectedFieldIds] = React.useState<number[]>([]);
  const [open, setOpen] = React.useState(false);

  const availableFields = Array.isArray(catalogs.customFields) ? catalogs.customFields : Object.values(catalogs.customFields || {});
  const filteredFields = availableFields.filter((field: any) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return String(field.name || "").toLowerCase().includes(term);
  });

  const getCanonicalFieldType = (field: any) => {
    if (typeof field.type === "string") {
      const raw = field.type.toLowerCase();
      if (raw.includes("decimal")) return "decimal";
      if (raw.includes("number") || raw.includes("integer")) return "number";
      if (raw.includes("date")) return "date";
      if (raw.includes("bool") || raw.includes("boolean")) return "boolean";
      if (raw.includes("select") || raw.includes("option")) return "select";
    }

    const typeCode = field.type?.code || field.custom_field_type?.code || "";
    const typeName = field.type?.name || field.custom_field_type?.name || "";
    const typeId = field.custom_field_type_id?.toString() || "";

    const rawType = `${typeCode} ${typeName} ${typeId}`.toLowerCase();

    if (rawType.includes("decimal") || rawType.includes("3")) return "decimal";
    if (rawType.includes("number") || rawType.includes("integer") || rawType.includes("2")) return "number";
    if (rawType.includes("date") || rawType.includes("4")) return "date";
    if (rawType.includes("bool") || rawType.includes("boolean") || rawType.includes("5")) return "boolean";
    if (rawType.includes("select") || rawType.includes("option") || rawType.includes("6")) return "select";

    return "text";
  };

  const getInputType = (field: any) => {
    const canonical = getCanonicalFieldType(field);
    if (canonical === "date") return "date";
    return "text";
  };

  const toggleSelectedField = (fieldId: number) => {
    setSelectedFieldIds((current) =>
      current.includes(fieldId)
        ? current.filter((id) => id !== fieldId)
        : [...current, fieldId]
    );
  };

  const handleAddFields = () => {
    if (selectedFieldIds.length === 0) return;

    const fieldsToAdd = availableFields.filter((field: any) => selectedFieldIds.includes(Number(field.id)));
    const alreadyAddedIds = new Set(customFields.map((field) => field.field_id));
    const newFields = fieldsToAdd.filter((field: any) => !alreadyAddedIds.has(Number(field.id)));

    if (newFields.length === 0) {
      showToast("Los campos seleccionados ya fueron agregados", "error");
      return;
    }

    onCustomFieldsChange([
      ...customFields,
      ...newFields.map((fieldObj: any) => ({
        field_id: fieldObj.id,
        name: fieldObj.name,
        type: getCanonicalFieldType(fieldObj),
        type_id: fieldObj.custom_field_type_id,
        description: fieldObj.description,
        required: fieldObj.required ?? fieldObj.is_required ?? false,
        is_printable: fieldObj.is_printable ?? fieldObj.include_in_invoice ?? false,
        default_value: fieldObj.default_value || "",
        options: fieldObj.options || [],
        value: fieldObj.default_value || "",
      })),
    ]);

    setSelectedFieldIds([]);
    setSearch("");
    setOpen(false);
  };

  return (
    <SectionCard title="Campos adicionales" defaultOpen={true}>
      <p className="text-sm text-muted-foreground mb-4">
        Conoce cómo crear campos personalizables aquí.
      </p>
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Buscar</label>
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(baseInput, "flex-1 justify-between pr-2 text-left")}
              >
                <span className="truncate text-muted-foreground">
                  {selectedFieldIds.length > 0
                    ? `${selectedFieldIds.length} campo${selectedFieldIds.length > 1 ? "s" : ""} seleccionado${selectedFieldIds.length > 1 ? "s" : ""}`
                    : "Buscar y seleccionar campos"}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-2 rounded-2xl border-[#bfd0ef] bg-white shadow-xl">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar"
                className={cn(baseInput, "mb-2 h-[34px]")}
              />

              <div className="max-h-[240px] overflow-y-auto space-y-0.5 pr-1">
                {filteredFields.length > 0 ? (
                  filteredFields.map((field: any, idx: number) => {
                    const fieldId = Number(field.id ?? idx);
                    const checked = selectedFieldIds.includes(fieldId);

                    return (
                      <label
                        key={field.id ?? field.name ?? idx}
                        className="flex h-[34px] cursor-pointer items-center gap-3 rounded-lg px-2 text-sm text-[#123159] transition-colors hover:bg-primary/5"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleSelectedField(fieldId)}
                        />
                        <span className="flex-1 truncate">{field.name}</span>
                      </label>
                    );
                  })
                ) : (
                  <p className="px-2 py-4 text-sm text-muted-foreground">No hay campos para mostrar.</p>
                )}
              </div>

              <div className="border-t border-border mt-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenNewFieldModal();
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer selection-none"
                >
                  <Plus className="w-4 h-4 text-primary" />
                  Nuevo Campo Adicional
                </button>
              </div>
            </PopoverContent>
          </Popover>
          <button
            type="button"
            onClick={handleAddFields}
            className="h-[34px] px-6 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary/20 cursor-pointer active:scale-95 flex items-center justify-center"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Renderizado de campos asignados */}
      {customFields.length > 0 && (
        <TooltipProvider delayDuration={120}>
          <div className="mt-6 space-y-4 border-t border-border/40 pt-4 animate-in fade-in duration-300">
            <h4 className="text-sm font-semibold text-[#123159]">Campos asignados</h4>
            <div className="flex flex-col gap-3">
              {customFields.map((field, idx) => {
                const hasDescription = Boolean(field.description);
                const isRequired = Boolean(field.required);

                return (
                  <div
                    key={field.field_id ?? idx}
                    className="flex flex-col gap-1.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-foreground truncate">
                            {field.name}
                          </span>
                          {field.description ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="inline-flex items-center text-muted-foreground hover:text-muted-foreground/70 transition-colors cursor-help"
                                  aria-label={`Ver descripción de ${field.name}`}
                                >
                                  <CircleHelp className="h-[14px] w-[14px]" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="flex flex-col gap-1 bg-[#1e293b] border-none shadow-lg text-white" sideOffset={5} side="top">
                                <span className="font-medium text-xs">
                                  {field.description}
                                </span>
                              </TooltipContent>
                            </Tooltip>
                          ) : null}
                          {isRequired && <span className="text-primary text-sm">*</span>}
                        </div>
                      </div>

                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        {field.type === "boolean" ? (
                          <div className="flex items-center gap-2 h-[34px]">
                            <Checkbox
                              checked={field.value === true || field.value === "true"}
                              onCheckedChange={(checked) => {
                                onCustomFieldsChange(customFields.map(f =>
                                  f.field_id === field.field_id ? { ...f, value: checked === true } : f
                                ));
                              }}
                              className="border-foreground/30"
                            />
                            <span className="text-sm font-medium text-foreground">Sí</span>
                          </div>
                        ) : field.type === "select" ? (
                          <SearchableSelect
                            value={field.value || undefined}
                            onValueChange={(value) => {
                              onCustomFieldsChange(customFields.map(f =>
                                f.field_id === field.field_id ? { ...f, value } : f
                              ));
                            }}
                            options={(field.options || []).map((option: any, optionIdx: number) => {
                              const optionValue = typeof option === "string" ? option : option.value || option.label || `opcion-${optionIdx + 1}`;
                              const optionLabel = typeof option === "string" ? option : option.label || option.value || optionValue;
                              return { value: optionValue, label: optionLabel };
                            })}
                            placeholder={field.default_value || `Seleccionar ${field.name.toLowerCase()}`}
                            searchPlaceholder={`Buscar en ${field.name.toLowerCase()}...`}
                            emptyMessage="No se encontraron opciones."
                            className={cn(baseInput, "flex-1")}
                          />

                        ) : field.type === "date" ? (
                          <CustomFieldDatePicker
                            value={field.value}
                            onChange={(val) => {
                              onCustomFieldsChange(customFields.map(f =>
                                f.field_id === field.field_id ? { ...f, value: val } : f
                              ));
                            }}
                          />
                        ) : (
                          <input
                            type={getInputType(field)}
                            inputMode={field.type === "number" ? "numeric" : field.type === "decimal" ? "decimal" : undefined}
                            step={field.type === "decimal" ? "0.01" : undefined}
                            className={cn(baseInput, "flex-1 focus:border-primary")}
                            value={field.value || ""}
                            onChange={(e) => {
                              let val = e.target.value;
                              if (field.type === "number") {
                                val = val.replace(/[^0-9-]/g, "");
                              } else if (field.type === "decimal") {
                                val = val.replace(/[^0-9.-]/g, "");
                                if ((val.match(/\./g) || []).length > 1) {
                                  val = val.replace(/\.(?=.*\.)/g, "");
                                }
                              }
                              onCustomFieldsChange(customFields.map(f =>
                                f.field_id === field.field_id ? { ...f, value: val } : f
                              ));
                            }}
                            placeholder={field.default_value || `Ingresar ${field.name.toLowerCase()}`}
                          />
                        )}
                      </div>
                      <div className="flex items-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-border bg-white text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted hover:text-foreground shadow-none"
                              aria-label={`Opciones de ${field.name}`}
                            >
                              <EllipsisVertical className="h-[18px] w-[18px]" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[140px] rounded-xl border-border bg-popover p-1 shadow-lg">
                            <DropdownMenuItem
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted focus:bg-muted cursor-pointer"
                              onClick={() => {
                                onCustomFieldsChange(customFields.filter(f => f.field_id !== field.field_id));
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-foreground" />
                              <span>Eliminar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TooltipProvider>
      )}
    </SectionCard>
  );
}

function CustomFieldDatePicker({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const [date, setDate] = React.useState<Date | undefined>(value ? parseISO(value) : undefined);
  const [tempDate, setTempDate] = React.useState<Date | undefined>(date);
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<"default" | "month" | "year">("default");

  const safeMonth = tempDate ?? new Date();

  const months = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"
  ];

  const years = Array.from({ length: 30 }, (_, i) => 2010 + i);

  React.useEffect(() => {
      if (open) {
          setTempDate(date);
          setView("default");
      }
  }, [open, date]);

  const baseInput = "bg-white h-[34px] pl-3 pr-3 text-sm border border-foreground/20 shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none flex items-center justify-between w-full rounded-xl box-border hover:bg-primary/5";

  return (
      <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
              <button
                  type="button"
                  className={cn(
                      baseInput,
                      !date && "text-muted-foreground"
                  )}
              >
                  {date ? format(date, "dd/MM/yyyy", { locale: es }) : "yyyy-MM-dd"}
                  <CalendarIcon className="h-4 w-4 text-muted-foreground ml-2" />
              </button>
          </PopoverTrigger>

          <PopoverContent
              align="start"
              className="w-[320px] p-0 rounded-xl border border-border shadow-lg"
          >
              <div className="p-2">
                  <div className="flex items-center w-full px-2 mb-2">
                      <button
                          type="button"
                          onClick={() =>
                              setTempDate(
                                  new Date(
                                      safeMonth.getFullYear(),
                                      safeMonth.getMonth() - 1
                                  )
                              )
                          }
                          className="p-1 rounded hover:bg-primary/10 transition-colors"
                      >
                          <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div className="flex-1 flex justify-center items-center gap-2">
                          <button
                              type="button"
                              onClick={() =>
                                  setView(v => v === "month" ? "default" : "month")
                              }
                              className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                          >
                              {months[safeMonth.getMonth()]}
                              {view === "month" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>

                          <button
                              type="button"
                              onClick={() =>
                                  setView(v => v === "year" ? "default" : "year")
                              }
                              className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                          >
                              {safeMonth.getFullYear()}
                              {view === "year" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                      </div>

                      <button
                          type="button"
                          onClick={() =>
                              setTempDate(
                                  new Date(
                                      safeMonth.getFullYear(),
                                      safeMonth.getMonth() + 1
                                  )
                              )
                          }
                          className="p-1 rounded hover:bg-primary/10 transition-colors"
                      >
                          <ChevronRight className="h-4 w-4" />
                      </button>
                  </div>

                  <div className="pt-2 pb-0">
                      {view === "default" && (
                          <Calendar
                              mode="single"
                              selected={tempDate}
                              onSelect={setTempDate}
                              locale={es}
                              hideNavigation
                              month={safeMonth}
                              className="w-full [&_.rdp]:w-full [&_.rdp-table]:w-full [&_.rdp-cell]:p-0 [&_button]:w-9 [&_button]:h-9 [&_button]:rounded-lg [&_button]:transition-colors [&_button:not([data-selected]):hover]:bg-primary/10 [&_button:not([data-selected]):hover]:text-primary [&_[data-selected]]:bg-primary [&_[data-selected]]:text-primary-foreground [&_[data-selected]]:rounded-lg [&_[data-selected]:hover]:bg-primary [&_[data-selected]:hover]:text-primary-foreground [&_[data-today]]:bg-transparent [&_[data-today]]:text-foreground [&_[data-today]]:border-0"
                          />
                      )}

                      {view === "month" && (
                          <div className="grid grid-cols-3 gap-3 p-3">
                              {months.map((m, i) => (
                                  <button
                                      type="button"
                                      key={i}
                                      onClick={() => {
                                          setTempDate(new Date(safeMonth.getFullYear(), i));
                                          setView("default");
                                      }}
                                      className={cn(
                                          "h-12 rounded-xl text-sm font-medium transition-colors hover:bg-primary/10",
                                          safeMonth.getMonth() === i && "bg-primary text-primary-foreground"
                                      )}
                                  >
                                      {m}
                                  </button>
                              ))}
                          </div>
                      )}

                      {view === "year" && (
                          <div className="grid grid-cols-3 gap-3 p-3 max-h-[260px] overflow-y-auto">
                              {years.map((year) => (
                                  <button
                                      type="button"
                                      key={year}
                                      onClick={() => {
                                          setTempDate(new Date(year, safeMonth.getMonth()));
                                          setView("default");
                                      }}
                                      className={cn(
                                          "h-12 rounded-xl text-sm font-medium transition-colors hover:bg-primary/10",
                                          safeMonth.getFullYear() === year && "bg-primary text-primary-foreground"
                                      )}
                                  >
                                      {year}
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>

                  <div className="flex justify-end items-center gap-3 mt-3 pt-3 border-t border-border">
                      <Button
                          variant="ghost"
                          className="text-muted-foreground hover:bg-primary/10"
                          onClick={() => {
                              setTempDate(date);
                              setOpen(false);
                          }}
                      >
                          Cancelar
                      </Button>
                      <Button
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => {
                              setDate(tempDate);
                              onChange(tempDate ? format(tempDate, "yyyy-MM-dd") : "");
                              setOpen(false);
                          }}
                      >
                          Aplicar
                      </Button>
                  </div>
              </div>
          </PopoverContent>
      </Popover>
  );
}
