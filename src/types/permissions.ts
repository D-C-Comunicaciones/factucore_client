export interface Permission {
    id: number
    name: string
    description: string
    module: string
}

export interface PermissionModuleGroup {
    module: string
    permissions: Permission[]
}
