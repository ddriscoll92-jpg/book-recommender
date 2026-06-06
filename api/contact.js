export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, subject, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TeachReads <onboarding@resend.dev>',
        to: 'dd.driscoll92@gmail.com',
        reply_to: email,
        subject: `TeachReads contact: ${subject || 'General enquiry'}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1D9E75;">New TeachReads contact form submission</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; width: 120px;">Name</td>
                <td style="padding: 8px;">${name}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold;">Email</td>
                <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Subject</td>
                <td style="padding: 8px;">${subject || 'Not specified'}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message</td>
                <td style="padding: 8px; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
            <p style="color: #888; font-size: 12px; margin-top: 24px;">
              Sent from TeachReads contact form · Reply directly to this email to respond to ${name}
            </p>
          </div>
        `,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resend error:', data)
      return res.status(500).json({ error: data.message || 'Failed to send email' })
    }

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Contact error:', err)
    res.status(500).json({ error: err.message })
  }
}
