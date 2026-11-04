(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = (fn, opt) => ("IntersectionObserver" in window ? new IntersectionObserver(fn, opt) : null);

  // Fade-up on scroll. Content stays visible without JS (.js gate); elements already passed reveal too.
  const els = document.querySelectorAll(".stats, .head, .map .tier, .proj, .grid3 > *, .grid2 > *, .results > *, .steps > *, .term, .two-col > *, .cta");
  const rv = io((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add("in"); rv.unobserve(e.target); } }, { rootMargin: "100000px 0px -6% 0px" });
  if (rv) els.forEach((el) => {
    const sib = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
    el.style.setProperty("--d", `${Math.min(sib, 5) * 70}ms`);
    el.classList.add("rv"); rv.observe(el);
  });

  // Count-up for the stats row.
  const loc = document.documentElement.lang === "en" ? "en-US" : "ru-RU";
  const fmt = (n) => n.toLocaleString(loc).replace(/ /g, " ");
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

  // Terminal: lines appear one by one when visible, then loop.
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

  // Systems spine: pulse travel distance = map height (measured on resize only).
  const map = document.querySelector(".map");
  if (map && "ResizeObserver" in window) new ResizeObserver(() => map.style.setProperty("--mh", map.offsetHeight + "px")).observe(map);

  if (reduce) return;

  // Card spotlight: write --x/--y only on the hovered card.
  if (matchMedia("(hover: hover)").matches) document.addEventListener("pointermove", (e) => {
    const c = e.target.closest && e.target.closest(".card"); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--x", e.clientX - r.left + "px"); c.style.setProperty("--y", e.clientY - r.top + "px");
  }, { passive: true });

  // Hero parallax + scroll progress, batched in one rAF; writes only to the elements that react.
  const hv = document.querySelector(".hero-visual"), bar = document.querySelector(".progress");
  let mx = 0, my = 0, queued = false;
  const frame = () => {
    queued = false;
    if (hv) { hv.style.setProperty("--mx", mx.toFixed(3)); hv.style.setProperty("--my", my.toFixed(3)); }
    if (bar) { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; }
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  if (matchMedia("(hover: hover)").matches) addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; queue(); }, { passive: true });
  addEventListener("scroll", queue, { passive: true }); queue();
})();
