import { Skeleton } from "@/components/ui/skeleton";

export function AdjustmentNoteDetailSkeleton() {
    return (
        <div className="max-w-[1200px] mx-auto py-8 px-4 space-y-6">
            <div>
                <Skeleton className="h-8 w-72 mb-4" />
                <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-32" />
                </div>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
                <div className="flex flex-wrap gap-12">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>

                <div className="mt-8 flex justify-end">
                    <div className="w-64 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                        <div className="border-t pt-4 flex justify-between">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
