export interface PlanLimit {
    unlimited: boolean
    max_users: number | null
    used: number
    label: string
}

export interface TenantUserListItem {
    id: number
    name: string
    email: string
    phone: string | null
    active: boolean
    roles: string[]
    last_login_at: string | null
    created_at: string
    updated_at: string
}

export interface TenantUserDetail extends TenantUserListItem {
    direct_permissions: string[]
    all_permissions: string[]
}

export interface UsersListApiData {
    users: TenantUserListItem[]
    pagination: {
        current_page: number
        per_page: number
        total: number
        last_page: number
    }
    plan_limit: PlanLimit
}

export interface CreateUserPayload {
    name: string
    email: string
    password?: string
    phone?: string
    active?: boolean
    role_ids?: number[]
    send_invitation?: boolean
}

export interface UpdateUserPayload {
    name?: string
    phone?: string
}

export interface AssignUserRolesPayload {
    role_ids: number[]
}

export interface AssignUserPermissionsPayload {
    permission_ids: number[]
}

export interface UpdateUserEmailPayload {
    email: string
}

export interface ResetUserPasswordPayload {
    password: string
}

export interface PermissionsOutsidePlanError {
    message: string
    permissions_outside_plan: string[]
}
