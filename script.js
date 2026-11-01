const deck = document.getElementById("deck");
const slides = [...document.querySelectorAll(".slide")];
const prev = document.getElementById("prev"), next = document.getElementById("next");
const cur = document.getElementById("cur"), fill = document.getElementById("fill");
const navBtns = [...document.querySelectorAll("nav button")];
let active = 0;
document.getElementById("tot").textContent = String(slides.length).padStart(2, "0");

function goTo(i) {
  const t = Math.max(0, Math.min(slides.length - 1, i));
  slides[t].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
}
function update(i) {
  active = i;
  cur.textContent = String(i + 1).padStart(2, "0");
  fill.style.width = ((i + 1) / slides.length * 100) + "%";
  prev.disabled = i === 0;
  next.disabled = i === slides.length - 1;
  let on = 0;
  navBtns.forEach((b, k) => { if (Number(b.dataset.go) <= i) on = k; });
  navBtns.forEach((b, k) => b.classList.toggle("on", k === on));
}
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) update(slides.indexOf(e.target));
}), { root: deck, threshold: 0.6 });
slides.forEach(sl => io.observe(sl));

prev.onclick = () => goTo(active - 1);
next.onclick = () => goTo(active + 1);
document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => goTo(Number(b.dataset.go))));
document.addEventListener("keydown", e => {
  if (e.target.closest("button,a")) return;
  if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); goTo(active + 1); }
  if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); goTo(active - 1); }
});
// Rueda del mouse: si la diapositiva no tiene scroll vertical, avanza de lado
let lock = false;
deck.addEventListener("wheel", e => {
  const s = e.target.closest(".slide");
  if (Math.abs(e.deltaY) < 28 || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
  if (s && s.scrollHeight > s.clientHeight + 4) return;
  e.preventDefault();
  if (lock) return;
  lock = true; goTo(active + (e.deltaY > 0 ? 1 : -1));
  setTimeout(() => lock = false, 650);
}, { passive: false });
update(0);
