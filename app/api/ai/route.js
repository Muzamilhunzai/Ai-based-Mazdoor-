// app/api/ai/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MOCK_WORKERS } from "@/lib/mockData";

export async function POST(req) {
  try {
    const { input, location: userLocation } = await req.json();
    if (!input) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return Response.json({ error: "API Key missing" }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // This prompt tells Gemini to use its "General Knowledge" to match the user's problem
    // to one of our available categories. No more hardcoded rules!
    const prompt = `You are the Brain of "Mazdoor Market". Your job is to understand any problem a user describes and match it to a professional category.

User Query: "${input}"

AVAILABLE CATEGORIES:
- plumber: For anything related to water, pipes, bathrooms, tanks, gas pipes, and sewage.
- electrician: For anything involving wires, short circuits, fans, lights, UPS, and electrical appliances.
- carpenter: For wood work, doors, locks, sofas, cabinets, and furniture.
- painter: For wall painting, polish, whitewash, and home decoration.
- driver: For personal driving, car delivery, or long trips.
- gardener: For plants, lawn mowing, and landscaping.
- cleaner: For home cleaning, deep cleaning, and office dusting.
- cook: For domestic cooking, catering, or making specific dishes.
- barber: For haircuts and grooming at home.
- tech_repair: For mobile, laptop, and computer software/hardware.
- mechanic: For car, bike, and engine repairs.

Return ONLY valid JSON:
{
  "category": "one of the AVAILABLE CATEGORIES or null if no match",
  "reasoning": "Briefly explain why this category matches the request",
  "location": "extracted city name or null",
  "preference": "cheap|premium|best_rated|none"
}

INSTRUCTIONS: 
1. Use your general knowledge. If a user says "my AC is not cooling", that is an electrician or mechanic task. 
2. If they say "gutter is blocked", that is a plumber task.
3. BE SPECIFIC. Only return a category if you are sure. If the user is just saying hi, return null.`;

    let aiParsed;
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanText = text.replace(/```json|```/g, "").trim();
      aiParsed = JSON.parse(cleanText);
    } catch (err) {
      console.error("AI Parse Error:", err);
      aiParsed = { category: null, location: null, preference: "none" };
    }

    let workers = [...MOCK_WORKERS];

    // STRICT MATCHING: If AI found a category, we ONLY show that category.
    if (aiParsed.category && aiParsed.category !== "null") {
      workers = workers.filter(w => w.skill.toLowerCase() === aiParsed.category.toLowerCase());
    } else {
      // If the AI couldn't find a logical match, we show nothing to keep results relevant.
      return Response.json({ 
        success: true, 
        parsed: aiParsed, 
        workers: [], 
        message: "I couldn't figure out which type of worker you need. Please be more specific!",
        source: "ai_universal_matching" 
      });
    }

    // 3. Location Filtering
    const targetLocation = aiParsed.location || userLocation;
    if (targetLocation && targetLocation !== 'Unknown') {
      const locLower = targetLocation.toLowerCase();
      const cityMatches = workers.filter(w => 
        w.location.toLowerCase().includes(locLower) || 
        locLower.includes(w.location.toLowerCase())
      );
      if (cityMatches.length > 0) workers = cityMatches;
    }

    // 4. Ranking
    if (aiParsed.preference === "cheap") {
      workers.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (aiParsed.preference === "best_rated") {
      workers.sort((a, b) => b.rating - a.rating);
    } else {
      workers.sort((a, b) => b.rating - a.rating); // Default to quality
    }

    return Response.json({ 
      success: true, 
      parsed: aiParsed, 
      workers: workers.slice(0, 10),
      source: "ai_universal_matching" 
    });

  } catch (error) {
    console.error("AI API error:", error);
    return Response.json({ success: false, error: "Universal AI matching failed" }, { status: 500 });
  }
}