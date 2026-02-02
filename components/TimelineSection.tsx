"use client";

import { robotoMono } from "@/lib/fonts";
import { RiFlag2Fill, RiRocket2Fill, RiCalendarEventFill, RiTrophyFill } from "react-icons/ri";

const events = [
  {
    title: "Registrations Open",
    date: "Jan 25, 2026",
    description: "Team registrations begin. Gather your squad and sign up!",
    icon: RiFlag2Fill,
    step: "01",
    active: true, // Current round
  },
  {
    title: "Round 1 Begins",
    date: "Feb 08, 2026",
    description: "The first challenge is released. Start building your models.",
    icon: RiRocket2Fill,
    step: "02",
    active: false,
  },
  {
    title: "Final Submission",
    date: "Feb 10, 2026",
    description: "Deadline for all submissions. Make sure everything is polished.",
    icon: RiCalendarEventFill,
    step: "03",
    active: false,
  },
  {
    title: "Results Announced",
    date: "Feb 12, 2026",
    description: "Winners are revealed and prizes distributed.",
    icon: RiTrophyFill,
    step: "04",
    active: false,
  },
];

export default function TimelineSection() {
  return (
    <section
      id="timeline"
      className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-64 md:pt-48 md:pb-80 px-6 md:px-12 overflow-hidden"
    >
      {/* Section Header */}
      <div className="mb-40 lg:mb-80 text-center">
        <p className="text-[#CCFF00] text-sm tracking-[0.3em] uppercase mb-4 font-mono">
          // EVENT SCHEDULE
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-wide uppercase">
          <span className="text-[#CCFF00]">TIME</span>LINE
        </h2>
      </div>

      {/* Desktop Zigzag Timeline */}
      <div className="hidden lg:block w-full max-w-6xl relative">
        {/* Horizontal connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/20 -translate-y-1/2" />

        <div className="flex justify-between items-center relative">
          {events.map((event, idx) => {
            const isUp = idx % 2 === 0;
            return (
              <div
                key={idx}
                className="relative flex flex-col items-center"
                style={{ width: '22%' }}
              >
                {/* Card - positioned above or below */}
                <div
                  className={`absolute ${isUp ? 'bottom-full mb-8' : 'top-full mt-8'} w-full`}
                >
                  <div
                    className={`p-5 h-[180px] border transition-all duration-300 ${event.active
                      ? 'bg-[#CCFF00]/10 border-[#CCFF00] shadow-[0_0_30px_rgba(204,255,0,0.2)]'
                      : 'bg-white/[0.02] border-white/10 hover:border-[#CCFF00]/50 hover:bg-white/[0.04]'
                      }`}
                  >
                    {/* Step Number */}
                    <div className={`absolute ${isUp ? '-bottom-3' : '-top-3'} right-4 w-8 h-8 flex items-center justify-center ${event.active ? 'bg-[#CCFF00]' : 'bg-white/20'
                      }`}>
                      <span className={`text-xs font-bold ${event.active ? 'text-black' : 'text-white'} ${robotoMono.className}`}>
                        {event.step}
                      </span>
                    </div>

                    {/* Date */}
                    <p className={`text-xs tracking-widest mb-2 ${robotoMono.className} ${event.active ? 'text-[#CCFF00]' : 'text-white/40'
                      }`}>
                      {event.date}
                    </p>

                    {/* Title */}
                    <h3 className={`text-lg font-bold mb-2 transition-colors ${event.active ? 'text-[#CCFF00]' : 'text-white'
                      }`}>
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  {/* Connector line from card to node */}
                  <div className={`absolute left-1/2 -translate-x-1/2 w-[2px] h-8 ${event.active ? 'bg-[#CCFF00]' : 'bg-white/20'
                    } ${isUp ? 'top-full' : 'bottom-full'}`} />
                </div>

                {/* Center Node */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all ${event.active
                  ? 'bg-[#CCFF00] shadow-[0_0_25px_rgba(204,255,0,0.5)]'
                  : 'bg-black border-2 border-white/30'
                  }`}>
                  <event.icon className={`w-5 h-5 ${event.active ? 'text-black' : 'text-white/60'}`} />
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
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-white/20" />

          <div className="flex flex-col gap-8">
            {events.map((event, idx) => (
              <div key={idx} className="relative flex items-start gap-6">
                {/* Node */}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${event.active
                  ? 'bg-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.4)]'
                  : 'bg-black border-2 border-white/30'
                  }`}>
                  <event.icon className={`w-5 h-5 ${event.active ? 'text-black' : 'text-white/60'}`} />
                </div>

                {/* Card */}
                <div className={`flex-1 p-5 border ${event.active
                  ? 'bg-[#CCFF00]/10 border-[#CCFF00]'
                  : 'bg-white/[0.02] border-white/10'
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-xs tracking-widest ${robotoMono.className} ${event.active ? 'text-[#CCFF00]' : 'text-white/40'
                      }`}>
                      {event.date}
                    </p>
                    <span className={`text-xs font-bold px-2 py-1 ${robotoMono.className} ${event.active ? 'bg-[#CCFF00] text-black' : 'bg-white/10 text-white/50'
                      }`}>
                      {event.step}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${event.active ? 'text-[#CCFF00]' : 'text-white'}`}>
                    {event.title}
                  </h3>
                  <p className="text-white/50 text-sm">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
