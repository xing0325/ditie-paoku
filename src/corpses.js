import * as THREE from 'three';

// 一具瘫软的尸体(低面):横躺的身体 + 偏置的头
function crumpled(toon, color) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 0.7, 3, 6), toon(color));
  body.rotation.z = Math.PI / 2; body.position.y = 0.32; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 8, 6), toon(color));
  head.position.set(0.7, 0.3, 0); g.add(head);
  return g;
}

// 尸堆系统:① 散落地面、随世界滚动回收的尸体 ② 车头逐渐堆高的"尸体排障器"
export function createCorpses(scene, toon, trainGroup) {
  const ground = [];
  const pool = [];
  const pile = new THREE.Group();
  pile.position.set(0, 0, -2.9);   // 挂在车头,随车一起切道
  trainGroup.add(pile);
  let pileN = 0;
  const PILE_MAX = 16;

  function addGround(x, z) {
    const c = pool.pop() || crumpled(toon, 0x8f9298);
    c.visible = true;
    c.position.set(x, 0, z);
    c.rotation.y = Math.random() * Math.PI * 2;
    scene.add(c);
    ground.push(c);
  }

  function bumpPile() {
    if (pileN >= PILE_MAX) return;
    const b = crumpled(toon, 0x86898f);
    b.position.set((Math.random() - 0.5) * 2.6, 0.3 + Math.random() * 1.8, (Math.random() - 0.5) * 1.1);
    b.rotation.set(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28);
    b.scale.setScalar(0.78);
    pile.add(b);
    pileN++;
  }

  function update(speed) {
    for (let i = ground.length - 1; i >= 0; i--) {
      const c = ground[i];
      c.position.z += speed;
      if (c.position.z > 14) {
        c.visible = false; scene.remove(c); pool.push(c); ground.splice(i, 1);
      }
    }
  }

  function reset() {
    for (const c of ground.splice(0)) { c.visible = false; scene.remove(c); pool.push(c); }
    for (const b of [...pile.children]) pile.remove(b);
    pileN = 0;
  }

  return { addGround, bumpPile, update, reset, get pileN() { return pileN; } };
}
