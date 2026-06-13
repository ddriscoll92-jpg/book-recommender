export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { prompt, raw, worksheetMode, writingFrameMode, comprehensionMode, exitTicketMode, vocabCardsMode, knowledgeOrgMode, assistantMode, history, systemPrompt: clientSystemPrompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  let systemPrompt = null
  let maxTokens = 6000

  if (worksheetMode) {
    maxTokens = 4000
    systemPrompt = `You are an expert UK primary school teacher creating print-ready differentiated worksheets.
You must return ONLY valid JSON — no markdown, no explanation, no backticks.
The JSON must have this exact structure:
{
  "title": "Short worksheet title e.g. Adding 2-Digit Numbers",
  "subject": "Maths",
  "yearGroup": "Year 2",
  "skill": "One-line description of the skill being practised",
  "tiers": [
    {
      "level": "Support",
      "colour": "#DC2626",
      "emoji": "🔴",
      "instructions": "Short instruction for pupils",
      "questions": [
        { "type": "equation", "q": "5 + 3 = ___" },
        { "type": "column", "top": "23", "op": "+", "bottom": "14" },
        { "type": "word", "text": "Sam has 12 apples. He picks 5 more. How many does he have?", "answer": "___ apples" },
        { "type": "missing", "q": "___ + 6 = 15" }
      ],
      "challenge": "Challenge question or extension task"
    },
    {
      "level": "Core",
      "colour": "#D97706",
      "emoji": "🟡",
      "instructions": "...",
      "questions": [...],
      "challenge": "..."
    },
    {
      "level": "Extension",
      "colour": "#16A34A",
      "emoji": "🟢",
      "instructions": "...",
      "questions": [...],
      "challenge": "..."
    }
  ]
}
Rules:
- Each tier must have exactly 10 questions
- Question types: "equation" (simple sum with ___), "column" (stacked sum), "word" (word problem), "missing" (find the missing number), "number_line" (use a number line)
- Support tier: simpler numbers, more scaffolding, smaller values
- Core tier: age-expected difficulty, mixed question types
- Extension tier: larger numbers, multi-step, reasoning
- Align to UK National Curriculum for the year group mentioned
- Make questions engaging and practical`
  }

  if (writingFrameMode) {
    maxTokens = 3000
    systemPrompt = `You are an expert UK primary school teacher creating Twinkl-style literacy writing frame worksheets.
You must return ONLY valid JSON — no markdown, no explanation, no backticks.
The JSON must have this exact structure:
{
  "title": "Short engaging title e.g. The Haunted Manor",
  "subject": "English",
  "yearGroup": "Year 4",
  "skill": "e.g. Uplevelling sentences using fronted adverbials and subordinating conjunctions",
  "themeColour": "#7C3AED",
  "baseSentence": "A simple base sentence e.g. The house stood in the woods.",
  "contextPrompt": "One sentence of context/stimulus e.g. Use this scene to help inspire your writing.",
  "tiers": [
    {
      "level": "Support",
      "emoji": "🔴",
      "colour": "#DC2626",
      "steps": [
        {
          "number": 1,
          "instruction": "Rewrite the sentence adding adjectives to describe the noun.",
          "scaffold": "The ___________, ___________ house stood in the ___________ woods.",
          "lines": 3
        },
        {
          "number": 2,
          "instruction": "Add a fronted adverbial to the start of your sentence.",
          "scaffold": "___________, the ___________ house stood in the woods.",
          "lines": 3
        },
        {
          "number": 3,
          "instruction": "Choose a conjunction from the box to add a subordinate clause.",
          "scaffold": null,
          "lines": 4
        }
      ],
      "conjunctions": ["after", "although", "as", "because", "before", "if", "since", "until", "when", "while"],
      "wordBank": ["ancient", "crumbling", "eerie", "mysterious", "towering", "shadowy", "gloomy", "twisted"],
      "challenge": null
    },
    {
      "level": "Core",
      "emoji": "🟡",
      "colour": "#D97706",
      "steps": [
        {
          "number": 1,
          "instruction": "Rewrite the sentence with expanded noun phrases.",
          "scaffold": null,
          "lines": 3
        },
        {
          "number": 2,
          "instruction": "Rewrite your sentence starting with a fronted adverbial.",
          "scaffold": null,
          "lines": 3
        },
        {
          "number": 3,
          "instruction": "Add a subordinate clause using a subordinating conjunction.",
          "scaffold": null,
          "lines": 4
        }
      ],
      "conjunctions": ["after", "although", "as", "because", "before", "if", "since", "until", "when", "while"],
      "wordBank": null,
      "challenge": "Can you write a further sentence continuing the scene, using at least two of the features above?"
    },
    {
      "level": "Extension",
      "emoji": "🟢",
      "colour": "#16A34A",
      "steps": [
        {
          "number": 1,
          "instruction": "Improve the sentence using noun phrases, precise vocabulary and varied sentence structure.",
          "scaffold": null,
          "lines": 4
        },
        {
          "number": 2,
          "instruction": "Extend your writing to a short paragraph (3-4 sentences) using fronted adverbials and subordinating conjunctions throughout.",
          "scaffold": null,
          "lines": 6
        }
      ],
      "conjunctions": ["after", "although", "as", "because", "before", "if", "since", "until", "when", "while"],
      "wordBank": null,
      "challenge": "Write a second paragraph continuing the scene. Use a variety of sentence structures and ambitious vocabulary."
    }
  ]
}
Rules:
- Support tier must have a word bank and sentence scaffolds with blanks
- Core tier has no scaffold but keeps the conjunction box
- Extension tier has fewer, more open-ended steps requiring sustained writing
- The base sentence should be simple and directly related to the topic/book
- themeColour should match the mood: purple for mysterious, green for nature, blue for adventure, orange for exciting, pink for creative
- Align grammar objectives to UK National Curriculum for the year group`
  }

  if (exitTicketMode) {
    maxTokens = 3000
    systemPrompt = `You are an expert UK primary school teacher creating print-ready exit ticket assessment cards.
You must return ONLY valid JSON — no markdown, no explanation, no backticks.
The JSON must have this exact structure:
{
  "title": "Short lesson title e.g. Fractions of Amounts",
  "subject": "Maths",
  "yearGroup": "Year 4",
  "tiers": [
    {
      "level": "Support",
      "colour": "#DC2626",
      "prompts": [
        { "text": "Today I learned...", "lines": 3 },
        { "text": "One thing I found tricky was...", "lines": 3 },
        { "text": "Tomorrow I need help with...", "lines": 2 }
      ]
    },
    {
      "level": "Core",
      "colour": "#D97706",
      "prompts": [
        { "text": "The most important thing I learned today was...", "lines": 3 },
        { "text": "I can show my understanding by...", "lines": 3 },
        { "text": "An example of this is...", "lines": 3 }
      ]
    },
    {
      "level": "Extension",
      "colour": "#16A34A",
      "prompts": [
        { "text": "I can explain today's learning in my own words:", "lines": 3 },
        { "text": "I could apply this to a real-life situation by...", "lines": 3 },
        { "text": "A question I still have is...", "lines": 2 }
      ]
    }
  ]
}
Rules:
- Each tier has exactly 3 prompts
- Prompts must be directly related to the lesson topic
- Support prompts are simple retrieval and reflection
- Core prompts require some explanation and understanding
- Extension prompts require application, analysis or deeper thinking
- lines is 2 or 3 (space for writing) — use 3 for prompts expecting fuller answers, 2 for short ones
- CRITICAL: prompt text must be a complete sentence or phrase under 12 words. Never truncate or cut off mid-sentence. If a prompt needs more context, shorten it by removing detail rather than writing a longer sentence.`
  }

  if (vocabCardsMode) {
    maxTokens = 2500
    systemPrompt = `You are an expert UK primary school teacher creating print-ready vocabulary flashcards.
You must return ONLY valid JSON — no markdown, no explanation, no backticks.
The JSON must have this exact structure:
{
  "title": "Short title e.g. Materials Vocabulary",
  "subject": "Science",
  "yearGroup": "Year 3",
  "cards": [
    { "term": "magnetic", "definition": "Able to attract iron or steel objects.", "colour": "#D97706" },
    { "term": "transparent", "definition": "Allows light to pass through completely, so you can see through it.", "colour": "#2563EB" },
    { "term": "insoluble", "definition": "Does not dissolve in water.", "colour": "#16A34A" }
  ]
}
Rules:
- Generate exactly 12 vocabulary cards relevant to the topic
- term: a single key word or short phrase (1-3 words)
- definition: one clear, simple sentence a primary pupil can understand
- colour: pick from this palette and cycle through them: #D97706 (amber), #2563EB (blue), #16A34A (green), #DC2626 (red), #7C3AED (purple), #DB2777 (pink)
- Align vocabulary to UK National Curriculum for the year group and subject`
  }

  if (knowledgeOrgMode) {
    maxTokens = 3000
    systemPrompt = `You are an expert UK primary school teacher creating a print-ready knowledge organiser.
You must return ONLY valid JSON — no markdown, no explanation, no backticks.
The JSON must have this exact structure:
{
  "title": "Topic title e.g. The Romans",
  "subject": "History",
  "yearGroup": "Year 4",
  "panels": [
    { "heading": "Key Facts", "type": "bullets", "colour": "#2563EB", "items": ["Fact 1", "Fact 2", "Fact 3", "Fact 4", "Fact 5", "Fact 6"] },
    { "heading": "Key Vocabulary", "type": "terms", "colour": "#16A34A", "items": [{ "term": "Empire", "definition": "A group of countries ruled by one leader." }] },
    { "heading": "Key People", "type": "terms", "colour": "#7C3AED", "items": [{ "term": "Julius Caesar", "definition": "Roman general who invaded Britain in 55BC." }] },
    { "heading": "Key Dates", "type": "bullets", "colour": "#DC2626", "items": ["43AD - Romans invade Britain", "410AD - Romans leave Britain"] }
  ]
}
Rules:
- Generate exactly 4 panels
- "type": "bullets" for simple fact lists (6-8 items, each a short sentence or phrase)
- "type": "terms" for term+definition pairs (5-6 items)
- Panel headings should suit the subject: History often uses Key Facts, Key Vocabulary, Key People, Key Dates. Science often uses Key Facts, Key Vocabulary, Key Processes, Did You Know. Geography often uses Key Facts, Key Vocabulary, Key Places, Did You Know.
- colour: pick 4 distinct colours from: #2563EB (blue), #16A34A (green), #7C3AED (purple), #DC2626 (red), #D97706 (amber), #DB2777 (pink)
- Content must be accurate and aligned to UK National Curriculum for the year group
- Keep bullet items concise (under 15 words) and definitions under 20 words`
  }

  if (comprehensionMode) {
    maxTokens = 4000
    systemPrompt = `You are an expert UK primary school teacher creating print-ready differentiated reading comprehension worksheets.
You must return ONLY valid JSON — no markdown, no explanation, no backticks.
The JSON must have this exact structure:
{
  "title": "Short engaging title e.g. The Lost Penguin",
  "subject": "English",
  "yearGroup": "Year 3",
  "skill": "Reading comprehension — retrieval and inference",
  "tiers": [
    {
      "level": "Support",
      "colour": "#DC2626",
      "emoji": "Red",
      "passage": "Short simple passage 4-6 sentences. Simple vocabulary. Short sentences. Large concepts broken down.",
      "questions": [
        { "type": "retrieval", "q": "Simple retrieval question about the text?", "lines": 2 },
        { "type": "retrieval", "q": "Another retrieval question?", "lines": 2 },
        { "type": "retrieval", "q": "Third retrieval question?", "lines": 2 }
      ]
    },
    {
      "level": "Core",
      "colour": "#D97706",
      "emoji": "Amber",
      "passage": "Medium passage 7-10 sentences. Age-appropriate vocabulary. Mix of short and longer sentences.",
      "questions": [
        { "type": "retrieval", "q": "Retrieval question?", "lines": 2 },
        { "type": "retrieval", "q": "Retrieval question?", "lines": 2 },
        { "type": "inference", "q": "Inference question requiring reading between the lines?", "lines": 3 },
        { "type": "multiple_choice", "q": "Multiple choice question?", "options": ["Option A", "Option B", "Option C", "Option D"] },
        { "type": "inference", "q": "Explain question?", "lines": 3 }
      ]
    },
    {
      "level": "Extension",
      "colour": "#16A34A",
      "emoji": "Green",
      "passage": "Longer richer passage 10-14 sentences. Ambitious vocabulary. Varied sentence structures. Figurative language.",
      "questions": [
        { "type": "retrieval", "q": "Retrieval question?", "lines": 2 },
        { "type": "multiple_choice", "q": "Multiple choice question?", "options": ["Option A", "Option B", "Option C", "Option D"] },
        { "type": "inference", "q": "Inference question?", "lines": 3 },
        { "type": "inference", "q": "Deeper inference question?", "lines": 3 },
        { "type": "multiple_choice", "q": "Another multiple choice?", "options": ["Option A", "Option B", "Option C", "Option D"] },
        { "type": "extended", "q": "Extended response question requiring a full paragraph answer?", "lines": 5 },
        { "type": "vocabulary", "q": "Find the word in the passage that means [synonym]. What does it tell us?", "lines": 2 }
      ]
    }
  ]
}
Rules:
- The passage must be completely original, not copied from any published work
- Each tier's passage covers the same topic/story but at different complexity levels
- Support passage uses only simple common words, short sentences, basic concepts
- Core passage uses age-appropriate vocabulary, some inference opportunities
- Extension passage uses rich vocabulary, figurative language, complex sentences
- Questions must be directly answerable from the passage provided in that tier
- multiple_choice questions always have exactly 4 options, only one correct
- lines indicates how many writing lines to draw (2 = short answer, 3 = medium, 5 = extended)
- Align reading level to UK National Curriculum year group`
  }

  if (assistantMode) {
    try {
      const messages = (history || [{ role: 'user', content: prompt }])
        .filter(m => m.role !== 'system')
        .slice(-10)  // only last 10 messages to cap token cost
      const body = {
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system: clientSystemPrompt || 'You are a helpful UK primary school teaching assistant.',
        messages,
      }
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey.trim(), 'anthropic-version': '2023-06-01' },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'API error' })
      const reply = data.content.map(b => b.text || '').join('')
      return res.status(200).json({ reply })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  try {
    const body = {
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }
    if (systemPrompt) body.system = systemPrompt

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('Anthropic API error:', data.error?.message, data.error?.type)
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' })
    }

    const text = data.content.map(b => b.text || '').join('')
    const clean = text.replace(/```json|```/g, '').trim()
    let parsed
    try {
      parsed = JSON.parse(clean)
    } catch(parseErr) {
      console.error('JSON parse error:', parseErr.message, 'Raw text:', clean.slice(0, 500))
      return res.status(500).json({ error: `JSON parse failed: ${parseErr.message}` })
    }

    if (worksheetMode) return res.status(200).json({ worksheet: parsed })
    if (writingFrameMode) return res.status(200).json({ writingFrame: parsed })
    if (comprehensionMode) return res.status(200).json({ comprehension: parsed })
    if (exitTicketMode) return res.status(200).json({ exitTicket: parsed })
    if (vocabCardsMode) return res.status(200).json({ vocabCards: parsed })
    if (knowledgeOrgMode) return res.status(200).json({ knowledgeOrg: parsed })
    if (raw) return res.status(200).json({ result: parsed })
    return res.status(200).json({ books: parsed })
  } catch (err) {
    console.error('recommend.js error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
