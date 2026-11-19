import { NextResponse } from 'next/server';
import { loadAll } from '../../../lib/db';
import { getMatches } from '../../../lib/logic.mjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { profiles, matches } = loadAll();
  return NextResponse.json({ matches: getMatches(profiles, matches) });
}
