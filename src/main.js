import { createScene } from './scene.js';
import { createTrack } from './track.js';
import { createTrain } from './trainView.js';
import { createEntities } from './victimView.js';
import { createFeedback } from './feedback.js';
import { createHUD } from './hud.js';
import { attachInput } from './input.js';
import { nextLane } from './logic/lanes.js';
import { speedAt } from './logic/difficulty.js';
import { createSpawner } from './logic/spawner.js';
import { createScore } from './logic/scoring.js';
import { overlaps } from './logic/collision.js';
import { createGame } from './logic/gameState.js';

const canvas = document.getElementById('c');
const { renderer, scene, camera, toon } = createScene(canvas);
const track = createTrack(scene, toon);
const train = createTrain(scene, toon);
const entities = createEntities(scene, toon);
const feedback = createFeedback(camera, scene);
const hud = createHUD();

const Z_TOL = 1.6;

let spawner, score, game;
function newRun() {
  spawner = createSpawner({ gap: 9, obstacleEvery: 6, rng: Math.random });
  score = createScore();
  game = createGame();
}
newRun();

attachInput((dir) => {
  if (game.state === 'running') train.setLane(nextLane(train.lane, dir));
});

function restart() {
  if (game.state !== 'dead') return;
  entities.reset();
  train.setLane(1);
  newRun();
  hud.hideCard();
}
addEventListener('keydown', () => restart());
addEventListener('click', () => restart());

function step() {
  if (game.state !== 'running') return;
  const speed = speedAt(score.distance);
  score.advance(speed);
  const ev = spawner.update(speed);
  if (ev) entities.spawn(ev.type, ev.lane);
  track.update(speed);
  train.update();
  entities.update(speed);

  for (const it of [...entities.active]) {
    if (!overlaps(train.lane, train.z, it.lane, it.mesh.position.z, Z_TOL)) continue;
    if (it.type === 'person') { entities.kill(it); feedback.hit(it.mesh); score.kill(); }
    else { game.derail(); hud.showCard(score.distance, score.kills); }
  }
  feedback.update();
  hud.set(score.distance, score.kills);
}

function frame() {
  requestAnimationFrame(frame);
  step();
  renderer.render(scene, camera);
}
frame();
window.__ditie = { train, entities, step, getScore: () => score, getGame: () => game };
console.log('[ditie] phase1 ok');
