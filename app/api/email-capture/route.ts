import { NextRequest, NextResponse } from 'next/server'
import { validateEmail, sanitizeInput } from '@/lib/utils/validation'
import { checkRateLimit, getClientIdentifier } from '@/lib/utils/rateLimit'
import logger from '@/lib/utils/logger'

/**
 * POST /api/email-capture
 * Captures email addresses for launch notifications
 * Sends email to faradaybach@gmail.com with the subscriber email
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(clientId, { windowMs: 60000, maxRequests: 5 })
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          },
        }
      )
    }

    const body = await request.json()
    const email = sanitizeInput(body.email?.trim() || '')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.errors[0] || 'Invalid email address' },
        { status: 400 }
      )
    }

    // Send email notification to faradaybach@gmail.com
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'faradaybach@gmail.com'
    const subject = 'New Email Capture: Learn Georgian App'
    const message = `
New email captured from Learn Georgian App:

Email: ${email}
Date: ${new Date().toISOString()}
User Agent: ${request.headers.get('user-agent') || 'Unknown'}
IP: ${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown'}

---

This email was sent automatically from the Learn Georgian App email capture form.
    `.trim()

    try {
      const { sendEmail } = await import('@/lib/utils/email')
      
      const fromEmail = process.env.RESEND_FROM_EMAIL || 
                       process.env.SENDGRID_FROM_EMAIL || 
                       'noreply@learngeorgian.com'
      
      const result = await sendEmail({
        to: notificationEmail,
        from: fromEmail,
        subject,
        text: message,
      })

      if (!result.success) {
        logger.warn('Email notification failed (but continuing)', {
          context: 'email-capture',
          data: { email, notificationEmail, error: result.error },
        })
      }
    } catch (emailError) {
      logger.error('Failed to send notification email', {
        context: 'email-capture',
        error: emailError instanceof Error ? emailError : new Error(String(emailError)),
        data: { email, notificationEmail },
      })

      // Don't fail the request if email sending fails
      // Still return success to user, but log the error
    }

    logger.info('Email captured successfully', {
      context: 'email-capture',
      data: { email },
    })

    return NextResponse.json({
      success: true,
      message: 'Email captured successfully. We\'ll notify you when the full version is ready!',
    })
  } catch (error) {
    logger.error('Email capture error', {
      context: 'email-capture',
      error: error instanceof Error ? error : new Error(String(error)),
    })

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

