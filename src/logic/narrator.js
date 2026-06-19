// 冷面旁白:跨越里程碑时吐一句平淡的话,否则沉默。纯逻辑,可 Node 测试。
const KILL_LINES = [
  [1, '第一个。系统未记录姓名。'],
  [10, '它不会停,也不会等你。'],
  [50, '前方依然没有目的地。'],
  [100, '第 100 个。无人认领。'],
  [250, '数字不再有意义。'],
  [500, '你早就停不下来了。'],
];
const DIST_LINES = [
  [400, '没有站台,没有终点。'],
  [1200, '里程在涨。意义没有。'],
  [3000, '它还在开。你也是。'],
];

export function createNarrator() {
  const fired = new Set();
  function pick(table, value, prefix) {
    for (const [thr, line] of table) {
      const key = prefix + thr;
      if (value >= thr && !fired.has(key)) { fired.add(key); return line; }
    }
    return null;
  }
  return {
    // 碾压里程碑优先于距离里程碑;每条只触发一次;无事返回 null
    update({ distance, kills }) {
      return pick(KILL_LINES, kills, 'k') ?? pick(DIST_LINES, distance, 'd');
    },
    reset() { fired.clear(); },
  };
}
