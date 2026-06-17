import * as THREE from 'three';
import { laneX, LANE_COUNT } from './logic/lanes.js';

export function createTrack(scene, toon) {
  const group = new THREE.Group();
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(LANE_COUNT * 4 + 4, 260), toon(0x24262c));
  ground.rotation.x = -Math.PI / 2; ground.position.z = -110;
  group.add(ground);

  // 车道分隔线
  for (let i = 0; i <= LANE_COUNT; i++) {
    const x = laneX(0) - 2 + i * 4;
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 260), toon(0x3a3d44));
    line.position.set(x, 0.04, -110); group.add(line);
  }
  // 轨枕(滚动回收)
  const sleepers = [];
  const SPAN = 30, STEP = 5;
  for (let i = 0; i < SPAN; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(LANE_COUNT * 4 + 2, 0.2, 0.55), toon(0x33363d));
    s.position.set(0, 0.06, -i * STEP); group.add(s); sleepers.push(s);
  }
  scene.add(group);

  function update(speed) {
    for (const s of sleepers) {
      s.position.z += speed;
      if (s.position.z > 12) s.position.z -= SPAN * STEP;
    }
  }
  return { update };
}
