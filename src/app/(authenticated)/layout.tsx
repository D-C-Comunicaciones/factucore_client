"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/auth-context'

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
        return null
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-sidebar">
                <SiteHeader />
                <div className="@container/main flex flex-1 flex-col">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}