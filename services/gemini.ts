
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeLegalQuery = async (query: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a legal intake assistant for Lawyer Direct, a platform connecting people with lawyers across the US and Canada.

Analyze the following user query and extract:
1. **category**: The most relevant legal category (e.g., Family Law, Immigration, Criminal Defense, Contract Law, Real Estate, Personal Injury, Employment Law, Intellectual Property, Estate Planning, General Inquiry).
2. **state**: The US state or Canadian province referenced. If none is explicitly mentioned, infer it from contextual clues (city names, local laws, etc.). If it truly cannot be determined, use "Nationwide".
3. **urgency**: Low, Medium, or High based on time sensitivity, potential harm, or legal deadlines implied.
4. **shortSummary**: A concise, professional one-sentence summary of the legal issue.

IMPORTANT — If the query is gibberish, random characters, nonsensical, or not related to any legal matter, respond with:
- category: "Not Recognized"
- state: "Nationwide"
- urgency: "Low"
- shortSummary: "We couldn't identify a legal issue from your input. Please describe your situation in a few sentences so we can match you with the right lawyer."

Query: "${query}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Legal category, or 'Not Recognized' if query is gibberish/nonsensical" },
          state: { type: Type.STRING, description: "US state or Canadian province, or 'Nationwide' if undetermined" },
          urgency: { type: Type.STRING, description: "Low, Medium, or High", enum: ["Low", "Medium", "High"] },
          shortSummary: { type: Type.STRING, description: "One sentence summary of the issue." }
        },
        required: ["category", "state", "urgency", "shortSummary"]
      }
    }
  });

  const result = JSON.parse(response.text.trim());
  return result as AnalysisResult;
};
