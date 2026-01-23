"use client";

import Hero3D from "./Hero3D";
import Image from "next/image";

// NOTE: replace these with the official IEEE CS VIT handles if different.
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/ieeecs_vit/",
  linkedin: "https://www.linkedin.com/company/ieee-cs-vit/posts/?feedView=all",
  youtube: "https://www.youtube.com/@ieeecomputersociety-vitcha2386",
  x: "https://x.com/ieeecsvit",
  github: "https://x.com/ieeecsvit",
  medium: "https://medium.com/@IEEE_Computer_Society_VIT",
};

export default function Footer() {
  return (
  <footer className="relative bg-black text-white px-6 py-16 overflow-hidden">

      {/* subtle top border */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-white/5" />

      {/* TOP GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start md:divide-x md:divide-[1px] md:divide-gray-800/40 py-7 md:min-h-[260px]">

        {/* LEFT — DIRECTORY */}
        <div className="px-4 md:px-8">
          <h3 className="font-mono text-[#CCFF00] text-lg tracking-widest mb-4">Directory</h3>
          <ul className="space-y-3 font-mono text-base text-white/70">
            <li>
              <a href="#" className="flex items-center gap-3 hover:text-white">
                <span className="text-[#CCFF00]">&gt;</span>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#about" className="flex items-center gap-3 hover:text-white">
                <span className="text-[#CCFF00]">&gt;</span>
                <span>About</span>
              </a>
            </li>
            <li>
              <a href="#faq" className="flex items-center gap-3 hover:text-white">
                <span className="text-[#CCFF00]">&gt;</span>
                <span>FAQs</span>
              </a>
            </li>
            <li>
              <a href="#timeline" className="flex items-center gap-3 hover:text-white">
                <span className="text-[#CCFF00]">&gt;</span>
                <span>Timeline</span>
              </a>
            </li>
          </ul>
        </div>

        {/* CENTER — 3D + STATUS */}
        <div className="flex flex-col items-center justify-center gap-6 px-4 md:px-8">
          <div className="w-52 h-52 rounded-lg flex items-center justify-center ring-1 ring-white/6 p-4 bg-black">
            <Hero3D />
          </div>

          <p className="font-mono tracking-widest text-base text-white/80">
            SYSTEM STATUS: <span className="text-[#CCFF00] ml-2">ONLINE</span>
          </p>
        </div>

        {/* RIGHT — CONNECT */}
        <div className="px-4 md:px-8">
          <h3 className="font-mono text-[#CCFF00] text-lg tracking-widest mb-4 text-left md:text-left">Connect</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-base text-white/70">
            {/* left column */}
            <div className="space-y-3">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white">
                <span className="text-[#CCFF00]">&gt;</span>
                <span>Instagram</span>
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white">
                <span className="text-[#CCFF00]">&gt;</span>
                <span>LinkedIn</span>
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white">
                <span className="text-[#CCFF00]">&gt;</span>
                <span>YouTube</span>
              </a>
              <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white">
                <span className="text-[#CCFF00]">&gt;</span>
                <span>X</span>
              </a>
            </div>

            {/* right column */}
            <div className="space-y-3">
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white">
                <span className="text-[#CCFF00]">&gt;</span>
                <span>GitHub</span>
              </a>
              <a href={SOCIAL_LINKS.medium} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white">
                <span className="text-[#CCFF00]">&gt;</span>
                <span>Medium</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="my-8 h-px bg-white/6" />

      {/* SCROLLING COMMAND STRIP (marquee) */}
      <div className="overflow-hidden">
        <div className="marquee text-sm font-mono text-white/40 py-3">
          <div className="inline-flex items-center space-x-8 opacity-75">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className={`mx-4 ${i % 5 === 0 ? 'text-purple-300' : i % 5 === 1 ? 'text-green-300' : i % 5 === 2 ? 'text-yellow-300' : i % 5 === 3 ? 'text-blue-300' : 'text-red-300'}`}>
                [COMPUTE] • [TRAIN] • [EVALUATE] • [DEPLOY] • [BUILD]
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CENTER LOGO */}
      <div className="mt-8 flex justify-center">
        <Image
          src="/hero/logo.png"
          alt="IEEE Computer Society"
          width={140}
          height={48}
          className="opacity-90"
        />
      </div>

      {/* local marquee styles (scoped) */}
      <style jsx>{`
        .marquee { display: block; white-space: nowrap; }
        .marquee > div { display: inline-block; padding-left: 100%; animation: marquee 40s linear infinite; }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}
