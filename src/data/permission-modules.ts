// Diccionario de nombres legibles para los `module` reales devueltos por
// GET /permissions y GET /roles/{id} (ver Anexo A de users_roles_permissions_tenant.md).
// El backend no expone un "nombre bonito" de módulo — se mantiene aquí.
export const PERMISSION_MODULE_LABELS: Record<string, string> = {
    dashboard: "Panel principal",
    plans: "Plan y suscripción",
    audits: "Auditoría",
    software: "Software contable",
    certificate: "Certificado digital",
    resolutions: "Resoluciones de facturación",
    acquirer: "Adquiriente (DIAN)",
    invoices: "Facturas",
    items: "Inventario",
    customers: "Clientes",
    sellers: "Vendedores",
    payment_terms: "Términos de pago",
    credit_notes: "Notas crédito",
    quotations: "Cotizaciones",
    remissions: "Remisiones",
    purchase_orders: "Órdenes de compra",
    payments: "Pagos",
    inventory: "Ajustes de inventario",
    cost_centers: "Centros de costo",
    currencies: "Monedas",
    integrations: "Integraciones",
    company: "Empresa",
    users: "Usuarios",
    roles: "Roles",
    permissions: "Permisos",
    comments: "Comentarios",
}

export function getModuleLabel(module: string): string {
    if (PERMISSION_MODULE_LABELS[module]) return PERMISSION_MODULE_LABELS[module]
    return module
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
}
