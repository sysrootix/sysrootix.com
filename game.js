import * as THREE from "./assets/vendor/three.module.min.js";

// katana.exe — slice bugs, spare prod.

const L = {
  ru: {
    best: "рекорд",
    sub: "режь баги. не трогай прод.",
    lgBug: "баг · +10 · упустишь — минус жизнь",
    lgPacket: "пакет · +5",
    lgCore: "ядро · +50 · замедляет время",
    lgProd: "prod · не резать!",
    start: "начать",
    how: "веди мышкой или пальцем, чтобы резать · 3 и больше за взмах — комбо",
    again: "ещё раз",
    share: "поделиться",
    home: "← на главную",
    whyProd: "ты разрубил prod",
    whyBug: "баги уронили прод",
    newBest: "новый рекорд!",
    bestWas: "рекорд",
    copied: "ссылка скопирована",
    shareText: (n) => `Я набрал ${n} в katana.exe — попробуй побить:`,
    combo: "комбо",
    missed: "пропущен",
    prod: "PROD!",
    focus: "фокус",
  },
  en: {
    best: "best",
    sub: "slice bugs. don't touch prod.",
    lgBug: "bug · +10 · miss it, lose a life",
    lgPacket: "packet · +5",
    lgCore: "core · +50 · slows down time",
    lgProd: "prod · do not slice!",
    start: "start",
    how: "swipe with your mouse or finger to slice · 3+ in one swipe is a combo",
    again: "again",
    share: "share",
    home: "← back home",
    whyProd: "you sliced prod",
    whyBug: "bugs took prod down",
    newBest: "new best!",
    bestWas: "best",
    copied: "link copied",
    shareText: (n) => `I scored ${n} in katana.exe — try to beat it:`,
    combo: "combo",
    missed: "missed",
    prod: "PROD!",
    focus: "focus",
  },
};

const saved = localStorage.getItem("sx.lang");
const lang = saved === "ru" || saved === "en" ? saved : ((navigator.language || "").toLowerCase().startsWith("ru") ? "ru" : "en");
const T = L[lang];
document.documentElement.lang = lang;
document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = T[el.dataset.t]; });

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse = window.matchMedia("(pointer: coarse)").matches;

const $ = (id) => document.getElementById(id);
const scoreEl = $("score");
const bestEl = $("best");
const livesEl = $("lives");
const popsEl = $("pops");
const flashEl = $("flash");
const slowEl = $("slowmo");
const startEl = $("start");
const overEl = $("over");
const toastEl = $("toast");
const muteBtn = $("mute");
const music = $("music");

let best = Number(localStorage.getItem("sx.katana.best") || 0);
bestEl.textContent = best;

// ---------- renderer & scene ----------

const canvas = $("game");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.localClippingEnabled = true;
renderer.setClearColor(0x000000, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.035);
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
camera.position.set(0, 0, 10);

scene.add(new THREE.AmbientLight(0xf3f0e8, 0.35));
const key = new THREE.DirectionalLight(0xf3f0e8, 2.2);
key.position.set(3, 5, 8);
scene.add(key);
const rim = new THREE.PointLight(0xff4a3d, 18, 30, 1.6);
rim.position.set(-6, -3, 3);
scene.add(rim);
const rim2 = new THREE.PointLight(0x99ccff, 10, 30, 1.6);
rim2.position.set(6, 4, 2);
scene.add(rim2);

let halfH = 1;
let halfW = 1;
let objScale = 1;

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  halfH = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  halfW = halfH * camera.aspect;
  objScale = THREE.MathUtils.clamp(halfW / 3.6, 0.62, 1);
  trail.width = Math.floor(w * dpr);
  trail.height = Math.floor(h * dpr);
  tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ---------- backdrop: stars, petals, giant sigil ----------

const stars = (() => {
  const n = 1400;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i += 1) {
    pos[i * 3] = (Math.random() - 0.5) * 120;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 70;
    pos[i * 3 + 2] = -20 - Math.random() * 60;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ color: 0xf3f0e8, size: 0.12, transparent: true, opacity: 0.7, depthWrite: false, fog: false });
  const p = new THREE.Points(g, m);
  scene.add(p);
  return p;
})();

