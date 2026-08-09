"use client";
import React, { useRef, useState } from "react";
import { gsap } from "gsap";

export default function AnimatedButton({ href, children, className = "" }) {
  const btnRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    gsap.to(btnRef.current, {
      scale: 1.05,
      backgroundColor: "#ffffff",
      color: "#000000",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    gsap.to(btnRef.current, {
      scale: 1,
      backgroundColor: "transparent",
      color: "#ffffff",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const Element = href ? "a" : "button";

  return (
    <Element
      ref={btnRef}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center px-8 py-4 border border-white/20 rounded-full font-medium tracking-wide uppercase text-sm transition-colors overflow-hidden ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </Element>
  );
}
