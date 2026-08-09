"use client";

import React, { useState, useEffect, useRef } from "react";

export default function GithubActivity({ username = "Soumyabrataop" }) {
  const [contributions, setContributions] = useState([]);
  const [totalCount, setTotalCount] = useState(205);
  const [loading, setLoading] = useState(true);
  const [hoverData, setHoverData] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        if (!res.ok) throw new Error("API request failed");
        const data = await res.json();
        
        if (data && data.contributions) {
          setContributions(data.contributions);
          if (data.total && data.total.lastYear) {
            setTotalCount(data.total.lastYear);
          } else {
            const sum = data.contributions.reduce((acc, curr) => acc + curr.count, 0);
            setTotalCount(sum);
          }
        }
      } catch (err) {
        console.warn("Failed to load GitHub activity:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
  }, [username]);

  useEffect(() => {
    if (!loading && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [loading]);

  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return "#0e4429";
      case 2:
        return "#006d32";
      case 3:
        return "#26a641";
      case 4:
        return "#39d353";
      default:
        return "rgba(255, 255, 255, 0.07)";
    }
  };

  const weeks = React.useMemo(() => {
    if (!contributions.length) return [];
    const cols = [];
    let currentWeek = [];
    
    contributions.forEach((day, idx) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || idx === contributions.length - 1) {
        cols.push(currentWeek);
        currentWeek = [];
      }
    });
    return cols;
  }, [contributions]);

  return (
    <div className="w-full relative mt-12 mb-8">
      {/* Structural Dotted Line Above Header */}
      <div className="grid-line-h top-0" />
      <div className="grid-intersection top-0 -left-4 -translate-x-1/2 -translate-y-1/2 hidden sm:block" />
      <div className="grid-intersection top-0 -right-4 translate-x-1/2 -translate-y-1/2 hidden sm:block" />

      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal">
            GitHub Activity (@{username})
          </h2>
          <p className="font-geist text-xs sm:text-sm text-neutral-400 mt-1">
            Contributions across open source repositories in the last year
          </p>
        </div>
        {!loading && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-neutral-300 bg-neutral-900 border border-white/10 px-3 py-1.5 rounded-lg shadow-sm">
            <span className="font-bold text-[#1d9bf0]">{totalCount.toLocaleString()}</span>
            <span>contributions in last year</span>
          </div>
        )}
      </div>

      {/* Structural Dotted Line Below Header */}
      <div className="grid-line-h bottom-0" />
      <div className="grid-intersection bottom-0 -left-4 -translate-x-1/2 translate-y-1/2 hidden sm:block" />
      <div className="grid-intersection bottom-0 -right-4 translate-x-1/2 translate-y-1/2 hidden sm:block" />

      {/* Calendar Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="mt-6 w-full overflow-x-auto py-5 px-4 rounded-xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm scroll-smooth"
      >
        {loading ? (
          <div className="flex items-center justify-center h-28 text-xs text-neutral-400 font-geist animate-pulse">
            Loading GitHub contribution graph for @{username}...
          </div>
        ) : (
          <div className="flex flex-col gap-2 min-w-max">
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => (
                    <div
                      key={`${wIdx}-${dIdx}`}
                      onMouseEnter={() => setHoverData(day)}
                      onMouseLeave={() => setHoverData(null)}
                      className="w-3 h-3 rounded-[2.5px] transition-transform duration-150 hover:scale-125 hover:z-20 cursor-pointer"
                      style={{ backgroundColor: getLevelColor(day.level) }}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 text-xs font-geist text-neutral-400 border-t border-white/10 mt-1">
              <div className="h-4">
                {hoverData ? (
                  <span className="text-white font-mono">
                    <strong>{hoverData.count}</strong> contribution{hoverData.count !== 1 ? "s" : ""} on {hoverData.date}
                  </span>
                ) : (
                  <span>Hover over squares for details</span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px]">Less</span>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[rgba(255,255,255,0.07)]" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#0e4429]" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#006d32]" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#26a641]" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#39d353]" />
                <span className="text-[11px]">More</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
