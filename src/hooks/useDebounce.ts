import * as React from "react";

/**
 * Retorna el valor debounceado: solo se actualiza cuando el valor
 * deja de cambiar durante `delay` milisegundos.
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
