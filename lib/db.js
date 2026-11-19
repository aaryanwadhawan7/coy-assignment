// Tiny JSON-file "database". Server-side only.
import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'data');
const readJSON = (file) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));

export function loadAll() {
  let state = { swipes: {}, matches: [] };
  try {
    state = readJSON('state.json'); // exists after the first swipe
  } catch {}
  return {
    profiles: readJSON('profiles.json'),
    likedYou: readJSON('likedYou.json'),
    swipes: state.swipes,
    matches: state.matches,
  };
}

export function saveState({ swipes, matches }) {
  fs.writeFileSync(path.join(dir, 'state.json'), JSON.stringify({ swipes, matches }, null, 2));
}

/** Demo helper: forget all swipes and matches. */
export function resetState() {
  try {
    fs.unlinkSync(path.join(dir, 'state.json'));
  } catch {} // already gone is fine
}
