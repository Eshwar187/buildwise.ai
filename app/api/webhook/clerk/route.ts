import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createUser, updateUserLastActive } from "@/lib/mongodb-models"

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error: Invalid signature", {
      status: 400,
    })
  }

  // Handle the webhook event
  const eventType = evt.type

  if (eventType === "user.created") {
    const { id, username, email_addresses, first_name, last_name } = evt.data

    // Create a new user in our database
    await createUser({
      clerkId: id,
      username: username || email_addresses[0].email_address.split("@")[0],
      email: email_addresses[0].email_address,
      firstName: first_name || undefined,
      lastName: last_name || undefined,
      isAdmin: false,
      isAdminApproved: false,
    })
  } else if (eventType === "user.updated") {
    // Update user in our database if needed
  } else if (eventType === "session.created") {
    // Update user's last active timestamp
    const { user_id } = evt.data
    await updateUserLastActive(user_id)
  }

  return NextResponse.json({ success: true })
}

