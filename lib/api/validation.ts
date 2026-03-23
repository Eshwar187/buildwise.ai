const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function asTrimmedString(value: unknown, maxLength = 5000): string {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, maxLength)
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value)
}

export function asPositiveNumber(value: unknown): number | null {
  const num = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(num) || num <= 0) return null
  return num
}
