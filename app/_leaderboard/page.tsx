"use client";

import React from 'react';
import Navbar from "@/components/Navbar";

export default function LeaderboardPage() {
    // COMMENTED OUT: Leaderboard display disabled
    return (
        <>
            <Navbar />
            <main className="min-h-screen w-full bg-[#0b0b0b] text-white pt-24 pb-12 px-4 md:px-8 flex flex-col items-center justify-center">
                <div className="text-center border border-gray-700 p-8 rounded-lg bg-gray-900/20 backdrop-blur">
                    <h1 className="text-2xl font-bold font-mono text-gray-400 mb-4">[ LEADERBOARD_DISABLED ]</h1>
                    <p className="text-gray-500 font-mono">The leaderboard feature is currently disabled.</p>
                </div>
            </main>
        </>
    );
}
