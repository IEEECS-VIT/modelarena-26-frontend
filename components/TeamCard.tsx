"use client";

import { useState } from "react";
import { RiFileCopyLine } from "react-icons/ri";
import Link from "next/link";

interface TeamMember {
  email: string;
  name: string | null;
  regNo: string | null;
  isTeamLeader: boolean;
}

interface TeamCardProps {
  team: {
    teamId?: string;
    teamName: string;
    teamCode: string;
    currentScore?: number;
    leaderEmail?: string;
    members: TeamMember[];
    memberCount?: number;
    createdAt?: string;
  };
  onLeave?: () => void;
}

export default function TeamCard({ team, onLeave }: TeamCardProps) {
  const [copied, setCopied] = useState(false);

  const members = team.members || [];
  const maxMembers = 3;
  const emptySlots = Math.max(0, maxMembers - members.length);

  const copyToken = () => {
    navigator.clipboard.writeText(team.teamCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full font-mono">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-widest">
          CLUSTER_ID:<span className="text-[#CCFF00]">{team.teamName.toUpperCase().replace(/\s+/g, "_")}</span>
        </h2>

        <div className="flex flex-col items-end gap-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-white/70">STATUS:</span>
            <span className="text-[#CCFF00]">ONLINE</span>
            <span className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/70">AUTH_TOKEN:</span>
            <span className="text-[#CCFF00]">{team.teamCode}</span>
            <button
              onClick={copyToken}
              className="text-white/50 hover:text-[#CCFF00] transition"
              title="Copy token"
            >
              <RiFileCopyLine />
            </button>
            {copied && <span className="text-xs text-[#CCFF00]">Copied!</span>}
          </div>
        </div>
      </div>

      {/* MEMBER CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {/* SVG Gradient Definition */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="icosahedronGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#D4FF00" />
            </linearGradient>
          </defs>
        </svg>

        {/* Existing members */}
        {members.map((member, index) => (
          <div
            key={member.email || index}
            className="relative bg-neutral-900 border border-[#9333EA]/50 rounded-lg p-4 min-h-[200px] flex flex-col items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.15)]"
          >
            {member.isTeamLeader && (
              <span className="absolute top-2 right-2 text-xs text-[#CCFF00] border border-[#CCFF00]/50 px-2 py-0.5 rounded">
                [ROOT_USER]
              </span>
            )}

            {/* Icosahedron with purple-lime gradient */}
            <div className="w-24 h-24 border border-[#9333EA]/40 rounded-lg flex items-center justify-center mb-4 bg-neutral-800/50">
              <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none" strokeWidth="1.5">
                {/* Main icosahedron shape with gradient */}
                <polygon
                  points="50,10 90,35 90,70 50,95 10,70 10,35"
                  stroke="url(#icosahedronGradient)"
                  strokeWidth="1.5"
                />
                {/* Internal lines */}
                <line x1="50" y1="10" x2="50" y2="95" stroke="url(#icosahedronGradient)" strokeWidth="1" />
                <line x1="10" y1="35" x2="90" y2="70" stroke="url(#icosahedronGradient)" strokeWidth="1" />
                <line x1="90" y1="35" x2="10" y2="70" stroke="url(#icosahedronGradient)" strokeWidth="1" />
                <line x1="50" y1="10" x2="10" y2="70" stroke="url(#icosahedronGradient)" strokeWidth="1" opacity="0.6" />
                <line x1="50" y1="10" x2="90" y2="70" stroke="url(#icosahedronGradient)" strokeWidth="1" opacity="0.6" />
                <line x1="10" y1="35" x2="50" y2="95" stroke="url(#icosahedronGradient)" strokeWidth="1" opacity="0.6" />
                <line x1="90" y1="35" x2="50" y2="95" stroke="url(#icosahedronGradient)" strokeWidth="1" opacity="0.6" />
                {/* Corner dots */}
                <circle cx="50" cy="10" r="3" fill="#D4FF00" />
                <circle cx="90" cy="35" r="2.5" fill="#9333EA" />
                <circle cx="90" cy="70" r="2.5" fill="#D4FF00" />
                <circle cx="50" cy="95" r="3" fill="#9333EA" />
                <circle cx="10" cy="70" r="2.5" fill="#D4FF00" />
                <circle cx="10" cy="35" r="2.5" fill="#9333EA" />
              </svg>
            </div>

            <span className="text-white tracking-widest text-sm text-center">
              &gt;{(member.name || member.email.split("@")[0]).toUpperCase()}
            </span>
            {member.regNo && (
              <span className="text-white/50 text-xs tracking-wider mt-1">
                [{member.regNo}]
              </span>
            )}
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="bg-neutral-900/50 border border-dashed border-neutral-700 rounded-lg p-4 min-h-[200px] flex flex-col items-center justify-center"
          >
            <div className="w-12 h-1 bg-[#CCFF00]/50 rounded mb-6"></div>
            <span className="text-white/50 tracking-widest text-xs text-center mb-1">
              SEARCHING_FOR_UPLINK
            </span>
            <span className="text-white/30 text-xs text-center">
              Share Auth Token to recruit
            </span>
          </div>
        ))}
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ACTION CONSOLE */}
        <div className="md:col-span-2 bg-neutral-900/50 border border-neutral-700 rounded-lg p-6">
          <h3 className="text-white/70 text-sm mb-4 tracking-widest">Action Console</h3>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/submit"
              className="bg-[#CCFF00] text-black px-6 py-3 rounded font-semibold tracking-widest hover:bg-[#b8e600] transition"
            >
              [LOCK_TEAM_&_SUBMIT]
            </Link>

            <button
              onClick={onLeave}
              className="text-red-500 px-6 py-3 tracking-widest hover:text-red-400 transition"
            >
              [TERMINATE_CONNECTION]
            </button>
          </div>
        </div>

        {/* SYSTEM LOG */}
        <div className="bg-neutral-900/80 border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/50 text-xs tracking-widest">SYSTEM_LOG</span>
            <span className="text-white/30 text-xs">×</span>
          </div>

          <div className="space-y-1 text-xs">
            <p className="text-white/60">
              <span className="text-white/40">[{formatDate(team.createdAt)}]</span> Cluster initialized.
            </p>
            <p className="text-white/60">
              <span className="text-white/40">[{formatDate(team.createdAt)}]</span> {members.length}/{maxMembers} nodes connected.
            </p>
            {team.currentScore !== undefined && team.currentScore > 0 && (
              <p className="text-white/60">
                <span className="text-white/40">[SCORE]</span> {team.currentScore} pts
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
