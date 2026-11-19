# Coy Discover

A swipe-based "Discover" tab for the Coy SDE Intern assignment (Part B), built as a standalone app with a blank "Home" tab and a working "Discover" tab.

## Run it

    npm install
    npm run dev        # http://localhost:3000 (use phone view in browser dev tools)
    npm test           # backend logic + privacy tests
    npm run seed       # optional: regenerate mock profiles

To start over, press **Reset demo** in the app (it calls `POST /api/reset`), or delete `data/state.json`.

## Features
- 32 seeded profiles (name, age, photo, bio, city/college, interests). 11 of them have already liked you, so matches are easy to demo.
- Swipe with drag gestures on mobile, buttons or arrow keys on desktop, with fly-out animation and Like/Pass stamps.
- A swiped profile never appears again, including after a reload.
- "It's a match!" screen, plus a Matches list.
- Empty state when no profiles are left.

## Privacy: Coy's core promise
Who liked you is stored in `data/likedYou.json`, separate from the public profile data. It is only read inside `processSwipe` to decide whether a swipe becomes a match, and no endpoint ever returns it. The only hint the UI gets is a yes/no ("someone likes you"), never who or how many. Tests in `tests/privacy.test.mjs` check that profile data and the feed contain nothing that reveals likers.

## API
| Route | Purpose |
|---|---|
| `GET /api/feed` | Profiles you have not swiped on yet |
| `POST /api/swipe` | Body `{ profileId, action: "like" \| "pass" }`. Returns `{ match: boolean }`. Errors: 400 bad action, 404 unknown profile, 409 already swiped |
| `GET /api/matches` | Mutual matches |
| `GET /api/hint` | `{ someoneLikesYou: boolean }`, nothing more |
| `POST /api/reset` | Demo only: clears swipes and matches |

(Next.js API routes live under `/api`.)

## How it is built
- `lib/logic.mjs`: pure rules (`getFeed`, `processSwipe`, `getMatches`), no files or HTTP, so they are easy to unit test.
- `lib/db.js`: reads and writes the JSON files. Swipes and matches persist in `data/state.json`.
- `app/api/*`: thin HTTP wrappers around the logic.
- `components/Card.js`: drag gesture (pointer events, 100px threshold) and animation, no gesture library.
- `components/Discover.js`: feed, buttons, match screen, matches list.
- `app/page.js`: tab bar with a blank Home tab and the Discover tab.

Stack: Next.js 14 (App Router), React 18, JSON-file storage. No external auth: a single logged-in user is assumed.

## Decisions and trade-offs
- **JSON file storage** keeps setup to zero. It needs a writable disk, so persistence works locally but not on serverless hosts like Vercel. For production I would use a database (for example SQLite or Postgres) with a swipes table keyed by user and profile.
- **Duplicate protection:** a repeated swipe returns 409 and never creates a second match.
- **Photos** come from picsum.photos (internet needed); a gradient shows if one fails to load.

## Part A: feature suggestions
1. **Delivery status per crush** (Sent / Delivered / Failed, with resend). After adding a crush there is no feedback on whether the notification arrived, which causes anxiety and churn. No read receipts, to protect privacy.
2. **Anonymous fun profile** (avatar + one playful line). "Someone likes you" is easy to ignore; a vague, user-controlled hint makes it intriguing and raises add-back rates without revealing identity.

## AI disclosure
Built with AI assistance (Claude). I reviewed and tested the code and can walk through any part of it.