"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../lib/supabase";

import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";
import {
  usePremiumScrollEffects,
  SplitTextReveal,
  BlurReveal,
  ScaleReveal,
  ClipReveal,
  ParallaxLayer,
} from "../components/ExtremeScrollAnimations";

import TimelineSection from "../components/TimelineSection";
import FAQSection from "../components/FaqSection";
import Footer from "../components/Footer";

const Hero3D = dynamic(() => import("../components/Hero3D"), {
  ssr: false,
  loading: () => null,
});

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  usePremiumScrollEffects();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoggedIn(!!session);

        // // Call /api/user on sign in to check if user is registered on VTOP
        // if (event === "SIGNED_IN" && session) {
        //   try {
        //     const response = await fetch("/api/user", {
        //       method: "POST",
        //       headers: {
        //         "Authorization": `Bearer ${session.access_token}`,
        //         "Content-Type": "application/json",
        //       },
        //     });

        //     if (!response.ok) {
        //       let errorMessage = "Authentication failed";
        //       try {
        //         const errorData = await response.json();
        //         errorMessage = errorData.error || errorMessage;
        //       } catch {
        //         // Response wasn't JSON, use status text
        //         errorMessage = response.statusText || errorMessage;
        //       }
        //       // Sign out the user and show backend error message
        //       await supabase.auth.signOut();
        //       alert(errorMessage);
        //     }
        //   } catch (error) {
        //     console.error("Failed to check user registration:", error);
        //     // Don't crash the app, just log the error
        //   }
        // }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <Preloader />

      <main className="scroll-smooth">
        {/* ========== HERO SECTION ========== */}
        <section
          id="home"
          className="min-h-screen px-6 md:px-12 flex flex-col items-center justify-center relative overflow-hidden"
        >

          <div className="absolute inset-0 pointer-events-none">
            <ParallaxLayer speed={-0.3}>
              <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#CCFF00]/5 rounded-full blur-[150px] -translate-y-1/2" />
            </ParallaxLayer>
            <ParallaxLayer speed={0.2}>
              <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[120px]" />
            </ParallaxLayer>
            <ParallaxLayer speed={-0.5}>
              <div className="absolute bottom-1/4 left-1/2 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
            </ParallaxLayer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto items-center relative z-10">
            {/* LEFT TEXT */}
            <div className="w-full flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
              {/* Split Text Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-wide leading-[1.3] uppercase">
                <SplitTextReveal className="text-white inline" delay={0}>
                  YOUR
                </SplitTextReveal>{" "}
                <SplitTextReveal
                  className="text-[#CCFF00] drop-shadow-[0_0_20px_rgba(204,255,0,0.3)] inline"
                  delay={0.1}
                >
                  MODEL,
                </SplitTextReveal>
                <br />
                <SplitTextReveal className="text-white inline" delay={0.2}>
                  OUR
                </SplitTextReveal>{" "}
                <SplitTextReveal
                  className="text-[#CCFF00] drop-shadow-[0_0_20px_rgba(204,255,0,0.3)] inline"
                  delay={0.3}
                >
                  ARENA.
                </SplitTextReveal>
              </h1>

              {/* Blur Reveal Tagline */}
              <BlurReveal className="mt-8" delay={0.5}>
                <p className="text-white/50 text-sm md:text-base tracking-wide max-w-md">
                  Compete. Train. Deploy. The ultimate battleground for AI models.
                </p>
              </BlurReveal>

              {/* Scale Reveal Button */}
              <ScaleReveal from={0.8} delay={0.7}>
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      window.location.href = "/dashboard";
                    } else {
                      window.open("https://vtop.vit.ac.in", "_blank");
                    }
                  }}
                  className="mt-8 bg-[#CCFF00] px-6 py-2.5 text-sm font-bold tracking-widest text-black uppercase transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:scale-105"
                >
                  {isLoggedIn ? "DASHBOARD" : "REGISTER NOW"}
                </button>
              </ScaleReveal>
            </div>

            {/* RIGHT 3D */}
            <div className="h-[350px] md:h-[480px] lg:h-[550px] relative order-1 md:order-2">
              <Hero3D />
            </div>
          </div>

          {/* Scroll Indicator */}
          <BlurReveal className="absolute bottom-10 left-1/2 -translate-x-1/2" delay={1}>
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-white/30 text-xs tracking-widest font-mono">SCROLL</span>
              <div className="w-px h-8 bg-gradient-to-b from-[#CCFF00]/50 to-transparent" />
            </div>
          </BlurReveal>
        </section>

        {/* ========== TIMELINE SECTION ========== */}
        <section id="timeline">
          <ClipReveal direction="bottom">
            <TimelineSection />
          </ClipReveal>
        </section>

        {/* ========== FAQ SECTION ========== */}
        <section id="faq">
          <ClipReveal direction="left">
            <FAQSection />
          </ClipReveal>
        </section>

        {/* ========== FOOTER ========== */}
        <BlurReveal>
          <Footer />
        </BlurReveal>
      </main>
    </>
  );
}
