"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

// Types
interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage key for Supabase session (includes access_token, refresh_token, user, etc.)
const STORAGE_KEY = "modelarena_session";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verify user with backend (just checks if registered)
    const verifyWithBackend = async (accessToken: string): Promise<boolean> => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            throw new Error("Backend API URL not configured");
        }

        try {
            const response = await fetch(`${apiUrl}/user`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: "Verification failed" }));
                throw new Error(error.error || "User not registered on VTOP");
            }

            return true;
        } catch (error) {
            console.error("Backend verification failed:", error);
            throw error;
        }
    };

    // Save session to localStorage
    const saveSession = (sessionData: Session) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    };

    // Clear session from localStorage
    const clearSession = () => {
        localStorage.removeItem(STORAGE_KEY);
    };

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Check for existing session from Supabase
                const { data: { session: currentSession } } = await supabase.auth.getSession();

                if (currentSession) {
                    // Always verify with backend to ensure user is still registered
                    await verifyWithBackend(currentSession.access_token);
                    // If verification passes, save session
                    setUser(currentSession.user);
                    setSession(currentSession);
                    saveSession(currentSession);
                }
            } catch (error) {
                console.error("Auth init error:", error);
                // Clear everything on error
                clearSession();
                await supabase.auth.signOut();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (event === "SIGNED_OUT") {
                setUser(null);
                setSession(null);
                clearSession();
            } else if (event === "TOKEN_REFRESHED" && newSession) {
                // Token refreshed - update everything
                setSession(newSession);
                setUser(newSession.user);
                saveSession(newSession);
            } else if (event === "SIGNED_IN" && newSession) {
                // New sign in - save the full session
                setSession(newSession);
                setUser(newSession.user);
                saveSession(newSession);
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    // Login function
    const login = async () => {
        sessionStorage.setItem("internalNavigation", "true");
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
    };

    // Logout function
    const logout = async () => {
        sessionStorage.setItem("internalNavigation", "true");
        clearSession();
        setUser(null);
        setSession(null);
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    const value: AuthContextType = {
        user,
        session,
        isLoading,
        isAuthenticated: !!user && !!session,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
