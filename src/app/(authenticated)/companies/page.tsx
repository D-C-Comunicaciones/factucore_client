"use client"

import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { useTenants } from "@/hooks/use-tenants"
import { createTenantColumns } from "@/components/tenants/tenant-columns"
import { CreateTenantDialog } from "@/components/tenants/create-tenant-dialog"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import type { Tenant } from "@/types/tenant"
import type { CreateTenantInput } from "@/types/tenant"

export default function CompaniesPage() {
    const { tenants, isLoading, createTenant, toggleStatus, deleteTenant } = useTenants()
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    const handleEdit = (tenant: Tenant) => {
        setSelectedTenant(tenant)
        console.log("Editar empresa:", tenant)
    }

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar esta empresa?")) {
            await deleteTenant(id)
        }
    }

    const handleCreate = async (data: CreateTenantInput) => {
        await createTenant(data)
    }

    const columns = createTenantColumns({
        onToggleStatus: async (id: number) => { await toggleStatus(id) },
        onEdit: handleEdit,
        onDelete: handleDelete,
    })

    return (
        <>
            <div className="flex flex-1 flex-col gap-6 border border-t-0 rounded-b-lg shadow-sm p-6 mx-4 mb-4 bg-background">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold">Empresas</h2>
                        <p className="text-muted-foreground">
                            Gestiona las empresas registradas en el sistema
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)} disabled={isLoading}>
                        <IconPlus />
                        Nueva Empresa
                    </Button>
                </div>

                <DataTable
                    data={tenants}
                    columns={columns}
                    searchKey="name"
                    searchPlaceholder="Buscar empresa..."
                    isLoading={isLoading}
                />
            </div>

            <CreateTenantDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreate}
            />
        </>
    )
}
