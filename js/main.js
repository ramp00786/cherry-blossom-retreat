/*
 * Cherry Blossom Retreat — page interactions & GSAP scroll animations.
 */
(function () {
  const cfg = window.SITE_CONFIG || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.body.classList.add("is-loading");
  $("#year").textContent = new Date().getFullYear();

  /* ---------------- Config → page ---------------- */
  (function applyConfig() {
    const set = (key, text, href) => {
      $$(`[data-config="${key}"]`).forEach(el => {
        el.textContent = text;
        if (href && el.tagName === "A") el.href = href;
      });
    };
    if (cfg.address) set("address", cfg.address);
    if (cfg.timings) set("timings", cfg.timings);
    set("phone", cfg.phoneDisplay || cfg.phone || "+91 XXXXX XXXXX", cfg.phone ? `tel:+${cfg.phone}` : "#contact");
    if (cfg.email) set("email", cfg.email, `mailto:${cfg.email}`);
    else $$('[data-config="email"]').forEach(el => el.closest("li")?.remove());
    const wa = $("#whatsappFab");
    const waNumber = cfg.whatsapp || cfg.phone;
    if (waNumber) wa.href = `https://wa.me/${waNumber}?text=${encodeURIComponent("Hello! I'd like to enquire about a stay at Cherry Blossom Retreat.")}`;
    else wa.href = "#book";
  })();

  /* ---------------- Image fallback ---------------- */
  // fallback art gets a gentle colour shift per tile so the grid doesn't look repeated
  const hues = [["0deg", 1], ["-18deg", 1.1], ["24deg", .9], ["120deg", .55], ["-40deg", 1], ["200deg", .5]];
  $$(".frame img").forEach((img, i) => {
    const fail = () => {
      const fr = img.closest(".frame");
      fr.classList.add("img-missing");
      fr.style.setProperty("--hue", hues[i % hues.length][0]);
      fr.style.setProperty("--sat", hues[i % hues.length][1]);
    };
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
  });

  /* ---------------- Enquiry form → WhatsApp ---------------- */
  const today = new Date().toISOString().split("T")[0];
  $("#f-in").min = today;
  $("#f-out").min = today;
  $("#f-in").addEventListener("change", e => { $("#f-out").min = e.target.value; });
  $("#enquiry").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const msg = `Hello! I'd like to book a stay at Cherry Blossom Retreat.\n\nName: ${f.get("name")}\nCheck-in: ${f.get("checkin")}\nCheck-out: ${f.get("checkout")}\nGuests: ${f.get("guests")}`;
    const n = cfg.whatsapp || cfg.phone;
    const url = n ? `https://wa.me/${n}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener");
  });

  /* ---------------- Mobile menu ---------------- */
  const nav = $("#nav");
  $("#burger").addEventListener("click", () => nav.classList.toggle("menu-open"));

  /* ---------------- GSAP setup ---------------- */
  if (!window.gsap) { document.body.classList.remove("is-loading"); $("#preloader").remove(); return; }
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  // anchor links
  $$("[data-scroll]").forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (!id || !id.startsWith("#")) return;
    const target = id === "#top" ? 0 : $(id);
    if (id !== "#top" && !target) return;
    e.preventDefault();
    nav.classList.remove("menu-open");
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
    else gsap.to(window, { scrollTo: target, duration: 1.2, ease: "power3.inOut" });
  }));

  /* ---------------- Split helpers ---------------- */
  function splitChars(el) {
    const text = el.textContent;
    el.textContent = "";
    el.setAttribute("aria-label", text);
    [...text].forEach(ch => {
      const s = document.createElement("span");
      s.className = "char";
      s.setAttribute("aria-hidden", "true");
      s.textContent = ch === " " ? " " : ch;
      el.appendChild(s);
    });
    return $$(".char", el);
  }
  function splitWords(el) {
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement("span");
            w.className = "w";
            w.style.display = "inline-block";
            w.textContent = part;
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(el);
    return $$(".w", el);
  }
  // wrap each word in a mask so it can slide up
  function maskWords(el) {
    const words = splitWords(el);
    words.forEach(w => {
      const mask = document.createElement("span");
      mask.style.cssText = "display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em";
      w.replaceWith(mask);
      mask.appendChild(w);
    });
    return words;
  }

  /* ---------------- Preloader + hero intro ---------------- */
  const heroChars = $$(".hero__title .split").map(splitChars);
  gsap.set(heroChars.flat(), { yPercent: 115, rotate: 8 });
  gsap.set([".hero__eyebrow", ".hero__sub", ".hero__cta", ".hero__scroll", ".hero__coords"], { autoAlpha: 0, y: 30 });
  gsap.set(nav, { yPercent: -100 });

  const bar = $("#preloaderBar");
  let loadP = 0;
  const loadTimer = setInterval(() => { loadP = Math.min(loadP + Math.random() * 18, 90); bar.style.width = loadP + "%"; }, 120);

  function intro() {
    clearInterval(loadTimer);
    bar.style.width = "100%";
    const hero = window.HeroScene && window.HeroScene.state;
    const tl = gsap.timeline({ delay: 0.25, onComplete: () => { document.body.classList.remove("is-loading"); lenis && lenis.start(); } });
    tl.to("#preloader", { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" })
      .set("#preloader", { display: "none" });
    if (hero) {
      hero.intro = 0;
      tl.to(hero, { intro: 1, duration: 3, ease: "power3.out" }, "-=0.6");
    }
    tl.to(heroChars.flat(), { yPercent: 0, rotate: 0, duration: 1.3, ease: "expo.out", stagger: 0.035 }, hero ? "-=2.6" : "-=0.4")
      .to([".hero__eyebrow", ".hero__sub", ".hero__cta", ".hero__scroll", ".hero__coords"], { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, "-=0.9")
      .to(nav, { yPercent: 0, duration: 1, ease: "power3.out" }, "<");
  }
  $("#preloader").style.clipPath = "inset(0 0 0% 0)";
  if (document.readyState === "complete") setTimeout(intro, 600);
  else window.addEventListener("load", () => setTimeout(intro, 400));

  /* ---------------- Hero scroll ---------------- */
  if (window.HeroScene) {
    gsap.to(window.HeroScene.state, {
      progress: 1, wind: 3.5, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });
  }
  gsap.to(".hero__content", {
    yPercent: -30, autoAlpha: 0, ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "60% top", scrub: true }
  });
  gsap.to(".hero__veil", {
    backgroundColor: "rgba(12,26,23,.6)", ease: "none",
    scrollTrigger: { trigger: "#hero", start: "30% top", end: "bottom top", scrub: true }
  });

  /* ---------------- Nav state ---------------- */
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: self => {
      const y = self.scroll();
      nav.classList.toggle("is-scrolled", y > 60);
      if (!nav.classList.contains("menu-open")) nav.classList.toggle("is-hidden", y > lastY && y > window.innerHeight * 0.8);
      lastY = y;
      $("#whatsappFab").classList.toggle("show", y > window.innerHeight * 0.6);
    }
  });
  $$(".nav__links a").forEach(link => {
    const sec = $(link.getAttribute("href"));
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: "top 50%", end: "bottom 50%",
      onToggle: self => link.classList.toggle("active", self.isActive)
    });
  });

  /* ---------------- Generic reveals ---------------- */
  $$(".split-lines").forEach(el => {
    const words = maskWords(el);
    gsap.from(words, {
      yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.05,
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });

  $$(".reveal-words").forEach(el => {
    const words = splitWords(el);
    gsap.to(words, {
      opacity: 1, stagger: 0.08, ease: "none",
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true }
    });
  });

  $$(".eyebrow").forEach(el => gsap.from(el, {
    autoAlpha: 0, x: -20, duration: 0.9, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 90%" }
  }));

  ScrollTrigger.batch(".fade-up", {
    start: "top 88%",
    onEnter: els => gsap.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12, overwrite: true })
  });
  gsap.set(".fade-up", { autoAlpha: 0 });

  /* ---------------- Parallax images ---------------- */
  $$(".parallax-img").forEach(el => {
    const speed = parseFloat(el.dataset.speed || 10);
    gsap.fromTo(el, { yPercent: -speed / 2 }, {
      yPercent: speed / 2, ease: "none",
      scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true }
    });
    gsap.from(el, {
      clipPath: "inset(100% 0 0 0)", duration: 1.4, ease: "expo.inOut",
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });
  gsap.from(".about__badge", { scale: 0, rotate: -90, duration: 1.2, ease: "back.out(1.6)", scrollTrigger: { trigger: ".about__media", start: "top 60%" } });

  /* ---------------- Rooms ---------------- */
  gsap.from(".room", {
    y: 120, autoAlpha: 0, rotateX: -12, duration: 1.2, ease: "expo.out", stagger: 0.15,
    scrollTrigger: { trigger: ".rooms__grid", start: "top 80%" }
  });
  if (finePointer) {
    $$(".tilt").forEach(card => {
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
      });
      card.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
  }

  /* ---------------- Amenities ---------------- */
  gsap.from(".amenity", {
    autoAlpha: 0, y: 40, duration: 0.8, ease: "power3.out",
    stagger: { each: 0.06, grid: "auto", from: "start" },
    scrollTrigger: { trigger: ".amenities__grid", start: "top 80%" }
  });

  /* ---------------- Features ---------------- */
  gsap.from(".feature", {
    y: 30, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
    scrollTrigger: { trigger: ".features", start: "top 85%" }
  });

  /* ---------------- Gallery: pinned horizontal scroll ---------------- */
  const track = $("#galleryTrack");
  const pin = $(".gallery__pin");
  const mm = gsap.matchMedia();
  mm.add("(min-width: 0px)", () => {
    const getDist = () => Math.max(0, track.scrollWidth + $(".gallery__intro").offsetWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -getDist(), ease: "none",
      scrollTrigger: {
        trigger: "#gallery", start: "top top", end: () => "+=" + getDist(),
        pin: pin, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: self => { $("#galleryProgress").style.width = (self.progress * 100) + "%"; }
      }
    });
    $$(".g-item").forEach(item => {
      gsap.to($("img", item), {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: item, containerAnimation: tween, start: "left right", end: "right left", scrub: true }
      });
      gsap.from(item, {
        rotate: 4, yPercent: 10, ease: "none",
        scrollTrigger: { trigger: item, containerAnimation: tween, start: "left right", end: "center 60%", scrub: true }
      });
    });
  });

  /* ---------------- Timeline draw ---------------- */
  const path = $("#timelinePath");
  if (path) {
    gsap.fromTo(path, { strokeDasharray: 1000, strokeDashoffset: 1000 }, {
      strokeDashoffset: 0, ease: "none",
      scrollTrigger: { trigger: ".timeline", start: "top 65%", end: "bottom 65%", scrub: true }
    });
    $$(".t-item").forEach(item => {
      const right = item.classList.contains("t-item--right");
      gsap.from($(".t-card", item), { autoAlpha: 0, x: right ? -60 : 60, duration: 1, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 75%" } });
      gsap.from($(".t-time", item), { autoAlpha: 0, x: right ? 60 : -60, duration: 1, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 75%" } });
    });
  }

  /* ---------------- Stacked explore cards ---------------- */
  const cards = $$(".stack__card");
  cards.forEach((card, i) => {
    if (i === cards.length - 1) return;
    gsap.to(card, {
      scale: 0.9 + i * 0.015, filter: "brightness(.55)", ease: "none",
      scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 12%", scrub: true }
    });
  });
  cards.forEach(card => {
    gsap.from($(".stack__img img", card), { scale: 1.3, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true } });
  });

  /* ---------------- Reviews ---------------- */
  const scoreEl = $(".score__num");
  if (scoreEl) {
    const target = parseFloat(scoreEl.dataset.count);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: ".reviews", start: "top 70%", once: true,
      onEnter: () => {
        gsap.to(obj, { v: target, duration: 2, ease: "power3.out", onUpdate: () => { scoreEl.textContent = obj.v.toFixed(1); } });
        $(".bars").classList.add("is-in");
      }
    });
    gsap.from(".quote", {
      autoAlpha: 0, y: 50, rotate: 1.5, stagger: 0.15, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".reviews__quotes", start: "top 80%" }
    });
  }

  /* ---------------- Booking section ---------------- */
  gsap.from(".platform", {
    autoAlpha: 0, y: 50, stagger: 0.1, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".book__platforms", start: "top 85%" }
  });
  gsap.from(".enquiry", {
    autoAlpha: 0, y: 40, scale: 0.97, duration: 1.1, ease: "power3.out",
    scrollTrigger: { trigger: ".enquiry", start: "top 90%" }
  });

  /* ---------------- Footer ---------------- */
  gsap.from(".footer__big", {
    yPercent: 60, autoAlpha: 0, ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "top 40%", scrub: true }
  });

  /* ---------------- 2D petals in booking section ---------------- */
  (function bookPetals() {
    const c = $("#bookPetals");
    if (!c || reduceMotion) return;
    const ctx = c.getContext("2d");
    let w, h, dpr = Math.min(window.devicePixelRatio, 2), running = false;
    const items = Array.from({ length: 40 }, () => ({
      x: Math.random(), y: Math.random(), s: 6 + Math.random() * 10,
      v: 0.02 + Math.random() * 0.04, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 2, p: Math.random() * 6.28
    }));
    const size = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    window.addEventListener("resize", size);
    let last = performance.now();
    function draw(now) {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      ctx.clearRect(0, 0, w, h);
      items.forEach(it => {
        it.y += it.v * dt; it.p += dt; it.r += it.vr * dt;
        it.x += Math.sin(it.p) * 0.0008 + 0.01 * dt;
        if (it.y > 1.05) { it.y = -0.05; it.x = Math.random(); }
        if (it.x > 1.05) it.x = -0.05;
        ctx.save();
        ctx.translate(it.x * w, it.y * h);
        ctx.rotate(it.r);
        ctx.scale(1, Math.abs(Math.sin(it.p * 0.8)) * 0.6 + 0.4);
        ctx.fillStyle = "rgba(244,167,185,.55)";
        ctx.beginPath();
        ctx.moveTo(0, -it.s);
        ctx.bezierCurveTo(it.s * 0.9, -it.s * 0.6, it.s * 0.6, it.s * 0.8, 0, it.s);
        ctx.bezierCurveTo(-it.s * 0.6, it.s * 0.8, -it.s * 0.9, -it.s * 0.6, 0, -it.s);
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(draw);
    }
    ScrollTrigger.create({
      trigger: ".book", start: "top bottom", end: "bottom top",
      onToggle: self => { running = self.isActive; if (running) { last = performance.now(); requestAnimationFrame(draw); } }
    });
  })();

  /* ---------------- Cursor & magnetic buttons ---------------- */
  if (finePointer) {
    const cursor = $("#cursor"), dot = $("#cursorDot");
    const cx = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3" });
    const cy = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3" });
    window.addEventListener("pointermove", e => {
      cursor.classList.add("is-active"); dot.classList.add("is-active");
      cx(e.clientX); cy(e.clientY);
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    });
    $$("a, button, .room, .g-item, input, select").forEach(el => {
      el.addEventListener("pointerenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("pointerleave", () => cursor.classList.remove("is-hover"));
    });
    $$(".magnetic").forEach(btn => {
      const mx = gsap.quickTo(btn, "x", { duration: 0.5, ease: "elastic.out(1, .4)" });
      const my = gsap.quickTo(btn, "y", { duration: 0.5, ease: "elastic.out(1, .4)" });
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.3);
        my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      btn.addEventListener("pointerleave", () => { mx(0); my(0); });
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
