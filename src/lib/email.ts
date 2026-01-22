import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY not set - Email features disabled')
}

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export const EMAIL_CONFIG = {
  from: process.env.EMAILS_FROM_EMAIL || 'noreply@lingograde.com',
  fromName: process.env.EMAILS_FROM_NAME || 'LingoGrade',
}

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailOptions) {
  if (!resend) {
    console.log('[Email] Would send email:', { to, subject })
    return { success: true, messageId: 'dev-mode' }
  }

  const { data, error } = await resend.emails.send({
    from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    reply_to: replyTo,
  })

  if (error) {
    console.error('[Email] Failed to send:', error)
    throw new Error(error.message)
  }

  return { success: true, messageId: data?.id }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to LingoGrade!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Welcome to LingoGrade, ${name}!</h1>
        <p>We're excited to have you on board. Start your language learning journey today.</p>
        <a href="${process.env.BETTER_AUTH_URL}/dashboard"
           style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Get Started
        </a>
      </div>
    `,
  }),

  verifyEmail: (verificationUrl: string) => ({
    subject: 'Verify your email address',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Verify your email</h1>
        <p>Click the button below to verify your email address.</p>
        <a href="${verificationUrl}"
           style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Verify Email
        </a>
        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  }),

  resetPassword: (resetUrl: string) => ({
    subject: 'Reset your password',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Reset your password</h1>
        <p>Click the button below to reset your password.</p>
        <a href="${resetUrl}"
           style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Reset Password
        </a>
        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  }),

  subscriptionConfirmed: (planName: string) => ({
    subject: 'Subscription confirmed!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">You're now on ${planName}!</h1>
        <p>Thank you for subscribing. You now have access to all ${planName} features.</p>
        <a href="${process.env.BETTER_AUTH_URL}/dashboard"
           style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Go to Dashboard
        </a>
      </div>
    `,
  }),

  lessonComplete: (lessonName: string, score: number) => ({
    subject: `Great job on "${lessonName}"!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Lesson Complete!</h1>
        <p>You finished <strong>${lessonName}</strong> with a score of <strong>${score}%</strong>.</p>
        <p>Keep up the great work on your language learning journey!</p>
        <a href="${process.env.BETTER_AUTH_URL}/dashboard"
           style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Continue Learning
        </a>
      </div>
    `,
  }),
}

// Send templated emails
export async function sendWelcomeEmail(to: string, name: string) {
  const template = emailTemplates.welcome(name)
  return sendEmail({ to, ...template })
}

export async function sendVerificationEmail(to: string, verificationUrl: string) {
  const template = emailTemplates.verifyEmail(verificationUrl)
  return sendEmail({ to, ...template })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const template = emailTemplates.resetPassword(resetUrl)
  return sendEmail({ to, ...template })
}

export async function sendSubscriptionEmail(to: string, planName: string) {
  const template = emailTemplates.subscriptionConfirmed(planName)
  return sendEmail({ to, ...template })
}

export async function sendLessonCompleteEmail(
  to: string,
  lessonName: string,
  score: number
) {
  const template = emailTemplates.lessonComplete(lessonName, score)
  return sendEmail({ to, ...template })
}
