import * as THREE from 'three';

export function makeObstacle(toon) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.2, 1.4), toon(0x55585f));
  m.position.y = 1.1;
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),
    new THREE.LineBasicMaterial({ color: 0x15171c }));
  m.add(e);
  return m;
}
