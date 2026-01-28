import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Public routes that don't require authentication
    const publicRoutes = ['/login']
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    // Check if user has token in localStorage (client-side check)
    // For server-side, we'll check if they're trying to access protected routes

    // Allow access to public routes
    if (isPublicRoute) {
        return NextResponse.next()
    }

    // For now, allow all routes since we're using client-side auth
    // The AuthProvider will handle redirects on the client
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - img (public images folder)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|img).*)',
    ],
}
