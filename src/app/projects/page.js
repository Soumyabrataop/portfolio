"use client";

import React, { useState, useMemo } from "react";
import { projects } from "@/components/projectData";

const FILTERS = [
  { id: "All", label: "All Projects" },
  { id: "Active", label: "Active" },
  { id: "Under Development", label: "Under Development" },
  { id: "Deprecated", label: "Deprecated" },
  { id: "Starred", label: "⭐ Starred" },
];

export default function Projects() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    if (selectedFilter === "All") return projects;
    if (selectedFilter === "Starred") {
      return projects.filter((p) => p.status.includes("⭐"));
    }
    return projects.filter((p) => p.status === selectedFilter);
  }, [selectedFilter]);

  const countForFilter = (id) => {
    if (id === "All") return projects.length;
    if (id === "Starred") return projects.filter((p) => p.status.includes("⭐")).length;
    return projects.filter((p) => p.status === id).length;
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-24 px-6 sm:px-12 md:px-24">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Title Section with Grid Lines */}
        <div className="relative pt-6 pb-8">
          <div className="grid-line-h top-0" />
          <div className="grid-intersection top-0 -left-4 -translate-x-1/2 -translate-y-1/2 hidden sm:block" />
          <div className="grid-intersection top-0 -right-4 translate-x-1/2 -translate-y-1/2 hidden sm:block" />

          <h1 className="font-instrument-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white">
            Projects & Systems
          </h1>
          <p className="font-geist text-sm sm:text-base text-neutral-400 mt-2">
            Selected work across AI IDEs, LLM pipelines, security tools, and open-source APIs.
          </p>

          <div className="grid-line-h bottom-0" />
          <div className="grid-intersection bottom-0 -left-4 -translate-x-1/2 translate-y-1/2 hidden sm:block" />
          <div className="grid-intersection bottom-0 -right-4 translate-x-1/2 translate-y-1/2 hidden sm:block" />
        </div>

        {/* Filter Breadcrumb Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-2 font-geist">
          <span className="text-xs text-neutral-400 mr-2 uppercase tracking-wider font-semibold">Filter:</span>
          {FILTERS.map((filter) => {
            const isSelected = selectedFilter === filter.id;
            const count = countForFilter(filter.id);
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                  isSelected
                    ? "bg-white text-black border-white shadow-md scale-[1.02]"
                    : "bg-neutral-900/80 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? "bg-black/10 text-black font-bold" : "bg-white/10 text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((project) => (
            <a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col justify-between p-6 rounded-xl border border-white/10 bg-neutral-900/40 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-neutral-800/50 hover:-translate-y-1 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h2 className="font-instrument-serif text-2xl sm:text-3xl font-normal text-white group-hover:text-[#1d9bf0] transition-colors duration-200">
                    {project.title}
                  </h2>
                  <span className={`font-geist text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                    project.status.includes("⭐") 
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                      : project.status === "Active"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : project.status === "Under Development"
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      : "bg-neutral-800 border-white/10 text-neutral-400"
                  }`}>
                    {project.status}
                  </span>
                </div>

                <p className="font-geist text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">
                  {project.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-geist text-[11px] text-neutral-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between font-geist text-xs text-neutral-400 group-hover:text-white transition-colors duration-200">
                <span>View Repository / Project</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="mt-12 text-center py-16 rounded-xl border border-white/10 bg-neutral-900/30 text-neutral-400 font-geist text-sm">
            No projects found for the selected category.
          </div>
        )}
      </div>
    </main>
  );
}
