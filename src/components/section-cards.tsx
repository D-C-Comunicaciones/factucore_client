import { IconTrendingDown, IconTrendingUp, IconBuilding, IconUsers, IconFileInvoice, IconCreditCard } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Empresas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            24
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            2 nuevas este mes <IconBuilding className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Crecimiento activo de clientes
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Usuarios Activos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            156
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Alta actividad <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">
            15 usuarios nuevos este mes
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Facturas Emitidas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,847
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +18.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Incremento mensual <IconFileInvoice className="size-4" />
          </div>
          <div className="text-muted-foreground">Volumen de facturación alto</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Planes Activos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            18
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -5.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Leve disminución <IconCreditCard className="size-4" />
          </div>
          <div className="text-muted-foreground">Revisar renovaciones</div>
        </CardFooter>
      </Card>
    </div>
  )
}
