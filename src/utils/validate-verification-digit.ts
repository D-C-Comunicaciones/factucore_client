// utils/validateVerificationDigit.ts

/**
 * Valida y calcula el dígito de verificación DIAN para un NIT colombiano.
 * @param nit string o número
 * @returns número del dígito de verificación o null si no es válido
 */
export function validateVerificationDigit(nit: string | number): number | null {
  const nitStr = String(nit).trim()
  if (!/^[0-9]+$/.test(nitStr)) return null
  const secuencia = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71]
  const digits = nitStr.split("").reverse()
  let suma = 0
  for (let i = 0; i < digits.length; i++) {
    suma += parseInt(digits[i], 10) * secuencia[i]
  }
  const resto = suma % 11
  if (resto === 0 || resto === 1) return resto
  return 11 - resto
}
