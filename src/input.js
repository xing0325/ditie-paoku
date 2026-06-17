export function attachInput(onSteer) {   // onSteer(-1 | +1)
  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') onSteer(-1);
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') onSteer(1);
  });
  let sx = 0;
  addEventListener('touchstart', (e) => { sx = e.changedTouches[0].clientX; }, { passive: true });
  addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 30) onSteer(dx > 0 ? 1 : -1);
  }, { passive: true });
}
