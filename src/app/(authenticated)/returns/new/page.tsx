"use client";

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { NewReturnForm } from '@/components/returns/new/NewReturnForm';

export default function NewReturnPage() {
    return (
        <div className="w-full min-h-screen pb-20">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-primary mb-6 mt-2 font-medium">
                    <Link href="/returns" className="hover:underline">
                        Devoluciones en ventas
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
                    <span className="text-slate-500">Nueva devolución</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                        Nueva devolución
                    </h1>
                    <button className="mt-4 md:mt-0 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Más ajustes
                    </button>
                </div>

                <NewReturnForm />
            </div>
        </div>
    );
}
