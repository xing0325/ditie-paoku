import * as THREE from 'three';

export function createFeedback(camera, scene) {
  let shake = 0;
  const base = camera.position.clone();
  const flying = [];   // 被撞飞的 mesh,带 userData.vel / spin

  return {
    hit(mesh) {
      shake = Math.min(0.6, shake + 0.25);
      mesh.userData.vel = new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.35, 0.25);
      mesh.userData.spin = (Math.random() - 0.5) * 0.4;
      flying.push(mesh);
    },
    update() {
      // 镜头震
      camera.position.set(
        base.x + (Math.random() - 0.5) * shake,
        base.y + (Math.random() - 0.5) * shake,
        base.z);
      shake *= 0.85; if (shake < 0.01) { shake = 0; camera.position.copy(base); }
      // 抛飞体物理(落地移除)
      for (let i = flying.length - 1; i >= 0; i--) {
        const m = flying[i];
        m.userData.vel.y -= 0.03;
        m.position.add(m.userData.vel);
        m.rotation.z += m.userData.spin;
        if (m.position.y < -2) { scene.remove(m); flying.splice(i, 1); }
      }
    },
  };
}
