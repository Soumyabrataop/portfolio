"use client";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "./projectData";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsPreview() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Animate the header
    gsap.fromTo(".projects-header", 
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".projects-header",
          start: "top 85%",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }
    );

    gsap.fromTo(".project-card",
      { y: 120, opacity: 0, scale: 0.9 },
      {
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 80%",
        },
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.2,
        duration: 1.2,
        ease: "back.out(1.2)"
      }
    );
  }, { scope: containerRef });

  return (
    <section id="projects" ref={containerRef} className="py-32 px-8 md:px-24 bg-[#0a0a0a] text-white overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="projects-header text-4xl md:text-6xl font-bold tracking-tighter uppercase border-b border-gray-800 pb-8 mb-16 flex items-center gap-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          Selected Works
        </h2>
        
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <a
              key={idx}
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="project-card group relative overflow-hidden bg-[#111] border border-white/10 p-12 hover:border-white/40 transition-all duration-500 rounded-lg shadow-2xl flex flex-col justify-between h-full"
            >
              <div className="absolute inset-0 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.6),transparent_45%)]" />

              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-500 ease-out z-20">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white transform group-hover:-translate-y-2 transition-transform duration-500 delay-100">
                   <line x1="7" y1="17" x2="17" y2="7"></line>
                   <polyline points="7 7 17 7 17 17"></polyline>
                 </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight group-hover:text-white text-gray-200 transition-colors z-10 relative">
                {project.title}
              </h3>
              <p className="text-lg text-gray-400 font-light mb-8 max-w-sm z-10 relative">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-300 mb-6 z-10 relative">
                <span className="bg-white/8 px-3 py-1 rounded-full border border-white/10">{project.status}</span>
                {project.techStack?.slice(0, 3).map((tech) => (
                  <span key={tech} className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mt-auto z-10 relative">
                {project.tags.map(tag => (
                  <span key={tag} className="bg-white/5 px-3 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
