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
    <section id="dashboard" className="min-h-screen p-12 bg-transparent">
      <div className="bg-overlay p-8 rounded-lg max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-white">Dashboard</h2>

      {!hasTeam && (
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-3 bg-black text-white rounded-md"
          >
            Create Team
          </button>

          <button
            onClick={() => setShowJoin(true)}
            className="px-6 py-3 border border-white rounded-md text-white"
          >
            Join via Code
          </button>
        </div>
      )}

      {hasTeam && <TeamCard team={teamData} />}


      {hasTeam && (
        <button
          onClick={() => setShowLeaveModal(true)}
          className="mt-6 text-red-600 hover:underline"
        >
          Leave Team
        </button>
      )}

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
