"use client";

import Image from "next/image";
import { useEffect } from "react";
import gsap from "gsap";

type HeroProps = {
  onGoogleSignIn: () => void;
};

export default function Hero({ onGoogleSignIn }: HeroProps) {
  useEffect(() => {
    gsap.to(".human", {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".orb", {
    y: -20,
      rotation: 360,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-black">

        {/* ===== BACKGROUND ===== */}
        <Image
            src="/hero/cave.png"
            alt="Cave background"
            fill
            priority
            className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-center justify-center">

            <div className="relative w-[420px] h-[520px]">

            {/* Portal */}
            {/* <Image
                src="/hero/portal.png"
                alt="Portal"
                fill
                className="object-contain"
            /> */}

            {/* Human */}
            <Image
                src="/hero/human.png"
                alt="Human"
                width={260}
                height={420}
                className="human absolute left-8/4 top-[69%] -translate-x-1/2 -translate-y-1/2 z-10"
            />

            {/* Orb */}
            <Image
                src="/hero/orb.png"
                alt="Orb"
                width={50}
                height={50}
                className="orb absolute left-7/4 top-[50%] -translate-x-1/2 z-20"
            />
            </div>
        </div>

        <div className="relative z-30 flex h-full items-center">
            <div className="ml-[8vw] max-w-xl text-white space-y-10">

                    {/* Title */}
                    <h1 className="text-[4.2rem] md:text-[5.2rem] font-extrabold leading-[1.05] tracking-tight">
                    <span className="block text-white">
                        ModelArena
                    </span>
                    <span className="block bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                        Arena
                    </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-md">
                    Compete. Train. Deploy. <br />
                    A next-gen ML challenge platform.
                    </p>

                    {/* CTA */}
                <div className="pt-4">
                    <button
                        onClick={onGoogleSignIn}
                        className="
                        group relative overflow-hidden rounded-xl
                        bg-gradient-to-r from-orange-400 to-yellow-300
                        px-8 py-4 text-black font-semibold
                        shadow-[0_0_30px_rgba(255,165,0,0.35)]
                        transition-all duration-300
                        hover:scale-[1.04]
                        "
                    >
                        <span className="relative z-10">Sign in with Google</span>

                        {/* hover shine */}
                        <span className="absolute inset-0 -translate-x-full bg-white/30 group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                </div>
            </div>
        </div>

    </section>
  );
}