const sigil = (() => {
  const R = 9;
  const pts = [];
  const order = [0, 2, 4, 1, 3, 0];
  order.forEach((k) => {
    const a = -Math.PI / 2 + (k * Math.PI * 2) / 5;
    pts.push(new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R, 0));
  });
  const g = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color: 0xf3f0e8, transparent: true, opacity: 0.09, fog: false });
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
  const circle = [];
  for (let i = 0; i <= 128; i += 1) {
    const a = (i / 128) * Math.PI * 2;
    circle.push(new THREE.Vector3(Math.cos(a) * R * 1.12, Math.sin(a) * R * 1.12, 0));
  }
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(circle), mat));
  g.position.set(0, 0, -22);
  scene.add(g);
  return g;
})();

const PETALS = coarse ? 70 : 140;
const petals = (() => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.09, 0.07, 0, 0.2);
  shape.quadraticCurveTo(-0.09, 0.07, 0, 0);
  const g = new THREE.ShapeGeometry(shape);
  const m = new THREE.MeshBasicMaterial({ color: 0xf3f0e8, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false });
  const mesh = new THREE.InstancedMesh(g, m, PETALS);
  const data = Array.from({ length: PETALS }, () => ({
    p: new THREE.Vector3((Math.random() - 0.5) * 30, Math.random() * 20 - 10, -Math.random() * 14 - 1),
    r: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
    s: 0.4 + Math.random() * 0.9,
    v: 0.3 + Math.random() * 0.6,
    w: Math.random() * 6,
  }));
  scene.add(mesh);
  return { mesh, data };
})();

const dummy = new THREE.Object3D();
function updateBackdrop(dt, time) {
  petals.data.forEach((d, i) => {
    d.p.y -= d.v * dt;
    d.p.x += Math.sin(time * 0.6 + d.w) * 0.25 * dt + 0.15 * dt;
    d.r.x += dt * 0.8 * d.s;
    d.r.y += dt * 0.6;
    if (d.p.y < -12) {
      d.p.y = 12;
      d.p.x = (Math.random() - 0.5) * 30;
    }
    dummy.position.copy(d.p);
    dummy.rotation.copy(d.r);
    dummy.scale.setScalar(d.s);
    dummy.updateMatrix();
    petals.mesh.setMatrixAt(i, dummy.matrix);
  });
  petals.mesh.instanceMatrix.needsUpdate = true;
  sigil.rotation.z = time * 0.03;
  stars.rotation.z = time * 0.004;
}

// ---------- object factory ----------

const TYPES = {
  bug: { points: 10, radius: 0.5 },
  packet: { points: 5, radius: 0.48 },
  core: { points: 50, radius: 0.52 },
  prod: { points: 0, radius: 0.72 },
};

const geoBug = new THREE.IcosahedronGeometry(0.46, 0);
const geoSpike = new THREE.ConeGeometry(0.07, 0.34, 5);
const geoPacket = new THREE.BoxGeometry(0.62, 0.62, 0.62);
const geoCore = new THREE.DodecahedronGeometry(0.44, 0);
const geoProd = new THREE.BoxGeometry(1.0, 1.2, 0.56);

function prodTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 320;
  const g = c.getContext("2d");
  g.fillStyle = "#0b0d0c";
  g.fillRect(0, 0, 256, 320);
  for (let i = 0; i < 6; i += 1) {
    const y = 18 + i * 46;
    g.fillStyle = "#151816";
    g.fillRect(14, y, 228, 36);
    g.strokeStyle = "#2a2e2c";
    g.strokeRect(14.5, y + 0.5, 227, 35);
    for (let k = 0; k < 4; k += 1) {
      g.fillStyle = Math.random() < 0.8 ? "#7dffa8" : "#ffcf6b";
      g.fillRect(28 + k * 14, y + 14, 7, 7);
    }
    g.fillStyle = "#222";
    for (let k = 0; k < 10; k += 1) g.fillRect(120 + k * 11, y + 8, 5, 20);
  }
  g.fillStyle = "#ff4a3d";
  g.font = "bold 44px monospace";
  g.textAlign = "center";
  g.fillText("PROD", 128, 300);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const prodTex = prodTexture();

