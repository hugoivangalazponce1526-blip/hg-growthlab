# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Landing page estática para **HG Growth Lab**, agencia digital chilena (hg-growthlab.cl). No hay framework ni bundler: todo el proyecto es un único archivo `index.html` con HTML, CSS y JS vanilla.

## Running locally

Open `index.html` directly in a browser — no server required. For a quick local server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Deployment

**Docker + EasyPanel:**
```bash
docker build -t hg-growthlab .
docker run -p 80:80 hg-growthlab
```
The `Dockerfile` copies all files into an `nginx:alpine` image served on port 80.

**GitHub Pages:** The `CNAME` file pins the custom domain `hg-growthlab.cl`.

## Architecture

Everything lives in `index.html`. The key layers inside the file:

| Layer | Where |
|---|---|
| Tailwind config (dark mode, custom color tokens, fonts, spacing) | `<script id="tailwind-config">` in `<head>` |
| Custom CSS (animations, glassmorphism, bento card glow, range inputs) | `<style>` block in `<head>` |
| Page sections | `<main>`: Hero → Services (bento grid) → Calculator → Testimonials carousel → CTA |
| All JS logic | `<script>` at end of `<body>` |

**Tailwind** is loaded via CDN (`cdn.tailwindcss.com?plugins=forms,container-queries`) — there is no local `node_modules` or build step.

**Color system:** Material Design 3 dark-mode tokens (e.g. `primary`, `secondary`, `surface-dim`, `on-surface-variant`) defined in the Tailwind config. Primary = blue (`#b9c3ff` / `#0047ff`), secondary = gold (`#e9c349`).

**Contact form** posts to `https://api.web3forms.com/submit` with the access key hardcoded in `submitForm()`. The `.env.example` documents the key for reference, but since this is a static page the key is embedded directly in the HTML (Web3Forms keys are public-facing by design).

**Local assets:** `logo-cascada.png` and `logo-sobreruedas.png` are referenced by testimonial cards. Hero/nav logos use an external Google CDN URL.

## Key JS functions

- `calculateSavings()` — reads three range sliders (employees, hours/week, cost/hr) and updates annual savings display
- `openModal(defaultService)` / `closeModal()` / `submitForm(event)` — contact modal lifecycle
- `toggleMobileMenu()` — mobile hamburger nav
- Testimonial carousel IIFE — auto-advances every 5 s, supports swipe and dot/arrow navigation
- Bento card `mousemove` handler — sets `--mouse-x`/`--mouse-y` CSS vars for the radial glow border effect
