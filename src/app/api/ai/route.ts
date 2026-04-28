// Backend AI Proxy with Coalescing and TTL Caching
const cache = new Map<string, { text: string; expires: number }>();
const inflight = new Map<string, Promise<string>>();

const TTL = 30_000; // 30s cache

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    // 1) Serve from cache if valid
    const hit = cache.get(prompt);
    if (hit && hit.expires > Date.now()) {
      console.log("Serving AI response from backend TTL cache");
      return Response.json({ text: hit.text });
    }

    // 2) Coalesce identical in-flight requests
    if (inflight.has(prompt)) {
      console.log("Coalescing in-flight request for same prompt");
      const text = await inflight.get(prompt)!;
      return Response.json({ text });
    }

    // 3) Create a single upstream call
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Missing API key on server" }, { status: 500 });
    }

    const p = (async () => {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (res.status === 429) {
          return "AI busy. Using cached intelligence.";
        }

        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data));

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Empty AI response";

        // Update cache
        cache.set(prompt, { text, expires: Date.now() + TTL });
        return text;
      } catch (err) {
        console.error("Upstream AI call failed:", err);
        return "AI analysis unavailable. Using manual protocols.";
      }
    })();

    inflight.set(prompt, p);

    try {
      const text = await p;
      return Response.json({ text });
    } finally {
      // Cleanup in-flight map after completion
      inflight.delete(prompt);
    }

  } catch (err) {
    console.error("Server AI error:", err);
    return Response.json({ error: "Internal AI server error" }, { status: 500 });
  }
}
