/**
 * Acepta ISO ("2026-09-02T00:00:00.000000Z"), "YYYY-MM-DD" o un valor ya formateado como
 * "DD/MM/YYYY" (en cuyo caso se devuelve tal cual, para no volver a "formatear" un string que ya
 * lo está — evita el "undefined/undefined" de re-parsear una fecha ya legible).
 */
export function formatDate(dateStr?: string | null): string {
    if (!dateStr) return "-";
    if (dateStr.includes("/")) return dateStr;
    const [y, m, d] = dateStr.split("-");
    if (!y || !m || !d) return "-";
    return `${d.slice(0, 2)}/${m}/${y}`;
}
