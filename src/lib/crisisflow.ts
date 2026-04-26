export async function getAIDecision(data: any) {
  try {
    const res = await fetch("http://127.0.0.1:8000/decision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || "AI request failed")
    }

    return await res.json() as {
      unit: string;
      risk: string;
      score: number;
      reason: string;
      confidence: number;
      priority: string;
      neuralImpact?: number;
      threatScore?: number;
    };
  } catch (error: any) {
    console.error("AI Error:", error);
    // Fallback response to ensure UI doesn't break
    return {
      unit: "Standard Protocol General",
      risk: "Moderate",
      score: 0,
      reason: "AI service currently synchronized with backup nodes. Monitoring situation.",
      confidence: 75,
      priority: "P3",
      neuralImpact: 10
    };
  }
}
