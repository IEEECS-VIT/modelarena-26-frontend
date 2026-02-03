"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const outputRef = useRef<HTMLParagraphElement | null>(null);
  const cmdRef = useRef<HTMLParagraphElement | null>(null);
  const typingTl = useRef<gsap.core.Tween | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const [currentFact, setCurrentFact] = useState<string>(
    "Fact: Around 90% of the cost in ML projects comes from data collection and cleaning — good data matters more than fancy models."
  );

  const facts = [
    "Fact: Around 90% of the cost in ML projects comes from data collection and cleaning — good data matters more than fancy models.",
    "Fact: Data augmentation often improves model robustness more than increasing model size.",
    "Fact: Transfer learning can drastically reduce training time and data requirements for many tasks.",
    "Fact: Proper evaluation splits (validation/test) prevent overly optimistic performance estimates.",
    "Fact: Feature quality usually beats adding more complex architectures — spend time on signals.",
    "Fact: Model interpretability improves trust and debugging — simple, explainable models are often preferred in production.",
    "Fact: Small, clean validation datasets can surface overfitting earlier than larger noisy sets.",
    "Fact: Hyperparameter search yields diminishing returns past a point; invest in data and features first.",
    "Fact: Monitoring data drift and model performance in production catches degradation early.",
    "Fact: Model compression techniques (pruning, quantization) enable edge deployment with little accuracy loss.",
  ];

  const randomFact = () => facts[Math.floor(Math.random() * facts.length)];

  useEffect(() => {
    setCurrentFact(randomFact());
  }, []);

  // Scroll animations
  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const terminal = terminalRef.current;
    const buttons = buttonsRef.current;
    if (!section || !heading || !terminal || !buttons) return;

    const ctx = gsap.context(() => {
      // Heading split text animation
      const chars = heading.querySelectorAll(".char");
      gsap.fromTo(
        chars,
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
            start: "top 85%",
          },
        }
      );

      // Terminal slide in from right with 3D rotation
      gsap.fromTo(
        terminal,
        { x: 200, opacity: 0, rotateY: -20 },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: terminal,
            start: "top 80%",
          },
        }
      );

      // Buttons stagger from left
      const buttonElements = buttons.querySelectorAll("button");
      gsap.fromTo(
        buttonElements,
        { x: -100, opacity: 0, scale: 0.9 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: buttons,
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Typing effect
  useEffect(() => {
    const el = outputRef.current;
    if (!el) return;

    typingTl.current?.kill();

    if (activeIndex === null) {
      el.textContent = currentFact;
      if (cmdRef.current) cmdRef.current.textContent = "";
      return;
    }

    const full = faqs[activeIndex].output;
    const obj = { i: 0 };
    el.textContent = "";

    const duration = Math.max(0.35, full.length * 0.018);

    typingTl.current = gsap.to(obj, {
      i: full.length,
      duration,
      ease: "none",
      onUpdate: () => {
        const n = Math.floor(obj.i);
        el.textContent = full.slice(0, n);
      },
    });

    if (cmdRef.current) {
      cmdRef.current.textContent = `$ ${faqs[activeIndex].command}`;
      gsap.fromTo(
        cmdRef.current,
        { color: "#9be15d" },
        { color: "#CCFF00", duration: 0.12, yoyo: true, repeat: 1 }
      );
    }

    return () => {
      typingTl.current?.kill();
    };
  }, [activeIndex, currentFact]);

  // Split text helper
  const splitText = (text: string, className = "") => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className={`char inline-block ${className}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="min-h-screen px-6 md:px-12 py-20 text-white"
    >
      {/* Heading */}
      <h2
        ref={headingRef}
        className="mb-20 text-center text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-wide uppercase"
        style={{ perspective: "1000px" }}
      >
        <span className="text-[#CCFF00]">{splitText("FAQ")}</span>
        {splitText("S")}
      </h2>

      <div
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:gap-8 md:[grid-template-columns:auto_1fr]"
        style={{ perspective: "1200px" }}
      >
        {/* Terminal Output */}
        <div
          ref={terminalRef}
          className="border border-white/20 bg-black/90 backdrop-blur-sm order-first md:order-last"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="flex items-center justify-between border-b border-white/20 px-4 py-2">
            <div className="flex gap-2 flex-shrink-0">
              <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="hidden sm:block text-xs tracking-widest text-white/60">
              $modelarena.sh
            </span>
            <span className="sm:hidden text-[10px] tracking-wider text-white/60">
              $modelarena.sh
            </span>
          </div>

          <div className="min-h-[200px] md:min-h-[260px] px-6 py-5 font-mono text-sm leading-relaxed">
            <p ref={cmdRef} className="mb-3 text-[#CCFF00]">
              {activeIndex !== null ? `$ ${faqs[activeIndex].command}` : ""}
            </p>
            <p
              ref={outputRef}
              className="text-white/80"
              aria-live="polite"
            />
          </div>
        </div>

        {/* Command List */}
        <div
          ref={buttonsRef}
          className="space-y-4 md:space-y-10 w-full md:max-w-xs order-last md:order-first"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveIndex(null);
              setCurrentFact(randomFact());
            }
          }}
        >
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => {
                if (activeIndex === index) {
                  setActiveIndex(null);
                  setCurrentFact(randomFact());
                } else {
                  setActiveIndex(index);
                }
              }}
              className={`group w-full border px-5 py-3 md:py-4 text-left font-mono text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                ${activeIndex === index
                  ? "border-[#CCFF00] text-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                  : "border-white/20 text-white/80 hover:border-[#CCFF00]/50 hover:text-white hover:shadow-[0_0_15px_rgba(204,255,0,0.1)]"
                }
              `}
            >
              <span className="text-[#CCFF00]">&gt; </span>
              {faq.command}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
