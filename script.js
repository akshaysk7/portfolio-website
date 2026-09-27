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
        const element = entry.target;
        element.classList.add("is-visible");
        revealObserver.unobserve(element);

        // Once it has risen in (the transition takes 0.9s), drop the reveal
        // classes so the element carries no transform and hover effects can
        // use their own. A timer, because transitionend never fires if the
        // page isn't rendering at the time.
        window.setTimeout(() => element.classList.remove("reveal", "is-visible"), 1000);
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

/* ---------- palettes ----------
   The palettes themselves are [data-theme] blocks in styles.css; this list
   names them and gives each a swatch (ground, structure, live, action) for
   the command palette and the terminal. */

const THEMES = [
  { id: "signal", name: "Signal", note: "black · blue · green · red", swatch: ["#05070a", "#4ea8ff", "#3fbf7f", "#ff4d4d"] },
  { id: "nebula", name: "Nebula", note: "indigo · cyan · violet", swatch: ["#06070f", "#22d3ee", "#34d399", "#c084fc"] },
  { id: "phosphor", name: "Phosphor", note: "CRT green · amber", swatch: ["#040806", "#39ff88", "#9dff6a", "#ffb000"] },
  { id: "tokyo", name: "Tokyo Night", note: "navy · periwinkle · rose", swatch: ["#0d0e16", "#7aa2f7", "#9ece6a", "#ff7a93"] },
  { id: "ember", name: "Ember", note: "charcoal · orange · crimson", swatch: ["#0b0706", "#ff8a3d", "#ffd166", "#ff3d57"] },
  { id: "volt", name: "Volt", note: "black · lime · magenta", swatch: ["#070707", "#c6ff00", "#00e5ff", "#ff3cac"] },
  { id: "arctic", name: "Arctic", note: "ice blue · mint · white", swatch: ["#060a10", "#9be7ff", "#5eead4", "#f8fafc"] },
  { id: "solar", name: "Solar Gold", note: "gold · sage · flame", swatch: ["#0a0906", "#f5c542", "#8bd17c", "#ff6b35"] },
  { id: "vapor", name: "Vaporwave", note: "pink · cyan · purple", swatch: ["#0c0717", "#ff71ce", "#01cdfe", "#b967ff"] },
  // Theme Lab handoff: each brings its own fonts, which override any type pairing.
  { id: "klein", name: "Klein Signal", note: "blue · cream · coral-red", fonts: "Chakra Petch · IBM Plex Mono", lab: true, swatch: ["#1c2bc9", "#ffa593", "#f2efe6", "#ff5b45"] },
  { id: "bone", name: "Bone Print", note: "paper · ink · vermilion", fonts: "Chakra Petch · JetBrains Mono", lab: true, swatch: ["#e7e2d6", "#1c1a17", "#645d53", "#b8221a"] },
  { id: "oxblood", name: "Oxblood", note: "wine · cream · salmon", fonts: "Tomorrow · Space Mono", lab: true, swatch: ["#2a1013", "#f0e2cf", "#e6c8ad", "#f08a74"] },
  { id: "lilac", name: "Lilac Lab", note: "lilac · indigo · red", fonts: "Oxanium · Kode Mono", lab: true, swatch: ["#dcd5ec", "#3a2ec4", "#d93a2b", "#1d1638"] },
  { id: "plum", name: "Plum & Sky", note: "plum · powder blue · orchid", fonts: "Rajdhani · Share Tech Mono", lab: true, swatch: ["#23152b", "#9ec5ff", "#d8b4e8", "#efe6f0"] },
  { id: "steel", name: "Steel Cobalt", note: "steel grey · cobalt", fonts: "Chakra Petch · Saira · IBM Plex Mono", lab: true, swatch: ["#c4cbd3", "#1740d6", "#0f141b", "#46505e"] }
];

/* ---------- type pairings ----------
   [data-font] blocks in styles.css; the web fonts themselves are fetched by
   loadFontCSS (in the <head> script) the first time a pairing is used. */

const FONTS = [
  { id: "editorial", name: "Newsreader", note: "serif · IBM Plex Mono" },
  { id: "inter", name: "Inter Tight", note: "Inter · JetBrains Mono" },
  { id: "grotesk", name: "Space Grotesk", note: "Inter · JetBrains Mono" },
  { id: "sora", name: "Sora", note: "Sora · IBM Plex Mono" },
  { id: "syne", name: "Syne", note: "Manrope · Space Mono" },
  { id: "chakra", name: "Chakra Petch", note: "IBM Plex Sans · Share Tech Mono" },
  { id: "outfit", name: "Outfit", note: "Outfit · DM Mono" }
];

