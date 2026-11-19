# Coy Discover

Swipe-based Discover tab for the Coy SDE Intern assignment.

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm test           # backend logic tests
npm run seed       # (optional) regenerate mock profiles
```
Reset all swipes/matches: delete `data/state.json`.

## Stack
Next.js 14 (App Router) + API routes, JSON-file storage, no external libraries for gestures.

## API
| Route | What it does |
|---|---|
| `GET /api/feed` | Profiles not yet swiped on |
| `POST /api/swipe` `{profileId, action: "like"\|"pass"}` | Records swipe, returns `{match: bool}` |
| `GET /api/matches` | Mutual matches |

## Privacy rule (Coy's core promise)
Who liked you lives in `data/likedYou.json`, which is only read inside `processSwipe`.
It is never returned by any endpoint, so a like is revealed only when it becomes a match.

## Files
- `lib/logic.mjs` pure rules (feed, swipe, matches), unit-tested in `tests/`
- `lib/db.js` JSON file read/write
- `app/api/*` thin HTTP wrappers
- `components/Card.js` drag gesture + animation
- `components/Discover.js` feed, buttons, match screen, matches list

## Notes
Data is saved to a local file, so it persists across reloads when run locally or on a host with a writable disk.
