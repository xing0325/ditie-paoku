import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createScore } from './scoring.js';

test('初始为零', () => {
  const s = createScore();
  assert.equal(s.distance, 0);
  assert.equal(s.kills, 0);
});
test('累计距离(取整米)与碾压', () => {
  const s = createScore();
  s.advance(0.5); s.advance(0.7);   // 1.2 → 1 m
  s.kill(); s.kill();
  assert.equal(s.distance, 1);
  assert.equal(s.kills, 2);
});
