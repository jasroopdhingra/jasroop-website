const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

setTimeout(() => document.querySelectorAll('.skeleton').forEach(el => el.classList.remove('skeleton')), 700);

const modalBackdrop = document.querySelector('.modal-backdrop');
const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', () => {
    if (!modalBackdrop || !modal) return;
    modalTitle.textContent = card.dataset.project || 'Project';
    modalText.textContent = card.dataset.description || 'Detail view placeholder.';
    modalBackdrop.classList.add('active');
    modal.classList.add('active');
  });
});
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target !== modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    modal.classList.remove('active');
  });
}

const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let idx = 0;
let unlocked = false;
const designerPanel = document.querySelector('.designer-panel');
const toggle = document.querySelector('#designerToggle');
window.addEventListener('keydown', (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  idx = key === sequence[idx] ? idx + 1 : 0;
  if (idx === sequence.length && !unlocked) {
    unlocked = true;
    idx = 0;
    if (designerPanel) designerPanel.classList.add('active');
  }
});
if (toggle) {
  toggle.addEventListener('change', () => document.body.classList.toggle('designer-mode', toggle.checked));
}

const photoCycle = document.querySelector('.photo-cycle');
if (photoCycle) {
  const img = photoCycle.querySelector('img');
  const ghost = photoCycle.querySelector('.ghost');
  const sources = [
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=800&q=80'
  ];
  let current = 0;
  photoCycle.addEventListener('click', () => {
    current = (current + 1) % sources.length;
    ghost.src = sources[current];
    ghost.style.opacity = 1;
    setTimeout(() => {
      img.src = sources[current];
      ghost.style.opacity = 0;
    }, 250);
  });
}


const shuffleButton = document.querySelector('#shuffleCards');
const projectGrid = document.querySelector('#projectGrid');
if (shuffleButton && projectGrid) {
  shuffleButton.addEventListener('click', () => {
    const cards = Array.from(projectGrid.children);
    const shuffled = cards.sort(() => Math.random() - 0.5);
    shuffled.forEach((card) => projectGrid.appendChild(card));
  });
}

const searchInput = document.querySelector('#writingSearch');
const tagButtons = document.querySelectorAll('[data-tag]');
const writingCards = document.querySelectorAll('.write-card');
const clearFilters = document.querySelector('#clearFilters');
let activeTag = '';
function applyFilters() {
  const query = (searchInput?.value || '').toLowerCase();
  writingCards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const tag = card.dataset.category;
    const matchText = !query || text.includes(query);
    const matchTag = !activeTag || tag === activeTag;
    card.style.display = matchText && matchTag ? 'block' : 'none';
  });
  if (clearFilters) clearFilters.style.display = (query || activeTag) ? 'inline-flex' : 'none';
}
searchInput?.addEventListener('input', applyFilters);
tagButtons.forEach((btn) => btn.addEventListener('click', () => {
  tagButtons.forEach((b) => b.classList.remove('active'));
  if (activeTag === btn.dataset.tag) {
    activeTag = '';
  } else {
    activeTag = btn.dataset.tag;
    btn.classList.add('active');
  }
  applyFilters();
}));
clearFilters?.addEventListener('click', () => {
  activeTag = '';
  tagButtons.forEach((b) => b.classList.remove('active'));
  if (searchInput) searchInput.value = '';
  applyFilters();
});
