import * as THREE from 'three';
import { laneX, LANE_COUNT } from './logic/lanes.js';

// 环境氛围:钢轨 + 滚动站台灯(暖色光斑)+ 远侧暗柱。把"工地"变成"夜里的地铁"。
export function createEnvironment(scene, toon) {
  const group = new THREE.Group();
  scene.add(group);

  // 钢轨:每条车道两条,静态长条
  const railMat = toon(0x575d66);
  for (let i = 0; i < LANE_COUNT; i++) {
    for (const dx of [-0.7, 0.7]) {
      const r = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 320), railMat);
      r.position.set(laneX(i) + dx, 0.09, -130);
      group.add(r);
    }
  }

  const SIDE = (LANE_COUNT * 4) / 2 + 2.4;

  // 站台灯柱(滚动回收)+ 地面暖色光斑(加色混合的扁圆,廉价又出氛围,不用真光源)
  const lamps = [];
  const LSPAN = 9, LSTEP = 24;
  const poolMat = new THREE.MeshBasicMaterial({
    color: 0xff9a3c, transparent: true, opacity: 0.20,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });
  for (let i = 0; i < LSPAN; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const lamp = new THREE.Group();
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.22, 5.4, 0.22), toon(0x14171e));
    post.position.y = 2.7; lamp.add(post);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.18, 0.18), toon(0x14171e));
    arm.position.set(-side * 0.75, 5.1, 0); lamp.add(arm);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xffd089 }));
    head.position.set(-side * 1.4, 5.0, 0); lamp.add(head);
    const pool = new THREE.Mesh(new THREE.CircleGeometry(3.4, 18), poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(-side * 1.4, 0.06, 0); lamp.add(pool);
    lamp.position.set(side * SIDE, 0, -i * LSTEP);
    group.add(lamp); lamps.push(lamp);
  }

  // 远侧暗柱:隧道/站台结构感,滚动回收
  const pillars = [];
  const PSPAN = 12, PSTEP = 15, PSIDE = SIDE + 3.8;
  const pillarMat = toon(0x0f1218);
  for (let i = 0; i < PSPAN; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const p = new THREE.Mesh(new THREE.BoxGeometry(1.4, 9.5, 1.4), pillarMat);
    p.position.set(side * PSIDE, 4.75, -i * PSTEP);
    group.add(p); pillars.push(p);
  }

  function update(speed) {
    for (const l of lamps) { l.position.z += speed; if (l.position.z > 14) l.position.z -= LSPAN * LSTEP; }
    for (const p of pillars) { p.position.z += speed; if (p.position.z > 16) p.position.z -= PSPAN * PSTEP; }
  }

  return { update };
}
