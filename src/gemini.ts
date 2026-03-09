import { GoogleGenerativeAI } from "@google/generative-ai";

// VITE_ алдына қосу міндетті
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function askGemini(message: string) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Сен Қазақстан Республикасының заңнамасына негізделген AI заң консультантысың."
  });
  
  const result = await model.generateContent(message);
  return result.response.text();
}
