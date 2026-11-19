import { NextResponse } from 'next/server';
import { loadAll } from '../../../lib/db';
import { getFeed } from '../../../lib/logic.mjs';

export const dynamic = 'force-dynamic'; // never cache; the feed changes after every swipe

export async function GET() {
  const { profiles, swipes } = loadAll();
  return NextResponse.json({ profiles: getFeed(profiles, swipes) });
}
