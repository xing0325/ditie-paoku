import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSettings } from './settings.js';

function memStore() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
  };
}

test('默认风格化', () => {
  const s = createSettings(memStore());
  assert.equal(s.gore, 'stylized');
});

test('cycle 在两种模式间切换并返回新值', () => {
  const s = createSettings(memStore());
  assert.equal(s.cycle(), 'realistic');
  assert.equal(s.gore, 'realistic');
  assert.equal(s.cycle(), 'stylized');
});

test('cycle 持久化到 storage', () => {
  const store = memStore();
  const s = createSettings(store);
  s.cycle();
  assert.equal(store.getItem('gore'), 'realistic');
});

test('从已存储值恢复', () => {
  const store = memStore();
  store.setItem('gore', 'realistic');
  const s = createSettings(store);
  assert.equal(s.gore, 'realistic');
});

test('无 storage 也能工作(默认风格化)', () => {
  const s = createSettings(null);
  assert.equal(s.gore, 'stylized');
  assert.equal(s.cycle(), 'realistic');
});
