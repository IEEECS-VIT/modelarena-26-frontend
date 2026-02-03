"use client";

import { useState, useEffect, useRef } from "react";
import TeamCard from "./TeamCard";
import LeaveTeamModal from "./LeaveTeamModal";
import { RiLinkM, RiLoader4Line } from "react-icons/ri";
import gsap from "gsap";
import { useToast } from "./Toast";

interface DashboardSectionProps {
  user?: any;
  session?: any;
}

interface TeamMember {
  email: string;
  name: string | null;
  regNo: string | null;
  isTeamLeader: boolean;
}

interface TeamData {
  teamId: string;
  teamName: string;
  teamCode: string;
  currentScore: number;
  leaderEmail: string;
  members: TeamMember[];
  memberCount: number;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function DashboardSection({ user, session }: DashboardSectionProps) {
  const { toast } = useToast();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [hasTeam, setHasTeam] = useState<boolean | null>(null);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Inline input states
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);

  // Get access token
  const getAccessToken = (): string | null => {
    if (session?.access_token) return session.access_token;
    const storedSession = localStorage.getItem("modelarena_session");
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        return parsed.access_token;
      } catch {
        return null;
      }
    }
    return null;
  };

  // Fetch user data to check hasTeam status
  const fetchUserData = async () => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setHasTeam(userData.hasTeam || false);

        if (userData.hasTeam) {
          await fetchTeamDetails();
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch team details
  const fetchTeamDetails = async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/team`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTeamData(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  };

  // Create team
  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;

    const token = getAccessToken();
    if (!token) {
      toast.error("Please log in to create a team");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch(`${API_URL}/team/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamName: teamName.trim() }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || "Team created successfully!");
        setHasTeam(true);
        setTeamName("");
        await fetchTeamDetails();
      } else {
        toast.error(result.message || "Failed to create team");
      }
    } catch (error) {
      console.error("Create team error:", error);
      toast.error("Failed to create team. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Join team
  const handleJoinTeam = async () => {
    if (!joinCode.trim()) return;

    const token = getAccessToken();
    if (!token) {
      toast.error("Please log in to join a team");
      return;
    }

    setIsJoining(true);
    try {
      const response = await fetch(`${API_URL}/team/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamCode: joinCode.trim().toUpperCase() }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || "Successfully joined the team!");
        setHasTeam(true);
        setJoinCode("");
        await fetchTeamDetails();
      } else {
        toast.error(result.message || "Failed to join team");
      }
    } catch (error) {
      console.error("Join team error:", error);
      toast.error("Failed to join team. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  // Leave team
  const handleLeaveTeam = async () => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Please log in to leave the team");
      return;
    }

    setIsLeaving(true);
    try {
      const response = await fetch(`${API_URL}/team/leave`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || "Successfully left the team");
        setHasTeam(false);
        setTeamData(null);
        setShowLeaveModal(false);
      } else {
        toast.error(result.message || "Failed to leave team");
      }
    } catch (error) {
      console.error("Leave team error:", error);
      toast.error("Failed to leave team. Please try again.");
    } finally {
      setIsLeaving(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUserData();
  }, [session]);

  // Welcome animation
  useEffect(() => {
    if (headingRef.current && user && !hasTeam) {
      const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "USER";
      const finalText = `WELCOME, ${name.toUpperCase()}`;

      headingRef.current.innerHTML = "";

      const chars = finalText.split("");
      chars.forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.opacity = "0";
        span.style.filter = "blur(10px)";
        span.style.transform = "translateY(10px)";
        span.style.display = "inline-block";
        if (char === " ") span.style.width = "0.5em";
        headingRef.current?.appendChild(span);
      });

      gsap.to(headingRef.current.children, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
      });
    }
  }, [user, hasTeam]);

  if (isLoading) {
    return (
      <section className="h-full w-full flex items-center justify-center bg-transparent">
        <div className="flex items-center gap-3 text-white/70">
          <RiLoader4Line className="w-6 h-6 animate-spin" />
          <span className="font-mono tracking-widest">LOADING_DATA...</span>
        </div>
      </section>
    );
  }

  return (
    <section
      id="dashboard"
      className="h-full w-full px-6 md:px-12 flex flex-col justify-center items-center bg-transparent font-mono"
    >
      <div className="w-full max-w-[90%] mx-auto">

        {/* SECTION TITLE - Only show welcome message when no team */}
        {!hasTeam && (
          <div className="text-center mb-16 whitespace-nowrap min-h-[4rem]">
            <h2 ref={headingRef} className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-widest uppercase">
              {/* Text injected by JS */}
            </h2>
          </div>
        )}

        {!hasTeam && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

            {/* CREATE TEAM CARD */}
            <div className="relative bg-black/80 border border-[#CCFF00] rounded-xl p-10 text-center shadow-[0_0_40px_rgba(204,255,0,0.15)] flex flex-col justify-between min-h-[420px] w-full">

              <h3 className="text-[#CCFF00] tracking-widest mb-8">
                INITIALIZE_NEW_CLUSTER
              </h3>

              <div className="text-6xl text-[#CCFF00] mb-8">[ + ]</div>

              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter_Team_Name..."
                className="w-full bg-neutral-800 border border-[#CCFF00]/40 text-white px-4 py-2 rounded mb-6 placeholder:text-white/40 focus:outline-none focus:border-[#CCFF00]"
                disabled={isCreating}
              />

              <button
                onClick={handleCreateTeam}
                disabled={!teamName.trim() || isCreating}
                className="w-full bg-[#CCFF00] text-black py-4 rounded font-semibold tracking-widest hover:bg-[#b8e600] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreating && <RiLoader4Line className="w-5 h-5 animate-spin" />}
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
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Paste_Code_Here..."
                maxLength={6}
                className="w-full bg-neutral-800 border border-[#CCFF00]/40 text-white px-4 py-2 rounded mb-6 placeholder:text-white/40 focus:outline-none focus:border-[#CCFF00] uppercase"
                disabled={isJoining}
              />

              <button
                onClick={handleJoinTeam}
                disabled={!joinCode.trim() || isJoining}
                className="w-full border border-white text-white py-4 rounded tracking-widest hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isJoining && <RiLoader4Line className="w-5 h-5 animate-spin" />}
                &gt; CONNECT
              </button>
            </div>
          </div>
        )}

        {/* TEAM EXISTS */}
        {hasTeam && teamData && (
          <div className="w-full">
            <TeamCard
              team={teamData}
              onLeave={() => setShowLeaveModal(true)}
            />
          </div>
        )}

        {showLeaveModal && (
          <LeaveTeamModal
            onClose={() => setShowLeaveModal(false)}
            onConfirm={handleLeaveTeam}
            isLoading={isLeaving}
          />
        )}
      </div>
    </section>
  );
}
