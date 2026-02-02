"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { robotoMono } from "@/lib/fonts";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";

export default function Navbar({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const pathname = usePathname();
  const [active, setActive] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setIsMenuOpen(false); // Close menu on click
    if (pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth" });
  };

  const login = async () => {
    setIsMenuOpen(false);
    // Set flag to skip preloader after OAuth redirect
    sessionStorage.setItem("internalNavigation", "true");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: location.origin },
    });
  };

  const logout = async () => {
    setIsMenuOpen(false);
    // Set flag to skip preloader after logout
    sessionStorage.setItem("internalNavigation", "true");
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
          className="font-bold tracking-widest z-50 relative"
        >
          <span className="text-white">MODEL</span><span className="text-[#CCFF00]">ARENA</span>
        </button>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* DESKTOP AUTH */}
        <div className="hidden md:block">
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

        {/* MOBILE HAMBURGER (Visible only when menu is closed) */}
        {!isMenuOpen && (
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden z-50 text-white p-2"
          >
            <RiMenu3Line className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* MOBILE MENU OVERLAY (Full Screen Slide-over) */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col transition-transform duration-300 ease-out md:hidden bg-black ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{
          backgroundColor: "#000000",
          width: "100vw",
          height: "100vh",
          minHeight: "100vh",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        {/* Header inside Menu */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
          <span className="font-bold tracking-widest text-lg">
            <span className="text-white">MODEL</span><span className="text-[#CCFF00]">ARENA</span>
          </span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-white p-2"
          >
            <RiCloseLine className="w-8 h-8" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col items-center justify-center flex-1 gap-8 pb-20">
          <button
            onClick={() => scrollTo("home")}
            className={`text-lg font-bold tracking-widest hover:text-[#CCFF00] transition-colors ${active === "home" ? "text-[#CCFF00]" : "text-white"}`}
          >
            HOME
          </button>

          {isLoggedIn && (
            <button
              onClick={() => {
                if (pathname === '/dashboard') {
                  setIsMenuOpen(false);
                  return;
                }
                window.location.href = "/dashboard";
              }}
              className={`text-lg font-bold tracking-widest hover:text-[#CCFF00] transition-colors ${pathname === "/dashboard" ? "text-[#CCFF00]" : "text-white"}`}
            >
              DASHBOARD
            </button>
          )}

          <button
            onClick={() => scrollTo("timeline")}
            className={`text-lg font-bold tracking-widest hover:text-[#CCFF00] transition-colors ${active === "timeline" ? "text-[#CCFF00]" : "text-white"}`}
          >
            TIMELINE
          </button>

          <button
            onClick={() => scrollTo("faq")}
            className={`text-lg font-bold tracking-widest hover:text-[#CCFF00] transition-colors ${active === "faq" ? "text-[#CCFF00]" : "text-white"}`}
          >
            FAQ
          </button>

          <div className="pt-8">
            {!isLoggedIn ? (
              <button
                onClick={login}
                className="bg-[#CCFF00] px-8 py-3 text-sm font-bold tracking-widest text-black shadow-[3px_3px_0px_0px_white] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
              >
                LOGIN
              </button>
            ) : (
              <button
                onClick={logout}
                className="bg-[#CCFF00] px-8 py-3 text-sm font-bold tracking-widest text-black shadow-[3px_3px_0px_0px_white] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
              >
                LOGOUT
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

