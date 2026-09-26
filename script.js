/* Adem Kınık — portfolyo etkileşimleri */

// Çalışmalar: yeni bir çizim eklemek için assets/works/ klasörüne
// "<slug>.jpg" (büyük) ve "<slug>-sm.jpg" (küçük) koyup buraya bir satır ekleyin.
const WORKS = [
  { slug: "sakalli-genc",           title: "Sakallı Genç",        tech: "Pastel",           tags: ["portre", "renkli"],     w: 564, h: 720 },
  { slug: "rembrandt-calismasi",    title: "Rembrandt Etüdü",     tech: "Karakalem",        tags: ["portre", "karakalem"],  w: 558, h: 720 },
  { slug: "iris",                   title: "İris",                tech: "Kuru boya",        tags: ["renkli"],               w: 720, h: 435 },
  { slug: "seyyar-tamirci",         title: "Seyyar Tamirci",      tech: "Kurşun kalem",     tags: ["figur", "karakalem"],   w: 540, h: 720 },
  { slug: "gumus-ibrik",            title: "Gümüş İbrik",         tech: "Suluboya",         tags: ["renkli"],               w: 521, h: 720 },
  { slug: "pencere-isigi",          title: "Pencere Işığı",       tech: "Karakalem",        tags: ["portre", "karakalem"],  w: 470, h: 720 },
  { slug: "okul-bahcesi",           title: "Okul Bahçesi",        tech: "Boya",             tags: ["renkli", "figur"],      w: 536, h: 708 },
  { slug: "sirtinda-tasimak",       title: "Sırtında Taşımak",    tech: "Renkli kalem",     tags: ["figur"],                w: 540, h: 720 },
  { slug: "genc-portre",            title: "Genç Portre",         tech: "Karakalem",        tags: ["portre", "karakalem"],  w: 540, h: 720 },
  { slug: "takim-elbiseli-portre",  title: "Takım Elbiseli",      tech: "Kuru boya",        tags: ["portre", "renkli"],     w: 540, h: 720 },
  { slug: "flut-calan-cocuk",       title: "Flüt Çalan Çocuk",    tech: "Sepya · 1 saat",   tags: ["figur"],                w: 540, h: 720 },
  { slug: "aile-portresi",          title: "Aile Portresi",       tech: "Kurşun kalem",     tags: ["portre", "karakalem"],  w: 720, h: 540 },
  { slug: "bekleyis",               title: "Bekleyiş",            tech: "Kurşun kalem",     tags: ["figur", "karakalem"],   w: 516, h: 720 },
  { slug: "eskiz-defteri-askerler", title: "Eskiz Defteri",       tech: "Kurşun kalem",     tags: ["figur", "karakalem"],   w: 720, h: 593 },
];

const ACCENTS = ["var(--pink)", "var(--yellow)", "var(--blue)", "var(--green)", "var(--orange)"];
const ROTS = [-2.2, 1.6, -1, 2.4, -1.8, 0.8, 2, -2.6];

const gallery = document.getElementById("gallery");
const pad = (n) => String(n).padStart(2, "0");

// ---------- render gallery ----------
gallery.innerHTML = WORKS.map((w, i) => `
  <figure class="card reveal" data-index="${i}" data-tags="${w.tags.join(" ")}"
          style="--rot:${ROTS[i % ROTS.length]}deg;--accent:${ACCENTS[i % ACCENTS.length]}"
          tabindex="0" role="button" aria-label="${w.title} — büyüt">
    <span class="card-num">${pad(i + 1)}</span>
    <div class="card-frame">
      <img src="assets/works/${w.slug}-sm.jpg" alt="${w.title} — ${w.tech}"
           width="${w.w}" height="${w.h}" loading="lazy" decoding="async">
    </div>
    <figcaption>
      <span class="card-title">${w.title}</span>
      <span class="card-tech">${w.tech}</span>
    </figcaption>
  </figure>`).join("");

document.getElementById("work-count").textContent = WORKS.length;

// ---------- reveal on scroll ----------
const cards = [...gallery.querySelectorAll(".card")];
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.remove("reveal");
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  cards.forEach((c) => io.observe(c));
} else {
  cards.forEach((c) => c.classList.remove("reveal"));
}

// ---------- masonry: cards go left→right into the shortest column ----------
let visible = WORKS.map((_, i) => i);
let colCount = 0;

