/* =========================================================
   Akshay S Krishnan — portfolio interactions
   ========================================================= */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- mobile nav ---------- */

const menuButton = document.getElementById("menuButton");
const menuLabel = document.getElementById("menuLabel");
const siteNav = document.getElementById("site-nav");
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));

function setNavState(isOpen) {
  siteNav?.classList.toggle("open", isOpen);
  menuButton?.setAttribute("aria-expanded", String(isOpen));
  if (menuLabel) menuLabel.textContent = isOpen ? "close" : "menu";
}

function closeNav() {
  if (siteNav?.classList.contains("open")) setNavState(false);
}

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    setNavState(!siteNav.classList.contains("open"));
  });
}

navLinks.forEach((link) => link.addEventListener("click", closeNav));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNav();
});

/* ---------- sticky header + scroll progress ---------- */

const header = document.getElementById("siteHeader");
const scrollBar = document.getElementById("scrollBar");

function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle("is-stuck", y > 20);

  if (scrollBar) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(y / max, 1) : 0;
    scrollBar.style.width = `${ratio * 100}%`;
  }
}

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
  },
  { passive: true }
);
onScroll();

/* ---------- kinetic hero headline ----------
   Words rise into place one after another. Words inside <em> keep their
   emphasis, so the headline reads the same if this never runs. */

const heroTitle = document.querySelector("[data-kinetic]");

if (heroTitle) {
  const words = [];
  heroTitle.childNodes.forEach((node) => {
    const emphasis = node.nodeName === "EM";
    node.textContent
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .forEach((text) => words.push({ text, emphasis }));
  });
  heroTitle.textContent = "";

  words.forEach(({ text, emphasis }, index) => {
    const outer = document.createElement("span");
    outer.className = "word";

    const inner = document.createElement(emphasis ? "em" : "span");
    inner.textContent = text;
    inner.style.setProperty("--d", `${120 + index * 90}ms`);

    outer.appendChild(inner);
    heroTitle.appendChild(outer);
    if (index < words.length - 1) heroTitle.appendChild(document.createTextNode(" "));
  });
}

/* ---------- reveal on scroll ---------- */

const revealElements = Array.from(document.querySelectorAll(".reveal"));

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

/* ---------- active section in nav ---------- */

const sections = Array.from(document.querySelectorAll("main section[id]"));

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => navObserver.observe(section));
}

/* ---------- typed terminal ---------- */

const typedCode = document.getElementById("typedCode");

const TERMINAL_LINES = [
  { text: "# rebuilding Python from the fundamentals", cls: "cmt" },
  { text: ">>> import pandas as pd", cls: "prm" },
  { text: ">>> matches = pd.read_csv('epl.csv')", cls: "prm" },
  { text: ">>> matches['form'] = rolling_points(matches, n=5)", cls: "prm" },
  { text: ">>> matches.groupby('result').size()", cls: "prm" },
  { text: "H    1140", cls: "out" },
  { text: "D     720", cls: "out" },
  { text: "A     900", cls: "out" },
  { text: "# next: engineer features that actually carry signal", cls: "cmt" }
];

// Like a real REPL, the ">>> " prompt appears whole; only the code is typed.
const PROMPT = ">>> ";

function promptSpan() {
  const span = document.createElement("span");
  span.className = "pp";
  span.textContent = PROMPT;
  return span;
}

function runTerminal() {
  if (!typedCode) return;

  if (prefersReducedMotion) {
    TERMINAL_LINES.forEach((line) => {
      const span = document.createElement("span");
      span.className = line.cls;
      if (line.cls === "prm") typedCode.appendChild(promptSpan());
      span.textContent = line.cls === "prm" ? line.text.slice(PROMPT.length) : line.text;
      typedCode.appendChild(span);
      typedCode.appendChild(document.createTextNode("\n"));
    });
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let current = null;

  function tick() {
    if (lineIndex >= TERMINAL_LINES.length) {
      // Hold the finished output, then start over.
      window.setTimeout(() => {
        typedCode.textContent = "";
        lineIndex = 0;
        charIndex = 0;
        current = null;
        tick();
      }, 4200);
      return;
    }

    const line = TERMINAL_LINES[lineIndex];

    if (!current) {
      if (line.cls === "prm") {
        typedCode.appendChild(promptSpan());
        charIndex = PROMPT.length;
      }
      current = document.createElement("span");
      current.className = line.cls;
      typedCode.appendChild(current);
    }

    if (charIndex < line.text.length) {
      current.textContent += line.text.charAt(charIndex);
      charIndex += 1;
      window.setTimeout(tick, line.cls === "out" ? 14 : 26);
      return;
    }

    typedCode.appendChild(document.createTextNode("\n"));
    lineIndex += 1;
    charIndex = 0;
    current = null;
    window.setTimeout(tick, line.cls === "out" ? 90 : 380);
  }

  tick();
}

// Only start typing once the terminal is actually on screen.
if (typedCode && "IntersectionObserver" in window) {
  const terminalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        terminalObserver.disconnect();
        runTerminal();
      });
    },
    { threshold: 0.25 }
  );
  terminalObserver.observe(typedCode.closest(".terminal") || typedCode);
} else {
  runTerminal();
}

