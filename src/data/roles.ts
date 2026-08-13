export type RoleName = "Administrador" | "Contador" | "Vendedor" | "Asistente"

export type AccessLevel = "full" | "read" | "limited" | "none"

export type ModuleKey =
    | "Ventas"
    | "Contactos"
    | "Inventario"
    | "Gastos"
    | "Bancos"
    | "Reportes"
    | "Contabilidad"
    | "Pagos"
    | "Configuración"
    | "Suscripciones"

export interface RoleDefinition {
    name: RoleName
    slug: string
    description: string
    users: number
}

export const ROLES: RoleDefinition[] = [
    {
        name: "Administrador",
        slug: "administrador",
        description: "Acceso completo a todas las secciones de la plataforma, puede agregar o eliminar usuarios.",
        users: 1,
    },
    {
        name: "Contador",
        slug: "contador",
        description: "Acceso a todas las funciones de la plataforma, excluyendo la sección de Suscripciones y Pagos.",
        users: 0,
    },
    {
        name: "Vendedor",
        slug: "vendedor",
        description: "Acceso total a la sección de Ventas y Contactos, acceso limitado a la función de Pagos, y acceso de solo lectura en Inventario.",
        users: 0,
    },
    {
        name: "Asistente",
        slug: "asistente",
        description: "Acceso para ver, agregar y editar en las secciones de Ventas, Gastos, Bancos, Reportes, Inventario, Contabilidad y Contactos.",
        users: 0,
    },
]

export const ACCESS_LABEL: Record<AccessLevel, string> = {
    full: "Completo",
    read: "Solo lectura",
    limited: "Limitado",
    none: "—",
}

export const MODULE_ACCESS: Record<ModuleKey, Record<RoleName, AccessLevel>> = {
    Ventas: { Administrador: "full", Contador: "full", Vendedor: "full", Asistente: "full" },
    Contactos: { Administrador: "full", Contador: "full", Vendedor: "full", Asistente: "full" },
    Inventario: { Administrador: "full", Contador: "full", Vendedor: "read", Asistente: "full" },
    Gastos: { Administrador: "full", Contador: "full", Vendedor: "none", Asistente: "full" },
    Bancos: { Administrador: "full", Contador: "full", Vendedor: "none", Asistente: "full" },
    Reportes: { Administrador: "full", Contador: "full", Vendedor: "none", Asistente: "full" },
    Contabilidad: { Administrador: "full", Contador: "full", Vendedor: "none", Asistente: "full" },
    Pagos: { Administrador: "full", Contador: "none", Vendedor: "limited", Asistente: "none" },
    Configuración: { Administrador: "full", Contador: "none", Vendedor: "none", Asistente: "none" },
    Suscripciones: { Administrador: "full", Contador: "none", Vendedor: "none", Asistente: "none" },
}

export interface PermissionItem {
    id: string
    label: string
}

export interface PermissionGroup {
    name: string
    module: ModuleKey
    items: PermissionItem[]
}

export interface PermissionTab {
    key: string
    label: string
    groups: PermissionGroup[]
}

function items(labels: string[]): PermissionItem[] {
    return labels.map((label, i) => ({ id: `${label}-${i}`, label }))
}

