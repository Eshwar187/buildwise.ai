import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import {
  applySecurityHeaders,
  createRateLimitResponse,
  isDebugRoute,
  isProduction,
  rateLimitRequest,
} from '@/lib/security'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isProduction() && isDebugRoute(pathname)) {
    return applySecurityHeaders(
      new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      }) as any
    )
  }

  if (
    pathname.startsWith('/api/auth/signin') ||
    pathname.startsWith('/api/auth/signup') ||
    pathname.startsWith('/api/auth/send-verification') ||
    pathname.startsWith('/api/admin/register') ||
    pathname.startsWith('/api/admin/approve')
  ) {
    const limit = pathname.startsWith('/api/admin') ? 5 : 10
    const rateLimit = rateLimitRequest(request, {
      key: pathname,
      limit,
      windowMs: 60_000,
    })

    if (rateLimit.limited) {
      return applySecurityHeaders(createRateLimitResponse(rateLimit.retryAfter ?? 60))
    }
  }

  if (
    pathname.startsWith('/api/ai') ||
    pathname.startsWith('/api/real-time')
  ) {
    const rateLimit = rateLimitRequest(request, {
      key: pathname,
      limit: 20,
      windowMs: 60_000,
    })

    if (rateLimit.limited) {
      return applySecurityHeaders(createRateLimitResponse(rateLimit.retryAfter ?? 60))
    }
  }

  const response = await updateSession(request)
  return applySecurityHeaders(response)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, svg, etc
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