// Looks: a type pairing with the palettes that suit it.
const LOOKS = [
  // Theme Lab themes set their own fonts, so these clear any type pairing.
  { font: "editorial", theme: "klein", mood: "Theme Lab" },
  { font: "editorial", theme: "bone", mood: "Theme Lab, light" },
  { font: "editorial", theme: "oxblood", mood: "Theme Lab" },
  { font: "editorial", theme: "lilac", mood: "Theme Lab, light" },
  { font: "editorial", theme: "plum", mood: "Theme Lab" },
  { font: "editorial", theme: "steel", mood: "Theme Lab, light" },
  { font: "inter", theme: "signal", mood: "professional" },
  { font: "inter", theme: "tokyo", mood: "professional, softer" },
  { font: "grotesk", theme: "nebula", mood: "futuristic" },
  { font: "grotesk", theme: "volt", mood: "futuristic, loud" },
  { font: "sora", theme: "arctic", mood: "clean and calm" },
  { font: "sora", theme: "nebula", mood: "clean, a little sci-fi" },
  { font: "syne", theme: "volt", mood: "bold" },
  { font: "syne", theme: "vapor", mood: "bold, playful" },
  { font: "chakra", theme: "phosphor", mood: "sci-fi HUD" },
  { font: "chakra", theme: "arctic", mood: "sci-fi, cooler" },
  { font: "outfit", theme: "ember", mood: "warm modern" },
  { font: "outfit", theme: "solar", mood: "warm, golden" },
  { font: "editorial", theme: "signal", mood: "the original" }
];

const root = document.documentElement;
const themeMeta = document.querySelector('meta[name="theme-color"]');
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function currentTheme() {
  return THEMES.find((theme) => theme.id === root.dataset.theme) || THEMES[0];
}

// The cursors are SVG images and can't read CSS variables, so they are
// redrawn in the palette's colours whenever it changes.
function paintCursors() {
  if (!finePointer) return;
  const style = getComputedStyle(root);
  const accent = style.getPropertyValue("--accent").trim();
  const bg = style.getPropertyValue("--bg").trim();
  const text = style.getPropertyValue("--text").trim();
  const image = (body) =>
    `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>${body}</svg>`
    )}") 16 16`;
  const cross = "M16 4v7M16 21v7M4 16h7M21 16h7";
  const ticks = "M16 1v5M16 26v5M1 16h5M26 16h5";
  const probe =
    `<path d='${cross}' stroke='${bg}' stroke-opacity='.7' stroke-width='3' stroke-linecap='round'/>` +
    `<path d='${cross}' stroke='${accent}' stroke-width='1.25' stroke-linecap='round'/>` +
    `<circle cx='16' cy='16' r='2' fill='${text}' stroke='${bg}' stroke-width='1'/>`;
  const link =
    `<circle cx='16' cy='16' r='10' fill='${accent}' fill-opacity='.14' stroke='${bg}' stroke-opacity='.7' stroke-width='3'/>` +
    `<circle cx='16' cy='16' r='10' fill='none' stroke='${accent}' stroke-width='1.25'/>` +
    `<path d='${ticks}' stroke='${bg}' stroke-opacity='.7' stroke-width='3' stroke-linecap='round'/>` +
    `<path d='${ticks}' stroke='${accent}' stroke-width='1.25' stroke-linecap='round'/>` +
    `<circle cx='16' cy='16' r='2' fill='${text}'/>`;
  root.style.setProperty("--cursor-probe", `${image(probe)}, crosshair`);
  root.style.setProperty("--cursor-link", `${image(link)}, pointer`);
}

function applyTheme(id, { announce = false } = {}) {
  const theme = THEMES.find((entry) => entry.id === id);
  if (!theme) return null;

  if (theme.id === "signal") delete root.dataset.theme;
  else root.dataset.theme = theme.id;
  try {
    localStorage.setItem("theme", theme.id);
  } catch (error) {
    // private mode or blocked storage: the palette just won't be remembered
  }

  if (theme.lab) window.loadFontCSS?.("lab");
  themeMeta?.setAttribute("content", theme.swatch[0]);
  paintCursors();
  document.dispatchEvent(new CustomEvent("themechange"));
  if (announce) showToast(`Palette → ${theme.name}`);
  return theme;
}

themeMeta?.setAttribute("content", currentTheme().swatch[0]);
if (currentTheme().id !== "signal") paintCursors();

function currentFont() {
  return FONTS.find((font) => font.id === root.dataset.font) || FONTS[0];
}

function applyFont(id, { announce = false } = {}) {
  const font = FONTS.find((entry) => entry.id === id);
  if (!font) return null;

  window.loadFontCSS?.(font.id);
  if (font.id === "editorial") delete root.dataset.font;
  else root.dataset.font = font.id;
  try {
    localStorage.setItem("font", font.id);
  } catch (error) {
    // not remembered, that's all
  }

  document.dispatchEvent(new CustomEvent("themechange"));
  if (announce) showToast(`Type → ${font.name}`);
  return font;
}

// A Theme Lab theme carries its own fonts, so it goes by its own name.
const lookName = (look) => {
  const theme = THEMES.find((t) => t.id === look.theme);
  return theme.lab ? theme.name : `${FONTS.find((f) => f.id === look.font).name} × ${theme.name}`;
};

function applyLook(index, { announce = false } = {}) {
  const look = LOOKS[index];
  if (!look) return null;
  applyFont(look.font);
  applyTheme(look.theme);
  if (announce) showToast(`Look → ${lookName(look)}`);
  document.dispatchEvent(new CustomEvent("lookchange", { detail: index }));
  return look;
}

/* ---------- toast + copy ---------- */

const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-shown");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-shown"), 2200);
}

const EMAIL = "akshaysk2007@gmail.com";
const GITHUB = "https://github.com/akshaysk7";
const LINKEDIN = "https://www.linkedin.com/in/akshay-s-krishnan-1968092a7/";

