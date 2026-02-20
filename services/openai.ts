import { AnalysisResult } from "../types";

export const analyzeLegalQuery = async (query: string): Promise<AnalysisResult> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5.2",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: `You are a legal intake assistant for Lawyer Direct, a platform connecting people with lawyers across the US and Canada.

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

Return ONLY valid JSON with these four fields: category, state, urgency, shortSummary.

Query: "${query}"`,
        },
      ],
      max_completion_tokens: 300,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content.trim());
  return result as AnalysisResult;
};
