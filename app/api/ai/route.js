// app/api/ai/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { input } = await req.json();
    if (!input) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // No API key → return fallback parsed data so the client can still try local search
      return Response.json({
        parsed: { skill: input, location: "", urgency: "normal", translated: input },
        source: "fallback",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Extract from the user request (in English or Urdu): skill (e.g., electrician, plumber, painter), location (city name), urgency (normal/urgent), and a translated English query. Return ONLY a valid JSON object: {"skill":"...","location":"...","urgency":"...","translated":"..."}

User request: "${input}"`;

    let parsed;
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch (err) {
      // Gemini parsing failed → fallback
      parsed = { skill: input, location: "", urgency: "normal", translated: input };
    }

    return Response.json({ parsed, source: "ai" });
  } catch (error) {
    console.error("AI API error:", error);
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}