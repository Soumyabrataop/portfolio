import React from "react";

const posts = [
  {
    title: "Solving a Critical DSA Problem from Rippling",
    category: "Algorithm / DSA",
    date: "Latest Post",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7455869675588194304/",
    description: "Deep dive analysis into solving complex algorithmic constraints and optimization techniques.",
  },
  {
    title: "Analysing Anthropic CVP Report",
    category: "AI & Engineering",
    date: "Tech Insight",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7453669589072384000/",
    description: "Breakdown of Anthropic's latest Compute, Vision & Performance architectural research report.",
  },
  {
    title: "Running Social Experiment in OpenClaw",
    category: "Open Source / Experiment",
    date: "Case Study",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7424913067358138369/",
    description: "Results and key findings from running community interactions within OpenClaw environment.",
  },
];

export default function BlogsSection() {
  return (
    <section id="blogs" className="px-6 sm:px-12 md:px-24 py-20 bg-[#0a0a0a] text-white relative">
      <div className="mx-auto max-w-4xl w-full relative pt-6 pb-10">
        {/* Structural Dotted Line Above Header */}
        <div className="grid-line-h top-0" />
        <div className="grid-intersection top-0 -left-4 -translate-x-1/2 -translate-y-1/2 hidden sm:block" />
        <div className="grid-intersection top-0 -right-4 translate-x-1/2 -translate-y-1/2 hidden sm:block" />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 py-4">
          <div>
            <h2 className="font-instrument-serif text-3xl md:text-5xl font-normal tracking-tight text-white">
              Blogs & Writings
            </h2>
            <p className="font-geist mt-2 text-neutral-400 text-sm sm:text-base max-w-xl">
              Thoughts on algorithms, AI research reports, and technical experiments.
            </p>
          </div>
        </div>

        {/* Structural Dotted Line Below Header */}
        <div className="grid-line-h bottom-0" />
        <div className="grid-intersection bottom-0 -left-4 -translate-x-1/2 translate-y-1/2 hidden sm:block" />
        <div className="grid-intersection bottom-0 -right-4 translate-x-1/2 translate-y-1/2 hidden sm:block" />
      </div>

      {/* Blogs Cards Grid */}
      <div className="mx-auto max-w-4xl w-full mt-8 grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <a
            key={post.href}
            href={post.href}
            target="_blank"
            rel="noreferrer"
            className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-neutral-900/50 p-5 transition-all duration-300 hover:border-white/30 hover:bg-neutral-800/60 hover:-translate-y-1 shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-geist text-neutral-400 mb-3">
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-medium">
                  {post.category}
                </span>
                <span>{post.date}</span>
              </div>
              <h3 className="font-geist text-base sm:text-lg font-medium leading-snug text-white group-hover:text-[#1d9bf0] transition-colors duration-200">
                {post.title}
              </h3>
              <p className="font-geist mt-2.5 text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                {post.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-geist text-neutral-300 group-hover:text-white">
              <span>Read on LinkedIn</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
