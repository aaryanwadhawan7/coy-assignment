import { NextResponse } from 'next/server';
import { loadAll } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { likedYou } = loadAll();
  return NextResponse.json({ someoneLikesYou: likedYou.length > 0 });
}