import * as THREE from 'three';
import { laneX } from './logic/lanes.js';

// 钝铁块无脸地铁:冷钢两色 + 暗赭腰线;前脸暖灯眼 + 排障器,车尾红灯(玩家主要看到车尾+车顶)
export function createTrain(scene, toon) {
  const train = new THREE.Group();
  const STEEL = 0x49515d, STEEL_TOP = 0x59626e, ACCENT = 0xc98a3a, DARK = 0x0c0f14;

  const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 5.2), toon(STEEL));
  body.position.y = 1.4; train.add(body);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.5, 5.0), toon(STEEL_TOP));
  roof.position.y = 2.65; train.add(roof);

  // 侧腰线(暗赭强调)
  for (const sx of [-1.61, 1.61]) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 5.0), toon(ACCENT));
    stripe.position.set(sx, 1.55, 0); train.add(stripe);
  }
  // 车顶空调(低面细节)
  for (const dz of [-1.4, 0.4]) {
    const ac = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.32, 1.1), toon(0x3a414b));
    ac.position.set(0, 2.96, dz); train.add(ac);
  }

  // 前脸(朝前 -z,迎向被碾的人):挡风玻璃 + 暖灯眼 + 排障器
  const ws = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.95, 0.18), toon(DARK));
  ws.position.set(0, 1.95, -2.62); train.add(ws);
  for (const sx of [-0.85, 0.85]) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.34, 0.16),
      new THREE.MeshBasicMaterial({ color: 0xfff1c0 }));
    eye.position.set(sx, 0.95, -2.64); train.add(eye);
  }
  const plow = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.7, 0.55), toon(0x2b3037));
  plow.position.set(0, 0.5, -2.7); train.add(plow);

  // 车尾(朝向相机 +z):尾窗 + 两盏红灯
  const rw = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 0.18), toon(DARK));
  rw.position.set(0, 1.95, 2.62); train.add(rw);
  for (const sx of [-0.9, 0.9]) {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.16),
      new THREE.MeshBasicMaterial({ color: 0xc0241f }));
    tl.position.set(sx, 1.0, 2.64); train.add(tl);
  }

  // 描边(主车身,三渲二)
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(body.geometry), new THREE.LineBasicMaterial({ color: 0x090b0f }));
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
