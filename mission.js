/* Mission-control portfolio.
   Plain classic script (no ES modules) on purpose — the previous 3D build used
   type="module" for Three.js, and browsers refuse to load module scripts over
   file://, which is exactly what broke scrolling last time. Nothing here needs
   modules, so that whole failure mode is gone: this runs even double-clicked. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  var lowPerf = coarsePointer || window.innerWidth < 760;

  /* =====================================================================
     PANEL METADATA — theme color + optional stat fill, keyed to the
     data-card index used in index.html. Panel copy itself lives in the
     HTML (single source of truth for the real content).
     ===================================================================== */
  var PANELS = [
    { theme: "#5eead4", statPercent: 57 },    // 0 ML Model Health Monitor
    { theme: "#4caf6a" },                      // 1 Skills — Languages & Backend
    { theme: "#7c9cff", statPercent: 85.8 },   // 2 News Classification
    { theme: "#3ddc97" },                      // 3 Skills — ML/Data/Cloud
    { theme: "#ffb454" },                      // 4 IoT Orchestration
    { theme: "#8bd450" },                      // 5 Education
    { theme: "#ff7a8a" },                       // 6 SkillSwap
    { theme: "#b38bff" }                        // 7 Certifications
  ];
  var CONTACT_THEME = "#5eead4";
  var SECTION_LABELS = [
    "INTRO",
    "ML MONITOR",
    "LANG & BACKEND",
    "NEWS CLASSIFIER",
    "ML / DATA / CLOUD",
    "IOT ORCHESTRATION",
    "EDUCATION",
    "SKILLSWAP",
    "CERTIFICATIONS",
    "CONTACT"
  ];
  var TOTAL_SEGMENTS = SECTION_LABELS.length; // 10

  /* =====================================================================
     BOOT SEQUENCE
     ===================================================================== */
  function initBoot() {
    var boot = document.getElementById("boot");
    var linesEl = document.getElementById("boot-lines");
    if (!boot || !linesEl) return;

    var lines = [
      "> INITIALIZING PORTFOLIO_OS v3.0",
      "> LOADING PROJECT DATA ....... OK",
      "> LOADING SKILL MATRIX ....... OK",
      "> ESTABLISHING UPLINK ........ OK",
      "> WELCOME, VISITOR"
    ];
    linesEl.innerHTML = lines
      .map(function (l) { return '<div class="line">' + l + "</div>"; })
      .join("");
    var lineEls = linesEl.querySelectorAll(".line");

    var hidden = false;
    function hideBoot() {
      if (hidden) return;
      hidden = true;
      boot.classList.add("hidden");
    }

    if (reduceMotion) {
      lineEls.forEach(function (el) { el.classList.add("show"); });
      setTimeout(hideBoot, 350);
    } else {
      lineEls.forEach(function (el, i) {
        setTimeout(function () { el.classList.add("show"); }, 180 * (i + 1));
      });
      setTimeout(hideBoot, 180 * (lineEls.length + 1) + 500);
    }

    // Let the visitor skip instantly, and always force-hide as a hard fallback
    // in case anything above throws.
    boot.addEventListener("click", hideBoot);
    window.addEventListener("keydown", hideBoot, { once: true });
    setTimeout(hideBoot, 4000);
  }

  /* =====================================================================
     STARFIELD CANVAS
     ===================================================================== */
  function initStarfield() {
    var canvas = document.getElementById("stars-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var stars = [];
    var starCount = lowPerf ? 130 : 240;

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }
    resize();

    for (var i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: (Math.random() * 1.3 + 0.4) * dpr,
        baseAlpha: Math.random() * 0.55 + 0.35,
        speed: Math.random() * 1.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
        layer: Math.random() < 0.33 ? 1 : Math.random() < 0.66 ? 2 : 3
      });
    }

    var driftX = 0;
    function draw(t) {
      var w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (!reduceMotion) driftX += 0.00012 * w;
      var scrollT = window.__scrollT || 0;

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var parallax = (scrollT - 0.5) * 40 * s.layer * dpr;
        var px = ((s.x * w + driftX * s.layer * 0.3 + parallax) % w + w) % w;
        var py = (s.y * h) % h;
        var twinkle = 0.65 + 0.35 * Math.sin(t * 0.001 * s.speed + s.phase);
        ctx.globalAlpha = s.baseAlpha * twinkle;
        ctx.fillStyle = "#eaf2f6";
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
  }

  /* =====================================================================
     CUSTOM CURSOR
     ===================================================================== */
  function initCursor() {
    if (coarsePointer) return;
    var dot = document.getElementById("cursor-dot");
    var ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    });

    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    var hoverables = document.querySelectorAll("a, button, .hud-link, .panel-btn");
    hoverables.forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("hover"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("hover"); });
    });
  }

  /* =====================================================================
     SCROLL WIRING
     ===================================================================== */
  function hexToRgb(hex) {
    var v = hex.replace("#", "");
    return {
      r: parseInt(v.substring(0, 2), 16),
      g: parseInt(v.substring(2, 4), 16),
      b: parseInt(v.substring(4, 6), 16)
    };
  }

  function initScroll() {
    gsap.registerPlugin(ScrollTrigger);

    var scrollSpace = document.getElementById("scroll-space");
    scrollSpace.style.height = TOTAL_SEGMENTS * 100 + "vh";

    var segLen = 1 / TOTAL_SEGMENTS;
    var progressFill = document.getElementById("progressFill");
    var progressPercent = document.getElementById("progressPercent");
    var progressSection = document.getElementById("progressSection");
    var blob1 = document.querySelector(".nebula-blob.b1");

    var progress = { t: 0 };
    gsap.to(progress, {
      t: 1,
      ease: "none",
      scrollTrigger: {
        trigger: scrollSpace,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: function () {
          window.__scrollT = progress.t;
          if (progressFill) progressFill.style.width = progress.t * 100 + "%";
          if (progressPercent) progressPercent.textContent = Math.round(progress.t * 100) + "%";
          if (progressSection) {
            var idx = Math.min(Math.floor(progress.t * TOTAL_SEGMENTS), TOTAL_SEGMENTS - 1);
            progressSection.innerHTML =
              "SECTION " + String(idx + 1).padStart(2, "0") + "/" + TOTAL_SEGMENTS +
              ' — <span class="value">' + SECTION_LABELS[idx] + "</span>";
          }
        }
      }
    });

    // Hero fade-out
    var hero = document.querySelector(".hero-overlay");
    ScrollTrigger.create({
      trigger: scrollSpace,
      start: 0.55 * segLen * 100 + "% top",
      end: 1.0 * segLen * 100 + "% top",
      onEnter: function () { gsap.to(hero, { opacity: 0, duration: 0.4 }); },
      onLeaveBack: function () { gsap.to(hero, { opacity: 1, duration: 0.4 }); }
    });

    // Panel reveals
    PANELS.forEach(function (meta, i) {
      var panel = document.querySelector('[data-card="' + i + '"]');
      if (!panel) return;
      var side = panel.classList.contains("side-left") ? "left" : panel.classList.contains("side-right") ? "right" : "center";
      var segStart = (i + 1) * segLen;
      var segEnd = (i + 2) * segLen;
      var enterAt = segStart - 0.12 * segLen;
      var exitAt = segEnd - 0.28 * segLen;
      var offsetX = side === "left" ? -36 : side === "right" ? 36 : 0;

      gsap.set(panel, { x: reduceMotion ? 0 : offsetX });

      function reveal() {
        gsap.to(panel, { opacity: 1, x: 0, duration: reduceMotion ? 0.25 : 0.55, ease: "power2.out" });
        var scanBar = panel.querySelector(".scan-bar");
        if (scanBar && !reduceMotion) {
          gsap.fromTo(scanBar, { opacity: 0.9, top: "0%" }, { opacity: 0, top: "100%", duration: 0.9, ease: "power1.out" });
        }
        var fill = panel.querySelector(".stat-fill");
        if (fill && meta.statPercent) {
          gsap.fromTo(fill, { width: "0%" }, { width: meta.statPercent + "%", duration: 1, delay: 0.25, ease: "power2.out" });
        }
        var items = panel.querySelectorAll(".system-item");
        if (items.length) {
          gsap.fromTo(items, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, delay: 0.15 });
        }
        if (blob1 && meta.theme) {
          var c = hexToRgb(meta.theme);
          gsap.to(blob1, { backgroundColor: "rgb(" + c.r + "," + c.g + "," + c.b + ")", duration: 1.2 });
        }
      }
      function hide() {
        gsap.to(panel, { opacity: 0, duration: 0.4 });
      }

      ScrollTrigger.create({
        trigger: scrollSpace,
        start: enterAt * 100 + "% top",
        end: exitAt * 100 + "% top",
        onEnter: reveal,
        onEnterBack: reveal,
        onLeave: hide,
        onLeaveBack: hide
      });
    });

    // Contact panel
    var contactPanel = document.querySelector('[data-card="contact"]');
    var contactStart = (TOTAL_SEGMENTS - 1) * segLen + 0.1 * segLen;
    ScrollTrigger.create({
      trigger: scrollSpace,
      start: contactStart * 100 + "% top",
      end: "bottom bottom",
      onEnter: function () {
        gsap.to(contactPanel, { opacity: 1, duration: 0.6 });
        if (blob1) {
          var c = hexToRgb(CONTACT_THEME);
          gsap.to(blob1, { backgroundColor: "rgb(" + c.r + "," + c.g + "," + c.b + ")", duration: 1.2 });
        }
      },
      onLeaveBack: function () { gsap.to(contactPanel, { opacity: 0, duration: 0.4 }); }
    });

    // Progress rail dots
    var dots = Array.prototype.slice.call(document.querySelectorAll(".progress-dot"));
    function setActiveDot(idx) {
      dots.forEach(function (d) { d.classList.remove("active"); });
      if (dots[idx]) dots[idx].classList.add("active");
    }
    ScrollTrigger.create({
      trigger: scrollSpace,
      start: "top top",
      end: segLen * 100 + "% top",
      onToggle: function (self) { if (self.isActive) setActiveDot(0); }
    });
    PANELS.forEach(function (_, i) {
      var segStart = (i + 1) * segLen;
      var segEnd = (i + 2) * segLen;
      ScrollTrigger.create({
        trigger: scrollSpace,
        start: segStart * 100 + "% top",
        end: segEnd * 100 + "% top",
        onToggle: function (self) { if (self.isActive) setActiveDot(i + 1); }
      });
    });
  }

  /* =====================================================================
     KEYBOARD NAV — ArrowDown/Up & PageDown/Up jump one section at a time.
     ===================================================================== */
  function initKeyboardNav() {
    window.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        window.scrollBy({ top: window.innerHeight, behavior: reduceMotion ? "auto" : "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        window.scrollBy({ top: -window.innerHeight, behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
  }

  /* =====================================================================
     PERF BANNER
     ===================================================================== */
  function initPerfBanner() {
    if (!lowPerf) return;
    var banner = document.getElementById("perfBanner");
    if (banner) banner.classList.add("show");
  }

  /* =====================================================================
     INIT
     ===================================================================== */
  function boot() {
    try { initBoot(); } catch (e) { /* boot overlay is cosmetic; never block the page */ }
    try { initStarfield(); } catch (e) { /* starfield is cosmetic */ }
    try { initCursor(); } catch (e) { /* custom cursor is cosmetic */ }
    try { initKeyboardNav(); } catch (e) {}
    try { initPerfBanner(); } catch (e) {}

    if (window.gsap && window.ScrollTrigger) {
      initScroll();
      window.__missionReady = true;
    } else {
      window.addEventListener("load", function () {
        if (window.gsap && window.ScrollTrigger) {
          initScroll();
          window.__missionReady = true;
        }
      });
    }

    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
