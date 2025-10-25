import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
const { messages, productContext } = await req.json();

const systemPrompt = `You are a helpful product specialist for ${productContext.name}. 

Product Specifications:
${(productContext.specs as { label: string; value: unknown; unit?: string }[]).map((s) => `- ${s.label}: ${s.value} ${s.unit || ''}`).join('\n')}

Key Features:
${(productContext.features || []).join('\n')}

Answer questions accurately and concisely. If you don't know something, suggest contacting the sales team.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    // FIX: Access the first choice, then the message
    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}