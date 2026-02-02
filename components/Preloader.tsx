"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { sora } from "@/lib/fonts";

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [shouldShow, setShouldShow] = useState(false);
    const barRef = useRef<HTMLSpanElement>(null);
    const percentRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check if this is an internal navigation (login/logout/page change)
        const isInternalNavigation = sessionStorage.getItem("internalNavigation");

        // Get navigation type using Performance API
        const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
        const navType = navEntries.length > 0 ? navEntries[0].type : "navigate";

        // Show preloader on:
        // - First visit (reload or navigate without internal flag)
        // - Page refresh (reload)
        // Don't show on internal navigation (login/logout)

        if (isInternalNavigation && navType !== "reload") {
            // Internal navigation (not a refresh) - skip preloader
            sessionStorage.removeItem("internalNavigation");
            setLoading(false);
            return;
        }

        // Clear the flag if it was a refresh
        sessionStorage.removeItem("internalNavigation");

        // Show the preloader
        setShouldShow(true);

        const tl = gsap.timeline({
            onComplete: () => {
                setLoading(false);
            },
        });

        const progressObj = { value: 0 };
        const totalBars = 30;

        tl.to(progressObj, {
            value: 100,
            duration: 1.8,
            ease: "power2.inOut",
            onUpdate: () => {
                const percent = Math.round(progressObj.value);
                if (percentRef.current) {
                    percentRef.current.textContent = `${percent}%`;
                }

                if (barRef.current) {
                    const filled = Math.round((percent / 100) * totalBars);
                    const empty = totalBars - filled;
                    barRef.current.textContent = `[${"#".repeat(filled)}${".".repeat(empty)}]`;
                }
            },
        });

        tl.to(containerRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: "expo.inOut",
            delay: 0.2,
        });
    }, []);

    if (!loading || !shouldShow) return null;

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white ${sora.className}`}
        >
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-lime-400 text-sm tracking-[0.2em] animate-pulse">
                    SYSTEM INITIALIZING
                </div>

                <div className="flex flex-col items-center gap-2">
                    <span ref={percentRef} className="text-6xl md:text-8xl font-bold text-white tabular-nums tracking-tighter">
                        0%
                    </span>
                    <span ref={barRef} className="text-white/40 text-xs md:text-sm font-mono mt-2">
                        [{".".repeat(30)}]
                    </span>
                </div>
            </div>
        </div>
    );
}
