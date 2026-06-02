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
import { useDebounce } from "@/hooks/useDebounce"; // Asumiré que existe o lo crearé

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
}

export function AsyncSearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Seleccionar",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron resultados.",
  className,
  contentClassName,
  disabled = false,
  loading = false,
  onSearchChange,
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
            "border-input data-[placeholder]:text-muted-foreground flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-[34px]",
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
        </Command>
      </PopoverContent>
    </Popover>
  );
}
