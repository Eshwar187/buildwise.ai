import { sendUserEmail, generateVerificationEmail } from "@/lib/email-service"
import { errorResponse, successResponse } from "@/lib/api"
import { asTrimmedString, isValidEmail } from "@/lib/api/validation"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const username = asTrimmedString(body?.username, 120)
    const email = asTrimmedString(body?.email, 320).toLowerCase()

    if (!username || !email || !isValidEmail(email)) {
      return errorResponse("Valid username and email are required", 400, "validation_error")
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
      return errorResponse("Failed to send verification email", 500, "email_send_failed")
    }

    return successResponse({})
  } catch (error) {
    console.error("Error sending verification email:", error)
    return errorResponse("Internal server error", 500)
  }
}

