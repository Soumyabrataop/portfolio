"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const BUILDERS = [
  { letter: "M", color: "#f87171", bg: "#fca5a5", textColor: "#7f1d1d" },
  { letter: "N", color: "#818cf8", bg: "#c7d2fe", textColor: "#312e81" },
  { letter: "L", color: "#4ade80", bg: "#bbf7d0", textColor: "#14532d" },
  { letter: "A", color: "#38bdf8", bg: "#bae6fd", textColor: "#0c4a6e" },
  { letter: "E", color: "#fbbf24", bg: "#fef08a", textColor: "#713f12" },
  { letter: "Y", color: "#f472b6", bg: "#fbcfe8", textColor: "#831843" },
  { letter: "+", color: "#a3e635", bg: "#365314", textColor: "#d9f99d" },
];

export default function BannaEffect() {
  const pathname = usePathname();
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    const startBanna = () => {
      const existingHost = document.getElementById("sb-host");
      if (existingHost) existingHost.remove();

      const phone = window.innerWidth < 700;
      const activeBuilders = phone ? BUILDERS.slice(0, 4) : BUILDERS;

      const options = {
        speed: 1.65,
        agents: activeBuilders.length,
        maxWait: 8,
        maxLayers: 350,
        colors: activeBuilders.map((b) => b.color),
        exclude: "nav, .loader, #sb-host, [data-banna-skip]",
      };

      const IGNORE = new Set([
        "SCRIPT",
        "STYLE",
        "NOSCRIPT",
        "TEMPLATE",
        "LINK",
        "META",
        "TITLE",
        "BR",
        "WBR",
        "OPTION",
        "DIALOG",
        "HEAD",
      ]);
      const MEDIA = new Set([
        "IMG",
        "VIDEO",
        "CANVAS",
        "PICTURE",
        "IFRAME",
        "SVG",
        "OBJECT",
        "EMBED",
      ]);
      const CONTROL = new Set(["BUTTON", "SELECT", "INPUT", "TEXTAREA", "SUMMARY"]);

      const hasOwnText = (el) => {
        for (const node of el.childNodes) {
          if (node.nodeType === 3 && node.nodeValue.trim()) return true;
        }
        return false;
      };

      const looksLikeBox = (cs) => {
        const color = cs.backgroundColor;
        const filled =
          color !== "transparent" &&
          !/^rgba?\(.*,\s*0\)$/.test(color) &&
          !/\/\s*0\)$/.test(color);
        return (
          filled ||
          cs.backgroundImage !== "none" ||
          cs.boxShadow !== "none" ||
          parseFloat(cs.borderTopWidth) > 0 ||
          parseFloat(cs.borderBottomWidth) > 0
        );
      };

      const classify = (el, cs, rect) => {
        const name = el.tagName.toUpperCase();
        if (!rect.width || !rect.height) return null;
        if (
          cs.position === "fixed" &&
          rect.width >= window.innerWidth * 0.9 &&
          rect.height >= window.innerHeight * 0.9
        ) {
          return null;
        }

        // Media elements (Images, Avatars, etc.) -> draw box
        if (MEDIA.has(name)) {
          return rect.width > 16 && rect.height > 16 ? "box" : "fade";
        }

        const isBox = looksLikeBox(cs);

        // Interactive control buttons
        if (CONTROL.has(name)) {
          return isBox && rect.width >= 50 && rect.height >= 26 ? "box" : "fade";
        }

        // Links (<a href="...">) - cards and CTA buttons should draw box!
        if (name === "A") {
          if (isBox && rect.width >= 70 && rect.height >= 28) {
            return "box";
          }
          return hasOwnText(el) ? "text" : "fade";
        }

        // Elements with direct text (Headings, Paragraphs, Bio)
        if (hasOwnText(el)) {
          if (isBox && rect.width < 140 && rect.height < 40) {
            return "fade";
          }
          if (isBox && rect.width >= 240 && rect.height >= 70) {
            return "box";
          }
          return "text";
        }

        // General box containers (Cards, frames, wrappers)
        if (rect.width >= 32 && rect.height >= 32 && isBox) {
          if (rect.height > window.innerHeight * 1.5 || cs.position === "fixed") return null;
          if (rect.width >= window.innerWidth - 1 && rect.height >= window.innerHeight - 1) return null;
          return "box";
        }

        return null;
      };

      const WHOLE = new Set(["text", "fade"]);

      const collect = () => {
        const tasks = [];
        const byEl = new Map();

        const visit = (el, parent) => {
          if (tasks.length >= options.maxLayers) return;
          if (IGNORE.has(el.tagName.toUpperCase()) || el.id === "sb-host") return;
          if (el.hasAttribute("data-banna-skip") || el.closest("[data-banna-skip]")) return;
          if (el.closest("nav") || el.closest(".loader")) return;
          if (el.hidden) return;

          const cs = window.getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden" || el.type === "hidden") return;

          const rect = el.getBoundingClientRect();
          if (rect.width <= 2 && rect.height <= 2 && cs.overflow !== "visible") return;
          if (rect.bottom + window.scrollY <= 0 || rect.right + window.scrollX <= 0) return;

          const kind = classify(el, cs, rect);
          let next = parent;
          if (kind) {
            const task = {
              el,
              kind,
              parent,
              state: "hidden",
              queuedAt: 0,
              agent: null,
              cleanup: [],
            };
            tasks.push(task);
            byEl.set(el, task);
            next = task;
            const isMedia = MEDIA.has(el.tagName.toUpperCase());
            if (WHOLE.has(kind) || isMedia) return;
          }
          for (const child of el.children) visit(child, next);
        };

        // Collect both <main> page content AND <footer> content!
        const containers = [];
        const mainContent = document.querySelector("main");
        if (mainContent) containers.push(mainContent);
        const footerContent = document.querySelector("footer");
        if (footerContent) containers.push(footerContent);

        if (!containers.length) containers.push(document.body);

        for (const container of containers) {
          for (const child of container.children) visit(child, null);
        }

        return { tasks, byEl };
      };

      const ease = (k) => k * k * (3 - 2 * k);
      const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

      const LAYER_CSS = `
        :host {
          all: initial;
          pointer-events: none !important;
        }
        .layer {
          position: fixed;
          inset: 0;
          z-index: 80;
          overflow: hidden;
          pointer-events: none !important;
          opacity: 0;
          transition: opacity .35s;
        }
        .layer.on { opacity: 1; }
        .cursor {
          position: absolute;
          top: 0;
          left: 0;
          color: var(--c);
          will-change: transform, opacity;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.85));
          pointer-events: none !important;
        }
        .cursor svg { display: block; transition: transform .1s; }
        .cursor.press svg { transform: scale(.72); }
        .box {
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          border: 1px solid var(--c);
          background: color-mix(in srgb, var(--c) 8%, transparent);
          transition: opacity .25s;
          pointer-events: none !important;
        }
        .box.out { opacity: 0; }
        .box i {
          position: absolute;
          width: 5px;
          height: 5px;
          background: #fff;
          border: 1px solid var(--c);
        }
        .box i:first-of-type { top: -3px; left: -3px; }
        .box i:last-of-type { bottom: -3px; right: -3px; }
        .badge {
          position: absolute;
          bottom: -22px;
          left: 50%;
          transform: translateX(-50%);
          padding: 1px 6px;
          border-radius: 4px;
          background: var(--c);
          color: #0a0a0a;
          font: 600 10px/1.4 monospace, sans-serif;
          white-space: nowrap;
        }
        .caret {
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          background: var(--c);
          box-shadow: 0 0 8px var(--c);
          pointer-events: none !important;
        }

        /* Modern Collaborative Tour Dock (User Reference) */
        .bar {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999 !important;
          pointer-events: auto !important;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 14px 5px 10px;
          background: rgba(18, 20, 18, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          color: #d4d4d4;
          font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: opacity .35s ease, visibility .35s ease, transform .35s ease;
          box-shadow: 0 12px 36px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
          user-select: none;
        }
        .bar.on {
          opacity: 1;
          visibility: visible;
        }
        .bar * {
          pointer-events: auto !important;
        }

        /* Avatar Stack */
        .avatar-stack {
          display: flex;
          align-items: center;
        }
        .avatar-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          border: 1.5px solid #141714;
          margin-left: -5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.4);
          transition: transform 0.15s ease;
        }
        .avatar-circle:first-child {
          margin-left: 0;
        }
        .avatar-circle:hover {
          transform: translateY(-2px) scale(1.15);
          z-index: 5;
        }

        /* Status Indicator */
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #a3a3a3;
          margin-left: 2px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.8);
          animation: pulseDot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .status-dot.paused {
          background: #fbbf24;
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.8);
          animation: none;
        }
        .status-dot.complete {
          background: #60a5fa;
          box-shadow: 0 0 8px rgba(96, 165, 250, 0.8);
          animation: none;
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(0.85); }
        }

        .bar-divider {
          width: 1px;
          height: 14px;
          background: rgba(255, 255, 255, 0.15);
          margin: 0 2px;
        }

        /* Action Buttons */
        .bar-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .bar-btn {
          background: none;
          border: none;
          padding: 4px 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a3a3a3;
          cursor: pointer !important;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s, transform 0.1s;
        }
        .bar-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
          transform: scale(1.08);
        }
        .bar-btn:active {
          transform: scale(0.95);
        }
        .bar-btn svg {
          width: 14px;
          height: 14px;
          display: block;
          pointer-events: none;
        }

        .bar-percent {
          font-size: 11.5px;
          font-weight: 600;
          color: #e5e5e5;
          min-width: 34px;
          text-align: right;
          letter-spacing: -0.02em;
        }

        @media (max-width: 768px) {
          .bar {
            bottom: auto;
            top: 76px;
            right: 14px;
            padding: 4px 10px 4px 8px;
            gap: 8px;
            font-size: 10.5px;
          }
          .avatar-circle {
            width: 18px;
            height: 18px;
            font-size: 8.5px;
            margin-left: -4px;
          }
          .status-indicator {
            font-size: 10px;
          }
          .bar-btn svg {
            width: 12px;
            height: 12px;
          }
        }
        @media print { .layer, .bar { display: none; } }
      `;

      const addStyles = (target, css) => {
        try {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(css);
          target.adoptedStyleSheets = [...target.adoptedStyleSheets, sheet];
        } catch {
          const style = document.createElement("style");
          style.textContent = css;
          (target.head || target).append(style);
        }
      };

      if (!document.getElementById("sb-page-style")) {
        const style = document.createElement("style");
        style.id = "sb-page-style";
        style.textContent = `.sb-wait { opacity: 0 !important; }`;
        document.head.append(style);
      }

      const { tasks, byEl } = collect();
      if (!tasks.length) return () => {};

      tasks.forEach((t) => t.el.classList.add("sb-wait"));

      const host = document.createElement("div");
      host.id = "sb-host";
      host.setAttribute("data-banna-skip", "");
      host.style.pointerEvents = "none";
      document.body.append(host);
      const shadow = host.attachShadow({ mode: "open" });
      addStyles(shadow, LAYER_CSS);

      const layer = document.createElement("div");
      layer.className = "layer";
      shadow.append(layer);

      // Create Custom Dock Toolbar
      const bar = document.createElement("div");
      bar.className = "bar";

      // 1. Avatar stack
      const avatarStack = document.createElement("div");
      avatarStack.className = "avatar-stack";
      activeBuilders.forEach((b) => {
        const circle = document.createElement("div");
        circle.className = "avatar-circle";
        circle.style.backgroundColor = b.bg;
        circle.style.color = b.textColor;
        circle.textContent = b.letter;
        avatarStack.append(circle);
      });

      // 2. Status text with dot
      const statusWrap = document.createElement("div");
      statusWrap.className = "status-indicator";
      const statusDot = document.createElement("div");
      statusDot.className = "status-dot";
      const statusText = document.createElement("span");
      statusText.textContent = "Tour active";
      statusWrap.append(statusDot, statusText);

      // 3. First Divider
      const div1 = document.createElement("div");
      div1.className = "bar-divider";

      // 4. Action buttons: Replay (↺) and Play/Pause (▶/⏸) only (no star)
      const actions = document.createElement("div");
      actions.className = "bar-actions";

      // Replay button (↺)
      const btnReplay = document.createElement("button");
      btnReplay.className = "bar-btn";
      btnReplay.type = "button";
      btnReplay.title = "Replay tour";
      btnReplay.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      `;

      // Play / Pause button (▶ / ⏸)
      const btnPlayPause = document.createElement("button");
      btnPlayPause.className = "bar-btn";
      btnPlayPause.type = "button";
      btnPlayPause.title = "Pause / Resume";
      const updatePlayPauseIcon = (pausedState) => {
        if (pausedState) {
          btnPlayPause.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          `;
        } else {
          btnPlayPause.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          `;
        }
      };
      updatePlayPauseIcon(false);

      actions.append(btnReplay, btnPlayPause);

      // 5. Second Divider
      const div2 = document.createElement("div");
      div2.className = "bar-divider";

      // 6. Percentage
      const percentEl = document.createElement("div");
      percentEl.className = "bar-percent";
      percentEl.textContent = "0%";

      bar.append(avatarStack, statusWrap, div1, actions, div2, percentEl);
      shadow.append(bar);

      let built = 0;
      let running = false;
      let stopped = false;
      let isPaused = false;
      let isSpiraling = false;
      let spiralTime = 0;
      let last = 0;
      let lastActivity = 0;

      const finish = (task) => {
        if (task.state === "done") return;
        task.state = "done";
        task.cleanup.forEach((fn) => fn());
        task.cleanup = [];
        task.el.classList.remove("sb-wait");
        task.el.style.clipPath = "";
        built++;
        if (task.agent) {
          task.agent.script = null;
          task.agent.task = null;
          task.agent = null;
        }
      };

      const makeCursor = (color) => {
        const el = document.createElement("div");
        el.className = "cursor";
        el.style.setProperty("--c", color);
        const NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("viewBox", "0 0 20 22");
        svg.setAttribute("width", "18");
        svg.setAttribute("height", "20");
        const path = document.createElementNS(NS, "path");
        path.setAttribute("d", "M2 2l15 8-6.500 2L8 19z");
        path.setAttribute("fill", "currentColor");
        path.setAttribute("stroke", "#fff");
        path.setAttribute("stroke-width", "1.2");
        path.setAttribute("stroke-linejoin", "round");
        svg.append(path);
        el.append(svg);
        layer.append(el);
        return el;
      };

      const agents = activeBuilders.map((b, i) => {
        const angle = (i / activeBuilders.length) * Math.PI * 2;
        return {
          el: makeCursor(b.color),
          color: b.color,
          x: window.innerWidth / 2 + Math.cos(angle) * 60,
          y: window.innerHeight / 2 + Math.sin(angle) * 60,
          angle,
          spiralAngle: 0,
          initialRadius: 0,
          script: null,
          task: null,
        };
      });

      function* travel(a, target, seconds) {
        const sx = a.x;
        const sy = a.y;
        let t = 0;
        while (t < seconds) {
          if (!isPaused) {
            t += (yield) * options.speed;
          } else {
            yield;
          }
          const k = ease(Math.min(1, t / seconds));
          const [x, y] = target();
          a.x = sx + (x - sx) * k;
          a.y = sy + (y - sy) * k;
        }
      }

      function* buildBox(a, task) {
        const { el } = task;
        const startX = (r) => r.left;
        const endX = (r) => r.right;
        yield* travel(
          a,
          () => {
            const r = el.getBoundingClientRect();
            return [startX(r), r.top];
          },
          0.18
        );

        const box = document.createElement("div");
        box.className = "box";
        box.style.setProperty("--c", a.color);
        box.append(document.createElement("i"), document.createElement("i"));
        const badge = document.createElement("span");
        badge.className = "badge";
        box.append(badge);
        layer.append(box);
        task.cleanup.push(() => box.remove());

        const place = (k) => {
          const r = el.getBoundingClientRect();
          const w = r.width * k;
          const h = r.height * k;
          box.style.width = `${w}px`;
          box.style.height = `${h}px`;
          box.style.transform = `translate(${r.left}px, ${r.top}px)`;
          badge.textContent = `${Math.round(w)} × ${Math.round(h)}`;
          a.x = startX(r) + (endX(r) - startX(r)) * k;
          a.y = r.top + r.height * k;
        };

        let t = 0;
        while (t < 0.28) {
          if (!isPaused) {
            t += (yield) * options.speed;
          } else {
            yield;
          }
          place(ease(Math.min(1, t / 0.28)));
        }
        el.classList.remove("sb-wait");
        box.classList.add("out");
        t = 0;
        while (t < 0.16) {
          if (!isPaused) {
            t += (yield) * options.speed;
          } else {
            yield;
          }
          place(1);
        }
      }

      function textLines(el) {
        const box = el.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(el);
        const lines = [];
        for (const r of range.getClientRects()) {
          if (!r.width || !r.height) continue;
          const line = lines.find(
            (l) => Math.abs(l.top + l.height / 2 - (r.top + r.height / 2)) < r.height * 0.6
          );
          if (line) {
            const left = Math.min(line.left, r.left);
            line.right = Math.max(line.right, r.right);
            line.left = left;
            line.top = Math.min(line.top, r.top);
            line.bottom = Math.max(line.bottom, r.bottom);
            line.height = line.bottom - line.top;
          } else {
            lines.push({
              left: r.left,
              right: r.right,
              top: r.top,
              bottom: r.bottom,
              height: r.height,
            });
          }
        }
        lines.sort((p, q) => p.top - q.top);
        return lines.map((l) => ({
          left: l.left - box.left,
          right: l.right - box.left,
          top: l.top - box.top,
          bottom: l.bottom - box.top,
        }));
      }

      function* buildText(a, task) {
        const { el } = task;
        el.classList.remove("sb-wait");

        const lines = textLines(el);
        if (!lines.length) {
          el.style.clipPath = "";
          return;
        }

        yield* travel(
          a,
          () => {
            const r = el.getBoundingClientRect();
            return [r.left + lines[0].left, r.top + lines[0].bottom - 4];
          },
          0.16
        );

        const previousClip = el.style.clipPath;
        task.cleanup.push(() => {
          el.style.clipPath = previousClip || "";
        });
        const caret = document.createElement("div");
        caret.className = "caret";
        caret.style.setProperty("--c", a.color);
        layer.append(caret);
        task.cleanup.push(() => caret.remove());

        const widths = lines.map((l) => l.right - l.left);
        const total = widths.reduce((s, w) => s + w, 0) || 1;
        const chars = el.textContent.trim().length;
        const step = total / Math.max(1, chars);
        const seconds = clamp(chars * 0.014, 0.24, 1.0);
        const pad = 50;

        const draw = (done, isComplete = false) => {
          if (isComplete || done >= total) {
            el.style.clipPath = "";
            return;
          }

          let left = Math.floor(done / step) * step;
          let i = 0;
          while (i < lines.length - 1 && left >= widths[i]) {
            left -= widths[i];
            i++;
          }
          const l = lines[i];
          const x = l.left + left;
          const w = el.offsetWidth || el.getBoundingClientRect().width;
          const top = i === 0 ? -pad : l.top;
          const bottom = l.bottom + (i === lines.length - 1 ? pad : 0);

          el.style.clipPath = `polygon(${-pad}px ${-pad}px, ${w + pad}px ${-pad}px, ${w + pad}px ${top}px, ${x}px ${top}px, ${x}px ${bottom}px, ${-pad}px ${bottom}px)`;
          const r = el.getBoundingClientRect();
          caret.style.height = `${l.bottom - l.top}px`;
          caret.style.transform = `translate(${r.left + x}px, ${r.top + l.top}px)`;
          a.x = r.left + x;
          a.y = r.top + l.bottom - 3;
        };

        draw(0);
        let t = 0;
        while (t < seconds) {
          if (!isPaused) {
            t += (yield) * options.speed;
          } else {
            yield;
          }
          draw(ease(Math.min(1, t / seconds)) * total);
        }

        draw(total, true);
        caret.remove();
      }

      function* buildFade(a, task) {
        const { el } = task;
        yield* travel(
          a,
          () => {
            const r = el.getBoundingClientRect();
            return [r.left + r.width / 2, r.top + r.height / 2];
          },
          0.16
        );
        a.el.classList.add("press");
        el.classList.remove("sb-wait");
        let t = 0;
        while (t < 0.14) {
          if (!isPaused) {
            t += (yield) * options.speed;
          } else {
            yield;
          }
        }
        a.el.classList.remove("press");
      }

      const scripts = { box: buildBox, text: buildText, fade: buildFade };

      const wake = () => {
        lastActivity = performance.now();
        layer.classList.add("on");
        bar.classList.add("on");
        if (!running && !stopped) {
          running = true;
          last = performance.now();
          requestAnimationFrame(frame);
        }
      };

      const seen = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            seen.unobserve(e.target);
            const task = byEl.get(e.target);
            if (task && task.state === "hidden") {
              task.state = "queued";
              task.queuedAt = performance.now();
              wake();
            }
          }
        },
        { rootMargin: "200px 0px" }
      );
      tasks.forEach((t) => seen.observe(t.el));

      const stop = () => {
        if (stopped) return;
        stopped = true;
        tasks.forEach(finish);
        seen.disconnect();
        host.remove();
        window.removeEventListener("keydown", onKey);
      };

      // Trigger the spiral exit sequence
      const triggerSpiralExit = () => {
        if (isSpiraling) return;
        isSpiraling = true;
        spiralTime = 0;

        // Finish all remaining tasks so the page is fully revealed
        tasks.forEach(finish);

        // Update status pill to completed
        statusText.textContent = "Tour complete";
        statusDot.className = "status-dot complete";
        percentEl.textContent = "100%";

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        agents.forEach((a) => {
          const dx = a.x - cx;
          const dy = a.y - cy;
          a.initialRadius = Math.hypot(dx, dy) || (window.innerWidth * 0.25);
          a.spiralAngle = Math.atan2(dy, dx);
          a.script = null;
          a.task = null;
        });

        isPaused = false;
        // Keep loop running to drive the spiral!
        if (!running && !stopped) {
          running = true;
          last = performance.now();
          requestAnimationFrame(frame);
        }
      };

      // Interactive controls handlers
      const togglePause = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (isSpiraling) return;

        isPaused = !isPaused;
        updatePlayPauseIcon(isPaused);

        if (isPaused) {
          statusText.textContent = "Tour paused";
          statusDot.className = "status-dot paused";
        } else {
          statusText.textContent = "Tour active";
          statusDot.className = "status-dot";
          last = performance.now();
          lastActivity = performance.now();
          if (!running && !stopped) {
            running = true;
            requestAnimationFrame(frame);
          }
        }
      };

      const replayTour = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        isSpiraling = false;
        spiralTime = 0;
        isPaused = false;
        updatePlayPauseIcon(false);

        if (bar) {
          bar.style.opacity = "1";
          bar.style.pointerEvents = "auto";
        }

        // Reset all tasks
        tasks.forEach((t) => {
          t.state = "hidden";
          t.queuedAt = 0;
          t.agent = null;
          t.el.classList.add("sb-wait");
        });
        built = 0;

        statusText.textContent = "Tour active";
        statusDot.className = "status-dot";
        percentEl.textContent = "0%";

        // Reset cursors to visible
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        agents.forEach((a, i) => {
          const angle = (i / agents.length) * Math.PI * 2;
          a.x = cx + Math.cos(angle) * 70;
          a.y = cy + Math.sin(angle) * 70;
          a.el.style.display = "block";
          a.el.style.opacity = "1";
          a.el.style.transform = `translate(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px) scale(1)`;
        });

        // Re-observe elements
        tasks.forEach((t) => seen.observe(t.el));

        running = true;
        stopped = false;
        last = performance.now();
        lastActivity = performance.now();
        layer.classList.add("on");
        bar.classList.add("on");
        requestAnimationFrame(frame);
      };

      btnReplay.addEventListener("click", replayTour);
      btnPlayPause.addEventListener("click", togglePause);

      const onKey = (e) => {
        if (e.key === "Escape") triggerSpiralExit();
        if (e.key === " " && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
          e.preventDefault();
          togglePause();
        }
      };
      window.addEventListener("keydown", onKey);

      const frame = (now) => {
        if (stopped) return;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        // SPIRAL EXIT PHASE
        if (isSpiraling) {
          spiralTime += dt;
          const duration = 1.1; // 1.1s spiral into center vortex
          const p = Math.min(1, spiralTime / duration);
          const easeP = p * p * p; // Cubic inward acceleration

          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;

          agents.forEach((a, idx) => {
            // Tight spiral: 3 full revolutions (Math.PI * 6) inward to center
            const revolutions = Math.PI * 6;
            const currentAngle = a.spiralAngle + p * revolutions + (idx * 0.25);
            const currentRadius = Math.max(0, a.initialRadius * (1 - easeP));

            a.x = cx + Math.cos(currentAngle) * currentRadius;
            a.y = cy + Math.sin(currentAngle) * currentRadius;

            const scale = Math.max(0, 1 - p);
            const opacity = Math.max(0, 1 - p * 1.3);
            const rotationDeg = (currentAngle * 180 / Math.PI) + 45;

            a.el.style.transform = `translate(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px) rotate(${rotationDeg.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
            a.el.style.opacity = opacity.toFixed(3);
          });

          if (spiralTime >= duration) {
            // Guarantee complete disappearance from DOM
            agents.forEach((a) => {
              a.el.style.opacity = "0";
              a.el.style.display = "none";
            });
            layer.classList.remove("on");
            running = false; // Reset running flag so replay can trigger
            setTimeout(() => {
              if (bar && !running) {
                bar.style.opacity = "0";
                bar.style.pointerEvents = "none";
              }
            }, 2500);
            return;
          }

          requestAnimationFrame(frame);
          return;
        }

        // PAUSED STATE
        if (isPaused) {
          requestAnimationFrame(frame);
          return;
        }

        // NORMAL BUILDING PHASE
        let waiting = 0;
        for (const task of tasks) {
          if (task.state === "queued") {
            const r = task.el.getBoundingClientRect();
            if (r.bottom < 0 || now - task.queuedAt > options.maxWait * 1000) {
              finish(task);
            } else {
              waiting++;
            }
          } else if (
            task.state === "active" &&
            (!task.el.isConnected || task.el.getBoundingClientRect().bottom < -40)
          ) {
            finish(task);
          }
        }

        for (const a of agents) {
          if (!a.script) {
            const task = tasks.find(
              (t) => t.state === "queued" && (!t.parent || t.parent.state === "done")
            );
            if (task) {
              task.state = "active";
              task.agent = a;
              a.task = task;
              a.script = scripts[task.kind](a, task);
              a.script.next();
            }
          }
          if (a.script) {
            lastActivity = now;
            const task = a.task;
            try {
              if (a.script.next(dt).done) finish(task);
            } catch (err) {
              console.warn("banna error:", err);
              finish(task);
            }
          } else {
            a.angle += dt * 0.9;
            const k = 1 - Math.exp(-dt * 2.2);
            a.x += (window.innerWidth / 2 + Math.cos(a.angle) * window.innerWidth * 0.1 - a.x) * k;
            a.y += (window.innerHeight / 2 + Math.sin(a.angle * 1.3) * window.innerHeight * 0.14 - a.y) * k;
          }
          a.el.style.transform = `translate(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px)`;
        }

        if (waiting > 0) lastActivity = now;

        // Update progress percentage
        const progress = Math.min(100, Math.round((built / Math.max(1, tasks.length)) * 100));
        percentEl.textContent = `${progress}%`;

        // When all tasks are built, smoothly trigger spiral exit!
        if (built >= tasks.length && !isSpiraling) {
          triggerSpiralExit();
          requestAnimationFrame(frame);
          return;
        }

        const idle = now - lastActivity;
        if (idle > 3500 && !isSpiraling) {
          triggerSpiralExit();
          requestAnimationFrame(frame);
          return;
        }

        requestAnimationFrame(frame);
      };

      wake();
      return stop;
    };

    const isHomePage = pathname === "/";
    let timer = null;

    if (isHomePage) {
      const handleCarLoader = () => {
        cleanupRef.current = startBanna();
      };
      window.addEventListener("carloader:finished", handleCarLoader, { once: true });
      timer = setTimeout(() => {
        cleanupRef.current = startBanna();
      }, 2100);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("carloader:finished", handleCarLoader);
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
      };
    } else {
      timer = setTimeout(() => {
        cleanupRef.current = startBanna();
      }, 80);

      return () => {
        clearTimeout(timer);
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
      };
    }
  }, [pathname]);

  return null;
}
