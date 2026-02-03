"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Sync GSAP ScrollTrigger with Lenis
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
        };
    }, []);
}

// ============================================
// SPLIT TEXT REVEAL - Character by character animation
// ============================================
interface SplitTextProps {
    children: string;
    className?: string;
    delay?: number;
}

export function SplitTextReveal({ children, className = "", delay = 0 }: SplitTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const chars = container.querySelectorAll(".char");

        gsap.set(chars, {
            y: 120,
            opacity: 0,
            rotateX: -90,
            transformOrigin: "top center",
        });

        ScrollTrigger.create({
            trigger: container,
            start: "top 85%",
            onEnter: () => {
                gsap.to(chars, {
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    duration: 1,
                    stagger: 0.03,
                    delay,
                    ease: "power4.out",
                });
            },
            once: true,
        });
    }, [delay]);

    const words = children.split(" ");

    return (
        <div ref={containerRef} className={className} style={{ perspective: "1000px" }}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-[0.25em]">
                    {word.split("").map((char, charIndex) => (
                        <span
                            key={charIndex}
                            className="char inline-block"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            {char}
                        </span>
                    ))}
                </span>
            ))}
        </div>
    );
}

// ============================================
// HORIZONTAL SCROLL SECTION - Pinned side-scrolling
// ============================================
interface HorizontalScrollProps {
    children: ReactNode;
    className?: string;
}