function edges(geo, color, opacity = 0.9) {
  return new THREE.LineSegments(
    new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

function make(type) {
  const g = new THREE.Group();
  if (type === "bug") {
    const core = new THREE.Mesh(geoBug, new THREE.MeshStandardMaterial({
      color: 0x2a0404, emissive: 0xff2a1f, emissiveIntensity: 0.9, roughness: 0.35, metalness: 0.2, flatShading: true,
    }));
    g.add(core);
    g.add(edges(geoBug, 0xff8a7a, 0.8));
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0x1a0202, emissive: 0xff3b2e, emissiveIntensity: 0.6, flatShading: true });
    const pos = geoBug.attributes.position;
    const seen = new Set();
    for (let i = 0; i < pos.count; i += 1) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const k = v.toArray().map((x) => x.toFixed(2)).join();
      if (seen.has(k)) continue;
      seen.add(k);
      const s = new THREE.Mesh(geoSpike, spikeMat);
      s.position.copy(v).multiplyScalar(1.12);
      s.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
      g.add(s);
    }
  } else if (type === "packet") {
    g.add(new THREE.Mesh(geoPacket, new THREE.MeshStandardMaterial({
      color: 0xf3f0e8, emissive: 0x2a2826, roughness: 0.25, metalness: 0.55,
    })));
    g.add(edges(geoPacket, 0xffffff, 1));
  } else if (type === "core") {
    g.add(new THREE.Mesh(geoCore, new THREE.MeshStandardMaterial({
      color: 0xfff1c2, emissive: 0xffc860, emissiveIntensity: 1.3, roughness: 0.2, metalness: 0.6, flatShading: true,
    })));
    g.add(edges(geoCore, 0xffffff, 1));
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.012, 6, 64),
      new THREE.MeshBasicMaterial({ color: 0xffe3a0, transparent: true, opacity: 0.8 }),
    );
    halo.userData.spin = true;
    g.add(halo);
  } else {
    const side = new THREE.MeshStandardMaterial({ color: 0x1a1d1b, roughness: 0.5, metalness: 0.7 });
    const front = new THREE.MeshStandardMaterial({ map: prodTex, emissive: 0xffffff, emissiveMap: prodTex, emissiveIntensity: 0.7, roughness: 0.4 });
    g.add(new THREE.Mesh(geoProd, [side, side, side, side, front, side]));
    g.add(edges(geoProd, 0x7dffa8, 0.6));
  }
  g.traverse((o) => {
    if (o.material) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => { m.side = THREE.DoubleSide; });
    }
  });
  return g;
}

// ---------- sparks ----------

const SPARKS = 900;
const sparkGeo = new THREE.BufferGeometry();
const sparkPos = new Float32Array(SPARKS * 3);
const sparkCol = new Float32Array(SPARKS * 3);
const sparkVel = new Float32Array(SPARKS * 3);
const sparkLife = new Float32Array(SPARKS);
sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
sparkGeo.setAttribute("color", new THREE.BufferAttribute(sparkCol, 3));
const sparkMat = new THREE.PointsMaterial({
  size: 0.09, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
});
const sparkPts = new THREE.Points(sparkGeo, sparkMat);
sparkPts.frustumCulled = false;
scene.add(sparkPts);
let sparkHead = 0;
for (let i = 0; i < SPARKS; i += 1) sparkPos[i * 3 + 1] = -999;

