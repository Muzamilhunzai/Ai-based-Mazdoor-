// app/api/ai/bio/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { name, skill, experience, location } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "API Key missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a professional profile writer for a labor marketplace in Pakistan.
Create a short, professional, and trustworthy bio for a worker with these details:
Name: ${name}
Skill: ${skill}
Experience: ${experience} years
Location: ${location}

Provide the bio in two parts:
1. English Bio (professional and inviting)
2. Urdu Bio (simple, respectful, and clear)

Return ONLY valid JSON:
{
  "english": "...",
  "urdu": "..."
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

    return Response.json({ success: true, bio: parsed });
  } catch (error) {
    console.error("AI Bio error:", error);
    return Response.json({ success: false, error: "Failed to generate bio" }, { status: 500 });
  }
}
