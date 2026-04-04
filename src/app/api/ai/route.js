import { NextResponse } from "next/server";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "your-openai-api-key-here") {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Set OPENAI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      messages = [],
      systemPrompt = "",
      model = "gpt-4o-mini",
      temperature = 0.7,
      maxTokens = 1024,
      context = {},
    } = body;

    // Build the full messages array with system prompt
    const fullMessages = [];

    if (systemPrompt) {
      fullMessages.push({ role: "system", content: systemPrompt });
    }

    // Inject context as a system message if provided
    if (context && Object.keys(context).length > 0) {
      fullMessages.push({
        role: "system",
        content: `Current context:\n${JSON.stringify(context, null, 2)}`,
      });
    }

    // Add conversation messages
    for (const msg of messages) {
      fullMessages.push({
        role: msg.role === "ai" ? "assistant" : msg.role,
        content: msg.content || msg.text || "",
      });
    }

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: fullMessages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", err);
      return NextResponse.json(
        { error: err.error?.message || `OpenAI API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";
    const usage = data.usage || {};

    return NextResponse.json({
      reply,
      model: data.model,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      },
    });
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
