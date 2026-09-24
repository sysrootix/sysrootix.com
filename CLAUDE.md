# sysrootix.com

Personal portfolio of **sysrootix**. Static site on GitHub Pages (`CNAME` → sysrootix.com), no build step. Talk to the owner in Russian.

## Who the owner is

- Full-stack developer from **Khabarovsk** (not Vladivostok; the clock uses `Asia/Vladivostok` only because Khabarovsk shares that UTC+10 zone). Usually online 10:00–23:00 local.
- Not a sysadmin: full-stack + devops (runs own servers and deploys) + marketing (landing pages, bots, promo codes, ad reports, SEO).
- Main work (in Khabarovsk and other cities): retail chains end to end — storefront, mobile app, backend, CRM, POS/1C, servers. Plus own products.
- Main languages: TypeScript and Rust; Swift for iOS/macOS.
- Stack: React, Vite, Next.js, Expo / React Native, SwiftUI, three.js, Tailwind, PWA · Rust (axum, sqlx), Node/Express, Telegram bots and Mini Apps · PostgreSQL, Redis · Docker Compose, nginx, Caddy, EAS · 1C and Bitrix integrations.
- About 36 projects in total; only the ones below are meant for the site.

## Projects shown on the site

| project | what | stack | link |
|---|---|---|---|
| 5LB | client, sports-nutrition chain: app, PWA account, CRM, staff bot, bonuses, orders, 1C | Expo, Rust, Node, Postgres, 1C, Bitrix | https://5lb.pro |
| Medusa | client, store chain: loyalty, in-store booking, Mini App, admin, app, landings | Node, React, Postgres, Swift/Expo | https://webapp.mda-platform.top |
| RootDesk | shared inbox: all request channels into one card; internal tool first (Medusa contour), SaaS later; own card on the site, no public link | Rust, Postgres, Redis, Next.js, Docker, nginx | — |
| sysrootix.watch | own personal cinema: catalog, players, friends, watch parties, bot | React 19, Vite, Rust/axum, Postgres, PWA | https://sysrootix.watch |
| Omut | own iOS messenger: own chat + Telegram; launch planned Oct 2026 | Swift, Rust | https://omut.chat |
| CheckUsage | macOS menu bar: remaining limits of installed AI tools | Swift 6 | https://github.com/sysrootix/check-usage |
| Мой Супермаркет 3D | browser store tycoon | three.js, single HTML, PWA | https://sysrootix.github.io/supermarket-tycoon-3d/ |
| Полчища | 3D survivors in the browser, 20-minute run | three.js, single HTML, PWA | https://sysrootix.github.io/polchisha/ |
| katana.exe | slicing game on this site | three.js | game.html |

Deliberately left off the site for now: cheapai.lol (API-key shop, clashes with the portfolio image), Finansy, Exchanger, LoalityPlus, drafts and forks. Ask before adding them.
Don't publish client-internal numbers, client contacts, server addresses or anything from `.env`-type files.

## Site structure

- `index.html` — sections with `data-shape` 0–4 (hero, about, works, play, support+contact). Texts are Russian in HTML and duplicated in `script.js` → `I18N.ru` / `I18N.en`; every `data-i18n` key must exist in both.
- `script.js` — i18n, sound, clocks/hours, QR sheet, copy, boot sequence, typed status phrases, reveals, tilt cards, nav dots. Exposes `window.sx` for the terminal.
- `scene.js` — three.js particle sigil (module). Shapes: pentagram → globe → lattice → katana → galaxy, driven by scroll over `[data-shape]` sections.
- `terminal.js` — `~` easter-egg terminal; `projects`, `neofetch`, `whoami` repeat the facts above, keep them in sync.
- `game.html` / `game.js` / `game.css` — katana.exe; best score in `localStorage["sx.katana.best"]`, also shown on the main page.
- `assets/vendor/three.module.min.js` — vendored three.js r170 (no CDN).
- Bump `?v=` query strings on `styles.css` / `script.js` etc. in `index.html` when changing them (cache busting).

## Style

Black and cream monochrome (`--fg: #f3f0e8`), katana / snow / pentagram imagery, lowercase UI text, fonts Unbounded + Space Grotesk + JetBrains Mono. The only accent is ember red `#ff4a3d`, used sparingly. Must look good on phones (check 390×844) and respect `prefers-reduced-motion`.

## Layout of the works section

Six big cards (5LB, Medusa, RootDesk, sysrootix.watch, Omut, CheckUsage) and four small ones (Мой Супермаркет 3D, Полчища, katana.exe, terminal). Keep both grids even when adding projects.
