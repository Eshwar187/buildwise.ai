import Mailjet from "node-mailjet"

// Initialize Mailjet client
const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY || "",
  apiSecret: process.env.MAILJET_SECRET_KEY || "",
})

interface SendEmailParams {
  to: {
    email: string
    name?: string
  }
  subject: string
  htmlContent: string
  textContent?: string
}

export async function sendEmail({ to, subject, htmlContent, textContent }: SendEmailParams) {
  try {
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "noreply@constructhub.ai",
            Name: "ConstructHub.ai",
          },
          To: [
            {
              Email: to.email,
              Name: to.name || to.email,
            },
          ],
          Subject: subject,
          TextPart: textContent || "",
          HTMLPart: htmlContent,
        },
      ],
    })

    return { success: true, data: result.body }
  } catch (error) {
    console.error("Error sending email with Mailjet:", error)
    return { success: false, error }
  }
}

export function generateVerificationEmail(username: string, verificationCode: string) {
  return {
    subject: "Verify your ConstructHub.ai account",
    htmlContent: `
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
    textContent: `
      ConstructHub.ai
      
      Verify Your Email
      
      Hello ${username},
      
      Thank you for signing up for ConstructHub.ai. Please use the verification code below to complete your registration:
      
      ${verificationCode}
      
      This code will expire in 30 minutes.
      
      If you didn't request this verification, please ignore this email.
      
      Best regards,
      The ConstructHub.ai Team
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
    htmlContent: `
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
    textContent: `
      ConstructHub.ai Admin
      
      New Admin Registration Request
      
      A new user has requested admin access to ConstructHub.ai:
      
      Username: ${adminUsername}
      Email: ${adminEmail}
      Reason: ${reason}
      
      Please review this request and approve or deny access by visiting:
      ${approvalUrl}
      
      Best regards,
      The ConstructHub.ai System
    `,
  }
}

