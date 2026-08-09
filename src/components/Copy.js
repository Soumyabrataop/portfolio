"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function Copy({ text, children, tag: Tag = "p", className = "", stagger = 0.05 }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    // Use split-type to split text
    const split = new SplitType(textRef.current, { types: "lines,words,chars" });
    
    // Initial state
    gsap.set(split.chars, { yPercent: 100, opacity: 0 });

    // Scroll animation
    ScrollTrigger.create({
      trigger: textRef.current,
      start: "top 85%",
      onEnter: () => {
        gsap.to(split.chars, {
          yPercent: 0,
          opacity: 1,
          stagger: stagger,
          duration: 1.2,
          ease: "power4.out",
        });
      },
      once: true
    });

    return () => {
      split.revert();
    };
  }, [text, children, stagger]);

  return (
    <Tag ref={textRef} className={`overflow-hidden ${className}`}>
      {children ?? text}
    </Tag>
  );
}
