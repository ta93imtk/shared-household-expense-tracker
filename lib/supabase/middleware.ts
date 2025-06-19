import { type NextRequest, NextResponse } from 'next/server'

import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  // 認証不要なパス
  const publicPaths = ['/login', '/signup', '/', '/auth/callback']
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname === path)

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          return request.cookies.getAll()
        },
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // パブリックパスの場合は認証チェックをスキップ
  if (isPublicPath) {
    return supabaseResponse
  }

  // 認証状態を更新
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // エラーが発生した場合、または認証されていない場合
  if (error || !user) {
    const url = request.nextUrl.clone()

    url.pathname = '/login'

    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
