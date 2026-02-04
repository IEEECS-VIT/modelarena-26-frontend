"use client";

import { useEffect, useRef } from "react";
import { robotoMono } from "@/lib/fonts";
import { RiFlag2Fill, RiRocket2Fill, RiCalendarEventFill, RiTrophyFill } from "react-icons/ri";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    title: "Registrations Open",
    date: "Feb 07, 2026 8:00 AM",
    description: "Team registrations begin. Gather your squad and sign up!",
    icon: RiFlag2Fill,
    step: "01",
    active: true,
  },
  {
    title: "Hack Begins",
    date: "Feb 07, 2026",
    description: "Where the participants start their journey.",
    icon: RiRocket2Fill,
    step: "02",
    active: false,
  },
  {
    title: "Guest speaker session",
    date: "Feb 07, 2026 11:00 AM",
    description: "An insightful discussion with an industry professional.",
    icon: RiRocket2Fill,
    step: "03",
    active: false,
  },
  {
    title: "Review 1",
    date: "Feb 07, 2026 3:00 PM",
    description: "The first review is conducted to evaluate the models.",
    icon: RiRocket2Fill,
    step: "04",
    active: false,
  },
  {
    title: "The hack resumes",
    date: "Feb 07, 2026 9:00 PM",
    description: "The hackathon resumes after a dinner break.",
    icon: RiCalendarEventFill,
    step: "03",
    active: false,
  },
  {
    title: "Review 2",
    date: "Feb 8, 2026 3:00 AM",
    description: "The second review is conducted to evaluate the models.",
    icon: RiTrophyFill,
    step: "04",
    active: false,
  },
  {
    title: "The hacking ends",
    date: "Feb 08, 2026 6:00 AM",
    description: "The hacking ends.",
    icon: RiTrophyFill,
    step: "04",
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
        {/* Horizontal connecting line with glow */}
        <div
          ref={lineRef}
          className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(204,255,0,0.8) 20%, rgba(204,255,0,0.8) 80%, transparent)',
            boxShadow: '0 0 20px rgba(204,255,0,0.4)'
          }}
        />

        <div className="flex justify-between items-center relative">
          {events.map((event, idx) => {
            const isUp = idx % 2 === 0;
            return (
              <div
                key={idx}
                className="relative flex flex-col items-center timeline-card"
                style={{ width: "28%", transformStyle: "preserve-3d" }}
              >
                {/* Card */}
                <div
                  className={`absolute ${isUp ? "bottom-full mb-10" : "top-full mt-10"} w-full`}
                >
                  <div
                    className={`
                      group relative p-6 pb-10 min-h-[280px] flex flex-col
                      backdrop-blur-md transition-all duration-500
                      ${event.active
                        ? "bg-gradient-to-br from-[#CCFF00]/15 via-[#CCFF00]/10 to-transparent border-2 border-[#CCFF00] shadow-[0_0_50px_rgba(204,255,0,0.3),inset_0_0_30px_rgba(204,255,0,0.1)]"
                        : "bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 hover:border-[#CCFF00]/60 hover:shadow-[0_0_40px_rgba(204,255,0,0.15),inset_0_0_20px_rgba(204,255,0,0.05)]"
                      }
                      hover:scale-[1.02] hover:-translate-y-1
                    `}
                  >
                    {/* Corner accents */}
                    <div className={`absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 transition-colors duration-300 ${event.active ? 'border-[#CCFF00]' : 'border-white/20 group-hover:border-[#CCFF00]/60'
                      }`} />
                    <div className={`absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 transition-colors duration-300 ${event.active ? 'border-[#CCFF00]' : 'border-white/20 group-hover:border-[#CCFF00]/60'
                      }`} />

                    {/* Step Number Badge */}
                    <div
                      className={`absolute ${isUp ? "-bottom-4" : "-top-4"} right-4 w-10 h-10 flex items-center justify-center transition-all duration-300 ${event.active
                        ? "bg-gradient-to-br from-[#CCFF00] to-[#99CC00] shadow-[0_0_20px_rgba(204,255,0,0.6)]"
                        : "bg-gradient-to-br from-white/20 to-white/10 group-hover:from-[#CCFF00]/50 group-hover:to-[#99CC00]/50"
                        }`}
                      style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                    >
                      <span
                        className={`text-sm font-bold ${robotoMono.className} ${event.active ? "text-black" : "text-white group-hover:text-black"
                          }`}
                      >
                        {event.step}
                      </span>
                    </div>

                    {/* Date */}
                    <p
                      className={`text-xs tracking-[0.15em] mb-3 uppercase ${robotoMono.className} ${event.active ? "text-[#CCFF00]" : "text-white/40 group-hover:text-[#CCFF00]/70"
                        }`}
                    >
                      {event.date}
                    </p>

                    {/* Title with gradient on active */}
                    <h3
                      className={`text-base font-bold mb-3 leading-snug break-words transition-all duration-300 ${event.active
                        ? "bg-gradient-to-r from-[#CCFF00] to-[#99FF00] bg-clip-text text-transparent"
                        : "text-white group-hover:text-[#CCFF00]"
                        }`}
                    >
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/60 group-hover:text-white/80 text-sm leading-relaxed transition-colors duration-300 flex-1">
                      {event.description}
                    </p>

                    {/* Subtle grid pattern overlay */}
                    <div
                      className="absolute inset-0 opacity-[0.02] pointer-events-none"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
                      }}
                    />
                  </div>

                  {/* Connector line with glow */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-[3px] h-10 transition-all duration-300 ${event.active
                      ? "bg-gradient-to-b from-[#CCFF00] to-transparent shadow-[0_0_15px_rgba(204,255,0,0.6)]"
                      : "bg-gradient-to-b from-white/30 to-transparent"
                      } ${isUp ? "top-full" : "bottom-full"}`}
                  />
                </div>

                {/* Center Node with enhanced glow */}
                <div
                  className={`timeline-node w-14 h-14 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${event.active
                    ? "bg-gradient-to-br from-[#CCFF00] to-[#99CC00] shadow-[0_0_40px_rgba(204,255,0,0.8),0_0_60px_rgba(204,255,0,0.4)]"
                    : "bg-gradient-to-br from-black to-gray-900 border-2 border-white/40 hover:border-[#CCFF00]/70 hover:shadow-[0_0_30px_rgba(204,255,0,0.4)]"
                    }`}
                >
                  <event.icon
                    className={`w-6 h-6 transition-all duration-300 ${event.active ? "text-black" : "text-white/70 group-hover:text-[#CCFF00]"
                      }`}
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
          {/* Vertical line with glow */}
          <div
            className="vertical-line absolute left-6 top-0 bottom-0 w-[3px]"
            style={{
              background: 'linear-gradient(180deg, rgba(204,255,0,0.8), rgba(204,255,0,0.3) 60%, transparent)',
              boxShadow: '0 0 20px rgba(204,255,0,0.3)'
            }}
          />

          <div className="flex flex-col gap-8">
            {events.map((event, idx) => (
              <div key={idx} className="relative flex items-start gap-6 timeline-card">
                {/* Node */}
                <div
                  className={`timeline-node relative z-10 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${event.active
                    ? "bg-gradient-to-br from-[#CCFF00] to-[#99CC00] shadow-[0_0_35px_rgba(204,255,0,0.7)]"
                    : "bg-gradient-to-br from-black to-gray-900 border-2 border-white/40"
                    }`}
                >
                  <event.icon
                    className={`w-6 h-6 ${event.active ? "text-black" : "text-white/70"}`}
                  />
                </div>

                {/* Card */}
                <div
                  className={`
                    group flex-1 p-5 min-h-[140px] backdrop-blur-md transition-all duration-300 relative overflow-hidden
                    ${event.active
                      ? "bg-gradient-to-br from-[#CCFF00]/15 via-[#CCFF00]/10 to-transparent border-2 border-[#CCFF00] shadow-[0_0_40px_rgba(204,255,0,0.25)]"
                      : "bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10"
                    }
                  `}
                >
                  {/* Corner accents */}
                  <div className={`absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 ${event.active ? 'border-[#CCFF00]' : 'border-white/20'
                    }`} />
                  <div className={`absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 ${event.active ? 'border-[#CCFF00]' : 'border-white/20'
                    }`} />

                  <div className="flex items-center justify-between mb-3">
                    <p
                      className={`text-xs tracking-[0.12em] uppercase ${robotoMono.className} ${event.active ? "text-[#CCFF00]" : "text-white/40"
                        }`}
                    >
                      {event.date}
                    </p>
                    <span
                      className={`text-xs font-bold px-3 py-1.5 ${robotoMono.className} transition-all duration-300 ${event.active
                        ? "bg-gradient-to-br from-[#CCFF00] to-[#99CC00] text-black shadow-[0_0_15px_rgba(204,255,0,0.4)]"
                        : "bg-white/10 text-white/60"
                        }`}
                    >
                      {event.step}
                    </span>
                  </div>

                  <h3
                    className={`text-lg font-bold mb-2 leading-tight ${event.active
                      ? "bg-gradient-to-r from-[#CCFF00] to-[#99FF00] bg-clip-text text-transparent"
                      : "text-white"
                      }`}
                  >
                    {event.title}
                  </h3>

                  <p className="text-white/60 text-sm leading-relaxed">{event.description}</p>

                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
