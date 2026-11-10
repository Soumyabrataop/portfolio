"use client";

import React, { useState, useEffect } from "react";

// Modern architectural 11 ASCII art
const ASCII_11 = [
  "      ▄█          ▄█    ",
  "    ▄███        ▄███    ",
  "  ▄██▀██      ▄██▀██    ",
  " ▀▀▀  ██     ▀▀▀  ██    ",
  "      ██          ██    ",
  "      ██          ██    ",
  "      ██          ██    ",
  "      ██          ██    ",
  "      ██          ██    ",
  "    ██████      ██████  ",
];

const GLITCH_GLYPHS = ["1", "0", "/", "\\", "░", "▒", "▓", "█", "▄", "▀"];

export default function AsciiEleven() {
  const [glitchState, setGlitchState] = useState(null);

  // Gentle, low-frequency organic micro-glitch (runs every 3.5s, 0% CPU overhead)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.6) {
        const randY = Math.floor(Math.random() * ASCII_11.length);
        const row = ASCII_11[randY];
        const nonSpaceX = [];
        for (let i = 0; i < row.length; i++) {
          if (row[i] !== " ") nonSpaceX.push(i);
        }
        if (nonSpaceX.length > 0) {
          const randX = nonSpaceX[Math.floor(Math.random() * nonSpaceX.length)];
          const glyph = GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)];
          setGlitchState({ x: randX, y: randY, glyph });
          setTimeout(() => setGlitchState(null), 120);
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="group relative select-none rounded-2xl border border-white/[0.07] bg-neutral-950/40 p-5 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_-15px_rgba(255,255,255,0.08)]">
      {/* Soft ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.03),transparent_70%)]" />

      {/* Modern architectural corner accents */}
      <div className="pointer-events-none absolute top-3 left-3 text-[9px] font-mono tracking-widest text-neutral-600 transition-colors group-hover:text-neutral-400">
        // 11
      </div>
      <div className="pointer-events-none absolute top-3 right-3 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white/30 transition-colors group-hover:bg-white/70" />
      </div>

      {/* ASCII Canvas with GPU-accelerated CSS diagonal light wave (ZERO React re-renders) */}
      <div className="relative z-10 pt-4 pb-1 flex items-center justify-center">
        <pre className="ascii-11-wave font-mono text-[11px] sm:text-[13px] md:text-[14px] leading-[1.14] tracking-wider select-none font-bold">
          {ASCII_11.map((row, y) => {
            if (glitchState && glitchState.y === y) {
              const chars = row.split("");
              chars[glitchState.x] = glitchState.glyph;
              return (
                <div key={y} className="whitespace-pre">
                  {chars.join("")}
                </div>
              );
            }
            return (
              <div key={y} className="whitespace-pre">
                {row}
              </div>
            );
          })}
        </pre>
      </div>

      {/* Minimal technical footer */}
      <div className="relative z-10 mt-3 flex items-center justify-between border-t border-white/[0.04] pt-2.5 text-[10px] font-mono text-neutral-600 transition-colors group-hover:text-neutral-400">
        <span className="tracking-widest">MONOLITH.11</span>
        <span className="tracking-wider">0x0B</span>
      </div>

      <style jsx>{`
        .ascii-11-wave {
          background: linear-gradient(
            135deg,
            #6b7280 0%,
            #9ca3af 25%,
            #ffffff 50%,
            #9ca3af 75%,
            #6b7280 100%
          );
          background-size: 250% 250%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: waveSweep 3.5s ease-in-out infinite;
          will-change: background-position;
        }
        @keyframes waveSweep {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
      `}</style>
    </div>
  );
}
