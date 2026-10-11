import assert from 'node:assert/strict';
import test from 'node:test';
import { createShuffleOrder } from '../src/chanduLayout.js';

test('Chandu shuffle rounds are deterministic permutations', () => {
  const first = createShuffleOrder(1);
  assert.deepEqual(first, createShuffleOrder(1));
  assert.deepEqual([...first].sort((a, b) => a - b), Array.from({ length: 12 }, (_, index) => index));
});

test('successive Chandu shuffle rounds use different arrangements', () => {
  assert.notDeepEqual(createShuffleOrder(1), createShuffleOrder(2));
  assert.notDeepEqual(createShuffleOrder(2), createShuffleOrder(3));
});
