import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "OpenRouter API Key missing" }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://aegis-command.vercel.app",
        "X-Title": "Aegis Command Center",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are an emergency response AI. Return concise plain text ONLY. No markdown, no bolding (**), no hashtags (#), no bullet points, no symbols. Maximum 3-5 short sentences. Focus on summary and action insight." 
          },
          { role: "user", content: prompt }
        ]
      }),
    });

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "AI Analysis unavailable.";
    
    // Server-side secondary cleanup
    const cleanText = rawText
      .replace(/[*#`]/g, "")
      .replace(/\n+/g, " ")
      .trim();

    return NextResponse.json({ text: cleanText });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: "Failed to generate tactical response" }, { status: 500 });
  }
}
