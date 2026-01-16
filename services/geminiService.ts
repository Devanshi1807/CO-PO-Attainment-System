
import { GoogleGenAI } from "@google/genai";

// Always use process.env.API_KEY directly when initializing the GoogleGenAI client instance.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCourseOutcomes = async (courseName: string, courseDescription: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As an OBE expert, generate 5 specific Course Outcomes (COs) for a course named "${courseName}" with the following description: "${courseDescription}". Format as a JSON array of objects with "code" (CO1, CO2, etc) and "description".`,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    // Access the .text property directly (not a method).
    const text = response.text || '[]';
    return JSON.parse(text.trim());
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};

export const suggestCoPoMapping = async (cos: any[], pos: any[]) => {
  const prompt = `Map these COs to these POs using articulation levels 0-3 (0: No correlation, 1: Low, 2: Medium, 3: High).
  COs: ${JSON.stringify(cos)}
  POs: ${JSON.stringify(pos)}
  Return a JSON array of mappings like { "coId": "co-id", "poId": "po-id", "level": 0-3 }. Ensure coId matches the exact id of the CO provided.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    const text = response.text || '[]';
    return JSON.parse(text.trim());
  } catch (e) {
    console.error("Failed to parse AI response for mapping", e);
    return [];
  }
};
