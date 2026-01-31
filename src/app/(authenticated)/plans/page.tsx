"use client"

import { useState, useEffect } from "react"
import { IconPlus, IconRefresh, IconEye, IconEdit } from "@tabler/icons-react"
import { usePlans } from "@/hooks/use-plans"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PlanDetailDialog } from "@/components/plans/plan-detail-dialog"
import { UpdatePlanDialog } from "@/components/plans/update-plan-dialog"
import { CreatePlanDialog } from "@/components/plans/create-plan-dialog"
import { toast } from "sonner"

export default function PlansPage() {
    const { plans, isLoading, fetchPlans, updatePlan, toggleStatus } = usePlans()
    const [selectedPlan, setSelectedPlan] = useState<any>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [tableData, setTableData] = useState<any[]>([])

    useEffect(() => {
        setTableData(Array.isArray(plans) ? plans : [])
    }, [plans])

    const handleView = (plan: any) => {
        setSelectedPlan(plan)
        setIsDetailOpen(true)
    }

    const handleEdit = (plan: any) => {
        setSelectedPlan(plan)
        setIsEditOpen(true)
    }

    const handleToggleStatus = async (id: number) => {
        await toggleStatus(id)
    }

    const handleRefresh = () => {
        fetchPlans()
    }

    // Etiquetas amigables para las columnas
    const columnLabels = {
        name: "Nombre",
        description: "Descripción",
        price: "Precio",
        is_active: "Estado",
        actions: "Acciones",
    }

    // Filtros de búsqueda configurables
    const searchFilters = [
        {
            key: "name",
            label: "Nombre",
            placeholder: "Digite el nombre",
        },
        {
            key: "description",
            label: "Descripción",
            placeholder: "Digite la descripción",
        },
    ]

    // Columnas para DataTable
    const columns = [
        {
            accessorKey: "name",
            header: columnLabels.name,
        },
        {
            accessorKey: "description",
            header: columnLabels.description,
        },
        {
            accessorKey: "price",
            header: columnLabels.price,
            cell: ({ row }: any) => (
                <span>
                    {row.original.price === "0.00"
                        ? "Gratuito"
                        : `$${Number(row.original.price).toLocaleString("es-CO")}`}
                </span>
            ),
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

    // Crear plan
    const handleCreatePlan = async (data: any) => {
        try {
            // Aquí deberías llamar a tu servicio para crear el plan
            // await planService.create(data)
            toast.success("Plan creado exitosamente")
            setIsCreateOpen(false)
            fetchPlans()
        } catch (error: any) {
            toast.error(error?.message || "Error al crear el plan")
        }
    }

    return (
        <>
            <div className="flex flex-1 flex-col gap-6 border border-t-0 rounded-b-lg shadow-sm p-6 mx-4 mb-4 bg-background">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold">Planes</h2>
                        <p className="text-muted-foreground">
                            Gestiona los planes disponibles en el sistema
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
                            onClick={() => setIsCreateOpen(true)}
                            disabled={isLoading}
                            size="default"
                        >
                            <IconPlus />
                            Nuevo Plan
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
            <PlanDetailDialog
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                plan={selectedPlan}
            />
            <UpdatePlanDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                plan={selectedPlan}
                onSubmit={async (data) => {
                    if (selectedPlan) {
                        await updatePlan(selectedPlan.id, data)
                        toast.success("Plan actualizado exitosamente")
                    }
                }}
            />
            <CreatePlanDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSubmit={handleCreatePlan}
            />
        </>
    )
}
