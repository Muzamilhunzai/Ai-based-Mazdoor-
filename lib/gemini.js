import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function parseQuery(query, location = '') {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `You are an AI assistant for "Mazdoor Market", a Pakistani labor marketplace.
Parse the user query and extract structured information.

User Query: "${query}"
User Location: "${location}"

Respond ONLY in valid JSON:
{
  "skill": "extracted skill or null",
  "location": "extracted location or null",
  "urgency": "urgent|normal|low",
  "budgetHint": number or null,
  "requirements": ["req1", "req2"],
  "confidence": 0-1
}

Pakistani labor terms mapping:
- پلمبر, plumber, leak, pipe, tap = plumber
- الیکٹریشن, electrician, wiring, light, bijli = electrician
- بڑھئی, carpenter, wood, furniture, door = carpenter
- پینٹر, painter, paint, color, wall = painter
- ڈرائیور, driver, drive, car, van = driver
- مالی, gardener, garden, plants = gardener
- صاف کرنے والا, cleaner, safai, cleaning = cleaner
- باورچی, cook, chef, cooking, food = cook
- نائی, barber, haircut, shave = barber
- ٹیکنیشن, mobile, repair, computer = tech_repair
- میکینک, mechanic, bike, car_repair = mechanic
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Gemini parse error:', error);
  }
  
  return null;
}

export async function generateResponse(context, query) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `You are Mazdoor AI, a helpful assistant for a Pakistani labor marketplace.
Context: ${context}
User: ${query}

Respond in a friendly, helpful manner. If the user speaks Urdu, respond in Urdu.
Keep responses concise and actionable.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    return "I'm sorry, I couldn't process that. Please try again.";
  }
}