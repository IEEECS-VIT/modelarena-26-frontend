"use client";

import { useState } from "react";

export default function CreateTeamModal({ onClose, onCreate }: any) {
  const [teamName, setTeamName] = useState("");

  const handleCreate = () => {
    if (!teamName) return;

    onCreate({
      teamName,
      captain: "You",
      teamCode: "ABC123",
      regNo: "REG-001",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-96">
        <h3 className="text-xl font-semibold mb-4">Create Team</h3>

        <input
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
