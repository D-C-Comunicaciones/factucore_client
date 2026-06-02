"use client";

import * as React from "react";
import {
  X,
  HelpCircle,
  AlertCircle,
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { showToast } from "../sonner/CustomToaster";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface CustomFieldModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldTypes?: Array<{
    id?: number;
    code?: string;
    name?: string;
    label?: string;
  }>;
  onSave: (field: {
    name: string;
    type: string;
    type_id?: number;
    description: string;
    required: boolean;
    is_printable: boolean;
    default_value: string;
    options?: string[];
  }) => Promise<void> | void;
}

const FALLBACK_FIELD_TYPES = [
  { id: 1, value: "text", label: "Texto" },
  { id: 2, value: "number", label: "Número" },
  { id: 3, value: "decimal", label: "Número decimal" },
  { id: 4, value: "date", label: "Fecha" },
  { id: 5, value: "boolean", label: "Booleano" },
  { id: 6, value: "select", label: "Lista de opciones" },
];

export function CustomFieldModal({ open, onOpenChange, fieldTypes, onSave }: CustomFieldModalProps) {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("");
  const [defaultValue, setDefaultValue] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [required, setRequired] = React.useState(false);
  const [isPrintable, setIsPrintable] = React.useState(false);

  // States for advanced field types
  const [optionsList, setOptionsList] = React.useState<string[]>([]);
  const [newOption, setNewOption] = React.useState("");
  const [dateOpen, setDateOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date>();
  const [view, setView] = React.useState<"default" | "month" | "year">("default");

  const [errors, setErrors] = React.useState({
    name: false,
    type: false,
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const toCanonicalTypeValue = (input: string) => {
    const normalized = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (normalized.includes("text")) return "text";
    if (normalized.includes("number") && normalized.includes("decimal")) return "decimal";
    if (normalized.includes("decimal") || normalized.includes("float")) return "decimal";
    if (normalized.includes("number") || normalized.includes("integer") || normalized.includes("int")) return "number";
    if (normalized.includes("date")) return "date";
    if (normalized.includes("boolean") || normalized.includes("bool") || normalized.includes("yes") || normalized.includes("no")) return "boolean";
    if (normalized.includes("select") || normalized.includes("option") || normalized.includes("lista")) return "select";

    return normalized.replace(/\s+/g, "_");
  };
  const normalizedFieldTypes = React.useMemo(() => {
    const catalogTypes = Array.isArray(fieldTypes) ? fieldTypes : [];

    if (catalogTypes.length === 0) {
      return FALLBACK_FIELD_TYPES;
    }

    return catalogTypes.map((fieldType, index) => {
      const label = fieldType.label || fieldType.name || fieldType.code || `Tipo ${index + 1}`;
      const rawValue = fieldType.code || fieldType.name || fieldType.label || `type_${fieldType.id ?? index + 1}`;
      const value = toCanonicalTypeValue(rawValue);

      return {
        id: fieldType.id,
        value,
        label,
      };
    });
  }, [fieldTypes]);

  const safeMonth = tempDate ?? new Date();
  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"
  ];
  const years = Array.from({ length: 30 }, (_, i) => 2010 + i);

  React.useEffect(() => {
    if (open) {
      setName("");
      setType("");
      setDefaultValue("");
      setDescription("");
      setRequired(false);
      setIsPrintable(false);
      setErrors({ name: false, type: false });
      setOptionsList([]);
      setNewOption("");
      setTempDate(undefined);
    }
  }, [open]);

  React.useEffect(() => {
    if (dateOpen) {
      const parsedDate = defaultValue ? new Date(defaultValue + "T12:00:00") : new Date();
      setTempDate(isNaN(parsedDate.getTime()) ? new Date() : parsedDate);
      setView("default");
    }
  }, [dateOpen, defaultValue]);

  const baseInput =
    "bg-white h-[34px] px-3 text-sm border border-foreground/20 rounded-xl shadow-none text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none w-full";
  const selectItemClass =
    "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary";

  const handleTypeChange = (val: string) => {
    setType(val);
    setErrors(prev => ({ ...prev, type: false }));
    setNewOption("");
    setTempDate(undefined);

    // Auto-populate default value appropriately depending on the new selected type
    if (val === "boolean") {
      setOptionsList([]);
      setDefaultValue("true");
    } else if (val === "date") {
      setOptionsList([]);
      const todayStr = format(new Date(), "yyyy-MM-dd");
      setDefaultValue(todayStr);
      setTempDate(new Date());
    } else if (val === "select") {
      setOptionsList([""]);
      setDefaultValue("");
    } else {
      setOptionsList([]);
      setDefaultValue("");
    }
  };

  const handleNumberChange = (val: string) => {
    if (val === "" || val === "-") {
      setDefaultValue(val);
      return;
    }
    if (/^-?\d+$/.test(val)) {
      setDefaultValue(val);
    } else {
      showToast("Por favor, ingrese solo números enteros.", "error");
    }
  };

  const handleDecimalChange = (val: string) => {
    if (val === "" || val === "-" || val === "." || val === ",") {
      setDefaultValue(val);
      return;
    }
    const testVal = val.replace(",", ".");
    if (/^-?\d*\.?\d*$/.test(testVal)) {
      setDefaultValue(val);
    } else {
      showToast("Por favor, ingrese un número decimal válido.", "error");
    }
  };

  const handleUpdateOption = (idx: number, newVal: string) => {
    const updatedList = [...optionsList];
    updatedList[idx] = newVal;
    setOptionsList(updatedList);
  };

  const handleAddNewOption = () => {
    const updatedList = [...optionsList, ""];
    setOptionsList(updatedList);
  };

  const handleRemoveOptionByIndex = (idx: number) => {
    const updatedList = optionsList.filter((_, i) => i !== idx);
    setOptionsList(updatedList);

    if (updatedList.length === 0) {
      setDefaultValue("");
    }
  };

  const handleSave = async () => {
    const normalizeOptionName = (value: string) =>
      value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const newErrors = {
      name: !name.trim(),
      type: !type,
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.type) {
      showToast("Debes completar los campos obligatorios marcados en rojo.", "error");
      return;
    }

    if (type === "select" && optionsList.filter(o => o.trim()).length === 0) {
      showToast("Debes agregar al menos una opción para la Lista de opciones.", "error");
      return;
    }

    if (type === "select") {
      const normalizedOptions = optionsList
        .map(normalizeOptionName)
        .filter(Boolean);
      const uniqueOptions = new Set(normalizedOptions);

      if (uniqueOptions.size !== normalizedOptions.length) {
        showToast("No puedes repetir el mismo nombre de opción.", "error");
        return;
      }
    }

    if (type === "number" && defaultValue && !/^-?\d+$/.test(defaultValue)) {
      showToast("El valor por defecto debe ser un número entero válido.", "error");
      return;
    }

    if (type === "decimal" && defaultValue && !/^-?\d*([.,]\d+)?$/.test(defaultValue.replace(",", "."))) {
      showToast("El valor por defecto debe ser un número decimal válido.", "error");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        name,
        type,
        type_id: normalizedFieldTypes.find((fieldType) => fieldType.value === type)?.id,
        description,
        required,
        is_printable: isPrintable,
        default_value: defaultValue,
        options: type === "select" ? optionsList : undefined,
      });
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  const renderDefaultValueInput = () => {
    if (!type) {
      return (
        <input
          type="text"
          className={baseInput}
          disabled
          value=""
          placeholder="Selecciona primero un tipo de campo"
        />
      );
    }

    switch (type) {
      case "text":
        return (
          <input
            type="text"
            className={baseInput}
            value={defaultValue || ""}
            onChange={(e) => setDefaultValue(e.target.value)}
          />
        );
      case "number":
        return (
          <input
            type="text"
            className={baseInput}
            value={defaultValue || ""}
            placeholder="Ej: 15"
            onChange={(e) => handleNumberChange(e.target.value)}
          />
        );
      case "decimal":
        return (
          <input
            type="text"
            className={baseInput}
            value={defaultValue || ""}
            placeholder="Ej: 15.50"
            onChange={(e) => handleDecimalChange(e.target.value)}
          />
        );
      case "date":
        return (
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  baseInput,
                  "w-full justify-start text-left font-normal bg-white hover:bg-primary/5 cursor-pointer pr-2 shadow-none"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {defaultValue ? (
                  format(new Date(defaultValue + "T12:00:00"), "dd/MM/yyyy", { locale: es })
                ) : (
                  <span className="text-muted-foreground">Seleccionar fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[320px] p-0 rounded-xl border border-border shadow-lg bg-white z-50">
              <div className="p-2">
                {/* HEADER */}
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
                    className="p-1 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="flex-1 flex justify-center items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setView(v => v === "month" ? "default" : "month")}
                      className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      {months[safeMonth.getMonth()]}
                      {view === "month" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setView(v => v === "year" ? "default" : "year")}
                      className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      {safeMonth.getFullYear()}
                      {view === "year" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
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
                    className="p-1 rounded hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* CALENDARIO / VISTAS */}
                <div className="pt-2 pb-0">
                  {view === "default" && (
                    <Calendar
                      mode="single"
                      selected={tempDate}
                      onSelect={setTempDate}
                      locale={es}
                      hideNavigation
                      month={safeMonth}
                      className="
                        w-full
                        [&_.rdp]:w-full
                        [&_.rdp-table]:w-full
                        [&_.rdp-cell]:p-0
                        [&_button]:w-9
                        [&_button]:h-9
                        [&_button]:rounded-lg
                        [&_button]:transition-colors
                        [&_button:not([data-selected]):hover]:bg-primary/10
                        [&_button:not([data-selected]):hover]:text-primary
                        [&_[data-selected]]:bg-primary
                        [&_[data-selected]]:text-primary-foreground
                        [&_[data-selected]]:rounded-lg
                        [&_[data-selected]:hover]:bg-primary
                        [&_[data-selected]:hover]:text-primary-foreground
                        [&_[data-today]]:bg-transparent
                        [&_[data-today]]:text-foreground
                        [&_[data-today]]:border-0
                      "
                    />
                  )}

                  {/* MESES */}
                  {view === "month" && (
                    <div className="grid grid-cols-3 gap-2 p-2">
                      {months.map((m, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setTempDate(new Date(safeMonth.getFullYear(), i));
                            setView("default");
                          }}
                          className={cn(
                            "py-2 rounded-lg text-sm transition-colors hover:bg-primary/10 cursor-pointer",
                            safeMonth.getMonth() === i &&
                            "bg-primary text-primary-foreground hover:bg-primary"
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* AÑOS */}
                  {view === "year" && (
                    <div className="grid grid-cols-3 gap-2 max-h-[160px] overflow-y-auto p-2">
                      {years.map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => {
                            setTempDate(new Date(year, safeMonth.getMonth()));
                            setView("default");
                          }}
                          className={cn(
                            "py-2 rounded-lg text-sm transition-colors hover:bg-primary/10 cursor-pointer",
                            safeMonth.getFullYear() === year &&
                            "bg-primary text-primary-foreground hover:bg-primary"
                          )}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* FOOTER CALENDARIO */}
                <div className="flex justify-end items-center gap-3 mt-3 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-muted-foreground hover:bg-primary/10 text-xs h-8 cursor-pointer"
                    onClick={() => {
                      setTempDate(defaultValue ? new Date(defaultValue + "T12:00:00") : undefined);
                      setDateOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="button"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 px-3 cursor-pointer"
                    onClick={() => {
                      if (tempDate) {
                        const dateStr = format(tempDate, "yyyy-MM-dd");
                        setDefaultValue(dateStr);
                      }
                      setDateOpen(false);
                    }}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );
      case "boolean":
        return (
          <div className="flex items-center gap-6 pt-1.5 h-[34px]">
            <label className="flex items-center gap-2 text-sm font-medium text-[#475569] cursor-pointer selection-none">
              <input
                type="radio"
                name="booleanDefaultValue"
                checked={defaultValue === "true"}
                onChange={() => setDefaultValue("true")}
                className="w-4 h-4 border-border text-primary accent-primary cursor-pointer"
              />
              Sí
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-[#475569] cursor-pointer selection-none">
              <input
                type="radio"
                name="booleanDefaultValue"
                checked={defaultValue === "false"}
                onChange={() => setDefaultValue("false")}
                className="w-4 h-4 border-border text-primary accent-primary cursor-pointer"
              />
              No
            </label>
          </div>
        );
      case "select":
        return (
          <Select value={defaultValue || undefined} onValueChange={setDefaultValue}>
            <SelectTrigger className={cn(baseInput, "justify-between pr-2 shadow-none")}>
              <SelectValue placeholder="Seleccione una opción" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-xl shadow-xl p-1 z-50">
              {optionsList.filter(opt => opt.trim() !== "").map((opt, idx) => (
                <SelectItem key={idx} value={opt} className={selectItemClass}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <input
            type="text"
            className={baseInput}
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
          />
        );
    }
  };

  return (
    <TooltipProvider delayDuration={150}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-[460px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border/40 bg-white">
            <DialogTitle className="text-base font-bold text-[#123159]">Nuevo campo adicional</DialogTitle>
          </div>

          <div className="px-8 py-6 space-y-5">
            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#123159]">
                Nombre
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={cn(
                    baseInput,
                    errors.name && "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/10"
                  )}
                  value={name || ""}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setErrors(prev => ({ ...prev, name: false }));
                  }}
                />
                {errors.name && (
                  <AlertCircle className="w-4 h-4 text-[#ef4444] absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              {errors.name && (
                <p className="text-[11px] text-[#ef4444] font-medium">El nombre es requerido.</p>
              )}
            </div>

            {/* Tipo de Campo */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-[#123159]">
                Tipo de campo
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex items-center cursor-pointer p-0 border-none bg-transparent hover:opacity-80 transition-opacity">
                      <HelpCircle className="w-4 h-4 text-primary" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#123159] text-white text-xs font-semibold shadow-lg px-3 py-1.5 rounded z-50 border-none max-w-[220px]">
                    El tipo de campo, indicará que dato deseas registrar en tu campo adicional
                  </TooltipContent>
                </Tooltip>
              </label>
              <Select value={type} onValueChange={handleTypeChange}>
                <SelectTrigger className={cn(
                  baseInput,
                  "justify-between pr-2 shadow-none",
                  errors.type && "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/10"
                )}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-border rounded-xl shadow-xl p-1 z-50">
                  {normalizedFieldTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value} className={selectItemClass}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-[11px] text-[#ef4444] font-medium">El tipo de campo es requerido.</p>
              )}
            </div>

            {/* Valor por defecto */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-[#123159]">
                Valor por defecto
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex items-center cursor-pointer p-0 border-none bg-transparent hover:opacity-80 transition-opacity">
                      <HelpCircle className="w-4 h-4 text-primary" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#123159] text-white text-xs font-semibold shadow-lg px-3 py-1.5 rounded z-50 border-none max-w-[220px]">
                    Establece un valor por defecto para tu campo adicional
                  </TooltipContent>
                </Tooltip>
              </label>
              {renderDefaultValueInput()}
            </div>

            {/* Opciones de la lista (solo para Lista de opciones) */}
            {type === "select" && (
              <div className="space-y-3 border-t border-border/40 pt-4 mt-2 animate-in fade-in duration-300">
                <label className="text-sm font-semibold text-[#123159]">
                  Opciones
                </label>

                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {optionsList.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-top-1 duration-200">
                      <input
                        type="text"
                        className={baseInput}
                        value={opt || ""}
                        onChange={(e) => handleUpdateOption(idx, e.target.value)}
                        placeholder={`Opción ${idx + 1}`}
                      />
                      {optionsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionByIndex(idx)}
                          className="text-black p-1.5 cursor-pointer shrink-0 transition-none"
                        >
                          <Trash2 className="w-5 h-5 text-black" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddNewOption}
                  className="flex items-center gap-1.5 text-sm font-bold text-primary hover:opacity-85 transition-opacity cursor-pointer pl-1.5 mt-2"
                >
                  <Plus className="w-4 h-4 text-primary" />
                  Nueva opción
                </button>
              </div>
            )}

            {/* Descripción */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#123159]">
                Descripción
              </label>
              <textarea
                className={cn(
                  baseInput,
                  "h-20 py-2 resize-none"
                )}
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-sm font-medium text-[#475569] cursor-pointer selection-none">
                <input
                  type="checkbox"
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary accent-primary cursor-pointer"
                />
                Requerido
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-[#475569] cursor-pointer selection-none">
                <input
                  type="checkbox"
                  checked={isPrintable}
                  onChange={(e) => setIsPrintable(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary accent-primary cursor-pointer"
                />
                Imprimir en factura
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex items-center justify-end gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-5 py-2 hover:bg-muted text-primary text-sm font-bold rounded-xl transition-all cursor-pointer border border-transparent"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
