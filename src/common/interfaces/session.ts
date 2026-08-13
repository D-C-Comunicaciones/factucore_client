export interface SessionData {
    sessionId: string
    token: string
    expiresIn: number
    user: {
        id: number
        email: string
        name: string
        roles?: { id: number; name: string }[]
        permissions?: { id: number; name: string }[] | string[]
    }
    role: {
        id: number
        name: string
    }
    permissions: string[]
    account_type?: string
    tenant_id?: string
    channels?: string[]
    modules?: string[]
    scopes?: string[]
    features?: string[]
    features_override?: any[]
    ts: number
}

export function getSession(): SessionData | null {
    if (typeof window === "undefined") return null

    const raw = localStorage.getItem("session")
    if (!raw) return null

    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}