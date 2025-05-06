import { NextRequest, NextResponse } from 'next/server'
// ルートにアクセスがあった時にデフォルトロケールのルートに自動リダイレクト

// 対応しているロケール
const locales = ['ja', 'en']

// デフォルトロケール（ブラウザが非対応の場合など）
const defaultLocale = 'ja'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // すでにロケール付きのパスならスキップ（例: /ja/about）
  if (locales.some((locale) => pathname.startsWith(`/${locale}`))) {
    return NextResponse.next()
  }

  // Accept-Language ヘッダから最優先の言語を取得
  const acceptLang = request.headers.get('accept-language')
  const preferredLang = acceptLang?.split(',')[0].split('-')[0] || defaultLocale

  const locale = locales.includes(preferredLang) ? preferredLang : defaultLocale

  // / → /ja などへリダイレクト
  const page = pathname ? pathname : "/Home"
  return NextResponse.redirect(new URL(`/${locale}${page}`, request.url)) // TODO: /ja/Homeにリダイレクトされない
}

// matcher で対象パスを制限（静的ファイル等を除外）
export const config = {
  matcher: [
    // ルート・またはロケールなしのパスのみ対象
    '/',
    '/((?!_next|favicon|api|.*\\..*).*)',
  ],
}
