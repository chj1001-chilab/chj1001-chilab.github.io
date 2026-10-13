# Heejung Choi — Academic Homepage

A single-page academic homepage for PhD applications (biomedical informatics / clinical
machine learning). Static HTML/CSS/JS — no build step, no dependencies.

## Files
| File | Purpose |
|------|---------|
| `index.html` | The page |
| `styles.css` | Design system (matches the CV: white canvas, navy `#162d50` headings and rules, link blue `#143c82`, bordered cards; dark/light themes) |
| `script.js` | Theme toggle, active-section nav, scroll reveal |
| `favicon.svg` | Site icon |
| `cv.pdf` | Linked CV (replace with the latest version) |
| `.nojekyll` | Tells GitHub Pages to skip Jekyll and serve files as-is |

## Deploy on GitHub Pages

### Option A — personal site at `https://<username>.github.io`
1. Create a **public** repo named exactly `chj1001.github.io` (use your GitHub username).
2. Copy every file in this folder into the repo root and push to `main`.
3. GitHub → repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`. Save.
4. Live in ~1 minute at `https://chj1001.github.io`.

### Option B — project site under an existing repo
1. Push these files to a repo (root or a `/docs` folder).
2. Settings → Pages → Source: `main` + `/ (root)` (or `/docs`).
3. Live at `https://<username>.github.io/<repo>/`.

## Customize
- **Contact / links** — email, Google Scholar, and LinkedIn are in the hero and `#contact`
  blocks of `index.html`. Update if any change.
- **CV** — replace `cv.pdf`; the filename is referenced in `index.html`.
- **Accent color** — change `--accent` / `--link` in `styles.css` (`:root` plus both
  theme overrides).
- **Add a photo** — drop an image in the folder and reference it from the hero if desired.
- **Google Scholar ID** — currently `7rXrAecAAAAJ`; edit if needed.

## Notes
- Typography uses the SF Pro system stack on Apple devices; Inter loads from Google Fonts as
  the cross-platform fallback.
- Scroll reveals respect `prefers-reduced-motion`.
- Themes follow the OS setting by default; the toggle in the nav overrides and remembers the
  choice.
