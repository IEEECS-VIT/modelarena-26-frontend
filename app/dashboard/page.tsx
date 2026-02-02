"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import DashboardSection from "@/components/DashboardSection";
import Footer from "@/components/Footer";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                router.push("/");
            } else {
                setIsLoggedIn(true);
                setUser(data.session.user);
            }
            setIsLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!session) {
                    router.push("/");
                } else {
                    setIsLoggedIn(true);
                    setUser(session.user);
                }
            }
        );

        return () => listener.subscription.unsubscribe();
    }, [router]);

    if (isLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <>
            <Navbar isLoggedIn={true} />
            <main className="h-screen w-full overflow-hidden relative">
                <DashboardSection user={user} />
            </main>

        </>
    );
}
