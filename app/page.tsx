"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";
import ScrollReveal from "../components/ScrollReveal";

import TimelineSection from "../components/TimelineSection";
import FAQSection from "../components/FaqSection";
import Footer from "../components/Footer";
import Hero3D from "../components/Hero3D";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <Preloader />

      {/* IMPORTANT: no h-screen, no overflow */}
      <main className="scroll-smooth">
        <section
          id="home"
          className="min-h-screen px-6 md:px-12 flex flex-col items-center justify-center relative overflow-hidden"
        >
          {/* Subtle radial gradient background accent */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#CCFF00]/3 rounded-full blur-[120px] -translate-y-1/2" />
            <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto items-center relative z-10">

            {/* LEFT TEXT */}
            <ScrollReveal className="w-full flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">

              {/* Main headline with text shadow for depth */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-wide leading-[1.3] uppercase">
                <span className="text-white">YOUR </span>
                <span className="text-[#CCFF00] drop-shadow-[0_0_15px_rgba(204,255,0,0.2)]">MODEL,</span>
                <br />
                <span className="text-white">OUR </span>
                <span className="text-[#CCFF00] drop-shadow-[0_0_15px_rgba(204,255,0,0.2)]">ARENA.</span>
              </h1>

              {/* Subtle tagline */}
              <p className="mt-6 text-white/50 text-sm md:text-base tracking-wide max-w-md">
                Compete. Train. Deploy. The ultimate battleground for AI models.
              </p>

              {/* Enhanced CTA button */}
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    window.location.href = "/dashboard";
                  } else {
                    window.open("https://vtop.vit.ac.in", "_blank");
                  }
                }}
                className="mt-8 bg-[#CCFF00] px-6 py-2.5 text-sm font-bold tracking-widest text-black uppercase transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
              >
                {isLoggedIn ? "DASHBOARD" : "REGISTER NOW"}
              </button>
            </ScrollReveal>

            {/* RIGHT 3D */}
            <div className="h-[350px] md:h-[480px] lg:h-[550px] relative order-1 md:order-2">
              <Hero3D />
            </div>
          </div>
        </section>



        {/* TIMELINE */}
        <section id="timeline">
          <ScrollReveal>
            <TimelineSection />
          </ScrollReveal>
        </section>

        {/* FAQ */}
        <section id="faq">
          <ScrollReveal>
            <FAQSection />
          </ScrollReveal>
        </section>

        <Footer />
      </main>
    </>
  );
}
