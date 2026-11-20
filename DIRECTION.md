# Tally website: direction

## Brief (from the user, 2026-11-19)

- **What:** a marketing site for Tally, an open-source macOS menu bar app that shows how much of each AI coding plan (Claude, Codex, OpenCode Go) is left, when it resets, whether you'll run out first, and what the usage would cost at API prices. Dithered visual style.
- **Who:** developers who pay for two or three AI coding plans and hit limits.
- **The one job:** in ten seconds, understand "it's the meters in my menu bar for all my AI plans", then **download it or star it on GitHub** (equal weight, the user's call).
- **Feel:** left to me (user said "you pick"); explore three.
- **Exists:** app icon, real screenshots (menu bar, panel, models treemap), a 20 s demo video, the README copy, the brand colours from the app (Claude orange, Codex white, OpenCode green, dark panel).
- **Hosting:** its own repo (separate from the app repo), static, no build step.
- **Image generation:** none; the product and code-drawn dithering are the imagery.

## Category default we refuse

Mac menu bar utility sites (Stats, iStat Menus, Bartender, CodexBar and friends) share: a centred app icon over a macOS wallpaper screenshot, "Download for macOS" black pill plus a ghost button, a 3×2 grid of feature cards with SF Symbol icons, a dark-dev-tool palette or a violet "AI" gradient. The AI-tool category colour is violet; the Mac-utility colour is system blue. Slop faces this brief would fall into: **The Dark Dev Tool** (zinc + mono + green dots) and **The Launch Page** (dark, centred, glow, tilted screenshot).

## Direction D: "the specimen" (added 2026-11-20, from the user's reference video)

- **Concept:** Tally is a specimen under glass: one live, dithered subject fills the top of the page, an editorial text block sits under it.
- **Ground** cool white `#fbfbfa` (dark `#0e0e0d` behind the switch) · **type** Newsreader for the headline (a newspaper face: the headline of your usage), the system UI face for everything else (the app itself is set in SF) · **richness** a live canvas: the Tally mascot as halftone spheres, Bayer 4×4 ordered dither on a 3 px cell, in the app's own orange / ink / green · **grammar** single screen, then four short columns.
- **Signature (16 s loop):** mascot at rest, eyes follow the pointer, one blink → blooms open into a phyllotaxis of dots → falls into the icon's three meter columns, whose top rows dim and refill like live usage → swirls back into the mascot. Reduced motion: the resting mascot, still. Paused off-screen and in hidden tabs.
- **Refused here:** the Paper Edition (no warm paper, no pill badge, no italic accent word, square-cornered buttons), violet.
- File: `explore/d.html` · shots `shots/explore-d/` · loop `shots/explore-d/video/loop.mp4`.

## Chosen: direction D (user, 2026-11-20). Full site built from it.

**Voice:** talks like the friend who already checked the dashboards for you: short, exact, numbers with units, no hype.

**Grammar** (each section answers one visitor question; editorial rules between them, a 12-column grid, the artefact on one side and the words on the other, alternating):

| Section | Visitor question |
|---|---|
| Specimen (hero) | What is this, and where do I get it? |
| In the menu bar | What will I actually see all day? |
| The panel | What does it tell me when I click? |
| Spend by model | Where did the money go? |
| What it reads | Which plans, and what does it touch on my Mac? |
| Install | How do I get it running in a minute? |
| Footer | Who made it, what's next, licence |

## Content

- **Nav:** Menu bar · Panel · Privacy · Install · GitHub
- **Hero:** as direction D (buttons, Dark switch, headline, live countdown, four columns).
- **In the menu bar.** h2 "Three small meters, next to the clock." Body: "One meter per plan, filling green, then amber, then red as you use it. Label each with the percent used, what it has cost, or its tokens, and end the row with today's total." Switch: Percent / Cost / Tokens (real menu bar crops: 31% 42% 2% $63.6 · $51.5 $11.0 $1.08 $63.6 · 99.2M 16.1M 120M $63.6). Footnote: "A green dot shows while an agent is running. ⌥⌘U opens the panel from anywhere."
- **The panel.** h2 "Click a meter and the panel tells you the rest." Notes keyed to the real screenshot:
  1. Most headroom: "The plan with the most room right now. Here, OpenCode Go with 98% left."
  2. Running now: "The session in progress and what it has cost so far: $17.55."
  3. Session and weekly: "Percent used, time to the reset, and a white tick where an even pace would put you."
  4. Runs out in ~4h 11m: "Worked out from your last hour of use, so you hear about it while there's time to finish."
  5. 19× value: "$88.98 at API prices against $4.67 of a $20 plan, over the same seven days."
- **Spend by model.** h2 "Where the money went, by model and by the plan that paid." Body: "A dithered treemap of the week. Here claude-opus-5-5 took 70%, $88.97, all of it on Claude Pro. Spend also groups by project, folding worktrees into their repo, and by tool, so Codex CLI and Pi on the same plan stay apart."
- **What it reads.** h2 "It reads what your agents already write. Nothing else leaves your Mac." Plans table (Claude Pro/Max; Codex ChatGPT Plus/Pro; OpenCode Go; OpenCode Zen; OpenAI API) and sources table (logs paths; Claude limits; Codex limits; OpenCode Go limits; prices). Close: "No account, no analytics, no server. Each login goes only to its own provider, and Tally never refreshes or rewrites one."
- **Install.** h2 "Running in under a minute." Terminal command (copy button), "or download Tally.zip". Requirements: macOS 14 Sonoma or later, Apple Silicon or Intel; Claude Code, Codex, Pi or OpenCode, signed in. Note: "Tally isn't notarized yet. The Terminal command works straight away; a zip downloaded in a browser needs one approval in System Settings → Privacy & Security → Open Anyway."
- **Footer:** dithered "Tally" wordmark (lights up under the pointer). Next up: Grok Build usage, signed builds, daily budgets, CSV export, a desktop widget. "MIT licence. Not affiliated with Anthropic, OpenAI or OpenCode." Links: GitHub, Releases, Issues.
- **Privacy in assets:** the panel screenshot's project name in the Running now badge is painted out (`img/panel.webp`).

## Hand-off

- **Files:**
  - `index.html` is the page;
  - `site.css` holds the tokens (top of the file) and all styles;
  - `site.js` runs the specimen, the countdown, the label switch, the panel notes, the copy button and the footer wordmark.
- **Images:**
  - `img/` holds the site images: WebP screenshots, with the project name painted out of the panel's Running now badge;
  - `assets/` keeps the untouched originals.
- **Collateral:**
  - `favicon.svg`, `apple-touch-icon.png`, `icon-512.png`;
  - `og.png` is shot from `og.html` at 1200×630.
- **A new section:** use `<section class="sec grid">` with a words column and an artefact column (spans of 5 and 7, or 6 and 5, alternating sides). The h2 is in Newsreader; body text goes in `.body`.
- **Debug params:** `?t=<seconds>` freezes the specimen, and `?note=<0-4>` outlines a panel note.
- **Shots:** `shots/r4` and `shots/r3-dark`; the matrix is in `shots/r3/matrix`.

## Performance (2026-11-20)

- Hosted on Vercel (https://tally-site.vercel.app), auto-deploys from `main`. `vercel.json` sets cache headers: `fonts/` 1 year immutable, `img/` 30 days, icons and og 7 days, `site.css`/`site.js` 1 hour, HTML revalidates every time.
- **Images are cached for 30 days, so give a changed image a new file name** (or visitors keep the old one).
- Newsreader is self-hosted (`fonts/newsreader-latin.woff2`, latin subset, preloaded); no Google Fonts request.
- Panel and treemap ship a 440 px 1× version via `srcset`; the 880 px originals serve 2× screens.
- Lighthouse on the live site: 100 / 100 / 100 / 100 on mobile and desktop; mobile LCP 1.3 s, 227 KiB total.

## The reel (2026-11-20)

Visitors read the resting mascot as a still image and scrolled past before it bloomed. Fixes:
- The loop now **opens on the icon** (t = 11.4 s of the 16 s loop, the same picture as `img/icon-still.webp`), so the first thing on screen is the meters swirling into the mascot.
- The rest is shorter: the bloom starts at 2.2 s (was 3.4 s); the first blink is at 1.3 s.
- A **reel** sits in the hero's bottom-right corner: pause/play, one dot per second (green = now), and a `0:04 / 0:16` timer. It also meets WCAG 2.2.2 (pause for motion over 5 s). On phones it shrinks to the button and timer. With reduced motion it starts paused on the mascot, and Play opts in.
- `?t=<seconds>` still freezes a frame and hides the reel.
