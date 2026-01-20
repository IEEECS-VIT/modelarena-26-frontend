"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import Navbar from "../components/Navbar";
import DashboardSection from "../components/DashboardSection";
import TimelineSection from "../components/TimelineSection";
import FAQSection from "../components/FaqSection";
import Footer from "../components/Footer";


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

      <main className="h-screen overflow-y-auto scroll-smooth">
        {/* HOME */}
        <section id="home" className="min-h-screen p-12">
          <h1 className="text-4xl font-bold">ModelArena</h1>
          <p className="mt-4 text-neutral-600">
            Compete, submit models, and climb the leaderboard.
          </p>
        </section>

        {/* DASHBOARD (ONLY AFTER LOGIN) */}
        {isLoggedIn && <DashboardSection />}

        <TimelineSection />
        <FAQSection />
        <Footer />
      </main>
    </>
  );
}
