(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const I18N = {
    ru: {
      socials: "Соцсети",
      pay: "Крипта",
      payHead: "крипта · qr",
      tg: "написать в Telegram",
      project: "мой проект",
      projectKind: "кино · сериалы",
      views: "Просмотры",
      copy: "скопировать",
      open: "открыть",
      close: "закрыть",
      copied: "скопировано",
      copyAria: "Скопировать",
      soundOff: "Выключить звук",
      soundOn: "Включить звук",
      sess: "ключ сессии",
      around: "на связи",
      later: "позже",
      you: "ты",
      city: {
        vladivostok: "владивосток",
        moscow: "москва",
        utc: "utc",
        berlin: "берлин",
        nyc: "нью-йорк",
      },
    },
    en: {
      socials: "Socials",
      pay: "Crypto",
      payHead: "crypto · qr",
      tg: "write on Telegram",
      project: "my project",
      projectKind: "films · series",
      views: "Views",
      copy: "copy",
      open: "open",
      close: "close",
      copied: "copied",
      copyAria: "Copy",
      soundOff: "Mute sound",
      soundOn: "Unmute sound",
      sess: "session key",
      around: "around",
      later: "later",
      you: "you",
      city: {
        vladivostok: "vladivostok",
        moscow: "moscow",
        utc: "utc",
        berlin: "berlin",
        nyc: "nyc",
      },
    },
  };

  const savedLang = localStorage.getItem("sx.lang");
  let lang = savedLang === "ru" || savedLang === "en"
    ? savedLang
    : ((navigator.language || "").toLowerCase().startsWith("ru") ? "ru" : "en");

  function t(key) {
    return I18N[lang][key] || I18N.ru[key] || key;
  }

  const videos = [...document.querySelectorAll("video")];

  function pingPong(video) {
    if (!video) return;

    function setup() {
      if (!Number.isFinite(video.duration) || video.duration > 9) {
        video.loop = true;
        return;
      }
      video.loop = false;
      let dir = 1;
      let reversing = false;
      let last = 0;

      function reverseFrame(now) {
        if (!reversing) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const next = video.currentTime - dt;
        if (next <= 0.03) {
          reversing = false;
          dir = 1;
          video.currentTime = 0;
          video.play().catch(() => {});
          return;
        }
        video.currentTime = next;
        requestAnimationFrame(reverseFrame);
      }

      video.addEventListener("ended", () => {
        if (dir !== 1) return;
        dir = -1;
        reversing = true;
        last = performance.now();
        video.pause();
        requestAnimationFrame(reverseFrame);
      });
    }

    if (video.readyState >= 1) setup();
    else video.addEventListener("loadedmetadata", setup, { once: true });
  }

  if (reduce) {
    videos.forEach((v) => {
      v.pause();
      v.removeAttribute("autoplay");
    });
  } else {
    videos.forEach((v) => {
      v.play().catch(() => {});
    });
    pingPong(document.querySelector("video.blade"));
  }

  const field = document.getElementById("field");
  const ctx = field.getContext("2d", { alpha: true });
  let w = 0;
  let h = 0;
  let flakes = [];
  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;
  let running = false;
  let ptrX = 0;
  let ptrY = 0;
  let sparksReady = false;
  let lampX = 50;
  let lampY = 42;
  let lampTX = 50;
  let lampTY = 42;
  const sparks = Array.from({ length: 6 }, (_, i) => ({
    x: 0,
    y: 0,
    lag: 0.14 + i * 0.08,
  }));
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    field.width = Math.floor(w * dpr);
    field.height = Math.floor(h * dpr);
    field.style.width = `${w}px`;
    field.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn() {
    const n = reduce ? 36 : Math.round(Math.min(90, 48 + w * 0.03));
    flakes = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() < 0.82 ? Math.random() * 1.15 + 0.25 : Math.random() * 2 + 0.8,
      s: Math.random() * 0.32 + 0.06,
      a: Math.random() * 0.5 + 0.12,
      d: Math.random() * 0.7 + 0.2,
      flake: Math.random() < 0.1,
      tw: Math.random() * Math.PI * 2,
    }));
  }

  function drawFlake(x, y, r, a) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = a;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 0.55;
    ctx.beginPath();
    for (let i = 0; i < 6; i += 1) {
      const ang = (Math.PI / 3) * i;
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
    }
    ctx.stroke();
    ctx.restore();
  }

  function paint() {
    ctx.clearRect(0, 0, w, h);
    tx += (mx - tx) * 0.045;
    ty += (my - ty) * 0.045;
    for (const f of flakes) {
      if (!reduce) {
        f.y += f.s;
        f.x += Math.sin(f.y * 0.012 + f.tw) * 0.16;
        if (f.y > h + 8) {
          f.y = -8;
          f.x = Math.random() * w;
        }
      }
      const x = f.x + tx * f.d * 18;
      const y = f.y + ty * f.d * 12;
      if (f.flake) {
        drawFlake(x, y, f.r * 2.4, f.a * 0.75);
      } else {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${f.a})`;
        ctx.arc(x, y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (!reduce && finePointer) {
      lampX += (lampTX - lampX) * 0.07;
      lampY += (lampTY - lampY) * 0.07;
      document.documentElement.style.setProperty("--lx", `${lampX}%`);
      document.documentElement.style.setProperty("--ly", `${lampY}%`);
      sparks.forEach((s, i) => {
        s.x += (ptrX - s.x) * s.lag;
        s.y += (ptrY - s.y) * s.lag;
        ctx.beginPath();
        ctx.fillStyle = `rgba(243,240,232,${0.55 - i * 0.07})`;
        ctx.arc(s.x, s.y, 1.35 - i * 0.12, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  function loop() {
    if (!running) return;
    paint();
    if (!reduce) requestAnimationFrame(loop);
  }

  resize();
  spawn();
  running = true;
  paint();
  if (!reduce) requestAnimationFrame(loop);

  window.addEventListener("resize", () => {
    resize();
    spawn();
    if (reduce) paint();
  }, { passive: true });

  window.addEventListener("pointermove", (e) => {
    if (reduce) return;
    mx = e.clientX / w - 0.5;
    my = e.clientY / h - 0.5;
    ptrX = e.clientX;
    ptrY = e.clientY;
    if (finePointer) {
      lampTX = (e.clientX / w) * 100;
      lampTY = (e.clientY / h) * 100;
      if (!sparksReady) {
        sparks.forEach((s) => {
          s.x = ptrX;
          s.y = ptrY;
        });
        sparksReady = true;
      }
    }
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
    } else if (!reduce) {
      running = true;
      requestAnimationFrame(loop);
    }
  });

  const audio = document.getElementById("ambient");
  const soundBtn = document.querySelector(".sound");
  audio.volume = 0.4;
  audio.loop = true;
  audio.autoplay = true;
  const wantSound = localStorage.getItem("sx.sound") !== "0";

  function soundWanted() {
    return localStorage.getItem("sx.sound") !== "0";
  }

  function setSound(on) {
    soundBtn.setAttribute("aria-pressed", on ? "true" : "false");
    soundBtn.setAttribute("aria-label", on ? t("soundOff") : t("soundOn"));
    localStorage.setItem("sx.sound", on ? "1" : "0");
  }

  async function startSound() {
    if (!soundWanted()) return false;
    if (!audio.paused) {
      setSound(true);
      return true;
    }
    try {
      await audio.play();
      setSound(true);
      return true;
    } catch (err) {
      if (err && err.name === "AbortError") {
        await new Promise((r) => setTimeout(r, 60));
        if (!audio.paused) {
          setSound(true);
          return true;
        }
        try {
          await audio.play();
          setSound(true);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }

  soundBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const on = soundBtn.getAttribute("aria-pressed") !== "true";
    if (on) {
      const ok = await startSound();
      if (!ok) setSound(false);
    } else {
      audio.pause();
      setSound(false);
    }
  });

  setSound(wantSound);

  function tryAutoplay() {
    if (!soundWanted()) return;
    startSound();
  }

  if (wantSound) {
    tryAutoplay();
    audio.addEventListener("canplay", tryAutoplay);
    audio.addEventListener("canplaythrough", tryAutoplay);
    audio.addEventListener("playing", () => setSound(true));
    window.addEventListener("load", tryAutoplay);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) tryAutoplay();
    });
    let attempts = 0;
    const retry = setInterval(() => {
      attempts += 1;
      startSound().then((ok) => {
        if (ok || !soundWanted() || attempts >= 25) clearInterval(retry);
      });
    }, 350);
    const unlock = () => {
      if (!soundWanted()) return;
      startSound();
    };
    window.addEventListener("pointerdown", unlock, { capture: true });
    window.addEventListener("keydown", unlock, { capture: true });
  }

  const countEl = document.getElementById("count");
  const viewKey = "sx.views";
  const hitKey = "sx.hit";
  let n = Number(localStorage.getItem(viewKey) || 0);
  if (!sessionStorage.getItem(hitKey)) {
    n += 1;
    localStorage.setItem(viewKey, String(n));
    sessionStorage.setItem(hitKey, "1");
  }
  countEl.textContent = String(Math.max(n, 1)).padStart(4, "0");

  const toast = document.querySelector(".toast");
  let toastTimer;

  function notify(text) {
    toast.textContent = text || t("copied");
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      notify(t("copied"));
    } catch {
      const tmp = document.createElement("textarea");
      tmp.value = value;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      tmp.remove();
      notify(t("copied"));
    }
  }

  document.querySelectorAll(".copy").forEach((btn) => {
    btn.addEventListener("click", () => copyText(btn.getAttribute("data-copy") || ""));
  });

  const sheet = document.getElementById("qr-sheet");
  const qrImg = document.getElementById("qr-img");
  const qrName = document.getElementById("qr-name");
  const qrAddr = document.getElementById("qr-addr");
  const qrCopy = document.getElementById("qr-copy");
  const qrOpen = document.getElementById("qr-open");
  let sheetAddr = "";

  function openSheet(el) {
    sheetAddr = el.getAttribute("data-copy") || "";
    qrImg.src = el.getAttribute("data-qr") || "";
    qrImg.alt = el.getAttribute("data-name") || "";
    qrName.textContent = el.getAttribute("data-name") || "";
    qrAddr.textContent = sheetAddr;
    const href = el.getAttribute("data-href");
    if (href) {
      qrOpen.href = href;
      qrOpen.hidden = false;
    } else {
      qrOpen.removeAttribute("href");
      qrOpen.hidden = true;
    }
    if (typeof sheet.showModal === "function") {
      document.body.style.overflow = "hidden";
      sheet.showModal();
    }
  }

  document.querySelectorAll(".pay-k, .js-qr").forEach((btn) => {
    btn.addEventListener("click", () => openSheet(btn));
  });

  qrCopy.addEventListener("click", () => copyText(sheetAddr));
  document.getElementById("qr-close").addEventListener("click", () => sheet.close());
  sheet.addEventListener("close", () => {
    document.body.style.overflow = "";
  });
  sheet.addEventListener("click", (e) => {
    const r = sheet.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside || e.target === sheet) sheet.close();
  });

  const copyBtns = [...document.querySelectorAll(".pay-row .copy")];
  window.addEventListener("keydown", (e) => {
    if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    if (e.key === "Escape" && sheet.open) {
      sheet.close();
      return;
    }
    const i = Number(e.key) - 1;
    if (i >= 0 && i < copyBtns.length && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      copyText(copyBtns[i].getAttribute("data-copy") || "");
    }
  });

  const whenEl = document.getElementById("when");
  const ZONES = [
    ["vladivostok", "Asia/Vladivostok"],
    ["moscow", "Europe/Moscow"],
    ["utc", "UTC"],
    ["berlin", "Europe/Berlin"],
    ["nyc", "America/New_York"],
  ];

  function clockIn(timeZone) {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  }

  function offsetHours(timeZone) {
    const name = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    }).formatToParts(new Date()).find((p) => p.type === "timeZoneName")?.value || "";
    const m = name.match(/([+-]\d{1,2})(?::(\d{2}))?/);
    if (!m) return 0;
    return Number(m[1]) + Number(m[2] || 0) / 60;
  }

  const HOME = "Asia/Vladivostok";
  const OPEN_H = 10;
  const CLOSE_H = 23;
  const hoursEl = document.getElementById("hours");

  function pad2(n) {
    return String(((n % 24) + 24) % 24).padStart(2, "0");
  }

  function hourIn(timeZone) {
    return Number(new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "numeric",
      hour12: false,
    }).format(new Date())) % 24;
  }

  function shiftHour(vlatHour, targetTz) {
    const delta = offsetHours(targetTz) - offsetHours(HOME);
    return Math.round(vlatHour + delta);
  }

  function tickWhen() {
    const cities = t("city");
    const here = -new Date().getTimezoneOffset() / 60;
    const parts = ZONES.map(([label, tz], i) => {
      const cls = i === 0 ? "when-home" : "";
      return `<span class="${cls}">${cities[label] || label} ${clockIn(tz)}</span>`;
    });
    const listed = new Set(ZONES.map(([, tz]) => offsetHours(tz).toFixed(2)));
    if (!listed.has(here.toFixed(2))) {
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      parts.push(`<span>${t("you")} ${clockIn(localTz)}</span>`);
    }
    whenEl.innerHTML = parts.join("");

    const nowH = hourIn(HOME);
    const open = nowH >= OPEN_H && nowH < CLOSE_H;
    const hourParts = ZONES.map(([label, tz], i) => {
      const a = pad2(shiftHour(OPEN_H, tz));
      const b = pad2(shiftHour(CLOSE_H, tz));
      const cls = i === 0 ? (open ? "hours-now" : "") : "";
      const prefix = i === 0 ? `${open ? t("around") : t("later")} · ` : "";
      return `<span class="${cls}">${prefix}${a}–${b} ${cities[label] || label}</span>`;
    });
    hoursEl.innerHTML = hourParts.join("");
  }

  const langBtn = document.getElementById("lang");
  const sessEl = document.getElementById("sess");
  const echoEl = document.getElementById("echo");
  const nameEl = document.getElementById("name");

  function applyLang() {
    document.documentElement.lang = lang;
    langBtn.textContent = lang === "ru" ? "en" : "ru";
    langBtn.setAttribute("aria-label", lang === "ru" ? "English" : "Русский");
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.i18nAria));
    });
    document.querySelectorAll(".pay-row .copy").forEach((btn) => {
      const name = btn.closest(".pay-row")?.querySelector("[data-name]")?.getAttribute("data-name") || "";
      btn.setAttribute("aria-label", `${t("copyAria")} ${name}`.trim());
    });
    const soundOn = soundBtn.getAttribute("aria-pressed") === "true";
    soundBtn.setAttribute("aria-label", soundOn ? t("soundOff") : t("soundOn"));
    sessEl.setAttribute("aria-label", t("sess"));
    tickWhen();
  }

  langBtn.addEventListener("click", () => {
    lang = lang === "ru" ? "en" : "ru";
    localStorage.setItem("sx.lang", lang);
    applyLang();
  });

  function sessionHex() {
    let hex = sessionStorage.getItem("sx.sess");
    if (!hex) {
      const bytes = new Uint8Array(4);
      crypto.getRandomValues(bytes);
      hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
      sessionStorage.setItem("sx.sess", hex);
    }
    return hex;
  }

  sessEl.textContent = sessionHex();
  sessEl.addEventListener("click", () => copyText(sessEl.textContent || ""));

  const letters = [...nameEl.querySelectorAll("span")];
  const original = letters.map((el) => el.textContent);
  const glyphs = "01░▒▓#*<>/\\|~+";
  let holdTimer = 0;
  let assembleTimer = 0;
  let scattered = false;

  function scatterName() {
    if (reduce || scattered) return;
    scattered = true;
    letters.forEach((el) => {
      const dx = (Math.random() - 0.5) * 52;
      const dy = (Math.random() - 0.5) * 38;
      const rot = (Math.random() - 0.5) * 42;
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      el.textContent = glyphs[(Math.random() * glyphs.length) | 0];
    });
  }

  function assembleName() {
    letters.forEach((el, i) => {
      el.style.transform = "";
      el.textContent = original[i];
    });
    scattered = false;
  }

  function cancelHold() {
    clearTimeout(holdTimer);
    if (!scattered) return;
    clearTimeout(assembleTimer);
    assembleTimer = setTimeout(assembleName, 480);
  }

  nameEl.addEventListener("pointerdown", (e) => {
    if (reduce || e.button) return;
    nameEl.setPointerCapture(e.pointerId);
    clearTimeout(assembleTimer);
    holdTimer = setTimeout(scatterName, 560);
  });
  nameEl.addEventListener("pointerup", cancelHold);
  nameEl.addEventListener("pointercancel", cancelHold);
  nameEl.addEventListener("contextmenu", (e) => e.preventDefault());

  let echoTimer = 0;
  window.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    if (sheet.open) return;
    if (e.key.length !== 1 || !/\p{L}/u.test(e.key)) return;
    echoEl.textContent = e.key;
    echoEl.classList.add("on");
    clearTimeout(echoTimer);
    echoTimer = setTimeout(() => echoEl.classList.remove("on"), 1000);
  });

  applyLang();
  setInterval(tickWhen, 15000);
})();
