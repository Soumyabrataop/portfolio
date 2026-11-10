"use client";

import React, { useState, useEffect, useRef } from "react";

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
  const [time, setTime] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -10, y: -10 });
  const [glitchCoords, setGlitchCoords] = useState(null);
  const containerRef = useRef(null);

  // Smooth continuous animation wave
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const loop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setTime((prev) => prev + dt);

      // Random micro-glitch (rare, subtle organic texture)
      if (Math.random() < 0.04) {
        const randY = Math.floor(Math.random() * ASCII_11.length);
        const row = ASCII_11[randY];
        const nonSpaceX = [];
        for (let i = 0; i < row.length; i++) {
          if (row[i] !== " ") nonSpaceX.push(i);
        }
        if (nonSpaceX.length > 0) {
          const randX = nonSpaceX[Math.floor(Math.random() * nonSpaceX.length)];
          const glyph = GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)];
          setGlitchCoords({ x: randX, y: randY, glyph });
          setTimeout(() => setGlitchCoords(null), 90);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    // Map to grid coordinates
    const gridX = Math.floor(relX * 24);
    const gridY = Math.floor(relY * ASCII_11.length);
    setMousePos({ x: gridX, y: gridY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -10, y: -10 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative select-none rounded-2xl border border-white/[0.07] bg-neutral-950/40 p-6 sm:p-7 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_50px_-15px_rgba(255,255,255,0.08)]"
    >
      {/* Soft ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.035),transparent_70%)]" />

      {/* Modern architectural corner accents */}
      <div className="pointer-events-none absolute top-3 left-3 text-[9px] font-mono tracking-widest text-neutral-600 transition-colors group-hover:text-neutral-400">
        // 11
      </div>
      <div className="pointer-events-none absolute top-3 right-3 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white/30 transition-colors group-hover:bg-white/70" />
      </div>

      {/* ASCII Canvas */}
      <div className="relative z-10 pt-4 pb-1 flex items-center justify-center">
        <pre className="font-mono text-[12px] sm:text-[13px] md:text-[14px] leading-[1.14] tracking-wider select-none font-bold">
          {ASCII_11.map((row, y) => {
            return (
              <div key={y} className="flex justify-center whitespace-pre">
                {row.split("").map((ch, x) => {
                  const isSpace = ch === " ";
                  const isGlitch = glitchCoords && glitchCoords.x === x && glitchCoords.y === y;
                  const displayChar = isGlitch ? glitchCoords.glyph : ch;

                  if (isSpace) {
                    return (
                      <span key={x} className="inline-block opacity-0">
                        &nbsp;
                      </span>
                    );
                  }

                  // Diagonal wavefront calculation
                  const wave = Math.sin((x * 0.22 + y * 0.38) - time * 2.2);
                  // Distance to mouse pointer
                  const mouseDist = Math.hypot(x - mousePos.x, y - mousePos.y);
                  const isNearMouse = mouseDist < 3.5;

                  let charClass = "text-neutral-500 transition-colors duration-100";

                  if (isNearMouse) {
                    charClass = "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.85)] scale-110";
                  } else if (wave > 0.65) {
                    charClass = "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]";
                  } else if (wave > 0.2) {
                    charClass = "text-neutral-300";
                  } else if (wave > -0.3) {
                    charClass = "text-neutral-400";
                  }

                  return (
                    <span
                      key={x}
                      className={`inline-block transition-transform duration-75 ${charClass}`}
                    >
                      {displayChar}
                    </span>
                  );
                })}
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
    </div>
  );
}
