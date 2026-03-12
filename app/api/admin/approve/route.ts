import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendAdminEmail, generateAdminApprovalNotificationEmail } from "@/lib/email-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const action = searchParams.get("action")

    if (!token || !action || (action !== "approve" && action !== "deny")) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the admin request by token
    const { data: adminRequest, error: fetchError } = await supabase
      .from('admin_requests')
      .select('*')
      .eq('approval_token', token)
      .single()

    if (fetchError || !adminRequest) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    if (adminRequest.status !== "pending") {
      return NextResponse.json({ error: "This request has already been processed" }, { status: 400 })
    }

    // Update the admin request status
    const status = action === "approve" ? "approved" : "denied"
    const { error: updateError } = await supabase
      .from('admin_requests')
      .update({ status })
      .eq('approval_token', token)

    if (updateError) {
      console.error("Error updating admin request:", updateError)
      return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
    }

    // If approved, also update the user's admin status in the users table
    if (status === "approved") {
      await supabase
        .from('users')
        .update({ is_admin: true, is_approved: true })
        .eq('email', adminRequest.email)
    }

    // Send notification email to the user
    const { subject, html } = generateAdminApprovalNotificationEmail(adminRequest.username, status === "approved")

    await sendAdminEmail({
      to: adminRequest.email,
      subject,
      html,
      from: "ConstructHub.ai <jeshwar2009@gmail.com>",
    })

    // Redirect to a confirmation page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin/approval-confirmation?status=${status}`)
  } catch (error) {
    console.error("Error processing admin approval:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
