"use client"

import { useEffect, useState } from "react"
import { useRoles } from "@/hooks/useRoles"
import { Button } from "@/components/ui/button"
import { IconPlus, IconRefresh, IconEdit, IconEye } from "@tabler/icons-react"
import { DataTable } from "@/components/ui/data-table"

export default function RolesPage() {
    const { getAll, loading } = useRoles()
    const [tableData, setTableData] = useState<any[]>([])
    const [pagination, setPagination] = useState<any>({ current_page: 1, per_page: 10, last_page: 1 })

    // Modales
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<any>(null)

    // Fetch roles con paginación
    const fetchRoles = async (page = 1, perPage = 10) => {
        const data = await getAll({ page, per_page: perPage })
        // El backend responde { roles: [...], pagination: {...} }
        if (data && Array.isArray(data.roles)) {
            setTableData(data.roles)
            setPagination(data.pagination ?? { current_page: page, per_page: perPage, last_page: 1 })
        } else if (data && data.data && Array.isArray(data.data.roles)) {
            // fallback por si viene anidado en data.data
            setTableData(data.data.roles)
            setPagination(data.data.pagination ?? { current_page: page, per_page: perPage, last_page: 1 })
        } else {
            setTableData([])
            setPagination({ current_page: page, per_page: perPage, last_page: 1 })
        }
    }

    // Solo carga inicial
    useEffect(() => {
        fetchRoles()
    }, [])

    // Handler para DataTable: paginación y filas por página
    // Si tu DataTable no soporta paginación controlada, elimina este handler y las props relacionadas
    // Si la soporta, descomenta y úsalo:
    // const handleTableChange = (pageIndex: number, pageSize: number) => {
    //     fetchRoles(pageIndex + 1, pageSize)
    // }

    const handleRefresh = () => fetchRoles(pagination.current_page, pagination.per_page)
    const handleEdit = (role: any) => { setSelectedRole(role); setIsEditOpen(true) }
    const handleView = (role: any) => { setSelectedRole(role); setIsDetailOpen(true) }

    const columnLabels = { name: "Nombre", created_at: "Creado", updated_at: "Actualizado", actions: "Acciones" }

    const columns = [
        {
            accessorKey: "name",
            header: columnLabels.name,
            cell: ({ row }: any) => <span>{row.original.name}</span>,
        },
        {
            accessorKey: "created_at",
            header: columnLabels.created_at,
            cell: ({ row }: any) => <span>{row.original.created_at}</span>,
        },
        {
            accessorKey: "updated_at",
            header: columnLabels.updated_at,
            cell: ({ row }: any) => <span>{row.original.updated_at}</span>,
        },
        {
            id: "actions",
            header: columnLabels.actions,
            cell: ({ row }: any) => (
                <div className="flex gap-2 items-center">
                    <Button variant="outline" size="icon" onClick={() => handleView(row.original)} title="Ver detalles">
                        <IconEye />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEdit(row.original)} title="Editar">
                        <IconEdit />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div className="flex flex-1 flex-col gap-6 border border-t-0 rounded-b-lg shadow-sm p-6 mx-4 mb-4 bg-background">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Roles</h2>
                    <p className="text-muted-foreground">Gestiona los roles y permisos del sistema</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="default"
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        style={{ minWidth: 0 }}
                        onClick={handleRefresh}
                    >
                        <IconRefresh className="mr-2" /> Refresh
                    </Button>
                    <Button onClick={() => setIsCreateOpen(true)} disabled={loading} size="default">
                        <IconPlus /> Nuevo Rol
                    </Button>
                </div>
            </div>
            <DataTable
                data={tableData}
                columns={columns}
                isLoading={loading}
                columnLabels={columnLabels}
                searchFilters={[
                    { key: "name", label: "Nombre", placeholder: "Digite el nombre" }
                ]}
            />
            {/* Modales */}
            {/* <CreateRoleDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} /> */}
            {/* <UpdateRoleDialog open={isEditOpen} onOpenChange={setIsEditOpen} role={selectedRole} /> */}
            {/* <RoleDetailsDialog open={isDetailOpen} onOpenChange={setIsDetailOpen} role={selectedRole} /> */}
        </div>
    )
}
