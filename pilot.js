/* ===========================================================
   PILOT — scroll choreography
   Hero reveal · stage stagger · pipeline draw · cards lift ·
   chart path-draw · count-ups · Kochi arc draw
=========================================================== */

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- helpers ---------- */
const fadeUp = (selector, opts = {}) => {
  gsap.utils.toArray(selector).forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: 1.0,
      ease: "expo.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true,
        ...(opts.trigger || {})
      },
      ...(opts.tween || {})
    });
  });
};

const countUp = (el) => {
  const raw = el.dataset.count;
  const target = parseFloat(raw);
  const decimals = (raw.split(".")[1] || "").length;
  const isInt = decimals === 0;
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target,
    duration: 1.8,
    ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 92%", once: true },
    onUpdate: () => {
      const v = obj.v;
      el.textContent = isInt
        ? Math.round(v).toLocaleString("en-US")
        : v.toFixed(decimals);
    }
  });
};

/* ---------- 1. Hero headline word reveal ---------- */
const headWords = document.querySelectorAll(".hero-head .hl > *");
gsap.to(headWords, {
  y: 0,
  duration: 1.05,
  ease: "expo.out",
  stagger: 0.08,
  delay: 0.25
});

gsap.to([".eyebrow", ".hero-dek", ".hero-cta", ".hero-tags"], {
  opacity: 1, y: 0,
  duration: 0.95, ease: "expo.out",
  stagger: 0.12, delay: 0.5
});

/* ---------- 2. Hero stage — staged appear ---------- */
gsap.set(".stage-inbox", { y: 24 });
gsap.set(".stage-bill",  { y: 30, rotate: 6, transformOrigin: "center" });
gsap.set(".stage-toast", { y: -20, rotate: -8, transformOrigin: "center" });

const heroTl = gsap.timeline({ delay: 0.55 });
heroTl.to(".stage-inbox", {
  opacity: 1, y: 0,
  duration: 1.1, ease: "expo.out"
});
heroTl.to(".stage-bill", {
  opacity: 1, y: 0, rotate: 2,
  duration: 1.0, ease: "expo.out"
}, "-=0.65");
heroTl.to(".stage-toast", {
  opacity: 1, y: 0, rotate: -3,
  duration: 1.0, ease: "expo.out"
}, "-=0.75");

/* count-ups in hero (small footer) */
document.querySelectorAll(".card-foot .ct").forEach(el => {
  const target = parseFloat(el.dataset.count);
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target,
    duration: 1.6, ease: "power3.out", delay: 1.0,
    onUpdate: () => {
      el.textContent = Math.round(obj.v).toLocaleString("en-US");
    }
  });
});

/* ---------- 3. Generic scroll reveals ---------- */
fadeUp(".kicker");
fadeUp(".section-title");
fadeUp(".intro-p");
fadeUp(".big-line");
fadeUp(".strip-item",   { tween: { stagger: 0.08 } });
fadeUp(".pipe-stage",   { tween: { stagger: 0.08 } });
fadeUp(".prod-card",    { tween: { stagger: 0.07 } });
fadeUp(".letter");
fadeUp(".chart-frame");
fadeUp(".chart-legend > div", { tween: { stagger: 0.1 } });
fadeUp(".kochi-copy > *",     { tween: { stagger: 0.08 } });
fadeUp(".kochi-viz");
fadeUp(".plan", { tween: { stagger: 0.12 } });
fadeUp(".wl-head");
fadeUp(".wl-dek");
fadeUp(".wl-form");
fadeUp(".foot-grid > *", { tween: { stagger: 0.06 } });

/* count-ups outside hero */
gsap.utils.toArray(".strip-item .ct, .impact-head .ct, .chart-legend .ct").forEach(countUp);

/* ---------- 4. Pipeline path draw ---------- */
const pipePath = document.getElementById("pipePath");
if (pipePath) {
  const len = pipePath.getTotalLength();
  pipePath.style.strokeDasharray = len;
  pipePath.style.strokeDashoffset = len;
  gsap.to(pipePath, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".pipeline",
      start: "top 80%",
      end: "bottom 60%",
      scrub: 0.6
    }
  });
}

/* ---------- 5. Impact chart — line + area ---------- */
const linePath = document.getElementById("linePath");
const areaPath = document.getElementById("areaPath");

