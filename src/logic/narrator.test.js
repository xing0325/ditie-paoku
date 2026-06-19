import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNarrator } from './narrator.js';

test('开局不说话', () => {
  const n = createNarrator();
  assert.equal(n.update({ distance: 0, kills: 0 }), null);
});

test('第一次碾压触发一句旁白', () => {
  const n = createNarrator();
  assert.equal(n.update({ distance: 5, kills: 0 }), null);
  const line = n.update({ distance: 6, kills: 1 });
  assert.ok(typeof line === 'string' && line.length > 0);
});

test('同一里程碑只触发一次', () => {
  const n = createNarrator();
  n.update({ distance: 6, kills: 1 });
  assert.equal(n.update({ distance: 7, kills: 1 }), null);
});

test('跨越距离里程碑触发', () => {
  const n = createNarrator();
  const line = n.update({ distance: 500, kills: 0 });
  assert.ok(typeof line === 'string' && line.length > 0);
});

test('reset 后里程碑可再次触发', () => {
  const n = createNarrator();
  const first = n.update({ distance: 6, kills: 1 });
  n.reset();
  const again = n.update({ distance: 6, kills: 1 });
  assert.equal(again, first);
});
