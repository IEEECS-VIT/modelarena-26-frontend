"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const faqs = [
  {
    command: "./what_is_modelarena.sh",
    title: "What is ModelArena?",
    output:
      "ModelArena is a competitive machine learning platform where participants submit models, compete on leaderboards, and improve through real-world challenges.",
  },
  {
    command: "./who_can_participate.sh",
    title: "Who can participate?",
    output:
      "Anyone with an interest in machine learning can participate. You just need to log in and start competing.",
  },
  {
    command: "./evaluation_process.sh",
    title: "How are models evaluated?",
    output:
      "Models are evaluated using predefined metrics specific to each competition, ensuring fairness and transparency.",
  },
  {
    command: "./is_it_free.sh",
    title: "Is participation free?",
    output:
      "Yes. ModelArena is completely free for all participants.",
  },
  {
    command: "./fresher_friendly.sh",
    title: "Is ModelArena fresher friendly?",
    output:
      "Yes. ModelArena is designed to be beginner and fresher friendly, while still offering depth for advanced participants.",
  },
  {
    command: "./team_size_limits.sh",
    title: "What is the required team size?",
    output:
      "The maximum allowed team size is 5 members. Teams with fewer members are also perfectly acceptable.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const outputRef = useRef<HTMLParagraphElement | null>(null);
  const cmdRef = useRef<HTMLParagraphElement | null>(null);
  const typingTl = useRef<gsap.core.Tween | null>(null);

  // typing effect when activeIndex changes
  useEffect(() => {
    const el = outputRef.current;
    if (!el) return;

    // kill previous tween
    typingTl.current?.kill();

    const full = faqs[activeIndex].output;

    // small object to tween a numeric index
    const obj = { i: 0 };
    // clear immediately
    el.textContent = "";

  // duration proportional to length (faster)
  // reduced per-character time so typing feels snappier
  const duration = Math.max(0.4, full.length * 0.02);

    typingTl.current = gsap.to(obj, {
      i: full.length,
      duration,
      ease: "none",
      onUpdate: () => {
        const n = Math.floor(obj.i);
        el.textContent = full.slice(0, n);
      },
    });

    // animate command line flash
    if (cmdRef.current) {
      gsap.fromTo(
        cmdRef.current,
        { color: "#9be15d" },
        { color: "#CCFF00", duration: 0.15, yoyo: true, repeat: 1 }
      );
    }

    return () => {
      typingTl.current?.kill();
    };
  }, [activeIndex]);

  return (
    <section
      id="faq"
      className="min-h-screen px-12 py-20 text-white"
    >
      {/* Heading */}
      <h2 className="mb-12 text-center text-4xl font-semibold tracking-widest">
        <span className="text-[#CCFF00]">F</span>AQ
      </h2>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:[grid-template-columns:auto_1fr]">
        {/* LEFT: Command List */}
  <div className="space-y-10 w-full md:max-w-xs">
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`group w-full border px-5 py-4 text-left font-mono text-sm transition
                ${
                  activeIndex === index
                    ? "border-[#CCFF00] text-[#CCFF00]"
                    : "border-white/20 text-white/80 hover:border-[#CCFF00]/50 hover:text-white"
                }
              `}
            >
              <span className="text-[#CCFF00]">&gt; </span>
              {faq.command}
            </button>
          ))}
        </div>

        {/* RIGHT: Terminal Output */}
        <div className="border border-white/20 bg-black">
          {/* Terminal Header */}
          <div className="flex items-center justify-between border-b border-white/20 px-4 py-2">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs tracking-widest text-white/60">
              SSH SESSION // MODELArena // PORT:8080
            </span>
          </div>

          {/* Terminal Body */}
          <div className="min-h-[260px] px-6 py-5 font-mono text-sm leading-relaxed">
            <p ref={cmdRef} className="mb-3 text-[#CCFF00]">
              $ {faqs[activeIndex].command}
            </p>
            <p
              ref={outputRef}
              className="text-white/80"
              aria-live="polite"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
