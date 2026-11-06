(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = (fn, opt) => ("IntersectionObserver" in window ? new IntersectionObserver(fn, opt) : null);

  // Name letters fade in one by one (delay index for CSS).
  document.querySelectorAll(".hname span").forEach((s, i) => s.style.setProperty("--i", i));

  // Fade-up on scroll; elements already scrolled past reveal too.
  const rv = io((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add("in"); rv.unobserve(e.target); } }, { rootMargin: "100000px 0px -6% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => (rv ? rv.observe(el) : el.classList.add("in")));

  // Count-up for the facts row.
  const loc = document.documentElement.lang === "en" ? "en-US" : "ru-RU";
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

  // Nav dots: highlight the section in the middle of the viewport.
  const dots = new Map([...document.querySelectorAll(".dots a")].map((a) => [a.getAttribute("href").slice(1), a]));
  const so = io((es) => {
    for (const e of es) if (e.isIntersecting) { dots.forEach((a) => a.classList.remove("on")); dots.get(e.target.id)?.classList.add("on"); }
  }, { rootMargin: "-50% 0px -50% 0px" });
  if (so) document.querySelectorAll("main > section[id]").forEach((s) => so.observe(s));

  // Scroll progress, batched in one rAF; writes only to the bar.
  const bar = document.querySelector(".progress span");
  let queued = false;
  const frame = () => {
    queued = false;
    const h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  };
  addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(frame); } }, { passive: true });
  frame();

  if (reduce) return;

  // Card glare follows the pointer, written only on the hovered card.
  if (matchMedia("(hover: hover)").matches) document.addEventListener("pointermove", (e) => {
    const c = e.target.closest && e.target.closest(".card"); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });
})();
