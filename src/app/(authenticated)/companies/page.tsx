"use client"

import { useState, useEffect } from "react"
import { IconPlus, IconRefresh, IconEye, IconEdit } from "@tabler/icons-react"
import { useTenants } from "@/hooks/use-tenants"
import { CreateTenantDialog } from "@/components/tenants/create-tenant-dialog"
import { UpdateTenantDialog } from "@/components/tenants/update-tenant-dialog"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import type { Tenant } from "@/types/tenant"
import type { CreateTenantInput } from "@/types/tenant"
import { Switch } from "@/components/ui/switch"
import { TenantDetailsDialog } from "@/components/tenants/tenant-details-dialog"
import { apiClient } from "@/lib/api-client"
import { useRouter } from "next/navigation"

// Nuevos tipos para la respuesta del detalle
interface TenantDetail {
    id: string
    created_at: string
    updated_at: string
    data: any
    company_name: string
    nit: string
    email: string
    is_active: boolean
    plan_id: number
    database: string | null
    documents_count: number
    invoices_total: string
    users_count: number
    phone: string
    address: string
    city: string
    country: string
    tenancy_db_name: string
}

interface UsageDetail {
    documents_count: number
    invoices_total: string
    users_count: number
    plan_max_documents: number
    plan_max_users: number
    plan_max_amount: string
    documents_percent: number
    amount_percent: number
    users_percent: number
    is_unlimited_documents: boolean
    is_unlimited_users: boolean
    is_unlimited_amount: boolean
    invoices_count: number
    customers_count: number
}

interface PlanDetail {
    id: number
    name: string
    description: string
    is_unlimited: boolean
    has_unlimited_documents: boolean
    has_unlimited_users: boolean
    has_unlimited_amount: boolean
    max_documents: number
    max_users: number
    max_amount: string
    price: string
    is_active: boolean
    sort_order: number
    created_at: string
    updated_at: string
    deleted_at: string | null
}

interface TenantDetailApiResponse {
    tenant: TenantDetail
    usage: UsageDetail
    plan: PlanDetail
}

export default function CompaniesPage() {
    const { tenants, isLoading, createTenant, toggleStatus, updateTenant, deleteTenant, fetchTenants } = useTenants()
    const [selectedTenant, setSelectedTenant] = useState<TenantDetail | null>(null)
    const [selectedUsage, setSelectedUsage] = useState<UsageDetail | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<PlanDetail | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [tableData, setTableData] = useState<Tenant[]>([])

    const router = useRouter()

    useEffect(() => {
        // Si la respuesta viene como { data: { tenants: [...] } }
        if ((tenants as any)?.data?.tenants && Array.isArray((tenants as any).data.tenants)) {
            setTableData((tenants as any).data.tenants)
        } else if (Array.isArray(tenants)) {
            setTableData(tenants)
        } else {
            setTableData([])
        }
    }, [tenants])

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
    }

    const mapTenant = (tenant: Tenant): TenantDetail => ({
        id: String(tenant.id),
        created_at: tenant.created_at ?? "",
        updated_at: tenant.updated_at ?? "",
        data: null,
        company_name: (tenant as any).company_name ?? tenant.name ?? "",
        nit: (tenant as any).nit ?? "",
        email: tenant.email ?? "",
        is_active: (tenant as any).is_active ?? (tenant.status === "active"),
        plan_id: (tenant as any).plan_id ?? 0,
        database: (tenant as any).database ?? "",
        documents_count: (tenant as any).documents_count ?? 0,
        invoices_total: (tenant as any).invoices_total ?? "0.00",
        users_count: (tenant as any).users_count ?? 0,
        phone: (tenant as any).phone ?? "",
        address: (tenant as any).address ?? "",
        city: (tenant as any).city ?? "",
        country: (tenant as any).country ?? "",
        tenancy_db_name: (tenant as any).tenancy_db_name ?? "",
    })

    const handleEdit = (tenant: Tenant) => {
        setSelectedTenant(mapTenant(tenant))
        setIsEditDialogOpen(true)
    }

    const handleView = async (tenant: Tenant) => {
        try {
            const { data } = await apiClient.get<{ tenant: TenantDetail; usage: UsageDetail; plan: PlanDetail }>(`/tenants/${tenant.id}`)
            setSelectedTenant(data.tenant)
            setSelectedUsage(data.usage)
            setSelectedPlan(data.plan)
            setIsViewDialogOpen(true)
        } catch (error) {
            alert("No se pudo cargar el detalle de la empresa.")
            setSelectedTenant(null)
            setSelectedUsage(null)
            setSelectedPlan(null)
        }
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

    const [search, setSearch] = useState("")

    // Etiquetas amigables para las columnas
    const columnLabels = {
        company_name: "Nombre",
        nit: "Número de documento",
        email: "Email",
        phone: "Teléfono",
        address: "Dirección",
        is_active: "Estado",
        actions: "Acciones",
    }

    // Filtros de búsqueda configurables
    const searchFilters = [
        {
            key: "company_name",
            label: "Nombre",
            placeholder: "Digite el nombre",
        },
        {
            key: "nit",
            label: "Número de documento",
            placeholder: "Digite el número de documento",
        },
    ]

    // Columnas solo con datos entendibles para el usuario final
    const columns = [
        {
            accessorKey: "company_name",
            header: columnLabels.company_name,
        },
        {
            accessorKey: "nit",
            header: columnLabels.nit,
        },
        {
            accessorKey: "email",
            header: columnLabels.email,
        },
        {
            accessorKey: "phone",
            header: columnLabels.phone,
        },
        {
            accessorKey: "address",
            header: columnLabels.address,
        },
        {
            accessorKey: "is_active",
            header: columnLabels.is_active,
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
            header: columnLabels.actions,
            cell: ({ row }: any) => (
                <div className="flex gap-2 items-center">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleView(row.original)}
                        title="Ver detalles"
                    >
                        <IconEye />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(row.original)}
                        title="Editar"
                    >
                        <IconEdit />
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
                    columnLabels={columnLabels}
                    searchFilters={searchFilters}
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
                initialData={
                    selectedTenant
                        ? {
                            id: selectedTenant.id,
                            company_name: selectedTenant.company_name,
                            nit: selectedTenant.nit ?? "",
                            type_document_identification_id: (selectedTenant as any).type_document_identification_id ?? 0,
                            plan_id: selectedTenant.plan_id ?? 0,
                            address: selectedTenant.address ?? "",
                            phone: selectedTenant.phone ?? "",
                            email: selectedTenant.email ?? "",
                            country: selectedTenant.country ?? "",
                            department_id: (selectedTenant as any).department_id ?? 0,
                            municipality_id: (selectedTenant as any).municipality_id ?? 0,
                        }
                        : null
                }
            />

            {/* Modal para ver detalles */}
            <TenantDetailsDialog
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                tenant={selectedTenant}
                usage={selectedUsage ?? undefined}
                plan={selectedPlan ?? undefined}
            />
        </>
    )
}
