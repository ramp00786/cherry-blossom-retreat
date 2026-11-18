# CLAUDE.md

Guidance for Claude (and humans) working on this repository. The full history
of client requests and decisions is in [MEMORY.md](MEMORY.md); read it before
changing content.

## Project

Single-page marketing website for **Cherry Blossom Retreat**, a homestay in
Kollam, Kerala. Plain static site, no build step.

- Live: https://ramp00786.github.io/cherry-blossom-retreat/
- Repo: https://github.com/ramp00786/cherry-blossom-retreat
- The user talks in Hinglish (Hindi in Latin script). Reply in Hinglish; keep
  code, comments and commit messages in English.

## Stack and files

| Path | What it is |
|---|---|
| `index.html` | All page markup and sections |
| `css/style.css` | All styles. Mobile fixes live in `@media (max-width: 768px)` blocks near the end |
| `js/config.js` | Address, phone numbers, WhatsApp, email, check-in/out. Filled into the page by `main.js` |
| `js/hero.js` | three.js hero scene (sunset backwater, palms, fishing net, petals) |
| `js/main.js` | GSAP + ScrollTrigger animations, Lenis smooth scroll, gallery, reviews, cursor, WhatsApp form |
| `js/reviews.js` | 50 real guest reviews (Google / MakeMyTrip / Agoda) for the auto-scrolling review wall |
| `vendor/` | three.js r160 (`three.min.js`, global `THREE`), GSAP 3.12.5 + ScrollTrigger + ScrollToPlugin, Lenis 1.1.13. Vendored on purpose: no CDN dependency |
| `images/` | Site photos. `images/README.md` lists every file, where it appears and its source/licence |

## Run and check

```bash
python3 -m http.server 8765   # then open http://localhost:8765
```

Before pushing, load the page in Playwright (Chromium is preinstalled at
`/opt/pw-browsers`; launch with `--use-gl=angle --use-angle=swiftshader
--enable-unsafe-swiftshader` so WebGL works headless) at **1440×900** and
**iPhone 13** emulation, and confirm:

- no `pageerror` and no 4xx for local files
- `document.querySelectorAll('.img-missing').length === 0` (an image failed to load)
- `document.documentElement.scrollWidth - innerWidth === 0` (no horizontal overflow)
- screenshots of the sections you touched look right

When stopping the test server, use `pkill -f "http.server 876[5]"`; a plain
pattern matches the pkill command itself and kills the shell.

## Rules from the client (do not break)

1. **Desktop design is approved. Do not change it** unless the client asks.
   Mobile-only fixes go inside `@media (max-width: 768px)`; JS behaviour that
   differs by screen uses `gsap.matchMedia()` with `(min-width: 769px)` /
   `(max-width: 768px)`.
2. **Phone numbers:** show both `+91 90373 73688` (primary/business, also
   WhatsApp) and `+91 96000 19704`. Edit them only in `js/config.js` (`phones`).
3. **Address:** `Souparnika, Kairali Nagar-135 A, Elavanthi, Killikollur PO,
   Apsara Junction, Kollam-691004`.
4. **Distances the client gave:** Kollam Railway Station 3.2 km; Ashtamudi Lake
   4.2 km (~10 min drive).
5. **Booking slogan:** "A Quiet Sanctuary in the Heart of Kerala".
6. **Signboard photos stay as they are** (gallery "Find Our Sign" and the two
   owner photos with dancers), even though their signs show other numbers.
7. Use only real facts and real reviews (from the listings or the client).
   Do not invent ratings, reviews, amenities or prices.
8. Images: use the property's own photos, the client's photos, or freely
   licensed ones (CC0 / CC BY / CC BY-SA from Wikimedia Commons). Never copy
   stock images (Shutterstock, Adobe Stock, Freepik, Pngtree...). Credit
   CC BY / CC BY-SA photos in the footer and in `images/README.md`.

## Deploying

GitHub Pages serves the **`gh-pages`** branch (`.nojekyll` is present). Keep
`main`, `gh-pages` and the working branch on the same commit:

```bash
git fetch origin && git merge origin/main      # others push to main too
for b in main gh-pages; do git push origin HEAD:refs/heads/$b; done
```

After changing a CSS or JS file, bump its `?v=N` query in `index.html` so
returning visitors get the new file. Pages redeploys in about a minute; check
with `curl -s "https://ramp00786.github.io/cherry-blossom-retreat/?nc=$RANDOM"`.

## Conventions

- Match the existing code style: two-space indent, section banner comments
  (`/* ---------- name ---------- */`), CSS variables from `:root`.
- New images: resize/compress with Pillow (≈1400–2000px wide, JPEG q≈72–84,
  progressive), add them to `images/README.md`.
- Commit messages: short imperative subject, body explaining what and why.
