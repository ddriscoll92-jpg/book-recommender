// Shared helper for sending transactional emails via Resend.
// Not an API route itself — imported by other serverless functions.

const FROM = 'TeachReads <onboarding@resend.dev>'
const APP_URL = process.env.VITE_APP_URL || 'https://book-recommender-git-main-danny-driscoll-s-projects.vercel.app'

async function sendEmail({ to, subject, html }) {
  if (!to) {
    console.warn('sendEmail: no recipient, skipping', subject)
    return { skipped: true }
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })
    const data = await response.json()
    if (!response.ok) {
      console.error('Resend error:', subject, to, data)
      return { error: data }
    }
    return { success: true, data }
  } catch (err) {
    console.error('sendEmail error:', subject, to, err.message)
    return { error: err.message }
  }
}

function wrapper(bodyHtml) {
  return `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #2C2C2A;">
      <div style="background: #1E2433; padding: 20px 24px; border-radius: 12px 12px 0 0;">
        <span style="font-family: Georgia, serif; font-size: 20px; font-weight: 500; color: #fff;">TeachReads</span>
      </div>
      <div style="border: 1px solid #D3D1C7; border-top: none; border-radius: 0 0 12px 12px; padding: 28px 24px;">
        ${bodyHtml}
      </div>
      <p style="color: #B4B2A9; font-size: 12px; text-align: center; margin-top: 20px;">
        TeachReads · For UK primary school teachers
      </p>
    </div>
  `
}

function button(label, href) {
  return `<a href="${href}" style="display: inline-block; background: #1D9E75; color: #E1F5EE; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 14px; margin-top: 16px;">${label}</a>`
}

export async function sendWelcomeEmail(to, name) {
  const greeting = name ? `Hi ${name},` : 'Hi there,'
  const html = wrapper(`
    <h2 style="font-family: Georgia, serif; font-weight: 500; color: #1E2433; margin: 0 0 12px;">Welcome to TeachReads! 🎉</h2>
    <p style="font-size: 14px; line-height: 1.6;">${greeting}</p>
    <p style="font-size: 14px; line-height: 1.6;">Thanks for verifying your email — you're all set to start using TeachReads.</p>
    <p style="font-size: 14px; line-height: 1.6;">Here's what you can do:</p>
    <ul style="font-size: 14px; line-height: 1.8; color: #5F5E5A;">
      <li>Find books tailored to your year group and topic</li>
      <li>Generate full units of work from any book</li>
      <li>Create worksheets, comprehension activities, vocabulary cards and more</li>
      <li>Chat with the AI Assistant for quick teaching ideas</li>
    </ul>
    ${button('Get started →', APP_URL)}
    <p style="font-size: 13px; color: #5F5E5A; margin-top: 24px;">Your free trial is active — enjoy exploring!</p>
  `)
  return sendEmail({ to, subject: 'Welcome to TeachReads 🎉', html })
}

export async function sendTrialEndingEmail(to, name, daysLeft) {
  const greeting = name ? `Hi ${name},` : 'Hi there,'
  const dayWord = daysLeft === 0 ? 'today' : daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`
  const html = wrapper(`
    <h2 style="font-family: Georgia, serif; font-weight: 500; color: #1E2433; margin: 0 0 12px;">Your trial ends ${dayWord}</h2>
    <p style="font-size: 14px; line-height: 1.6;">${greeting}</p>
    <p style="font-size: 14px; line-height: 1.6;">Your TeachReads free trial ends ${dayWord}. To keep access to your saved plans, resources and the AI Assistant, upgrade to a paid plan.</p>
    ${button('Upgrade now →', `${APP_URL}?upgrade=1`)}
    <p style="font-size: 13px; color: #5F5E5A; margin-top: 24px;">If you do nothing, your account will move to the free tier and some features may become unavailable.</p>
  `)
  return sendEmail({ to, subject: `Your TeachReads trial ends ${dayWord}`, html })
}

export async function sendPlanUpgradedEmail(to, name, planName) {
  const greeting = name ? `Hi ${name},` : 'Hi there,'
  const html = wrapper(`
    <h2 style="font-family: Georgia, serif; font-weight: 500; color: #1E2433; margin: 0 0 12px;">You're on the ${planName} plan! 🎉</h2>
    <p style="font-size: 14px; line-height: 1.6;">${greeting}</p>
    <p style="font-size: 14px; line-height: 1.6;">Thanks for upgrading to TeachReads ${planName}. Your new plan is active now — enjoy the extra usage and features.</p>
    ${button('Go to TeachReads →', APP_URL)}
    <p style="font-size: 13px; color: #5F5E5A; margin-top: 24px;">You can manage your subscription anytime from your account settings.</p>
  `)
  return sendEmail({ to, subject: `You're now on the TeachReads ${planName} plan`, html })
}

export async function sendSubscriptionCancelledEmail(to, name) {
  const greeting = name ? `Hi ${name},` : 'Hi there,'
  const html = wrapper(`
    <h2 style="font-family: Georgia, serif; font-weight: 500; color: #1E2433; margin: 0 0 12px;">Your subscription has been cancelled</h2>
    <p style="font-size: 14px; line-height: 1.6;">${greeting}</p>
    <p style="font-size: 14px; line-height: 1.6;">We're sorry to see you go. Your TeachReads subscription has been cancelled and your account has moved to the free tier.</p>
    <p style="font-size: 14px; line-height: 1.6;">Your saved plans and resources are still there if you'd like to come back.</p>
    ${button('Reactivate anytime →', `${APP_URL}?upgrade=1`)}
    <p style="font-size: 13px; color: #5F5E5A; margin-top: 24px;">If this was a mistake or you have feedback, just reply to this email.</p>
  `)
  return sendEmail({ to, subject: 'Your TeachReads subscription has been cancelled', html })
}

export async function sendPaymentFailedEmail(to, name) {
  const greeting = name ? `Hi ${name},` : 'Hi there,'
  const html = wrapper(`
    <h2 style="font-family: Georgia, serif; font-weight: 500; color: #1E2433; margin: 0 0 12px;">We couldn't process your payment</h2>
    <p style="font-size: 14px; line-height: 1.6;">${greeting}</p>
    <p style="font-size: 14px; line-height: 1.6;">We tried to renew your TeachReads subscription, but the payment didn't go through. Please update your payment details to keep your plan active.</p>
    ${button('Update payment details →', `${APP_URL}?billing=1`)}
    <p style="font-size: 13px; color: #5F5E5A; margin-top: 24px;">If you don't update your details, your account may be moved to the free tier.</p>
  `)
  return sendEmail({ to, subject: 'Action needed: TeachReads payment failed', html })
}
