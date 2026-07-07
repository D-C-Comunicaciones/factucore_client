"use client";
import React, { useState, useEffect } from "react";
import { FactucoreLogo } from "@/components/brand/FactucoreLogo";

interface SplashScreenProps {
    onDone: () => void
}

export function SplashScreen({ onDone }: SplashScreenProps) {
    const [animateLogo, setAnimateLogo] = useState(false)
    const [animateText, setAnimateText] = useState(false)
    const [fadeOut, setFadeOut] = useState(false)

    useEffect(() => {
        const t1 = setTimeout(() => setAnimateLogo(true), 150)
        const t2 = setTimeout(() => setAnimateText(true), 700)
        const t3 = setTimeout(() => setFadeOut(true), 2000)
        const t4 = setTimeout(() => onDone(), 2600)

        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
            clearTimeout(t3)
            clearTimeout(t4)
        }
    }, []
    )

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-tr from-slate-50 via-white to-slate-100 transition-all duration-500 ease-in-out ${fadeOut ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
                }`}
        >
            {/* Branding row */}
            <div className="flex items-center justify-center relative">
                {/* Logo / F icon */}
                <div
                    className={`transition-all duration-700 ease-out transform ${animateLogo
                        ? "opacity-100 scale-100 rotate-0"
                        : "opacity-0 scale-75 -rotate-12"
                        }`}
                >
                    <FactucoreLogo
                        variant="icon"
                        className="w-16 h-16 md:w-20 md:h-20 drop-shadow-md"
                    />
                </div>

                {/* Sliding text */}
                <div
                    style={{
                        width: animateText ? "200px" : "0px",
                        opacity: animateText ? 1 : 0,
                    }}
                    className="overflow-hidden transition-all duration-700 ease-out flex items-center ml-[-8px] md:ml-[-12px]"
                >
                    <div className="flex items-center">
                        <span className="text-3xl md:text-4xl font-[300] text-black tracking-tighter whitespace-nowrap">
                            actu
                        </span>
                        <span className="text-3xl md:text-4xl font-[300] bg-gradient-to-r from-[#052b5c] via-[#0056A6] to-[#0078d4] bg-clip-text text-transparent tracking-tighter whitespace-nowrap">
                            core
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}
