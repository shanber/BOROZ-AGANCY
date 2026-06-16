import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isLocale, LOCALE_COOKIE } from '@/app/lib/i18n';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const locale = body?.locale;
    if (!isLocale(locale)) {
      return NextResponse.json({ error: 'invalid locale' }, { status: 400 });
    }
    cookies().set({
      name: LOCALE_COOKIE,
      value: locale,
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
    return NextResponse.json({ ok: true, locale });
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
}
