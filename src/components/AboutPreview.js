"use client";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Copy from "./Copy";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPreview() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // We rely on the Copy component for text animations,
    // but we can animate the container itself if needed.
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="about" className="py-48 px-8 md:px-24 bg-[#0a0a0a] text-white flex items-center justify-center min-h-[80vh]">
      <div className="max-w-4xl mx-auto text-center">
        <Copy 
          tag="p" 
          className="font-geist text-2xl md:text-5xl font-light leading-[1.4] text-gray-300"
          stagger={0.02}
        >
          I am an <span className="selected-text">Open Source Contributor, Red Teamer</span>, and Student building in public. My focus lies in turning ideas into working prototypes using <span className="selected-text">AI, automation, and modern software engineering</span>. By experimenting with LLM workflows, Retrieval-Augmented Generation, and specialized developer tools, I aim to bridge complex concepts with practical execution.
        </Copy>
      </div>
    </section>
  );
}
