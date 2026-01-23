"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { robotoMono } from "@/lib/fonts";

export default function Navbar({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const pathname = usePathname();
  const [active, setActive] = useState<string>("");
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth" });
  };

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: location.origin },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  useEffect(() => {
    if (pathname && pathname !== "/") {
      if (pathname.includes("dashboard")) {
        setActive("dashboard");
        return;
      }
      if (pathname.includes("timeline")) {
        setActive("timeline");
        return;
      }
      if (pathname.includes("faq")) {
        setActive("faq");
        return;
      }
      // unknown path — clear active
      setActive("");
      return;
    }

    const ids = ["home", "dashboard", "timeline", "faq"];
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: "-40% 0px -50% 0px", threshold: 0.25 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return (
<nav
    className={`fixed top-0 z-50 w-full bg-black/90 backdrop-blur border-b border-white/10 ${robotoMono.className}`}>      
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* LOGO */}
        <button
          onClick={() => scrollTo("home")}
          className="text-white font-semibold tracking-widest"
        >
          MODE<span className="text-lime-400">L</span>ARENA
        </button>

        {/* NAV LINKS */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => scrollTo("home")}
            className={`relative text-sm md:text-base tracking-wide md:tracking-wider px-2 md:px-3 py-1 font-medium transition ${
              active === "home" ? "text-[#CCFF00]" : "text-white/80 hover:text-white"
            }`}
          >
            HOME
            {active === "home" && (
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-[#CCFF00] rounded" />
            )}
          </button>

          {isLoggedIn && (
            <button
              onClick={() => scrollTo("dashboard")
                
              }
              className={`relative text-sm md:text-base tracking-wide md:tracking-wider px-2 md:px-3 py-1 font-medium transition ${
                active === "dashboard" ? "text-[#CCFF00]" : "text-white/80 hover:text-white"
              }`}
            >
              DASHBOARD
              {active === "dashboard" && (
                <span className="absolute -bottom-2 left-0 h-1 w-full bg-[#CCFF00] rounded" />
              )}
            </button>
          )}

          <button
            onClick={() => scrollTo("timeline")}
            className={`relative text-sm md:text-base tracking-wide md:tracking-wider px-2 md:px-3 py-1 font-medium transition ${
              active === "timeline" ? "text-[#CCFF00]" : "text-white/80 hover:text-white"
            }`}
          >
            TIMELINE
            {active === "timeline" && (
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-[#CCFF00] rounded" />
            )}
          </button>

          <button
            onClick={() => scrollTo("faq")}
            className={`relative text-sm md:text-base tracking-wide md:tracking-wider px-2 md:px-3 py-1 font-medium transition ${
              active === "faq" ? "text-[#CCFF00]" : "text-white/80 hover:text-white"
            }`}
          >
            FAQ
            {active === "faq" && (
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-[#CCFF00] rounded" />
            )}
          </button>
        </div>

        {/* AUTH */}
        {!isLoggedIn ? (
          <button
            onClick={login}
            className="rounded-sm border border-lime-400 px-4 py-2 text-sm md:text-base font-semibold tracking-widest text-lime-400 hover:bg-lime-400 hover:text-black transition"
          >
            LOGIN
          </button>
        ) : (
          <button
            onClick={logout}
            className="rounded-sm bg-lime-400 px-4 py-2 text-sm md:text-base font-semibold tracking-widest text-black hover:bg-lime-300 transition"
          >
            LOGOUT
          </button>
        )}
      </div>
    </nav>
  );
}

