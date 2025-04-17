import { NextResponse } from "next/server"
import { sendUserEmail, generateVerificationEmail } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email } = body

    if (!username || !email) {
      return NextResponse.json({ error: "Username and email are required" }, { status: 400 })
    }

    // Generate a random verification code (this is just for show, Clerk handles the actual verification)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Generate email content
    const { subject, htmlContent, textContent } = generateVerificationEmail(username, verificationCode)

    // Send email using Mailjet
    const result = await sendUserEmail({
      to: { email, name: username },
      subject,
      htmlContent,
      textContent,
    })

    if (!result.success) {
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending verification email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

