import { Resend } from "resend"

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, from, replyTo }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: from || "ConstructHub.ai <onboarding@resend.dev>",
      to: typeof to === "string" ? [to] : to,
      subject,
      html,
      replyTo: replyTo || "support@constructhub.ai",
    })

    if (error) {
      console.error("Error sending email with Resend:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending email with Resend:", error)
    return { success: false, error }
  }
}

export function generateVerificationEmail(username: string, verificationCode: string) {
  return {
    subject: "Verify your ConstructHub.ai account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #0891b2, #14b8a6); padding: 20px; text-align: center; color: white;">
          <h1>ConstructHub.ai</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2>Verify Your Email</h2>
          <p>Hello ${username},</p>
          <p>Thank you for signing up for ConstructHub.ai. Please use the verification code below to complete your registration:</p>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${verificationCode}</strong>
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <p>Best regards,<br>The ConstructHub.ai Team</p>
        </div>
      </div>
    `,
  }
}

export function generateAdminApprovalEmail(
  adminUsername: string,
  adminEmail: string,
  reason: string,
  approvalToken: string,
) {
  const approvalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/approve?token=${approvalToken}`

  return {
    subject: "New Admin Registration Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #14b8a6, #10b981); padding: 20px; text-align: center; color: white;">
          <h1>ConstructHub.ai Admin</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2>New Admin Registration Request</h2>
          <p>A new user has requested admin access to ConstructHub.ai:</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; margin: 20px 0;">
            <p><strong>Username:</strong> ${adminUsername}</p>
            <p><strong>Email:</strong> ${adminEmail}</p>
            <p><strong>Reason:</strong> ${reason}</p>
          </div>
          
          <p>Please review this request and approve or deny access:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${approvalUrl}&action=approve" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Approve</a>
            <a href="${approvalUrl}&action=deny" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Deny</a>
          </div>
          
          <p>Or you can copy and paste this URL into your browser:</p>
          <p style="word-break: break-all;">${approvalUrl}</p>
          
          <p>Best regards,<br>The ConstructHub.ai System</p>
        </div>
      </div>
    `,
  }
}

export function generateAdminApprovalNotificationEmail(username: string, isApproved: boolean) {
  return {
    subject: isApproved ? "Your Admin Request Has Been Approved" : "Your Admin Request Has Been Denied",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #14b8a6, #10b981); padding: 20px; text-align: center; color: white;">
          <h1>ConstructHub.ai Admin</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2>${isApproved ? "Admin Request Approved" : "Admin Request Denied"}</h2>
          <p>Hello ${username},</p>
          ${
            isApproved
              ? `<p>Your request for admin access to ConstructHub.ai has been <strong>approved</strong>. You can now log in with your credentials and access the admin dashboard.</p>
               <div style="text-align: center; margin: 30px 0;">
                 <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/sign-in" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Admin Dashboard</a>
               </div>`
              : `<p>Your request for admin access to ConstructHub.ai has been <strong>denied</strong>. If you believe this is an error, please contact our support team.</p>`
          }
          <p>Best regards,<br>The ConstructHub.ai Team</p>
        </div>
      </div>
    `,
  }
}

