"use client";

import React, { useState } from 'react';
import { Team } from './data';
import { FaCaretUp, FaCaretDown, FaMinus } from 'react-icons/fa';

export default function LeaderboardTable({ teams }: { teams: Team[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTeams = teams.filter(team =>
        team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-4xl border border-gray-700 rounded-lg p-6 bg-black/50 backdrop-blur-md">
            {/* Header / Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-mono text-white tracking-widest">DATA_GRID</h2>
                <div className="flex items-center w-full md:w-auto">
                    <span className="text-lime-400 font-mono mr-2 bg-lime-900/20 px-1 border border-lime-800 text-sm">&gt;_SEARCH_FILTER:</span>
                    <input
                        type="text"
                        placeholder="[ Enter_Team_Name ]"
                        className="bg-transparent border-b border-gray-600 text-gray-300 font-mono focus:outline-none focus:border-lime-500 w-full md:w-64 px-2 py-1 placeholder-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 text-gray-500 font-mono text-xs uppercase tracking-wider mb-2 px-4">
                <div className="col-span-2">Rank <span className="mx-1 text-gray-700">//</span></div>
                <div className="col-span-4">Team_Name <span className="mx-1 text-gray-700">//</span></div>
                <div className="col-span-3 text-right">Score <span className="mx-1 text-gray-700">//</span></div>
                <div className="col-span-3 text-right">Submitted_At <span className="mx-1 text-gray-700">//</span></div>
            </div>

            <div className="border-b border-gray-800 mb-4"></div>

            {/* Table Rows */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredTeams.map((team) => (
                    <div key={team.rank} className="group relative">
                        {/* Row Background & Border */}
                        <div className="absolute inset-0 border border-gray-700 rounded bg-gray-900/30 group-hover:bg-gray-800/50 transition-colors pointer-events-none"></div>

                        {/* Content */}
                        <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 font-mono text-sm text-gray-300 relative z-10">
                            <div className="col-span-2 text-gray-400">#{String(team.rank).padStart(3, '0')}</div>
                            <div className="col-span-4 text-white font-semibold">{team.teamName}</div>
                            <div className="col-span-3 text-right text-lime-400 font-bold">{team.score ? team.score.toFixed(4) : "0"}</div>
                            <div className="col-span-3 text-right text-gray-500 text-xs">
                                {team.submittedAt ? new Date(team.submittedAt).toLocaleString() : 'Not Submitted'}
                            </div>
                        </div>

                        {/* Hover Highlight (Left Bar) */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-lime-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l"></div>
                    </div>
                ))}

                {filteredTeams.length === 0 && (
                    <div className="text-center py-8 text-gray-500 font-mono">
                        [ NO_DATA_FOUND ]
                    </div>
                )}
            </div>

        </div>
    );
}
