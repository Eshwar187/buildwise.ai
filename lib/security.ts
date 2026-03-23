import { NextResponse } from "next/server"
import { z } from "zod"

type RateLimitBucket = {
  count: number
  resetAt: number
}

type GlobalWithRateLimitStore = typeof globalThis & {
  __buildwiseRateLimitStore?: Map<string, RateLimitBucket>
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
}

export const emailSchema = z.string().trim().email().max(254)
export const passwordSchema = z.string().min(8).max(128)
export const shortTextSchema = z.string().trim().min(1).max(200)
export const longTextSchema = z.string().trim().min(1).max(4000)
export const idSchema = z.string().trim().min(1).max(128)

export function isProduction() {
  return process.env.NODE_ENV === "production"
}

export function applySecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([name, value]) => {
    response.headers.set(name, value)
  })

  if (isProduction()) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  }

  return response
}

export function getClientIp(request: Request) {
  const headers = request.headers
  const forwarded = headers.get("x-forwarded-for") || headers.get("x-vercel-forwarded-for")
  const connecting = headers.get("cf-connecting-ip") || headers.get("x-real-ip")
  const candidate = forwarded?.split(",")[0]?.trim() || connecting || "anonymous"

  return candidate || "anonymous"
}

function getRateLimitStore() {
  const globalForRateLimit = globalThis as GlobalWithRateLimitStore

  if (!globalForRateLimit.__buildwiseRateLimitStore) {
    globalForRateLimit.__buildwiseRateLimitStore = new Map<string, RateLimitBucket>()
  }

  return globalForRateLimit.__buildwiseRateLimitStore
}

function cleanupExpiredBuckets(store: Map<string, RateLimitBucket>, now: number) {
  if (store.size <= 500) {
    return
  }

  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) {
      store.delete(key)
    }
  }
}

export function rateLimitRequest(
  request: Request,
  {
    key,
    limit,
    windowMs,
  }: {
    key: string
    limit: number
    windowMs: number
  }
) {
  const store = getRateLimitStore()
  const now = Date.now()
  cleanupExpiredBuckets(store, now)

  const bucketKey = `${key}:${getClientIp(request)}`
  const bucket = store.get(bucketKey)

  if (!bucket || bucket.resetAt <= now) {
    store.set(bucketKey, { count: 1, resetAt: now + windowMs })
    return { limited: false, remaining: limit - 1, resetAt: now + windowMs }
  }

  bucket.count += 1
  store.set(bucketKey, bucket)

  if (bucket.count > limit) {
    return {
      limited: true,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      resetAt: bucket.resetAt,
    }
  }

  return {
    limited: false,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  }
}

export function createRateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "Cache-Control": "no-store",
      },
    }
  )
}

export function sanitizeText(value: unknown, maxLength = 500) {
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
    return ""
  }

  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength)
}

export function sanitizeMultilineText(value: unknown, maxLength = 4000) {
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
    return ""
  }

  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, maxLength)
}

export function escapeHtml(value: unknown) {
  const text = sanitizeMultilineText(value, 4000)

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function getSafeAppUrl(fallbackOrigin?: string) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "")

  if (envUrl) {
    return envUrl
  }

  if (fallbackOrigin) {
    return fallbackOrigin.replace(/\/$/, "")
  }

  return process.env.NODE_ENV === "production" ? "" : "http://localhost:3000"
}

export function isValidIdentifier(value: unknown) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(value)
}

export function isDebugRoute(pathname: string) {
  return pathname.startsWith("/api/debug") || pathname.startsWith("/api/debug-projects")
}
