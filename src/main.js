import { createScene } from './scene.js';

const canvas = document.getElementById('c');
const { renderer, scene, camera } = createScene(canvas);

function frame() {
  requestAnimationFrame(frame);
  renderer.render(scene, camera);
}
frame();
console.log('[ditie] boot ok');
