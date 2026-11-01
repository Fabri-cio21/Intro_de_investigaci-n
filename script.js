const deck = document.getElementById("deck");
const slides = Array.from(document.querySelectorAll(".slide"));
const prev = document.getElementById("prev-slide");
const next = document.getElementById("next-slide");
const current = document.getElementById("current-slide");
const total = document.getElementById("total-slides");
const fill = document.getElementById("progress-fill");
let active = 0;
total.textContent = String(slides.length).padStart(2, "0");

function goTo(index) {
  const target = Math.max(0, Math.min(slides.length - 1, index));
  slides[target].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
}
function updateControls(index) {
  active = index;
  current.textContent = String(index + 1).padStart(2, "0");
  fill.style.width = `${((index + 1) / slides.length) * 100}%`;
  prev.disabled = index === 0;
  next.disabled = index === slides.length - 1;
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
      const index = slides.indexOf(entry.target);
      if (index >= 0) updateControls(index);
    }
  });
}, { root: deck, threshold: [0.55, 0.75] });
slides.forEach(slide => observer.observe(slide));

prev.addEventListener("click", () => goTo(active - 1));
next.addEventListener("click", () => goTo(active + 1));
document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => goTo(Number(button.dataset.go)));
});
document.addEventListener("keydown", event => {
  if (["ArrowRight", "PageDown", " "].includes(event.key)) {
    if (event.target.closest("a,button")) return;
    event.preventDefault(); goTo(active + 1);
  } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
    event.preventDefault(); goTo(active - 1);
  }
});
// En equipos con rueda vertical, cada gesto desplaza una diapositiva hacia el costado.
let wheelLocked = false;
deck.addEventListener("wheel", event => {
  if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && Math.abs(event.deltaY) > 28) {
    if (event.target.closest(".slide") && event.target.closest(".slide").scrollHeight > event.target.closest(".slide").clientHeight + 8) {
      const slide = event.target.closest(".slide");
      const atTop = slide.scrollTop <= 0;
      const atBottom = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 2;
      if ((event.deltaY < 0 && !atTop) || (event.deltaY > 0 && !atBottom)) return;
    }
    event.preventDefault();
    if (wheelLocked) return;
    wheelLocked = true;
    goTo(active + (event.deltaY > 0 ? 1 : -1));
    setTimeout(() => wheelLocked = false, 650);
  }
}, { passive: false });