async function copyText(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`${label} copied`);
  } catch (error) {
    // No clipboard access (old browser, insecure origin): show it instead.
    showToast(text);
  }
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyText(button.dataset.copy, "Email address"));
});

function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
}

/* ---------- boot sequence ----------
   A short start-up log, once per visit. The <head> script decides whether
   it plays (it never does with reduced motion) and covers the page until
   this takes over. Any key or click skips it. */

if (root.classList.contains("is-booting")) {
  const BOOT_LINES = [
    [["pp", ">>> "], ["", "import akshay"]],
    [["dim", "loading projects .... "], ["ok", "1 in progress"]],
    [["dim", "loading shipped ..... "], ["ok", "3 shipped"]],
    [["dim", "loading now() ....... "], ["ok", "python · dsa · ml"]],
    [["pp", ">>> "], ["", "akshay.render()"]]
  ];

  const boot = document.createElement("div");
  boot.className = "boot";
  boot.setAttribute("aria-hidden", "true");
  const frame = document.createElement("div");
  const log = document.createElement("pre");
  const bar = document.createElement("span");
  bar.className = "boot-bar";
  frame.append(log, bar);
  boot.append(frame);
  document.body.append(boot);

  let line = 0;
  let timer = null;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(timer);
    try {
      sessionStorage.setItem("booted", "1");
    } catch (error) {
      // it will simply play again next time
    }
    root.classList.remove("is-booting");
    boot.classList.add("is-done");
    window.setTimeout(() => boot.remove(), 700);
    window.removeEventListener("keydown", finish);
    window.removeEventListener("pointerdown", finish);
  };

  const step = () => {
    BOOT_LINES[line].forEach(([cls, text]) => {
      const span = document.createElement("span");
      if (cls) span.className = cls;
      span.textContent = text;
      log.append(span);
    });
    log.append("\n");
    line += 1;
    bar.style.setProperty("--p", String(line / BOOT_LINES.length));
    timer = window.setTimeout(line < BOOT_LINES.length ? step : finish, line < BOOT_LINES.length ? 230 : 420);
  };

  window.addEventListener("keydown", finish);
  window.addEventListener("pointerdown", finish);
  timer = window.setTimeout(step, 120);
}

/* ---------- interactive terminal ----------
   A small Python-flavoured REPL. It types akshay.now() by itself when it
   first scrolls into view; after that visitors can type, or click one of
   the suggested commands underneath. Output is built from DOM nodes, never
   from HTML strings, so nothing typed into it is ever parsed as markup. */

const replBody = document.getElementById("replBody");
const replOut = document.getElementById("replOut");
const replForm = document.getElementById("replForm");
const replInput = document.getElementById("replInput");

// One output line. Parts are plain strings or { text, cls, href }.
function print(content = "", cls = "") {
  const line = document.createElement("div");
  if (cls) line.className = cls;
  (Array.isArray(content) ? content : [content]).forEach((part) => {
    if (typeof part === "string") {
      line.append(part);
      return;
    }
    const node = document.createElement(part.href ? "a" : "span");
    node.textContent = part.text;
    if (part.cls) node.className = part.cls;
    if (part.href) {
      node.href = part.href;
      if (!part.href.startsWith("#") && !part.href.startsWith("mailto:")) {
        node.target = "_blank";
        node.rel = "noreferrer";
      }
    }
    line.append(node);
  });
  replOut.append(line);
  replBody.scrollTop = replBody.scrollHeight;
}

const key = (text) => ({ text, cls: "key" });
const str = (text) => ({ text: `'${text}'`, cls: "out" });
const comment = (text) => print(`# ${text}`, "cmt");