function burst(at, color, n = 40, speed = 5) {
  const c = new THREE.Color(color);
  for (let k = 0; k < n; k += 1) {
    const i = sparkHead;
    sparkHead = (sparkHead + 1) % SPARKS;
    const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    const s = speed * (0.3 + Math.random());
    sparkPos.set([at.x, at.y, at.z], i * 3);
    sparkVel.set([dir.x * s, dir.y * s + 1.5, dir.z * s], i * 3);
    const white = Math.random() < 0.35;
    sparkCol.set(white ? [1, 1, 1] : [c.r, c.g, c.b], i * 3);
    sparkLife[i] = 0.5 + Math.random() * 0.6;
  }
}

function updateSparks(dt) {
  for (let i = 0; i < SPARKS; i += 1) {
    if (sparkLife[i] <= 0) continue;
    sparkLife[i] -= dt;
    sparkVel[i * 3 + 1] -= 9 * dt;
    sparkPos[i * 3] += sparkVel[i * 3] * dt;
    sparkPos[i * 3 + 1] += sparkVel[i * 3 + 1] * dt;
    sparkPos[i * 3 + 2] += sparkVel[i * 3 + 2] * dt;
    const f = Math.max(0, Math.min(1, sparkLife[i] * 2));
    sparkCol[i * 3] *= 0.985 + 0.015 * f;
    sparkCol[i * 3 + 1] *= 0.97 + 0.03 * f;
    sparkCol[i * 3 + 2] *= 0.96 + 0.04 * f;
    if (sparkLife[i] <= 0) sparkPos[i * 3 + 1] = -999;
  }
  sparkGeo.attributes.position.needsUpdate = true;
  sparkGeo.attributes.color.needsUpdate = true;
}

// ---------- audio ----------

let actx = null;
let muted = localStorage.getItem("sx.sfx") === "0";
muteBtn.setAttribute("aria-pressed", muted ? "true" : "false");

function audio() {
  if (!actx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    actx = new AC();
  }
  if (actx.state === "suspended") actx.resume();
  return actx;
}

function noiseBuffer(ctx) {
  if (noiseBuffer.buf) return noiseBuffer.buf;
  const b = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i += 1) d[i] = Math.random() * 2 - 1;
  noiseBuffer.buf = b;
  return b;
}

function sfx(kind) {
  if (muted) return;
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const out = ctx.createGain();
  out.connect(ctx.destination);

  const tone = (freq, type, start, dur, vol, slide) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, now + start);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, now + start + dur);
    g.gain.setValueAtTime(0.0001, now + start);
    g.gain.exponentialRampToValueAtTime(vol, now + start + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
    o.connect(g).connect(out);
    o.start(now + start);
    o.stop(now + start + dur + 0.05);
  };
  const hiss = (start, dur, vol, from, to) => {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuffer(ctx);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(from, now + start);
    f.frequency.exponentialRampToValueAtTime(to, now + start + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now + start);
    g.gain.exponentialRampToValueAtTime(vol, now + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
    s.connect(f).connect(g).connect(out);
    s.start(now + start);
    s.stop(now + start + dur + 0.05);
  };

  if (kind === "swish") hiss(0, 0.18, 0.12, 900, 4200);
  if (kind === "slice") {
    hiss(0, 0.09, 0.3, 5000, 9000);
    tone(2400 + Math.random() * 600, "triangle", 0, 0.35, 0.08, 3200);
    tone(620, "sine", 0, 0.12, 0.12, 180);
  }
  if (kind === "core") [880, 1320, 1760, 2640].forEach((f, i) => tone(f, "sine", i * 0.06, 0.5, 0.08));
  if (kind === "prod") {
    tone(110, "sawtooth", 0, 0.6, 0.22, 40);
    tone(116, "square", 0, 0.5, 0.1, 50);
    hiss(0, 0.4, 0.25, 400, 120);
  }
  if (kind === "miss") tone(180, "sine", 0, 0.3, 0.2, 70);
  if (kind === "combo") [660, 990, 1320].forEach((f, i) => tone(f, "triangle", i * 0.05, 0.25, 0.08));
  if (kind === "over") [440, 330, 220, 110].forEach((f, i) => tone(f, "square", i * 0.14, 0.3, 0.06));
}

