# MEMORY.md

Project memory: what has been built, what the client asked for, and why
things are the way they are. Newest entries at the bottom of each section.
Working rules for future changes are in [CLAUDE.md](CLAUDE.md).

## Client and property

- **Property:** Cherry Blossom Retreat, homestay, Kollam, Kerala.
- **Owner/contact (client):** D Rajiv (sends feedback via WhatsApp to the developer).
- **Developer (user):** Tulsiram Kushwah, GitHub `ramp00786`.
- **Address:** Souparnika, Kairali Nagar-135 A, Elavanthi, Killikollur PO,
  Apsara Junction, Kollam-691004. Google plus code VJW9+6C6 Ammannada.
- **Phones:** +91 90373 73688 (business, WhatsApp), +91 96000 19704.
- **Check-in** from 12:00 PM, **check-out** until 11:00 AM (Agoda listing).
- **Ratings (Nov 2026):** Google 5.0 (42 reviews), MakeMyTrip 4.7/5,
  Agoda 9.7/10 "Exceptional" (cleanliness, facilities, service 10; value 9; location 9).
- **Listings:** Booking.com, Agoda (hotel id 91406834), MakeMyTrip, Google Maps.
- **Nearby:** Kollam Railway Station 3.2 km, Rameshwara Temple 590 m,
  Thangasseri 2.6 km, Infant Jesus Cathedral 4.2 km, RP Mall 5.2 km,
  Kollam Beach ~12 min, Thangassery Lighthouse ~18 min,
  Ashtamudi Lake 4.2 km (~10 min, per client; Google said 38 min, which was wrong),
  Munroe Island ~55 min.

## Original brief

Single-page website for the homestay. Hero built with **three.js**, scroll
animations with **GSAP**, modern animated UI. Images to come from the
property's Google, Booking.com, Agoda and MakeMyTrip pages.

## Timeline of work

1. **First version.** Static site with a three.js hero (sunset over a
   backwater, palm silhouettes, Chinese fishing net, falling petals,
   fireflies), GSAP ScrollTrigger + Lenis, sections: About, highlights,
   Rooms, Amenities, pinned horizontal Gallery, "A day here" timeline,
   stacked Explore Kollam cards, Booking (platform links + WhatsApp
   enquiry form), Contact + Google Map, footer. Libraries vendored in
   `vendor/`. The network was blocked at first, so images were placeholders.
2. **Real photos.** After the network was opened: 19 photos from Booking.com
   (needed the signed `?k=` URL), 5 from Agoda. MakeMyTrip returned a blank
   page. Content updated from the Agoda listing (facilities, timings,
   9.7 score, quotes). Explore Kollam photos from Wikimedia Commons
   (credited in footer).
3. **Google.** Google Maps photo viewer would not open headless; Google
   Hotels gave mostly other businesses' photos. Kept from Google: the
   night signboard photo (gallery "Find Our Sign"), 5.0 rating, two review
   quotes, drive times, plus code.
4. **Git/deploy.** Created `main` from the working branch. GitHub Pages
   enabled by pushing a `gh-pages` branch (+ `.nojekyll`); the `gh` CLI
   token in the container was invalid, so settings could not be changed.
5. **Client update 1 (19 Oct 2026).** New address, business phone
   9037373688, "Kollam Railway Station 3.2 km", two owner photos (house at
   dusk with dancers). Dusk photo → About; night photo → first gallery item;
   both also in the gallery. Owner said to leave the signboard photos as they are.
6. **Backgrounds.** User asked for a cherry blossom background like a Google
   Images search. Those were stock images, so CC0 photos from Wikimedia
   Commons (Ian Schneider, Simon Launay; Unsplash uploads) were used behind
   the timeline, reviews and booking sections.
7. **Client update 2 (20 Oct 2026).**
   - Mobile pictures not showing properly: on phones the gallery is now a
     swipe carousel (the pinned scroll hid photos behind the intro text),
     Explore cards no longer stick/darken, About photos are larger.
     **Desktop was not touched** (client had no desktop complaints).
   - Keep both numbers: 9037373688 and 9600019704.
   - Ashtamudi Lake is 4.2 km / 10–11 min, not 38 min.
   - Slogan "A Quiet Sanctuary in the Heart of Kerala" replaces
     "Your Kerala story begins here".
8. **Other session (Nov 2026, branch `claude/gracious-shannon-9xb2ls` and
   commits on `main`):** hero title sizing fixes for laptop screens; review
   wall with 50 real reviews in `js/reviews.js` (scrolls, pauses on hover);
   Google count 42 and MakeMyTrip 4.7 added; softer Explore card dimming on
   desktop; all photos re-encoded about 40% smaller.
9. **18 Nov 2026.** Added this `MEMORY.md` and `CLAUDE.md`.

## Decisions and gotchas

- Fabricated reviews, ratings or prices are never added; everything shown is
  from the listings or the client.
- Stock images from Google Images are not used (copyright). Wikimedia
  Commons CC0/CC BY/CC BY-SA only, with credits.
- The owner photos look edited; their signboards show different numbers.
  Client explicitly said to keep them unchanged.
- three.js is loaded as the UMD `three.min.js` (r160) so the site also works
  when opened as a file; it logs a deprecation warning, which is expected.
- `background-attachment: fixed` is off on touch devices and phones (iOS
  does not support it); phones get the `-sm` background images.
- Wikimedia rate-limits downloads (HTTP 429). Retry slowly, and check that a
  retry did not reuse the previous file's bytes (compare md5).
- Branches: `claude/focused-euler-vchx43` (original working branch), `main`,
  `gh-pages` (served by Pages), `claude/gracious-shannon-9xb2ls` (another session).

## Open items

- No email address yet: the Email row in Contact is hidden until
  `email` is set in `js/config.js`.
- Optional: switch GitHub Pages source to `main` in repo Settings → Pages,
  then the `gh-pages` branch can be retired.
