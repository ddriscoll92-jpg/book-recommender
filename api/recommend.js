export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured — check environment variables in Vercel' })
  }

  console.log('API key found, length:', apiKey.length)
  console.log('API key starts with:', apiKey.substring(0, 10))

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    console.log('Anthropic response status:', response.status)
    console.log('Anthropic response:', JSON.stringify(data))

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error', detail: data })
    }

    const text = data.content.map(b => b.text || '').join('')
    const clean = text.replace(/```json|```/g, '').trim()
    const books = JSON.parse(clean)

    return res.status(200).json({ books })
  } catch (err) {
    console.log('Caught error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
