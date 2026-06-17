import { test } from 'node:test';
import assert from 'node:assert/strict';
import { overlaps } from './collision.js';

// overlaps(trainLane, trainZ, entLane, entZ, zTol)
test('同道且 z 接近 → 撞', () => assert.equal(overlaps(1, 2, 1, 2.4, 1.2), true));
test('不同道 → 不撞', () => assert.equal(overlaps(1, 2, 0, 2, 1.2), false));
test('同道但 z 太远 → 不撞', () => assert.equal(overlaps(1, 2, 1, 6, 1.2), false));
