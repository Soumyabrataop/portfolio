"use client";

import React from "react";
import Link from "next/link";

const socialLinks = [
  {
    name: "GitHub (Current)",
    handle: "@Soumyabrataop",
    description: "Primary development workspace, AI tools, and active contributions.",
    href: "https://github.com/Soumyabrataop",
    tag: "Active",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "GitHub (Past Archive)",
    handle: "@Soumyabrata-eng",
    description: "Previous projects, early engineering archives, and legacy codebases.",
    href: "https://github.com/Soumyabrata-eng",
    tag: "Archive",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-neutral-400">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    handle: "Soumyabrata Mukherjee",
    description: "Professional networking, posts on DSA, AI research, and updates.",
    href: "https://linkedin.com/in/soumyabrata-mukherjee-088b793a8",
    tag: "Connect",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#1d9bf0]">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
      </svg>
    ),
  },
  {
    name: "X / Twitter",
    handle: "@xapparely",
    description: "Building in public, quick thoughts on AI, Red Teaming, and tech.",
    href: "https://x.com/xapparely",
    tag: "Social",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-24 px-6 sm:px-12 md:px-24">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Title Section with Grid Lines */}
        <div className="relative pt-6 pb-8">
          <div className="grid-line-h top-0" />
          <div className="grid-intersection top-0 -left-4 -translate-x-1/2 -translate-y-1/2 hidden sm:block" />
          <div className="grid-intersection top-0 -right-4 translate-x-1/2 -translate-y-1/2 hidden sm:block" />

          <h1 className="font-instrument-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white">
            Connect & Contact
          </h1>
          <p className="font-geist text-sm sm:text-base text-neutral-400 mt-2">
            Reach out for collaborations, open-source work, or schedule a quick meeting.
          </p>

          <div className="grid-line-h bottom-0" />
          <div className="grid-intersection bottom-0 -left-4 -translate-x-1/2 translate-y-1/2 hidden sm:block" />
          <div className="grid-intersection bottom-0 -right-4 translate-x-1/2 translate-y-1/2 hidden sm:block" />
        </div>

        {/* Social Links Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {socialLinks.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col justify-between p-6 rounded-xl border border-white/10 bg-neutral-900/40 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-neutral-800/50 hover:-translate-y-1 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
                      {social.icon}
                    </div>
                    <div>
                      <h2 className="font-instrument-serif text-2xl font-normal text-white group-hover:text-[#1d9bf0] transition-colors duration-200">
                        {social.name}
                      </h2>
                      <p className="font-mono text-xs text-neutral-400 mt-0.5">{social.handle}</p>
                    </div>
                  </div>
                  <span className="font-geist text-[11px] font-medium px-2.5 py-0.5 rounded-full border bg-neutral-800 border-white/10 text-neutral-300 shrink-0">
                    {social.tag}
                  </span>
                </div>

                <p className="font-geist text-xs sm:text-sm text-neutral-300 leading-relaxed mt-2 mb-4">
                  {social.description}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between font-geist text-xs text-neutral-400 group-hover:text-white transition-colors duration-200">
                <span>Visit Link</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
