export function ReturnDetailSkeleton() {
    return (
        <div className="max-w-[1200px] mx-auto py-8 px-4 space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <div className="space-y-2">
                    <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-8 w-64 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="flex gap-2">
                    <div className="h-9 w-24 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-9 w-24 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-9 w-24 bg-slate-200 rounded animate-pulse"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white rounded-xl shadow-sm border border-slate-200 h-28 animate-pulse">
                <div className="p-5 border-r border-slate-100">
                    <div className="h-4 w-24 bg-slate-200 rounded mb-3"></div>
                    <div className="h-8 w-32 bg-slate-200 rounded"></div>
                </div>
                <div className="p-5 border-r border-slate-100">
                    <div className="h-4 w-24 bg-slate-200 rounded mb-3"></div>
                    <div className="h-8 w-32 bg-slate-200 rounded"></div>
                </div>
                <div className="p-5">
                    <div className="h-4 w-24 bg-slate-200 rounded mb-3"></div>
                    <div className="h-8 w-32 bg-slate-200 rounded"></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 h-96 animate-pulse">
                <div className="flex justify-between pb-6 border-b border-slate-100 mb-6">
                    <div className="h-6 w-48 bg-slate-200 rounded"></div>
                    <div className="space-y-2 text-right">
                        <div className="h-5 w-32 bg-slate-200 rounded ml-auto"></div>
                        <div className="h-4 w-24 bg-slate-200 rounded ml-auto"></div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-slate-200 rounded"></div>
                        <div className="h-5 w-40 bg-slate-200 rounded"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-slate-200 rounded"></div>
                        <div className="h-5 w-40 bg-slate-200 rounded"></div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="h-10 w-full bg-slate-100 rounded"></div>
                    <div className="h-10 w-full bg-slate-50 rounded"></div>
                    <div className="h-10 w-full bg-slate-50 rounded"></div>
                </div>
            </div>
        </div>
    );
}
