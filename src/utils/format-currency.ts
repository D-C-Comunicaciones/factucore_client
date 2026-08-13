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
