"use client";

import { useEffect, useState } from "react";
import Protected from "../components/Protected";

export default function Dashboard() {
  const [team, setTeam] = useState(null);

  useEffect(() => {
    fetch("https://api.modelarena.com/team")
      .then(res => res.json())
      .then(data => setTeam(data));
  }, []);

  return (
    <Protected>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(team, null, 2)}</pre>
    </Protected>
  );
}

