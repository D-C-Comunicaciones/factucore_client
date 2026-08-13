import { Skeleton } from "@/components/ui/skeleton";

export function QuoteDetailSkeleton() {
    return (
        <div className="max-w-[1200px] mx-auto py-8 px-4 space-y-6">
            <div className="flex justify-between items-center mb-8">
                <Skeleton className="h-8 w-64" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-32" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex gap-8">
                <Skeleton className="h-16 w-32" />
                <Skeleton className="h-16 w-32" />
                <Skeleton className="h-16 w-32" />
                <Skeleton className="h-16 w-32" />
            </div>

            <Skeleton className="h-[600px] w-full rounded-lg" />
            
            <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-48 rounded-lg" />
            </div>
        </div>
    );
}
