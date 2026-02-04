"use client";

import { useEffect, useRef } from "react";
import { robotoMono } from "@/lib/fonts";
import { RiFlag2Fill, RiRocket2Fill, RiCalendarEventFill, RiTrophyFill, RiSpeaker2Fill, RiMic2Fill } from "react-icons/ri";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    title: "Hack Begins!",
    date: "Feb 07, 2026",
    description: "The first challenge is released. Start building your models!",
    icon: RiFlag2Fill,
    step: "01",
    active: true,
  },
  {
    title: "Guest Speaker",
    date: "Feb 07, 2026",
    description: "Industry expert session right after the hack begins to set context and inspiration.",
    icon: RiMic2Fill,
    step: "02",
    active: true,
  },
  {
    title: "Review 1 (Post Lunch)",
    date: "Feb 07, 2026",
    description:
      "First review checkpoint after lunch to assess progress and direction.",
    icon: RiRocket2Fill,
    step: "03",
    active: false,
  },
   {
    title: "Review 2 (Overnight)",
    date: "Feb 08, 2026",
    description:
      "Overnight review to track stability, improvements, and final adjustments.",
    icon: RiRocket2Fill,
    step: "04",
    active: false,
  },
 
  {
    title: "Results Announced",
    date: "Feb 8, 2026",
    description: "Winners are revealed and prizes distributed.",
    icon: RiTrophyFill,
    step: "05",
    active: false,
  },
];

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const line = lineRef.current;
    const cards = cardsRef.current;
    if (!section || !heading || !line || !cards) return;

    const ctx = gsap.context(() => {
      // Heading chars animation
      const headingSpans = heading.querySelectorAll(".char");
      gsap.fromTo(
        headingSpans,
        { y: 100, opacity: 0, rotateX: -90 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: heading,
            start: "top 80%",
          },
        }
      );

      // Horizontal line draws from left to right
      gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: line,
            start: "top 70%",
          },
        }
      );

      // Cards stagger from bottom with 3D rotation
      const cardElements = cards.querySelectorAll(".timeline-card");
      gsap.fromTo(
        cardElements,
        {
          y: 120,
          opacity: 0,
          rotateY: -30,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards,
            start: "top 75%",
          },
        }
      );

      // Nodes pulse animation
      const nodes = cards.querySelectorAll(".timeline-node");
      nodes.forEach((node, i) => {
        gsap.fromTo(
          node,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: 0.3 + i * 0.15,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: cards,
              start: "top 75%",
            },
          }
        );
      });

      // Vertical line for mobile
      const verticalLine = section.querySelector(".vertical-line");
      if (verticalLine) {
        gsap.fromTo(
          verticalLine,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: verticalLine,
              start: "top 80%",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Split text helper
  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ transformStyle: "preserve-3d" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-64 md:pt-48 md:pb-80 px-6 md:px-12 overflow-hidden"
    >
      {/* Section Header */}
      <div ref={headingRef} className="mb-40 lg:mb-80 text-center" style={{ perspective: "1000px" }}>
        <p className="text-[#CCFF00] text-sm tracking-[0.3em] uppercase mb-4 font-mono">
          // EVENT SCHEDULE
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-wide uppercase">
          <span className="text-[#CCFF00]">{splitText("TIME")}</span>
          {splitText("LINE")}
        </h2>
      </div>

      {/* Desktop Zigzag Timeline */}
      <div ref={cardsRef} className="hidden lg:block w-full max-w-6xl relative" style={{ perspective: "1200px" }}>
        {/* Horizontal connecting line */}
        <div ref={lineRef} className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/50 to-transparent -translate-y-1/2" />

        <div className="flex justify-between items-center relative">
          {events.map((event, idx) => {
            const isUp = idx % 2 === 0;
            return (
              <div
                key={idx}
                className="relative flex flex-col items-center timeline-card"
                style={{ width: "22%", transformStyle: "preserve-3d" }}
              >
                {/* Card */}
                <div
                  className={`absolute ${isUp ? "bottom-full mb-8" : "top-full mt-8"} w-full`}
                >
                  <div
                    className={`p-5 h-[240px] border transition-all duration-500 backdrop-blur-sm ${event.active
                        ? "bg-[#CCFF00]/10 border-[#CCFF00] shadow-[0_0_40px_rgba(204,255,0,0.25)]"
                        : "bg-white/[0.02] border-white/10 hover:border-[#CCFF00]/50 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(204,255,0,0.1)]"
                      }`}
                  >
                    {/* Step Number */}
                    <div
                      className={`absolute ${isUp ? "-bottom-3" : "-top-3"} right-4 w-8 h-8 flex items-center justify-center ${event.active ? "bg-[#CCFF00]" : "bg-white/20"
                        }`}
                    >
                      <span
                        className={`text-xs font-bold ${event.active ? "text-black" : "text-white"} ${robotoMono.className}`}
                      >
                        {event.step}
                      </span>
                    </div>

                    <p
                      className={`text-xs tracking-widest mb-2 ${robotoMono.className} ${event.active ? "text-[#CCFF00]" : "text-white/40"
                        }`}
                    >
                      {event.date}
                    </p>

                    <h3
                      className={`text-lg font-bold mb-2 transition-colors ${event.active ? "text-[#CCFF00]" : "text-white"
                        }`}
                    >
                      {event.title}
                    </h3>

                    <p className="text-white/50 text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Connector line */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-[2px] h-8 ${event.active ? "bg-gradient-to-b from-[#CCFF00] to-transparent" : "bg-white/20"
                      } ${isUp ? "top-full" : "bottom-full"}`}
                  />
                </div>

                {/* Center Node */}
                <div
                  className={`timeline-node w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${event.active
                      ? "bg-[#CCFF00] shadow-[0_0_30px_rgba(204,255,0,0.6)]"
                      : "bg-black border-2 border-white/30 hover:border-[#CCFF00]/50"
                    }`}
                >
                  <event.icon
                    className={`w-5 h-5 ${event.active ? "text-black" : "text-white/60"}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile/Tablet Timeline */}
      <div className="lg:hidden w-full max-w-md">
        <div className="relative">
          {/* Vertical line */}
          <div className="vertical-line absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#CCFF00]/50 via-white/20 to-transparent" />

          <div className="flex flex-col gap-8">
            {events.map((event, idx) => (
              <div key={idx} className="relative flex items-start gap-6 timeline-card">
                <div
                  className={`timeline-node relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${event.active
                      ? "bg-[#CCFF00] shadow-[0_0_25px_rgba(204,255,0,0.5)]"
                      : "bg-black border-2 border-white/30"
                    }`}
                >
                  <event.icon
                    className={`w-5 h-5 ${event.active ? "text-black" : "text-white/60"}`}
                  />
                </div>

                <div
                  className={`flex-1 p-5 border backdrop-blur-sm transition-all duration-300 ${event.active
                      ? "bg-[#CCFF00]/10 border-[#CCFF00]"
                      : "bg-white/[0.02] border-white/10"
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className={`text-xs tracking-widest ${robotoMono.className} ${event.active ? "text-[#CCFF00]" : "text-white/40"
                        }`}
                    >
                      {event.date}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-1 ${robotoMono.className} ${event.active ? "bg-[#CCFF00] text-black" : "bg-white/10 text-white/50"
                        }`}
                    >
                      {event.step}
                    </span>
                  </div>
                  <h3
                    className={`text-lg font-bold mb-1 ${event.active ? "text-[#CCFF00]" : "text-white"}`}
                  >
                    {event.title}
                  </h3>
                  <p className="text-white/50 text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
