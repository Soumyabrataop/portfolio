"use client";

import React from "react";
import Link from "next/link";
import {
  SiReact,
  SiExpress,
  SiNextdotjs,
  SiPostgresql,
  SiMongodb
} from "react-icons/si";

const TechItem = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-1 font-medium text-white px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-xs sm:text-sm">
    <Icon className="w-3.5 h-3.5 inline-block text-neutral-300" />
    <span>{children}</span>
  </span>
);

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center px-6 sm:px-12 md:px-24 py-16 overflow-hidden">
      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto w-full pt-8 pb-12">
        {/* Structural Line Above */}
        <div className="grid-line-h top-0" />
        <div className="grid-intersection top-0 -left-4 -translate-x-1/2 -translate-y-1/2 hidden sm:block" />
        <div className="grid-intersection top-0 -right-4 translate-x-1/2 -translate-y-1/2 hidden sm:block" />

        {/* Profile Header Row */}
        <div className="flex items-center gap-4 sm:gap-6 mt-4 mb-6">
          <div className="relative p-1 rounded-2xl border border-white/15 bg-neutral-900/80 backdrop-blur-md shadow-2xl shrink-0">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-neutral-800 border border-white/10 flex items-center justify-center">
              <img
                src="/facing.png"
                alt="Soumyabrata Mukherjee"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl sm:text-5xl font-instrument-serif font-normal text-white tracking-tight">
                Soumyabrata Mukherjee
              </h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#1d9bf0] shrink-0"
                aria-label="Verified"
              >
                <path
                  fill="currentColor"
                  d="M24 12a4.454 4.454 0 0 0-2.564-3.91 4.437 4.437 0 0 0-.948-4.578 4.436 4.436 0 0 0-4.577-.948A4.44 4.44 0 0 0 12 0a4.423 4.423 0 0 0-3.9 2.564 4.434 4.434 0 0 0-2.43-.178 4.425 4.425 0 0 0-2.158 1.126 4.42 4.42 0 0 0-1.12 2.156 4.42 4.42 0 0 0 .183 2.421A4.456 4.456 0 0 0 0 12a4.465 4.465 0 0 0 2.576 3.91 4.433 4.433 0 0 0 .936 4.577 4.459 4.459 0 0 0 4.577.95A4.454 4.454 0 0 0 12 24a4.439 4.439 0 0 0 3.91-2.563 4.26 4.26 0 0 0 5.526-5.526A4.453 4.453 0 0 0 24 12Zm-13.709 4.917-4.38-4.378 1.652-1.663 2.646 2.646L15.83 7.4l1.72 1.591-7.258 7.926Z"
                />
              </svg>
            </div>
            <p className="text-sm sm:text-base text-neutral-400 font-geist mt-1">
              ^.^ 0xcGURU, Top2%@THM | AIML | OSS
            </p>
          </div>
        </div>

        {/* Bio Text from GitHub Profile */}
        <div className="mt-6 text-neutral-300 font-geist text-sm sm:text-lg leading-relaxed max-w-3xl">
          🙌 Building in public through Telegram and Discord • Student, Open Source Contributor & Red Teamer.
        </div>

        {/* CTA Buttons Row */}
        <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <a
            href="#blogs"
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-geist font-medium text-xs sm:text-sm tracking-wider uppercase border border-white hover:bg-transparent hover:text-white transition-all duration-300 shadow-lg hover:shadow-white/10"
          >
            View Blogs
          </a>
          <a
            href="/contact"
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900/80 text-white font-geist font-medium text-xs sm:text-sm tracking-wider uppercase border border-white/20 hover:border-white/50 hover:bg-neutral-800 transition-all duration-300 backdrop-blur-sm"
          >
            Contact Me
            <span className="inline-block animate-[spin_4s_linear_infinite] group-hover:animate-[spin_0.8s_linear_infinite]">
              ✿
            </span>
          </a>
        </div>

        {/* Structural Line Below */}
        <div className="grid-line-h bottom-0" />
        <div className="grid-intersection bottom-0 -left-4 -translate-x-1/2 translate-y-1/2 hidden sm:block" />
        <div className="grid-intersection bottom-0 -right-4 translate-x-1/2 -translate-y-1/2 hidden sm:block" />
      </div>
    </div>
  );
}
