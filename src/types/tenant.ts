import { z } from "zod"

export const tenantSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    status: z.enum(["active", "inactive"]),
    created_at: z.string(),
    updated_at: z.string(),
})

export const createTenantSchema = z.object({
    id: z.string().min(3, "El ID debe tener al menos 3 caracteres"),
    company_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    nit: z.string().min(5, "El NIT debe tener al menos 5 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(7, "Teléfono inválido"),
    address: z.string().min(5, "Dirección inválida"),
    city: z.string().min(2, "Ciudad inválida"),
    country: z.string().length(2, "Código de país inválido"),
    plan_id: z.string().min(1, "Debe seleccionar un plan"),
    admin_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    admin_email: z.string().email("Email inválido"),
    admin_password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
})

export const updateTenantSchema = createTenantSchema.partial()

export type Tenant = z.infer<typeof tenantSchema>
export type CreateTenantInput = z.infer<typeof createTenantSchema>
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>
