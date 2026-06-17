import * as THREE from 'three';
import { laneX } from './logic/lanes.js';
import { makeObstacle } from './obstacleView.js';

function makePerson(toon) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.0, 3, 8), toon(0x9aa0a8));
  body.position.y = 1.0; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), toon(0x9aa0a8));
  head.position.y = 2.05; g.add(head);
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
