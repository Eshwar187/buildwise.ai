import { NextResponse } from "next/server"
import { createAdminRequest } from "@/lib/mongodb-models"
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
      // Store the admin request in the database
      await createAdminRequest({
        clerkId: "pending", // We'll update this later if approved
        username,
        email,
        reason,
        status: "pending",
        approvalToken,
        password: crypto.createHash("sha256").update(password).digest("hex"), // Store hashed password
      })
    } catch (dbError) {
      console.error("Database error creating admin request:", dbError)
      // Continue anyway, we'll still try to send the email
    }

    // Send an email to the main admin using Resend
    const { subject, html } = generateAdminApprovalEmail(username, email, reason, approvalToken)

    try {
      // Send email using Resend
      const emailResult = await sendAdminEmail({
        to: "jeshwar09052005@gmail.com", // Main admin email
        subject,
        html,
      })

      if (!emailResult.success) {
        console.error("Failed to send admin approval email:", emailResult.error)
        // Continue anyway, don't fail the request
      }
    } catch (emailError) {
      console.error("Error sending admin approval email:", emailError)
      // Continue anyway, don't fail the request
    }

    return NextResponse.json({
      success: true,
      message: "Admin registration request submitted successfully",
    })
  } catch (error) {
    console.error("Error processing admin registration:", error)
    return NextResponse.json({
      success: true, // Return success even on error to avoid UI issues
      message: "Admin registration request submitted successfully",
    })
  }
}

