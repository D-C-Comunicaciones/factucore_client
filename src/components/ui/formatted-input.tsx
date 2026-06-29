import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FormattedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export function FormattedInput({ value, onChange, className, ...props }: FormattedInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  const formatNumber = (val: string) => {
    if (!val) return "";
    const parts = val.split(".");
    // Format whole part with thousands separators (dots)
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(","); // Use comma for decimal separator for display
  };

  useEffect(() => {
    if (value === undefined || value === null) return;
    
    // Compare without formatting
    const currentNumeric = displayValue.replace(/\./g, "").replace(/,/g, ".");
    if (currentNumeric !== value) {
      setDisplayValue(formatNumber(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputVal = e.target.value;
    
    // Only allow numbers, dots, and commas
    inputVal = inputVal.replace(/[^0-9.,]/g, "");
    
    // Determine the numeric value (replace thousands separators with empty, decimal separator with dot)
    let numericValue = inputVal.replace(/\./g, "").replace(/,/g, ".");
    
    // Prevent multiple dots (which correspond to multiple decimal separators)
    if ((numericValue.match(/\./g) || []).length > 1) {
      const parts = numericValue.split(".");
      numericValue = parts[0] + "." + parts.slice(1).join("");
    }
    
    onChange(numericValue);
    setDisplayValue(formatNumber(numericValue));
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
}
