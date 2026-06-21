import * as THREE from 'three';

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  // 冷夜地铁:近黑冷蓝底 + 同色雾做纵深递退
  const cold = 0x0a0d14;
  scene.background = new THREE.Color(cold);
  scene.fog = new THREE.Fog(cold, 22, 80);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 220);
  camera.position.set(0, 5.2, 9.5);
  camera.lookAt(0, 1.2, -12);

  // 灯光:冷月光主光 + 半球环境(冷天蓝顶 / 暗地)+ 一抹钠灯暖补光
  const hemi = new THREE.HemisphereLight(0x36425e, 0x090a0d, 0.6);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xbcd0ff, 0.9);
  key.position.set(-8, 16, 6); scene.add(key);
  const warm = new THREE.DirectionalLight(0xffb060, 0.3);
  warm.position.set(7, 3, 11); scene.add(warm);

  // 三渲二阶梯渐变:暗部压深、冷,四档
  const g = new Uint8Array([38, 90, 150, 230]);
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
