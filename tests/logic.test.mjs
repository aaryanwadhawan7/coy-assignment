import test from 'node:test';
import assert from 'node:assert/strict';
import { getFeed, processSwipe, getMatches } from '../lib/logic.mjs';

const makeState = () => ({
  profiles: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
  likedYou: ['a'],
  swipes: {},
  matches: [],
});

test('feed hides profiles that were already swiped', () => {
  const s = makeState();
  processSwipe(s, 'a', 'pass');
  assert.deepEqual(getFeed(s.profiles, s.swipes).map((p) => p.id), ['b', 'c']);
});

test('like on someone who liked you is a match', () => {
  const s = makeState();
  assert.equal(processSwipe(s, 'a', 'like').match, true);
  assert.deepEqual(s.matches, ['a']);
});

test('like on someone who has not liked you is NOT a match', () => {
  const s = makeState();
  assert.equal(processSwipe(s, 'b', 'like').match, false);
  assert.deepEqual(s.matches, []);
});

test('pass on someone who liked you is NOT a match', () => {
  const s = makeState();
  assert.equal(processSwipe(s, 'a', 'pass').match, false);
});

test('swiping the same profile twice is rejected, no duplicate match', () => {
  const s = makeState();
  processSwipe(s, 'a', 'like');
  const again = processSwipe(s, 'a', 'like');
  assert.equal(again.status, 409);
  assert.equal(s.matches.length, 1);
});

test('bad input is rejected', () => {
  const s = makeState();
  assert.equal(processSwipe(s, 'zzz', 'like').status, 404);
  assert.equal(processSwipe(s, 'a', 'superlike').status, 400);
});

test('getMatches returns full profiles', () => {
  const s = makeState();
  processSwipe(s, 'a', 'like');
  assert.deepEqual(getMatches(s.profiles, s.matches), [{ id: 'a' }]);
});
