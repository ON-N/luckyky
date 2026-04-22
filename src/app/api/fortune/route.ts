import { NextResponse } from 'next/server';

export async function POST() {
  // Phase 2: Gemini API 연동 예정
  return NextResponse.json({ message: 'AI fortune coming soon' }, { status: 200 });
}
