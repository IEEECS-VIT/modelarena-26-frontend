"use client";

import { useEffect, useState } from "react";
import Protected from "../../components/Protected";

export default function LiveLeaderboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("https://api.modelarena.com/team")
      .then((res) => res.json())
      .then((result) => {
        console.log(result); // see data in console
        setData(result);
      });
  }, []);

  return (
    <Protected>
      <h1>Live Leaderboard</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Protected>
  );
}

