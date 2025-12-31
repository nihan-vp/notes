
import { GoogleGenAI, Type } from "@google/genai";
import { AIAction } from "../types";

function getGenAIClient(): GoogleGenAI {
  const apiKey = (process.env.API_KEY || process.env.GEMINI_API_KEY) as string | undefined;
  if (!apiKey) {
    throw new Error("Missing Gemini API key. Set GEMINI_API_KEY (GitHub Pages: repo secret) and redeploy.");
  }
  return new GoogleGenAI({ apiKey });
}

export async function processWithAI(action: AIAction, content: string): Promise<string | string[]> {
  const model = 'gemini-3-flash-preview';
  const genAI = getGenAIClient();

  const prompts = {
    [AIAction.SUMMARIZE]: `Summarize the following note into a single, concise paragraph that captures the key points. Content: ${content}`,
    [AIAction.IMPROVE]: `Rewrite the following note to be more professional, clear, and organized while retaining all original information. Content: ${content}`,
    [AIAction.EXTRACT_TODOS]: `Identify all actionable tasks or "to-do" items within the following text. Return them as a clean list of strings. Text: ${content}`,
    [AIAction.SUGGEST_TAGS]: `Suggest 3-5 relevant one-word tags for this content. Text: ${content}`
  };

  try {
    if (action === AIAction.EXTRACT_TODOS) {
      const response = await genAI.models.generateContent({
        model,
        contents: prompts[action],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    }

    const response = await genAI.models.generateContent({
      model,
      contents: prompts[action]
    });

    return response.text?.trim() || "AI was unable to process this content.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to reach AI service. Please check your connection.");
  }
}
