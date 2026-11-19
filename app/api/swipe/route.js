import { NextResponse } from 'next/server';
import { loadAll, saveState } from '../../../lib/db';
import { processSwipe } from '../../../lib/logic.mjs';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const state = loadAll();
  const result = processSwipe(state, body.profileId, body.action);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  saveState(state); // persist so a page reload keeps everything
  return NextResponse.json({ match: result.match });
}