const REPL_COMMANDS = {
  help() {
    print("available commands:", "out");
    [
      ["akshay.now()", "what I'm on right now"],
      ["projects()", "building and shipped"],
      ["stack()", "tools, and where each is used"],
      ["contact()", "ways to reach me"],
      ["resume()", "the PDF"],
      ["themes()", "colour palettes for this site"],
      ['theme("volt")', "switch palette"],
      ["fonts()", "type pairings"],
      ["looks()", "type + palette combos"],
      ["whoami()", "the short version"],
      ["clear()", "clear the screen"]
    ].forEach(([command, what]) => print(["  ", key(command.padEnd(15)), " ", what]));
    comment("plain arithmetic works too, like a real REPL");
  },

  now() {
    print("{");
    print(["  ", key("'building'"), ": ", str("Premier League match predictor (feature engineering)"), ","]);
    print(["  ", key("'learning'"), ": ", str("DSA in Python (arrays, daily)"), ","]);
    print(["  ", key("'next'"), ":     ", str("Django (Dev to Deployment)"), ","]);
    print(["  ", key("'studying'"), ": [", str("OS"), ", ", str("COA"), ", ", str("DSA"), "],"]);
    print("}");
  },

  projects() {
    print(["[", { text: "building", cls: "out" }, "] ", { text: "Premier League Match Predictor", href: "#pl-predictor" }, "  feature engineering"]);
    print(["[", { text: "shipped", cls: "key" }, "]  ", { text: "College Document Q&A (RAG)", href: "#rag" }, "      team project, under review"]);
    print(["[", { text: "shipped", cls: "key" }, "]  ", { text: "Telegram scheduler bot", href: "#scheduler-bot" }, "          posts twice a week"]);
    print(["[", { text: "shipped", cls: "key" }, "]  ", { text: "This portfolio", href: "#this-site" }, "                  you're in it"]);
  },

  stack() {
    print([key("using   "), " → Python, pandas, scikit-learn, embeddings, vector DB, LLM APIs, Telegram Bot API"]);
    print([key("learning"), " → DSA in Python, ML by building, HTML/CSS/JS"]);
    print([key("next    "), " → Django"]);
    comment("no percentage bars. see the Now section for where each is used");
  },

  contact() {
    print([key("email   "), "  ", { text: EMAIL, href: `mailto:${EMAIL}` }]);
    print([key("github  "), "  ", { text: "github.com/akshaysk7", href: GITHUB }]);
    print([key("linkedin"), "  ", { text: "Akshay S Krishnan", href: LINKEDIN }]);
  },

  resume() {
    print(["→ ", { text: "assets/resume.pdf", href: "assets/resume.pdf" }]);
  },

  themes() {
    const active = currentTheme().id;
    THEMES.forEach((theme) =>
      print([theme.id === active ? "* " : "  ", key(`"${theme.id}"`.padEnd(11)), " ", theme.note])
    );
    comment('switch with theme("name"), or press Ctrl K');
  },

  fonts() {
    const active = currentFont().id;
    FONTS.forEach((font) =>
      print([font.id === active ? "* " : "  ", key(`"${font.id}"`.padEnd(12)), " ", `${font.name} · ${font.note}`])
    );
    comment('switch with font("sora"), or try looks()');
  },

  looks() {
    LOOKS.forEach((look, index) => print([key(String(index + 1).padStart(2)), "  ", lookName(look), "  ", { text: look.mood, cls: "cmt" }]));
    comment("open the switcher with look(), or look(3) for one");
  },

  look() {
    openDock();
    print("look switcher open, bottom right. ← → to step", "out");
  },

  whoami() {
    print("Akshay S Krishnan: 2nd year B.Tech CSE (AI & ML), SRM Ramapuram, Chennai. Python first.", "out");
  },

  akshay() {
    print(["<Student ", str("Akshay S Krishnan"), " focus=", str("Python"), " status=", str("building"), ">"]);
  },

  ls() {
    ["building", "shipped", "now", "education", "contact"].forEach((id) =>
      print([{ text: `${id}/`, href: `#${id}` }])
    );
  },

  "import this"() {
    print("The Zen of Python, by Tim Peters", "out");
    print("Beautiful is better than ugly.");
    print("Explicit is better than implicit.");
    print("Simple is better than complex.");
    comment("...the other sixteen are in your own interpreter");
  },

  hire() {
    print("[sudo] permission granted. opening contact()...", "out");
    REPL_COMMANDS.contact();
    window.setTimeout(() => goTo("contact"), 900);
  },

  exit() {
    print("Use contact() instead. I'd rather you stayed.", "out");
  },

  python() {
    print("You're already in it.", "out");
  },

  clear() {
    replOut.textContent = "";
  }
};

const REPL_ALIASES = {
  quit: "exit",
  cls: "clear",
  python3: "python",
  "sudo hire akshay": "hire",
  "hire akshay": "hire",
  "akshay.whoami": "whoami"
};

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : String(parseFloat(value.toPrecision(12)));
}

