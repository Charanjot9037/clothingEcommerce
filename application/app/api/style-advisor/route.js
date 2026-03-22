// app/api/style-advisor/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { form, photoBase64, catalog } = await req.json();

    const { gender, age, height, weight, bodyType, skinTone, stylePrefs, budget } = form;

    // Build the user message content
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
  "size": "Recommended clothing size with explanation (e.g. Medium — based on your height and weight, a Medium will give you a comfortable fit)",
  "styles": "2-3 sentences on which styles from their preferences suit their body type and why",
  "colors": "Specific colors and color families that complement their skin tone, with brief reasoning",
  "fitAdvice": "Specific fit advice — what to look for (slim, relaxed, oversized, tailored etc.) based on their body type",
  "productSuggestions": [
    "Product name from catalog — why it suits them",
    "Product name from catalog — why it suits them",
    "Product name from catalog — why it suits them"
  ],
  "extraTip": "One golden styling tip personalized to their profile"
}

Only suggest products that exist in the catalog. Be specific, warm, and encouraging.`;

    // Build message content — include image if provided
    const messageContent = photoBase64
      ? [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: photoBase64,
            },
          },
          { type: "text", text: textPrompt + "\n\nAlso use the uploaded photo to refine your color and style recommendations." },
        ]
      : [{ type: "text", text: textPrompt }];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: messageContent }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Anthropic API error:", err);
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.content.map((b) => b.text || "").join("");

    // Strip any accidental markdown fences
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Style advisor error:", err);
    return NextResponse.json({ error: "Failed to generate style advice" }, { status: 500 });
  }
}
