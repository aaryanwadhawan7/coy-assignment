// Pure functions: no files, no HTTP. That makes them easy to test.

/** Profiles the user has NOT swiped on yet. */
export function getFeed(profiles, swipes) {
  return profiles.filter((p) => !swipes[p.id]);
}

/**
 * Record a swipe. Mutates `state.swipes` and `state.matches`.
 * Returns { status, match } on success or { status, error } on failure.
 */
export function processSwipe(state, profileId, action) {
  const { profiles, likedYou, swipes, matches } = state;

  if (!['like', 'pass'].includes(action)) {
    return { status: 400, error: 'action must be "like" or "pass"' };
  }
  if (!profiles.some((p) => p.id === profileId)) {
    return { status: 404, error: 'Profile not found' };
  }
  if (swipes[profileId]) {
    // A profile can only be swiped once, so a repeat must not create a second match.
    return { status: 409, error: 'Already swiped on this profile' };
  }

  swipes[profileId] = action;

  // The core rule: a match needs BOTH sides to have liked.
  const match = action === 'like' && likedYou.includes(profileId);
  if (match) matches.push(profileId);

  return { status: 200, match };
}

/** Full profile objects for every mutual match. */
export function getMatches(profiles, matches) {
  return matches.map((id) => profiles.find((p) => p.id === id)).filter(Boolean);
}
