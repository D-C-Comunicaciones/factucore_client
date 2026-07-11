import * as React from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";

export interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  icon?: React.ReactNode;
}

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 600,
  icon = <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />,
  className,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = React.useState(initialValue);

  // Debounce the local state value
  const debouncedValue = useDebounce(value, debounce);

  // Notify parent when debounced value changes
  React.useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // Sync local state if parent changes value externally
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="relative w-full">
      {icon}
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`h-8 w-full ${icon ? "pl-9" : "pl-3"} pr-2 border border-gray-200 rounded-md text-xs bg-white ${className || ""}`}
      />
    </div>
  );
}
