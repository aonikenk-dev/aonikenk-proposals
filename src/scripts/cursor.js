// Custom cursor: fixed Aonikenk arrowhead that follows the mouse (no rotation)
export function initCursor() {
  const cur = document.getElementById('cur');
  if (!cur) return;

  cur.style.transform = 'translate(-50%, -50%)';

  document.addEventListener('mousemove', e => {
    cur.style.left = e.clientX + 'px';
    cur.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cur.classList.remove('is-hover'));
  });
}