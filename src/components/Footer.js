"use client";

import React, { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

// Pluckable Guitar String Component
const FooterString = ({ soundUrl = "/audio/string-pluck.mp3" }) => {
  const pathRef = useRef(null);
  const hitRef = useRef(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  const startY = 5;
  const p0 = useRef({ x: 0, y: startY });
  const p1 = useRef({ x: 400, y: startY });
  const p2 = useRef({ x: 800, y: startY });
  const connected = useRef(false);
  const hasPlayed = useRef(false);

  const curveString = useCallback(() => {
    return `M${p0.current.x},${p0.current.y} Q${p1.current.x},${p1.current.y} ${p2.current.x},${p2.current.y}`;
  }, []);

  const playSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.volume = 0.15;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, [soundUrl]);

  const render = useCallback(() => {
    if (pathRef.current) {
      pathRef.current.setAttribute("d", curveString());
    }
    if (hitRef.current) {
      hitRef.current.setAttribute("d", curveString());
    }
  }, [curveString]);

  useGSAP(
    () => {
      const container = containerRef.current;
      const hit = hitRef.current;

      const handlePointerMove = (e) => {
        if (!container) return;
        const svg = container.ownerSVGElement;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const y = (e.clientY - rect.top) * (30 / rect.height);

        const overPath = e.target === hit;
        const distanceFromString = Math.abs(y - startY);

        if (!connected.current && overPath) {
          connected.current = true;
          hasPlayed.current = false;
          gsap.killTweensOf(p1.current);
        }

        if (connected.current) {
          p1.current.y = y * 3 - (p0.current.y + p2.current.y);
          render();

          if (distanceFromString > 200 && !hasPlayed.current) {
            const displacement = Math.abs(p1.current.y - startY);
            if (displacement > 10) {
              playSound();
              hasPlayed.current = true;
            }
            connected.current = false;
            gsap.to(p1.current, {
              duration: 1.8,
              y: startY,
              ease: "elastic.out(1.5, 0.15)",
              onUpdate: render,
            });
          }
        }
      };

      const handlePointerLeave = () => {
        if (connected.current && !hasPlayed.current) {
          const displacement = Math.abs(p1.current.y - startY);
          if (displacement > 10) {
            playSound();
            hasPlayed.current = true;
          }
        }

        connected.current = false;
        gsap.to(p1.current, {
          duration: 1.8,
          y: startY,
          ease: "elastic.out(1.5, 0.15)",
          onUpdate: render,
        });
      };

      container?.addEventListener("pointermove", handlePointerMove);
      container?.addEventListener("pointerleave", handlePointerLeave);

      render();

      return () => {
        gsap.killTweensOf(p1.current);
        container?.removeEventListener("pointermove", handlePointerMove);
        container?.removeEventListener("pointerleave", handlePointerLeave);
      };
    },
    { scope: containerRef }
  );

  return (
    <svg viewBox="0 0 800 10" className="w-full h-[10px] overflow-visible">
      <defs>
        <linearGradient
          id="footer-string-grad"
          x1="0"
          y1="0"
          x2="800"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="rgba(255, 255, 255, 0.08)" />
          <stop offset="0.5" stopColor="rgba(255, 255, 255, 0.4)" />
          <stop offset="1" stopColor="rgba(255, 255, 255, 0.08)" />
        </linearGradient>
      </defs>
      <g ref={containerRef}>
        <path
          ref={pathRef}
          d={`M0,${startY} Q400,${startY} 800,${startY}`}
          stroke="url(#footer-string-grad)"
          strokeWidth={1}
          strokeDasharray="6 6"
          fill="none"
          className="transition-colors"
        />
        <path
          ref={hitRef}
          d={`M0,${startY} Q400,${startY} 800,${startY}`}
          stroke="transparent"
          strokeWidth="20"
          fill="none"
        />
      </g>
    </svg>
  );
};

export default function Footer() {
  return (
    <div className="flex justify-center bg-[#0a0a0a] text-white pt-6 pb-8 relative overflow-hidden">
      <footer className="pb-2 pt-3 flex flex-col justify-between relative max-w-4xl w-full px-6 sm:px-12">
        {/* Interactive Pluck String at Top */}
        <div className="absolute top-0 left-0 right-0">
          <FooterString soundUrl="/audio/string-pluck.mp3" />
        </div>

        {/* Name & Role Row */}
        <div className="flex items-center justify-between gap-4 mt-4 pt-4 relative w-full flex-wrap sm:flex-nowrap">
          <div className="grid-line-h top-0" />
          <div className="grid-intersection top-0 -left-4 -translate-x-1/2 -translate-y-1/2 hidden sm:block" />
          <div className="grid-intersection top-0 -right-4 translate-x-1/2 -translate-y-1/2 hidden sm:block" />

          <div className="flex flex-col items-start">
            <h1 className="font-instrument-serif text-xl sm:text-2xl text-white/90 font-normal tracking-tight">
              Soumyabrata Mukherjee
            </h1>
            <h2 className="font-geist text-xs text-neutral-400 mt-0.5">
              ^.^ 0xcGURU, Top2%@THM | AIML | OSS • Building the <span className="italic text-white">^.^</span> ✧
            </h2>
          </div>

          {/* Compact Contact Us Button */}
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 bg-neutral-900/60 hover:bg-neutral-800 hover:border-white/30 text-xs font-geist font-medium text-neutral-300 hover:text-white transition-all duration-200 shadow-sm shrink-0"
          >
            <span>Contact us</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Copyright Row */}
        <div className="flex items-center justify-between gap-4 mt-6 pt-3 pb-3 w-full relative">
          <div className="font-geist text-[11px] text-neutral-500">
            Made with ♡
          </div>
          <div className="font-geist text-[11px] text-neutral-500">
            © {new Date().getFullYear()} Soumyabrata Mukherjee
          </div>

          <div className="grid-line-h bottom-0" />
          <div className="grid-intersection bottom-0 -left-4 -translate-x-1/2 translate-y-1/2 hidden sm:block" />
          <div className="grid-intersection bottom-0 -right-4 translate-x-1/2 translate-y-1/2 hidden sm:block" />
        </div>
      </footer>
    </div>
  );
}
