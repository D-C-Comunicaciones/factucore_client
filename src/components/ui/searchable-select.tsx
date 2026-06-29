"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

export interface SearchableSelectOption {
  /** Unique value (what gets stored/sent) */
  value: string;
  /** Human-readable label shown in the list */
  label: string;
}

export interface SearchableSelectProps {
  /** Current selected value */
  value?: string;
  /** Callback when value changes */
  onValueChange: (value: string) => void;
  /** Array of options */
  options: SearchableSelectOption[];
  /** Placeholder shown when nothing is selected */
  placeholder?: string;
  /** Placeholder for the search input inside the dropdown */
  searchPlaceholder?: string;
  /** Message shown when no results match the search */
  emptyMessage?: string;
  /** Extra className for the trigger button */
  className?: string;
  /** Extra className for the dropdown content */
  contentClassName?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Optional footer element (e.g. "New item" button) rendered below the list */
  footer?: React.ReactNode;
  /** Optional error icon shown inside the trigger */
  errorIcon?: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Seleccionar",
  searchPlaceholder = "Buscar.",
  emptyMessage = "No se encontraron resultados.",
  className,
  contentClassName,
  disabled = false,
  footer,
  errorIcon,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            // Match the project's base input styling
            "flex w-full items-center justify-between gap-2 rounded-lg border border-foreground/20 bg-white px-3 py-2 text-sm whitespace-nowrap transition-colors outline-none hover:border-primary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50 h-9 cursor-pointer",
            className,
          )}
        >
          <span
            className={cn(
              "truncate text-left",
              !selectedOption && "text-muted-foreground"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            {errorIcon}
            <ChevronDown className="size-4 opacity-50" />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className={cn(
          "min-w-[var(--radix-popover-trigger-width)] w-auto max-w-[400px] p-0 bg-white border border-border rounded-xl shadow-xl",
          contentClassName,
        )}
      >
        <Command
          filter={(value, search) => {
            const option = options.find((o) => o.value === value);
            if (!option) return 0;

            const normalize = (str: string) =>
              str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

            return normalize(option.label).includes(normalize(search)) ? 1 : 0;
          }}
        >
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>{options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onValueChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
                className="rounded-lg cursor-pointer transition-colors data-[selected=true]:bg-primary/5 data-[selected=true]:text-primary hover:bg-primary/5 hover:text-primary group/item relative"
              >
                <span className="flex-1 truncate">{option.label}</span>
                {value === option.value && (
                  <Check className="size-4 text-primary shrink-0" />
                )}
                {/* Custom tooltip — shows full label on hover */}
                <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 hidden group-hover/item:block whitespace-nowrap rounded-md bg-[#2563eb] px-2.5 py-1.5 text-xs font-medium text-white shadow-lg">
                  {option.label}
                </span>
              </CommandItem>
            ))}</CommandGroup>

          </CommandList>

          {/* Optional footer (e.g. "+ Nueva categoría") */}
          {footer && (
            <div className="border-t border-border p-1">
              {footer}
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
