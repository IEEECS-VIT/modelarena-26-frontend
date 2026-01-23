"use client";

import { useState } from "react";

export default function JoinTeamModal({ onClose, onJoin }: any) {
  const [code, setCode] = useState("");

  const handleJoin = () => {
    if (!code) return;

    onJoin({
      teamName: "Joined Team",
      captain: "Captain Name",
      teamCode: code,
      regNo: "REG-002",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-96 text-black">
        <h3 className="text-xl font-semibold mb-4">Join Team</h3>

        <input
          placeholder="Team Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border p-2 rounded mb-4 placeholder-black text-black"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded text-black">Cancel</button>
          <button
            onClick={handleJoin}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
