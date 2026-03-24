import { config } from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'
import type { Plugin } from 'vite'

config() // Load .env at plugin init time

export function apiPlugin(): Plugin {
  return {
    name: 'dart-away-api',
    configureServer(server) {
      server.middlewares.use('/api/generate', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        for await (const chunk of req) {
          body += chunk
        }

        try {
          const { country, temperature } = JSON.parse(body)

          if (!country) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'country is required' }))
            return
          }

          const apiKey = process.env.ANTHROPIC_API_KEY
          if (!apiKey) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }))
            return
          }

          const client = new Anthropic({ apiKey })

          const message = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 300,
            messages: [
              {
                role: 'user',
                content: `You are a witty travel writer. For the country: ${country} (current weather: ${temperature || 'unknown'}), respond in JSON with exactly two fields:
- funFact: A single surprising, fun, and true fact about this country (1-2 sentences, start with "Did you know?")
- slackMessage: A funny, lighthearted Slack message to send to your manager asking for holidays in this country. Be creative, reference the fun fact or the weather, use emojis. Keep it under 3 sentences. Start with "Hey boss,"

Respond with ONLY valid JSON, no markdown fences.`,
              },
            ],
          })

          const text = message.content[0].type === 'text' ? message.content[0].text : ''
          const parsed = JSON.parse(text)

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(parsed))
        } catch (err) {
          console.error('API error:', err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Failed to generate content' }))
        }
      })
    },
  }
}
