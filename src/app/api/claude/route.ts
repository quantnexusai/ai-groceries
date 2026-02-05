import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPTS: Record<string, string> = {
  recommendation:
    'You are an AI grocery shopping assistant. Based on the customer\'s cart and purchase history, suggest complementary products. Keep suggestions practical, seasonal, and health-conscious.',
  substitution:
    'You are a grocery substitution expert. When items are out of stock, suggest the best alternatives considering quality, price, and dietary needs.',
  inventory:
    'You are a predictive inventory analyst for a grocery store. Analyze stock levels and predict which items might run out. Suggest reorder quantities.',
  pricing:
    'You are a dynamic pricing analyst for a grocery store. Based on inventory levels, expiry dates, and market conditions, suggest optimal sale prices.',
  description:
    'You are a food writer. Write warm, appetizing product descriptions for grocery items. Highlight origin, quality, and best uses. Keep it under 100 words.',
  delivery_slot:
    'You are a delivery logistics optimizer. Based on order volume, location, and time of day, recommend the optimal delivery window.',
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Please configure the ANTHROPIC_API_KEY environment variable to enable AI features.' },
        { status: 400 }
      )
    }

    const { context, message, data } = await request.json()

    const systemPrompt = SYSTEM_PROMPTS[context]
    if (!systemPrompt) {
      return NextResponse.json(
        { error: `Unknown context: ${context}. Valid contexts: ${Object.keys(SYSTEM_PROMPTS).join(', ')}` },
        { status: 400 }
      )
    }

    const userMessage = data
      ? `${message}\n\nAdditional context:\n${JSON.stringify(data, null, 2)}`
      : message

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    const responseText = textBlock ? textBlock.text : ''

    return NextResponse.json({ response: responseText })
  } catch (error) {
    console.error('Claude API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    )
  }
}
