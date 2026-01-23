"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import Navbar from "../components/Navbar";
import DashboardSection from "../components/DashboardSection";
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

      {/* IMPORTANT: no h-screen, no overflow */}
      <main className="scroll-smooth">
        <section
          id="home"
          className="min-h-screen px-12 pt-28 flex items-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-7xl mx-auto">
            
            {/* LEFT TEXT */}
            <div>
              <div className="text-4xl font-bold text-white">ModelArena</div>
              <h1 className="text-6xl md:text-8xl lg:text-7xl font-extrabold tracking-tight leading-tight mt-4">
                Your Model,
                <br />
                <span className="text-[#CCFF00]">Our Arena.</span>
              </h1>
            </div>

            {/* RIGHT 3D */}
            <div className="h-[420px] md:h-[520px]">
              <Hero3D />
            </div>
          </div>
        </section>

        {/* DASHBOARD */}
        {isLoggedIn && (
          <section id="dashboard">
            <DashboardSection />
          </section>
        )}

        {/* TIMELINE */}
        <section id="timeline">
          <TimelineSection />
        </section>

        {/* FAQ */}
        <section id="faq">
          <FAQSection />
        </section>

        <Footer />
      </main>
    </>
  );
}