muteBtn.addEventListener("click", () => {
  muted = !muted;
  localStorage.setItem("sx.sfx", muted ? "0" : "1");
  muteBtn.setAttribute("aria-pressed", muted ? "true" : "false");
  if (muted) music.pause();
  else if (state === "play") playMusic();
});

function playMusic() {
  if (muted || localStorage.getItem("sx.sound") === "0") return;
  music.volume = 0.25;
  music.play().catch(() => {});
}

// ---------- game state ----------

let state = "menu";
let score = 0;
let lives = 3;
let objects = [];
let halves = [];
let spawnIn = 1;
let elapsed = 0;
let timeScale = 1;
let slowUntil = 0;
let shake = 0;
let hitStop = 0;
let strokeHits = 0;
let strokeTimer = 0;
let strokeCenter = { x: 0, y: 0 };

function setLives() {
  [...livesEl.children].forEach((el, i) => el.classList.toggle("off", i >= lives));
}

function setScore(v) {
  score = v;
  scoreEl.textContent = score;
  scoreEl.classList.remove("bump");
  void scoreEl.offsetWidth;
  scoreEl.classList.add("bump");
}

function pop(text, x, y, cls = "") {
  const el = document.createElement("div");
  el.className = `pop ${cls}`;
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  popsEl.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

function toast(text) {
  toastEl.textContent = text;
  toastEl.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => toastEl.classList.remove("show"), 1600);
}

function level() {
  return 1 + elapsed / 22 + score / 260;
}

function pickType() {
  const lv = level();
  const r = Math.random();
  const prod = Math.min(0.2, 0.06 + lv * 0.025);
  if (r < prod && elapsed > 4) return "prod";
  if (r < prod + 0.035) return "core";
  if (r < prod + 0.035 + 0.28) return "packet";
  return "bug";
}

const G = 9.2;

function spawnWave() {
  const lv = level();
  const count = 1 + Math.floor(Math.random() * Math.min(4, lv));
  for (let i = 0; i < count; i += 1) {
    setTimeout(() => {
      if (state !== "play") return;
      const type = pickType();
      const obj = make(type);
      const x0 = (Math.random() - 0.5) * halfW * 1.4;
      const y0 = -halfH - 1.2;
      const apex = halfH * (0.1 + Math.random() * 0.62);
      const vy = Math.sqrt(2 * G * (apex - y0));
      const flight = (2 * vy) / G;
      const x1 = (Math.random() - 0.5) * halfW * 1.2;
      obj.position.set(x0, y0, (Math.random() - 0.5) * 2);
      obj.scale.setScalar(objScale);
      obj.userData = {
        type,
        v: new THREE.Vector3((x1 - x0) / flight, vy, 0),
        w: new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3),
        r: TYPES[type].radius,
      };
      scene.add(obj);
      objects.push(obj);
    }, i * (120 + Math.random() * 180));
  }
}

function start() {
  audio();
  playMusic();
  objects.forEach((o) => scene.remove(o));
  halves.forEach((h) => scene.remove(h.obj));
  objects = [];
  halves = [];
  score = 0;
  scoreEl.textContent = "0";
  lives = 3;
  setLives();
  elapsed = 0;
  spawnIn = 0.6;
  timeScale = 1;
  slowUntil = 0;
  state = "play";
  startEl.hidden = true;
  overEl.hidden = true;
}

function gameOver(why) {
  if (state !== "play") return;
  state = "over";
  sfx("over");
  const isBest = score > best;
  if (isBest) {
    best = score;
    localStorage.setItem("sx.katana.best", String(best));
    bestEl.textContent = best;
  }
  $("over-why").textContent = why;
  $("final").textContent = score;
  $("over-best").textContent = isBest && score > 0 ? T.newBest : `${T.bestWas}: ${best}`;
  setTimeout(() => {
    overEl.hidden = false;
    $("again").focus();
  }, 700);
}

