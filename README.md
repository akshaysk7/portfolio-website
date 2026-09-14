# Portfolio — Akshay S Krishnan

Personal portfolio site. Plain HTML, CSS and JavaScript — no framework, no build step.

It is vibe-coded (built with AI assistance) and kept as an active frontend learning project:
I read what it produces, change it, and work out why it behaves the way it does.

**Live:** https://akshaysk7.github.io/portfolio-website/

The site is organised around what I'm working on *right now* rather than a static list of
skills: a Python-focused "Right now" section, projects currently in progress, and then
finished work.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All page content |
| `styles.css` | Styling, layout, animation, responsive rules |
| `script.js` | Nav, scroll progress, wordmark decode, 3D headline, reveal-on-scroll, typed terminal, 3D loss-surface background (pointer orbit, click to drop a run), terminal and card tilt |
| `build_resume.py` | Generates `assets/resume.pdf` |
| `assets/` | Monogram and the generated résumé |

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

- **Current focus / status** — the `.status-pill` in the hero, and the `#now` section
- **Learning tracks** — `.track-card` blocks; the `.chip` class sets the status label
  (`chip-live` = amber, `chip-next` = grey)
- **Projects in progress** — `#building`
- **Finished work** — `#shipped`
- **Terminal animation** — the `TERMINAL_LINES` array in `script.js`

## Notes

- Animation is gated behind `prefers-reduced-motion`, which disables the typing and reveal
  transitions and shows the background as a single still frame.
- The layout is responsive down to ~360px; the nav collapses to a menu below 780px.
