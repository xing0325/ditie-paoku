import { test } from 'node:test';
import assert from 'node:assert/strict';
import { speedAt, BASE_SPEED, MAX_SPEED } from './difficulty.js';

test('起步等于基础速度', () => assert.equal(speedAt(0), BASE_SPEED));
test('随距离单调不减', () => assert.ok(speedAt(500) > speedAt(0)));
test('封顶不超过 MAX', () => assert.ok(speedAt(1e9) <= MAX_SPEED));
