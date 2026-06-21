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
import { createNarrator } from './logic/narrator.js';
import { createCorpses } from './corpses.js';
import { createSettings } from './logic/settings.js';
import { createEnvironment } from './environment.js';

const canvas = document.getElementById('c');
const { renderer, scene, camera, toon } = createScene(canvas);
const track = createTrack(scene, toon);
const environment = createEnvironment(scene, toon);
const train = createTrain(scene, toon);
const entities = createEntities(scene, toon);
const settings = createSettings(typeof localStorage !== 'undefined' ? localStorage : null);
const feedback = createFeedback(camera, scene, toon, () => settings.gore);
const corpses = createCorpses(scene, toon, train.group);
const hud = createHUD();

const Z_TOL = 1.6;

let spawner, score, game, narrator;
function newRun() {
  spawner = createSpawner({ gap: 9, obstacleEvery: 6, rng: Math.random });
  score = createScore();
  game = createGame();
  narrator = createNarrator();
}
newRun();

attachInput((dir) => {
  if (game.state === 'running') train.setLane(nextLane(train.lane, dir));
});

function restart() {
  if (game.state !== 'dead') return;
  entities.reset();
  corpses.reset();
  feedback.reset();
  train.setLane(1);
  newRun();
  hud.hideCard();
}
addEventListener('keydown', () => restart());
addEventListener('click', () => restart());

addEventListener('keydown', (e) => {
  if (e.key === 'b' || e.key === 'B') {
    const mode = settings.cycle();
    hud.say(mode === 'realistic' ? '血腥度:写实' : '血腥度:风格化');
  }
});

function step() {
  if (game.state !== 'running') return;
  const speed = speedAt(score.distance) * feedback.timeScale();
  score.advance(speed);
  const ev = spawner.update(speed);
  if (ev) entities.spawn(ev.type, ev.lane);
  track.update(speed);
  environment.update(speed);
  train.update();
  entities.update(speed);
  corpses.update(speed);

  for (const it of [...entities.active]) {
    if (!overlaps(train.lane, train.z, it.lane, it.mesh.position.z, Z_TOL)) continue;
    if (it.type === 'person') {
      entities.kill(it); feedback.hit(it.mesh); score.kill();
      corpses.addGround(it.mesh.position.x, it.mesh.position.z); corpses.bumpPile();
    } else { game.derail(); hud.showCard(score.distance, score.kills); }
  }
  const line = narrator.update({ distance: score.distance, kills: score.kills });
  if (line) hud.say(line);
  feedback.update();
  hud.set(score.distance, score.kills);
}

function frame() {
  requestAnimationFrame(frame);
  step();
  renderer.render(scene, camera);
}
frame();
window.__ditie = { train, entities, corpses, settings, feedback, step, getScore: () => score, getGame: () => game };
console.log('[ditie] phase2 ok');
