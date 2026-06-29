import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Rutas públicas
    const publicRoutes = ['/login']
    const isPublicRoute = publicRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Permitir rutas públicas
    if (isPublicRoute) {
        return NextResponse.next()
    }

    // Auth 100% client-side → dejamos pasar todo
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|img).*)',
    ],
}

export default proxy;