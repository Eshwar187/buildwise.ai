import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendAdminEmail, generateAdminApprovalEmail } from "@/lib/email-service"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password, reason } = body

    if (!username || !email || !password || !reason) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Generate a unique approval token
    const approvalToken = crypto.randomBytes(32).toString("hex")

    try {
      const supabase = await createClient()

      // Store the admin request in the database
      await supabase
        .from('admin_requests')
        .insert({
          username,
          email,
          reason,
          status: "pending",
          approval_token: approvalToken,
          password_hash: crypto.createHash("sha256").update(password).digest("hex"),
        })
    } catch (dbError) {
      console.error("Database error creating admin request:", dbError)
      // Continue anyway, we'll still try to send the email
    }

    // Send an email to the main admin using Resend
    const { subject, html } = generateAdminApprovalEmail(username, email, reason, approvalToken)

    try {
      const emailResult = await sendAdminEmail({
        to: "jeshwar09052005@gmail.com",
        subject,
        html,
      })

      if (!emailResult.success) {
        console.error("Failed to send admin approval email:", emailResult.error)
      }
    } catch (emailError) {
      console.error("Error sending admin approval email:", emailError)
    }

    return NextResponse.json({
      success: true,
      message: "Admin registration request submitted successfully",
    })
  } catch (error) {
    console.error("Error processing admin registration:", error)
    return NextResponse.json({
      success: true,
      message: "Admin registration request submitted successfully",
    })
  }
}
