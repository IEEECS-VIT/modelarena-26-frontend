"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import DashboardSection from "@/components/DashboardSection";

export default function DashboardPage() {
    const { user, session, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <Navbar />
            <main className="h-screen w-full overflow-hidden relative">
                <DashboardSection user={user} session={session} />
            </main>
        </>
    );
}