function layout(force) {
  const n = innerWidth >= 1100 ? 3 : innerWidth >= 640 ? 2 : 1;
  if (n === colCount && !force) return;
  colCount = n;
  const cols = Array.from({ length: n }, () => {
    const c = document.createElement("div");
    c.className = "gallery-col";
    return c;
  });
  const heights = new Array(n).fill(0);
  visible.forEach((i) => {
    const k = heights.indexOf(Math.min(...heights));
    cols[k].appendChild(cards[i]);
    heights[k] += WORKS[i].h / WORKS[i].w + 0.25; // + caption/gap
  });
  gallery.replaceChildren(...cols);
}
layout();
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => layout(false), 120);
});

// ---------- filters ----------
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c === chip));
    const f = chip.dataset.filter;
    visible = [];
    cards.forEach((card) => {
      card.classList.remove("reveal");
      if (f === "all" || card.dataset.tags.split(" ").includes(f)) visible.push(Number(card.dataset.index));
    });
    layout(true);
    document.getElementById("work-count").textContent = visible.length;
  });
});

// ---------- lightbox ----------
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
let current = 0;
let lastFocus = null;

function show(i) {
  current = i;
  const w = WORKS[i];
  lbImg.style.animation = "none";
  void lbImg.offsetWidth; // restart pop animation
  lbImg.style.animation = "";
  lbImg.src = `assets/works/${w.slug}.jpg`;
  lbImg.alt = `${w.title} — ${w.tech}`;
  document.getElementById("lb-title").textContent = w.title;
  document.getElementById("lb-meta").textContent = w.tech;
  document.getElementById("lb-num").textContent = `${pad(i + 1)} / ${pad(WORKS.length)}`;
  // preload neighbours
  [step(1), step(-1)].forEach((j) => { new Image().src = `assets/works/${WORKS[j].slug}.jpg`; });
}

function step(dir) {
  const list = visible.includes(current) ? visible : WORKS.map((_, i) => i);
  const pos = list.indexOf(current);
  return list[(pos + dir + list.length) % list.length];
}

function open(i) {
  lastFocus = document.activeElement;
  show(i);
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  lb.querySelector(".lb-close").focus();
}

function close() {
  lb.hidden = true;
  document.body.style.overflow = "";
  lastFocus && lastFocus.focus();
}

gallery.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) open(Number(card.dataset.index));
});
gallery.addEventListener("keydown", (e) => {
  const card = e.target.closest(".card");
  if (card && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    open(Number(card.dataset.index));
  }
});

// hero stickers open their work
document.querySelectorAll(".sticker").forEach((s) => {
  s.addEventListener("click", () => {
    const slug = s.querySelector("img").src.split("/").pop().replace("-sm.jpg", "");
    const i = WORKS.findIndex((w) => w.slug === slug);
    if (i >= 0) open(i);
  });
});

lb.querySelector(".lb-close").addEventListener("click", close);
lb.querySelector(".lb-prev").addEventListener("click", () => show(step(-1)));
lb.querySelector(".lb-next").addEventListener("click", () => show(step(1)));
lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-figure")) close(); });

document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowRight") show(step(1));
  if (e.key === "ArrowLeft") show(step(-1));
  if (e.key === "Tab") { // keep focus inside dialog
    const f = [...lb.querySelectorAll("button")];
    const idx = f.indexOf(document.activeElement);
    e.preventDefault();
    f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
  }
});

// swipe on touch
let touchX = null;
lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) show(step(dx < 0 ? 1 : -1));
  touchX = null;
});

// ---------- custom cursor (mouse only) ----------
const cursor = document.querySelector(".cursor");
if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.body.classList.add("has-cursor");
  let x = 0, y = 0, cx = 0, cy = 0;
  window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
  (function loop() {
    cx += (x - cx) * 0.22;
    cy += (y - cy) * 0.22;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", (e) => {
    cursor.classList.toggle("is-big", !!e.target.closest(".card, .sticker"));
  });
}

// ---------- order form → mailto ----------
const form = document.getElementById("order-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = form.querySelector(".form-msg");
  const data = new FormData(form);
  const name = data.get("name").trim();
  const text = data.get("msg").trim();
  if (!name || !text) {
    msg.textContent = "✎ adını ve mesajını yazmayı unutma!";
    msg.style.color = "var(--orange)";
    return;
  }
  const email = document.querySelector('a[href^="mailto:"]').getAttribute("href").replace("mailto:", "");
  const subject = encodeURIComponent(`Sipariş: ${data.get("type")} — ${name}`);
  const body = encodeURIComponent(`Merhaba Adem,\n\n${text}\n\n— ${name}`);
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  msg.textContent = "✓ e-posta uygulaman açılıyor, teşekkürler!";
  msg.style.color = "var(--green)";
});

document.getElementById("year").textContent = new Date().getFullYear();
