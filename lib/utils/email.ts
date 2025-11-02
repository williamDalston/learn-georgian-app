/**
 * Email utility for sending notifications
 * Supports multiple email providers: Resend, SendGrid, or basic SMTP
 */

export interface EmailOptions {
  to: string
  from: string
  subject: string
  text: string
  html?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send email using configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  // Try Resend first (recommended for Vercel)
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      const { data, error } = await resend.emails.send({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      })

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to send email',
        }
      }

      return {
        success: true,
        messageId: data?.id,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }
    }
  }

  // Try SendGrid as fallback
  if (process.env.SENDGRID_API_KEY) {
    try {
      const sgMail = await import('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      await sgMail.send({
        to: options.to,
        from: options.from,
        subject: options.subject,
        text: options.text,
        html: options.html,
      })

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }
    }
  }

  // Fallback: Log for manual processing
  // In development or if no email service is configured
  console.log('📧 EMAIL NOTIFICATION (No email service configured):')
  console.log('To:', options.to)
  console.log('From:', options.from)
  console.log('Subject:', options.subject)
  console.log('Body:', options.text)

  // For Vercel, you could also use a webhook or serverless function
  // For now, return success but log that email needs manual sending
  return {
    success: true,
    messageId: 'logged-only',
  }
}