/* ---------- 3D loss surface ----------
   A made-up loss surface drawn as a wireframe in perspective, turning
   slowly, with a few gradient-descent runs (momentum plus a little noise)
   rolling down into its valleys. The surface is fixed in world space; each
   frame turns the camera, projects the grid and batches the lines into
   depth bands so the far side fades into the dark. */

const surfaceCanvas = document.getElementById("landscape");

if (surfaceCanvas && surfaceCanvas.getContext) {
  const ctx = surfaceCanvas.getContext("2d");

  const GRID = 34; // vertices per side
  const EXTENT = 2; // the surface spans -EXTENT..EXTENT world units
  const PITCH = 0.42; // camera elevation, radians
  const DISTANCE = 4.2; // camera distance from the centre
  const SPIN = 0.03; // radians per second
  const FOG_BANDS = 8;
  const RUNS = 3;
  const TRAIL = 110; // points of history kept per run
  const TRAIL_BANDS = 5; // a trail fades in a few steps, one stroke each
  const STEP_MS = 60; // one optimiser step per tick
  const FRAME_MS = 45; // ~22fps is plenty for something turning this slowly
  const MAX_DPR = 1; // faint 1px lines don't need a retina-sized canvas
  const LR = 0.0022;
  const MOMENTUM = 0.9;
  const NOISE = 0.0008;

  const COS_P = Math.cos(PITCH);
  const SIN_P = Math.sin(PITCH);
  const vertexCount = GRID * GRID;
  const coords = Float32Array.from({ length: GRID }, (_, i) => (i / (GRID - 1)) * 2 * EXTENT - EXTENT);
  const vertexZ = new Float32Array(vertexCount);
  const screenX = new Float32Array(vertexCount);
  const screenY = new Float32Array(vertexCount);
  const depths = new Float32Array(vertexCount);

  // The colours never change, so build the stroke styles once, not per frame.
  const BAND_STYLES = Array.from(
    { length: FOG_BANDS },
    (_, b) => `rgba(196, 154, 92, ${(0.32 - (b / (FOG_BANDS - 1)) * 0.29).toFixed(3)})`
  );
  const TRAIL_STYLES = Array.from(
    { length: TRAIL_BANDS },
    (_, b) => `rgba(237, 226, 207, ${(((b + 1) / TRAIL_BANDS) * 0.85).toFixed(3)})`
  );

  let width = 0;
  let height = 0;
  let focal = 1;
  let centerX = 0;
  let centerY = 0;
  let yaw = 0.6;
  let cosYaw = 1;
  let sinYaw = 0;
  let wells = [];
  let low = 0;
  let high = 1;
  let runs = [];
  let rafId = null;
  let lastFrame = 0;
  let lastStep = 0;
  let fade = null;

  // A shallow bowl plus a handful of gaussian wells and a couple of bumps.
  function lossAt(u, v) {
    let value = 0.06 * (u * u + v * v);
    for (const well of wells) {
      const du = u - well.u;
      const dv = v - well.v;
      value += well.depth * Math.exp(-(du * du + dv * dv) / well.spread);
    }
    return value;
  }

  function gradientAt(u, v) {
    let gu = 0.12 * u;
    let gv = 0.12 * v;
    for (const well of wells) {
      const du = u - well.u;
      const dv = v - well.v;
      const k = (-2 * well.depth * Math.exp(-(du * du + dv * dv) / well.spread)) / well.spread;
      gu += k * du;
      gv += k * dv;
    }
    return [gu, gv];
  }

  // Loss values mapped to world height, centred on zero.
  const heightOf = (value) => ((value - low) / (high - low || 1) - 0.5) * 0.9;

  function makeSurface() {
    wells = Array.from({ length: 7 }, (_, i) => ({
      u: (Math.random() * 2 - 1) * EXTENT * 0.8,
      v: (Math.random() * 2 - 1) * EXTENT * 0.8,
      spread: 0.18 + Math.random() * 0.5,
      depth: (i < 5 ? -1 : 1) * (0.25 + Math.random() * 0.35)
    }));

    low = Infinity;
    high = -Infinity;
    for (let j = 0; j < GRID; j += 1) {
      for (let i = 0; i < GRID; i += 1) {
        const value = lossAt(coords[i], coords[j]);
        vertexZ[j * GRID + i] = value;
        if (value < low) low = value;
        if (value > high) high = value;
      }
    }
    // The surface never changes, so turn losses into heights once.
    for (let k = 0; k < vertexCount; k += 1) vertexZ[k] = heightOf(vertexZ[k]);
  }

  // World (u across, v into the screen, z up) to screen x, y and depth.
  // Writes into one shared point so a frame allocates nothing per vertex.
  const projected = { x: 0, y: 0, depth: 0 };

  function project(u, v, z) {
    const x = u * cosYaw - v * sinYaw;
    const y = u * sinYaw + v * cosYaw;
    const depth = DISTANCE + y * COS_P - z * SIN_P;
    const up = y * SIN_P + z * COS_P;
    projected.x = centerX + (focal * x) / depth;
    projected.y = centerY - (focal * up) / depth;
    projected.depth = depth;
    return projected;
  }

  function drawSurface() {
    let near = Infinity;
    let far = -Infinity;

    for (let j = 0; j < GRID; j += 1) {
      for (let i = 0; i < GRID; i += 1) {
        const k = j * GRID + i;
        const p = project(coords[i], coords[j], vertexZ[k]);
        screenX[k] = p.x;
        screenY[k] = p.y;
        depths[k] = p.depth;
        if (p.depth < near) near = p.depth;
        if (p.depth > far) far = p.depth;
      }
    }

    const bands = [];
    for (let b = 0; b < FOG_BANDS; b += 1) bands.push(new Path2D());
    const bandScale = FOG_BANDS / (far - near || 1);
    const bandOf = (a, b) =>
      Math.min(FOG_BANDS - 1, Math.floor(((depths[a] + depths[b]) / 2 - near) * bandScale));

    for (let j = 0; j < GRID; j += 1) {
      for (let i = 0; i < GRID; i += 1) {
        const k = j * GRID + i;
        if (i < GRID - 1) {
          const path = bands[bandOf(k, k + 1)];
          path.moveTo(screenX[k], screenY[k]);
          path.lineTo(screenX[k + 1], screenY[k + 1]);
        }
        if (j < GRID - 1) {
          const path = bands[bandOf(k, k + GRID)];
          path.moveTo(screenX[k], screenY[k]);
          path.lineTo(screenX[k + GRID], screenY[k + GRID]);
        }
      }
    }

    ctx.lineWidth = 1;
    for (let b = 0; b < FOG_BANDS; b += 1) {
      // Nearest band strongest, fading with distance.
      ctx.strokeStyle = BAND_STYLES[b];
      ctx.stroke(bands[b]);
    }
  }

  function startRun(run, wait) {
    // Drop the run somewhere high on the surface: the best of a few tries.
    let best = null;
    for (let t = 0; t < 14; t += 1) {
      const u = (Math.random() * 2 - 1) * EXTENT * 0.85;
      const v = (Math.random() * 2 - 1) * EXTENT * 0.85;
      const value = lossAt(u, v);
      if (!best || value > best.value) best = { u, v, value };
    }

    Object.assign(run, { u: best.u, v: best.v, vu: 0, vv: 0, step: 0, still: 0, wait, done: false });
    run.trail = [[best.u, best.v, heightOf(best.value)]];
  }

  function advance(run) {
    if (run.wait > 0) {
      run.wait -= 1;
      if (run.wait === 0 && run.done) startRun(run, 0);
      return;
    }

    const [gu, gv] = gradientAt(run.u, run.v);
    run.vu = MOMENTUM * run.vu - LR * gu + (Math.random() - 0.5) * NOISE;
    run.vv = MOMENTUM * run.vv - LR * gv + (Math.random() - 0.5) * NOISE;
    run.u += run.vu;
    run.v += run.vv;
    run.step += 1;

    run.trail.push([run.u, run.v, heightOf(lossAt(run.u, run.v))]);
    if (run.trail.length > TRAIL) run.trail.shift();

    run.still = Math.hypot(run.vu, run.vv) < 0.0015 ? run.still + 1 : 0;
    const lost = Math.abs(run.u) > EXTENT || Math.abs(run.v) > EXTENT;
    if (run.still > 24 || run.step > 420 || lost) {
      // Converged (or gave up): hold the result for a moment, then go again.
      run.done = true;
      run.wait = 45;
    }
  }

  function drawRuns() {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    runs.forEach((run, index) => {
      if (run.step === 0) return;
      const trail = run.trail;
      const last = trail.length - 1;

      // Older steps fade out. The trail is split into a few bands of rising
      // opacity and each band is a single stroke.
      ctx.lineWidth = 1.6;
      for (let b = 0; b < TRAIL_BANDS; b += 1) {
        const start = Math.floor((b * last) / TRAIL_BANDS);
        const end = Math.floor(((b + 1) * last) / TRAIL_BANDS);
        if (end <= start) continue;

        ctx.strokeStyle = TRAIL_STYLES[b];
        ctx.beginPath();
        for (let p = start; p <= end; p += 1) {
          const q = project(trail[p][0], trail[p][1], trail[p][2] + 0.01);
          if (p === start) ctx.moveTo(q.x, q.y);
          else ctx.lineTo(q.x, q.y);
        }
        ctx.stroke();
      }

      const head = project(trail[last][0], trail[last][1], trail[last][2] + 0.01);
      const hx = head.x;
      const hy = head.y;
      ctx.fillStyle = "#ede2cf";
      ctx.beginPath();
      ctx.arc(hx, hy, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(196, 154, 92, 0.9)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(hx, hy, 6.5, 0, Math.PI * 2);
      ctx.stroke();

      // The first run reports what an optimiser would: its step and loss.
      if (index === 0) {
        const value = Math.max(0, (lossAt(run.u, run.v) - low) / (high - low || 1));
        ctx.font = '400 11px "IBM Plex Mono", ui-monospace, monospace';
        ctx.fillStyle = "rgba(237, 226, 207, 0.7)";
        ctx.fillText(
          `step ${String(run.step).padStart(3, "0")}  loss ${value.toFixed(3)}`,
          Math.min(hx + 14, width - 180),
          Math.max(hy - 12, 16)
        );
      }
    });
  }

  function render() {
    if (!width || !height) return;
    cosYaw = Math.cos(yaw);
    sinYaw = Math.sin(yaw);
    ctx.clearRect(0, 0, width, height);
    drawSurface();
    drawRuns();

    // Fade out toward the copy on the left. This is done on the canvas
    // because a CSS mask over a canvas that redraws every frame is costly
    // to composite.
    if (fade) {
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
    }
  }

  function frame(now) {
    rafId = window.requestAnimationFrame(frame);
    if (now - lastFrame < FRAME_MS) return;
    const elapsed = lastFrame ? Math.min(now - lastFrame, 100) : FRAME_MS;
    lastFrame = now;
    yaw += (SPIN * elapsed) / 1000;

    if (now - lastStep >= STEP_MS) {
      lastStep = now;
      runs.forEach(advance);
    }
    render();
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = window.innerWidth;
    height = window.innerHeight;
    // A frame that hasn't been laid out yet reports 0x0; resize tries again.
    if (!width || !height) return;

    surfaceCanvas.width = Math.floor(width * dpr);
    surfaceCanvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fill the lower part of the view, sitting right of the copy on desktop.
    focal = height * 1.19;
    centerX = width * (width > 900 ? 0.6 : 0.5);
    centerY = height * 0.54;

    // Desktop copy is left-aligned, so the surface fades out toward it.
    // Narrow screens dim the whole canvas in CSS instead.
    if (width > 900) {
      fade = ctx.createLinearGradient(0, 0, width, 0);
      fade.addColorStop(0, "rgba(0, 0, 0, 0.22)");
      fade.addColorStop(0.4, "rgba(0, 0, 0, 0.35)");
      fade.addColorStop(0.85, "rgba(0, 0, 0, 1)");
    } else {
      fade = null;
    }
  }

  makeSurface();
  runs = Array.from({ length: RUNS }, (_, i) => {
    const run = {};
    startRun(run, i * 40);
    return run;
  });
  resize();

  if (prefersReducedMotion) {
    // No motion: let every run settle straight away and show one still frame.
    runs.forEach((run) => {
      run.wait = 0;
      while (!run.done) advance(run);
    });
    render();
  } else {
    rafId = window.requestAnimationFrame(frame);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!document.hidden && rafId === null) {
        lastFrame = 0;
        rafId = window.requestAnimationFrame(frame);
      }
    });
  }

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resize();
      if (prefersReducedMotion) render();
    }, 150);
  });
}

/* ---------- terminal tilt ----------
   On desktop the terminal sits at a slight 3D angle (see styles.css) and
   leans toward the pointer while it is over it. */

const terminalWindow = document.querySelector(".terminal");

if (terminalWindow && !prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
  terminalWindow.addEventListener("pointermove", (event) => {
    const rect = terminalWindow.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const angle = Math.hypot(x, y) * 12;
    terminalWindow.style.rotate = angle > 0.2 ? `${-y} ${x} 0 ${angle}deg` : "";
  });

  terminalWindow.addEventListener("pointerleave", () => {
    terminalWindow.style.rotate = "";
  });
}