if (linePath && areaPath) {
  const len = linePath.getTotalLength();
  linePath.style.strokeDasharray = len;
  linePath.style.strokeDashoffset = len;
  ScrollTrigger.create({
    trigger: ".chart-frame",
    start: "top 78%",
    once: true,
    onEnter: () => {
      gsap.to(linePath, {
        strokeDashoffset: 0,
        duration: 2.0,
        ease: "power2.out"
      });
      gsap.to(areaPath, {
        opacity: 1,
        duration: 1.6,
        delay: 0.6,
        ease: "power2.out"
      });
      gsap.from(".chart-markers circle", {
        scale: 0,
        opacity: 0,
        transformOrigin: "center",
        duration: 0.6,
        ease: "back.out(2.5)",
        stagger: 0.15,
        delay: 0.9
      });
      gsap.to(".callout", {
        opacity: 1, y: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.18,
        delay: 1.4
      });
    }
  });
}

/* ---------- 6. Kochi arc draw + dot ripples ---------- */
const arc = document.getElementById("kochiArc");
if (arc) {
  const len = arc.getTotalLength();
  arc.style.strokeDasharray = len;
  arc.style.strokeDashoffset = len;

  ScrollTrigger.create({
    trigger: ".kochi-viz",
    start: "top 80%",
    once: true,
    onEnter: () => {
      gsap.to(arc, { strokeDashoffset: 0, duration: 2.0, ease: "power2.inOut" });

      // tiny ripple loop on the dots
      gsap.fromTo(".map-pt .rip",
        { attr: { r: 5 }, opacity: 1 },
        { attr: { r: 22 }, opacity: 0,
          duration: 1.8, ease: "power2.out",
          stagger: 0.4, repeat: -1, repeatDelay: 1.2 });
    }
  });
}

/* ---------- 7. Subtle parallax on hero stage on mouse move ---------- */
if (!reduce && matchMedia("(hover: hover)").matches) {
  const stage = document.querySelector(".hero-stage");
  if (stage) {
    const inbox = stage.querySelector(".stage-inbox");
    const bill  = stage.querySelector(".stage-bill");
    const toast = stage.querySelector(".stage-toast");
    const xTo = (el, depth) => gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = (el, depth) => gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const setX = [xTo(inbox), xTo(bill), xTo(toast)];
    const setY = [yTo(inbox), yTo(bill), yTo(toast)];
    const depths = [4, 10, 14];
    stage.addEventListener("mousemove", (e) => {
      const r = stage.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top  - r.height / 2) / r.height;
      [inbox, bill, toast].forEach((_, i) => {
        setX[i](dx * depths[i]);
        setY[i](dy * depths[i]);
      });
    });
    stage.addEventListener("mouseleave", () => {
      [inbox, bill, toast].forEach((_, i) => { setX[i](0); setY[i](0); });
    });
  }
}

/* ---------- 8. Smooth anchor scroll w/ offset for sticky nav ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const tgt = document.querySelector(id);
    if (!tgt) return;
    e.preventDefault();
    const navH = document.querySelector(".topnav")?.offsetHeight || 0;
    const y = tgt.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

/* ---------- 9. Refresh on resize ---------- */
let rt;
window.addEventListener("resize", () => {
  clearTimeout(rt);
  rt = setTimeout(() => ScrollTrigger.refresh(), 200);
});

/* ---------- 10. Reduced motion ---------- */
if (reduce) {
  gsap.set([
    ".hero-head .hl > *", ".eyebrow", ".hero-dek", ".hero-cta", ".hero-tags",
    ".stage-card", ".kicker", ".section-title", ".intro-p", ".big-line",
    ".strip-item", ".pipe-stage", ".prod-card", ".letter",
    ".chart-frame", ".callout", ".chart-legend > div",
    ".kochi-copy > *", ".kochi-viz",
    ".plan", ".wl-head", ".wl-dek", ".wl-form", ".foot-grid > *"
  ], { opacity: 1, y: 0, x: 0, rotate: 0, clearProps: "transform" });

  [pipePath, linePath, arc].forEach(p => p && (p.style.strokeDashoffset = 0));
  if (areaPath) areaPath.style.opacity = 1;

  document.querySelectorAll(".ct").forEach(el => {
    const v = parseFloat(el.dataset.count);
    el.textContent = (v % 1 === 0) ? v.toLocaleString("en-US") : v.toFixed(1);
  });
}
