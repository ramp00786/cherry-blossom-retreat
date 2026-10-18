# Cherry Blossom Retreat — Homestay in Kollam, Keralam

A single-page website with a **three.js** hero (backwater sunset, palm silhouettes, a Chinese fishing net and falling cherry-blossom petals) and **GSAP ScrollTrigger** scroll animations, with Lenis for smooth scrolling.

## Run locally

It's a plain static site with no build step. Serve the folder with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Customise

- **Contact details:** edit `js/config.js` (phone, WhatsApp number, email, address, check-in/out times).
- **Photos:** drop them into `images/`. The file names are listed in [`images/README.md`](images/README.md).
- **Rooms / amenities / text:** edit `index.html` directly.

## Structure

```
index.html        page markup
css/style.css     styles (responsive, reduced-motion aware)
js/config.js      site/contact configuration
js/hero.js        three.js hero scene
js/main.js        GSAP + ScrollTrigger animations, Lenis, interactions
vendor/           three.js r160, GSAP 3.12.5 (+ScrollTrigger, ScrollToPlugin), Lenis 1.1.13
images/           property photos (see images/README.md)
```

## Sections

Preloader → 3D hero → marquee → About → highlights → Rooms (3D tilt cards) → Amenities → pinned horizontal Gallery → "A day here" timeline (line drawn on scroll) → Explore Kollam (stacked sticky cards) → Booking (platform links + WhatsApp enquiry form) → Contact & map → Footer.
