import { useQuery } from "@tanstack/react-query"
import { permissionsApi, groupPermissionsByModule } from "@/lib/permissions"

export function usePermissionsCatalog() {
    return useQuery({
        queryKey: ["permissions-catalog"],
        queryFn: () => permissionsApi.getPermissions(),
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
}

export function usePermissionsCatalogByModule() {
    const query = usePermissionsCatalog()
    return {
        ...query,
        groups: query.data ? groupPermissionsByModule(query.data) : [],
    }
}
