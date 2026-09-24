(() => {
  document.documentElement.classList.add("js");
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
      scroll: "листай",
      term: "Терминал",
      sections: "Разделы",
      navTop: "Наверх",
      navAbout: "обо мне",
      navWorks: "работы",
      navPlay: "игра",
      navSupport: "поддержать",
      navContact: "связь",
      aboutTitle: "код, серверы и\u00a0немного магии",
      aboutText: "Я — sysrootix, full-stack разработчик из Хабаровска. Работаю с розничными сетями в Хабаровске и других городах и собираю продукты целиком: витрина, мобильное приложение, бэкенд на Rust и Node, CRM, интеграции с 1С — и сам держу серверы и выкладку. А ещё маркетинг: лендинги, боты, промо и аналитика, чтобы продукт дошёл до людей.",
      fact1: "хабаровск · дом",
      fact2: "проектов за плечами",
      fact3: "основные языки",
      worksTitle: "что я строю",
      watchText: "личный кинотеатр: каталог, плееры, друзья и совместный просмотр.",
      gameText: "разруби баги катаной, пока они не уронили прод",
      termText: "терминал прямо на сайте. нажми ~ и введи help",
      lbTag: "клиент · ритейл · живой",
      lbText: "сеть магазинов спортпита под ключ: мобильное приложение, pwa-кабинет, crm, бот для сотрудников, бонусы, заказы и связка с 1С.",
      mdaTag: "клиент · ритейл · живой",
      mdaText: "платформа для сети магазинов: лояльность, бронь в магазине, telegram mini app, админка, приложение и лендинги.",
      omutTag: "сейчас делаю · запуск в октябре",
      omutText: "мессенджер для iOS: свой чат и Telegram в одном приложении.",
      moreHead: "ещё поменьше",
      linkSite: "сайт",
      linkApp: "приложение",
      cuText: "меню-бар для macOS: сколько лимита осталось у установленных AI-инструментов, без отдельного логина.",
      rdTag: "в работе · внутренний инструмент → saas",
      rdText: "общий inbox: обращения из всех каналов собираются в одну карточку. сначала для своей команды, дальше — как saas.",
      cuTag: "open source · macOS",
      plName: "Полчища",
      plText: "3D survivors в браузере: продержись 20 минут против орды",
      playText: "3D мини-игра прямо в браузере. Режь баги мышкой или пальцем, собирай комбо и не задень прод — он один.",
      playBtn: "играть",
      best: "рекорд",
      contactTitle: "есть идея? пиши.",
      hint: "~ терминал · зажми имя · кликни в пустоту",
      phrases: ["full-stack / devops / marketing", "пишу на typescript и rust", "запускаю приложения для ритейла", "сам держу прод", "собираю мессенджер omut", "режу баги катаной"],
      city: {
        khabarovsk: "хабаровск",
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
      scroll: "scroll",
      term: "Terminal",
      sections: "Sections",
      navTop: "Top",
      navAbout: "about",
      navWorks: "works",
      navPlay: "game",
      navSupport: "support",
      navContact: "contact",
      aboutTitle: "code, servers and a\u00a0little magic",
      aboutText: "I'm sysrootix, a full-stack developer from Khabarovsk. I work with retail chains in Khabarovsk and other cities and build products end to end: storefront, mobile app, Rust and Node backends, CRM, 1C integrations — and I run the servers and deploys myself. Plus marketing: landing pages, bots, promos and analytics, so the product actually reaches people.",
      fact1: "khabarovsk · home",
      fact2: "projects shipped and shelved",
      fact3: "main languages",
      worksTitle: "things I build",
      watchText: "a personal cinema: catalog, players, friends and watch parties.",
      gameText: "slice the bugs with a katana before they take prod down",
      termText: "a terminal right on the site. press ~ and type help",
      lbTag: "client · retail · live",
      lbText: "a sports-nutrition store chain end to end: mobile app, pwa account, crm, staff bot, bonuses, orders and 1C sync.",
      mdaTag: "client · retail · live",
      mdaText: "a platform for a store chain: loyalty, in-store booking, telegram mini app, admin, app and landing pages.",
      omutTag: "building now · launching in october",
      omutText: "an iOS messenger: its own chat and Telegram in one app.",
      moreHead: "smaller things",
      linkSite: "site",
      linkApp: "app",
      cuText: "a macOS menu bar app: how much limit your installed AI tools have left, no extra login.",
      rdTag: "in progress · internal tool → saas",
      rdText: "a shared inbox: requests from every channel land in one card. built for my team first, then as saas.",
      cuTag: "open source · macOS",
      plName: "Polchishcha",
      plText: "3D survivors in the browser: last 20 minutes against the horde",
      playText: "A 3D mini-game right in the browser. Slice bugs with your mouse or finger, chain combos and don't touch prod — there's only one.",
      playBtn: "play",
      best: "best",
      contactTitle: "got an idea? write.",
      hint: "~ terminal · hold the name · click the void",
      phrases: ["full-stack / devops / marketing", "writing typescript and rust", "shipping apps for retail", "running prod myself", "building the omut messenger", "slicing bugs with a katana"],
      city: {
        khabarovsk: "khabarovsk",
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
        if (video.dataset.parked) {
          reversing = false;
          dir = 1;
          return;
        }
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

  // The 2D snow is only a fallback: scene.js draws snow in WebGL and stops this loop.
  let fieldOff = false;
  window.sxField = {
    stop() {
      fieldOff = true;
      running = false;
      field.style.display = "none";
    },
  };

  // Spotlight follows the cursor by moving one composited layer, not by restyling the page.
  const lampEl = document.querySelector(".lamp");
  let lampRaf = 0;
  lampX = window.innerWidth * 0.5;
  lampY = window.innerHeight * 0.42;
  lampTX = lampX;
  lampTY = lampY;
  function lampStep() {
    lampX += (lampTX - lampX) * 0.14;
    lampY += (lampTY - lampY) * 0.14;
    lampEl.style.transform = `translate3d(${lampX.toFixed(1)}px, ${lampY.toFixed(1)}px, 0)`;
    lampRaf = Math.abs(lampTX - lampX) + Math.abs(lampTY - lampY) > 0.6 ? requestAnimationFrame(lampStep) : 0;
  }
  lampEl.style.transform = `translate3d(${lampX}px, ${lampY}px, 0)`;

  function loop() {
    if (!running || fieldOff) return;
    paint();
    if (!reduce) requestAnimationFrame(loop);
  }

  resize();
  spawn();
  running = true;
  paint();
  if (!reduce) requestAnimationFrame(loop);

  window.addEventListener("resize", () => {
    if (fieldOff) return;
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
      lampTX = e.clientX;
      lampTY = e.clientY;
      if (!lampRaf) lampRaf = requestAnimationFrame(lampStep);
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
    } else if (!reduce && !fieldOff) {
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

  // Web Audio graph: element → low-pass (muffles under overlays) → gain (fades) → analyser (visuals).
  // Built on the first user gesture, because an AudioContext created earlier starts suspended.
  let actx = null;
  let lowpass = null;
  let gainNode = null;
  let analyser = null;
  let bins = null;
  let slowBass = 0;
  let lastKick = 0;
  let meterRaf = 0;
  const eqBars = [...soundBtn.querySelectorAll(".eq i")];

  function buildGraph() {
    if (actx) {
      if (actx.state === "suspended") actx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      actx = new AC();
      const src = actx.createMediaElementSource(audio);
      lowpass = actx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 20000;
      lowpass.Q.value = 0.7;
      gainNode = actx.createGain();
      analyser = actx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.72;
      bins = new Uint8Array(analyser.frequencyBinCount);
      src.connect(lowpass).connect(gainNode).connect(analyser).connect(actx.destination);
      if (actx.state === "suspended") actx.resume();
      if (!audio.paused) startMeter();
    } catch {
      actx = null;
    }
  }

  function band(from, to) {
    let sum = 0;
    for (let i = from; i < to; i += 1) sum += bins[i];
    return sum / ((to - from) * 255);
  }

  function meter(now) {
    meterRaf = 0;
    if (!analyser || audio.paused) {
      sxAudio.current = null;
      soundBtn.classList.remove("live");
      return;
    }
    analyser.getByteFrequencyData(bins);
    const bass = band(1, 5);
    const mid = band(6, 30);
    const high = band(30, 90);
    slowBass += (bass - slowBass) * 0.05;
    const kick = bass - slowBass > 0.09 && now - lastKick > 220;
    if (kick) lastKick = now;
    sxAudio.current = { bass, mid, high, kick };
    soundBtn.classList.add("live");
    const levels = [bass, mid * 1.4, high * 2.2, (mid + bass) * 0.8];
    eqBars.forEach((bar, i) => {
      bar.style.transform = `scaleY(${Math.max(0.15, Math.min(1, levels[i])).toFixed(2)})`;
    });
    meterRaf = requestAnimationFrame(meter);
  }

  function startMeter() {
    if (!meterRaf && analyser && !reduce) meterRaf = requestAnimationFrame(meter);
  }

  function fadeTo(value, seconds) {
    if (!gainNode) return;
    const now = actx.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(value, now + seconds);
  }

  const sxAudio = {
    current: null,
    muffle(on) {
      if (!lowpass) return;
      const now = actx.currentTime;
      lowpass.frequency.cancelScheduledValues(now);
      lowpass.frequency.setValueAtTime(lowpass.frequency.value, now);
      lowpass.frequency.exponentialRampToValueAtTime(on ? 650 : 20000, now + (on ? 0.5 : 0.9));
    },
  };
  window.sxAudio = sxAudio;

  audio.addEventListener("playing", startMeter);

  soundBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    buildGraph();
    const on = soundBtn.getAttribute("aria-pressed") !== "true";
    if (on) {
      if (gainNode) gainNode.gain.value = 0;
      setSound(true);
      const ok = await startSound();
      if (!ok) setSound(false);
      else fadeTo(1, 2.2);
    } else {
      setSound(false);
      if (gainNode) {
        fadeTo(0, 0.45);
        setTimeout(() => {
          if (soundBtn.getAttribute("aria-pressed") !== "true") audio.pause();
        }, 480);
      } else {
        audio.pause();
      }
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
      buildGraph();
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
      sxAudio.muffle(true);
    }
  }

  document.querySelectorAll(".pay-k, .js-qr").forEach((btn) => {
    btn.addEventListener("click", () => openSheet(btn));
  });

  qrCopy.addEventListener("click", () => copyText(sheetAddr));
  document.getElementById("qr-close").addEventListener("click", () => sheet.close());
  sheet.addEventListener("close", () => {
    document.body.style.overflow = "";
    sxAudio.muffle(false);
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
    // Khabarovsk shares the Asia/Vladivostok zone (UTC+10).
    ["khabarovsk", "Asia/Vladivostok"],
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
    phraseIdx = 0;
    typePhrase();
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
    if (sheet.open || !document.getElementById("term").hidden) return;
    if (e.key.length !== 1 || !/\p{L}/u.test(e.key) || e.key === "ё" || e.key === "Ё") return;
    echoEl.textContent = e.key;
    echoEl.classList.add("on");
    clearTimeout(echoTimer);
    echoTimer = setTimeout(() => echoEl.classList.remove("on"), 1000);
  });

  // ---------- typed status line ----------
  const typedEl = document.getElementById("typed");
  let phraseIdx = 0;
  let typeTimer = 0;

  function typePhrase() {
    clearTimeout(typeTimer);
    const list = t("phrases");
    const text = list[phraseIdx % list.length];
    if (reduce) {
      typedEl.textContent = list[0];
      return;
    }
    let i = typedEl.textContent.length;
    const current = typedEl.textContent;
    const erase = () => {
      if (i > 0 && !text.startsWith(current.slice(0, i))) {
        i -= 1;
        typedEl.textContent = current.slice(0, i);
        typeTimer = setTimeout(erase, 22);
      } else {
        write();
      }
    };
    const write = () => {
      if (i < text.length) {
        i += 1;
        typedEl.textContent = text.slice(0, i);
        typeTimer = setTimeout(write, 38 + Math.random() * 50);
      } else {
        phraseIdx += 1;
        typeTimer = setTimeout(typePhrase, phraseIdx % list.length === 1 ? 4200 : 2400);
      }
    };
    erase();
  }

  // ---------- name decode ----------
  function decodeName() {
    letters.forEach((el, i) => {
      setTimeout(() => {
        el.style.transitionDelay = "0s";
        let n = 0;
        const spin = setInterval(() => {
          n += 1;
          el.textContent = n > 6 ? original[i] : glyphs[(Math.random() * glyphs.length) | 0];
          if (n > 6) clearInterval(spin);
        }, 45);
      }, i * 70);
    });
    nameEl.classList.remove("pre");
  }

  // ---------- boot sequence ----------
  const bootEl = document.getElementById("boot");
  const bootLog = document.getElementById("boot-log");

  function finishBoot() {
    if (!document.documentElement.classList.contains("booting")) return;
    try { sessionStorage.setItem("sx.boot", "1"); } catch {}
    bootEl.classList.add("out");
    nameEl.classList.add("pre");
    document.documentElement.classList.remove("booting");
    requestAnimationFrame(() => requestAnimationFrame(decodeName));
    setTimeout(() => { bootEl.style.display = "none"; }, 900);
    window.sxScene?.burst();
  }

  function runBoot() {
    const lines = [
      "<b>sysrootix</b> bios v6.6.6 · (c) root",
      "cpu0: katana-class @ 4.20 GHz ........ <b>ok</b>",
      "mem: 64 GB snow ........................ <b>ok</b>",
      "mounting /dev/soul on / ................ <b>ok</b>",
      "starting sshd, nginx, dreams ........... <b>ok</b>",
      "loading sigil.glsl (9000 particles) .... <b>ok</b>",
      "checking prod .......................... <em>still alive</em>",
      `session ${sessionHex()} · welcome, <b>guest</b>`,
    ];
    let i = 0;
    const step = () => {
      if (!document.documentElement.classList.contains("booting")) return;
      bootLog.innerHTML += `${lines[i]}\n`;
      i += 1;
      bootEl.style.setProperty("--boot", `${Math.round((i / lines.length) * 100)}%`);
      if (i < lines.length) setTimeout(step, 110 + Math.random() * 120);
      else setTimeout(finishBoot, 420);
    };
    step();
    bootEl.addEventListener("click", finishBoot);
    window.addEventListener("keydown", finishBoot, { once: true });
  }

  if (document.documentElement.classList.contains("booting")) runBoot();

  // ---------- reveals, progress, nav dots ----------
  const reveals = [...document.querySelectorAll(".reveal")];
  document.querySelectorAll(".facts, .cards, .minis").forEach((wrap) => {
    [...wrap.children].forEach((el, i) => el.style.setProperty("--d", `${i * 0.09}s`));
  });
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // Scroll work is batched into one frame and touches only the few elements that react to it.
  const dots = [...document.querySelectorAll(".dots a")];
  const dotTargets = dots.map((a) => document.querySelector(a.getAttribute("href")));
  const progressBar = document.querySelector(".progress span");
  const heroBound = [...document.querySelectorAll(".void, .blade, .cue")];
  let dotTops = [];
  let maxScroll = 1;
  let scrollQueued = false;
  let lastHero = -1;
  let lastActive = -1;
  let parked = false;

  function measureScroll() {
    dotTops = dotTargets.map((el) => (el ? el.getBoundingClientRect().top + window.scrollY : 0));
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    applyScroll();
  }

  function parkVideos(off) {
    if (off === parked || reduce) return;
    parked = off;
    videos.forEach((v) => {
      if (off) {
        v.dataset.parked = "1";
        v.pause();
      } else {
        delete v.dataset.parked;
        v.play().catch(() => {});
      }
      v.style.visibility = off ? "hidden" : "";
    });
  }

  function applyScroll() {
    scrollQueued = false;
    const y = window.scrollY;
    progressBar.style.transform = `scaleX(${Math.min(1, y / maxScroll).toFixed(4)})`;
    const hero = Math.min(1, y / (window.innerHeight * 0.9));
    if (Math.abs(hero - lastHero) > 0.004 || (hero === 1) !== (lastHero === 1)) {
      lastHero = hero;
      heroBound.forEach((el) => el.style.setProperty("--hero", hero.toFixed(3)));
      parkVideos(y > window.innerHeight * 1.15);
    }
    const mid = y + window.innerHeight * 0.45;
    let active = 0;
    dotTops.forEach((top, i) => {
      if (top <= mid) active = i;
    });
    if (active !== lastActive) {
      lastActive = active;
      dots.forEach((d, i) => d.classList.toggle("on", i === active));
      document.documentElement.dataset.sec = String(active);
    }
  }

  window.addEventListener("scroll", () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(applyScroll);
    }
  }, { passive: true });
  window.addEventListener("resize", measureScroll, { passive: true });
  window.addEventListener("load", measureScroll);
  if ("ResizeObserver" in window) new ResizeObserver(measureScroll).observe(document.body);
  measureScroll();

  // ---------- 3D tilt cards ----------
  if (finePointer && !reduce) {
    document.querySelectorAll(".card").forEach((card) => {
      let queued = false;
      let ex = 0;
      let ey = 0;
      let rect = null;
      card.addEventListener("pointerenter", () => { rect = card.getBoundingClientRect(); });
      card.addEventListener("pointermove", (e) => {
        ex = e.clientX;
        ey = e.clientY;
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          const r = rect || card.getBoundingClientRect();
          const x = (ex - r.left) / r.width;
          const y = (ey - r.top) / r.height;
          card.classList.add("tilting");
          card.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
          card.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
          card.style.setProperty("--mx", `${x * 100}%`);
          card.style.setProperty("--my", `${y * 100}%`);
        });
      });
      card.addEventListener("pointerleave", () => {
        rect = null;
        card.classList.remove("tilting");
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }

  // Cards with two links: a click anywhere outside the buttons opens the main link.
  document.querySelectorAll(".card-cover").forEach((cover) => {
    cover.closest(".card").addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      cover.click();
    });
  });

    // ---------- magnetic mail ----------
  document.querySelectorAll("[data-magnet]").forEach((el) => {
    if (!finePointer || reduce) return;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.08}px, ${dy * 0.25}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    el.style.transition = "transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1), background-size 0.6s cubic-bezier(0.22, 0.8, 0.2, 1)";
  });

  // ---------- best score ----------
  const bestEl = document.getElementById("best");
  if (bestEl) bestEl.textContent = String(Number(localStorage.getItem("sx.katana.best") || 0));

  window.sx = {
    t,
    get lang() { return lang; },
    toggleLang: () => langBtn.click(),
    toggleSound: () => soundBtn.click(),
    copy: copyText,
    notify,
    session: sessionHex,
    views: () => n,
  };

  applyLang();
  typePhrase();
  setInterval(tickWhen, 15000);
})();
