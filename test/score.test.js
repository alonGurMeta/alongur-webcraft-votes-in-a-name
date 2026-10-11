import test from 'node:test';
import assert from 'node:assert/strict';
import { compareNames } from '../src/score.js';

test('identical names receive perfect scores', () => {
  const result = compareNames('Rahul Gandhi', 'Rahul Gandhi');
  assert.equal(result.average, 1);
});

test('similar spellings score above unrelated names', () => {
  const similar = compareNames('Raghubir Singh', 'Raghvir Singh').average;
  const unrelated = compareNames('Raghubir Singh', 'Meera Patel').average;
  assert.ok(similar > unrelated);
  assert.ok(similar > 0.6);
});

test('empty inputs remain finite', () => {
  const result = compareNames('', '');
  assert.equal(result.average, 0);
  assert.ok(Number.isFinite(result.average));
});
