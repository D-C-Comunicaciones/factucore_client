export class AuthService {
    private static TOKEN_KEY = 'access_token'
    private static USER_KEY = 'auth_user'
    private static COMPANY_KEY = 'auth_company'

    static setToken(token: string): void {
        if (typeof window !== 'undefined' && token) {
            localStorage.setItem(this.TOKEN_KEY, token)
            // Guarda la cookie solo si el token existe y nunca como "undefined"
            document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
        }
    }

    static getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(this.TOKEN_KEY)
        }
        return null
    }

    static setUser(user: unknown): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.USER_KEY, JSON.stringify(user))
        }
    }

    static getUser(): unknown {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem(this.USER_KEY)
            return user ? JSON.parse(user) : null
        }
        return null
    }

    static setCompany(company: unknown): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.COMPANY_KEY, JSON.stringify(company))
        }
    }

    static getCompany<T = unknown>(): T | null {
        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem(this.COMPANY_KEY)
            return raw ? JSON.parse(raw) as T : null
        }
        return null
    }

    static removeCompany(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.COMPANY_KEY)
        }
    }

    static removeToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.TOKEN_KEY)
            localStorage.removeItem(this.USER_KEY)
            localStorage.removeItem(this.COMPANY_KEY)

            // Borra solo la cookie access_token
            document.cookie = `access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
            document.cookie = `auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`

            // Clear session storage as well
            sessionStorage.clear()
        }
    }

    static isAuthenticated(): boolean {
        return !!this.getToken()
    }
}
