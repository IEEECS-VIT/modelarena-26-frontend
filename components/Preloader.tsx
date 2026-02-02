"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { sora } from "@/lib/fonts";

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const barRef = useRef<HTMLSpanElement>(null);
    const percentRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                setLoading(false);
            },
        });

        const progressObj = { value: 0 };
        const totalBars = 30; // Increased bars for wider look

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
                    // No progress bar, just percentage as requested by "Shift percentage and number in the center"
                    // Wait, "Shift percentage and number in the center... also we can do ##### thing"
                    // I will keep the bar but center it.
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

    if (!loading) return null;

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
