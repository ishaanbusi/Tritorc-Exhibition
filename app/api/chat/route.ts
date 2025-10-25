import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI only if API key exists
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!openai) {
      return NextResponse.json(
        { 
          error: 'AI chat is currently unavailable. Please contact our sales team for product information.',
          unavailable: true 
        },
        { status: 503 }
      );
    }

    const { messages, productContext } = await req.json();

    // Validate required data
    if (!messages || !productContext) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a helpful product specialist for ${productContext.name}. 

Product Specifications:
${(productContext.specs as { label: string; value: unknown; unit?: string }[])
  ?.map((s) => `- ${s.label}: ${s.value} ${s.unit || ''}`)
  .join('\n') || 'No specifications available'}

Key Features:
${(productContext.features || []).join('\n') || 'No features listed'}

Answer questions accurately and concisely. If you don't know something, suggest contacting the sales team.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    // Access the first choice, then the message
    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: responseContent,
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    
    // More specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to get AI response: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}