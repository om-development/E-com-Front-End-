const categories = [
  {
    label: 'Women',
    sub: 'Collection',
    image: 'images/women.png'
  },

  {
    label: 'Men',
    sub: 'Collection',
    image: 'images/men.png'
  },

  {
    label: 'Kid',
    sub: 'Collection',
    image: 'images/kid.png'
  },

  {
    label: 'Baby',
    sub: 'Collection',
    image: 'images/baby.png'
  }
];

const n = categories.length;
const radius = 220;
let current = 0;
let isDragging = false;
let startX = 0;
let dragDelta = 0;

const scene = document.getElementById('scene');
const dotsEl = document.getElementById('dots');
const labelEl = document.getElementById('cat-label');

const cards = categories.map((cat, i) => {
  const el = document.createElement('div');
  el.className = 'card';
 el.innerHTML = `
  <div class="card-image">
    <img src="${cat.image}" alt="${cat.label}">
  </div>

  <div>
    <div class="card-label">${cat.label}</div>
    <div class="card-sub">${cat.sub}</div>
  </div>
`;
  el.addEventListener('click', () => goTo(i));
  scene.appendChild(el);
  return el;
});

const dots = categories.map((_, i) => {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.addEventListener('click', () => goTo(i));
  dotsEl.appendChild(d);
  return d;
});

function updateCarousel(instant) {
  const angleStep = 360 / n;
  cards.forEach((card, i) => {
    const offset = ((i - current) % n + n) % n;
    const normalizedOffset = offset > n / 2 ? offset - n : offset;
    const angle = normalizedOffset * angleStep;
    const rad = angle * Math.PI / 180;
    const x = Math.sin(rad) * radius;
    const z = Math.cos(rad) * radius - radius;
    const scale = 0.75 + 0.25 * Math.cos(rad);
    const opacity = 0.4 + 0.6 * ((Math.cos(rad) + 1) / 2);
    card.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
    card.style.opacity = opacity;
    card.style.zIndex = Math.round(scale * 10);
    card.style.transition = instant ? 'none' : 'transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s';
    card.classList.toggle('active', i === current);
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  labelEl.textContent = categories[current].label;
}

function goTo(idx) {
  current = ((idx % n) + n) % n;
  updateCarousel();
}

document.getElementById('prev').addEventListener('click', () => goTo(current - 1));
document.getElementById('next').addEventListener('click', () => goTo(current + 1));

scene.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; });
document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  dragDelta = e.clientX - startX;
});
document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  if (Math.abs(dragDelta) > 40) goTo(current + (dragDelta < 0 ? 1 : -1));
  dragDelta = 0;
});

scene.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
scene.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') goTo(current - 1);
  if (e.key === 'ArrowRight') goTo(current + 1);
});

updateCarousel(true);