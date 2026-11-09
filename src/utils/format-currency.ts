import { envs } from "@/config/env";

export const formatCurrency = (value: number, currency?: string) => {
  const targetCurrency = currency || envs.defaultCurrency;

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: targetCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 20
  }).format(value);
};

/**
 * Monto con separador de miles (punto) y decimales solo cuando hay centavos —
 * sin símbolo de moneda ni style:'currency', para usar detrás de un "$" literal
 * ya puesto en el JSX (ej. dashboard). maximumFractionDigits se limita a 2
 * porque es dinero, a diferencia de formatCurrency (que permite hasta 20 y
 * puede arrastrar ruido de punto flotante en valores no exactos).
 */
export const formatAmount = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};
