import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from './gameState.js';

test('初始 running', () => assert.equal(createGame().state, 'running'));
test('撞硬障碍 → dead', () => {
  const g = createGame(); g.derail();
  assert.equal(g.state, 'dead');
});
test('reset 回到 running', () => {
  const g = createGame(); g.derail(); g.reset();
  assert.equal(g.state, 'running');
});
test('dead 后再 derail 不抛错且仍 dead', () => {
  const g = createGame(); g.derail(); g.derail();
  assert.equal(g.state, 'dead');
});
