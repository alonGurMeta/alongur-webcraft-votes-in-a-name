import assert from 'node:assert/strict';
import test from 'node:test';
import { pointOnPath } from '../src/crowdLayout.js';

test('crowd path interpolation preserves endpoints', () => {
  const points = [[-1, 1], [0, .8], [1, .5]];
  assert.deepEqual(pointOnPath(points, 0), { x: -1, y: 1 });
  assert.deepEqual(pointOnPath(points, 1), { x: 1, y: .5 });
});

test('crowd path interpolation advances through each segment', () => {
  const points = [[0, 1], [1, 1], [1, 0]];
  assert.deepEqual(pointOnPath(points, .25), { x: .5, y: 1 });
  assert.deepEqual(pointOnPath(points, .75), { x: 1, y: .5 });
});
