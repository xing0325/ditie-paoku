import * as THREE from 'three';

// 撞击反馈:镜头震 + 冻帧(hit-stop)+ 慢动作 + 抛飞布娃娃 + 血粒子(随血腥度模式)
export function createFeedback(camera, scene, toon, getGore) {
  let shake = 0;
  const base = camera.position.clone();
  const flying = [];     // 被撞飞的小人
  const bits = [];       // 血粒子
  const bitPool = [];
  let hitstop = 0;       // 冻帧计数
  let slow = 1;          // 慢动作因子(缓回 1)

  function bloodBit() {
    return bitPool.pop()
      || new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18),
                        new THREE.MeshBasicMaterial({ color: 0xc0241f }));
  }

  function spawnBlood(pos, mode) {
    const n = mode === 'realistic' ? 16 : 7;
    const col = mode === 'realistic' ? 0x6b0d10 : 0xc0241f;
    const scl = mode === 'realistic' ? 0.8 : 1.2;
    const life = mode === 'realistic' ? 64 : 34;
    for (let i = 0; i < n; i++) {
      const m = bloodBit();
      m.material.color.setHex(col);
      m.scale.setScalar(scl * (0.5 + Math.random()));
      m.position.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 0.8, 1.0 + Math.random() * 0.6, 0));
      m.userData.v = new THREE.Vector3((Math.random() - 0.5) * 0.5, 0.25 + Math.random() * 0.45, 0.12 + Math.random() * 0.3);
      m.userData.life = life;
      m.visible = true; scene.add(m); bits.push(m);
    }
  }

  return {
    hit(mesh) {
      shake = Math.min(1.0, shake + 0.32);
      hitstop = Math.max(hitstop, 3);
      slow = 0.32;
      mesh.userData.vel = new THREE.Vector3((Math.random() - 0.5) * 0.45, 0.42, 0.32);
      mesh.userData.spin = (Math.random() - 0.5) * 0.6;
      flying.push(mesh);
      spawnBlood(mesh.position, getGore ? getGore() : 'stylized');
    },
    // 每帧调一次:冻帧时近乎停住,之后从慢动作缓回正常
    timeScale() {
      if (hitstop > 0) { hitstop--; return 0.05; }
      slow += (1 - slow) * 0.1;
      return slow;
    },
    update() {
      camera.position.set(
        base.x + (Math.random() - 0.5) * shake,
        base.y + (Math.random() - 0.5) * shake,
        base.z + (Math.random() - 0.5) * shake * 0.5);
      shake *= 0.84; if (shake < 0.01) { shake = 0; camera.position.copy(base); }

      for (let i = flying.length - 1; i >= 0; i--) {
        const m = flying[i];
        m.userData.vel.y -= 0.03;
        m.position.add(m.userData.vel);
        m.rotation.z += m.userData.spin; m.rotation.x += m.userData.spin * 0.5;
        if (m.position.y < -2) { scene.remove(m); flying.splice(i, 1); }
      }
      for (let i = bits.length - 1; i >= 0; i--) {
        const m = bits[i];
        m.userData.v.y -= 0.025;
        m.position.add(m.userData.v);
        if (m.position.y < 0.05) { m.position.y = 0.05; m.userData.v.set(0, 0, 0); }
        if (--m.userData.life <= 0) { m.visible = false; scene.remove(m); bitPool.push(m); bits.splice(i, 1); }
      }
    },
    reset() {
      for (const m of flying.splice(0)) scene.remove(m);
      for (const m of bits.splice(0)) { m.visible = false; scene.remove(m); bitPool.push(m); }
      shake = 0; hitstop = 0; slow = 1; camera.position.copy(base);
    },
  };
}
