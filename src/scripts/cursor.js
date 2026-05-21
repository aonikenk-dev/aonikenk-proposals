export function initCursor() {
  const cur  = document.getElementById('cur');
  const ring = document.getElementById('ring');
  if (!cur || !ring) return;

  let mx=0, my=0, rx=0, ry=0;

  document.addEventListener('mousemove', e => {
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
  });

  (function loop() {
    rx += (mx-rx)*.12; ry += (my-ry)*.12;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.style.width='6px'; cur.style.height='6px'; ring.style.width='52px'; ring.style.height='52px'; });
    el.addEventListener('mouseleave', () => { cur.style.width='10px'; cur.style.height='10px'; ring.style.width='36px'; ring.style.height='36px'; });
  });
}
