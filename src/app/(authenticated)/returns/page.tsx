"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ReturnPageHeader } from '@/components/returns/ReturnPageHeader';
import { ReturnsTable } from '@/components/returns/table/ReturnsTable';

export default function ReturnsPage() {
    const router = useRouter();

    const handleNavigate = (view: string) => {
        // Implement navigation logic here if needed
        console.log("Navigate to", view);
    };

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
                <ReturnPageHeader onNavigate={handleNavigate} />

                <div className="w-full">
                    <ReturnsTable />
                </div>
            </div>
        </div>
    );
}
