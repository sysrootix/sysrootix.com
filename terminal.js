(() => {
  const term = document.getElementById("term");
  const out = document.getElementById("term-out");
  const form = document.getElementById("term-form");
  const input = document.getElementById("term-in");
  const closeBtn = document.getElementById("term-x");
  if (!term) return;

  const sx = () => window.sx || {};
  const ru = () => sx().lang !== "en";
  const history = [];
  let hIdx = 0;
  let booted = false;
  let lastFocus = null;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function print(html, cls) {
    const line = document.createElement("div");
    if (cls) line.className = cls;
    line.innerHTML = html;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }

  const SIGIL = [
    "        .        ",
    "       / \\       ",
    "  ____/   \\____  ",
    "  \\  /\\   /\\  /  ",
    "   \\/  \\ /  \\/   ",
    "   /\\   X   /\\   ",
    "  /  \\ / \\ /  \\  ",
    " /____V   V____\\ ",
  ];

  function neofetch() {
    const info = [
      "<b>root</b>@<b>sysrootix</b>",
      "-----------------",
      `<span class="dim">os</span>      sysrootix.com`,
      `<span class="dim">host</span>    ${ru() ? "хабаровск, UTC+10" : "khabarovsk, UTC+10"}`,
      `<span class="dim">shell</span>   katana-sh 6.6`,
      `<span class="dim">langs</span>   typescript, rust, swift`,
      `<span class="dim">role</span>    full-stack / devops / marketing`,
      `<span class="dim">uptime</span>  ${Math.round(performance.now() / 1000)}s ${ru() ? "(эта вкладка)" : "(this tab)"}`,
      `<span class="dim">session</span> ${sx().session ? sx().session() : "—"}`,
      `<span class="dim">visits</span>  ${sx().views ? sx().views() : 1}`,
      `<span class="dim">gpu</span>     ${gpuName()}`,
    ];
    const rows = Math.max(SIGIL.length, info.length);
    let text = "";
    for (let i = 0; i < rows; i += 1) {
      text += `<span class="ok">${esc(SIGIL[i] || "                 ")}</span>  ${info[i] || ""}\n`;
    }
    print(text);
  }

  function gpuName() {
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      const ext = gl && gl.getExtension("WEBGL_debug_renderer_info");
      const name = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "webgl";
      const m = String(name).match(/ANGLE \([^,]+,\s*([^,]+?)(?:\s*\(0x[0-9a-f]+\))?\s*(?:Direct3D|OpenGL|Metal|Vulkan|,|\))/i);
      return esc((m ? m[1] : String(name)).split(" (")[0].trim().slice(0, 42));
    } catch {
      return "unknown";
    }
  }

  function crash() {
    const html = document.documentElement;
    print(ru() ? "удаляю всё..." : "deleting everything...", "err");
    input.disabled = true;
    html.classList.add("shake");
    const bits = [...document.querySelectorAll("main .title, main .lead, main .card, main .fact, main h1, main .pay, main .mail")];
    bits.forEach((el) => {
      el.style.transition = "transform 1.4s cubic-bezier(.5,0,.9,.4), opacity 1.4s ease";
      el.style.transform = `translateY(${110 + Math.random() * 60}vh) rotate(${(Math.random() - 0.5) * 80}deg)`;
      el.style.opacity = "0.2";
    });
    setTimeout(() => {
      html.classList.remove("shake");
      print(ru() ? "шучу. восстанавливаю из бэкапа... <b>ok</b>" : "just kidding. restoring from backup... <b>ok</b>", "ok");
      bits.forEach((el) => {
        el.style.transform = "";
        el.style.opacity = "";
      });
      setTimeout(() => bits.forEach((el) => { el.style.transition = ""; }), 1500);
      input.disabled = false;
      input.focus();
    }, 2200);
  }

  function matrix() {
    const c = document.createElement("canvas");
    c.style.cssText = "position:fixed;inset:0;z-index:45;pointer-events:none;mix-blend-mode:screen";
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    const w = (c.width = window.innerWidth);
    const h = (c.height = window.innerHeight);
    const size = 16;
    const cols = Math.ceil(w / size);
    const drops = Array.from({ length: cols }, () => Math.random() * -40);
    const chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ01<>/#$sysrootix";
    const t0 = performance.now();
    function tick(now) {
      const age = now - t0;
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${size}px monospace`;
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() < 0.04 ? "#fff" : "rgba(125,255,168,0.85)";
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * size, y * size);
        drops[i] = y * size > h && Math.random() > 0.97 ? 0 : y + 1;
      });
      c.style.opacity = String(Math.max(0, Math.min(1, (6000 - age) / 1200)));
      if (age < 6000) requestAnimationFrame(tick);
      else c.remove();
    }
    requestAnimationFrame(tick);
    print(ru() ? "wake up, guest..." : "wake up, guest...", "ok");
  }

  const links = {
    telegram: "https://t.me/sysrootix",
    x: "https://x.com/sysrootix",
    github: "https://github.com/sysrootix",
    youtube: "https://youtube.com/@sysrootix",
    watch: "https://sysrootix.watch/",
  };

  const COMMANDS = {
    help() {
      const rows = ru()
        ? [
          ["whoami", "кто я"],
          ["about", "коротко обо мне"],
          ["projects", "мои проекты"],
          ["play", "запустить katana.exe"],
          ["socials", "где меня найти"],
          ["contact", "как связаться"],
          ["crypto", "поддержать"],
          ["neofetch", "инфа о системе"],
          ["time", "время в хабаровске"],
          ["open <имя>", "открыть ссылку (telegram, github…)"],
          ["lang / sound", "язык / звук"],
          ["clear / exit", "очистить / закрыть"],
        ]
        : [
          ["whoami", "who am i"],
          ["about", "a few words about me"],
          ["projects", "my projects"],
          ["play", "launch katana.exe"],
          ["socials", "where to find me"],
          ["contact", "how to reach me"],
          ["crypto", "support"],
          ["neofetch", "system info"],
          ["time", "time in khabarovsk"],
          ["open <name>", "open a link (telegram, github…)"],
          ["lang / sound", "language / sound"],
          ["clear / exit", "clear / close"],
        ];
      print(rows.map(([c, d]) => `  <b class="cmd">${esc(c.padEnd(14))}</b><span class="dim">${esc(d)}</span>`).join("\n"));
      print(`<span class="dim">${ru() ? "  есть и скрытые команды. ищи." : "  there are hidden commands too. dig."}</span>`);
    },
    whoami() {
      print(ru() ? "ты — guest. а здесь живёт sysrootix: full-stack разработчик, devops и маркетолог." : "you are guest. this place belongs to sysrootix: full-stack developer, devops and marketer.");
    },
    about() {
      print(esc(sx().t ? sx().t("aboutText") : ""));
    },
    projects() {
      const rows = [
        ["5LB", ru() ? "спортпит: приложение, crm, бот, 1С" : "sports nutrition: app, crm, bot, 1C", "https://5lb.pro"],
        ["Medusa", ru() ? "ритейл: лояльность, mini app, админка" : "retail: loyalty, mini app, admin", "https://webapp.mda-platform.top"],
        ["sysrootix.watch", ru() ? "личный кинотеатр" : "personal cinema", links.watch],
        ["Omut", ru() ? "мессенджер для iOS, скоро" : "iOS messenger, soon", "https://omut.chat"],
        ["CheckUsage", ru() ? "меню-бар macOS" : "macOS menu bar app", "https://github.com/sysrootix/check-usage"],
        ["supermarket 3d", ru() ? "браузерный симулятор" : "browser tycoon", "https://sysrootix.github.io/supermarket-tycoon-3d/"],
        ["katana.exe", ru() ? "3d мини-игра" : "3d mini-game", "game.html"],
      ];
      rows.forEach(([name, what, url]) => {
        const ext = url.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
        print(`  <b>${esc(name.padEnd(16))}</b><span class="dim">${esc(what.padEnd(36))}</span> <a href="${url}"${ext}>${esc(url.replace(/^https:\/\//, ""))}</a>`);
      });
    },
    socials() {
      Object.entries(links).filter(([k]) => k !== "watch").forEach(([k, v]) => {
        print(`  ${esc(k.padEnd(10))}<a href="${v}" target="_blank" rel="noopener noreferrer">${v}</a>`);
      });
    },
    contact() {
      print(`  mail      <a href="mailto:root@sysrootix.com">root@sysrootix.com</a>`);
      print(`  telegram  <a href="${links.telegram}" target="_blank" rel="noopener noreferrer">@sysrootix</a>`);
    },
    crypto() {
      document.querySelectorAll(".pay-row").forEach((row, i) => {
        const name = row.querySelector("[data-name]")?.getAttribute("data-name") || "";
        const addr = row.querySelector(".copy")?.getAttribute("data-copy") || "";
        print(`  <span class="dim">[${i + 1}]</span> ${esc(name.padEnd(11))}${esc(addr)}`);
      });
      print(`<span class="dim">${ru() ? "  copy <номер> — скопировать адрес" : "  copy <n> — copy an address"}</span>`);
    },
    copy(arg) {
      const btn = document.querySelectorAll(".pay-row .copy")[Number(arg) - 1];
      if (!btn) return print(ru() ? "copy: нет такого номера" : "copy: no such number", "err");
      sx().copy?.(btn.getAttribute("data-copy") || "");
      print(ru() ? "скопировано ✓" : "copied ✓", "ok");
    },
    neofetch,
    time() {
      const f = (tz) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
      print(`  khabarovsk   ${f("Asia/Vladivostok")}\n  moscow       ${f("Europe/Moscow")}\n  utc          ${f("UTC")}`);
    },
    date() { COMMANDS.time(); },
    play() {
      print(ru() ? "запускаю katana.exe..." : "launching katana.exe...", "ok");
      setTimeout(() => { window.location.href = "game.html"; }, 500);
    },
    open(arg) {
      const url = links[(arg || "").toLowerCase()];
      if (!url) return print(`open: ${ru() ? "куда? есть" : "where? try"}: ${Object.keys(links).join(", ")}`, "err");
      window.open(url, "_blank", "noopener");
      print(`→ ${esc(url)}`, "ok");
    },
    lang() { sx().toggleLang?.(); print(`lang → ${sx().lang}`, "ok"); },
    sound() { sx().toggleSound?.(); print(ru() ? "звук переключён" : "sound toggled", "ok"); },
    ls() { print("about.txt  projects/  katana.exe*  secrets/  .bash_history"); },
    "ls -la": () => COMMANDS.ls(),
    cat(arg) {
      if (arg === "about.txt") return COMMANDS.about();
      if (arg === ".bash_history") return print("sudo rm -rf /\nvim prod.conf\n:q!\n:q!!!\nexit\nexit\nкак выйти из vim", "dim");
      if (arg && arg.startsWith("secrets")) return print(ru() ? "permission denied. даже для root." : "permission denied. even for root.", "err");
      print(`cat: ${esc(arg || "")}: ${ru() ? "нет такого файла" : "no such file"}`, "err");
    },
    cd(arg) {
      if (arg && arg.startsWith("secrets")) return print(ru() ? "cd: там темно и страшно" : "cd: it's dark in there", "err");
      if (arg && arg.startsWith("projects")) return COMMANDS.projects();
      print(ru() ? "ты и так дома." : "you're already home.");
    },
    pwd() { print("/home/guest/sysrootix.com"); },
    sudo(arg) {
      if (/^rm\s+-rf\s+\/?\*?$/.test(arg || "")) return crash();
      print(ru() ? "guest is not in the sudoers file. этот инцидент будет записан." : "guest is not in the sudoers file. This incident will be reported.", "err");
    },
    rm(arg) {
      if (/^-rf\s+\/?\*?$/.test(arg || "")) return crash();
      print(`rm: ${ru() ? "отказано" : "denied"}`, "err");
    },
    matrix,
    ping() { print(`PING sysrootix.com: 64 bytes, time=${(Math.random() * 20 + 3).toFixed(1)} ms\n${ru() ? "жив." : "alive."}`, "ok"); },
    uptime() { print(`up ${Math.round(performance.now() / 1000)}s, 1 user, load average: 0.42, 0.13, 0.37`); },
    vim() { print(ru() ? "ты вошёл в vim. выхода нет. (шучу: exit)" : "you entered vim. there is no escape. (kidding: exit)", "dim"); },
    hello() { print(ru() ? "привет 👋" : "hi 👋"); },
    "привет": () => COMMANDS.hello(),
    katana() { COMMANDS.play(); },
    coffee() { print("  ( (\n   ) )\n ........\n |      |]\n \\      /\n  `----'  " + (ru() ? "держи ☕" : "here ☕")); },
    echo(arg) { print(esc(arg || "")); },
    history() { print(history.map((h, i) => `  ${i + 1}  ${esc(h)}`).join("\n")); },
    clear() { out.innerHTML = ""; },
    exit() { close(); },
  };

  function run(raw) {
    const line = raw.trim();
    print(`<span class="ok">root@sysrootix:~#</span> <span class="cmd">${esc(line)}</span>`);
    if (!line) return;
    history.push(line);
    hIdx = history.length;
    const lower = line.toLowerCase();
    if (COMMANDS[lower]) return COMMANDS[lower]();
    const [cmd, ...rest] = line.split(/\s+/);
    const fn = COMMANDS[cmd.toLowerCase()];
    if (fn) return fn(rest.join(" "));
    print(`${esc(cmd)}: command not found. ${ru() ? "попробуй" : "try"} <b class="cmd">help</b>`, "err");
  }

  function open() {
    if (!term.hidden) return;
    lastFocus = document.activeElement;
    term.hidden = false;
    document.body.style.overflow = "hidden";
    if (!booted) {
      booted = true;
      print(`<span class="dim">sysrootix tty1 · ${new Date().toUTCString()}</span>`);
      print(ru() ? "добро пожаловать. введи <b class=\"cmd\">help</b>." : "welcome. type <b class=\"cmd\">help</b>.");
    }
    setTimeout(() => input.focus(), 30);
  }

  function close() {
    if (term.hidden) return;
    term.hidden = true;
    document.body.style.overflow = "";
    lastFocus?.focus?.();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    run(v);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      hIdx = Math.max(0, hIdx - 1);
      input.value = history[hIdx] || "";
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      hIdx = Math.min(history.length, hIdx + 1);
      input.value = history[hIdx] || "";
    } else if (e.key === "Tab") {
      e.preventDefault();
      const v = input.value.toLowerCase();
      const match = Object.keys(COMMANDS).filter((k) => k.startsWith(v) && !k.includes(" "));
      if (match.length === 1) input.value = match[0];
      else if (match.length) print(match.join("  "), "dim");
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      out.innerHTML = "";
    }
  });

  closeBtn.addEventListener("click", close);
  term.addEventListener("click", (e) => {
    if (e.target === term) close();
  });
  out.addEventListener("click", () => input.focus());
  document.querySelectorAll(".js-term").forEach((b) => b.addEventListener("click", open));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !term.hidden) {
      close();
      return;
    }
    if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "`" || e.key === "~" || e.key === "ё" || e.key === "Ё") {
      e.preventDefault();
      if (term.hidden) open();
      else close();
    }
  });
})();
