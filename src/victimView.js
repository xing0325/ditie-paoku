import * as THREE from 'three';
import { laneX } from './logic/lanes.js';
import { makeObstacle } from './obstacleView.js';

const COATS = [0x5b6470, 0x6b5d52, 0x4f5a52, 0x6a5563, 0x566070, 0x615a4e];
function makePerson(toon) {
  const g = new THREE.Group();
  const coat = COATS[(Math.random() * COATS.length) | 0];
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.5), toon(coat));
  torso.position.y = 1.05; g.add(torso);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.46, 0.42), toon(0xc1a386));
  head.position.y = 1.92; g.add(head);
  for (const sx of [-0.18, 0.18]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.3), toon(0x2f343c));
    leg.position.set(sx, 0.35, 0); g.add(leg);
  }
  for (const sx of [-0.46, 0.46]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 0.24), toon(coat));
    arm.position.set(sx, 1.05, 0); g.add(arm);
  }
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(torso.geometry),
    new THREE.LineBasicMaterial({ color: 0x14171c }));
  e.position.copy(torso.position); g.add(e);
  return g;
}

export function createEntities(scene, toon) {
  const SPAWN_Z = -120;
  const active = [];                 // {mesh, lane, type}
  const pool = { person: [], obstacle: [] };

  function obtain(type) {
    const m = pool[type].pop() || (type === 'person' ? makePerson(toon) : makeObstacle(toon));
    m.visible = true; scene.add(m); return m;
  }
  function recycle(item) {
    item.mesh.visible = false; scene.remove(item.mesh);
    pool[item.type].push(item.mesh);
  }

  return {
    active,
    spawn(type, lane) {
      const mesh = obtain(type);
      const baseY = type === 'person' ? 0 : 1.1;
      mesh.position.set(laneX(lane), baseY, SPAWN_Z);
      active.push({ mesh, lane, type });
    },
    update(speed) {
      for (let i = active.length - 1; i >= 0; i--) {
        const it = active[i];
        it.mesh.position.z += speed;
        if (it.mesh.position.z > 14) { recycle(it); active.splice(i, 1); }
      }
    },
    kill(item) {                       // 从 active 移除,但不回收(交给 feedback 抛飞)
      const idx = active.indexOf(item);
      if (idx >= 0) active.splice(idx, 1);
    },
    reset() {                          // 清空当前局所有 active,回池
      for (const it of active.splice(0)) {
        it.mesh.visible = false; scene.remove(it.mesh); pool[it.type].push(it.mesh);
      }
    },
  };
}
