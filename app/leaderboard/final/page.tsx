"use client";

import { useEffect, useState } from "react";

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
    <>
      <h1>Live Leaderboard</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

