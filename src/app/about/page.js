"use client";

import React from "react";
import GithubActivity from "@/components/GithubActivity";

export default function About() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-20 px-6 sm:px-12 md:px-24">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Title with Structural Grid Line */}
        <div className="relative pt-6 pb-8">
          <div className="grid-line-h top-0" />
          <div className="grid-intersection top-0 -left-4 -translate-x-1/2 -translate-y-1/2 hidden sm:block" />
          <div className="grid-intersection top-0 -right-4 translate-x-1/2 -translate-y-1/2 hidden sm:block" />

          <h1 className="font-instrument-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white">
            About Me
          </h1>
          <p className="font-geist text-sm sm:text-base text-neutral-400 mt-2">
            Background, education, and building in public.
          </p>

          <div className="grid-line-h bottom-0" />
          <div className="grid-intersection bottom-0 -left-4 -translate-x-1/2 translate-y-1/2 hidden sm:block" />
          <div className="grid-intersection bottom-0 -right-4 translate-x-1/2 translate-y-1/2 hidden sm:block" />
        </div>

        {/* Bio Content Box */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-md space-y-6 text-neutral-300 font-geist text-base sm:text-xl leading-relaxed">
          <p>
            I am <strong className="text-white font-medium">Soumyabrata Mukherjee</strong>, an{" "}
            <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/10 text-sm sm:text-lg font-medium inline-block">
              Open Source Contributor, Red Teamer, and Student. </span>
          </p>

          <p className="text-neutral-300">
            Currently pursuing my Bachelor of Technology in Computer Science and Engineering at the{" "}
            <span className="text-white font-medium underline decoration-white/30 underline-offset-4">
              RCC Institute of Information Technology, Kolkata
            </span>{" "}
            (2024 - 2028).
          </p>

          <p className="text-neutral-300">
            I specialize in building in public through platforms like Telegram and Discord, focusing on turning ideas into working prototypes using{" "}
            <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/10 text-sm sm:text-lg font-medium inline-block">
              AI, automation, and modern software engineering
            </span>{" "}
            practices.
          </p>
        </div>

        {/* GitHub Activity Heatmap Section */}
        <GithubActivity username="Soumyabrataop" />
      </div>
    </main>
  );
}
