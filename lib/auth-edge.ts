import { SignJWT, jwtVerify } from "jose"

export const AUTH_COOKIE_NAME = "buildwise_auth_token"
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "buildwise-super-secret-key-change-in-production"
)
const JWT_EXPIRY = "7d"

// JWT helpers (using jose — Edge-compatible, works in middleware)
export async function signToken(payload: {
  userId: string
  email: string
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyToken(
  token: string
): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string; email: string }
  } catch {
    return null
  }
}

// Extract userId from a Request object (for middleware — Edge Runtime safe)
export async function getAuthFromRequest(
  request: Request
): Promise<string | null> {
  try {
    const cookieHeader = request.headers.get("cookie") || ""
    const match = cookieHeader.match(
      new RegExp(`${AUTH_COOKIE_NAME}=([^;]+)`)
    )
    if (!match) return null

    const payload = await verifyToken(match[1])
    return payload?.userId || null
  } catch {
    return null
  }
}
