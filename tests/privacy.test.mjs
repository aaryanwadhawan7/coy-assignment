import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getFeed } from '../lib/logic.mjs';

const profiles = JSON.parse(fs.readFileSync('data/profiles.json', 'utf8'));

test('profile data has no field that reveals who liked you', () => {
  for (const p of profiles) {
    for (const key of Object.keys(p)) {
      assert.ok(!/like/i.test(key), `profile ${p.id} has suspicious key "${key}"`);
    }
  }
});

test('feed output never contains likedYou information', () => {
  const feed = getFeed(profiles, {});
  assert.ok(!JSON.stringify(feed).includes('likedYou'));
});