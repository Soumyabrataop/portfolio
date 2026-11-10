"use client";

import React, { useState, useEffect, useRef } from "react";

const STYLES = [
  // Style 0: Cyber Gothic Slant (Bold, classic hacker font)
  [
    "    ██╗       ██╗    ",
    "  ████║     ████║    ",
    "  ╚═██║     ╚═██║    ",
    "    ██║       ██║    ",
    "    ██║       ██║    ",
    "    ██║       ██║    ",
    "  ██████╗   ██████╗  ",
    "  ╚═════╝   ╚═════╝  "
  ],
  // Style 1: Cyber Block / Dense Matrix
  [
    "    ▄█        ▄█     ",
    "   ███       ███     ",
    "  █▀██      █▀██     ",
    "    ██        ██     ",
    "    ██        ██     ",
    "    ██        ██     ",
    "  ▄████▄    ▄████▄   ",
    "  ▀▀▀▀▀▀    ▀▀▀▀▀▀   "
  ],
  // Style 2: Isometric Wireframe
  [
    "    .---.     .---.  ",
    "   / /| |    / /| |  ",
    "  / / | |   / / | |  ",
    " |_|  | |  |_|  | |  ",
    "      | |       | |  ",
    "      | |       | |  ",
    "    .-| |-.   .-| |-. ",
    "   |  | |  | |  | |  |",
    "    '-^-/-'   '-^-/-' "
  ]
];

const GLITCH_CHARS = ["0", "1", "X", "░", "▒", "▓", "/", "\\", "#", "+", "█", "$", "§", "!"];

export default function AsciiEleven() {
  const [styleIndex, setStyleIndex] = useState(0);
  const [displayLines, setDisplayLines] = useState(STYLES[0]);
  const [waveRow, setWaveRow] = useState(0);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [glitchActive, setGlitchActive] = useState(false);
  const [statusText, setStatusText] = useState("0x11 // READY");
  const containerRef = useRef(null);
  const frameRef = useRef(0);

  // Cycle animation
  useEffect(() => {
    const lines = STYLES[styleIndex];
    let intervalId = setInterval(() => {
      frameRef.current += 1;
      const f = frameRef.current;

      // Scanline wave moving down
      const totalRows = lines.length + 5;
      const currentWave = f % totalRows;
      setWaveRow(currentWave);

      // Subtle random character glitching
      if (Math.random() < 0.35) {
        const rowToGlitch = Math.floor(Math.random() * lines.length);
        const originalLine = lines[rowToGlitch];
        const chars = originalLine.split("");

        // Pick 1-2 random non-whitespace positions
        for (let i = 0; i < 2; i++) {
          const col = Math.floor(Math.random() * chars.length);
          if (chars[col] !== " ") {
            chars[col] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          }
        }

        const newLines = [...lines];
        newLines[rowToGlitch] = chars.join("");
        setDisplayLines(newLines);

        // Reset shortly
        setTimeout(() => {
          setDisplayLines(STYLES[styleIndex]);
        }, 120);
      }
    }, 110);

    return () => clearInterval(intervalId);
  }, [styleIndex]);

  const handleNextStyle = () => {
    setGlitchActive(true);
    setStatusText("MORPHING...");
    setTimeout(() => {
      setStyleIndex((prev) => (prev + 1) % STYLES.length);
      setGlitchActive(false);
      setStatusText(`0x11 // ST_${(styleIndex + 2) % STYLES.length + 1}`);
    }, 180);
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const estimatedRow = Math.floor((relY / rect.height) * displayLines.length);
    setHoveredRow(estimatedRow);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleNextStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative w-[260px] sm:w-[280px] md:w-[300px] select-none cursor-pointer rounded-2xl border border-white/10 bg-neutral-950/70 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:shadow-[0_0_35px_-8px_rgba(255,255,255,0.08)] ${
        glitchActive ? "scale-[0.99] border-white/40" : ""
      }`}
      title="Click to morph ASCII style"
    >
      {/* Corner crosshairs matching portfolio aesthetic */}
      <div className="pointer-events-none absolute top-2 left-2 text-[10px] font-mono text-white/20">+</div>
      <div className="pointer-events-none absolute top-2 right-2 text-[10px] font-mono text-white/20">+</div>
      <div className="pointer-events-none absolute bottom-2 left-2 text-[10px] font-mono text-white/20">+</div>
      <div className="pointer-events-none absolute bottom-2 right-2 text-[10px] font-mono text-white/20">+</div>

      {/* Subtle radial ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.035),transparent_70%)] rounded-2xl" />

      {/* Scanline texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] rounded-2xl"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)"
        }}
      />

      {/* Header Row */}
      <div className="relative z-10 flex items-center justify-between pb-3 mb-2 border-b border-white/5 text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />
          <span className="text-neutral-400 group-hover:text-neutral-200 transition-colors font-medium">
            {statusText}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] tracking-wider text-emerald-400/90 font-semibold">LIVE</span>
        </div>
      </div>

      {/* ASCII Art Canvas */}
      <div className="relative z-10 py-3 flex items-center justify-center min-h-[140px] sm:min-h-[160px] overflow-hidden">
        <pre className="font-mono text-[11px] sm:text-xs md:text-[13px] leading-[1.14] tracking-wider text-center select-none font-bold">
          {displayLines.map((line, idx) => {
            const isWave = idx === waveRow;
            const isHover = idx === hoveredRow;
            let lineClass = "transition-all duration-150 text-neutral-500";

            if (isHover) {
              lineClass = "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] scale-[1.02]";
            } else if (isWave) {
              lineClass = "text-neutral-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]";
            } else if (Math.abs(idx - waveRow) === 1) {
              lineClass = "text-neutral-400";
            }

            return (
              <div key={idx} className={`${lineClass} whitespace-pre`}>
                {line}
              </div>
            );
          })}
        </pre>
      </div>

      {/* Terminal Footer Bar with blinking cursor */}
      <div className="relative z-10 flex items-center justify-between pt-3 mt-1 border-t border-white/5 text-[10px] sm:text-[11px] font-mono text-neutral-400">
        <div className="flex items-center gap-1">
          <span className="text-neutral-400">&gt;</span>
          <span className="text-neutral-300">CORE.INIT(11)</span>
          <span className="inline-block w-1.5 h-3 bg-white/70 animate-pulse ml-0.5" />
        </div>
        <div className="text-[9px] uppercase tracking-wider text-neutral-400 group-hover:text-neutral-300 transition-colors">
          [MORPH]
        </div>
      </div>
    </div>
  );
}
