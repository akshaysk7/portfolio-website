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

/* ---------- kinetic hero headline ---------- */

const heroTitle = document.querySelector("[data-kinetic]");

if (heroTitle) {
  const words = heroTitle.textContent.trim().split(/\s+/);
  heroTitle.textContent = "";

  words.forEach((word, index) => {
    const outer = document.createElement("span");
    outer.className = "word";

    const inner = document.createElement("span");
    inner.textContent = word;
    // The last word is the payoff — give it the gradient.
    if (index === words.length - 1) inner.classList.add("accent");
    inner.style.setProperty("--d", `${120 + index * 65}ms`);

    outer.appendChild(inner);
    heroTitle.appendChild(outer);
    if (index < words.length - 1) heroTitle.appendChild(document.createTextNode(" "));
  });
}

/* ---------- reveal on scroll ---------- */

const revealElements = Array.from(document.querySelectorAll(".reveal"));

revealElements.forEach((element) => {
  element.style.setProperty("--delay", element.dataset.delay || 0);
});

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

function runTerminal() {
  if (!typedCode) return;

  if (prefersReducedMotion) {
    TERMINAL_LINES.forEach((line) => {
      const span = document.createElement("span");
      span.className = line.cls;
      span.textContent = line.text;
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

/* ---------- magnetic hover ---------- */

if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.14}px, ${y * 0.2}px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}

/* ---------- brand decode ----------
   The wordmark resolves out of noise on load, and swaps to the GitHub
   handle on hover. The element ships with its real text already in the
   HTML, so if this never runs the header still reads correctly. */

const brandName = document.getElementById("brandName");

if (brandName && !prefersReducedMotion) {
  const NOISE = "01<>[]{}/\\|_-=+*#%$&";
  const STEP_MS = 42;

  let frameId = null;

  // Once the text has resolved, re-render it so a file extension can carry
  // the accent colour. Mid-scramble it stays flat, which reads as noise.
  function paintSettled(text) {
    const dot = text.lastIndexOf(".");

    if (dot <= 0) {
      brandName.textContent = text;
      return;
    }

    brandName.textContent = text.slice(0, dot);
    const extension = document.createElement("span");
    extension.className = "brand-ext";
    extension.textContent = text.slice(dot);
    brandName.appendChild(extension);
  }

  function decodeTo(text) {
    if (frameId !== null) window.cancelAnimationFrame(frameId);

    const start = performance.now();
    const duration = 55 * text.length;
    // each character settles at its own moment, left to right
    const settleAt = Array.from(text, (_, i) =>
      (i / text.length) * duration * 0.65 + Math.random() * duration * 0.3
    );

    let lastPaint = 0;

    function tick(now) {
      const elapsed = now - start;

      if (now - lastPaint >= STEP_MS) {
        lastPaint = now;

        let output = "";
        let settled = true;

        for (let i = 0; i < text.length; i += 1) {
          if (elapsed >= settleAt[i]) {
            output += text[i];
          } else {
            output += NOISE[Math.floor(Math.random() * NOISE.length)];
            settled = false;
          }
        }

        if (settled) {
          paintSettled(text);
          frameId = null;
          return;
        }

        brandName.textContent = output;
      }

      frameId = window.requestAnimationFrame(tick);
    }

    frameId = window.requestAnimationFrame(tick);
  }

  const fullName = brandName.dataset.name;
  const altName = brandName.dataset.alt;
  const brandLink = brandName.closest(".brand");

  decodeTo(fullName);

  brandLink?.addEventListener("pointerenter", () => decodeTo(altName));
  brandLink?.addEventListener("pointerleave", () => decodeTo(fullName));
  brandLink?.addEventListener("focus", () => decodeTo(altName));
  brandLink?.addEventListener("blur", () => decodeTo(fullName));
}

/* ---------- binary rain ----------
   Columns of 0s and 1s falling behind the page. The trail is made by
   erasing the previous frame a little each tick (destination-out) rather
   than painting black over it, so the canvas stays transparent and the
   gradient glow behind it still shows through. */

const rainCanvas = document.getElementById("rain");

if (rainCanvas && rainCanvas.getContext) {
  const ctx = rainCanvas.getContext("2d");

  const COL_WIDTH = 16; // px between columns
  const ROW_HEIGHT = 19; // px between glyphs in a column
  const FONT_SIZE = 12;
  const STEP_MS = 55; // one glyph per column per step — deliberately chunky

  let width = 0;
  let height = 0;
  let columns = [];
  let rafId = null;
  let lastStep = 0;

  function makeColumn() {
    return {
      // start above the fold so columns arrive staggered
      row: -Math.floor(Math.random() * 40),
      speed: Math.random() < 0.25 ? 2 : 1,
      alpha: 0.18 + Math.random() * 0.4
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    rainCanvas.width = Math.floor(width * dpr);
    rainCanvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.ceil(width / COL_WIDTH) + 1;
    columns = Array.from({ length: count }, makeColumn);

    ctx.font = `500 ${FONT_SIZE}px "Azeret Mono", ui-monospace, monospace`;
    ctx.textBaseline = "top";
  }

  function drawGlyphs() {
    ctx.font = `500 ${FONT_SIZE}px "Azeret Mono", ui-monospace, monospace`;
    ctx.textBaseline = "top";

    for (let i = 0; i < columns.length; i += 1) {
      const column = columns[i];
      const y = column.row * ROW_HEIGHT;

      if (y >= -ROW_HEIGHT && y <= height) {
        ctx.fillStyle = `rgba(139, 178, 255, ${column.alpha})`;
        ctx.fillText(Math.random() < 0.5 ? "0" : "1", i * COL_WIDTH, y);
      }

      column.row += column.speed;

      // Once a column runs off the bottom, park it above the fold again.
      if (y > height && Math.random() < 0.06) columns[i] = makeColumn();
    }
  }

  function step(now) {
    rafId = window.requestAnimationFrame(step);
    if (now - lastStep < STEP_MS) return;
    lastStep = now;

    // Fade what is already on the canvas without tinting it.
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";

    drawGlyphs();
  }

  function start() {
    if (rafId === null) rafId = window.requestAnimationFrame(step);
  }

  function stop() {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  resize();

  if (prefersReducedMotion) {
    // One static, sparse frame — texture without movement.
    for (let pass = 0; pass < 26; pass += 1) drawGlyphs();
  } else {
    start();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
  }

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resize();
      if (prefersReducedMotion) {
        for (let pass = 0; pass < 26; pass += 1) drawGlyphs();
      }
    }, 200);
  });
}
