// Tally site. The specimen (hero), the countdown, and the small interactions. No dependencies.
(() => {
  const root = document.documentElement, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = (v) => getComputedStyle(root).getPropertyValue(v).trim();

  // ---------- theme switch ----------
  const sw = document.getElementById("theme");
  const setTheme = (dark) => { root.dataset.theme = dark ? "dark" : "light"; sw.setAttribute("aria-checked", dark); try { localStorage.setItem("tally-theme", dark ? "dark" : "light"); } catch (e) {} };
  setTheme(root.dataset.theme === "dark");
  sw.addEventListener("click", () => setTheme(sw.getAttribute("aria-checked") !== "true"));

  // ---------- the specimen ----------
  const hero = document.getElementById("hero"), cv = document.getElementById("spec"), ctx = cv.getContext("2d");
  const src = document.createElement("canvas"), sx = src.getContext("2d", { willReadFrequently: true });
  const B4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), cl = (x) => Math.max(0, Math.min(1, x));
  const lin = (t, a, b) => cl((t - a) / (b - a)), mix = (a, b, p) => a + (b - a) * p;

  // particles = the icon's lit cells (three columns: 20, 13 and 7 rows of 6)
  const P = []; const ROWS = [20, 13, 7];
  ROWS.forEach((rows, c) => { for (let r = 0; r < rows; r++) for (let k = 0; k < 6; k++) P.push({ c, r, k }); });
  // the mascot's dots (11×11 squircle), split into thirds so each colour lands in its own band
  const MD = []; for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) { const u = (x - 5) / 5.4, v = (y - 5) / 5.4; if (u ** 4 + v ** 4 <= 1) MD.push({ x, y }); }
  const band = [MD.filter((d) => d.x <= 3), MD.filter((d) => d.x >= 4 && d.x <= 6), MD.filter((d) => d.x >= 7)];
  const seeded = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647); const R = seeded(7);
  P.forEach((p, i) => { const b = band[p.c]; p.m = b[(p.r * 6 + p.k) % b.length]; p.j = R(); p.phi = i * 2.39996; p.rr = Math.sqrt((i + 6) / P.length); });

  let W, H, cell, sw2, sh2, dpr;
  function size() {
    dpr = Math.min(2, devicePixelRatio || 1); W = hero.clientWidth; H = hero.clientHeight;
    cell = 3; cv.width = W * dpr; cv.height = H * dpr; sw2 = Math.ceil(W / cell); sh2 = Math.ceil(H / cell); src.width = sw2; src.height = sh2;
  }

  // layouts, in source pixels
  const mFrame = () => { const S = Math.min(sh2 * 1.18, sw2 * 0.94); return { S, cy: sh2 + S * 0.14 - S / 2 }; };
  function mascotPos(p) { const { S, cy } = mFrame(), c = S / 11; return [sw2 / 2 + (p.m.x - 5) * c, cy + (p.m.y - 5) * c, c * 0.46]; }
  function bloomPos(p, t) { const a = p.phi + t * 0.25, rx = Math.max(sw2 * 0.47, sh2 * 0.8), ry = sh2 * 0.95, r = 0.18 + 0.82 * p.rr;
    return [sw2 / 2 + Math.cos(a) * rx * r, sh2 * 0.92 + Math.sin(a) * ry * r * 0.75 - ry * 0.18 * r, (sh2 / 26) * (0.55 + 0.85 * p.rr)]; }
  function iconPos(p) { const pitch = (sh2 * 0.97) / 20, colW = pitch * 6, gap = pitch * 3.4, x0 = sw2 / 2 - (colW * 3 + gap * 2) / 2;
    return [x0 + p.c * (colW + gap) + p.k * pitch + pitch / 2, sh2 - (p.r + 0.5) * pitch, pitch * 0.5]; }

  const LOOP = 16, look = [0, 0], lookT = [0, 0];
  hero.addEventListener("pointermove", (e) => { const b = hero.getBoundingClientRect(); lookT[0] = cl((e.clientX - b.left) / b.width) * 2 - 1; lookT[1] = cl((e.clientY - b.top) / b.height) * 2 - 1; });
  hero.addEventListener("pointerleave", () => { lookT[0] = 0; lookT[1] = 0; });

  function frame(time) {
    if (!sw2 || !sh2) return;
    const t = time % LOOP, cols = [css("--orange"), css("--mid"), css("--green")], ground = css("--ground");
    look[0] += (lookT[0] - look[0]) * 0.1; look[1] += (lookT[1] - look[1]) * 0.1;
    sx.globalCompositeOperation = "source-over"; sx.fillStyle = "#000"; sx.fillRect(0, 0, sw2, sh2); sx.globalCompositeOperation = "lighten";
    let mascotness = 0;
    for (const p of P) {
      const d = p.j * 0.45, toB = ease(lin(t, 3.4 + d, 5.4 + d)), toI = ease(lin(t, 7.0 + (p.r / 20) * 0.7, 8.8 + (p.r / 20) * 0.7)), back = ease(lin(t, 12.0 + d, 14.2 + d));
      let pos;
      const m = mascotPos(p), b = bloomPos(p, time), ic = iconPos(p);
      if (t < 7.0) pos = [mix(m[0], b[0], toB), mix(m[1], b[1], toB), mix(m[2], b[2], toB)];
      else if (t < 12.0) pos = [mix(b[0], ic[0], toI), mix(b[1], ic[1], toI), mix(b[2], ic[2], toI)];
      else { const sw3 = Math.sin(back * Math.PI) * sh2 * 0.25 * (p.c - 1); pos = [mix(ic[0], m[0], back) + sw3, mix(ic[1], m[1], back) - Math.sin(back * Math.PI) * sh2 * 0.2, mix(ic[2], m[2], back)]; }
      // meters breathe while the icon holds: the top rows of each column dim and refill
      let lvl = 1; if (t > 8.8 && t < 12.2) { const top = ROWS[p.c] - 1 - p.r, wave = (Math.sin((t - 8.8) * 1.6 + p.c * 1.3) * 0.5 + 0.5) * 3.2; lvl = top < wave ? 0.32 : 1; }
      // a sphere: lighter at the top-left highlight, full at the rim (the dither turns this into texture)
      const [x, y, r] = pos, g = sx.createRadialGradient(x - r * 0.35, y - r * 0.4, 0, x, y, r);
      const col = (v) => { const q = Math.round(v * 255); return p.c === 0 ? `rgb(${q},0,0)` : p.c === 1 ? `rgb(0,${q},0)` : `rgb(0,0,${q})`; };
      g.addColorStop(0, col(0.34 * lvl)); g.addColorStop(0.5, col(0.7 * lvl)); g.addColorStop(0.86, col(lvl)); g.addColorStop(1, col(0));
      sx.fillStyle = g; sx.beginPath(); sx.arc(x, y, r, 0, 6.2832); sx.fill();
    }
    // the face: eyes cut out of the mascot, following the pointer; one blink per loop
    mascotness = t < 8 ? 1 - ease(lin(t, 3.4, 4.0)) : ease(lin(t, 13.8, 14.6));
    if (mascotness > 0.01) {
      const { S, cy: mcy } = mFrame(), k = S / 320, blink = Math.max(0, 1 - Math.abs(t - 2.4) / 0.09) + Math.max(0, 1 - Math.abs(t - 15.2) / 0.09);
      sx.globalCompositeOperation = "source-over"; sx.fillStyle = `rgba(0,0,0,${mascotness})`;
      [116, 204].forEach((ex) => { const cx = sw2 / 2 + (ex - 160) * k + look[0] * 16 * k, cy = mcy + (156 - 160) * k + look[1] * 12 * k, w = 40 * k, h = 98 * k * (1 - 0.88 * Math.min(1, blink));
        sx.beginPath(); sx.roundRect(cx - w / 2, cy - h / 2, w, h, w / 2); sx.fill(); });
    }
    // ordered dither: each source pixel becomes one cell, on when its coverage beats the Bayer threshold
    const data = sx.getImageData(0, 0, sw2, sh2).data, paths = [new Path2D(), new Path2D(), new Path2D()], z = cell * 0.78 * dpr;
    for (let y = 0; y < sh2; y++) for (let x = 0; x < sw2; x++) {
      const i = (y * sw2 + x) * 4, rr = data[i], gg = data[i + 1], bb = data[i + 2], v = Math.max(rr, gg, bb) / 255;
      if (v < 0.04) continue;
      if (v > (B4[y & 3][x & 3] + 0.5) / 16) { const c = rr >= gg && rr >= bb ? 0 : gg >= bb ? 1 : 2; paths[c].rect(x * cell * dpr, y * cell * dpr, z, z); }
    }
    ctx.fillStyle = ground; ctx.fillRect(0, 0, cv.width, cv.height);
    paths.forEach((pa, c) => { ctx.fillStyle = cols[c]; ctx.fill(pa); });
  }

  // ---------- the countdown panel: a dot grid whose lit dots spell the time ----------
  const F = { "0": "01110100011001110101110011000101110", "1": "00100011000010000100001000010001110", "2": "01110100010000100010001000100011111", "3": "11110000010000101110000010000111110", "4": "00010001100101010010111110001000010", "5": "11111100001111000001000011000101110", "6": "00110010001000011110100011000101110", "7": "11111000010001000100010000100001000", "8": "01110100011000101110100011000101110", "9": "01110100011000101111000010001001100", ":": "00000011000110000000011000110000000" };
  const ck = document.getElementById("clock"), cx2 = ck.getContext("2d"), GC = 45, GR = 17;
  let left = 3 * 3600 + 51 * 60 + 7;
  function drawClock() {
    const w = ck.clientWidth, p = w / GC, d = Math.min(2, devicePixelRatio || 1); ck.width = w * d; ck.height = p * GR * d; ck.style.height = p * GR + "px";
    const h = Math.floor(left / 3600), m = Math.floor(left / 60) % 60, s = left % 60, str = `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    const on = new Set(); let x0 = Math.floor((GC - (str.length * 6 - 1)) / 2);
    for (const chr of str) { const g = F[chr]; for (let i = 0; i < 35; i++) if (g[i] === "1") on.add(`${x0 + (i % 5)},${1 + Math.floor(i / 5)}`); x0 += 6; }
    const lit = Math.round(GC * 0.53);
    for (let y = 0; y < GR; y++) for (let x = 0; x < GC; x++) {
      const meter = y >= 11 && y <= 15, isOn = on.has(`${x},${y}`) || (meter && x < lit && ((x + y) % 2 === 0 || x < lit - 3));
      cx2.fillStyle = isOn ? (meter ? css("--green") : css("--ink")) : css("--grid");
      const r = isOn ? p * 0.36 : p * 0.13; cx2.beginPath(); cx2.arc((x + 0.5) * p * d, (y + 0.5) * p * d, r * d, 0, 6.2832); cx2.fill();
    }
  }

  // ---------- run the specimen and the clock ----------
  size(); drawClock();
  addEventListener("resize", () => { size(); drawClock(); if (reduce) frame(1); });
  new MutationObserver(() => { drawClock(); if (reduce) frame(1); drawWord(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  hero.classList.add("live");
  const params = new URLSearchParams(location.search), fixed = params.has("t") ? +params.get("t") : null;
  if (reduce) frame(1);
  else {
    let visible = true, t0 = performance.now(), paused = 0, last = t0;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(hero);
    (function tick(now) {
      if (fixed !== null) { frame(fixed); return; }
      if (visible && !document.hidden) frame((now - t0 - paused) / 1000); else paused += now - last;
      last = now; requestAnimationFrame(tick);
    })(performance.now());
    setInterval(() => { if (!document.hidden) { left = Math.max(0, left - 1); drawClock(); } }, 1000);
  }

  // ---------- menu bar labels: percent / cost / tokens ----------
  const seg = [...document.querySelectorAll(".seg button")], shots = [...document.querySelectorAll("#mbplate img")];
  let cur = 0, auto = !reduce, mbVisible = false;
  const show = (i) => { cur = i; seg.forEach((b, k) => b.setAttribute("aria-pressed", k === i)); shots.forEach((s, k) => s.classList.toggle("on", k === i)); };
  seg.forEach((b, i) => b.addEventListener("click", () => { auto = false; show(i); }));
  new IntersectionObserver(([e]) => (mbVisible = e.isIntersecting)).observe(document.getElementById("mbplate"));
  setInterval(() => { if (auto && mbVisible && !document.hidden) show((cur + 1) % 3); }, 2800);

  // ---------- the panel notes: the one in the middle of the screen (or under the pointer) is outlined ----------
  const notes = [...document.querySelectorAll("#notes li")], fig = document.getElementById("pnfig"), hl = document.getElementById("hl");
  const mark = (li) => {
    notes.forEach((n) => n.classList.toggle("on", n === li));
    if (!li) { fig.classList.remove("show"); return; }
    const [x, y, w, h] = li.dataset.box.split(",").map(Number), pad = 1.2;
    Object.assign(hl.style, { left: `${x - pad}%`, top: `${y - pad * 0.5}%`, width: `${w + pad * 2}%`, height: `${h + pad}%` });
    fig.classList.add("show");
  };
  const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) mark(e.target); }); }, { rootMargin: "-45% 0px -45% 0px" });
  notes.forEach((n) => { io.observe(n); n.addEventListener("pointerenter", () => mark(n)); });
  if (params.has("note")) mark(notes[+params.get("note")]);

  // ---------- copy the install command ----------
  const copy = document.getElementById("copy");
  copy.addEventListener("click", async () => {
    const text = document.getElementById("cmd").textContent;
    try { await navigator.clipboard.writeText(text); copy.textContent = "Copied"; }
    catch (e) { const r = document.createRange(); r.selectNodeContents(document.getElementById("cmd")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); copy.textContent = "Selected, press ⌘C"; }
    setTimeout(() => (copy.textContent = "Copy"), 2000);
  });

  // ---------- the footer wordmark, dithered like the specimen; the pointer lights it up ----------
  const wd = document.getElementById("word"), wc = document.getElementById("wordc"), wx = wc.getContext("2d");
  const ws = document.createElement("canvas"), wsx = ws.getContext("2d", { willReadFrequently: true });
  let spot = null, spotT = null, wraf = 0;
  function drawWord() {
    const d = Math.min(2, devicePixelRatio || 1), Wd = wd.clientWidth, Hd = wd.clientHeight, c = 3, w = Math.ceil(Wd / c), h = Math.ceil(Hd / c);
    if (!Wd || !Hd) return;
    wc.width = Wd * d; wc.height = Hd * d; ws.width = w; ws.height = h;
    wsx.fillStyle = "#000"; wsx.fillRect(0, 0, w, h);
    wsx.font = `400 ${h * 1.32}px Newsreader, Georgia, serif`; wsx.textBaseline = "alphabetic";
    const tw = wsx.measureText("Tally").width, fs = Math.min((h * 1.32 * (w * 0.995)) / tw, h * 1.02);
    wsx.font = `400 ${fs}px Newsreader, Georgia, serif`;
    const g = wsx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#fff"); g.addColorStop(0.55, "#9a9a9a"); g.addColorStop(1, "#3a3a3a");
    wsx.fillStyle = g; wsx.fillText("Tally", (w - wsx.measureText("Tally").width) / 2, h * 0.75);
    if (spot) { wsx.globalCompositeOperation = "multiply"; const r = wsx.createRadialGradient(spot[0] / c, spot[1] / c, 0, spot[0] / c, spot[1] / c, h * 0.9);
      r.addColorStop(0, "#fff"); r.addColorStop(1, "#bbb"); wsx.fillStyle = r; wsx.fillRect(0, 0, w, h); wsx.globalCompositeOperation = "lighter";
      const r2 = wsx.createRadialGradient(spot[0] / c, spot[1] / c, 0, spot[0] / c, spot[1] / c, h * 0.55); r2.addColorStop(0, "rgba(255,255,255,.5)"); r2.addColorStop(1, "rgba(255,255,255,0)");
      wsx.fillStyle = r2; wsx.fillRect(0, 0, w, h); wsx.globalCompositeOperation = "source-over"; }
    // keep the gradient only inside the letters: re-mask with the glyphs
    wsx.globalCompositeOperation = "destination-in"; wsx.fillStyle = "#fff"; wsx.fillText("Tally", (w - wsx.measureText("Tally").width) / 2, h * 0.75); wsx.globalCompositeOperation = "source-over";
    const data = wsx.getImageData(0, 0, w, h).data, path = new Path2D(), z = c * 0.78 * d;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = data[(y * w + x) * 4] / 255; if (v > 0.04 && v > (B4[y & 3][x & 3] + 0.5) / 16) path.rect(x * c * d, y * c * d, z, z); }
    wx.clearRect(0, 0, wc.width, wc.height); wx.fillStyle = css("--ink"); wx.fill(path);
  }
  const wordLoop = () => { if (!spot || !spotT) { wraf = 0; return; } spot[0] += (spotT[0] - spot[0]) * 0.18; spot[1] += (spotT[1] - spot[1]) * 0.18; drawWord();
    wraf = Math.abs(spotT[0] - spot[0]) + Math.abs(spotT[1] - spot[1]) > 0.5 ? requestAnimationFrame(wordLoop) : 0; };
  if (!reduce) {
    wd.addEventListener("pointermove", (e) => { const b = wd.getBoundingClientRect(); spotT = [e.clientX - b.left, e.clientY - b.top]; if (!spot) spot = spotT.slice(); if (!wraf) wraf = requestAnimationFrame(wordLoop); });
    wd.addEventListener("pointerleave", () => { spot = null; spotT = null; drawWord(); });
  }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(drawWord);
  addEventListener("resize", drawWord);
})();
