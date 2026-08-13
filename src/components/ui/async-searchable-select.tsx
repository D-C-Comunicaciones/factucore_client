"use client";

import * as React from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
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

export interface AsyncSearchableSelectOption {
  value: string;
  label: string;
}

export interface AsyncSearchableSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: AsyncSearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  loading?: boolean;
  onSearchChange: (search: string) => void;
  footer?: React.ReactNode;
}

export function AsyncSearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Seleccionar",
  searchPlaceholder = "Buscar",
  emptyMessage = "No se encontraron resultados.",
  className,
  contentClassName,
  disabled = false,
  loading = false,
  onSearchChange,
  footer,
}: AsyncSearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Custom hook for debouncing search (if missing, we'll inline it or create it later)
  React.useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, onSearchChange]);

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
            {loading ? <Loader2 className="size-4 animate-spin opacity-50" /> : <ChevronDown className="size-4 opacity-50" />}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0 bg-white border-none rounded-xl shadow-xl",
          contentClassName,
        )}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading && options.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Buscando...
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                      className="rounded-lg cursor-pointer transition-colors data-[selected=true]:bg-primary/5 data-[selected=true]:text-primary hover:bg-primary/5 hover:text-primary"
                    >
                      <span className="flex-1 truncate">{option.label}</span>
                      {value === option.value && (
                        <Check className="size-4 text-primary shrink-0" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
          {footer && (
            <div className="p-1 border-t border-border bg-muted/20">
              {footer}
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
