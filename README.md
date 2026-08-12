# Bharat Yogansh — Portfolio

**`index.html`** is the site — a single-page portfolio with real content (no placeholder copy
anywhere) and genuine polish, but built on plain, reliable document scroll. No scroll-hijacking,
no "scroll a mile to see the next thing" — you scroll normally and things animate in as they
arrive.

## What's in it

- **Scroll progress bar** — thin bar at the very top tracking overall page position.
- **Hero spotlight** — a soft radial glow that follows the mouse behind the hero text (desktop
  only, skipped on touch devices and when `prefers-reduced-motion` is set).
- **Animated gradient name** — the hero heading slowly cycles through the accent colors.
- **Staggered reveals** — sections fade/slide in on scroll via `IntersectionObserver`; cards
  within a section (skills, projects, education, contact) stagger in one after another instead of
  all at once.
- **Card tilt** — project cards tilt subtly toward the cursor on hover (desktop only).
- **Active nav highlighting** — the nav link for whichever section is currently in view gets an
  underline, updated live as you scroll.
- Everything above degrades gracefully: touch devices and `prefers-reduced-motion` skip the
  cursor-based effects entirely, and reveals still work with instant transitions.

## Content

Same 4 real projects, same real metrics, same skills/education/certifications as before:

- Live ML Model Health Monitor — R²=0.57, MAE $12,341
- News Topic Classification & Analytics Dashboard — 85.8% accuracy, 0.856 macro F1
- IoT Device Management & OTA Orchestration
- SkillSwap — atomic MongoDB escrow, real integration tests

## Files

- `index.html` / `style.css` / `script.js` — the main site (this is what you'd deploy)
- `mission.html` / `mission.css` / `mission.js` — an experimental scroll-driven "mission control"
  concept (animated starfield, HUD chrome, panel-per-project). Parked for now — the scroll length
  per section was too long and content wasn't landing well — but not deleted, in case it's worth
  revisiting later. Linked quietly from the footer, not from the main nav.

The earlier 3D "voyage" version (Three.js city/park scene) has been removed completely, along
with the old duplicate `classic.*` files — nothing references them anymore.

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. Plain HTML/CSS/JS, no build step — double-clicking `index.html`
also works, since nothing here uses ES modules or a 3D engine.

## Deploying

GitHub Pages serves straight from the `main` branch (Settings → Pages → Source: `main` / root).
Push to `main` and the live site updates within a minute or two.

## Notes

I can't screenshot this myself while building it. Tag balance, JS syntax, and every ID/class the
scripts reference against the markup have been checked programmatically, but the actual look and
feel — spotlight intensity, tilt amount, stagger timing — needs your eyes. Run it and tell me
what to tune.