export const PERMISSION_TABS: PermissionTab[] = [
    {
        key: "contabilidad",
        label: "Contabilidad",
        groups: [
            {
                name: "General",
                module: "Ventas",
                items: items([
                    "Ver detalle de operaciones",
                    "Ver gráficas y tablas de la página de inicio",
                    "Eliminar archivos adjuntos en documentos",
                ]),
            },
            {
                name: "Facturas",
                module: "Ventas",
                items: items([
                    "Ver listado",
                    "Ver detalles",
                    "Crear nuevas facturas",
                    "Editar facturas por cobrar",
                    "Editar facturas borrador",
                    "Editar descuentos en facturas",
                    "Editar precios de los ítems de venta en facturas",
                    "Eliminar",
                    "Anular",
                    "Exportar facturas en Excel",
                    "Convertir facturas en recurrentes",
                ]),
            },
            {
                name: "Facturas recurrentes",
                module: "Ventas",
                items: items(["Ver listado", "Ver detalles", "Crear nuevas facturas recurrentes", "Editar facturas recurrentes", "Eliminar"]),
            },
            {
                name: "Nota de crédito",
                module: "Ventas",
                items: items(["Ver listado", "Ver detalles", "Crear nuevas notas de crédito", "Editar notas de crédito", "Eliminar", "Exportar notas de crédito en Excel"]),
            },
            {
                name: "Cotizaciones",
                module: "Ventas",
                items: items([
                    "Ver listado",
                    "Ver detalles",
                    "Crear nuevas cotizaciones",
                    "Editar cotizaciones",
                    "Editar descuentos en cotizaciones",
                    "Editar precios de productos de venta en cotizaciones",
                    "Eliminar",
                    "Exportar cotizaciones en Excel",
                ]),
            },
            {
                name: "Remisiones",
                module: "Ventas",
                items: items([
                    "Ver listado",
                    "Ver detalles",
                    "Crear nuevas remisiones",
                    "Editar",
                    "Editar descuento",
                    "Editar precios de ítems de venta en remisiones",
                    "Eliminar",
                    "Anular",
                    "Exportar remisiones en Excel",
                ]),
            },
            {
                name: "Devoluciones",
                module: "Ventas",
                items: items(["Ver listado", "Ver detalles", "Crear nuevas devoluciones", "Anular"]),
            },
            {
                name: "Contactos",
                module: "Contactos",
                items: items(["Ver listado", "Ver detalles", "Crear nuevos contactos", "Editar contactos", "Eliminar", "Exportar contactos en Excel"]),
            },
            {
                name: "Pagos",
                module: "Pagos",
                items: items(["Ver listado", "Ver detalles", "Registrar nuevos pagos", "Editar pagos", "Eliminar", "Anular"]),
            },
            {
                name: "Facturas de proveedores",
                module: "Gastos",
                items: items(["Ver listado", "Ver detalles", "Crear nuevas facturas de proveedores", "Editar facturas de proveedores", "Eliminar", "Exportar facturas en Excel"]),
            },
            {
                name: "Gastos",
                module: "Gastos",
                items: items(["Ver listado", "Ver detalles", "Crear nuevos gastos", "Editar gastos", "Eliminar", "Exportar"]),
            },
            {
                name: "Bancos",
                module: "Bancos",
                items: items([
                    "Ver listado",
                    "Ver detalles",
                    "Agregar nuevos bancos",
                    "Editar bancos",
                    "Eliminar",
                    "Ver saldos",
                    "Conciliar bancos",
                    "Activar o desactivar bancos",
                ]),
            },
            {
                name: "Inventario",
                module: "Inventario",
                items: items(["Ver listado", "Ver detalles", "Crear nuevos ítems", "Editar ítems", "Eliminar", "Activar o desactivar ítems", "Exportar ítems en Excel"]),
            },
            {
                name: "Centros de costos",
                module: "Contabilidad",
                items: items(["Ver listado", "Crear nuevos centros de costo", "Editar centros de costo", "Eliminar", "Activar o desactivar"]),
            },
            {
                name: "Reportes",
                module: "Reportes",
                items: items([
                    "Ver reporte de ventas generales",
                    "Exportar reporte de ventas generales",
                    "Ver reporte de cuentas por cobrar",
                    "Ver reporte de cuentas por pagar",
                    "Ver reporte de inventario valorizado",
                    "Ver reporte de flujo de efectivo",
                ]),
            },
            {
                name: "Contabilidad avanzada",
                module: "Contabilidad",
                items: items(["Actualizar registros contables", "Parametrización contable", "Cierre contable de resultados", "Configurar información exógena"]),
            },
        ],
    },
    {
        key: "pos",
        label: "POS",
        groups: [
            {
                name: "Ventas POS",
                module: "Ventas",
                items: items(["Ver listado de ventas POS", "Crear nuevas ventas POS", "Anular ventas POS", "Exportar ventas POS en Excel"]),
            },
            {
                name: "Turnos de caja",
                module: "Bancos",
                items: items(["Abrir turno de caja", "Cerrar turno de caja", "Ver historial de turnos"]),
            },
            {
                name: "Configuración POS",
                module: "Configuración",
                items: items(["Editar impresoras y dispositivos", "Editar métodos de pago POS"]),
            },
        ],
    },
    {
        key: "configuraciones-generales",
        label: "Configuraciones generales",
        groups: [
            {
                name: "Empresa",
                module: "Configuración",
                items: items(["Ver información de la empresa", "Editar información de la empresa"]),
            },
            {
                name: "Usuarios",
                module: "Configuración",
                items: items(["Ver listado de usuarios", "Invitar usuarios", "Editar usuarios", "Inhabilitar usuarios", "Eliminar usuarios"]),
            },
            {
                name: "Roles y permisos",
                module: "Configuración",
                items: items(["Ver roles", "Crear roles personalizados", "Editar permisos de roles", "Eliminar roles"]),
            },
            {
                name: "Numeraciones",
                module: "Configuración",
                items: items(["Ver listado", "Crear nuevas numeraciones", "Editar numeraciones", "Eliminar", "Activar o desactivar"]),
            },
            {
                name: "Certificado digital",
                module: "Configuración",
                items: items(["Ver certificado", "Cargar nuevo certificado", "Eliminar certificado"]),
            },
            {
                name: "Plantillas de impresión",
                module: "Configuración",
                items: items(["Ver plantillas", "Editar plantillas de impresión"]),
            },
            {
                name: "Monedas",
                module: "Configuración",
                items: items(["Ver listado de monedas", "Editar tasas de cambio"]),
            },
            {
                name: "Integraciones",
                module: "Configuración",
                items: items(["Ver integraciones disponibles", "Activar integraciones", "Configurar integraciones"]),
            },
            {
                name: "Suscripción y pagos",
                module: "Suscripciones",
                items: items(["Ver plan actual", "Actualizar plan", "Ver métodos de pago", "Editar métodos de pago"]),
            },
        ],
    },
]

export function isPermissionChecked(index: number, label: string, access: AccessLevel): boolean {
    if (access === "full") return true
    if (access === "none") return false
    if (access === "read") return label.toLowerCase().startsWith("ver")
    return index < 2
}
