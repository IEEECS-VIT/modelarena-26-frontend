"use client";

import { useState, useEffect, useRef } from "react";
import CreateTeamModal from "./CreateteamModal";
import JoinTeamModal from "./JoinTeamModal";
import TeamCard from "./TeamCard";
import LeaveTeamModal from "./LeaveTeamModal";
import { RiLinkM } from "react-icons/ri";
import gsap from "gsap";

interface DashboardSectionProps {
  user?: any;
}

export default function DashboardSection({ user }: DashboardSectionProps) {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [hasTeam, setHasTeam] = useState(false);
  const [teamData, setTeamData] = useState<any>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (headingRef.current && user) {
      const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "USER";
      const finalText = `WELCOME, ${name.toUpperCase()}`;

      // Clear previous content
      headingRef.current.innerHTML = "";

      // Split text into characters for individual animation
      const chars = finalText.split("");
      chars.forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.opacity = "0";
        span.style.filter = "blur(10px)";
        span.style.transform = "translateY(10px)";
        span.style.display = "inline-block";
        // preserve spaces
        if (char === " ") span.style.width = "0.5em";
        headingRef.current?.appendChild(span);
      });

      // Animate: Blur -> Clear, Opacity 0 -> 1, Y 10 -> 0
      gsap.to(headingRef.current.children, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
      });
    }
  }, [user]);

  return (
    <section
      id="dashboard"
      className="h-full w-full px-6 md:px-12 flex flex-col justify-center items-center bg-transparent font-mono"
    >
      <div className="w-full max-w-[90%] mx-auto">

        {/* SECTION TITLE */}
        <div className="text-center mb-16 whitespace-nowrap min-h-[4rem]">
          <h2 ref={headingRef} className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-widest uppercase">
            {/* Text injected by JS */}
          </h2>
        </div>

        {!hasTeam && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

            {/* CREATE TEAM CARD */}
            <div className="relative bg-black/80 border border-[#CCFF00] rounded-xl p-10 text-center shadow-[0_0_40px_rgba(204,255,0,0.15)] flex flex-col justify-between min-h-[420px] w-full">

              <h3 className="text-[#CCFF00] tracking-widest mb-8">
                INITIALIZE_NEW_CLUSTER
              </h3>

              <div className="text-6xl text-[#CCFF00] mb-8">[ + ]</div>

              <input
                disabled
                placeholder="Enter_Team_Name..."
                className="w-full bg-neutral-800 border border-[#CCFF00]/40 text-white px-4 py-2 rounded mb-6 placeholder:text-white/40"
              />

              <button
                onClick={() => setShowCreate(true)}
                className="w-full bg-[#CCFF00] text-black py-4 rounded font-semibold tracking-widest hover:bg-[#b8e600] transition"
              >
                &gt; EXECUTE_CREATE
              </button>
            </div>

            {/* JOIN TEAM CARD */}
            <div className="relative bg-black/80 border border-dashed border-[#CCFF00]/70 rounded-xl p-10 text-center flex flex-col justify-between min-h-[420px] w-full">

              <h3 className="text-white tracking-widest mb-8">
                ESTABLISH_UPLINK
              </h3>

              <div className="text-6xl text-[#CCFF00] mb-8 flex justify-center">
                <RiLinkM />
              </div>

              <input
                disabled
                placeholder="Paste_Code_Here..."
                className="w-full bg-neutral-800 border border-[#CCFF00]/40 text-white px-4 py-2 rounded mb-6 placeholder:text-white/40"
              />

              <button
                onClick={() => setShowJoin(true)}
                className="w-full border border-white text-white py-4 rounded tracking-widest hover:bg-white hover:text-black transition"
              >
                &gt; CONNECT
              </button>
            </div>
          </div>
        )}

        {/* TEAM EXISTS */}
        {hasTeam && (
          <div className="mt-12">
            <TeamCard team={teamData} />

            <button
              onClick={() => setShowLeaveModal(true)}
              className="mt-6 text-red-500 hover:underline"
            >
              &gt; TERMINATE_CLUSTER
            </button>
          </div>
        )}

        {/* MODALS */}
        {showCreate && (
          <CreateTeamModal
            onClose={() => setShowCreate(false)}
            onCreate={(team: any) => {
              setTeamData(team);
              setHasTeam(true);
              setShowCreate(false);
            }}
          />
        )}

        {showJoin && (
          <JoinTeamModal
            onClose={() => setShowJoin(false)}
            onJoin={(team: any) => {
              setTeamData(team);
              setHasTeam(true);
              setShowJoin(false);
            }}
          />
        )}

        {showLeaveModal && (
          <LeaveTeamModal
            onClose={() => setShowLeaveModal(false)}
            onConfirm={() => {
              setHasTeam(false);
              setTeamData(null);
              setShowLeaveModal(false);
            }}
          />
        )}
      </div>
    </section>
  );
}
