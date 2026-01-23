"use client";

import { useState } from "react";
import CreateTeamModal from "./CreateteamModal";
import JoinTeamModal from "./JoinTeamModal";
import TeamCard from "./TeamCard";
import LeaveTeamModal from "./LeaveTeamModal";

export default function DashboardSection() {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [hasTeam, setHasTeam] = useState(false);
  const [teamData, setTeamData] = useState<any>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <section
      id="dashboard"
      className="min-h-screen px-12 py-24 bg-transparent font-mono"
    >
      <div className="max-w-6xl mx-auto">

        {/* SECTION TITLE */}
        <div className="text-center mb-18">
          <h2 className="text-4xl font-mono tracking-widest">
            <span className="text-[#CCFF00]">D</span>ashboard
          </h2>
        </div>

        {!hasTeam && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* CREATE TEAM CARD */}
            <div className="relative bg-black/80 border border-[#CCFF00] rounded-xl p-10 text-center shadow-[0_0_40px_rgba(204,255,0,0.15)] flex flex-col justify-between min-h-[420px]">

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
            <div className="relative bg-black/80 border border-dashed border-[#CCFF00]/70 rounded-xl p-10 text-center flex flex-col justify-between min-h-[420px]">

              <h3 className="text-white tracking-widest mb-8">
                ESTABLISH_UPLINK
              </h3>

              <div className="text-6xl text-[#CCFF00] mb-8">🔗</div>

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