function loseLife(x, y, text) {
  lives -= 1;
  setLives();
  shake = Math.max(shake, 0.35);
  flashEl.classList.add("on");
  setTimeout(() => flashEl.classList.remove("on"), 80);
  pop(text, x, y, "bad");
  if (navigator.vibrate) navigator.vibrate(lives <= 0 ? [60, 40, 120] : 40);
  return lives <= 0;
}

$("go").addEventListener("click", start);
$("again").addEventListener("click", start);
$("share").addEventListener("click", async () => {
  const url = "https://sysrootix.com/game.html";
  const text = `${T.shareText(score)} ${url}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "katana.exe", text: T.shareText(score), url });
      return;
    }
    await navigator.clipboard.writeText(text);
    toast(T.copied);
  } catch {
    // user cancelled share sheet
  }
});

window.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && state !== "play" && document.activeElement?.tagName !== "BUTTON") {
    e.preventDefault();
    start();
  }
});

// ---------- slicing ----------

const trail = $("trail");
const tctx = trail.getContext("2d");
let trailPts = [];
let pointerDown = false;
let lastPt = null;
let lastSwish = 0;
const slashes = [];

function toScreen(v) {
  const p = v.clone().project(camera);
  return { x: (p.x * 0.5 + 0.5) * window.innerWidth, y: (-p.y * 0.5 + 0.5) * window.innerHeight };
}

function pixelsPerUnit(z) {
  const dist = camera.position.z - z;
  return window.innerHeight / 2 / (dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
}

function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len));
  const cx = ax + dx * t;
  const cy = ay + dy * t;
  return Math.hypot(px - cx, py - cy);
}

function onMove(x, y, t) {
  const now = t || performance.now();
  if (lastPt) {
    const dt = Math.max(1, now - lastPt.t);
    const dist = Math.hypot(x - lastPt.x, y - lastPt.y);
    const speed = dist / dt;
    const slicing = (pointerDown || !coarse) && speed > (pointerDown ? 0.25 : 0.6);
    if (slicing) {
      trailPts.push({ x, y, t: now });
      if (now - lastSwish > 140 && speed > 1.2 && state === "play") {
        lastSwish = now;
        sfx("swish");
      }
      if (state === "play") trySlice(lastPt.x, lastPt.y, x, y);
    }
  }
  lastPt = { x, y, t: now };
}

trail.addEventListener("pointerdown", (e) => {
  pointerDown = true;
  lastPt = { x: e.clientX, y: e.clientY, t: performance.now() };
  trailPts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
  trail.setPointerCapture?.(e.pointerId);
});
trail.addEventListener("pointermove", (e) => {
  const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  (evs.length ? evs : [e]).forEach((ev) => onMove(ev.clientX, ev.clientY, ev.timeStamp || performance.now()));
});
const up = () => {
  pointerDown = false;
  if (coarse) lastPt = null;
};
trail.addEventListener("pointerup", up);
trail.addEventListener("pointercancel", up);
trail.addEventListener("pointerleave", () => { lastPt = null; });

function trySlice(ax, ay, bx, by) {
  const dirX = bx - ax;
  const dirY = by - ay;
  const len = Math.hypot(dirX, dirY) || 1;
  for (const obj of [...objects]) {
    const c = toScreen(obj.position);
    const r = obj.userData.r * objScale * pixelsPerUnit(obj.position.z) * 1.1;
    if (segDist(c.x, c.y, ax, ay, bx, by) < r) {
      cut(obj, dirX / len, dirY / len, c);
    }
  }
}

function cut(obj, sx, sy, screen) {
  objects = objects.filter((o) => o !== obj);
  scene.remove(obj);
  const type = obj.userData.type;

  // Swipe direction in world space (screen y is flipped); the cut plane contains it.
  const swipe = new THREE.Vector3(sx, -sy, 0).normalize();
  const normal = new THREE.Vector3(-swipe.y, swipe.x, (Math.random() - 0.5) * 0.3).normalize();
  obj.updateMatrixWorld(true);
  const worldPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, obj.position);
  const inv = obj.matrixWorld.clone().invert();
  const localPlane = worldPlane.clone().applyMatrix4(inv);

  [1, -1].forEach((sign) => {
    const half = obj.clone(true);
    const lp = localPlane.clone();
    if (sign < 0) lp.negate();
    const wp = new THREE.Plane();
    half.traverse((o) => {
      if (!o.material) return;
      const clone = (m) => {
        const c = m.clone();
        c.clippingPlanes = [wp];
        c.transparent = true;
        return c;
      };
      o.material = Array.isArray(o.material) ? o.material.map(clone) : clone(o.material);
    });
    const v = obj.userData.v.clone().multiplyScalar(0.6).addScaledVector(normal, -sign * 2.6);
    v.y += 1.2;
    const w = obj.userData.w.clone().multiplyScalar(1.5).add(new THREE.Vector3(0, 0, sign * 5));
    scene.add(half);
    halves.push({ obj: half, v, w, lp, wp, life: 1.6 });
  });

  const color = { bug: 0xff4a3d, packet: 0xf3f0e8, core: 0xffd98a, prod: 0x7dffa8 }[type];
  burst(obj.position, color, type === "core" ? 90 : 46, type === "prod" ? 7 : 5);
  slashes.push({ x: screen.x, y: screen.y, dx: sx, dy: sy, t: performance.now(), color: type === "prod" ? "#ff4a3d" : "#ffffff" });
  hitStop = type === "prod" ? 0.12 : 0.035;

  if (type === "prod") {
    sfx("prod");
    shake = 0.6;
    if (loseLife(screen.x, screen.y - 30, T.prod)) gameOver(T.whyProd);
    return;
  }

  sfx("slice");
  shake = Math.max(shake, 0.08);
  let gain = TYPES[type].points;
  strokeHits += 1;
  strokeTimer = 0.32;
  strokeCenter = screen;
  if (type === "core") {
    sfx("core");
    slowUntil = performance.now() + 2600;
    pop(`+${gain} · ${T.focus}`, screen.x, screen.y - 20);
  } else {
    pop(`+${gain}`, screen.x, screen.y - 20);
  }
  setScore(score + gain);
}

function endStroke() {
  if (strokeHits >= 3) {
    const bonus = strokeHits * 10;
    setScore(score + bonus);
    sfx("combo");
    pop(`${T.combo} x${strokeHits} +${bonus}`, Math.min(window.innerWidth - 120, Math.max(120, strokeCenter.x)), strokeCenter.y - 70, "combo");
    shake = Math.max(shake, 0.2);
  }
  strokeHits = 0;
}

function drawTrail(now) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  tctx.clearRect(0, 0, w, h);
  trailPts = trailPts.filter((p) => now - p.t < 170);
  if (trailPts.length > 1) {
    tctx.lineCap = "round";
    tctx.lineJoin = "round";
    for (let i = 1; i < trailPts.length; i += 1) {
      const a = trailPts[i - 1];
      const b = trailPts[i];
      if (b.t - a.t > 80) continue;
      const k = i / trailPts.length;
      const age = 1 - (now - b.t) / 170;
      tctx.strokeStyle = `rgba(255,255,255,${0.9 * age})`;
      tctx.shadowColor = "rgba(255,255,255,0.9)";
      tctx.shadowBlur = 16;
      tctx.lineWidth = 1 + k * 5 * age;
      tctx.beginPath();
      tctx.moveTo(a.x, a.y);
      tctx.lineTo(b.x, b.y);
      tctx.stroke();
    }
    tctx.shadowBlur = 0;
  }
  for (let i = slashes.length - 1; i >= 0; i -= 1) {
    const s = slashes[i];
    const age = (now - s.t) / 260;
    if (age > 1) {
      slashes.splice(i, 1);
      continue;
    }
    const L1 = 140 + age * 80;
    tctx.strokeStyle = s.color;
    tctx.globalAlpha = 1 - age;
    tctx.lineWidth = 3 * (1 - age) + 0.5;
    tctx.shadowColor = s.color;
    tctx.shadowBlur = 24;
    tctx.beginPath();
    tctx.moveTo(s.x - s.dx * L1, s.y - s.dy * L1);
    tctx.lineTo(s.x + s.dx * L1, s.y + s.dy * L1);
    tctx.stroke();
    tctx.globalAlpha = 1;
    tctx.shadowBlur = 0;
  }
}

// ---------- loop ----------

let last = performance.now();
let running = true;

function frame(now) {
  if (!running) return;
  const raw = Math.min(0.05, (now - last) / 1000);
  last = now;
  const time = now / 1000;

  const slow = now < slowUntil;
  slowEl.classList.toggle("on", slow);
  const targetScale = slow ? 0.38 : 1;
  timeScale += (targetScale - timeScale) * Math.min(1, raw * 6);
  let dt = raw * timeScale;
  if (hitStop > 0) {
    hitStop -= raw;
    dt *= 0.05;
  }

  updateBackdrop(raw, time);
  updateSparks(dt);

  if (state === "play") {
    elapsed += dt;
    spawnIn -= dt;
    if (spawnIn <= 0) {
      spawnWave();
      const lv = level();
      spawnIn = Math.max(0.55, 1.7 - lv * 0.14) + Math.random() * 0.5;
    }
  }

  for (const o of [...objects]) {
    const d = o.userData;
    d.v.y -= G * dt;
    o.position.addScaledVector(d.v, dt);
    o.rotation.x += d.w.x * dt;
    o.rotation.y += d.w.y * dt;
    o.rotation.z += d.w.z * dt;
    o.children.forEach((c) => { if (c.userData.spin) c.rotation.x += dt * 3; });
    if (o.position.y < -halfH - 2 && d.v.y < 0) {
      objects = objects.filter((x) => x !== o);
      scene.remove(o);
      if (d.type === "bug" && state === "play") {
        sfx("miss");
        const sp = toScreen(new THREE.Vector3(o.position.x, -halfH, 0));
        if (loseLife(Math.min(window.innerWidth - 60, Math.max(60, sp.x)), window.innerHeight - 70, T.missed)) gameOver(T.whyBug);
      }
    }
  }

  for (const h of [...halves]) {
    h.v.y -= G * dt;
    h.obj.position.addScaledVector(h.v, dt);
    h.obj.rotation.x += h.w.x * dt;
    h.obj.rotation.y += h.w.y * dt;
    h.obj.rotation.z += h.w.z * dt;
    h.obj.updateMatrixWorld(true);
    h.wp.copy(h.lp).applyMatrix4(h.obj.matrixWorld);
    h.life -= dt;
    const fade = Math.max(0, Math.min(1, h.life / 0.5));
    h.obj.traverse((o) => {
      if (!o.material) return;
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.opacity = fade; });
    });
    if (h.life <= 0 || h.obj.position.y < -halfH - 3) {
      scene.remove(h.obj);
      h.obj.traverse((o) => {
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      halves = halves.filter((x) => x !== h);
    }
  }

  if (strokeTimer > 0) {
    strokeTimer -= raw;
    if (strokeTimer <= 0) endStroke();
  }

  shake = Math.max(0, shake - raw * 1.6);
  const sAmt = reduce ? 0 : shake * shake * 0.9;
  camera.position.x = (Math.random() - 0.5) * sAmt;
  camera.position.y = (Math.random() - 0.5) * sAmt;
  camera.rotation.z = (Math.random() - 0.5) * sAmt * 0.05;
  rim.intensity = 18 + Math.sin(time * 2) * 4;

  renderer.render(scene, camera);
  drawTrail(now);
  requestAnimationFrame(frame);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    running = false;
    music.pause();
  } else {
    running = true;
    last = performance.now();
    if (state === "play") playMusic();
    requestAnimationFrame(frame);
  }
});

window.addEventListener("resize", resize, { passive: true });
resize();
requestAnimationFrame(frame);
