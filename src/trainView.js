import * as THREE from 'three';
import { laneX } from './logic/lanes.js';

export function createTrain(scene, toon) {
  const train = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.6, 5.2), toon(0xc98a3a));
  body.position.y = 1.5; train.add(body);
  const ws = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 0.22), toon(0x14161c));
  ws.position.set(0, 1.95, -2.6); train.add(ws);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(body.geometry), new THREE.LineBasicMaterial({ color: 0x15171c }));
  edges.position.copy(body.position); train.add(edges);
  train.position.set(laneX(1), 0, 2);
  scene.add(train);

  let lane = 1, targetX = laneX(1);
  return {
    group: train,
    get lane() { return lane; },
    get z() { return train.position.z; },
    setLane(i) { lane = i; targetX = laneX(i); },
    update() {
      train.position.x += (targetX - train.position.x) * 0.25;     // 补间
      train.rotation.y = (targetX - train.position.x) * -0.08;     // 切轨倾斜
    },
  };
}
