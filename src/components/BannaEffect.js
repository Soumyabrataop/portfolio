"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function BannaEffect() {
  const pathname = usePathname();
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Clean up any ongoing Banna instance from previous route
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    const startBanna = () => {
      // Remove any lingering sb-host if present
      const existingHost = document.getElementById("sb-host");
      if (existingHost) existingHost.remove();

      const phone = window.innerWidth < 700;

      const options = {
        speed: 1.65,
        agents: phone ? 4 : 7,
        maxWait: 8,
        maxLayers: 300,
        colors: [
          "#ffffff",
          "#e5e5e5",
          "#a3a3a3",
          "#1d9bf0",
          "#f87171",
          "#38bdf8",
        ],
        exclude: "nav, footer, .loader, #sb-host, [data-banna-skip]",
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

        // Links (<a href="...">) - cards (Blogs, CTF) and CTA buttons should draw box!
        if (name === "A") {
          if (isBox && rect.width >= 70 && rect.height >= 28) {
            return "box";
          }
          return hasOwnText(el) ? "text" : "fade";
        }

        // Elements with direct text (Headings, Paragraphs, Bio)
        if (hasOwnText(el)) {
          // If small pill or badge (e.g. tag, chip)
          if (isBox && rect.width < 140 && rect.height < 40) {
            return "fade";
          }
          // If card or box with text (e.g. bio box)
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
          if (el.closest("nav") || el.closest("footer") || el.closest(".loader")) return;
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

        const mainContent = document.querySelector("main") || document.body;
        for (const child of mainContent.children) visit(child, null);

        return { tasks, byEl };
      };

      const ease = (k) => k * k * (3 - 2 * k);
      const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

      const LAYER_CSS = `
        :host { all: initial; }
        .layer {
          position: fixed;
          inset: 0;
          z-index: 80;
          overflow: hidden;
          pointer-events: none;
          opacity: 0;
          transition: opacity .35s;
        }
        .layer.on { opacity: 1; }
        .cursor {
          position: absolute;
          top: 0;
          left: 0;
          color: var(--c);
          will-change: transform;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.8));
          pointer-events: none;
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
          pointer-events: none;
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
          pointer-events: none;
        }
        .bar {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 95;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px;
          background: rgba(18, 18, 18, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          color: #d4d4d4;
          font: 12px/1.5 monospace, sans-serif;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: opacity .25s, visibility .25s;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        .bar.on { opacity: 1; visibility: visible; }
        .bar button {
          padding: 3px 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          color: #fff;
          font: inherit;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .bar button:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
        }
        @media (max-width: 768px) {
          .bar {
            bottom: auto;
            top: 76px;
            right: 16px;
            font-size: 11px;
            padding: 4px 10px;
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
      document.body.append(host);
      const shadow = host.attachShadow({ mode: "open" });
      addStyles(shadow, LAYER_CSS);

      const layer = document.createElement("div");
      layer.className = "layer";
      shadow.append(layer);

      const bar = document.createElement("div");
      bar.className = "bar";
      const countEl = document.createElement("span");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Skip [Esc]";
      bar.append(countEl, button);
      shadow.append(bar);

      let built = 0;
      let running = false;
      let stopped = false;
      let last = 0;
      let lastActivity = 0;
      let barText = "";

      const finish = (task) => {
        if (task.state === "done") return;
        task.state = "done";
        task.cleanup.forEach((fn) => fn());
        task.cleanup = [];
        task.el.classList.remove("sb-wait");
        task.el.style.clipPath = ""; // Guaranteed unclip
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

      const agents = Array.from({ length: Math.max(1, options.agents) }, (_, i) => {
        const angle = (i / options.agents) * Math.PI * 2;
        const color = options.colors[i % options.colors.length];
        return {
          el: makeCursor(color),
          color,
          x: window.innerWidth / 2 + Math.cos(angle) * 40,
          y: window.innerHeight / 2 + Math.sin(angle) * 40,
          angle,
          script: null,
          task: null,
        };
      });

      function* travel(a, target, seconds) {
        const sx = a.x;
        const sy = a.y;
        let t = 0;
        while (t < seconds) {
          t += (yield) * options.speed;
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
          t += (yield) * options.speed;
          place(ease(Math.min(1, t / 0.28)));
        }
        el.classList.remove("sb-wait");
        box.classList.add("out");
        t = 0;
        while (t < 0.16) {
          t += (yield) * options.speed;
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
        // Ensure element is active in DOM for measurement
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
            // Unclip completely to guarantee all letters/words render in full
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
          t += (yield) * options.speed;
          draw(ease(Math.min(1, t / seconds)) * total);
        }

        // Final step: unclip completely and remove caret
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
        while (t < 0.14) t += (yield) * options.speed;
        a.el.classList.remove("press");
      }

      const scripts = { box: buildBox, text: buildText, fade: buildFade };

      const wake = () => {
        lastActivity = performance.now();
        layer.classList.add("on");
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

      const skip = () => {
        tasks.forEach(finish);
        stop();
      };

      const onKey = (e) => {
        if (e.key === "Escape") skip();
      };

      button.addEventListener("click", skip);
      window.addEventListener("keydown", onKey);

      const frame = (now) => {
        if (stopped) return;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

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

        if (bar) {
          const activeCount = agents.filter((a) => a.script).length;
          const text = `${activeCount} builders · ${built}/${tasks.length} layers`;
          if (text !== barText) {
            barText = text;
            countEl.textContent = text;
          }
          bar.classList.toggle(
            "on",
            (waiting > 0 || now - lastActivity < 700) && built < tasks.length
          );
        }

        const idle = now - lastActivity;
        if (idle > 900) layer.classList.remove("on");
        if (built >= tasks.length && idle > 800) {
          stop();
          return;
        }
        if (idle > 4000) {
          stop();
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
      // On homepage: sequence directly after CarLoader completes (1.9s)
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
      // On all other pages (/about, /projects, /contact): start immediately (no CarLoader)
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
