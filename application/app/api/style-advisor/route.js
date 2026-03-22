import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { form, photoBase64, catalog } = await req.json();
    const { gender, age, height, weight, bodyType, skinTone, stylePrefs, budget } = form;

    const textPrompt = `You are an expert fashion stylist and personal shopping advisor. Based on the user's body profile and our product catalog, give highly personalized clothing advice.

USER PROFILE:
- Gender: ${gender}
- Age: ${age || "Not specified"}
- Height: ${height}cm
- Weight: ${weight}kg
- Body Type: ${bodyType}
- Skin Tone: ${skinTone}
- Style Preferences: ${stylePrefs.join(", ")}
- Budget: ${budget === "budget" ? "Under $150" : budget === "mid" ? "$150–$300" : "$300+"}

OUR PRODUCT CATALOG:
${catalog}

Please respond ONLY with a valid JSON object (no markdown, no code fences) in exactly this structure:
{
  "size": "Recommended clothing size with explanation",
  "styles": "2-3 sentences on which styles suit their body type and why",
  "colors": "Specific colors that complement their skin tone with brief reasoning",
  "fitAdvice": "Specific fit advice based on their body type",
  "productSuggestions": [
    "Product name from catalog — why it suits them",
    "Product name from catalog — why it suits them",
    "Product name from catalog — why it suits them"
  ],
  "extraTip": "One golden styling tip personalized to their profile"
}

Only suggest products that exist in the catalog. Be specific, warm, and encouraging.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: textPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Groq API error:", err);
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";

    if (!raw) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
    }

    let parsed;
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch (e) {
      console.error("JSON parse failed:", raw);
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    return NextResponse.json(parsed);

  } catch (err) {
    console.error("Style advisor error:", err.message);
    return NextResponse.json({ error: "Failed to generate style advice" }, { status: 500 });
  }
}