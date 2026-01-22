/**
 * Email Templates for Marketing Campaigns
 * 
 * Usage:
 *   import { getEmailTemplate } from '@/lib/email-templates'
 *   const template = getEmailTemplate('welcome', { firstName: 'John' })
 */

export type EmailTemplate = 'welcome' | 'newsletter' | 'marketing' | 'product-update' | 're-engagement' | 'win-back'

interface TemplateData {
  firstName?: string
  appName?: string
  dashboardUrl?: string
  unsubscribeUrl?: string
  title?: string
  subtitle?: string
  headline?: string
  subheadline?: string
  message?: string
  ctaUrl?: string
  ctaText?: string
  offerEnd?: string
  features?: Array<{ title: string; description: string }>
  articles?: Array<{ title: string; excerpt: string; url: string }>
}

const templates: Record<EmailTemplate, (data: TemplateData) => string> = {
  welcome: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${data.appName || 'Our Platform'}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0; }
    .content { background: white; padding: 40px 30px; border: 1px solid #e2e8f0; border-top: none; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; margin: 20px 0; }
    .features { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .feature { background: #f8fafc; padding: 15px; border-radius: 10px; text-align: center; }
    .feature h4 { margin: 0 0 8px 0; color: #1e293b; }
    .feature p { margin: 0; font-size: 13px; color: #64748b; }
    .footer { text-align: center; padding: 30px; color: #94a3b8; font-size: 13px; }
    .footer a { color: #667eea; text-decoration: none; }
    @media (max-width: 600px) { .features { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">Welcome to ${data.appName || 'Our Platform'}! 🎉</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">We're thrilled to have you on board</p>
    </div>
    <div class="content">
      <p>Hi ${data.firstName || 'there'},</p>
      <p>Thank you for signing up! You're now part of a community of ${data.appName === 'CRM Pro' ? '10,000+' : 'thousands of'} users transforming how they work.</p>
      
      <div class="features">
        <div class="feature">
          <h4>🚀 Get Started</h4>
          <p>Complete your profile and invite your team</p>
        </div>
        <div class="feature">
          <h4>📚 Learn More</h4>
          <p>Explore tutorials and documentation</p>
        </div>
        <div class="feature">
          <h4>💬 Get Support</h4>
          <p>Our team is here to help 24/7</p>
        </div>
        <div class="feature">
          <h4>🎯 Take Action</h4>
          <p>Start your first project today</p>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${data.dashboardUrl || '#'}" class="button">Go to Dashboard</a>
      </div>

      <p style="color: #64748b; font-size: 14px;">If you have any questions, just reply to this email. We're always happy to help!</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${data.appName || 'Platform'}. All rights reserved.</p>
      <p>
        <a href="${data.unsubscribeUrl || '#'}">Unsubscribe</a> · 
        <a href="#">Privacy Policy</a> · 
        <a href="#">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `,

  newsletter: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title || 'Weekly Newsletter'}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 30px; border-bottom: 3px solid #667eea; }
    .header h1 { margin: 0; color: #1e293b; font-size: 24px; }
    .header p { color: #64748b; margin: 8px 0 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }
    .article { padding: 20px 0; border-bottom: 1px solid #e2e8f0; }
    .article:last-child { border-bottom: none; }
    .article h3 { margin: 0 0 10px 0; color: #1e293b; }
    .article p { margin: 0 0 15px 0; color: #64748b; }
    .article a { color: #667eea; text-decoration: none; font-weight: 600; }
    .cta { display: block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; text-align: center; text-decoration: none; border-radius: 10px; font-weight: 600; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
    .footer a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📬 ${data.title || 'Weekly Newsletter'}</h1>
      <p>${data.subtitle || 'The latest updates and insights'}</p>
    </div>
    <div class="content">
      ${data.articles?.map(article => `
        <div class="article">
          <h3>${article.title}</h3>
          <p>${article.excerpt}</p>
          <a href="${article.url}">Read more →</a>
        </div>
      `).join('') || '<p>No new articles this week. Stay tuned!</p>'}
      
      <a href="${data.dashboardUrl || '#'}" class="cta">Explore More Content</a>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
      <p><a href="${data.unsubscribeUrl || '#'}">Unsubscribe</a> from future emails</p>
    </div>
  </div>
</body>
</html>
  `,

  marketing: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.headline || 'Special Offer'}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 50px 30px; text-align: center; border-radius: 16px; }
    .hero h1 { margin: 0 0 15px 0; font-size: 32px; }
    .hero p { margin: 0; opacity: 0.95; font-size: 18px; }
    .content { background: white; padding: 40px 30px; border: 1px solid #e2e8f0; margin-top: -10px; border-radius: 0 0 16px 16px; }
    .message { font-size: 16px; color: #475569; margin-bottom: 25px; }
    .features { display: flex; gap: 15px; margin: 25px 0; }
    .feature { flex: 1; background: #f8fafc; padding: 20px; border-radius: 12px; text-align: center; }
    .feature h4 { margin: 0 0 8px 0; color: #1e293b; }
    .feature p { margin: 0; font-size: 13px; color: #64748b; }
    .cta { display: block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px; text-align: center; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 18px; margin: 25px 0; }
    .offer { background: #fef3c7; color: #92400e; padding: 15px; text-align: center; border-radius: 10px; font-weight: 600; }
    .footer { text-align: center; padding: 25px; color: #94a3b8; font-size: 12px; }
    .footer a { color: #667eea; text-decoration: none; }
    @media (max-width: 600px) { .features { flex-direction: column; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <h1>${data.headline || 'Discover What\'s New'}</h1>
      <p>${data.subheadline || ''}</p>
    </div>
    <div class="content">
      <p class="message">${data.message || 'We have something exciting to share with you!'}</p>
      
      ${data.features ? `
        <div class="features">
          ${data.features.map(f => `
            <div class="feature">
              <h4>${f.title}</h4>
              <p>${f.description}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <div class="offer">
        ⏰ Offer ends ${data.offerEnd || 'soon'} - Don't miss out!
      </div>

      <a href="${data.ctaUrl || '#'}" class="cta">${data.ctaText || 'Get Started Now'}</a>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
      <p>
        <a href="${data.unsubscribeUrl || '#'}">Unsubscribe</a> · 
        <a href="#">Update Preferences</a> · 
        <a href="#">View in Browser</a>
      </p>
    </div>
  </div>
</body>
</html>
  `,

  'product-update': (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>What's New</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: white; padding: 40px 30px; border: 1px solid #e2e8f0; border-top: none; }
    .update { padding: 25px; background: #f0fdf4; border-radius: 12px; margin-bottom: 20px; }
    .update h3 { margin: 0 0 10px 0; color: #065f46; }
    .update p { margin: 0; color: #047857; }
    .cta { display: inline-block; background: #10b981; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 15px; }
    .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ What's New</h1>
      <p>Product updates and improvements</p>
    </div>
    <div class="content">
      <h2>${data.title || 'Latest Features'}</h2>
      <p>${data.message || 'We\'ve been busy making things better for you!'}</p>
      
      ${data.features?.map(f => `
        <div class="update">
          <h3>${f.title}</h3>
          <p>${f.description}</p>
        </div>
      `).join('') || ''}
      
      <a href="${data.ctaUrl || '#'}" class="cta">${data.ctaText || 'Try It Now'}</a>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${data.appName || 'Platform'}</p>
    </div>
  </div>
</body>
</html>
  `,

  're-engagement': (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We miss you!</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #fef2f2; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 50px 30px; text-align: center; border-radius: 16px; }
    .content { background: white; padding: 40px 30px; border-radius: 16px; margin-top: -10px; }
    .cta { display: block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 18px; text-align: center; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 18px; margin: 25px 0; }
    .offer { background: #fef3c7; color: #92400e; padding: 20px; text-align: center; border-radius: 10px; font-weight: 600; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>😢 We miss you, ${data.firstName || 'there'}!</h1>
      <p>It's been a while since we saw you</p>
    </div>
    <div class="content">
      <p>Hi ${data.firstName || 'there'},</p>
      <p>We noticed you haven't logged in recently. Here's what's been happening:</p>
      
      <div class="offer">
        🎁 Come back today and get <strong>20% off</strong> your next month!
      </div>
      
      <a href="${data.ctaUrl || '#'}" class="cta">${data.ctaText || 'Come Back Now'}</a>
      
      <p style="color: #64748b; font-size: 14px;">Or <a href="#" style="color: #f59e0b;">let us know</a> if there's anything we can do to help.</p>
    </div>
  </div>
</body>
</html>
  `,

  'win-back': (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Special Offer Just for You</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
    .container { max-width: 500px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
    h1 { color: #1e293b; margin: 0 0 20px 0; font-size: 28px; }
    p { color: #64748b; margin: 0 0 25px 0; }
    .offer { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #92400e; padding: 25px; border-radius: 15px; margin-bottom: 25px; }
    .offer h2 { margin: 0 0 10px 0; font-size: 36px; }
    .offer p { margin: 0; color: #b45309; }
    .cta { display: block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 18px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>${data.headline || 'Welcome Back!'}</h1>
      <p>${data.message || 'We have a special offer just for you...'}</p>
      
      <div class="offer">
        <h2>50% OFF</h2>
        <p>Your next 3 months</p>
      </div>
      
      <a href="${data.ctaUrl || '#'}" class="cta">${data.ctaText || 'Claim Offer'}</a>
    </div>
  </div>
</body>
</html>
  `,
}

export function getEmailTemplate(template: EmailTemplate, data: TemplateData = {}): string {
  const fn = templates[template]
  if (!fn) {
    throw new Error(`Unknown email template: ${template}`)
  }
  return fn(data)
}

export function previewTemplate(template: EmailTemplate) {
  console.log(`\n📧 ${template.toUpperCase()} TEMPLATE PREVIEW`)
  console.log('='.repeat(50))
  const html = getEmailTemplate(template, {
    firstName: 'John',
    appName: 'Demo App',
    dashboardUrl: 'https://demo.app/dashboard',
    title: 'Weekly Newsletter',
    subtitle: 'Latest updates and insights',
    headline: 'Special Announcement',
    subheadline: 'Something exciting is happening!',
    message: 'We wanted to share some great news with you.',
    ctaUrl: 'https://demo.app/cta',
    ctaText: 'Click Here',
    offerEnd: 'this Friday',
    features: [
      { title: 'Feature 1', description: 'Description of feature 1' },
      { title: 'Feature 2', description: 'Description of feature 2' },
    ],
    articles: [
      { title: 'Article 1', excerpt: 'Excerpt from article 1...', url: '#' },
      { title: 'Article 2', excerpt: 'Excerpt from article 2...', url: '#' },
    ],
  })
  
  console.log(`Template generated (${html.length} characters)`)
  console.log('Preview saved to: /tmp/email-preview.html')
  fs.writeFileSync('/tmp/email-preview.html', html)
  return html
}

import fs from 'fs'
