(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = (fn, opt) => ("IntersectionObserver" in window ? new IntersectionObserver(fn, opt) : null);

  // Name letters fade in one by one (delay index for CSS).
  document.querySelectorAll(".hname span").forEach((s, i) => s.style.setProperty("--i", i));

  // Fade-up on scroll; elements already scrolled past reveal too.
  const rv = io((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add("in"); rv.unobserve(e.target); } }, { rootMargin: "100000px 0px -6% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => (rv ? rv.observe(el) : el.classList.add("in")));

  // Count-up for the facts row.
  const loc = root.lang === "en" ? "en-US" : "ru-RU";
  const fmt = (n) => n.toLocaleString(loc).replace(/\s/g, " ");
  const cu = io((es) => {
    for (const e of es) if (e.isIntersecting) {
      cu.unobserve(e.target);
      const el = e.target, to = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "", t0 = performance.now();
      const tick = (t) => { const k = Math.min(1, (t - t0) / 1400), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
        el.textContent = pre + fmt(v) + suf; if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  if (cu && !reduce) document.querySelectorAll("[data-count]").forEach((el) => cu.observe(el));

  // Terminal: lines appear one by one while visible, then loop.
  const log = document.querySelector(".term-log");
  if (log) {
    const lines = [...log.children];
    if (reduce) lines.forEach((l) => l.classList.add("on"));
    else {
      let i = 0, timer = 0;
      const step = () => {
        if (i < lines.length) { lines[i++].classList.add("on"); timer = setTimeout(step, 650); }
        else timer = setTimeout(() => { lines.forEach((l) => l.classList.remove("on")); i = 0; timer = setTimeout(step, 600); }, 4000);
      };
      const to = io((es) => { for (const e of es) { clearTimeout(timer); if (e.isIntersecting) step(); } }, { threshold: 0.4 });
      to ? to.observe(log) : lines.forEach((l) => l.classList.add("on"));
    }
  }

  // Top nav: highlight the section in the middle of the viewport.
  const links = new Map([...document.querySelectorAll('.nav > a[href^="#"]')].map((a) => [a.getAttribute("href").slice(1), a]));
  const so = io((es) => {
    for (const e of es) if (e.isIntersecting) {
      links.forEach((a) => { a.classList.remove("on"); a.removeAttribute("aria-current"); });
      const a = links.get(e.target.id);
      if (a) { a.classList.add("on"); a.setAttribute("aria-current", "true"); }
    }
  }, { rootMargin: "-50% 0px -50% 0px" });
  if (so) document.querySelectorAll("main > section[id]").forEach((s) => so.observe(s));

  // Phone menu: the nav becomes a full-screen list.
  const btn = document.querySelector(".menu-btn");
  const setMenu = (open) => {
    root.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? btn.dataset.close : btn.dataset.open;
  };
  if (btn) {
    btn.addEventListener("click", () => setMenu(!root.classList.contains("menu-open")));
    document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    addEventListener("keydown", (e) => { if (e.key === "Escape" && root.classList.contains("menu-open")) { setMenu(false); btn.focus(); } });
    matchMedia("(min-width: 861px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });
  }

  // Screenshot viewers: tabs with arrow-key support.
  document.querySelectorAll("[data-viewer]").forEach((v) => {
    const tabs = [...v.querySelectorAll('[role="tab"]')];
    const show = (i, focus) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).classList.toggle("on", on);
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(i));
      t.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) { e.preventDefault(); show((i + d + tabs.length) % tabs.length, true); }
      });
    });
  });

  // Lightbox: any screenshot opens full size.
  const lb = document.querySelector(".lb");
  if (lb && lb.showModal) {
    const img = lb.querySelector("img");
    document.addEventListener("click", (e) => {
      const z = e.target.closest && e.target.closest("[data-zoom]");
      if (!z) return;
      const src = z.querySelector("img");
      img.src = z.dataset.zoom;
      img.alt = src ? src.alt : "";
      lb.showModal();
    });
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target === img) lb.close(); });
  } else document.querySelectorAll("[data-zoom]").forEach((z) => { z.style.cursor = "default"; });

  // Scroll: progress bar and the solid top bar, batched in one rAF.
  const bar = document.querySelector(".progress span");
  let queued = false, solid = null;
  const frame = () => {
    queued = false;
    const y = scrollY, h = root.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    const s = y > 24;
    if (s !== solid) { solid = s; root.classList.toggle("scrolled", s); }
  };
  addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(frame); } }, { passive: true });
  frame();
})();
