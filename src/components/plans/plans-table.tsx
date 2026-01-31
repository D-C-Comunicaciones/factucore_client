import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { IconEye, IconEdit } from "@tabler/icons-react"
import type { Plan } from "@/services/plan.service"

interface PlansTableProps {
    plans: Plan[]
    onView: (plan: Plan) => void
    onEdit: (plan: Plan) => void
    onToggleStatus: (plan: Plan) => void
    isLoading: boolean
}

export function PlansTable({ plans, onView, onEdit, onToggleStatus, isLoading }: PlansTableProps) {
    return (
        <table className="w-full border rounded-lg shadow-sm bg-white">
            <thead>
                <tr>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Descripción</th>
                    <th className="px-4 py-2">Precio</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {plans.map(plan => (
                    <tr key={plan.id} className="border-t">
                        <td className="px-4 py-2">{plan.name}</td>
                        <td className="px-4 py-2">{plan.description}</td>
                        <td className="px-4 py-2">${Number(plan.price).toLocaleString("es-CO")}</td>
                        <td className="px-4 py-2">
                            <Switch
                                checked={plan.is_active}
                                onCheckedChange={() => onToggleStatus(plan)}
                                aria-label="Activar/Inactivar"
                                className={plan.is_active ? "bg-green-500 border-green-500" : "bg-red-500 border-red-500"}
                                disabled={isLoading}
                            />
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => onView(plan)}>
                                <IconEye />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => onEdit(plan)}>
                                <IconEdit />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