function runCommand(raw) {
  const input = raw.trim();
  print([{ text: ">>> ", cls: "pp" }, input]);
  if (!input) return;

  const printCall = input.match(/^print\(\s*(["'])(.*)\1\s*\)$/);
  if (printCall) {
    print(printCall[2]);
    return;
  }

  const themeCall = input.match(/^theme\(\s*["']?([\w-]+)["']?\s*\)$/i) || input.match(/^theme\s+([\w-]+)$/i);
  if (themeCall) {
    const theme = applyTheme(themeCall[1].toLowerCase());
    if (theme) print(`palette → ${theme.name} (${theme.note})`, "out");
    else print(`ValueError: no palette called '${themeCall[1]}'. Try themes()`, "err");
    return;
  }

  const fontCall = input.match(/^font\(\s*["']?([\w-]+)["']?\s*\)$/i) || input.match(/^font\s+([\w-]+)$/i);
  if (fontCall) {
    const font = applyFont(fontCall[1].toLowerCase());
    if (font) print(`type → ${font.name} (${font.note})`, "out");
    else print(`ValueError: no font called '${fontCall[1]}'. Try fonts()`, "err");
    return;
  }

  const lookCall = input.match(/^look\(\s*(\d+)\s*\)$/i);
  if (lookCall) {
    const index = Number(lookCall[1]) - 1;
    if (applyLook(index)) print(`look → ${lookName(LOOKS[index])}`, "out");
    else print(`IndexError: looks run from 1 to ${LOOKS.length}`, "err");
    return;
  }

  // Arithmetic: digits and operators only, so this can't run anything else.
  if (/^[\d\s+\-*/().%]+$/.test(input) && /\d/.test(input)) {
    try {
      const value = Function(`"use strict"; return (${input});`)();
      if (typeof value !== "number" || Number.isNaN(value)) throw new SyntaxError();
      if (!Number.isFinite(value)) print("ZeroDivisionError: division by zero", "err");
      else print(formatNumber(value), "out");
    } catch (error) {
      print("SyntaxError: invalid syntax", "err");
    }
    return;
  }

  let name = input.replace(/;$/, "").replace(/\(\s*\)$/, "").trim().toLowerCase();
  name = REPL_ALIASES[name] || name;
  if (!REPL_COMMANDS[name]) name = REPL_ALIASES[name.replace(/^akshay\./, "")] || name.replace(/^akshay\./, "");

  if (REPL_COMMANDS[name]) {
    REPL_COMMANDS[name]();
    return;
  }

  const identifier = input.match(/^[A-Za-z_]\w*/);
  print(
    identifier ? `NameError: name '${identifier[0]}' is not defined` : "SyntaxError: invalid syntax",
    "err"
  );
  comment("try help()");
}

if (replForm && replInput && replOut && replBody) {
  const history = [];
  let historyIndex = 0;
  let typingTimer = null;

  const stopTyping = () => {
    window.clearTimeout(typingTimer);
    typingTimer = null;
  };

  const submit = (value) => {
    stopTyping();
    runCommand(value);
    if (value.trim()) {
      history.push(value.trim());
      historyIndex = history.length;
    }
    replInput.value = "";
  };

  // Types a command into the prompt one character at a time, then runs it.
  const typeCommand = (command, speed = 45) => {
    stopTyping();
    if (prefersReducedMotion) {
      submit(command);
      return;
    }
    replInput.value = "";
    let index = 0;
    const tick = () => {
      replInput.value = command.slice(0, index + 1);
      index += 1;
      typingTimer = index < command.length ? window.setTimeout(tick, speed) : window.setTimeout(() => submit(command), 260);
    };
    tick();
  };

  replForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submit(replInput.value);
  });

  replInput.addEventListener("keydown", (event) => {
    if (typingTimer) stopTyping();
    if (event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      replInput.value = history[historyIndex];
    } else if (event.key === "ArrowDown" && history.length) {
      event.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      replInput.value = history[historyIndex] || "";
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      REPL_COMMANDS.clear();
    }
  });

  document.querySelectorAll("[data-cmd]").forEach((button) => {
    button.addEventListener("click", () => {
      typeCommand(button.dataset.cmd, 22);
      // Don't pop the on-screen keyboard on phones.
      if (finePointer) replInput.focus({ preventScroll: true });
    });
  });

  // Clicking anywhere in the screen puts the caret in the prompt, unless
  // the visitor is selecting text or following a link.
  replBody.addEventListener("click", (event) => {
    if (event.target.closest("a") || String(window.getSelection())) return;
    replInput.focus({ preventScroll: true });
  });

  let introduced = false;
  const introduce = () => {
    if (introduced) return;
    introduced = true;
    comment("python3 · akshay.py. Type help(), or click a command below");
    window.setTimeout(() => typeCommand("akshay.now()"), prefersReducedMotion ? 0 : 500);
  };

  if ("IntersectionObserver" in window) {
    const introObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        introObserver.disconnect();
        introduce();
      },
      { threshold: 0.3 }
    );
    introObserver.observe(replBody);
  } else {
    introduce();
  }
}

/* ---------- command palette ----------
   Ctrl/Cmd + K (or the button in the header) opens a searchable list of
   sections, actions and palettes. Arrow keys move, Enter runs, Esc closes.
   Picking a palette keeps the list open so they can be compared. */

const palette = document.getElementById("palette");
const paletteInput = document.getElementById("paletteInput");
const paletteList = document.getElementById("paletteList");
const paletteButton = document.getElementById("paletteButton");

const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
document.querySelectorAll("#paletteKey, .footer-key").forEach((element) => {
  element.textContent = isMac ? "⌘ K" : "Ctrl K";
});

function downloadResume() {
  const link = document.createElement("a");
  link.href = "assets/resume.pdf";
  link.download = "";
  link.click();
}

const PALETTE_COMMANDS = [
  { group: "Go to", label: "Building", hint: "01 · currently building", run: () => goTo("building") },
  { group: "Go to", label: "Shipped", hint: "02", run: () => goTo("shipped") },
  { group: "Go to", label: "Now", hint: "03 · using, learning, next", run: () => goTo("now") },
  { group: "Go to", label: "Education", hint: "04", run: () => goTo("education") },
  { group: "Go to", label: "Contact", hint: "05", run: () => goTo("contact") },
  {
    group: "Go to",
    label: "Open the terminal",
    hint: ">>>",
    run: () => {
      goTo("now");
      window.setTimeout(() => replInput?.focus({ preventScroll: true }), prefersReducedMotion ? 0 : 700);
    }
  },
  { group: "Actions", label: "Copy email address", hint: EMAIL, run: () => copyText(EMAIL, "Email address") },
  { group: "Actions", label: "Download résumé", hint: "PDF", run: downloadResume },
  { group: "Actions", label: "Open GitHub", hint: "@akshaysk7", run: () => window.open(GITHUB, "_blank", "noopener") },
  { group: "Actions", label: "Open LinkedIn", hint: "Akshay S Krishnan", run: () => window.open(LINKEDIN, "_blank", "noopener") },
  { group: "Actions", label: "Compare looks", hint: "type + palette switcher", run: () => openDock() },
  ...LOOKS.map((look, index) => ({
    group: "Look",
    label: lookName(look),
    hint: look.mood,
    swatch: THEMES.find((t) => t.id === look.theme).swatch,
    look: index,
    run: () => applyLook(index, { announce: true })
  })),
  ...FONTS.map((font) => ({
    group: "Type",
    label: font.name,
    hint: font.note,
    font: font.id,
    run: () => applyFont(font.id, { announce: true })
  })),
  ...THEMES.map((theme) => ({
    group: "Palette",
    label: theme.name,
    hint: theme.note,
    swatch: theme.swatch,
    theme: theme.id,
    run: () => applyTheme(theme.id, { announce: true })
  }))
];

if (palette && paletteInput && paletteList) {
  let matches = [];
  let selected = 0;
  let returnFocus = null;

  const syncSelection = () => {
    paletteList.querySelectorAll(".palette-item").forEach((item) => {
      const isSelected = item.id === `cmd-${selected}`;
      item.setAttribute("aria-selected", String(isSelected));
      if (isSelected) item.scrollIntoView({ block: "nearest" });
    });
    if (matches.length) paletteInput.setAttribute("aria-activedescendant", `cmd-${selected}`);
    else paletteInput.removeAttribute("aria-activedescendant");
  };

  const render = () => {
    const terms = paletteInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    matches = PALETTE_COMMANDS.filter((command) => {
      const haystack = `${command.group} ${command.label} ${command.hint} ${command.theme ? "theme colour color" : ""} ${command.font ? "font typeface" : ""} ${command.look !== undefined ? "look style font theme" : ""}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
    selected = Math.min(selected, Math.max(matches.length - 1, 0));
    paletteList.textContent = "";

    if (!matches.length) {
      const empty = document.createElement("li");
      empty.className = "palette-empty";
      empty.setAttribute("role", "presentation");
      empty.textContent = "Nothing matches. Try “theme”, “email” or a section name.";
      paletteList.append(empty);
      syncSelection();
      return;
    }

    const active = currentTheme().id;
    let group = null;
    matches.forEach((command, index) => {
      if (command.group !== group) {
        group = command.group;
        const heading = document.createElement("li");
        heading.className = "palette-group";
        heading.setAttribute("role", "presentation");
        heading.textContent = group;
        paletteList.append(heading);
      }

      const item = document.createElement("li");
      item.className = "palette-item";
      item.id = `cmd-${index}`;
      item.setAttribute("role", "option");

      if (command.swatch) {
        const swatch = document.createElement("span");
        swatch.className = "palette-swatch";
        command.swatch.slice(1).forEach((colour) => {
          const dot = document.createElement("i");
          dot.style.background = colour;
          swatch.append(dot);
        });
        item.append(swatch);
      }

      item.append(command.label);
      const hint = document.createElement("small");
      const isCurrent =
        (command.theme && command.theme === active) ||
        (command.font && command.font === currentFont().id) ||
        (command.look !== undefined && LOOKS[command.look].font === currentFont().id && LOOKS[command.look].theme === active);
      hint.textContent = isCurrent ? "current" : command.hint;
      item.append(hint);

      item.addEventListener("pointermove", () => {
        if (selected === index) return;
        selected = index;
        syncSelection();
      });
      item.addEventListener("click", () => run(index));
      paletteList.append(item);
    });

    syncSelection();
  };

  const open = () => {
    if (!palette.hidden) return;
    returnFocus = document.activeElement;
    palette.hidden = false;
    paletteInput.value = "";
    selected = 0;
    render();
    paletteInput.focus();
    closeNav();
  };

  const close = () => {
    if (palette.hidden) return;
    palette.hidden = true;
    returnFocus?.focus?.({ preventScroll: true });
  };

  const run = (index) => {
    const command = matches[index];
    if (!command) return;
    if (command.theme || command.font || command.look !== undefined) {
      command.run();
      render();
      paletteInput.focus();
      return;
    }
    close();
    command.run();
  };

  paletteButton?.addEventListener("click", open);
  palette.querySelector("[data-close]")?.addEventListener("click", close);
  paletteInput.addEventListener("input", () => {
    selected = 0;
    render();
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (palette.hidden) open();
      else close();
      return;
    }
    if (palette.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!matches.length) return;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      selected = (selected + direction + matches.length) % matches.length;
      syncSelection();
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(selected);
    } else if (event.key === "Tab") {
      // The search field is the only stop inside the dialog.
      event.preventDefault();
      paletteInput.focus();
    }
  });
}

/* ---------- look dock ----------
   A floating switcher for comparing looks. It opens with #demo in the URL
   or from "Compare looks" in the command palette. Arrow keys step through
   looks while it's open (unless you're typing somewhere), and "auto" cycles
   them every few seconds. */

const dock = document.getElementById("dock");

function openDock() {
  if (!dock) return;
  // Comparing means switching fast, so fetch every pairing's fonts up front.
  Object.keys(window.FONT_CSS || {}).forEach((id) => window.loadFontCSS(id));
  dock.hidden = false;
  document.dispatchEvent(new CustomEvent("dockopen"));
}

if (dock) {
  const dockName = document.getElementById("dockName");
  const dockMeta = document.getElementById("dockMeta");
  const dockCount = document.getElementById("dockCount");
  const dockDots = document.getElementById("dockDots");
  const dockPlay = document.getElementById("dockPlay");
  let current = -1;
  let playTimer = null;

  // Which look is showing now, if the current font and palette match one.
  const matchCurrent = () =>
    LOOKS.findIndex((look) => look.font === currentFont().id && look.theme === currentTheme().id);

  LOOKS.forEach((look, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", lookName(look));
    dot.title = lookName(look);
    dot.addEventListener("click", () => show(index));
    dockDots.append(dot);
  });

  const paint = () => {
    current = matchCurrent();
    const font = currentFont();
    const theme = currentTheme();
    dockName.textContent = theme.lab ? theme.name : `${font.name} × ${theme.name}`;
    dockMeta.textContent = theme.lab
      ? `${theme.fonts} · Theme Lab`
      : `${font.note} · ${current >= 0 ? LOOKS[current].mood : theme.note}`;
    dockCount.textContent = current >= 0 ? `${current + 1} / ${LOOKS.length}` : "custom";
    [...dockDots.children].forEach((dot, index) =>
      dot.setAttribute("aria-current", String(index === current))
    );
  };

  function show(index) {
    const next = (index + LOOKS.length) % LOOKS.length;
    applyLook(next);
    paint();
  }

  // From a custom mix, "next" starts at the first look and "prev" at the last.
  const step = (direction) =>
    show(current < 0 ? (direction > 0 ? 0 : LOOKS.length - 1) : current + direction);

  const setPlaying = (on) => {
    window.clearInterval(playTimer);
    playTimer = on ? window.setInterval(() => step(1), 3500) : null;
    dockPlay.setAttribute("aria-pressed", String(on));
  };

  document.getElementById("dockPrev").addEventListener("click", () => { setPlaying(false); step(-1); });
  document.getElementById("dockNext").addEventListener("click", () => { setPlaying(false); step(1); });
  dockPlay.addEventListener("click", () => setPlaying(dockPlay.getAttribute("aria-pressed") !== "true"));
  document.getElementById("dockClose").addEventListener("click", () => {
    setPlaying(false);
    dock.hidden = true;
  });

  document.addEventListener("keydown", (event) => {
    if (dock.hidden || event.target.closest("input, textarea")) return;
    if (event.key === "ArrowRight") { setPlaying(false); step(1); }
    else if (event.key === "ArrowLeft") { setPlaying(false); step(-1); }
  });

  document.addEventListener("themechange", paint);
  document.addEventListener("dockopen", paint);
  paint();

  if (/demo/.test(window.location.hash + window.location.search)) openDock();
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

/* ---------- 3D loss surface ----------
   A made-up loss surface drawn as a wireframe in perspective, turning
   slowly, with a few gradient-descent runs (momentum plus a little noise)
   rolling down into its valleys. The surface is fixed in world space; each
   frame turns the camera, projects the grid and batches the lines into
   depth bands so the far side fades into the dark. */

const surfaceCanvas = document.getElementById("landscape");

if (surfaceCanvas && surfaceCanvas.getContext) {
  const ctx = surfaceCanvas.getContext("2d");

  // Colours come from the palette in styles.css: read at startup and again
  // whenever the palette changes (see readColours below).
  let LINE_RGB = "";
  let TRAIL_RGB = "";
  let MONO = "ui-monospace, monospace";
  let BAND_STYLES = [];
  let TRAIL_STYLES = [];

  const GRID = 34; // vertices per side
  const EXTENT = 2; // the surface spans -EXTENT..EXTENT world units
  const PITCH = 0.42; // camera elevation, radians
  const DISTANCE = 4.2; // camera distance from the centre
  const SPIN = 0.03; // radians per second
  const FOG_BANDS = 8;
  const RUNS = 3;
  const MAX_RUNS = 5; // the looping runs plus any dropped in by clicking
  const TRAIL = 110; // points of history kept per run
  const TRAIL_BANDS = 5; // a trail fades in a few steps, one stroke each
  const STEP_MS = 60; // one optimiser step per tick
  const FRAME_MS = 45; // ~22fps is plenty for something turning this slowly
  const MAX_DPR = 1; // faint 1px lines don't need a retina-sized canvas
  const LR = 0.0022;
  const MOMENTUM = 0.9;
  const NOISE = 0.0008;

  const vertexCount = GRID * GRID;
  const coords = Float32Array.from({ length: GRID }, (_, i) => (i / (GRID - 1)) * 2 * EXTENT - EXTENT);
  const vertexZ = new Float32Array(vertexCount);
  const screenX = new Float32Array(vertexCount);
  const screenY = new Float32Array(vertexCount);
  const depths = new Float32Array(vertexCount);

  // Build the stroke styles once per palette, not per frame. Bands run from
  // the near colour to the far one, fading as they go, so a palette can send
  // the far side of the surface into another colour.
  function readColours() {
    const styles = getComputedStyle(document.documentElement);
    LINE_RGB = styles.getPropertyValue("--plot-line").trim() || "78, 168, 255";
    const lineFarRGB = styles.getPropertyValue("--plot-line-far").trim() || LINE_RGB;
    TRAIL_RGB = styles.getPropertyValue("--plot-trail").trim() || "255, 255, 255";
    MONO = styles.getPropertyValue("--mono").trim() || MONO;
    const nearRGB = LINE_RGB.split(",").map(Number);
    const farRGB = lineFarRGB.split(",").map(Number);

    BAND_STYLES = Array.from({ length: FOG_BANDS }, (_, b) => {
      const t = b / (FOG_BANDS - 1);
      const rgb = nearRGB.map((c, i) => Math.round(c + (farRGB[i] - c) * t)).join(", ");
      return `rgba(${rgb}, ${(0.32 - t * 0.26).toFixed(3)})`;
    });
    TRAIL_STYLES = Array.from(
      { length: TRAIL_BANDS },
      (_, b) => `rgba(${TRAIL_RGB}, ${(((b + 1) / TRAIL_BANDS) * 0.85).toFixed(3)})`
    );
  }

  readColours();
  document.addEventListener("themechange", () => {
    readColours();
    if (prefersReducedMotion) render();
  });

  let width = 0;
  let height = 0;
  let focal = 1;
  let centerX = 0;
  let centerY = 0;
  let yaw = 0.6;
  let cosYaw = 1;
  let sinYaw = 0;
  // The camera orbits a little toward the pointer and tilts with scroll.
  let yawOffset = 0;
  let pitch = PITCH;
  let cosPitch = Math.cos(PITCH);
  let sinPitch = Math.sin(PITCH);
  let pointerX = 0.5; // 0..1 across the viewport
  let pointerY = 0.5;
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
    const depth = DISTANCE + y * cosPitch - z * sinPitch;
    const up = y * sinPitch + z * cosPitch;
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

  function startRunAt(run, u, v, wait) {
    Object.assign(run, { u, v, vu: 0, vv: 0, step: 0, still: 0, wait, done: false });
    run.trail = [[u, v, heightOf(lossAt(u, v))]];
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
    startRunAt(run, best.u, best.v, wait);
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
      ctx.fillStyle = `rgba(${TRAIL_RGB}, 1)`;
      ctx.beginPath();
      ctx.arc(hx, hy, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(${LINE_RGB}, 0.9)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(hx, hy, 6.5, 0, Math.PI * 2);
      ctx.stroke();

      // The first run reports what an optimiser would: its step and loss.
      if (index === 0) {
        const value = Math.max(0, (lossAt(run.u, run.v) - low) / (high - low || 1));
        ctx.font = `400 11px ${MONO}`;
        ctx.fillStyle = `rgba(${TRAIL_RGB}, 0.7)`;
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
    cosYaw = Math.cos(yaw + yawOffset);
    sinYaw = Math.sin(yaw + yawOffset);
    cosPitch = Math.cos(pitch);
    sinPitch = Math.sin(pitch);
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

    // Ease the camera toward the pointer (a small orbit, like dragging a 3D
    // plot) and look further down onto the surface as the page scrolls.
    const scrollTilt = Math.min(window.scrollY / 2400, 1) * 0.14;
    yawOffset += ((pointerX - 0.5) * 0.5 - yawOffset) * 0.08;
    pitch += (PITCH + (pointerY - 0.5) * 0.1 + scrollTilt - pitch) * 0.08;

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

    // Mouse and trackpad users steer the camera; touch screens keep the
    // plain slow turn. The handler only records where the pointer is.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      window.addEventListener(
        "pointermove",
        (event) => {
          if (!width || !height) return;
          pointerX = event.clientX / width;
          pointerY = event.clientY / height;
        },
        { passive: true }
      );
      document.documentElement.addEventListener("pointerleave", () => {
        pointerX = 0.5;
        pointerY = 0.5;
      });

      // Click open space to drop your own optimiser onto the surface. It
      // starts from the grid point nearest the click and takes over the
      // readout; the oldest run makes way once there are too many.
      document.addEventListener("click", (event) => {
        if (!width || event.target.closest("a, button, input, .hero-portrait, .terminal, .stack, .project, .contact-card, .palette")) return;
        if (String(window.getSelection())) return;

        let nearest = -1;
        let nearestDistance = 45 * 45;
        for (let k = 0; k < vertexCount; k += 1) {
          const dx = screenX[k] - event.clientX;
          const dy = screenY[k] - event.clientY;
          const distance = dx * dx + dy * dy;
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = k;
          }
        }
        if (nearest < 0) return;

        const run = {};
        startRunAt(run, coords[nearest % GRID], coords[Math.floor(nearest / GRID)], 0);
        runs.unshift(run);
        if (runs.length > MAX_RUNS) runs.pop();
      });
    }

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

/* ---------- project card tilt ----------
   Project cards lean toward the pointer in 3D with a soft light following
   it (see .tilt in styles.css). Mouse and trackpad only, never with reduced
   motion. Browsers deliver pointermove at most once per frame, and each
   event just writes four custom properties. */

if (!prefersReducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".tilt").forEach((card) => {
    let rect = null;

    card.addEventListener("pointerenter", () => {
      rect = card.getBoundingClientRect();
      card.classList.add("is-tilting");
    });

    card.addEventListener("pointermove", (event) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty("--ry", `${((x / rect.width - 0.5) * 6).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${((0.5 - y / rect.height) * 6).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${Math.round(x)}px`);
      card.style.setProperty("--my", `${Math.round(y)}px`);
    });

    card.addEventListener("pointerleave", () => {
      rect = null;
      card.classList.remove("is-tilting");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });

    // Scrolling moves the card under a still pointer, so measure again.
    window.addEventListener("scroll", () => { rect = null; }, { passive: true });
  });
}
