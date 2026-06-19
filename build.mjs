// build.mjs — 把 src 模块打包成单文件 play.html(可 file:// 直接打开,零依赖)
// 自动发现 src 下所有 .js(排除 *.test.js),main.js 置末(它在顶层立即执行,依赖其余全部)。
// 用法: node build.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const read = (f) => readFileSync(join(root, f), 'utf8');

function listJs(dir) {
  const out = [];
  for (const name of readdirSync(join(root, dir))) {
    const rel = `${dir}/${name}`;
    if (statSync(join(root, rel)).isDirectory()) out.push(...listJs(rel));
    else if (name.endsWith('.js') && !name.endsWith('.test.js')) out.push(rel);
  }
  return out;
}

// 其余模块只是函数声明 + 字面量常量(运行期才被调用),顺序无所谓;只需保证 main.js 最后。
const files = listJs('src').filter((f) => f !== 'src/main.js');
files.push('src/main.js');

const body = files.map((f) => {
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
console.log(`built play.html (${html.length} bytes) from ${files.length} modules: ${files.map((f) => f.replace('src/', '')).join(', ')}`);
