"use client";

import { supabase } from "@/lib/supabase";
import Hero from "./components/Hero";

export default function LandingPage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    });
  };

  return (
    <Hero onGoogleSignIn={signInWithGoogle} />
  );
}
