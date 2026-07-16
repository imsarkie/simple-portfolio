# Saravana Kumar J — Portfolio

Minimal, documentation-style personal portfolio. Plain HTML, CSS, and vanilla JS — no build step, no framework, no dependencies.

## Design

- Black text on white, no gradients, no glassmorphism.
- JetBrains Mono (Nerd Font) throughout.
- Smooth scroll between sections is the only animation, aside from a small hover lift/shadow on project cards.
- Links (in-content) are blue; nav links, the logo, and buttons stay black — buttons are styled as `[ Bracket Text ]` rather than filled UI buttons.

## Structure

```
index.html    all page content and section markup
styles.css    all styling
script.js     highlights the active nav link on scroll
```

Single page, anchor-linked sections in this order: Hero → About → Contact → Technologies → Backend Systems → AI Engineering → Featured Projects → Writing.

## Running locally

No build step — just serve the directory:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Or just open `index.html` directly in a browser.

## Customizing

- **Content**: edit the relevant `<section>` in `index.html`. Each section has an `id` matching its nav link (`#about`, `#backend`, etc.) — keep those in sync if you reorder sections or nav links.
- **Projects**: each card is an `<article class="project">` inside `.project-grid` in the `#projects` section. A `[ Code ]` button links to the GitHub repo; omit it for projects without a public repo.
- **Colors/fonts**: CSS custom properties are defined at the top of `styles.css` (`--text`, `--muted`, `--link`, `--line`, font stack on `body`).
- **Blog link**: the `#writing` section has a `[ Visit Blog ]` button with a placeholder `href="#"` — replace it with your blog URL.

## Deploying

Static files only — works as-is on GitHub Pages, Netlify, Vercel, or any static host. No build command needed.