export function HorizontalScrollSection({ children, className = "" }: HorizontalScrollProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const trigger = triggerRef.current;
        if (!section || !trigger) return;

        const scrollWidth = section.scrollWidth;
        const viewportWidth = window.innerWidth;

        const ctx = gsap.context(() => {
            gsap.to(section, {
                x: -(scrollWidth - viewportWidth),
                ease: "none",
                scrollTrigger: {
                    trigger: trigger,
                    start: "top top",
                    end: () => `+=${scrollWidth - viewportWidth}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div ref={triggerRef} className={`overflow-hidden ${className}`}>
            <div ref={sectionRef} className="flex will-change-transform">
                {children}
            </div>
        </div>
    );
}

// ============================================
// PARALLAX SECTION - Multi-layer depth effect
// ============================================
interface ParallaxLayerProps {
    children: ReactNode;
    speed?: number; // -1 to 1, negative = slower, positive = faster
    className?: string;
}

export function ParallaxLayer({ children, speed = 0.5, className = "" }: ParallaxLayerProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const ctx = gsap.context(() => {
            gsap.to(element, {
                y: () => speed * 300,
                ease: "none",
                scrollTrigger: {
                    trigger: element.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        });

        return () => ctx.revert();
    }, [speed]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

// ============================================
// REVEAL ON SCROLL - Fade/slide with options
// ============================================
interface RevealProps {
    children: ReactNode;
    className?: string;
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
    duration?: number;
    distance?: number;
}

export function ScrollRevealPremium({
    children,
    className = "",
    direction = "up",
    delay = 0,
    duration = 1,
    distance = 100,
}: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const directions: Record<string, { x: number; y: number }> = {
            up: { x: 0, y: distance },
            down: { x: 0, y: -distance },
            left: { x: distance, y: 0 },
            right: { x: -distance, y: 0 },
        };

        const { x, y } = directions[direction];

        gsap.set(element, { opacity: 0, x, y });

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: element,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(element, {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        duration,
                        delay,
                        ease: "power3.out",
                    });
                },
                once: true,
            });
        });

        return () => ctx.revert();
    }, [direction, delay, duration, distance]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

// ============================================
// SCALE REVEAL - Zoom in/out effect
// ============================================
interface ScaleRevealProps {
    children: ReactNode;
    className?: string;
    from?: number;
    to?: number;
    delay?: number;
}

export function ScaleReveal({
    children,
    className = "",
    from = 0.5,
    to = 1,
    delay = 0,
}: ScaleRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        gsap.set(element, { scale: from, opacity: 0 });

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: element,
                start: "top 80%",
                onEnter: () => {
                    gsap.to(element, {
                        scale: to,
                        opacity: 1,
                        duration: 1.2,
                        delay,
                        ease: "power4.out",
                    });
                },
                once: true,
            });
        });

        return () => ctx.revert();
    }, [from, to, delay]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

// ============================================
// STAGGER CARDS - Cards animate in sequence
// ============================================
interface StaggerCardsProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

export function StaggerCards({ children, className = "", staggerDelay = 0.1 }: StaggerCardsProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const cards = container.children;

        gsap.set(cards, {
            y: 80,
            opacity: 0,
            rotateY: -15,
            transformOrigin: "left center",
        });

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: container,
                start: "top 75%",
                onEnter: () => {
                    gsap.to(cards, {
                        y: 0,
                        opacity: 1,
                        rotateY: 0,
                        duration: 0.8,
                        stagger: staggerDelay,
                        ease: "power3.out",
                    });
                },
                once: true,
            });
        });

        return () => ctx.revert();
    }, [staggerDelay]);

    return (
        <div ref={ref} className={className} style={{ perspective: "1000px" }}>
            {children}
        </div>
    );
}

// ============================================
// PINNED SECTION WITH PROGRESS - Section stays pinned
// ============================================
interface PinnedSectionProps {
    children: ReactNode;
    className?: string;
    pinDuration?: string; // e.g., "200%"
}

export function PinnedSection({ children, className = "", pinDuration = "100%" }: PinnedSectionProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: element,
                start: "top top",
                end: `+=${pinDuration}`,
                pin: true,
                pinSpacing: true,
            });
        });

        return () => ctx.revert();
    }, [pinDuration]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

// ============================================
// BLUR REVEAL - Text reveals with blur
// ============================================
interface BlurRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function BlurReveal({ children, className = "", delay = 0 }: BlurRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        gsap.set(element, {
            opacity: 0,
            filter: "blur(20px)",
            y: 30,
        });

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: element,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(element, {
                        opacity: 1,
                        filter: "blur(0px)",
                        y: 0,
                        duration: 1,
                        delay,
                        ease: "power3.out",
                    });
                },
                once: true,
            });
        });

        return () => ctx.revert();
    }, [delay]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

// ============================================
// CLIP PATH REVEAL - Masked reveal animation
// ============================================
interface ClipRevealProps {
    children: ReactNode;
    className?: string;
    direction?: "left" | "right" | "top" | "bottom";
}

export function ClipReveal({ children, className = "", direction = "left" }: ClipRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const clipPaths: Record<string, { from: string; to: string }> = {
            left: {
                from: "inset(0 100% 0 0)",
                to: "inset(0 0% 0 0)",
            },
            right: {
                from: "inset(0 0 0 100%)",
                to: "inset(0 0 0 0%)",
            },
            top: {
                from: "inset(0 0 100% 0)",
                to: "inset(0 0 0% 0)",
            },
            bottom: {
                from: "inset(100% 0 0 0)",
                to: "inset(0% 0 0 0)",
            },
        };

        gsap.set(element, { clipPath: clipPaths[direction].from });

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: element,
                start: "top 80%",
                onEnter: () => {
                    gsap.to(element, {
                        clipPath: clipPaths[direction].to,
                        duration: 1.2,
                        ease: "power4.inOut",
                    });
                },
                once: true,
            });
        });

        return () => ctx.revert();
    }, [direction]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

// ============================================
// COUNTER ANIMATION - Animated number count
// ============================================
interface CounterProps {
    end: number;
    duration?: number;
    className?: string;
    prefix?: string;
    suffix?: string;
}

export function AnimatedCounter({
    end,
    duration = 2,
    className = "",
    prefix = "",
    suffix = "",
}: CounterProps) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const obj = { value: 0 };

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: element,
                start: "top 80%",
                onEnter: () => {
                    gsap.to(obj, {
                        value: end,
                        duration,
                        ease: "power2.out",
                        onUpdate: () => {
                            element.textContent = `${prefix}${Math.round(obj.value)}${suffix}`;
                        },
                    });
                },
                once: true,
            });
        });

        return () => ctx.revert();
    }, [end, duration, prefix, suffix]);

    return (
        <span ref={ref} className={className}>
            {prefix}0{suffix}
        </span>
    );
}

// ============================================
// MARQUEE - Infinite scrolling text
// ============================================
interface MarqueeProps {
    children: ReactNode;
    speed?: number;
    direction?: "left" | "right";
    className?: string;
}

export function Marquee({ children, speed = 50, direction = "left", className = "" }: MarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const content = container.querySelector(".marquee-content");
        if (!content) return;

        const contentWidth = content.scrollWidth;

        const ctx = gsap.context(() => {
            gsap.to(content, {
                x: direction === "left" ? -contentWidth / 2 : contentWidth / 2,
                duration: contentWidth / speed,
                repeat: -1,
                ease: "none",
            });
        });

        return () => ctx.revert();
    }, [speed, direction]);

    return (
        <div ref={containerRef} className={`overflow-hidden ${className}`}>
            <div className="marquee-content flex">
                {children}
                {children}
            </div>
        </div>
    );
}

// ============================================
// 3D TILT CARD - Follows mouse with depth
// ============================================
interface TiltCardProps {
    children: ReactNode;
    className?: string;
    intensity?: number;
}

export function TiltCard({ children, className = "", intensity = 15 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -intensity;
            const rotateY = ((x - centerX) / centerX) * intensity;

            gsap.to(element, {
                rotateX,
                rotateY,
                duration: 0.3,
                ease: "power2.out",
                transformPerspective: 1000,
            });
        };

        const handleMouseLeave = () => {
            gsap.to(element, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out",
            });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            element.removeEventListener("mousemove", handleMouseMove);
            element.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [intensity]);

    return (
        <div ref={ref} className={className} style={{ transformStyle: "preserve-3d" }}>
            {children}
        </div>
    );
}

// ============================================
// SECTION FADE TRANSITION - Smooth section transitions
// ============================================
export function useSectionTransitions() {
    useEffect(() => {
        // Exclude #home section to avoid breaking the 3D canvas
        const sections = document.querySelectorAll("section:not(#home)");

        const ctx = gsap.context(() => {
            sections.forEach((section) => {
                // Fade in from slight opacity and scale
                gsap.fromTo(
                    section,
                    {
                        opacity: 0.3,
                        scale: 0.98,
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                            end: "top 20%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });
        });

        return () => ctx.revert();
    }, []);
}

// ============================================
// COMBINED HOOK - Use all premium effects
// ============================================
export function usePremiumScrollEffects() {
    useSmoothScroll();
    useSectionTransitions();
}
