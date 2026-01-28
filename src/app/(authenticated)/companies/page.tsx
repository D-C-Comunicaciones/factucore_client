"use client"

import { useState, useEffect } from "react"
import { IconPlus, IconRefresh, IconEye } from "@tabler/icons-react"
import { useTenants } from "@/hooks/use-tenants"
import { CreateTenantDialog } from "@/components/tenants/create-tenant-dialog"
import { UpdateTenantDialog } from "@/components/tenants/update-tenant-dialog"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import type { Tenant } from "@/types/tenant"
import type { CreateTenantInput } from "@/types/tenant"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function CompaniesPage() {
    const { tenants, isLoading, createTenant, toggleStatus, updateTenant, deleteTenant, fetchTenants } = useTenants()
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [tableData, setTableData] = useState<Tenant[]>([])

    // Inicializa tableData correctamente cuando cambian los tenants
    useEffect(() => {
        if (tenants && tenants.length > 0) {
            setTableData(tenants)
        }
    }, [tenants])

    // Actualiza solo el registro cambiado tras toggleStatus
    const handleToggleStatus = async (id: string) => {
        const updatedTenant = await toggleStatus(id) as Tenant | undefined
        if (updatedTenant) {
            setTableData((prev: Tenant[]) =>
                prev.map((t: Tenant) =>
                    String(t.id) === String(updatedTenant.id)
                        ? { ...t, is_active: updatedTenant.status, updated_at: updatedTenant.updated_at }
                        : t
                )
            )
        }
        // NO LLAMES fetchTenants NI MODIFIQUES NADA MÁS AQUÍ
    }

    const handleEdit = (tenant: Tenant) => {
        setSelectedTenant(tenant)
        setIsEditDialogOpen(true)
    }

    const handleView = (tenant: Tenant) => {
        setSelectedTenant(tenant)
        setIsViewDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar esta empresa?")) {
            await deleteTenant(id)
        }
    }

    const handleCreate = async (data: CreateTenantInput) => {
        await createTenant(data)
    }

    const handleUpdate = async (data: Partial<Tenant>) => {
        if (selectedTenant) {
            const { id, ...rest } = data as any
            await updateTenant(String(selectedTenant.id), rest)
            setIsEditDialogOpen(false)
            setSelectedTenant(null)
        }
    }

    const handleRefresh = () => {
        if (typeof fetchTenants === "function") {
            fetchTenants()
        }
    }

    const columns = [
        {
            accessorKey: "company_name",
            header: "Empresa",
        },
        {
            accessorKey: "nit",
            header: "NIT",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "phone",
            header: "Teléfono",
        },
        {
            accessorKey: "city",
            header: "Ciudad",
        },
        {
            accessorKey: "plan",
            header: "Plan",
            cell: ({ row }: any) => row.original.plan?.name || "",
        },
        {
            accessorKey: "is_active",
            header: "Estado",
            cell: ({ row }: any) => (
                <div className="flex items-center justify-center w-full">
                    <Switch
                        checked={!!row.original.is_active}
                        onCheckedChange={() => handleToggleStatus(row.original.id)}
                        aria-label="Activar/Inactivar"
                        className={
                            row.original.is_active
                                ? "bg-green-500 border-green-500"
                                : "bg-red-500 border-red-500"
                        }
                    />
                </div>
            ),
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }: any) => (
                <div className="flex gap-2 items-center">
                    {/* Ver detalles */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleView(row.original)}
                        title="Ver detalles"
                    >
                        <IconEye />
                    </Button>
                    {/* Editar */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(row.original)}
                        title="Editar"
                    >
                        <IconRefresh />
                    </Button>
                </div>
            ),
        },
    ]

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
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="default"
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            style={{ minWidth: 0 }}
                            onClick={handleRefresh}
                        >
                            <IconRefresh className="mr-2" />
                            Refresh
                        </Button>
                        <Button
                            onClick={() => {
                                setSelectedTenant(null)
                                setIsCreateDialogOpen(true)
                            }}
                            disabled={isLoading}
                            size="default"
                        >
                            <IconPlus />
                            Nueva Empresa
                        </Button>
                    </div>
                </div>

                <DataTable
                    data={tableData && tableData.length > 0 ? tableData : []}
                    columns={columns}
                    isLoading={isLoading}
                />
            </div>

            {/* Modal para crear */}
            <CreateTenantDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreate}
            />

            {/* Modal para editar */}
            <UpdateTenantDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSubmit={handleUpdate}
                initialData={selectedTenant}
            />

            {/* Modal para ver detalles */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalles de la empresa</DialogTitle>
                        <DialogDescription>
                            {selectedTenant && (
                                <div className="text-sm space-y-2 mt-2">
                                    <div><b>Empresa:</b> {selectedTenant.name}</div>
                                    <div><b>NIT:</b> {"nit" in selectedTenant ? (selectedTenant as any).nit ?? "N/A" : "N/A"}</div>
                                    <div><b>Email:</b> {selectedTenant.email}</div>
                                    <div><b>Teléfono:</b> {"phone" in selectedTenant ? (selectedTenant as any).phone ?? "N/A" : "N/A"}</div>
                                    <div><b>Ciudad:</b> {"city" in selectedTenant ? (selectedTenant as any).city ?? "N/A" : "N/A"}</div>
                                    <div><b>Dirección:</b> {"address" in selectedTenant ? (selectedTenant as any).address ?? "N/A" : "N/A"}</div>
                                    <div><b>País:</b> {"country" in selectedTenant ? (selectedTenant as any).country ?? "N/A" : "N/A"}</div>
                                    <div><b>Plan:</b> {"plan" in selectedTenant && (selectedTenant as any).plan?.name ? (selectedTenant as any).plan.name : "N/A"}</div>
                                    <div><b>Estado:</b> {selectedTenant.status === "active" ? "Activo" : "Inactivo"}</div>
                                    <div><b>Creado:</b> {selectedTenant.created_at}</div>
                                    <div><b>Actualizado:</b> {selectedTenant.updated_at}</div>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}
