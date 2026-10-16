import { useQuery } from "@tanstack/react-query";
import { dashboardApi, DashboardRange, DashboardSummary } from "@/lib/dashboard";

const MONTH_ABBR = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// "2026-09-01" -> "1 sep" (fechas del backend siempre vienen en formato Y-m-d, sin hora,
// así que parsear con new Date() arriesga un corrimiento de zona horaria — se parsea a mano).
function formatShortDate(isoDate: string, withDe = false): string {
    const [, month, day] = isoDate.split("-").map(Number);
    const dayNum = Number(day);
    const label = MONTH_ABBR[(month ?? 1) - 1] ?? "";
    return withDe ? `${dayNum} de ${label}` : `${dayNum} ${label}`;
}

const CHART_COLORS = ["#ef4444", "#3b82f6", "#6366f1", "#14b8a6", "#f59e0b"];

/**
 * Traduce la respuesta real de /dashboard (nombres de campo en inglés, shape propio del
 * backend) a las mismas props que ya esperan los widgets — así ningún widget necesita
 * tocarse, solo la página que hoy les pasa datos mock.
 */
export function mapDashboardSummary(data: DashboardSummary) {
    const gastosTotal = data.expense_distribution.reduce((sum, g) => sum + g.amount, 0);
    const productosTotal = data.top_products.reduce((sum, p) => sum + p.total, 0);
    const clientesTotal = data.top_customers.reduce((sum, c) => sum + c.total, 0);

    return {
        cuentasPorCobrar: {
            total: data.accounts_receivable.total,
            vigentes: { valor: data.accounts_receivable.current.amount, documentos: data.accounts_receivable.current.count },
            vencidas: { valor: data.accounts_receivable.overdue.amount, documentos: data.accounts_receivable.overdue.count },
        },
        cuentasPorPagar: {
            total: data.accounts_payable.total,
            vigentes: { valor: data.accounts_payable.current.amount, documentos: data.accounts_payable.current.count },
            vencidas: { valor: data.accounts_payable.overdue.amount, documentos: data.accounts_payable.overdue.count },
        },
        impuestos: { total: data.taxes_on_sales },
        productosVendidos: { total: data.products_sold },
        devoluciones: { total: data.customer_returns },
        clientesConVentas: { total: data.customers_with_sales },
        totalVentas: {
            data: data.sales_total.series.map((p) => ({ fecha: formatShortDate(p.date, true), valor: p.total })),
            total: data.sales_total.total,
            porcentaje: data.sales_total.change_percent,
        },
        flujoTransacciones: {
            data: data.transactions_flow.series.map((p) => ({ fecha: formatShortDate(p.date), ingresos: p.income, egresos: p.expense })),
            totalIngresos: data.transactions_flow.total_income,
            totalEgresos: data.transactions_flow.total_expense,
            porcentajeIngresos: data.transactions_flow.income_change_percent,
            porcentajeEgresos: data.transactions_flow.expense_change_percent,
        },
        distribucionGastos: {
            gastos: data.expense_distribution.map((g, i) => ({
                concepto: g.name,
                valor: g.amount,
                porcentaje: g.percent,
                color: CHART_COLORS[i % CHART_COLORS.length],
            })),
            total: gastosTotal,
        },
        productosMasVendidos: {
            productos: data.top_products.map((p) => ({
                nombre: p.name,
                cantidad: p.quantity,
                ventas: p.total,
                porcentaje: productosTotal > 0 ? Math.round((p.total / productosTotal) * 100) : 0,
            })),
            total: productosTotal,
        },
        mejoresClientes: {
            clientes: data.top_customers.map((c) => ({
                nombre: c.name,
                documentos: c.document_count,
                ventas: c.total,
                porcentaje: clientesTotal > 0 ? Math.round((c.total / clientesTotal) * 100) : 0,
            })),
            total: clientesTotal,
        },
    };
}

export type MappedDashboardData = ReturnType<typeof mapDashboardSummary>;

export function useDashboardStats(range: DashboardRange) {
    const query = useQuery({
        queryKey: ["dashboard", "summary", range],
        queryFn: async () => {
            const res = await dashboardApi.getSummary(range);
            return res.data as DashboardSummary;
        },
        staleTime: 1000 * 60, // 1 min — suficientemente fresco sin refetch en cada render
    });

    const mapped = query.data ? mapDashboardSummary(query.data) : null;

    return { ...query, mapped };
}
