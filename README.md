# Portfolio — Akshay S Krishnan

Personal portfolio site. Plain HTML, CSS and JavaScript — no framework, no build step.

It is vibe-coded (built with AI assistance) and kept as an active frontend learning project:
I read what it produces, change it, and work out why it behaves the way it does.

**Live:** https://akshaysk7.github.io/portfolio-website/

The site leads with projects in progress, then finished work, then a compact **Now** panel
(using / learning / next, each pointing to where it's used) beside an interactive
Python-style terminal. There are no skill percentage bars.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All page content |
| `styles.css` | Styling, the six colour palettes, layout, animation, responsive rules |
| `script.js` | Nav, scroll progress, wordmark decode, 3D headline, reveal-on-scroll, boot sequence, interactive terminal, command palette (Ctrl/⌘ K), palette switching, copy-to-clipboard, 3D loss-surface background (pointer orbit, click to drop a run), card tilt |
| `build_resume.py` | Generates `assets/resume.pdf` |
| `assets/` | Monogram, portrait and the generated résumé |

## Running it locally

No build step — open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Updating the résumé

`assets/resume.pdf` is generated, so edit the script rather than the PDF:

```bash
pip install reportlab
python build_resume.py
```

## Updating content

Most edits are plain HTML in `index.html`:

- **Current focus / status** — the `.status-pill` in the hero
- **Projects in progress** — `#building`. The `.stages` list shows progress: add `is-done`
  to finished stages and `is-current` (with `aria-current="step"`) to the active one
- **Finished work** — `#shipped`
- **Now panel** — the `.stack-list` entries in `#now`; bump the "updated" date in its
  eyebrow whenever it changes
- **Terminal answers** — `REPL_COMMANDS` in `script.js` (keep it in step with the Now panel)
- **Command palette entries** — `PALETTE_COMMANDS` in `script.js`

## Colour palettes

Nine ship: Signal, Nebula, Phosphor, Tokyo Night, Ember, Volt, Arctic, Solar
Gold and Vaporwave. Each is a `:root[data-theme="…"]` block in `styles.css` that redefines
only colour tokens; `THEMES` in `script.js` names them. Visitors switch with Ctrl/⌘ K or
`theme("name")` in the terminal, and the choice is remembered.

**The default is Plum & Sky** (below), set by `data-theme="plum"` on `<html>` in
`index.html`, with its fonts (Rajdhani, Share Tech Mono) in the main Google Fonts `<link>`.
To change it, change that attribute, the `theme-color` meta, and the fonts in that link.
Signal is the base `:root` block, so a visitor who picks it gets no `data-theme` at all.

Six more come from the Theme Lab handoff: Klein Signal, Bone Print, Oxblood, Lilac Lab,
Plum & Sky and Steel Cobalt (three of them light). Their values are unchanged, mapped onto
this site's tokens, and each brings its own fonts (`FONT_CSS.lab`). While one is active the
handoff's rules apply: flat grounds with no glows, a notched primary button, uppercase
headings, and a 32px grid.

## Type pairings and looks

Seven type pairings: Newsreader (default serif), Inter Tight, Space Grotesk, Sora, Syne,
Chakra Petch and Outfit. Each is a `:root[data-font="…"]` block in `styles.css`; its
Google Fonts request lives in `FONT_CSS` in the `<head>` script and is only fetched once
that pairing is used. `LOOKS` in `script.js` pairs each font with palettes that suit it.

To compare looks, open the site with `#demo` on the URL (or "Compare looks" in Ctrl/⌘ K,
or `look()` in the terminal). A switcher appears bottom right: ← → to step, "auto" to cycle.
To make a look the default, copy its `data-font` block into `:root` and add that font to
the `<link>` in `<head>`.

## Notes

- Animation is gated behind `prefers-reduced-motion`, which skips the boot sequence and
  the typing and reveal transitions, and shows the background as a single still frame.
- The layout is responsive down to ~360px; the nav collapses to a menu below 780px.
