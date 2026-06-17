import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSpawner } from './spawner.js';

test('未达间隔不生成', () => {
  const sp = createSpawner({ gap: 10, obstacleEvery: 5, rng: () => 0 });
  assert.equal(sp.update(4), null);
});
test('达到间隔生成,并给出 0..2 车道', () => {
  const sp = createSpawner({ gap: 10, obstacleEvery: 5, rng: () => 0.5 });
  const out = sp.update(10);
  assert.ok(out && out.lane >= 0 && out.lane <= 2);
  assert.ok(out.type === 'person' || out.type === 'obstacle');
});
test('每第 N 次生成为障碍', () => {
  const sp = createSpawner({ gap: 1, obstacleEvery: 3, rng: () => 0 });
  const types = [];
  for (let i = 0; i < 3; i++) types.push(sp.update(1).type);
  assert.deepEqual(types, ['person', 'person', 'obstacle']);
});
