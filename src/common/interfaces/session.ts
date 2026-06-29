export interface SessionData {
    sessionId: string
    token: string
    expiresIn: number
    user: {
        id: number
        email: string
        name: string
    }
    role: {
        id: number
        name: string
    }
    permissions: string[]
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