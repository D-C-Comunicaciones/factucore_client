"use client"

import { useEffect, useState } from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import data from "./data.json"

function DashboardSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-6 border border-t-0 rounded-b-lg shadow-sm p-6 mx-4 mb-4 bg-background">
            {/* Section Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="p-6">
                        <Skeleton className="h-4 w-24 mb-4" />
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-3 w-full mb-1" />
                        <Skeleton className="h-3 w-3/4" />
                    </Card>
                ))}
            </div>

            {/* Chart Skeleton */}
            <div className="px-4 lg:px-6">
                <Card className="p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-[400px] w-full" />
                </Card>
            </div>

            {/* Table Skeleton */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <div className="rounded-md border">
                    <div className="p-4 space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return <DashboardSkeleton />
    }

    return (
        <div className="flex flex-1 flex-col gap-6 border border-t-0 rounded-b-lg shadow-sm p-6 mx-4 mb-4 bg-background">
            <SectionCards />

            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>

            <DataTable data={data} />
        </div>
    )
}
