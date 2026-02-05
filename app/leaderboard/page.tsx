"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import TopThree from '@/components/leaderboard/TopThree';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import { Team } from '@/components/leaderboard/data';

export default function LeaderboardPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const { isAuthenticated, isLoading: authLoading, login } = useAuth();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    useEffect(() => {
        if (authLoading) return;

        // AUTH REMOVED: Leaderboard is public now? If so, remove check.
        // Assuming user still wants it protected based on existing code:
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const fetchLeaderboard = async (isBackground = false) => {
            if (!isBackground) setLoading(true);
            try {
                const res = await fetch(`${API_URL}/leaderboard`);
                if (!res.ok) {
                    throw new Error('Failed to fetch leaderboard data');
                }
                const data = await res.json();

                // Handle new cached response format from backend
                if (data.leaderboard && Array.isArray(data.leaderboard)) {
                    setTeams(data.leaderboard);
                    if (data.lastUpdated) {
                        setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString());
                    }
                }
                // Fallback for old format or direct array
                else if (Array.isArray(data)) {
                    setTeams(data);
                } else if (Array.isArray(data.data)) {
                    setTeams(data.data);
                } else {
                    setTeams([]);
                    console.error("Unexpected data format", data);
                }
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                if (!isBackground) setError("Failed to load leaderboard data.");
            } finally {
                if (!isBackground) setLoading(false);
            }
        };

        // Initial fetch
        fetchLeaderboard();

        // Poll every 5 minutes (300,000 ms) to match backend cron
        const interval = setInterval(() => {
            fetchLeaderboard(true);
        }, 300000);

        return () => clearInterval(interval);
    }, [API_URL, isAuthenticated, authLoading]);

    if (authLoading) {
        return <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center text-white font-mono">[ AUTH_CHECK... ]</div>;
    }

    if (!isAuthenticated) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen w-full bg-[#0b0b0b] text-white pt-24 pb-12 px-4 md:px-8 relative overflow-hidden flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                    <div className="z-10 text-center border border-red-500/30 p-8 rounded-lg bg-red-900/10 backdrop-blur">
                        <h1 className="text-2xl font-bold font-mono text-red-500 mb-4">[ ACCESS_DENIED ]</h1>
                        <p className="text-gray-400 font-mono mb-6">Restricted Area // Authorization Required</p>
                        <button
                            onClick={login}
                            className="bg-[#CCFF00] text-black px-6 py-2 rounded font-bold tracking-widest hover:bg-[#b8e600] transition"
                        >
                            LOGIN_TO_ACCESS
                        </button>
                    </div>
                </main>
            </>
        );
    }

    const topTeams = teams.slice(0, 3);
    const restTeams = teams.slice(3);

    return (
        <>
            <Navbar />
            <main className="min-h-screen w-full bg-[#0b0b0b] text-white pt-24 pb-12 px-4 md:px-8 relative overflow-hidden">
                {/* Background Noise/Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">

                    {/* Header Section */}
                    <div className="text-center mb-12 w-full">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 font-mono">
                            LEADERBOARD<span className="text-gray-600 mx-2">//</span>
                            <span className="text-lime-400 text-shadow-neon">GLOBAL_NET_STATS</span>
                        </h1>

                        <div className="flex justify-between items-center max-w-4xl mx-auto text-xs md:text-sm font-mono text-gray-400 border-t border-b border-gray-800 py-2 mt-4 space-x-4">
                            <span>[ STATUS=<span className="text-lime-500">LIVE_EVALUATION</span> ]</span>

                            {lastUpdated && (
                                <span className="text-gray-500 hidden md:inline">
                                    [ LAST_UPDATED: <span className="text-lime-300">{lastUpdated}</span> ]
                                </span>
                            )}

                            <div className="flex items-center">
                                <span>TOTAL_CLUSTERS= {teams.length}</span>
                                <div className={`w-2 h-2 ${loading ? 'bg-yellow-500' : 'bg-lime-500'} rounded-full ml-2 animate-pulse`}></div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 font-mono text-lime-400">
                            <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <div>[ LOADING_DATA_STREAM... ]</div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 font-mono text-center border border-red-900/50 bg-red-900/10 p-4 rounded">
                            [ ERROR: {error} ]
                        </div>
                    ) : (
                        <>
                            {/* Top 3 Section */}
                            {topTeams.length > 0 && <TopThree teams={topTeams} />}

                            {/* Data Grid Section */}
                            <LeaderboardTable teams={restTeams} />
                        </>
                    )}

                </div>
            </main>
        </>
    );
}
