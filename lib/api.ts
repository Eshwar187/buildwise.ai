import { NextResponse } from "next/server"

type JsonObject = Record<string, unknown>

export function successResponse<T extends JsonObject>(payload: T, init: ResponseInit = {}) {
  return NextResponse.json({ success: true, ...payload }, init)
}

export function errorResponse(
  message: string,
  status = 500,
  code = "internal_server_error",
  details?: unknown
) {
  const body: JsonObject = {
    success: false,
    error: message,
    code,
  }

  if (details !== undefined) {
    body.details = details
  }

  return NextResponse.json(body, { status })
}

