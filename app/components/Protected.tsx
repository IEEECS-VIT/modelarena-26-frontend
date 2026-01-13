"use client";
import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Protected({ 
    children,
 }:{
    children: React.ReactNode;
 }){
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data }) => {
  //     if (!data.session) router.push("/login");
  //     else setLoading(false);
  //   });
  // }, []);

  if (loading) return <p>Loading...</p>;
  return children;
}
