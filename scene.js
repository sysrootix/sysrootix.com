import * as THREE from "./assets/vendor/three.module.min.js";

// Particle sigil: thousands of points that morph between shapes as the page scrolls.
// 0 pentagram · 1 globe · 2 infrastructure lattice · 3 katana · 4 galaxy

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse = window.matchMedia("(pointer: coarse)").matches;
const canvas = document.getElementById("scene");

function supportsGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

if (canvas && supportsGL()) {
  try {
    start();
    document.documentElement.classList.add("gl");
  } catch (err) {
    console.warn("scene disabled", err);
  }
}

function start() {
  const COUNT = coarse || window.innerWidth < 760 ? 5200 : 9000;
  const R = 1.55;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  const rand = mulberry(20260924);
  const shapes = [pentagram, globe, lattice, katana, galaxy].map((fn) => fn(COUNT, R, rand));
  const geo = new THREE.BufferGeometry();
  shapes.forEach((arr, i) => geo.setAttribute(i === 0 ? "position" : `p${i}`, new THREE.BufferAttribute(arr, 3)));
  const meta = new Float32Array(COUNT * 4);
  for (let i = 0; i < COUNT; i += 1) {
    const big = rand() < 0.06;
    meta[i * 4] = big ? 1.8 + rand() * 1.8 : 0.55 + rand() * 0.9;
    meta[i * 4 + 1] = rand();
    meta[i * 4 + 2] = 0.4 + rand() * 1.6;
    meta[i * 4 + 3] = rand();
  }
  geo.setAttribute("meta", new THREE.BufferAttribute(meta, 4));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);

  const uniforms = {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uMouse: { value: new THREE.Vector3(99, 99, 0) },
    uRepel: { value: 0 },
    uPixel: { value: 1 },
    uSize: { value: coarse ? 26 : 30 },
    uOpacity: { value: 0 },
    uPulse: { value: 0 },
    uPulseAt: { value: new THREE.Vector3() },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute vec3 p1;
      attribute vec3 p2;
      attribute vec3 p3;
      attribute vec3 p4;
      attribute vec4 meta;
      uniform float uTime;
      uniform float uMorph;
      uniform vec3 uMouse;
      uniform float uRepel;
      uniform float uPixel;
      uniform float uSize;
      uniform float uPulse;
      uniform vec3 uPulseAt;
      varying float vAlpha;
      varying float vHot;

      vec3 pick(float i) {
        if (i < 0.5) return position;
        if (i < 1.5) return p1;
        if (i < 2.5) return p2;
        if (i < 3.5) return p3;
        return p4;
      }

      void main() {
        float m = clamp(uMorph, 0.0, 4.0);
        float i = floor(m);
        float f = clamp((m - i - meta.y * 0.35) / 0.65, 0.0, 1.0);
        f = f * f * (3.0 - 2.0 * f);
        vec3 a = pick(i);
        vec3 b = pick(min(i + 1.0, 4.0));
        vec3 pos = mix(a, b, f);

        float swirl = sin(f * 3.14159);
        float ph = meta.y * 6.2831;
        pos += vec3(sin(ph + uTime * 0.7), cos(ph * 1.3 + uTime * 0.5), sin(ph * 0.7 - uTime * 0.6)) * swirl * 0.9;
        pos += vec3(sin(uTime * meta.z + ph), cos(uTime * meta.z * 0.8 + ph), sin(uTime * meta.z * 0.6 + ph * 2.0)) * 0.018;

        vec4 world = modelMatrix * vec4(pos, 1.0);
        vec3 d = world.xyz - uMouse;
        float dist = length(d.xy);
        float push = uRepel * exp(-dist * dist * 3.2);
        world.xyz += normalize(d + vec3(0.0, 0.0, 0.001)) * push * 0.55;

        vec3 pd = world.xyz - uPulseAt;
        float pr = length(pd);
        float wave = exp(-pow(pr - (1.0 - uPulse) * 3.5, 2.0) * 6.0) * uPulse;
        world.xyz += normalize(pd + vec3(0.0001)) * wave * 0.7;

        vec4 mv = viewMatrix * world;
        gl_Position = projectionMatrix * mv;
        float twinkle = 0.75 + 0.25 * sin(uTime * meta.z * 2.0 + ph);
        gl_PointSize = uSize * meta.x * uPixel * twinkle / -mv.z;
        vAlpha = (0.35 + 0.65 * meta.w) * (0.6 + push * 1.2 + wave * 1.5);
        vHot = step(0.955, meta.w) + push * 0.6;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying float vAlpha;
      varying float vHot;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        a = pow(a, 1.8);
        vec3 cream = vec3(0.953, 0.941, 0.910);
        vec3 ember = vec3(1.0, 0.24, 0.22);
        vec3 col = mix(cream, ember, clamp(vHot, 0.0, 1.0));
        gl_FragColor = vec4(col, a * vAlpha * uOpacity);
      }
    `,
  });

  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  // Two faint rings that orbit the shape for depth.
  const ringMat = new THREE.LineBasicMaterial({ color: 0xf3f0e8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const rings = [2.35, 2.75].map((r, i) => {
    const pts = [];
    for (let k = 0; k <= 180; k += 1) {
      const a = (k / 180) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
    }
    const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), ringMat);
    line.rotation.x = 1.2 + i * 0.35;
    line.rotation.y = i * 0.6;
    group.add(line);
    return line;
  });

  const sections = [...document.querySelectorAll("[data-shape]")];
  let targetMorph = 0;
  let morph = 0;
  let pointer = { x: 0, y: 0, active: false };
  let tilt = { x: 0, y: 0 };
  let repel = 0;
  let pulse = 0;
  let spin = 0;
  let visible = true;
  let last = performance.now();
  let fadeIn = 0;
  let heroFade = 0;
  let layout = { heroX: 0, heroY: 0, sideX: 0 };

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    uniforms.uPixel.value = dpr;
    const aspect = w / h;
    const s = Math.max(0.52, Math.min(1, aspect * 0.78));
    group.scale.setScalar(s);
    // Keep the sigil behind the hero text on wide screens and above it on phones;
    // later shapes drift to the empty right side of the left-aligned sections.
    const halfH = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const halfW = halfH * aspect;
    if (aspect < 0.8) {
      layout = { heroX: 0, heroY: halfH * 0.36, sideX: 0 };
    } else if (w >= 1100) {
      layout = { heroX: -halfW * 0.12, heroY: 0, sideX: halfW * 0.3 };
    } else {
      layout = { heroX: 0, heroY: 0, sideX: halfW * 0.18 };
    }
  }

  function readScroll() {
    const mid = window.scrollY + window.innerHeight * 0.5;
    const centers = sections.map((el) => {
      const r = el.getBoundingClientRect();
      return { c: r.top + window.scrollY + r.height * 0.5, k: Number(el.dataset.shape) };
    });
    if (!centers.length) return;
    if (mid <= centers[0].c) {
      targetMorph = centers[0].k;
    } else if (mid >= centers[centers.length - 1].c) {
      targetMorph = centers[centers.length - 1].k;
    } else {
      for (let i = 0; i < centers.length - 1; i += 1) {
        const a = centers[i];
        const b = centers[i + 1];
        if (mid >= a.c && mid <= b.c) {
          const t = (mid - a.c) / (b.c - a.c);
          const e = Math.min(1, Math.max(0, (t - 0.25) / 0.5));
          targetMorph = a.k + (b.k - a.k) * e;
          break;
        }
      }
    }
    heroFade = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
  }

  const ndc = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  function worldFromClient(x, y, out) {
    ndc.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    ray.ray.intersectPlane(plane, out);
    return out;
  }

  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  }, { passive: true });
  window.addEventListener("pointerleave", () => { pointer.active = false; });
  document.addEventListener("pointerout", (e) => {
    if (!e.relatedTarget) pointer.active = false;
  });

  window.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button, input, dialog, .term, .card, .pay")) return;
    worldFromClient(e.clientX, e.clientY, uniforms.uPulseAt.value);
    pulse = 1;
  }, { passive: true });

  window.addEventListener("resize", () => { resize(); readScroll(); }, { passive: true });
  window.addEventListener("scroll", readScroll, { passive: true });
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible) {
      last = performance.now();
      requestAnimationFrame(frame);
    }
  });

  window.sxScene = {
    burst(x, y) {
      worldFromClient(x ?? window.innerWidth / 2, y ?? window.innerHeight / 2, uniforms.uPulseAt.value);
      pulse = 1;
    },
  };

  function frame(now) {
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const time = now / 1000;
    uniforms.uTime.value = time;

    morph += (targetMorph - morph) * Math.min(1, dt * 3.2);
    uniforms.uMorph.value = morph;

    fadeIn = Math.min(1, fadeIn + dt * 0.6);
    const hero = heroFade;
    uniforms.uOpacity.value = fadeIn * (1 - hero * 0.45);
    ringMat.opacity = fadeIn * 0.07 * (1 - hero * 0.5);

    const px = pointer.active ? pointer.x / window.innerWidth - 0.5 : 0;
    const py = pointer.active ? pointer.y / window.innerHeight - 0.5 : 0;
    tilt.x += (py * 0.5 - tilt.x) * dt * 2.5;
    tilt.y += (px * 0.7 - tilt.y) * dt * 2.5;
    spin += dt * (morph > 0.5 ? 0.16 : 0.07);
    const sway = morph < 0.5 ? Math.sin(time * 0.35) * 0.28 : spin;
    // Katana tilts forward a touch; the galaxy disc leans towards the viewer and spins on its own axis.
    const blade = Math.max(0, 1 - Math.abs(morph - 3));
    const disc = Math.max(0, Math.min(1, morph - 3));
    group.rotation.set(tilt.x + blade * 0.2 + disc * 0.95, sway * (1 - blade * 0.75) + tilt.y, 0);
    const k = Math.min(1, morph);
    group.position.x = layout.heroX + (layout.sideX - layout.heroX) * k;
    group.position.y = layout.heroY * (1 - k);
    rings[0].rotation.z = time * 0.08;
    rings[1].rotation.z = -time * 0.06;

    repel += ((pointer.active && !coarse ? 1 : 0) - repel) * dt * 3;
    uniforms.uRepel.value = repel;
    if (pointer.active) {
      worldFromClient(pointer.x, pointer.y, hit);
      uniforms.uMouse.value.lerp(hit, Math.min(1, dt * 10));
    }

    pulse = Math.max(0, pulse - dt * 0.9);
    uniforms.uPulse.value = pulse;

    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(frame);
  }

  resize();
  readScroll();
  if (reduce) {
    fadeIn = 1;
    frame(performance.now());
    window.addEventListener("scroll", () => {
      morph = targetMorph;
      requestAnimationFrame(frame);
    }, { passive: true });
  } else {
    requestAnimationFrame(frame);
  }
}

function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rand) {
  return (rand() + rand() + rand() - 1.5) / 1.5;
}

// Same pentagram as assets/logo.svg: centre (50,50), radius 40.
function pentagram(n, R, rand) {
  const out = new Float32Array(n * 3);
  const v = [[50, 90], [26.489, 17.639], [88.042, 62.361], [11.958, 62.361], [73.511, 17.639]]
    .map(([x, y]) => [((x - 50) / 40) * R, (-(y - 50) / 40) * R]);
  for (let i = 0; i < n; i += 1) {
    const r = rand();
    let x;
    let y;
    let z;
    if (r < 0.58) {
      const k = (rand() * 5) | 0;
      const a = v[k];
      const b = v[(k + 1) % 5];
      const t = rand();
      x = a[0] + (b[0] - a[0]) * t + gauss(rand) * 0.018;
      y = a[1] + (b[1] - a[1]) * t + gauss(rand) * 0.018;
      z = (rand() < 0.5 ? -1 : 1) * 0.07 + gauss(rand) * 0.02;
    } else if (r < 0.84) {
      const a = rand() * Math.PI * 2;
      const rr = R * (rand() < 0.7 ? 1.12 : 1.2) + gauss(rand) * 0.012;
      x = Math.cos(a) * rr;
      y = Math.sin(a) * rr;
      z = gauss(rand) * 0.03;
    } else {
      const a = rand() * Math.PI * 2;
      const rr = R * (0.2 + Math.sqrt(rand()) * 1.6);
      x = Math.cos(a) * rr;
      y = Math.sin(a) * rr;
      z = gauss(rand) * 0.9;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function globe(n, R, rand) {
  const out = new Float32Array(n * 3);
  const r0 = R * 0.98;
  for (let i = 0; i < n; i += 1) {
    const r = rand();
    let x;
    let y;
    let z;
    if (r < 0.62) {
      // Latitude and longitude lines.
      const onLat = rand() < 0.5;
      if (onLat) {
        const lat = (((rand() * 9) | 0) - 4) * (Math.PI / 10);
        const lon = rand() * Math.PI * 2;
        x = Math.cos(lat) * Math.cos(lon);
        y = Math.sin(lat);
        z = Math.cos(lat) * Math.sin(lon);
      } else {
        const lon = ((rand() * 12) | 0) * (Math.PI / 12);
        const lat = (rand() - 0.5) * Math.PI;
        x = Math.cos(lat) * Math.cos(lon);
        y = Math.sin(lat);
        z = Math.cos(lat) * Math.sin(lon);
      }
      x *= r0;
      y *= r0;
      z *= r0;
    } else if (r < 0.86) {
      const u = rand() * 2 - 1;
      const a = rand() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      x = s * Math.cos(a) * r0;
      y = u * r0;
      z = s * Math.sin(a) * r0;
    } else {
      // Orbiting ring of satellites.
      const a = rand() * Math.PI * 2;
      const rr = R * 1.55 + gauss(rand) * 0.04;
      const tiltA = 0.42;
      x = Math.cos(a) * rr;
      y = Math.sin(a) * rr * Math.sin(tiltA);
      z = Math.sin(a) * rr * Math.cos(tiltA);
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function lattice(n, R, rand) {
  const out = new Float32Array(n * 3);
  const g = 3;
  const s = (R * 1.7) / g;
  const half = (g * s) / 2;
  for (let i = 0; i < n; i += 1) {
    const r = rand();
    let x;
    let y;
    let z;
    if (r < 0.8) {
      const axis = (rand() * 3) | 0;
      const a = ((rand() * (g + 1)) | 0) * s - half;
      const b = ((rand() * (g + 1)) | 0) * s - half;
      const t = rand() * g * s - half;
      if (axis === 0) [x, y, z] = [t, a, b];
      else if (axis === 1) [x, y, z] = [a, t, b];
      else [x, y, z] = [a, b, t];
    } else {
      // Glowing nodes at intersections.
      x = ((rand() * (g + 1)) | 0) * s - half + gauss(rand) * 0.035;
      y = ((rand() * (g + 1)) | 0) * s - half + gauss(rand) * 0.035;
      z = ((rand() * (g + 1)) | 0) * s - half + gauss(rand) * 0.035;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function katana(n, R, rand) {
  const out = new Float32Array(n * 3);
  const L = R * 2.25;
  const ang = 0.6;
  const ca = Math.cos(ang);
  const sa = Math.sin(ang);
  const guard = -0.2 * L;
  for (let i = 0; i < n; i += 1) {
    const r = rand();
    let u;
    let v;
    let z = gauss(rand) * 0.012;
    if (r < 0.64) {
      // Blade: gently curved, tapering to a kissaki at the tip.
      const t = rand();
      u = guard + t * L * 0.7;
      const curve = t * t * 0.16;
      const width = 0.1 * (1 - Math.pow(t, 5) * 0.92);
      const edge = rand();
      v = curve + (edge < 0.45 ? -width / 2 : edge < 0.9 ? width / 2 - rand() * width * 0.2 : (rand() - 0.5) * width);
    } else if (r < 0.77) {
      // Tsuba: an oval guard seen slightly in perspective.
      const a = rand() * Math.PI * 2;
      const rr = 0.2 + rand() * 0.025;
      u = guard + Math.cos(a) * 0.035;
      v = Math.sin(a) * rr;
      z = Math.cos(a) * rr;
    } else {
      // Tsuka: wrapped handle with a diamond pattern.
      const t = rand();
      u = guard - 0.02 - t * L * 0.3;
      const side = rand() < 0.5 ? -1 : 1;
      const cross = (t * 26) % 1;
      v = rand() < 0.35 ? (cross - 0.5) * 0.12 * side : side * 0.06;
      z = gauss(rand) * 0.04;
    }
    out.set([u * ca - v * sa, u * sa + v * ca, z], i * 3);
  }
  return out;
}

function galaxy(n, R, rand) {
  const out = new Float32Array(n * 3);
  const arms = 3;
  for (let i = 0; i < n; i += 1) {
    const rr = Math.pow(rand(), 1.6) * R * 1.9;
    const arm = ((rand() * arms) | 0) * ((Math.PI * 2) / arms);
    const a = arm + rr * 1.9 + gauss(rand) * (0.35 / (rr + 0.4));
    const x = Math.cos(a) * rr + gauss(rand) * 0.06;
    const z = Math.sin(a) * rr + gauss(rand) * 0.06;
    const y = gauss(rand) * 0.12 * (1.2 - rr / (R * 1.9));
    out.set([x, y, z], i * 3);
  }
  return out;
}
