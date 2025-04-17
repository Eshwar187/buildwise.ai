import { NextResponse } from "next/server"
import { getAdminRequestByToken, updateAdminRequestStatus } from "@/lib/mongodb-models"
import { sendAdminEmail, generateAdminApprovalNotificationEmail } from "@/lib/email-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const action = searchParams.get("action")

    if (!token || !action || (action !== "approve" && action !== "deny")) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Get the admin request
    const adminRequest = await getAdminRequestByToken(token)
    if (!adminRequest) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    if (adminRequest.status !== "pending") {
      return NextResponse.json({ error: "This request has already been processed" }, { status: 400 })
    }

    // Update the admin request status
    const status = action === "approve" ? "approved" : "denied"
    await updateAdminRequestStatus(token, status)

    // Send an email to the user using Resend
    const { subject, html } = generateAdminApprovalNotificationEmail(adminRequest.username, status === "approved")

    await sendAdminEmail({
      to: adminRequest.email,
      subject,
      html,
      from: "ConstructHub.ai <jeshwar2009@gmail.com>", // Explicitly set the from address
    })

    // Redirect to a confirmation page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin/approval-confirmation?status=${status}`)
  } catch (error) {
    console.error("Error processing admin approval:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

