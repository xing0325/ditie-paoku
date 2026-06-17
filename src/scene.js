import * as THREE from 'three';

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0e1014);
  scene.fog = new THREE.Fog(0x0e1014, 18, 60);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 5.2, 9.5);
  camera.lookAt(0, 1.2, -12);

  scene.add(new THREE.AmbientLight(0x5a6680, 0.55));
  const dir = new THREE.DirectionalLight(0xffe9c0, 1.15);
  dir.position.set(-7, 13, 5);
  scene.add(dir);

  // stepped toon gradient (三渲二)
  const g = new Uint8Array([55, 110, 185, 255]);
  const gradMap = new THREE.DataTexture(g, g.length, 1, THREE.RedFormat);
  gradMap.minFilter = gradMap.magFilter = THREE.NearestFilter;
  gradMap.needsUpdate = true;
  const toon = (color) => new THREE.MeshToonMaterial({ color, gradientMap: gradMap });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();

  return { renderer, scene, camera, toon, resize };
}
