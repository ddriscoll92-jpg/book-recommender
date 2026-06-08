export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { prompt, raw } = req.body
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 6000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' })

    const text = data.content.map(b => b.text || '').join('')
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    // raw=true means lesson ideas (object), otherwise book list (array)
    if (raw) return res.status(200).json({ result: parsed })
    return res.status(200).json({ books: parsed })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
