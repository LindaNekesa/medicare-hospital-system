// Email utility — uses fetch to call a mail API in production.
// In development, emails are logged to the console.

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    // Dev: log to console instead of sending
    console.log("[EMAIL]", {
      to:      options.to,
      subject: options.subject,
      text:    options.text ?? "(html only)",
    })
    return
  }

  // Production: use your SMTP API (e.g. Resend, SendGrid, Mailgun)
  // Replace this block with your preferred email provider SDK.
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("[EMAIL] RESEND_API_KEY not set — email not sent")
    return
  }

  await fetch("https://api.resend.com/emails", {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from:    process.env.EMAIL_FROM ?? "noreply@medicare.com",
      to:      options.to,
      subject: options.subject,
      html:    options.html,
      text:    options.text,
    }),
  })
}

// Convenience helpers
export function passwordResetEmail(name: string, resetUrl: string): EmailOptions {
  return {
    to:      "",  // caller sets this
    subject: "Reset your Medicare Hospital password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Password Reset</h2>
        <p>Hi ${name},</p>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:12px;margin-top:24px">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `,
    text: `Reset your password: ${resetUrl}`,
  }
}
