const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") return;
  nav.classList.remove("is-open");
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
});

const revealTargets = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const heroSpotlight = document.querySelector("[data-hero-spotlight]");
const canUseSpotlight = window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroSpotlight && canUseSpotlight) {
  let targetX = 0.5;
  let targetY = 0.5;
  let currentX = 0.5;
  let currentY = 0.5;
  let isActive = false;
  let frameId = 0;

  const syncSpotlight = () => {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    heroSpotlight.style.setProperty("--reveal-x", `${currentX * 100}%`);
    heroSpotlight.style.setProperty("--reveal-y", `${currentY * 100}%`);

    if (isActive || Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      frameId = window.requestAnimationFrame(syncSpotlight);
    } else {
      frameId = 0;
    }
  };

  const startSpotlight = () => {
    if (frameId) return;
    frameId = window.requestAnimationFrame(syncSpotlight);
  };

  heroSpotlight.addEventListener("pointerenter", (event) => {
    const rect = heroSpotlight.getBoundingClientRect();
    targetX = (event.clientX - rect.left) / rect.width;
    targetY = (event.clientY - rect.top) / rect.height;
    currentX = targetX;
    currentY = targetY;
    isActive = true;
    heroSpotlight.classList.add("is-spotlight-active");
    startSpotlight();
  });

  heroSpotlight.addEventListener("pointermove", (event) => {
    const rect = heroSpotlight.getBoundingClientRect();
    targetX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    targetY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    startSpotlight();
  });

  heroSpotlight.addEventListener("pointerleave", () => {
    isActive = false;
    targetX = 0.5;
    targetY = 0.5;
    heroSpotlight.classList.remove("is-spotlight-active");
    startSpotlight();
  });
}
