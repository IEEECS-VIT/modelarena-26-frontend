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

  useEffect(() => {
    if (pathname === "/") {
      setActive("home");
    } else if (pathname.includes("dashboard")) {
      setActive("dashboard");
    } else {
      setActive("");
    }
  }, [pathname]);

  const scrollTo = (id: string) => {
    if (pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }

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
    if (pathname !== "/") {
      return;
    }

    const ids = ["home", "timeline", "faq"];
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
      { root: null, rootMargin: "-45% 0px -45% 0px", threshold: 0 }
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
          className="font-bold tracking-widest"
        >
          <span className="text-white">MODEL</span><span className="text-[#CCFF00]">ARENA</span>
        </button>

        {/* NAV LINKS */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => scrollTo("home")}
            className={`relative text-sm md:text-base tracking-wide md:tracking-wider px-2 md:px-3 py-1 font-medium transition ${active === "home" ? "text-[#CCFF00]" : "text-white/80 hover:text-white"
              }`}
          >
            HOME
            {active === "home" && (
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-[#CCFF00] rounded" />
            )}
          </button>

          {isLoggedIn && (
            <button
              onClick={() => {
                if (pathname === '/dashboard') return;
                // If we are on home, we can just push.
                // Ideally we use a Link component, but to keep styling consistent with buttons:
                window.location.href = "/dashboard";
              }}
              className={`relative text-sm md:text-base tracking-wide md:tracking-wider px-2 md:px-3 py-1 font-medium transition ${pathname === "/dashboard" ? "text-[#CCFF00]" : "text-white/80 hover:text-white"
                }`}
            >
              DASHBOARD
              {pathname === "/dashboard" && (
                <span className="absolute -bottom-2 left-0 h-1 w-full bg-[#CCFF00] rounded" />
              )}
            </button>
          )}

          <button
            onClick={() => scrollTo("timeline")}
            className={`relative text-sm md:text-base tracking-wide md:tracking-wider px-2 md:px-3 py-1 font-medium transition ${active === "timeline" ? "text-[#CCFF00]" : "text-white/80 hover:text-white"
              }`}
          >
            TIMELINE
            {active === "timeline" && (
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-[#CCFF00] rounded" />
            )}
          </button>

          <button
            onClick={() => scrollTo("faq")}
            className={`relative text-sm md:text-base tracking-wide md:tracking-wider px-2 md:px-3 py-1 font-medium transition ${active === "faq" ? "text-[#CCFF00]" : "text-white/80 hover:text-white"
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
            className="relative bg-[#CCFF00] px-5 py-2 text-sm font-bold tracking-widest text-black transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            LOGIN
          </button>
        ) : (
          <button
            onClick={logout}
            className="relative bg-[#CCFF00] px-5 py-2 text-sm font-bold tracking-widest text-black transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            LOGOUT
          </button>
        )}
      </div>
    </nav>
  );
}

