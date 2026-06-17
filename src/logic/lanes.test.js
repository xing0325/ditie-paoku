import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LANE_COUNT, laneX, clampLane, nextLane } from './lanes.js';

test('三条道', () => assert.equal(LANE_COUNT, 3));
test('laneX 居中对称', () => {
  assert.equal(laneX(1), 0);
  assert.equal(laneX(0), -laneX(2));
});
test('clampLane 夹在 [0,2]', () => {
  assert.equal(clampLane(-1), 0);
  assert.equal(clampLane(3), 2);
  assert.equal(clampLane(1), 1);
});
test('nextLane 移动且不越界', () => {
  assert.equal(nextLane(1, -1), 0);
  assert.equal(nextLane(1, 1), 2);
  assert.equal(nextLane(0, -1), 0);
  assert.equal(nextLane(2, 1), 2);
});
