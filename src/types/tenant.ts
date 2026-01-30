import { z } from "zod"

export const tenantSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    status: z.enum(["active", "inactive"]),
    created_at: z.string(),
    updated_at: z.string(),
})

export const createTenantSchema = z.object({
    company_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    nit: z.string().min(5, "El NIT debe tener al menos 5 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().optional().or(z.literal("")).nullable(),
    address: z.string().optional().or(z.literal("")).nullable(),
    municipality_id: z.number({ message: "Municipio requerido" }),
    type_document_identification_id: z.number({ message: "Tipo de documento requerido" }),
    plan_id: z.number({ message: "Plan requerido" }),
    admin_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    admin_email: z.string().email("Email inválido"),
    admin_password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
})

export const updateTenantSchema = createTenantSchema.partial()

export type Tenant = z.infer<typeof tenantSchema>
export type CreateTenantInput = z.infer<typeof createTenantSchema>
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>
