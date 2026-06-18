// build.mjs — 把 src 模块打包成单文件 play.html(可 file:// 直接打开,零依赖)
// 用法: node build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const read = (f) => readFileSync(join(root, f), 'utf8');

// 依赖顺序(被依赖的在前,main 最后)
const order = [
  'src/logic/lanes.js',
  'src/logic/difficulty.js',
  'src/logic/collision.js',
  'src/logic/scoring.js',
  'src/logic/gameState.js',
  'src/logic/spawner.js',
  'src/scene.js',
  'src/obstacleView.js',
  'src/victimView.js',
  'src/track.js',
  'src/trainView.js',
  'src/input.js',
  'src/feedback.js',
  'src/hud.js',
  'src/main.js',
];

const body = order.map((f) => {
  const code = read(f)
    .split('\n')
    .filter((l) => !/^\s*import\s.*\bfrom\b.*$/.test(l))   // 去掉所有 import 行(本地 + three)
    .join('\n')
    .replace(/^export\s+/gm, '');                          // 去掉 export 关键字
  return `// ===== ${f} =====\n${code.trim()}`;
}).join('\n\n');

const html = `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<title>没有目的地</title>
<style>
  html,body{margin:0;height:100%;background:#0e1014;overflow:hidden;
    font-family:ui-monospace,Menlo,Consolas,monospace;touch-action:none}
  #c{display:block;width:100vw;height:100vh}
</style>
<script type="importmap">
{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js"}}
</script>
</head>
<body>
<canvas id="c"></canvas>
<script type="module">
import * as THREE from 'three';
${body}
</script>
</body>
</html>
`;

writeFileSync(join(root, 'play.html'), html);
console.log('built play.html (' + html.length + ' bytes)');
