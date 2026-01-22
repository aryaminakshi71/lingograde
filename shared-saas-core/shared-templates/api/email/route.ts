import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html, text, template, data } = body

    if (!to || !subject) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to, subject' },
        { status: 400 }
      )
    }

    const provider = process.env.EMAIL_PROVIDER || 'resend'

    if (provider === 'resend' && process.env.RESEND_API_KEY) {
      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
        to: Array.isArray(to) ? to : [to],
        subject,
        html: html || generateTemplate(template, data),
        text,
      })

      return NextResponse.json({
        success: true,
        messageId: result.data?.id,
        provider: 'resend',
      })
    }

    if (provider === 'console' || !process.env.SMTP_HOST) {
      console.log('\n📧 EMAIL SENT (Console Mode)')
      console.log(`To: ${Array.isArray(to) ? to.join(', ') : to}`)
      console.log(`Subject: ${subject}`)
      console.log(`Template: ${template || 'none'}`)
      console.log(`Data: ${JSON.stringify(data, null, 2)}`)
      console.log('---')

      return NextResponse.json({
        success: true,
        messageId: `console-${Date.now()}`,
        provider: 'console',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Email provider not configured' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

function generateTemplate(template: string, data: Record<string, any>): string {
  const templates: Record<string, string> = {
    welcome: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e2e8f0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ${data.appName || 'Our Platform'}!</h1>
          </div>
          <div class="content">
            <p>Hi ${data.firstName || 'there'},</p>
            <p>Thank you for signing up! We're excited to have you on board.</p>
            <p>Here's what you can do next:</p>
            <ul>
              <li>Complete your profile</li>
              <li>Explore our features</li>
              <li>Connect with your team</li>
            </ul>
            <a href="${data.dashboardUrl || '#'}" class="button">Go to Dashboard</a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${data.appName || 'Platform'}. All rights reserved.</p>
            <p>Unsubscribe | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </body>
      </html>
    `,
    newsletter: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px; border-bottom: 2px solid #667eea; }
          .content { padding: 30px 0; }
          .article { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 10px 25px; text-decoration: none; border-radius: 6px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 ${data.title || 'Weekly Newsletter'}</h1>
            <p>${data.subtitle || 'The latest updates and insights'}</p>
          </div>
          <div class="content">
            ${data.articles?.map((article: any) => `
              <div class="article">
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <a href="${article.url}" class="button">Read More</a>
              </div>
            `).join('') || '<p>No new articles this week.</p>'}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            <p><a href="${data.unsubscribeUrl || '#'}">Unsubscribe</a> from future emails.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    marketing: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px; }
          .content { padding: 30px; background: #fff; border: 1px solid #e2e8f0; margin-top: -10px; }
          .cta { display: block; background: #667eea; color: white; padding: 15px 30px; text-align: center; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .features { display: flex; gap: 15px; margin: 20px 0; }
          .feature { flex: 1; text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="hero">
            <h1>${data.headline || 'Discover What's New'}</h1>
            <p>${data.subheadline || ''}</p>
          </div>
          <div class="content">
            <p>${data.message || ''}</p>
            ${data.features ? `
              <div class="features">
                ${data.features.map((f: any) => `
                  <div class="feature">
                    <h4>${f.title}</h4>
                    <p>${f.description}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            <a href="${data.ctaUrl || '#'}" class="cta">${data.ctaText || 'Get Started Now'}</a>
            <p style="font-size: 12px; color: #666;">Offer ends ${data.offerEnd || 'soon'}</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            <p><a href="${data.unsubscribeUrl || '#'}">Unsubscribe</a> | <a href="${data.preferencesUrl || '#'}">Update Preferences</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  return templates[template] || html || ''
}
