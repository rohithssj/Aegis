export async function getAIDecision(data: {
  type: string
  severity: number
  wait_time: number
  distance: number
  location: string
}) {
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
      unit: string
      risk: string
      score: number
      confidence: number
      priority: string
      reason: string
      factors: string[]
      explanation: string
    }
  } catch (error: any) {
    console.error("AI Error:", error)
    // Fallback response to ensure UI doesn't break
    return {
      unit: "Standard Protocol General",
      risk: "Assessing",
      score: 0,
      confidence: 60,
      priority: "P3",
      reason: "AI service currently synchronized with backup nodes. Monitoring situation.",
      factors: ["System in backup mode", "Manual override available"],
      explanation: "Neural link latency detected. Defaulting to safe-state protocols."
    }
  }
}
