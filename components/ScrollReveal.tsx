"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ScrollRevealProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    y?: number;
    threshold?: number;
    className?: string;
    stagger?: number;
}

export default function ScrollReveal({
    children,
    delay = 0,
    duration = 0.8,
    y = 50,
    threshold = 0.2,
    className = "",
    stagger = 0,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Initial state
        gsap.set(el.children, { autoAlpha: 0, y: y });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.to(entry.target, {
                            autoAlpha: 1,
                            y: 0,
                            duration: duration,
                            delay: delay,
                            ease: "power3.out",
                            stagger: stagger,
                            overwrite: "auto",
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold }
        );

        Array.from(el.children).forEach((child) => {
            observer.observe(child);
        });

        return () => observer.disconnect();
    }, [delay, duration, y, threshold, stagger]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
