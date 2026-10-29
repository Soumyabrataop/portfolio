import React from "react";
import { SiTryhackme, SiNotion, SiGithub } from "react-icons/si";

const writeups = [
  {
    title: "Publisher Room",
    category: "TryHackMe",
    difficulty: "Medium Room",
    href: "https://app.notion.com/p/TryHackMe-Publisher-Room-2d4c8aaddc7380ff94bbf03a910ae404?source=copy_link",
    description: "Detailed walk-through covering initial recon, SPIP CMS exploitation, AppArmor restricted shell escape, and root privilege escalation.",
    actionText: "Read on Notion",
    icon: SiNotion,
  },
  {
    title: "Advent of Cyber 2025 - Side Quest 3",
    category: "TryHackMe / AoC",
    difficulty: "Hard Challenge",
    href: "https://app.notion.com/p/TryHackMe-Side-Quest-3-Solution-Advent-of-Cyber-2025-2d3c8aaddc738032ac42f4f2f9b29407?source=copy_link",
    description: "Step-by-step walkthrough and technical solution for the advanced Side Quest 3 challenge in TryHackMe's Advent of Cyber 2025.",
    actionText: "Read on Notion",
    icon: SiNotion,
  },
  {
    title: "Hacker Holidays 2026 Writeups",
    category: "CTF Repository",
    difficulty: "Event Series",
    href: "https://github.com/Soumyabrataop/thm-hh/tree/main",
    description: "Comprehensive repository of writeups, exploit scripts, and methodology notes for the TryHackMe Hacker Holidays event challenges.",
    actionText: "View on GitHub",
    icon: SiGithub,
  },
];

export default function CtfSection() {
  return (
    <section id="ctf" className="px-6 sm:px-12 md:px-24 pt-6 pb-24 bg-[#0a0a0a] text-white relative">
      <div className="mx-auto max-w-4xl w-full relative pt-6 pb-10">
        {/* Structural Dotted Line Above Header */}
        <div className="grid-line-h top-0" />
        <div className="grid-intersection top-0 -left-4 -translate-x-1/2 -translate-y-1/2 hidden sm:block" />
        <div className="grid-intersection top-0 -right-4 translate-x-1/2 -translate-y-1/2 hidden sm:block" />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 py-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-geist font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                <SiTryhackme className="w-3.5 h-3.5" />
                Red Teaming & Security
              </span>
            </div>
            <h2 className="font-instrument-serif text-3xl md:text-5xl font-normal tracking-tight text-white">
              CTF Writeups & Security Research
            </h2>
            <p className="font-geist mt-2 text-neutral-400 text-sm sm:text-base max-w-xl">
              Documented solutions, offensive security methodologies, and TryHackMe room walkthroughs.
            </p>
          </div>
        </div>

        {/* Structural Dotted Line Below Header */}
        <div className="grid-line-h bottom-0" />
        <div className="grid-intersection bottom-0 -left-4 -translate-x-1/2 translate-y-1/2 hidden sm:block" />
        <div className="grid-intersection bottom-0 -right-4 translate-x-1/2 translate-y-1/2 hidden sm:block" />
      </div>

      {/* CTF Cards Grid */}
      <div className="mx-auto max-w-4xl w-full mt-8 grid gap-4 md:grid-cols-3">
        {writeups.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-neutral-900/50 p-5 transition-all duration-300 hover:border-red-500/30 hover:bg-neutral-800/60 hover:-translate-y-1 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs font-geist text-neutral-400 mb-3">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white font-medium">
                    {item.category}
                  </span>
                  <span className="text-neutral-400">{item.difficulty}</span>
                </div>
                <h3 className="font-geist text-base sm:text-lg font-medium leading-snug text-white group-hover:text-red-400 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="font-geist mt-2.5 text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-geist text-neutral-300 group-hover:text-white">
                <span className="inline-flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                  {item.actionText}
                </span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
