"use client";

import { supabase } from "../lib/supabase";

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
    <main style={{ padding: "60px" }}>
      <h1>ModelArena</h1>

      <p>
        A competitive ML challenge platform where participants
        submit models and climb the leaderboard. sneha
      </p>

      <br />

      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </main>
  );
}
