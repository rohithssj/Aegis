/**
 * Stateless Gemini AI caller. 
 * Orchestration and deduplication are handled at the component level.
 */
export const callGemini = async (prompt: string) => {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("AI API Error:", data);
      return "AI analysis unavailable.";
    }

    return data.text || "Empty AI response";
  } catch (err) {
    console.error("AI communication error:", err);
    return "AI connection failure.";
  }
};
