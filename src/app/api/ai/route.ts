import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { incident } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ text: null });
    }

    const prompt = `
You are an AI emergency response system.

Analyze the incident:

Title: ${incident.title}
Description: ${incident.description}
Severity: ${incident.severity}
Location: ${incident.location}

Instructions:

* Respond in plain text only
* No markdown, no symbols
* Max 4 sentences
* Be specific to this incident
* Do not give generic answers. Response must depend on incident type.

Output:

* What is happening
* Risk level
* Immediate action
`;

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
        messages: [{ role: "user", content: prompt }]
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || null;

    return NextResponse.json({ text });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ text: null });
  }
}
