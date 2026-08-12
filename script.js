// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Scroll-reveal for sections (native page scroll — no scroll-hijacking)
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// Active nav-link highlighting as sections pass through view
const navMap = {};
document.querySelectorAll("[data-nav]").forEach((link) => {
  navMap[link.getAttribute("href").replace("#", "")] = link;
});
const trackedSections = ["about", "skills", "projects", "education"];
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = navMap[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        Object.values(navMap).forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);
trackedSections.forEach((id) => {
  const el = document.getElementById(id);
  if (el) navObserver.observe(el);
});

// Scroll progress bar
const progressBar = document.getElementById("scrollProgress");
function updateScrollProgress() {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + "%";
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

// Hero mouse-follow spotlight (skipped entirely on touch devices / reduced motion)
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
const heroSpotlight = document.getElementById("heroSpotlight");
if (heroSpotlight && !reduceMotion && !coarsePointer) {
  const hero = document.getElementById("top");
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    heroSpotlight.style.setProperty("--mx", mx + "%");
    heroSpotlight.style.setProperty("--my", my + "%");
  });
}

// Subtle 3D tilt on project cards, mouse-position based (skipped on touch)
if (!coarsePointer && !reduceMotion) {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const maxTilt = 5;
      card.style.transform =
        "perspective(1200px) rotateX(" + (-py * maxTilt) + "deg) rotateY(" + (px * maxTilt) + "deg) translateY(-3px)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
